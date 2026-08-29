import { CheckCircle2, Info, Zap, FlaskConical } from 'lucide-react';
import { NormalizationMode } from '../types';

interface StatusBarProps {
  hasInput: boolean;
  hasOutput: boolean;
  currentMode: NormalizationMode;
  detectedMode?: NormalizationMode;
  onSelectSample?: (sampleText: string, mode: NormalizationMode) => void;
}

export const TEST_SAMPLES = [
  {
    name: 'Test 1: Title Case Makanan',
    mode: 'title_case' as NormalizationMode,
    text: 'Ss Farihah HHC -  buah potong, rojak buah, sengkuang calit, ais kepal, nasi goreng, mihun goreng, burger',
  },
  {
    name: 'Test 2: ALL CAPS',
    mode: 'all_caps' as NormalizationMode,
    text: 'Ss Farihah HHC - buah potong, rojak buah, sengkuang calit',
  },
  {
    name: 'Test 3: List Nombor → Ayat',
    mode: 'list_to_sentence' as NormalizationMode,
    text: `1. Perkara A\n2. Perkara B\n3. Perkara C`,
  },
  {
    name: 'Test 3B: Bullet List → Ayat',
    mode: 'list_to_sentence' as NormalizationMode,
    text: `- Pendaftaran peserta\n- Taklimat program\n- Aktiviti berkumpulan\n- Majlis penutup`,
  },
  {
    name: 'Test 4: Phone Malaysia',
    mode: 'phone_whatsapp' as NormalizationMode,
    text: '+60 14-531 3756',
  },
  {
    name: 'Test 8: One Line Extra Spacing',
    mode: 'one_line' as NormalizationMode,
    text: `   \nPerkara A\n\nPerkara B   \n   `,
  },
];

export function StatusBar({
  hasInput,
  hasOutput,
  currentMode,
  detectedMode,
  onSelectSample,
}: StatusBarProps) {
  return (
    <div className="w-full space-y-3">
      {/* Primary Status Banner */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {hasOutput ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ Formatted successfully • Ready to copy</span>
            </div>
          ) : hasInput ? (
            <div className="flex items-center gap-1.5 text-indigo-700 font-medium">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0 animate-pulse" />
              <span>Memproses format secara serta-merta...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 font-normal">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Sedia menerima teks mentah. Tampal untuk bermula.</span>
            </div>
          )}
        </div>

        <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-2">
          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
            MODE: {currentMode.toUpperCase().replace('_', ' ')}
          </span>
          {currentMode === 'auto' && detectedMode && (
            <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-medium">
              → {detectedMode.toUpperCase().replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Quick Test Cases Bar */}
      {onSelectSample && (
        <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
              <span>Uji Kes Contoh (Quick Test Bench):</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Klik mana-mana sampel untuk uji output secara instant
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TEST_SAMPLES.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectSample(sample.text, sample.mode)}
                className="text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg border border-slate-200/80 hover:border-indigo-200 transition-colors shadow-2xs"
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
