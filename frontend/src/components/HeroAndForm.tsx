import React, { useState, useEffect, useRef } from 'react';
import {
  ClipboardPaste,
  Sparkles,
  RotateCcw,
  Loader2,
  Check,
  AlertCircle,
  Briefcase,
  Mail,
  Building,
  DollarSign,
} from 'lucide-react';
import { JobCheckInput } from '../../shared/contracts';
import { EXAMPLE_JOBS } from '../data/examples';

interface HeroAndFormProps {
  formData: JobCheckInput;
  setFormData: React.Dispatch<React.SetStateAction<JobCheckInput>>;
  onAnalyze: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  fieldErrors: { [key: string]: string };
  onClear: () => void;
}

export const HeroAndForm: React.FC<HeroAndFormProps> = ({
  formData,
  setFormData,
  onAnalyze,
  isLoading,
  errorMessage,
  fieldErrors,
  onClear,
}) => {
  const [showExampleMenu, setShowExampleMenu] = useState<boolean>(false);
  const [pasteSuccess, setPasteSuccess] = useState<boolean>(false);
  const exampleMenuRef = useRef<HTMLDivElement>(null);

  // Close example menu on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exampleMenuRef.current && !exampleMenuRef.current.contains(event.target as Node)) {
        setShowExampleMenu(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowExampleMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (field: keyof JobCheckInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyExample = (index: number) => {
    const ex = EXAMPLE_JOBS[index];
    setFormData({
      jobText: ex.data.job_text,
      email: ex.data.email,
      company: ex.data.company,
      salary: ex.data.salary,
      stage: formData.stage,
    });
    setShowExampleMenu(false);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData((prev) => ({
          ...prev,
          jobText: text,
        }));
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch {
      // Clipboard read permission denied or unsupported
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <section id="scanner" className="relative pt-8 sm:pt-12 pb-12 sm:pb-14 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Editorial Hero Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-10 animate-text-reveal">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <span>Pre-Application Job Scam Scanner</span>
            <span>·</span>
            <span>Free Advisory Check</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight [text-wrap:balance]">
            Check any job posting before you apply.
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-normal [text-wrap:balance]">
            Spot suspicious recruiter emails, upfront fee traps, and unmonitored chat channels in seconds.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 p-4 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-fade-in text-xs sm:text-sm"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Please check your submission:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Main Analysis Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-sm transition-colors"
        >
          {/* Header & Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <label
              htmlFor="jobText"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-zinc-500" />
              <span>Job Description / Posting Text</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold text-xs">*Required</span>
            </label>

            <div className="flex items-center gap-2">
              {/* Paste Button */}
              <button
                type="button"
                onClick={handlePasteClipboard}
                aria-label="Paste job description from clipboard"
                className="text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[36px]"
              >
                {pasteSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Pasted!</span>
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Paste</span>
                  </>
                )}
              </button>

              {/* Try Example Dropdown */}
              <div className="relative" ref={exampleMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowExampleMenu(!showExampleMenu)}
                  aria-label="Select an example job posting to test"
                  aria-expanded={showExampleMenu}
                  className="text-xs px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[36px]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Try Example</span>
                </button>

                {/* Example Menu Dropdown */}
                {showExampleMenu && (
                  <div
                    className="absolute right-0 sm:right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 p-2 space-y-1 animate-fade-in"
                    role="menu"
                    aria-label="Example job posting scenarios"
                  >
                    <div className="px-2 py-1 text-[11px] font-mono uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                      Choose a Test Scenario
                    </div>
                    {EXAMPLE_JOBS.map((ex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        role="menuitem"
                        onClick={() => handleApplyExample(idx)}
                        className="w-full text-left p-2.5 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none"
                      >
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{ex.title}</span>
                        <span className="text-[11px] text-zinc-500 mt-0.5">{ex.subtitle}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Form Button */}
              {(formData.jobText || formData.email || formData.company || formData.salary) && (
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Clear all form fields"
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
                  title="Clear all fields"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Text Area Input */}
          <div className="mb-4">
            <textarea
              id="jobText"
              name="jobText"
              rows={6}
              value={formData.jobText || ''}
              onChange={(e) => handleInputChange('jobText', e.target.value)}
              placeholder="Paste the full job posting, email offer, LinkedIn message, or Telegram task description here..."
              className={`w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none text-base sm:text-xs transition-all resize-y ${
                fieldErrors.jobText
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                  : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-2 focus:ring-zinc-400'
              }`}
            />
            {fieldErrors.jobText && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{fieldErrors.jobText}</span>
              </p>
            )}
          </div>

          {/* Metadata Grid (Email, Company, Salary) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
            {/* Recruiter Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>Recruiter Email</span>
                <span className="text-zinc-400 text-[11px] font-normal">(optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="recruiter@company.com"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none text-base sm:text-xs transition-all ${
                  fieldErrors.email
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                    : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label
                htmlFor="company"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5 text-zinc-500" />
                <span>Company Name</span>
                <span className="text-zinc-400 text-[11px] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g. Stripe, Acme Corp"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 text-base sm:text-xs transition-all"
              />
            </div>

            {/* Salary / Compensation */}
            <div>
              <label
                htmlFor="salary"
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                <span>Salary / Pay</span>
                <span className="text-zinc-400 text-[11px] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary || ''}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="e.g. 85000 or $85,000"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none text-base sm:text-xs transition-all ${
                  fieldErrors.salary
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                    : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400'
                }`}
              />
              {fieldErrors.salary && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{fieldErrors.salary}</span>
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 flex items-center gap-2 order-2 sm:order-1">
              <span>All analyses are saved in your local scan history.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-100 hover:opacity-90 transition-all flex items-center justify-center gap-2.5 order-1 sm:order-2 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[44px] ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-zinc-950" />
                  <span>Analyzing Posting...</span>
                </>
              ) : (
                <span>Analyze Job Posting</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
