export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface AnalyzeRequest {
  job_text: string;
  email?: string;
  company?: string;
  salary?: string;
}

export interface AnalyzeResponse {
  risk_level: RiskLevel;
  score: number;
  red_flags: string[];
  advice: string[];
}

export interface JobCheckRecord {
  id: string;
  job_text: string;
  email: string | null;
  company: string | null;
  salary: string | null;
  risk_level: RiskLevel;
  score: number;
  created_at: string;
}

export interface ExampleJob {
  title: string;
  subtitle: string;
  data: AnalyzeRequest;
}
