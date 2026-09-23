export const Colors = {
  // Luxury Editorial Canvas & Surfaces
  canvas: '#F8F9FA',           // Refined porcelain canvas for subtle contrast
  background: '#F8F9FA',       // Default screen background
  surface: '#FFFFFF',          // Elevated crisp card surface
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#FBF7F0',    // Warm cream hero card surface
  surfaceWarm: '#FAF6F0',      // Warm champagne tint
  surfaceGlass: 'rgba(255, 255, 255, 0.88)',
  surfaceGray: '#F3F4F6',      // Light gray search & input background
  border: '#EAEBEF',           // Hairline subtle light gray border
  borderSubtle: '#F3F4F6',
  borderGlass: 'rgba(255, 255, 255, 0.6)',

  // Editorial Typography
  text: {
    primary: '#111827',        // Deep, rich obsidian
    secondary: '#4B5563',      // Balanced readable slate
    muted: '#9CA3AF',          // Soft subtle gray
    light: '#6B7280',
    inverse: '#FFFFFF',
    accent: '#D97706',         // Warm golden amber
    coral: '#E05345',          // Vibrant editorial coral
  },

  // Primary & Accent Brand Colors
  primary: '#D97706',          // Warm Golden Mustard / Amber
  primaryLight: '#FEF3C7',     // Soft Warm Gold tint
  primaryDark: '#B45309',
  accentCoral: '#E05345',      // Editorial Coral
  accentNavy: '#0F172A',       // Luxury Midnight
  accentEmerald: '#059669',    // Forest Emerald

  // Rich Curated Genre Palette (For discovery tiles)
  genre: {
    mind: { bg: '#FEF3C7', text: '#B45309', gradient: ['#F59E0B', '#D97706'] },
    fiction: { bg: '#EDE9FE', text: '#6D28D9', gradient: ['#8B5CF6', '#6D28D9'] },
    wealth: { bg: '#ECFDF5', text: '#047857', gradient: ['#10B981', '#059669'] },
    romance: { bg: '#FCE7F3', text: '#BE185D', gradient: ['#EC4899', '#BE185D'] },
    tech: { bg: '#E0F2FE', text: '#0369A1', gradient: ['#0284C7', '#0369A1'] },
  },

  // Warm Editorial & Refined Accent Palette
  neo: {
    yellow: '#D97706',
    yellowDark: '#B45309',
    yellowLight: '#FEF3C7',
    orange: '#EA580C',
    green: '#10B981',
    purple: '#8B5CF6',
    blue: '#3B82F6',
    pink: '#EC4899',
    cream: '#FBF7F0',
  },

  // Playful Neo-Pop / Gumroad Signature Palette
  pop: {
    blue: '#38BDF8',           // Electric Sky Blue (Trending card & Detail dock)
    blueLight: '#E0F2FE',
    orange: '#FF6B4A',         // Tangerine Coral (Floating dock & grid icon)
    orangeLight: '#FFEDD5',
    yellow: '#FFD027',         // Cyber Sunshine Yellow (Search slab, Explore tab, CTA)
    yellowLight: '#FEF9C3',
    red: '#EF4444',            // Red price & bookmark stamp
    border: '#18181B',         // Crisp 1.5px/2px solid black outline
    cardBg: '#FFFFFF',
    canvas: '#F9FAFB',
  },

  // Status & Tag Colors
  status: {
    rating: '#D97706',
    starFill: '#FBBF24',
    discount: '#EF4444',
    badge: '#FEF3C7',
    badgeText: '#D97706',
    picked: '#EEF2FF',
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

// Realistic Ambient & Physical Book Drop Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  card: {
    shadowColor: '#1A1817',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#1A1817',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  button: {
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  floatingDock: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  floatingBar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  heroCover: {
    shadowColor: '#1A1817',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  bookCover: {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  bookShelf: {
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  glow: {
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  popSm: {
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  popMd: {
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  popLg: {
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
} as const;
