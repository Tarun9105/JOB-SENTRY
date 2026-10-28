import {
  JobCheckInput,
  JobCheckOutput,
  JobAuditRecord,
  AppStage,
  JobCheckInputSchema,
} from '../../shared/contracts';

const STORAGE_FALLBACK_KEY = 'jobsentry_checks_audit_v2';
const RENDER_URL_KEY = 'jobsentry_render_url';

/**
 * Dynamically resolves the active Backend API base URL:
 * 1. User manual override stored in browser localStorage
 * 2. Static Vite build-time environment variable (import.meta.env.VITE_API_URL)
 * 3. Intelligent fallback for Cloudflare Pages (*.pages.dev)
 */
export function getApiBaseUrl(): string {
  // 1. Check user override in localStorage
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(RENDER_URL_KEY);
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }

  // 2. Exact static property access for Vite compiler replacement
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // 3. Fallback for Cloudflare Pages if variable wasn't injected at build time
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith('pages.dev')
  ) {
    return 'https://jobsentry-api.onrender.com';
  }

  return '';
}

export function setCustomApiUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (!url || !url.trim()) {
      localStorage.removeItem(RENDER_URL_KEY);
    } else {
      localStorage.setItem(RENDER_URL_KEY, url.trim().replace(/\/+$/, ''));
    }
  }
}

export const API_BASE = getApiBaseUrl();

/**
 * Validate input using shared Zod schema
 */
export function validateClientInput(data: Partial<JobCheckInput>): {
  isValid: boolean;
  error?: string;
  field?: string;
} {
  const result = JobCheckInputSchema.safeParse(data);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return {
      isValid: false,
      error: firstIssue.message,
      field: firstIssue.path[0]?.toString() || 'jobText',
    };
  }
  return { isValid: true };
}

/**
 * Call the Express Backend API with zero-fallback tolerance
 */
export async function analyzeJobAPI(
  payload: JobCheckInput,
  options: {
    simulateOffline?: boolean;
    stage?: AppStage;
  } = {}
): Promise<{ output: JobCheckOutput; record: JobAuditRecord }> {
  const { simulateOffline = false, stage = 'production' } = options;

  if (simulateOffline) {
    throw new Error('Network connection failed: Express backend service is simulated offline (HTTP 503).');
  }

  const apiBase = getApiBaseUrl();
  const endpoint = `${apiBase}/api/analyze`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        stage,
      }),
    });
  } catch (netErr: any) {
    throw new Error(
      `Cannot connect to Render Backend (${apiBase || 'current domain'}). ` +
      `Please ensure your Render service is Live, or configure your Render URL in Demo Settings. (${netErr.message})`
    );
  }

  // Handle non-JSON or HTTP 405 (Cloudflare static route collision)
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (response.status === 405) {
      throw new Error(
        `Cloudflare returned HTTP 405 (Method Not Allowed). ` +
        `The frontend is sending API calls to Cloudflare instead of your Render backend. ` +
        `Click the Settings (sliders) icon in the navbar and enter your Render URL (e.g. https://your-service.onrender.com).`
      );
    }
    const textSnippet = await response.text();
    throw new Error(`Server returned HTTP ${response.status}: ${textSnippet.slice(0, 80)}`);
  }

  const body = await response.json();

  if (!response.ok) {
    const errorMsg = body?.error?.message || 'Server rejected the request.';
    const details = body?.error?.details
      ? body.error.details.map((d: any) => `${d.path}: ${d.message}`).join(', ')
      : '';
    throw new Error(details ? `${errorMsg} (${details})` : errorMsg);
  }

  // Sync to local browser storage backup
  try {
    const existing = getLocalHistory();
    const updated = [body.record, ...existing.filter((r: any) => r.id !== body.record.id)];
    localStorage.setItem(STORAGE_FALLBACK_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Storage sync notice:', err);
  }

  return {
    output: body.data,
    record: body.record,
  };
}

/**
 * Fetch check audit history from backend (with local fallback cache)
 */
export async function fetchHistoryAPI(): Promise<JobAuditRecord[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/history`);
    const contentType = res.headers.get('content-type') || '';

    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data.records)) {
        localStorage.setItem(STORAGE_FALLBACK_KEY, JSON.stringify(data.records));
        return data.records;
      }
    }
  } catch (err) {
    console.warn('Backend history fetch notice, using local cache:', err);
  }
  return getLocalHistory();
}

/**
 * Clear audit database on backend
 */
export async function clearHistoryAPI(): Promise<void> {
  try {
    const apiBase = getApiBaseUrl();
    await fetch(`${apiBase}/api/history`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Backend history delete failed:', err);
  }
  localStorage.removeItem(STORAGE_FALLBACK_KEY);
}

function getLocalHistory(): JobAuditRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_FALLBACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
