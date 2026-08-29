import React, { useState } from 'react';
import {
  X,
  Heart,
  Download,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Check,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { BRANDING } from '../config/branding';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const qrImageUrl = BRANDING.SUPPORT.QR_IMAGE_URL;

  const handleSaveQR = async () => {
    try {
      setDownloading(true);
      // Fetch as blob to trigger direct native download
      const response = await fetch(qrImageUrl, {
        mode: 'cors',
      });
      if (!response.ok) throw new Error('Network response not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'QR RYT for Sumbangan.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (error) {
      console.warn('Direct blob download fallback:', error);
      // Reliable fallback: standard download trigger or direct target open
      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.download = 'QR RYT for Sumbangan.jpg';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all">
        {/* Modal Top Header with Close Button */}
        <div className="relative px-5 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between bg-gradient-to-b from-slate-50/80 to-white">
          <div className="flex-1 pr-6 text-center sm:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/70 mb-2">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>Sumbangan Sukarela</span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
              <span>Sokong Inovasi Ini</span>
              <span className="text-rose-500">❤️</span>
            </h2>

            {/* Description */}
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {BRANDING.SUPPORT.DESCRIPTION}
            </p>
          </div>

          {/* Close button X */}
          <button
            id="close-support-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-label="Tutup popup sokongan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Focus on QR Display */}
        <div className="p-5 overflow-y-auto space-y-4 flex flex-col items-center text-center">
          {/* QR Container */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-100 shadow-md flex flex-col items-center max-w-[260px] sm:max-w-[280px] w-full">
            <div className="relative w-full aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
              <img
                src={qrImageUrl}
                alt="DuitNow QR RYT for Sumbangan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-1 rounded-lg select-none"
                loading="eager"
              />
            </div>
          </div>

          {/* Support Information Under QR */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
              {BRANDING.SUPPORT.NOTE}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              RM1 pun amat dihargai 👏
            </p>
          </div>

          {/* Save QR Code Button */}
          <button
            id="save-qr-code-btn"
            type="button"
            disabled={downloading}
            onClick={handleSaveQR}
            className={`w-full max-w-xs flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              downloadSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white shadow-indigo-200 focus:ring-indigo-500 cursor-pointer'
            }`}
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Menyimpan QR...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>QR Berjaya Disimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Save QR Code</span>
              </>
            )}
          </button>

          {/* How To Pay Accordion */}
          <div className="w-full max-w-sm rounded-xl border border-slate-200/90 bg-slate-50/70 overflow-hidden text-left transition-all">
            <button
              id="how-to-pay-accordion-btn"
              type="button"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cara Bayar Guna Galeri (How To Pay)</span>
              </div>
              {isAccordionOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isAccordionOpen && (
              <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-200/60 text-xs text-slate-600 space-y-2 animate-fade-in bg-white">
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                  <li className="pl-1">
                    <strong className="text-slate-800">Save QR Code</strong> ke device anda.
                  </li>
                  <li className="pl-1">
                    Buka aplikasi banking / e-wallet kegemaran anda.
                  </li>
                  <li className="pl-1">
                    Pilih fungsi <strong>QR payment</strong> atau <strong>scan from gallery</strong>.
                  </li>
                  <li className="pl-1">
                    Pilih imej QR yang telah disimpan tadi.
                  </li>
                  <li className="pl-1">
                    Lengkapkan pembayaran mengikut langkah aplikasi bank / e-wallet.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer: Secondary Return Action */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-center">
          <button
            id="return-to-syncrozz-btn"
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke SYNCROZZ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
