import React from 'react';
import { PhoneCall, Globe } from 'lucide-react';

export const ScamHelpline: React.FC = () => {
  return (
    <section id="helpline" className="py-14 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-zinc-950 dark:border-zinc-100 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
            Incident Response & Support
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 mb-2">
            What to Do If You’ve Been Scammed
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mb-8">
            If you transferred funds or shared bank credentials, act immediately to invoke the "Golden Hour" inter-bank freezing mechanism.
          </p>

          {/* Primary Action Helplines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* National Helpline 1930 */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2 mb-2 text-zinc-500 text-xs font-mono uppercase">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>National Cyber Crime Helpline</span>
              </div>
              <div className="text-3xl font-black text-zinc-950 dark:text-zinc-50 font-mono my-1 tracking-tight">
                1930
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                Dial <strong>1930</strong> immediately after fraudulent money transfer to prompt beneficiary account freezing before cash withdrawal.
              </p>
            </div>

            {/* Official Portal cybercrime.gov.in */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2 mb-2 text-zinc-500 text-xs font-mono uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>Official Reporting Portal</span>
              </div>
              <div className="text-xl font-bold font-mono my-1 tracking-tight">
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-zinc-950 dark:text-zinc-50"
                >
                  cybercrime.gov.in
                </a>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                Register a formal complaint with transaction UTR numbers, suspect phone numbers, and chat screenshots for official tracking.
              </p>
            </div>
          </div>

          {/* Damage Control Checklist */}
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              Immediate Damage Control Steps
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <strong className="text-zinc-950 dark:text-zinc-50 block mb-1">1. Block Bank Accounts</strong>
                Call your bank’s 24/7 fraud helpline to freeze compromised cards, UPI handles, and net banking access.
              </div>

              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <strong className="text-zinc-950 dark:text-zinc-50 block mb-1">2. Preserve Evidence</strong>
                Take complete screenshots of chats, payment receipts, UTR reference IDs, and phone numbers without altering them.
              </div>

              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <strong className="text-zinc-950 dark:text-zinc-50 block mb-1">3. File on cybercrime.gov.in</strong>
                Submit the complete evidence narrative to receive a formal National Cyber Crime acknowledgment number.
              </div>

              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <strong className="text-zinc-950 dark:text-zinc-50 block mb-1">4. Identity Theft Warning</strong>
                If identity cards (Aadhaar, Passport) were leaked, file an incident notice to guard against unauthorized loan origination.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
