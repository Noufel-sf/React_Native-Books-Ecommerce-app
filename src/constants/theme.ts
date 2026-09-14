export const Colors = {
  // Editorial Parchment & Warm Papers
  background: '#F8F5EE',       // App main background - warm cream
  surface: '#FFFFFF',          // Card & elevated elements background
  surfaceSubtle: '#F3EFE6',    // Secondary cards / inputs
  surfaceHighlight: '#FAF7F2', // Hover / pressed state
  border: '#E8E1D5',           // Soft paper dividers and borders
  borderSubtle: '#F0EBE1',

  // Deep Espresso & Ink Typographic Hierarchy
  text: {
    primary: '#1A1816',        // Deepest charcoal/espresso for main headers & titles
    secondary: '#5C544B',      // Warm charcoal for descriptions & subtitles
    muted: '#8C8276',          // Muted taupe for meta, dates, badges
    inverse: '#FFFFFF',        // White text on dark/gold buttons
    accent: '#B87826',         // Gold/amber editorial accent text
  },

  // Rich Warm Amber / Honey Gold Accents (from reference image)
  accent: {
    DEFAULT: '#D48C2B',
    hover: '#BC761E',
    light: '#F8EFE0',          // Soft gold pill badge background
    border: '#E8D4B8',
    gradientStart: '#E8A748',
    gradientEnd: '#B8731F',
  },

  // Status & Utility Colors
  status: {
    rating: '#E89F2A',         // Star rating gold
    discount: '#C94A3D',       // Crimson red discount badge
    badge: '#FAF1E3',          // "READ NOW" badge background
    badgeText: '#A86C1D',      // "READ NOW" badge text
    notification: '#E04838',   // Bell alert red dot
    success: '#3A8A5B',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  '2xl': 28,
  full: 9999,
} as const;

// Realistic 3D Book & Card Shadow Tokens
export const Shadows = {
  sm: {
    shadowColor: '#2B231D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2B231D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  // 3D Perspective Book Cover Drop Shadow
  bookCover: {
    shadowColor: '#1A1208',
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 10,
  },
  heroCover: {
    shadowColor: '#100B06',
    shadowOffset: { width: 8, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 14,
  },
  floatingBar: {
    shadowColor: '#2B231D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;
