import {
  JobCheckInput,
  JobCheckOutput,
  JobAuditRecord,
  AppStage,
  JobCheckInputSchema,
} from '../../shared/contracts';

const STORAGE_FALLBACK_KEY = 'jobsentry_checks_audit_v2';
export const API_BASE = ((import.meta as any).env?.VITE_API_URL || '').replace(/\/+$/, '');

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

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      stage,
    }),
  });

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
    const updated = [body.record, ...existing.filter((r) => r.id !== body.record.id)];
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
    const res = await fetch(`${API_BASE}/api/history`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.records)) {
        localStorage.setItem(STORAGE_FALLBACK_KEY, JSON.stringify(data.records));
        return data.records;
      }
    }
  } catch (err) {
    console.warn('Backend history fetch unavailable, falling back to local cache', err);
  }
  return getLocalHistory();
}

/**
 * Clear audit database on backend
 */
export async function clearHistoryAPI(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/history`, { method: 'DELETE' });
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
