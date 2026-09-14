export const Colors = {
  // Neobrutalist Canvas & Core
  background: '#FFFDF5',       // Warm energetic canvas
  surface: '#FFFFFF',          // Crisp white card surface
  surfaceSubtle: '#F4EFE6',
  border: '#000000',           // Signature thick black outline

  // Deep Solid Black Typography
  text: {
    primary: '#000000',        // Pure black for maximum punch
    secondary: '#222222',
    muted: '#666666',
    inverse: '#FFFFFF',
    accent: '#000000',
  },

  // High-Energy Neobrutalist Color Palette
  neo: {
    yellow: '#FFDE59',         // Electric Canary (Primary action)
    yellowDark: '#ECC628',
    orange: '#FF6B4A',         // Punchy Coral/Orange
    green: '#2EEC96',          // Slime / Mint Green
    purple: '#C4A1FF',         // Electric Lavender
    blue: '#68B5FF',           // Sky Pop Blue
    pink: '#FFA6D5',           // Bubblegum Pink
    cream: '#FAF7EE',
  },

  // Status Colors
  status: {
    rating: '#000000',
    starFill: '#FFDE59',
    discount: '#FF5733',
    badge: '#FFDE59',
    badgeText: '#000000',
    notification: '#FF4136',
    success: '#2EEC96',
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
  sm: 0,
  md: 0,
  lg: 0,
  xl: 0,
  '2xl': 0,
  full: 0,
} as const;

// Signature Neobrutalist Hard Black Drop Shadows (No blur, crisp offset)
export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  button: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  floatingBar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  heroCover: {
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  bookCover: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
} as const;
