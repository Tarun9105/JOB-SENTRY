import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Trash2,
  Download,
  Eye,
  X,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { JobAuditRecord, RiskLevel } from '../../shared/contracts';

interface HistoryTableProps {
  records: JobAuditRecord[];
  onClearHistory: () => void;
  onSelectRecord: (record: JobAuditRecord) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  records,
  onClearHistory,
  onSelectRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [activeRecord, setActiveRecord] = useState<JobAuditRecord | null>(null);
  const triggerButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Close dialog on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && activeRecord) {
        handleCloseDialog();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeRecord]);

  const handleOpenDialog = (rec: JobAuditRecord) => {
    setActiveRecord(rec);
  };

  const handleCloseDialog = () => {
    const closedId = activeRecord?.id;
    setActiveRecord(null);
    if (closedId && triggerButtonRefs.current[closedId]) {
      triggerButtonRefs.current[closedId]?.focus();
    }
  };

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.jobText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.company && rec.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rec.email && rec.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rec.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = filterRisk === 'ALL' || rec.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobsentry_scan_history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to format salary cleanly
  const formatSalary = (salary: string | null | undefined) => {
    if (!salary) return '—';
    const trimmed = salary.trim();
    return /^[\$\₹\€\£\¥\A\C]/i.test(trimmed) ? trimmed : `$${trimmed}`;
  };

  // Formatter for complete date and time
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' · ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Accessible semantic risk badge
  const renderRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>High</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Medium</span>
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Low</span>
          </span>
        );
    }
  };

  return (
    <section id="history" className="py-12 sm:py-14 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
              Audit History Log
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
              Past Job Scan History
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Every analyzed job posting is saved with timestamp, risk assessment score, and detected flags.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportJSON}
              disabled={records.length === 0}
              aria-label="Export all scan records as JSON file"
              className="px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all stored scan history?')) {
                  onClearHistory();
                }
              }}
              disabled={records.length === 0}
              aria-label="Clear all scan history entries"
              className="px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[38px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Search and Risk Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by company, email, keywords..."
              aria-label="Filter scan history"
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-base sm:text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 min-h-[40px]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search input"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-medium text-zinc-500 shrink-0">Filter by Risk:</span>
            <div className="flex items-center p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs bg-white dark:bg-zinc-900">
              {['ALL', 'High', 'Medium', 'Low'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFilterRisk(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none ${
                    filterRisk === lvl
                      ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View: Data Table (hidden on mobile) */}
        <div className="hidden md:block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 uppercase tracking-wider text-[11px] font-mono border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Date & Time</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Company</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Recruiter Email</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Pay</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Risk Level</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Score</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Posting Snippet</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-zinc-500 text-xs">
                      <div className="max-w-sm mx-auto space-y-3">
                        <Sparkles className="w-6 h-6 text-zinc-400 mx-auto" />
                        <p className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">
                          No job postings analyzed yet
                        </p>
                        <p className="text-zinc-500 text-xs">
                          Paste a job description above or choose an example scenario to see risk assessments.
                        </p>
                        <a
                          href="#scanner"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          Scan First Job
                        </a>
                      </div>
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-zinc-500 text-xs">
                      <div className="max-w-sm mx-auto space-y-2">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                          No scans match your search filter
                        </p>
                        <p className="text-zinc-500 text-xs">
                          Try searching for a different company or reset your filter.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm('');
                            setFilterRisk('ALL');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Clear Filters</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                      {/* Date & Time */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-zinc-500">
                        {formatDateTime(rec.createdAt)}
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-zinc-950 dark:text-zinc-50">
                        {rec.company || <span className="text-zinc-400 font-normal italic">None</span>}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                        {rec.email || <span className="text-zinc-400 font-sans italic">None</span>}
                      </td>

                      {/* Salary */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-zinc-800 dark:text-zinc-200">
                        {formatSalary(rec.salary)}
                      </td>

                      {/* Risk Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderRiskBadge(rec.riskLevel)}
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono font-bold tabular-nums text-zinc-950 dark:text-zinc-50">
                        {rec.score}
                      </td>

                      {/* Job Snippet */}
                      <td className="px-4 py-3 max-w-xs truncate text-zinc-500">
                        {rec.jobText}
                      </td>

                      {/* Inspect Action */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          ref={(el) => { triggerButtonRefs.current[rec.id] = el; }}
                          type="button"
                          onClick={() => handleOpenDialog(rec)}
                          aria-label={`Inspect full assessment details for scan ${rec.id}`}
                          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200 font-medium transition-colors inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View: Responsive Cards List (shown on mobile, hidden on md+) */}
        <div className="md:hidden space-y-3">
          {records.length === 0 ? (
            <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-center space-y-3">
              <Sparkles className="w-6 h-6 text-zinc-400 mx-auto" />
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                No job postings analyzed yet
              </p>
              <p className="text-xs text-zinc-500">
                Paste a job description above or choose an example scenario to see risk assessments.
              </p>
              <a
                href="#scanner"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold min-h-[44px]"
              >
                Scan First Job
              </a>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-center space-y-3">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                No scans match your search filter
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterRisk('ALL');
                }}
                className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100 min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5 shadow-xs"
              >
                {/* Top card row: Risk Badge & Score */}
                <div className="flex items-center justify-between gap-2">
                  {renderRiskBadge(rec.riskLevel)}
                  <span className="font-mono text-xs font-bold text-zinc-950 dark:text-zinc-50">
                    Risk Score: {rec.score}
                  </span>
                </div>

                {/* Company & Date */}
                <div>
                  <h4 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
                    {rec.company || 'Undisclosed Company'}
                  </h4>
                  <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span>{formatDateTime(rec.createdAt)}</span>
                  </div>
                </div>

                {/* Details snippet */}
                <div className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {rec.jobText}
                </div>

                {/* Card footer details & Inspect Button */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs">
                  <div className="font-mono text-zinc-500 truncate text-[11px]">
                    {rec.salary ? formatSalary(rec.salary) : (rec.email || 'No email')}
                  </div>

                  <button
                    ref={(el) => { triggerButtonRefs.current[rec.id] = el; }}
                    type="button"
                    onClick={() => handleOpenDialog(rec)}
                    aria-label={`View details for scan ${rec.id}`}
                    className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors inline-flex items-center gap-1 min-h-[44px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Accessible History Detail Dialog (Modal with Escape-to-close) */}
        {activeRecord && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderRiskBadge(activeRecord.riskLevel)}
                    <span className="font-mono text-xs font-bold text-zinc-950 dark:text-zinc-50">
                      Score: {activeRecord.score}
                    </span>
                  </div>
                  <h3 id="dialog-title" className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    Scan Report Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  aria-label="Close dialog"
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="py-4 space-y-4 text-xs">
                {/* Meta grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Company</span>
                    <strong className="text-zinc-950 dark:text-zinc-100 text-xs">{activeRecord.company || 'Not provided'}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Recruiter Email</span>
                    <strong className="text-zinc-950 dark:text-zinc-100 text-xs font-mono">{activeRecord.email || 'None'}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Compensation</span>
                    <strong className="text-zinc-950 dark:text-zinc-100 text-xs font-mono">{formatSalary(activeRecord.salary)}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Scan Date</span>
                    <strong className="text-zinc-950 dark:text-zinc-100 text-xs font-mono">
                      {new Date(activeRecord.createdAt).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                {/* Job Description Text */}
                <div>
                  <span className="text-zinc-700 dark:text-zinc-300 block font-semibold mb-1.5 text-xs">
                    Submitted Job Description:
                  </span>
                  <div className="p-4 rounded-xl bg-zinc-100/60 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto">
                    {activeRecord.jobText}
                  </div>
                </div>

                {/* Red Flags Summary */}
                {activeRecord.redFlags && activeRecord.redFlags.length > 0 && (
                  <div>
                    <span className="text-zinc-700 dark:text-zinc-300 block font-semibold mb-1 text-xs">
                      Flagged Concerns ({activeRecord.redFlags.length}):
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 list-disc list-inside">
                      {activeRecord.redFlags.map((flag, idx) => (
                        <li key={idx} className="leading-relaxed">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-zinc-500 font-mono order-2 sm:order-1">
                  Recorded on {formatDateTime(activeRecord.createdAt)}
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 min-h-[44px]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecord(activeRecord);
                      handleCloseDialog();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs hover:opacity-90 min-h-[44px] whitespace-nowrap"
                  >
                    Load into Scanner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
