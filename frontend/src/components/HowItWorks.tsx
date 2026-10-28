import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Submit Posting Details',
      desc: 'Paste the raw job description, recruiter email address, company name, and stated compensation into the scanner.',
    },
    {
      num: '02',
      title: 'Scan for Scam Patterns',
      desc: 'The scanner inspects email domain legitimacy, payment or deposit demands, private chat apps, and unrealistic salary traps.',
    },
    {
      num: '03',
      title: 'Review Advisory Outcome',
      desc: 'Receive an immediate risk level rating, flagged red flags, and concrete verification steps before contacting the recruiter.',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-14 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
            Standard Verification
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50">
            How It Works in 3 Steps
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-lg mx-auto">
            A fast, structured pre-check that surfaces scam indicators before you share sensitive identity documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="text-2xl font-black font-mono text-zinc-400 dark:text-zinc-600 block mb-3">
                  {step.num}
                </span>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
