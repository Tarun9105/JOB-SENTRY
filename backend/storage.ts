import { JobAuditRecord, NormalizedJobRequest, JobCheckOutput } from './shared/contracts';

class AuditStorage {
  private records: JobAuditRecord[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    this.records = [
      {
        id: 'chk_aud_001',
        jobText: 'Data Entry Assistant: 3-4 hours daily. $45/hour. No prior experience required. Contact us on Telegram @HR_Recruitment_Direct. Laptop shipped after $150 security deposit.',
        email: 'recruitment.desk99@gmail.com',
        company: 'Global Horizon Logistics',
        salary: '95000',
        riskLevel: 'High',
        score: 0.78,
        redFlags: ['Free public email domain', 'Demands upfront registration fee'],
        advice: ['Never pay for a job', 'Verify the company website'],
        stage: 'production',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'chk_aud_002',
        jobText: 'Remote Social Media Evaluator: Review online ads and rate products. Daily payout in crypto. Quick hiring today.',
        email: 'hr-evaluations@outlook.com',
        company: 'Digital Sparks Agency',
        salary: '60000',
        riskLevel: 'Medium',
        score: 0.52,
        redFlags: ['Unverified email provider', 'Directs to task rating schemes'],
        advice: ['Avoid jobs requiring crypto top-ups', 'Check registration records'],
        stage: 'staging',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
      {
        id: 'chk_aud_003',
        jobText: 'Frontend Software Engineer: Join Core UI engineering team. 3+ years experience with React and TypeScript. Comprehensive benefits package and stock options.',
        email: 'careers@acme-cloud.tech',
        company: 'Acme Cloud Technologies',
        salary: '145000',
        riskLevel: 'Low',
        score: 0.12,
        redFlags: ['No primary high-risk triggers detected in text'],
        advice: ['Verify recruiter on LinkedIn and confirm posting on official careers site'],
        stage: 'production',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];
  }

  public saveCheck(req: NormalizedJobRequest, result: JobCheckOutput): JobAuditRecord {
    const record: JobAuditRecord = {
      id: 'chk_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      jobText: req.jobText,
      email: req.email || null,
      company: req.company || null,
      salary: req.salary || null,
      riskLevel: result.riskLevel,
      score: result.score,
      redFlags: result.redFlags,
      advice: result.advice,
      stage: req.stage,
      createdAt: result.evaluatedAt,
    };

    this.records.unshift(record);
    return record;
  }

  public listChecks(limit = 100): JobAuditRecord[] {
    return this.records.slice(0, limit);
  }

  public clear(): void {
    this.records = [];
  }
}

export const auditStorage = new AuditStorage();
