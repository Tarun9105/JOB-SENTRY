import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Server, Menu, X, SlidersHorizontal, Check, Globe } from 'lucide-react';
import { AppStage } from '../../shared/contracts';
import { getApiBaseUrl, setCustomApiUrl } from '../services/api';

interface NavbarProps {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  stage: AppStage;
  setStage: (s: AppStage) => void;
  simulateOffline: boolean;
  setSimulateOffline: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  setTheme,
  stage,
  setStage,
  simulateOffline,
  setSimulateOffline,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState<boolean>(false);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  const [backendUrl, setBackendUrl] = useState<string>(getApiBaseUrl());
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'healthy' | 'error'>('idle');

  const testBackendConnection = async (targetUrl: string) => {
    setConnectionStatus('checking');
    try {
      const trimmed = targetUrl.trim().replace(/\/+$/, '');
      const res = await fetch(`${trimmed}/api/health`);
      if (res.ok) {
        setConnectionStatus('healthy');
      } else {
        setConnectionStatus('error');
      }
    } catch {
      setConnectionStatus('error');
    }
  };

  const handleSaveBackendUrl = () => {
    setCustomApiUrl(backendUrl);
    testBackendConnection(backendUrl);
  };

  // Close demo dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (demoMenuRef.current && !demoMenuRef.current.contains(event.target as Node)) {
        setDemoMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDemoMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50 whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 rounded-md p-1 focus-visible:outline-none"
        >
          JobSentry
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400"
          aria-label="Main Navigation"
        >
          <a
            href="#scanner"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 rounded p-1 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none"
          >
            Scanner
          </a>
          <a
            href="#research"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 rounded p-1 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none"
          >
            Research & Benchmarks
          </a>
          <a
            href="#how-it-works"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 rounded p-1 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none"
          >
            Workflow
          </a>
          <a
            href="#common-scams"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 rounded p-1 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none"
          >
            Scam Patterns
          </a>
          <a
            href="#helpline"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 rounded p-1 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none"
          >
            Helpline 1930
          </a>
          <a
            href="#history"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 rounded p-1 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none"
          >
            Scan History
          </a>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Collapsible Demo & Debug Drawer Button */}
          <div className="relative" ref={demoMenuRef}>
            <button
              type="button"
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              aria-label="Open evaluation demo and testing settings"
              aria-expanded={demoMenuOpen}
              className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none ${
                demoMenuOpen || simulateOffline || stage === 'staging'
                  ? 'border-zinc-900 bg-zinc-100 text-zinc-950 dark:border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
              title="Demo & Evaluation Settings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">Demo Settings</span>
              {(simulateOffline || stage === 'staging') && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-label="Active test setting"></span>
              )}
            </button>

            {/* Demo Settings Dropdown Popover */}
            {demoMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 p-4 space-y-3 animate-fade-in text-xs"
                role="dialog"
                aria-label="Evaluation & Demo Controls"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold text-zinc-950 dark:text-zinc-100 text-xs">
                    Demo & Evaluation Settings
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono">Viva Controls</span>
                </div>

                {/* Stage switcher */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Execution Mode
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setStage('production')}
                      className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1 ${
                        stage === 'production'
                          ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-bold shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {stage === 'production' && <Check className="w-3 h-3" />}
                      <span>Production</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStage('staging')}
                      className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1 ${
                        stage === 'staging'
                          ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-bold shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {stage === 'staging' && <Check className="w-3 h-3" />}
                      <span>Staging (Debug)</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Staging exposes diagnostic rule factor IDs in the evaluation response.
                  </p>
                </div>

                {/* Network failure simulator */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Simulate Offline Error (503)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={simulateOffline}
                      onChange={(e) => setSimulateOffline(e.target.checked)}
                      className="rounded accent-zinc-900 dark:accent-zinc-100 cursor-pointer w-4 h-4"
                    />
                  </label>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Simulates a backend outage to test user error messaging and retry recovery.
                  </p>
                </div>

                {/* Render Backend Connection URL */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Render API Endpoint</span>
                    </span>
                    {connectionStatus === 'healthy' && (
                      <span className="text-[10px] text-emerald-500 font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Connected
                      </span>
                    )}
                    {connectionStatus === 'error' && (
                      <span className="text-[10px] text-rose-500 font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Unreachable
                      </span>
                    )}
                    {connectionStatus === 'checking' && (
                      <span className="text-[10px] text-zinc-400 font-mono">Testing...</span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={backendUrl}
                      onChange={(e) => {
                        setBackendUrl(e.target.value);
                        setConnectionStatus('idle');
                      }}
                      placeholder="https://jobsentry-api.onrender.com"
                      className="w-full px-2 py-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={handleSaveBackendUrl}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                      Save
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Enter your Render URL to link Cloudflare frontend to Render backend immediately.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Scan CTA Button */}
          <a
            href="#scanner"
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[36px]"
          >
            Scan Job
          </a>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-1 animate-fade-in shadow-lg"
          role="region"
          aria-label="Mobile Navigation Menu"
        >
          <a
            href="#scanner"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 min-h-[44px]"
          >
            Job Scanner
          </a>
          <a
            href="#research"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 min-h-[44px]"
          >
            Research & Benchmarks
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 min-h-[44px]"
          >
            How It Works (Workflow)
          </a>
          <a
            href="#common-scams"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 min-h-[44px]"
          >
            Common Scam Patterns
          </a>
          <a
            href="#helpline"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 min-h-[44px]"
          >
            Helpline 1930 & Reporting
          </a>
          <a
            href="#history"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 min-h-[44px]"
          >
            Scan History
          </a>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Quick Scan Action:</span>
            <a
              href="#scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold min-h-[44px] flex items-center justify-center"
            >
              Analyze Posting Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
