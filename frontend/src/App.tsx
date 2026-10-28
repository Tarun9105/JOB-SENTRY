import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroAndForm } from './components/HeroAndForm';
import { ResultCard } from './components/ResultCard';
import { ResearchDashboard } from './components/ResearchDashboard';
import { HowItWorks } from './components/HowItWorks';
import { CommonScams } from './components/CommonScams';
import { ScamHelpline } from './components/ScamHelpline';
import { HistoryTable } from './components/HistoryTable';
import { Disclaimer } from './components/Disclaimer';
import {
  JobCheckInput,
  JobCheckOutput,
  JobAuditRecord,
  AppStage,
} from '../shared/contracts';
import {
  analyzeJobAPI,
  fetchHistoryAPI,
  clearHistoryAPI,
  validateClientInput,
} from './services/api';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [stage, setStage] = useState<AppStage>('production');
  const [simulateOffline, setSimulateOffline] = useState<boolean>(false);

  const [formData, setFormData] = useState<JobCheckInput>({
    jobText: '',
    email: '',
    company: '',
    salary: '',
    stage: 'production',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [result, setResult] = useState<JobCheckOutput | null>(null);
  const [lastSavedRecord, setLastSavedRecord] = useState<JobAuditRecord | null>(null);
  const [historyRecords, setHistoryRecords] = useState<JobAuditRecord[]>([]);

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load audit history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const records = await fetchHistoryAPI();
    setHistoryRecords(records);
  };

  const handleClearForm = () => {
    setFormData({
      jobText: '',
      email: '',
      company: '',
      salary: '',
      stage,
    });
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);
    setFieldErrors({});

    const validation = validateClientInput(formData);
    if (!validation.isValid) {
      if (validation.field) {
        setFieldErrors({ [validation.field]: validation.error || 'Invalid parameter' });
      }
      setErrorMessage(validation.error || 'Please review your input values.');
      return;
    }

    setIsLoading(true);

    try {
      const outcome = await analyzeJobAPI(formData, {
        simulateOffline,
        stage,
      });

      setResult(outcome.output);
      setLastSavedRecord(outcome.record);

      await loadHistory();

      setTimeout(() => {
        const resultEl = document.getElementById('result-section');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    await clearHistoryAPI();
    setHistoryRecords([]);
  };

  const handleSelectRecord = (record: JobAuditRecord) => {
    setFormData({
      jobText: record.jobText,
      email: record.email || '',
      company: record.company || '',
      salary: record.salary || '',
      stage: record.stage,
    });
    setResult({
      riskLevel: record.riskLevel,
      risk_level: record.riskLevel,
      score: record.score,
      redFlags: record.redFlags,
      red_flags: record.redFlags,
      advice: record.advice,
      modelType: 'deterministic-nlp-rules',
      stage: record.stage,
      evaluatedAt: record.createdAt,
    });
    setLastSavedRecord(record);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 bg-grid-pattern animate-grid-subtle flex flex-col font-sans transition-colors selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
      {/* 3-Zone Sticky Navigation */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        stage={stage}
        setStage={(s) => {
          setStage(s);
          setFormData((prev) => ({ ...prev, stage: s }));
        }}
        simulateOffline={simulateOffline}
        setSimulateOffline={setSimulateOffline}
      />

      <main className="flex-1">
        {/* 1. Hero with a one-line promise and a paste box */}
        {/* 2. Form: job description, recruiter email, company name, salary, plus an Analyze button */}
        {/* 3. “Try example” button */}
        <HeroAndForm
          formData={formData}
          setFormData={setFormData}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          errorMessage={errorMessage}
          fieldErrors={fieldErrors}
          onClear={handleClearForm}
        />

        {/* 4. Result card: colour-coded risk badge, score as progress bar, red flags, advice */}
        <ResultCard result={result} lastRecord={lastSavedRecord} />

        {/* Interactive ML & DL Research Benchmark Dashboard */}
        <div id="research">
          <ResearchDashboard />
        </div>

        {/* 5. “How it works” in 3 steps */}
        <HowItWorks />

        {/* 6. Common scams section */}
        <CommonScams />

        {/* 7. What to do if you’ve been scammed: cybercrime.gov.in, helpline 1930 */}
        <ScamHelpline />

        {/* 8. History table of past checks */}
        <HistoryTable
          records={historyRecords}
          onClearHistory={handleClearHistory}
          onSelectRecord={handleSelectRecord}
        />
      </main>

      {/* 9. Disclaimer: “This is an advisory risk indicator, not proof of fraud” */}
      <Disclaimer />
    </div>
  );
};
