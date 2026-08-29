import { useState } from 'react';
import {
  Sparkles,
  LogOut,
  FolderLock,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon } from './GoogleIcon';
import { BrandLogo } from './BrandLogo';
import { BRANDING } from '../config/branding';

interface HeaderProps {
  onOpenWorkspace: () => void;
}

export function Header({ onOpenWorkspace }: HeaderProps) {
  const { user, userProfile, loading, signInWithGoogle, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Title linked to Central Branding */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  INPUT <span className="text-indigo-600 font-semibold">NORMALIZER</span>
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {BRANDING.VERSION}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                {BRANDING.PLATFORM_TAGLINE}
              </p>
            </div>
          </div>

          {/* Auth & Workspace Controls */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {loading ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Mengesahkan sesi...</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2">
                {/* My Workspace Button */}
                <button
                  id="open-workspace-btn"
                  type="button"
                  onClick={onOpenWorkspace}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-semibold transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title="Buka Ruang Kerja Peribadi anda"
                >
                  <FolderLock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>My Workspace</span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Avatar'}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                      {user.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-30 animate-fade-in"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-slate-100 text-xs">
                        <p className="font-bold text-slate-800 truncate">{user.displayName}</p>
                        <p className="text-slate-500 truncate text-[11px]">{user.email}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 uppercase">
                            Role: {userProfile?.role || 'USER'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            UID: {user.uid.slice(0, 6)}...
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onOpenWorkspace}
                        className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2"
                      >
                        <FolderLock className="w-4 h-4 text-indigo-600" />
                        <span>Buka My Workspace</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => signOut()}
                        className="w-full px-3.5 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Log Keluar (Sign Out)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Standard SYNCROZZ Google Sign In CTA */
              <button
                id="google-signin-btn"
                type="button"
                onClick={() => signInWithGoogle()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Log masuk dengan Google untuk menyimpan dan mengakses data peribadi anda"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Continue with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
