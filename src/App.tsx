/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FormatSelector } from './components/FormatSelector';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { StatusBar } from './components/StatusBar';
import { UserWorkspaceModal } from './components/UserWorkspaceModal';
import { SupportModal } from './components/SupportModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { normalizeInput } from './lib/normalizers';
import { NormalizationMode, PhoneFormatOption } from './types';
import { BRANDING } from './config/branding';
import { AlertCircle, X } from 'lucide-react';

function AppContent() {
  // Pure empty initial state - NO demo data
  const [rawInput, setRawInput] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<NormalizationMode>('auto');
  const [phoneOption, setPhoneOption] = useState<PhoneFormatOption>('number');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  const { error: authError, clearError: clearAuthError } = useAuth();

  // Real-time deterministic processing
  const result = useMemo(() => {
    return normalizeInput(rawInput, currentMode, phoneOption);
  }, [rawInput, currentMode, phoneOption]);

  const handleClear = () => {
    setRawInput('');
  };

  const handleSelectSample = (sampleText: string, mode: NormalizationMode) => {
    setRawInput(sampleText);
    setCurrentMode(mode);
  };

  const handleSelectFromWorkspace = (input: string, mode: NormalizationMode) => {
    setRawInput(input);
    setCurrentMode(mode);
  };

  const hasInput = rawInput.trim().length > 0;
  const hasOutput = Boolean(result.output && result.output.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* App Header with Google Sign In & Workspace trigger */}
      <Header onOpenWorkspace={() => setIsWorkspaceOpen(true)} />

      {/* Auth Error Banner if domain or auth issue */}
      {authError && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Perhatian Log Masuk:</p>
                <p className="mt-0.5">{authError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearAuthError}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 flex flex-col gap-5">
        {/* Format Selector Bar */}
        <section aria-label="Format Selector">
          <FormatSelector
            currentMode={currentMode}
            detectedMode={result.detectedMode}
            onSelectMode={setCurrentMode}
          />
        </section>

        {/* Dual Input/Output Workspace Panels */}
        <section
          aria-label="Workspace"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch flex-1"
        >
          {/* Panel 1: Raw Input */}
          <InputPanel
            value={rawInput}
            onChange={setRawInput}
            onClear={handleClear}
          />

          {/* Panel 2: Output & Copy & Cloud Workspace Save */}
          <OutputPanel
            rawInput={rawInput}
            result={result}
            currentMode={currentMode}
            phoneOption={phoneOption}
            onPhoneOptionChange={setPhoneOption}
            hasInput={hasInput}
            onOpenWorkspace={() => setIsWorkspaceOpen(true)}
          />
        </section>

        {/* Status Bar & Quick Test Cases */}
        <section aria-label="Status & Quick Test Bench">
          <StatusBar
            hasInput={hasInput}
            hasOutput={hasOutput}
            currentMode={currentMode}
            detectedMode={result.detectedMode}
            onSelectSample={handleSelectSample}
          />
        </section>
      </main>

      {/* Private Workspace Modal */}
      <UserWorkspaceModal
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        onSelectRecord={handleSelectFromWorkspace}
      />

      {/* Support ❤️ Popup Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Develop By{' '}
              <a
                href="https://www.syncrozz.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-700 hover:text-indigo-600 hover:underline transition-colors"
              >
                Syncrozz
              </a>
            </span>
            <span className="text-slate-300">•</span>
            <span>Prinsip: <em>{BRANDING.PLATFORM_PRINCIPLE}</em></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Google OAuth • Firebase Auth • Firestore Scoped Workspace
            </span>
            {/* Understated, subtle, calm, premium Support CTA */}
            <button
              id="support-cta-btn"
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-normal text-slate-500 hover:text-slate-800 bg-slate-900/[0.04] hover:bg-slate-900/[0.08] border border-slate-900/5 hover:border-slate-900/10 transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer"
              title="Sokong Inovasi Ini"
            >
              <span>Support</span>
              <span className="text-rose-400/80 text-[11px]">❤️</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
