import React, { useState } from 'react';
import {
  Copy,
  Check,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Building,
  Mail,
  DollarSign,
} from 'lucide-react';
import { JobCheckOutput, JobAuditRecord, RiskLevel } from '../../shared/contracts';

interface ResultCardProps {
  result: JobCheckOutput | null;
  lastRecord: JobAuditRecord | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, lastRecord }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  if (!result) return null;

  const scorePercentage = Math.round(result.score * 100);

  // Accessible semantic color and icon configuration
  const riskThemes: Record<
    RiskLevel,
    {
      label: string;
      badgeStyle: string;
      barColor: string;
      icon: React.ComponentType<{ className?: string }>;
      headline: string;
      descriptor: string;
    }
  > = {
    Low: {
      label: 'Low Risk',
      badgeStyle:
        'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-700/80',
      barColor: 'bg-emerald-600 dark:bg-emerald-400',
      icon: ShieldCheck,
      headline: 'Posting appears legitimate with minimal scam indicators',
      descriptor: 'Safe & Verified Signals Detected',
    },
    Medium: {
      label: 'Medium Risk',
      badgeStyle:
        'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700/80',
      barColor: 'bg-amber-500 dark:bg-amber-400',
      icon: AlertTriangle,
      headline: 'Unusual communication or identity patterns found. Verify before applying',
      descriptor: 'Caution Advised · Review Red Flags',
    },
    High: {
      label: 'High Risk',
      badgeStyle:
        'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-700/80',
      barColor: 'bg-rose-600 dark:bg-rose-400',
      icon: ShieldAlert,
      headline: 'Multiple critical scam patterns detected. Do not transfer funds or sensitive data',
      descriptor: 'Critical Scam Alert · Strong Danger',
    },
  };

  const themeConfig = riskThemes[result.riskLevel];
  const RiskIcon = themeConfig.icon;

  const handleCopyReport = async () => {
    try {
      const reportText = `JobSentry Risk Analysis Report
================================
Risk Level: ${result.riskLevel} (${scorePercentage}%)
Risk Score: ${result.score} (0.00 Safe to 1.00 Critical)
Evaluated At: ${new Date(result.evaluatedAt).toLocaleString()}
Company: ${lastRecord?.company || 'Not provided'}
Email: ${lastRecord?.email || 'Not provided'}
Salary: ${lastRecord?.salary || 'Not provided'}

Identified Red Flags:
${result.redFlags.map((rf) => `- ${rf}`).join('\n')}

Recommended Action Steps:
${result.advice.map((adv) => `- ${adv}`).join('\n')}

Advisory Notice: This is an advisory risk indicator, not proof of fraud.`;

      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setCopyError(null);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError('Unable to copy automatically. Please copy manually.');
      setTimeout(() => setCopyError(null), 3000);
    }
  };

  // Helper to format salary cleanly without forcing dollar sign
  const formatSalary = (rawSalary: string | null | undefined) => {
    if (!rawSalary) return null;
    const trimmed = rawSalary.trim();
    const hasCurrency = /^[\$\₹\€\£\¥\A\C]/i.test(trimmed);
    return hasCurrency ? trimmed : `$${trimmed}`;
  };

  return (
    <section
      id="result-section"
      className="py-10 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40"
      aria-label="Job Posting Analysis Results"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-1">
                <span>Assessment Outcome</span>
                <span>·</span>
                <span className="capitalize">{result.stage === 'staging' ? 'Staging Demo' : 'Live Analysis'}</span>
                {lastRecord && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(result.evaluatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
                Job Posting Risk Assessment
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Accessible Semantic Color-Coded Risk Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold tracking-wide shadow-xs ${themeConfig.badgeStyle}`}
                role="status"
                aria-label={`Assessed risk level: ${themeConfig.label}`}
              >
                <RiskIcon className="w-4 h-4 shrink-0" />
                <span>{themeConfig.label}</span>
              </div>

              {/* Copy Report Button with Feedback */}
              <button
                type="button"
                onClick={handleCopyReport}
                aria-label="Copy full assessment report to clipboard"
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[38px] min-w-[38px] flex items-center justify-center relative"
                title="Copy assessment report"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Copy Notification Toast */}
          {copied && (
            <div
              role="status"
              aria-live="polite"
              className="my-3 px-3.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-fade-in"
            >
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Full advisory report copied to clipboard.</span>
            </div>
          )}

          {copyError && (
            <div
              role="alert"
              className="my-3 px-3.5 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs"
            >
              {copyError}
            </div>
          )}

          {/* Metadata String */}
          {lastRecord && (lastRecord.company || lastRecord.email || lastRecord.salary) && (
            <div className="py-2.5 px-3 my-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              {lastRecord.company && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400">Company:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{lastRecord.company}</span>
                </div>
              )}
              {lastRecord.email && (
                <div className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400 font-sans">Email:</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{lastRecord.email}</span>
                </div>
              )}
              {lastRecord.salary && (
                <div className="flex items-center gap-1.5 font-mono">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400 font-sans">Compensation:</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{formatSalary(lastRecord.salary)}</span>
                </div>
              )}
            </div>
          )}

          {/* Score as Color-Coded Progress Bar with Percentage and Severity Text */}
          <div className="my-6">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <span>Calculated Risk Score:</span>
                <strong className="text-zinc-950 dark:text-zinc-50 font-mono text-sm tabular-nums">
                  {result.score}
                </strong>
                <span className="text-zinc-500 font-normal">({scorePercentage}%)</span>
              </span>

              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {themeConfig.descriptor}
              </span>
            </div>

            {/* Semantic Progress Bar Track */}
            <div
              className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-zinc-800 p-0.5"
              role="progressbar"
              aria-valuenow={scorePercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Risk score ${scorePercentage} percent, ${themeConfig.label}`}
            >
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${themeConfig.barColor}`}
                style={{ width: `${Math.min(100, Math.max(6, scorePercentage))}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{themeConfig.headline}</p>
          </div>

          {/* Red Flags & Verification Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {/* Red Flags List */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Detected Red Flags ({result.redFlags.length})</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                {result.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Advice List */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Recommended Verification Steps ({result.advice.length})</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                {result.advice.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Diagnostic Factor Breakdown in Staging Mode */}
          {result.factors && result.factors.length > 0 && (
            <div className="mt-5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/30 text-xs">
              <div className="font-mono text-[11px] font-bold text-zinc-500 uppercase mb-2">
                Staging Diagnostic Rule Breakdown
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                {result.factors.map((factor, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{factor.id}</span>
                    <span className="text-zinc-400">[{factor.severity}]</span>
                    <span>·</span>
                    <span className="text-zinc-500">{factor.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
