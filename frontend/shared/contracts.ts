import { z } from 'zod';

/**
 * JobSentry Enterprise Shared Contracts (Single Source of Truth)
 * Zero-fallback tolerance with dual casing support (camelCase domain <-> snake_case wire)
 */

export type AppStage = 'staging' | 'production';

// Strict RFC 5322 regex for email validation
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Salary validator allowing numeric strings or positive numbers
export const salaryStringSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (val === '') return true;
      const cleaned = val.replace(/[\$,,\s]/g, '');
      return !isNaN(Number(cleaned)) && Number(cleaned) >= 0;
    },
    { message: 'Salary must be a positive numeric value or left blank' }
  )
  .optional();

/**
 * Shared Input Schema (supports both camelCase and snake_case without fallback)
 */
export const JobCheckInputSchema = z
  .object({
    jobText: z.string().trim().min(10, 'Job description must be at least 10 characters').optional(),
    job_text: z.string().trim().min(10, 'Job description must be at least 10 characters').optional(),

    email: z
      .string()
      .trim()
      .transform((val) => (val === '' ? undefined : val))
      .pipe(z.string().regex(emailRegex, 'Please provide a valid email format').optional())
      .optional(),

    company: z.string().trim().max(120, 'Company name too long').optional(),

    salary: salaryStringSchema,

    stage: z.enum(['staging', 'production']).default('production'),
  })
  .refine((data) => Boolean(data.jobText || data.job_text), {
    message: 'Job text is required (supply either jobText or job_text)',
    path: ['jobText'],
  });

export type JobCheckInput = z.infer<typeof JobCheckInputSchema>;

/**
 * Canonical Internal Domain Request (Strict camelCase)
 */
export interface NormalizedJobRequest {
  jobText: string;
  email?: string;
  company?: string;
  salary?: string;
  stage: AppStage;
}

/**
 * Normalization helper
 */
export function normalizeJobRequest(raw: JobCheckInput): NormalizedJobRequest {
  const text = (raw.jobText || raw.job_text || '').trim();
  return {
    jobText: text,
    email: raw.email ? raw.email.trim() : undefined,
    company: raw.company ? raw.company.trim() : undefined,
    salary: raw.salary ? raw.salary.trim() : undefined,
    stage: raw.stage || 'production',
  };
}

/**
 * Risk Assessment Output Schemas
 */
export const RiskLevelSchema = z.enum(['Low', 'Medium', 'High']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const RiskFactorDetailSchema = z.object({
  id: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string(),
  description: z.string(),
});
export type RiskFactorDetail = z.infer<typeof RiskFactorDetailSchema>;

export const JobCheckOutputSchema = z.object({
  riskLevel: RiskLevelSchema,
  risk_level: RiskLevelSchema, // wire compatibility
  score: z.number().min(0).max(1),
  redFlags: z.array(z.string()),
  red_flags: z.array(z.string()), // wire compatibility
  advice: z.array(z.string()),
  factors: z.array(RiskFactorDetailSchema).optional(),
  modelType: z.enum(['hybrid-gemini-2.5-flash', 'hybrid-gemini-3.8-flash', 'deterministic-nlp-rules', 'scikit-learn-tfidf']).default('hybrid-gemini-2.5-flash'),
  stage: z.enum(['staging', 'production']),
  evaluatedAt: z.string(),
});
export type JobCheckOutput = z.infer<typeof JobCheckOutputSchema>;

/**
 * Database Audit Record Interface
 */
export interface JobAuditRecord {
  id: string;
  jobText: string;
  email: string | null;
  company: string | null;
  salary: string | null;
  riskLevel: RiskLevel;
  score: number;
  redFlags: string[];
  advice: string[];
  stage: AppStage;
  createdAt: string;
}

/**
 * Research Benchmark Metrics
 */
export interface ModelBenchmark {
  name: string;
  architecture: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  latencyMs: number;
  sampleCount: number;
}

export interface ConfusionMatrix {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

export interface FeatureWeight {
  feature: string;
  weight: number;
  category: string;
}

export interface ResearchDatasetMetrics {
  models: ModelBenchmark[];
  confusionMatrix: ConfusionMatrix;
  featureWeights: FeatureWeight[];
  datasetStats: {
    totalSamples: number;
    legitimateCount: number;
    scamCount: number;
    testRatio: number;
  };
}

/**
 * Standard API Error Response
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{ path: string; message: string }>;
  };
  stage: AppStage;
  timestamp: string;
}
