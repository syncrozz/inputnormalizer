import {
  Check,
  Copy,
  ExternalLink,
  AlertTriangle,
  Phone,
  Sparkles,
  FolderPlus,
  Loader2,
  Lock,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NormalizationMode, NormalizationResult, PhoneFormatOption } from '../types';
import { saveUserRecord } from '../lib/recordsService';

interface OutputPanelProps {
  rawInput: string;
  result: NormalizationResult;
  currentMode: NormalizationMode;
  phoneOption: PhoneFormatOption;
  onPhoneOptionChange: (opt: PhoneFormatOption) => void;
  hasInput: boolean;
  onOpenWorkspace: () => void;
}

export function OutputPanel({
  rawInput,
  result,
  currentMode,
  phoneOption,
  onPhoneOptionChange,
  hasInput,
  onOpenWorkspace,
}: OutputPanelProps) {
  const { user, signInWithGoogle } = useAuth();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const isPhoneMode = currentMode === 'phone_whatsapp' || result.detectedMode === 'phone_whatsapp';
  const hasOutput = Boolean(result.output && result.output.length > 0);

  const handleCopy = async () => {
    if (!hasOutput) return;

    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSaveToWorkspace = async () => {
    if (!hasOutput) return;

    if (!user) {
      setAuthPromptOpen(true);
      return;
    }

    try {
      setSaving(true);
      await saveUserRecord(user.uid, {
        rawInput,
        formattedOutput: result.output,
        mode: result.detectedMode || currentMode,
        isSaved: true,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('Error saving record:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm shadow-indigo-200">
            2
          </span>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase flex items-center gap-2">
            <span>Output</span>
            {hasOutput && (
              <span className="text-[11px] font-medium normal-case text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Formatted
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Save to Workspace Button */}
          {hasOutput && (
            <button
              id="save-to-workspace-btn"
              type="button"
              disabled={saving}
              onClick={handleSaveToWorkspace}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                savedSuccess
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
              }`}
              title="Simpan snippet ini ke Ruang Kerja Peribadi anda"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              ) : savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Simpan ke Workspace</span>
                  <span className="sm:hidden">Simpan</span>
                </>
              )}
            </button>
          )}

          {/* Primary COPY button */}
          <button
            id="copy-output-btn"
            type="button"
            disabled={!hasOutput}
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              copied
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 focus:ring-emerald-500 scale-[1.02]'
                : hasOutput
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 focus:ring-indigo-500 cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed'
            }`}
            title={hasOutput ? 'Salin hasil ke clipboard' : 'Tiada output untuk disalin'}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Auth Prompt if saving while logged out */}
      {authPromptOpen && !user && (
        <div className="mb-3 p-3 bg-indigo-50/90 border border-indigo-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-fade-in text-xs">
          <div className="flex items-center gap-2 text-indigo-900">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Log masuk dengan Google untuk menyimpan dan mengakses data peribadi anda di ruang kerja awan.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAuthPromptOpen(false);
                signInWithGoogle();
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-2xs"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => setAuthPromptOpen(false)}
              className="px-2 py-1 text-slate-500 hover:text-slate-700 font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Phone Option Selector if in Phone Mode */}
      {isPhoneMode && hasInput && (
        <div className="mb-3 p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-indigo-950 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-indigo-600" />
            Format Output Phone / WA:
          </span>
          <div className="inline-flex rounded-lg bg-white p-0.5 border border-indigo-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => onPhoneOptionChange('number')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                phoneOption === 'number'
                  ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Direct Number (601x)
            </button>
            <button
              type="button"
              onClick={() => onPhoneOptionChange('link')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                phoneOption === 'link'
                  ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Direct Link (wa.me)
            </button>
          </div>
        </div>
      )}

      {/* Warning banner if invalid/ambiguous */}
      {result.warning && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-amber-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Perhatian:</p>
            <p className="mt-0.5 text-amber-800/90">{result.warning}</p>
          </div>
        </div>
      )}

      {/* Output Content Area */}
      <div className="relative flex-1 min-h-[220px] sm:min-h-[300px] flex flex-col">
        {hasOutput ? (
          <div
            id="formatted-output-display"
            className="w-full flex-1 p-3.5 sm:p-4 text-sm sm:text-base text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl font-sans leading-relaxed overflow-y-auto whitespace-pre-wrap select-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            tabIndex={0}
          >
            {result.output}
          </div>
        ) : (
          <div className="w-full flex-1 p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Hasil diformat akan dipaparkan di sini
            </p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Tampal input di bahagian kiri dan sistem akan membersihkannya secara serta-merta.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info & Secondary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-3">
          {hasOutput ? (
            <>
              <span>
                <strong className="font-semibold text-slate-700">{result.output.length}</strong> aksara
              </span>
              {result.itemCount !== undefined && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>
                    <strong className="font-semibold text-indigo-700">{result.itemCount}</strong> item digabung
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="text-slate-400">Tiada output</span>
          )}
        </div>

        {/* Quick WhatsApp Action if phone mode has valid output */}
        {isPhoneMode && result.phoneDetails?.isValid && result.phoneDetails.waLink && (
          <div className="flex items-center gap-2">
            <a
              href={result.phoneDetails.waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Buka WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
