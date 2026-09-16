export const Colors = {
  // Modern Clean Canvas & Surfaces
  background: '#FFFFFF',       // Pure clean white
  surface: '#FFFFFF',          // Crisp white card surface
  surfaceSubtle: '#FBF7F0',    // Warm cream hero card surface
  surfaceGray: '#F3F4F6',      // Light gray search & input background
  border: '#E5E7EB',           // Hairline subtle light gray border
  borderSubtle: '#F3F4F6',

  // Modern Clean Typography
  text: {
    primary: '#1A1A1A',        // Deep elegant charcoal
    secondary: '#6B7280',      // Balanced readable gray
    muted: '#9CA3AF',          // Soft subtle gray
    inverse: '#FFFFFF',
    accent: '#D97706',         // Warm golden amber
  },

  // Primary & Accent Brand Colors
  primary: '#D97706',          // Warm Golden Mustard / Amber
  primaryLight: '#FEF3C7',     // Soft Warm Gold tint
  primaryDark: '#B45309',

  // Warm Editorial & Refined Accent Palette
  neo: {
    yellow: '#D97706',         // Warm Golden Amber (replaces harsh canary)
    yellowDark: '#B45309',
    yellowLight: '#FEF3C7',
    orange: '#EA580C',
    green: '#10B981',          // Emerald soft green
    purple: '#8B5CF6',         // Soft Violet
    blue: '#3B82F6',           // Royal Blue
    pink: '#EC4899',
    cream: '#FBF7F0',          // Signature warm hero cream
  },

  // Status & Tag Colors
  status: {
    rating: '#D97706',
    starFill: '#FBBF24',
    discount: '#EF4444',
    badge: '#FEF3C7',
    badgeText: '#D97706',
    picked: '#EEF2FF',         // Soft Lilac / Sky Blue "Picked" pill
    pickedText: '#6366F1',
    notification: '#EF4444',
    success: '#10B981',
  },
} as const;

export const Typography = {
  serif: {
    semiBold: 'PlayfairDisplay_600SemiBold',
    bold: 'PlayfairDisplay_700Bold',
    extraBold: 'PlayfairDisplay_800ExtraBold',
  },
  sans: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
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
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  xxl: 24,
  full: 9999,
} as const;

// Soft Ambient Drop Shadows (Clean, subtle, refined)
export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  button: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  floatingBar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  heroCover: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  bookCover: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;
