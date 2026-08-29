/**
 * SYNCROZZ BRANDING & ASSET CENTRAL CONFIGURATION
 *
 * ARCHITECTURE STANDARD:
 * 1. Centralized Single Source of Truth for Branding and Assets
 * 2. Plug & Replace Ready (No Structural Rebuild Required)
 * 3. Safe, Minimal, Neutral Fallback when assets are Pending
 * 4. PWA & Open Graph Readiness
 */

export interface BrandingConfig {
  // Platform Identity
  PLATFORM_NAME: string;
  PLATFORM_SHORT_NAME: string;
  PLATFORM_TAGLINE: string;
  PLATFORM_PRINCIPLE: string;
  PLATFORM_DESCRIPTION: string;
  VERSION: string;

  // Theme & Appearance
  THEME_COLOR: string;
  BACKGROUND_COLOR: string;

  // Assets (Set to official direct raw URL or asset path when provided; keep null/empty if pending)
  ASSETS: {
    /** Official Platform Logo (Header, Navbar, Splash) */
    LOGO: string | null;
    /** Square Application Icon */
    APP_ICON: string | null;
    /** Browser Favicon */
    FAVICON: string | null;
    /** PWA 192x192 Icon */
    PWA_ICON_192: string | null;
    /** PWA 512x512 Icon */
    PWA_ICON_512: string | null;
    /** Apple Touch Icon */
    APPLE_TOUCH_ICON: string | null;
    /** Open Graph Image for Social Sharing preview */
    OG_IMAGE: string | null;
  };

  // Support & Donation Locked Assets
  SUPPORT: {
    QR_IMAGE_URL: string;
    LABEL: string;
    TITLE: string;
    DESCRIPTION: string;
    NOTE: string;
  };
}

export const BRANDING: BrandingConfig = {
  PLATFORM_NAME: 'SYNCROZZ Input Normalizer',
  PLATFORM_SHORT_NAME: 'SYNCROZZ Normalizer',
  PLATFORM_TAGLINE: 'Paste. Clean. Format. Copy.',
  PLATFORM_PRINCIPLE: 'USER MASUKKAN DATA, SISTEM URUSKAN FORMAT.',
  PLATFORM_DESCRIPTION:
    'Utility web app untuk membersihkan dan memformat input teks mentah secara pantas, deterministic, dan selamat.',
  VERSION: 'AUTH v1',

  THEME_COLOR: '#4f46e5',
  BACKGROUND_COLOR: '#f8fafc',

  ASSETS: {
    // Official GitHub Raw Assets for INPUT Normalizer
    LOGO: 'https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/INPUTNormalizer/android-chrome-512x512.png',
    APP_ICON: 'https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/INPUTNormalizer/android-chrome-192x192.png',
    FAVICON: 'https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/INPUTNormalizer/favicon-32x32.png',
    PWA_ICON_192: 'https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/INPUTNormalizer/web-app-manifest-192x192.png',
    PWA_ICON_512: 'https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/INPUTNormalizer/web-app-manifest-512x512.png',
    APPLE_TOUCH_ICON: 'https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/INPUTNormalizer/apple-touch-icon.png',
    OG_IMAGE: 'https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/INPUTNormalizer/OGI.INPUTNormalizer.jpg',
  },

  SUPPORT: {
    QR_IMAGE_URL:
      'https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/Bank%20QR/QR%20RYT%20for%20Sumbangan.jpg',
    LABEL: 'Support ❤️',
    TITLE: 'Sokong Inovasi Ini ❤️',
    DESCRIPTION:
      'Platform ini dibangunkan secara berterusan bagi memudahkan warga pendidik dan komuniti. Sokongan ikhlas anda membantu kesinambungan pelayanan dan pembangunan inovasi seterusnya.',
    NOTE: 'DuitNow QR / Mana-mana Bank & e-Wallet Malaysia',
  },
};
