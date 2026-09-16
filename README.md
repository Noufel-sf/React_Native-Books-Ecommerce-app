# 📚 LUMINA BOOKS — Modern Minimalist Editorial Bookstore & E-Reader

[![React Native](https://img.shields.io/badge/React_Native-0.76+-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_52-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/State-Zustand_5-443E38?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![Reanimated](https://img.shields.io/badge/Animations-Reanimated_3-FF5722?style=for-the-badge&logo=framer&logoColor=white)](https://docs.swmansion.com/react-native-reanimated/)
[![Design System](https://img.shields.io/badge/Style-Modern_Minimalist-D97706?style=for-the-badge&logoColor=white&labelColor=1A1A1A)](https://github.com)

A state-of-the-art mobile commerce experience and digital reading platform built for book lovers. Engineered with a **Modern Minimalist Editorial Bookstore** aesthetic, pure white `#FFFFFF` canvas, warm cream `#FBF7F0` hero surfaces, golden amber `#D97706` accents, tactile micro-haptics, smooth gesture interactions, and a fully customizable **In-App E-Reader**.

---

## 📸 Core Highlights

| In-App E-Reader (3 Themes) | Interactive Checkout & Receipt | Sticky Purchase & Formats |
| :---: | :---: | :---: |
| OLED Dark, Sepia, & Classic Light with live scroll progress tracking | Multi-step shipping, interactive live credit card graphic, and digital receipt | Dynamic format picker (`Hardcover`, `E-Book`, etc.) with sticky bottom bar |

---

## ⚡ Key Features

### 📖 1. Interactive In-App E-Reader & Sample Preview
- **3 Adaptive Reading Themes**:
  - `Classic Light`: Crisp typography on warm parchment cream (`#FAF5EE`).
  - `Warm Sepia Paper`: Natural paper grain aesthetic for eye comfort (`#F5EFE0`).
  - `OLED Dark Mode`: Deep pitch-black canvas (`#121212`) with refined amber accents.
- **Dynamic Typography Scaling**: Real-time `A-` / `A+` font scaler (13px to 24px) and instant **Editorial Serif** (Playfair Display) vs **Modern Sans** (Plus Jakarta Sans) font switcher.
- **Live Scroll Progress Tracking**: Calculates read percentage on the fly and automatically syncs with Zustand + AsyncStorage.
- **Authentic Excerpts & Chapter Jumps**: Rich multi-chapter previews for bestsellers (*The Psychology Of Money*, *The Design of Everyday Things*, *Sapiens*, *Atomic Habits*, *Fairy Tale*, etc.) with pull-quotes and chapter bookmarks.

### 🛍️ 2. Comprehensive E-Commerce Experience
- **Dynamic Format Switcher**: Real-time price and format updates between `Hardcover`, `Paperback`, `E-Book`, and `Audiobook`.
- **Sticky Purchase Bar**: Automatically slides into view as the user scrolls past hero info for effortless conversions.
- **Full Multi-Step Checkout Flow**:
  1. Shipping Address validation with real-time field status.
  2. Payment Method selection with **interactive live credit card flip graphic**.
  3. Order Review with subtotal, taxes, shipping, and total calculation.
- **Digital Order Receipt**: Minimalist digital receipt ticket modal featuring order ID (`LUM-XXXXX`), status badge, and item breakdown.
- **Persistent Order History**: Re-open past receipts anytime from the user profile.

### ⭐ 3. Community Reviews & Ratings Feed
- **Interactive 5-Star Rating Picker**: Haptic-assisted star ratings with visual hover states.
- **Review Submission Modal**: Flex-constrained layout with sticky footer actions to prevent keyboard obstruction.
- **Dynamic Breakdown Bars**: Live aggregated score distribution from 5-star to 1-star ratings.

### 🎨 4. Gestures & Micro-Interactions
- **Pinch-to-Zoom Book Covers**: Smooth 2-finger zoom and pan with spring-back physics powered by `react-native-reanimated` and `react-native-gesture-handler`.
- **Swipe-to-Delete Reading Rows**: Gesture-based swipe removal on the library shelf with tactile delete cues.
- **Universal Floating Toast System**: Global feedback notification bar with direct action buttons (`VIEW BAG`, `DISMISS`).

### 👤 5. User Authentication & Profile
- Toggle between Sign In and Sign Up with password masking and guest browsing modes.
- Profile dashboard displaying books completed, wishlist count, active reading streak, and past orders.

---

## 🎨 Modern Minimalist Editorial Bookstore Design System

The application features a refined, clean aesthetic with soft rounded geometry, warm hero cards, and ambient drop shadows:

```typescript
// Core Design Tokens (src/constants/theme.ts)
export const Colors = {
  background: '#FFFFFF',        // Pure white clean canvas
  surface: '#FFFFFF',           // Elevated white surfaces
  surfaceHero: '#FBF7F0',       // Warm cream hero card surface
  primary: '#D97706',           // Golden Amber accent
  textPrimary: '#1A1A1A',       // Deep charcoal typography
  textSecondary: '#6B7280',     // Subtle slate gray text
  borderSubtle: '#F3F4F6',      // Delicate hairline dividers
  badgePicked: '#F3E8FF',       // Soft lilac pill badge
  badgePopular: '#EFF6FF',      // Soft blue pill badge
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  sm:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  card:   { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  hero:   { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 6 },
  floating:{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 8 },
};
```

---

## 🏗️ Architecture & State Management

All domain state is decoupled into reactive, independent **Zustand** stores with **AsyncStorage** offline persistence:

```
src/
├── app/                     # Expo Router file-based routes
│   ├── (tabs)/              # Persistent bottom navigation tabs
│   │   ├── index.tsx        # Discover / Home storefront
│   │   ├── explore.tsx      # Filterable catalog & search
│   │   ├── reading.tsx      # My Library & Wishlist shelf
│   │   ├── cart.tsx         # Cart bag with stepper & voucher
│   │   └── profile.tsx      # User profile, reading stats, settings
│   ├── book/[id].tsx        # Deep-dive product detail screen
│   ├── checkout/index.tsx   # 3-step checkout wizard
│   ├── orders/index.tsx     # Order history with digital receipts
│   └── login.tsx            # Authentication screen
├── components/
│   ├── checkout/            # OrderReceiptModal, PaymentCard
│   ├── gestures/            # ZoomableBookCover, SwipeToDeleteRow
│   ├── layout/              # CustomTabBar, HomeHeader
│   ├── product/             # BookCard, ContinueReadingCard, BookReaderModal, ReviewsFeed
│   └── ui/                  # Badge, Toast, Button
├── data/
│   ├── books.ts             # Rich catalog dataset
│   └── bookSamples.ts       # Full-text sample chapters & quotes
├── store/                   # Reactive Zustand Stores
│   ├── authStore.ts         # User authentication & session
│   ├── cartStore.ts         # Cart items, quantities, subtotal
│   ├── favoritesStore.ts    # Wishlist bookmarking
│   ├── ordersStore.ts       # Order lifecycle & receipt storage
│   ├── readingProgressStore.ts # E-reader themes, fonts, scroll progress
│   ├── reviewsStore.ts      # User reviews & star ratings
│   └── toastStore.ts        # Global feedback toasts
└── constants/
    └── theme.ts             # Neobrutalist design tokens & typography
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go on iOS/Android or an emulator

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Noufel-sf/React_Native-Books-Ecommerce-app.git
   cd React_Native-Books-Ecommerce-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Metro development server**:
   ```bash
   npx expo start
   ```

4. **Run on your device**:
   - Scan the QR code using **Expo Go** (Android) or the **Camera app** (iOS).
   - Or press `a` for Android Emulator, `i` for iOS Simulator, or `w` for Web.

### Quality & Type Checking
Verify clean TypeScript compilation with:
```bash
npx tsc --noEmit
```

---

## 💻 Tech Stack Summary

| Technology | Purpose |
| :--- | :--- |
| **React Native 0.76** | Universal cross-platform native framework |
| **Expo SDK 52** | Native modules, splash screens, haptics, image caching |
| **Expo Router v4** | File-based typed routing & deep linking |
| **Zustand 5** | High-performance atomic state management |
| **AsyncStorage** | Offline-first persistence for cart, library, progress & orders |
| **React Native Reanimated 3** | 60 FPS declarative UI animations |
| **React Native Gesture Handler** | Native pinch, pan, and swipe gesture recognition |
| **Expo Haptics** | Tactile sensory feedback on interactions |
| **Lucide Icons** | Consistent icon glyphs with neobrutalist stroke weights |

---

## 👨‍💻 Author

Crafted by **Noufel** — Designed with passion for tactile mobile experiences, clean software architecture, and brutalist design.
