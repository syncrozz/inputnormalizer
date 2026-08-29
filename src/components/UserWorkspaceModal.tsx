import React, { useState, useEffect } from 'react';
import {
  X,
  FolderLock,
  Star,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SavedRecord, NormalizationMode } from '../types';
import {
  subscribeUserRecords,
  deleteUserRecord,
  toggleSaveUserRecord,
  clearAllUserRecords,
} from '../lib/recordsService';

interface UserWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (rawInput: string, mode: NormalizationMode) => void;
}

export function UserWorkspaceModal({
  isOpen,
  onClose,
  onSelectRecord,
}: UserWorkspaceModalProps) {
  const { user, userProfile } = useAuth();
  const [records, setRecords] = useState<SavedRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserRecords(
      user.uid,
      (updatedRecords) => {
        setRecords(updatedRecords);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (!isOpen) return null;

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRecords = records.filter((r) => {
    if (filter === 'saved' && !r.isSaved) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.rawInput.toLowerCase().includes(q) ||
        r.formattedOutput.toLowerCase().includes(q) ||
        r.mode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  My Private Workspace
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Lock className="w-3 h-3" />
                  UID Scoped
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Penyimpanan peribadi & sejarah normalizer disegerakkan ke akaun anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Info Strip */}
        <div className="px-5 py-2.5 bg-indigo-50/50 border-b border-indigo-100/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-indigo-950 font-semibold">{user?.displayName || 'Pengguna'}</span>
            <span className="text-indigo-400">•</span>
            <span className="text-indigo-700 font-mono text-[11px]">UID: {user?.uid.slice(0, 10)}...</span>
            <span className="text-indigo-400">•</span>
            <span className="text-[10px] font-bold bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded uppercase">
              {userProfile?.role || 'USER'}
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data terlindung dengan Firestore Security Rules</span>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Rekod ({records.length})
            </button>
            <button
              onClick={() => setFilter('saved')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                filter === 'saved'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Disimpan ({records.filter((r) => r.isSaved).length})</span>
            </button>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari dalam workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Records List Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 min-h-[250px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Sparkles className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
              <p className="text-xs">Memuatkan rekod peribadi...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <FolderLock className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {searchQuery
                  ? 'Tiada rekod sepadan dengan carian.'
                  : filter === 'saved'
                  ? 'Belum ada rekod bertanda bintang.'
                  : 'Workspace anda masih kosong.'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Gunakan butang "Simpan ke Workspace" di panel Output selepas memformat teks untuk menyimpan snippet ke sini.
              </p>
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-200 transition-all shadow-2xs group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                      {rec.mode.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rec.createdAt).toLocaleString('ms-MY', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => user && toggleSaveUserRecord(user.uid, rec.id, rec.isSaved)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        rec.isSaved
                          ? 'text-amber-500 hover:bg-amber-50'
                          : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                      }`}
                      title={rec.isSaved ? 'Buang daripada simpanan' : 'Simpan sebagai kegemaran'}
                    >
                      <Star className={`w-4 h-4 ${rec.isSaved ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => user && deleteUserRecord(user.uid, rec.id)}
                      className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Padam rekod"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Output Snippet */}
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono text-slate-800 break-words whitespace-pre-wrap max-h-24 overflow-y-auto mb-2 border border-slate-100">
                  {rec.formattedOutput}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecord(rec.rawInput, rec.mode);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 text-[11px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Guna Semula Dalam Editor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(rec.id, rec.formattedOutput)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      copiedId === rec.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                    }`}
                  >
                    {copiedId === rec.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {records.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Jumlah: {records.length} rekod</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Adakah anda pasti untuk mengosongkan semua rekod workspace anda?')) {
                  if (user) clearAllUserRecords(user.uid);
                }
              }}
              className="text-red-600 hover:text-red-700 font-medium hover:underline"
            >
              Kosongkan Semua
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
