import React from 'react';
import { Sparkles } from 'lucide-react';
import { BRANDING } from '../config/branding';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const officialLogo = BRANDING.ASSETS.LOGO || BRANDING.ASSETS.APP_ICON;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  }[size];

  if (officialLogo) {
    return (
      <img
        src={officialLogo}
        alt={BRANDING.PLATFORM_NAME}
        referrerPolicy="no-referrer"
        className={`${sizeClasses} object-contain ${className}`}
      />
    );
  }

  // Safe, clean neutral fallback (No fake branding invented)
  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-indigo-200 shrink-0 ${className}`}
      title={BRANDING.PLATFORM_NAME}
    >
      <Sparkles className="w-5 h-5" />
    </div>
  );
}
