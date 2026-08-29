import { Clipboard, Trash2, FileText, CornerDownLeft } from 'lucide-react';
import React, { useRef } from 'react';

interface InputPanelProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export function InputPanel({ value, onChange, onClear }: InputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange(text);
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }
      }
    } catch {
      // If clipboard read is blocked by browser permissions, simply focus textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const characterCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const lineCount = value ? value.split('\n').length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
            1
          </span>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
            Raw Input
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="paste-input-btn"
            type="button"
            onClick={handlePasteFromClipboard}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Tampal daripada papan keratan (Clipboard)"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>

          {value && (
            <button
              id="clear-input-btn"
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Kosongkan input dan output"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 min-h-[220px] sm:min-h-[300px] flex flex-col">
        <textarea
          ref={textareaRef}
          id="raw-input-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste maklumat mentah di sini…"
          className="w-full flex-1 p-3.5 sm:p-4 text-sm sm:text-base text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-none transition-all placeholder:text-slate-400 font-sans leading-relaxed"
          autoFocus
        />
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span>
            <strong className="font-semibold text-slate-700">{characterCount}</strong> aksara
          </span>
          <span className="text-slate-300">•</span>
          <span>
            <strong className="font-semibold text-slate-700">{wordCount}</strong> perkataan
          </span>
          {lineCount > 1 && (
            <>
              <span className="text-slate-300">•</span>
              <span>
                <strong className="font-semibold text-slate-700">{lineCount}</strong> baris
              </span>
            </>
          )}
        </div>

        {value.length === 0 && (
          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1">
            <span>Sedia menerima input mentah</span>
          </div>
        )}
      </div>
    </div>
  );
}
