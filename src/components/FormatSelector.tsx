import React, { ComponentType } from 'react';
import {
  Wand2,
  Type,
  Maximize2,
  Minimize2,
  AlignLeft,
  ListOrdered,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { ModeOption, NormalizationMode } from '../types';

interface FormatSelectorProps {
  currentMode: NormalizationMode;
  detectedMode?: NormalizationMode;
  onSelectMode: (mode: NormalizationMode) => void;
}

export const MODES: (ModeOption & { icon: ComponentType<{ className?: string }> })[] = [
  {
    id: 'auto',
    label: 'AUTO',
    shortLabel: 'Auto',
    description: 'Auto-detect jenis data (Phone, List, atau Teks)',
    icon: Wand2,
  },
  {
    id: 'title_case',
    label: 'TITLE CASE',
    shortLabel: 'Title Case',
    description: 'Huruf besar di setiap awal perkataan',
    icon: Type,
  },
  {
    id: 'all_caps',
    label: 'ALL CAPS',
    shortLabel: 'ALL CAPS',
    description: 'Semua huruf besar (UPPERCASE)',
    icon: Maximize2,
  },
  {
    id: 'lowercase',
    label: 'lowercase',
    shortLabel: 'lowercase',
    description: 'Semua huruf kecil',
    icon: Minimize2,
  },
  {
    id: 'one_line',
    label: 'ONE LINE',
    shortLabel: 'One Line',
    description: 'Gabung berbilang baris ke satu baris',
    icon: AlignLeft,
  },
  {
    id: 'list_to_sentence',
    label: 'LIST → SENTENCE',
    shortLabel: 'List → Sentence',
    description: 'Tukar numbering / bullet list kepada ayat bertatabahasa',
    icon: ListOrdered,
  },
  {
    id: 'phone_whatsapp',
    label: 'PHONE / WHATSAPP',
    shortLabel: 'Phone / WA',
    description: 'Normalize nombor telefon MY (601x) & link WhatsApp',
    icon: PhoneCall,
  },
  {
    id: 'clean_text',
    label: 'CLEAN TEXT',
    shortLabel: 'Clean Text',
    description: 'Buang invisible chars, betulkan spacing & punctuation',
    icon: Sparkles,
  },
];

export function FormatSelector({
  currentMode,
  detectedMode,
  onSelectMode,
}: FormatSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
          <span>Pilih Format</span>
          {currentMode === 'auto' && detectedMode && (
            <span className="text-[11px] font-normal normal-case text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 animate-fade-in">
              Auto dikesan: <strong className="font-semibold">{detectedMode.replace('_', ' ').toUpperCase()}</strong>
            </span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          const isAutoDetected = currentMode === 'auto' && detectedMode === mode.id && mode.id !== 'auto';

          return (
            <button
              key={mode.id}
              id={`format-mode-${mode.id}`}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
              }`}
              title={mode.description}
            >
              {isAutoDetected && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
              )}
              
              <Icon
                className={`w-4 h-4 mb-1.5 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              />
              <span className="text-xs tracking-tight font-medium">
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
