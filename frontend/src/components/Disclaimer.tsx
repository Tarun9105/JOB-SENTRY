import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <footer className="py-12 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Legal & Advisory Notice
            </h4>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              &ldquo;This is an advisory risk indicator, not proof of fraud.&rdquo;
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              JobSentry is an informational analysis system engineered to alert job applicants to common scam patterns, suspicious communication channels, and unverified recruiter domains. A high risk score indicates structural threat indicators, while a low score does not guarantee immunity from sophisticated fraud. Always verify job postings independently through official corporate registries and employer careers portals.
            </p>
            <div className="pt-3 text-[11px] font-mono text-zinc-400 dark:text-zinc-600 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 dark:border-zinc-800">
              <span>JobSentry Enterprise Advisory Platform</span>
              <span>Helpline: 1930 · cybercrime.gov.in</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
