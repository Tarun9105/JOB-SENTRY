import React from 'react';

export const CommonScams: React.FC = () => {
  const scams = [
    {
      category: 'Financial Extortion',
      title: 'Upfront Registration & Training Fees',
      summary:
        'Fraudsters ask applicants to pay for mandatory "documentation", "laptop insurance", or "background screening" prior to starting work.',
      rule: 'Legitimate employers never charge candidates to apply or receive company equipment.',
    },
    {
      category: 'Banking / Money Mule',
      title: 'Fake Cheque & Office Equipment Overpayment',
      summary:
        'Applicant receives an electronic cheque to deposit, then is instructed to wire money to a specific "certified equipment vendor" before the cheque bounces.',
      rule: 'Never deposit cheques from unknown parties or wire funds to third-party vendors.',
    },
    {
      category: 'Crypto / Click Farming',
      title: 'Telegram & WhatsApp "Task Rating" Schemes',
      summary:
        'Recruiters offer high daily pay ($300–$800) for trivial tasks like reviewing Google Maps places or liking YouTube videos, then require crypto wallet top-ups.',
      rule: 'Official corporate recruitment does not occur solely through private chat groups.',
    },
    {
      category: 'Identity Theft',
      title: 'Brand Impersonation & Phishing',
      summary:
        'Attackers pose as HR leaders from Microsoft, Amazon, or Infosys using lookalike domains or free Gmail accounts to collect identity documents.',
      rule: 'Always confirm the vacancy on the employer’s official verified careers portal.',
    },
  ];

  return (
    <section id="common-scams" className="py-14 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
            Threat Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50">
            Common Employment Scam Patterns
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-lg mx-auto">
            Recognize the standard operating procedures cybercriminals use to trap job seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scams.map((scam, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-mono uppercase text-zinc-500 block mb-2">
                  {scam.category}
                </span>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-2">
                  {scam.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  {scam.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                <span className="font-bold text-zinc-950 dark:text-zinc-50 uppercase text-[10px] tracking-wider mr-1.5">
                  Defense:
                </span>
                {scam.rule}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
