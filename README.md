# 📚 LUMINA BOOKS — Playful Neo-Pop E-Commerce Bookstore & Digital Reader

[![React Native](https://img.shields.io/badge/React_Native-0.86+-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/State-Zustand_5-443E38?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![Reanimated](https://img.shields.io/badge/Animations-Reanimated_4-FF5722?style=for-the-badge&logo=framer&logoColor=white)](https://docs.swmansion.com/react-native-reanimated/)
[![Design System](https://img.shields.io/badge/Style-Neo--Pop_Gumroad-FFD027?style=for-the-badge&logoColor=18181B&labelColor=18181B)](https://github.com)

A state-of-the-art mobile commerce application and digital reading platform built with **React Native**, **Expo SDK 57**, and **TypeScript**. Designed in the **Playful Neo-Pop / Gumroad Aesthetic**, featuring crisp 1.8px–2px solid black borders, 2.5D hard offset shadows, high-energy color blocking, tactile micro-haptics, gesture interactions, and a comprehensive in-app **E-Reader**.

---

## 🎨 Visual Identity & Design System

The application follows the **Playful Neo-Pop / Gumroad** design language:

* 🩵 **Electric Sky Blue (`#38BDF8`)**: Featured on trending book showcases, circular back buttons, and sticky bottom dock bars.
* 🍊 **Tangerine Coral (`#FF6B4A`)**: Used for the home launcher button, floating dock capsules, shipping bars, and alert badges.
* 💛 **Cyber Sunshine Yellow (`#FFD027`)**: The primary high-contrast CTA color, used on 3D search slabs, active tab pills, review buttons, and checkout triggers.
* 🔴 **Sticker Red (`#EF4444`)**: Circular bookmark stickers, price tags, and urgent notifications.
* 🖤 **Crisp Black Outlines (`#18181B`)**: Consistent 1.8px–2px stroke applied to cards, buttons, steppers, and covers.
* 🧊 **2.5D Hard Offset Shadows**: Zero blur radius with solid black offsets (`x: 2-3px, y: 2-3px`) delivering a tactile sticker feel.

```typescript
// Core Tokens (src/constants/theme.ts)
export const Colors = {
  pop: {
    blue: '#38BDF8',      // Electric Sky Blue
    orange: '#FF6B4A',    // Tangerine Coral
    yellow: '#FFD027',    // Cyber Sunshine Yellow
    red: '#EF4444',       // Bookmark Red / Sale
    border: '#18181B',    // Crisp Outline
    dark: '#18181B',
    white: '#FFFFFF',
    mint: '#A7F3D0',
    lavender: '#E9D5FF',
  },
};

export const Shadows = {
  popSm: { shadowColor: '#18181B', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  popMd: { shadowColor: '#18181B', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  popLg: { shadowColor: '#18181B', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8 },
};
```

---

## 📱 Screens & Features

### 1. 🏠 Home Storefront (`src/app/(tabs)/index.tsx`)
* **Header Launcher**: Tangerine circle launcher (`#FF6B4A`) with a grid icon, message bubble indicator, and user profile avatar with black outline.
* **3D Neo-Pop Search Bar**: White pill input with a 1.8px solid black border and a Cyber Yellow 3D offset slab.
* **Category Selector**: Horizontally scrolling filter chips with black borders and active `#FFD027` selection state.
* **Curated Trending Showcase**: Electric Sky Blue (`#38BDF8`) rounded container showcasing cards for *Authority*, *Educated*, and *When Breath Becomes Air*.
* **Top E-Book Reading Spotlight**: Featured card spotlighting *Muscle Trovelutions* with book metadata, 5-star rating, and a Cyber Yellow `Detail` button.
* **Continue Reading Card**: Card with circular cover thumbnail, 5 stars, and a dashed orange reading progress ring (`65%`).
* **More Recommended Shelf**: Horizontal book shelf with product cards and square `[→]` navigation button.
* **Floating Capsule Tab Bar**: Tangerine floating dock with a Cyber Yellow active capsule pill (`Home`, `Explore`, `Cart`, `Library`, `Account`).

### 2. 📖 Book Details Screen (`src/app/book/[id].tsx`)
* **Neo-Pop Navigation**: Cyan Blue circular back button (`#38BDF8`) with 1.8px black border and option menu trigger.
* **Interactive Book Stage**: Centered book cover with pinch-to-zoom capabilities, overlapping white sheet card, and pinned red bookmark stamp (`#EF4444`).
* **3-Column Stats Capsule**: Quick metadata pill with `Rating ★ 4.1`, `120 Pages`, and `ENG` language badges.
* **Format Switcher Chips**: Interactive selection between `Paperback`, `Hardcover`, `E-Book`, and `Audiobook` with dynamic pricing updates.
* **Sample Chapter Preview**: Button to open the full-text in-app **Book Reader Modal**.
* **About the Author**: Author avatar, biography, and Cyber Yellow `Follow` button.
* **Customer Reviews Snippet**: Real-time aggregated rating breakdown, verified review cards, and a modal to submit new reviews.
* **Sticky Bottom Action Dock**: Electric Sky Blue dock with a white pill `QTY | - 2 +` stepper and Cyber Yellow `Add to Cart` CTA.

### 3. 🔍 Explore / Catalog Screen (`src/app/(tabs)/explore.tsx`)
* **Top E-Book Reading Banner**: Large spotlight card with book cover outline, ratings, pricing, and direct detail routing.
* **More Recommended 2-Column Grid**: Responsive book grid displaying covers, authors, titles, and price labels.

### 4. 🛒 Cart & Bag Screen (`src/app/(tabs)/cart.tsx`)
* **Dynamic Free Shipping Progress Bar**: Real-time progress bar with Cyan Blue delivery truck icon and Tangerine fill meter showing remaining threshold for free priority shipping.
* **Neo-Pop Cart Item Cards**: Hardcover thumbnails with solid borders, format tags, item prices, trash actions, and pill QTY steppers (`- 1 +`).
* **Pricing Summary Card**: Clean breakdown of Subtotal, Estimated Delivery, and Total, plus a Cyber Yellow `Proceed to Checkout` CTA.

### 5. 👤 Profile & VIP Account (`src/app/(tabs)/profile.tsx`)
* **Profile Header Card**: Circular profile avatar with 2px black border, verified checkmark badge, and Cyber Yellow `VIP MEMBER` pill.
* **Quick Stats Capsule**: 3-metric row tracking `12 Books Read`, `5-Day Streak 🔥`, and `15% Off VIP Perks`.
* **Pop-Color Menu Sections**: Outlined navigation items with color-coded badges (`#38BDF8` Order History, `#FF6B4A` Addresses, `#FFD027` Payment Methods, `#A7F3D0` Preferences, `#E9D5FF` Help).
* **Sign Out Action**: Neo-Pop button with hard offset shadow and haptic feedback.

### 6. 📚 My Library & Reading Shelf (`src/app/(tabs)/reading.tsx`)
* **Habit Stats Ribbon**: Reading streak tracker displaying `5-Day Streak`, `3.2h This Week`, and `4 Finished`.
* **Segmented Control**: Cyber Yellow active pill toggling between `Reading` (in-progress titles) and `Wishlist` (saved titles).
* **Swipe-to-Delete**: Swipe gestures on ongoing books powered by `react-native-gesture-handler`.
* **Wishlist Grid**: 2-column shelf of bookmarked titles.

### 7. 💳 Checkout & Digital Order Receipt (`src/app/checkout/index.tsx`)
* **3-Step Checkout Stepper**: Visual indicators for `1. SHIPPING` ➔ `2. PAYMENT` ➔ `3. CONFIRM`.
* **Interactive Credit Card Preview**: Stylized dark card with chip graphics, live cardholder name, expiry, and masked digits.
* **Digital Order Receipt Modal (`OrderReceiptModal.tsx`)**: Ticket receipt with a Mint Green `PAID IN FULL` stamp, dashed cut line, itemized summary, barcode graphic, and quick routing buttons.

### 8. 📖 In-App E-Reader Modal (`src/components/product/BookReaderModal.tsx`)
* **3 Reading Themes**: `Classic Light` (warm parchment), `Warm Sepia` (paper grain), and `OLED Dark` (pitch black).
* **Dynamic Typography**: Real-time `A-` / `A+` font scaling and font switcher (Editorial Serif vs. Modern Sans).
* **Reading Progress Tracker**: Live scroll percentage calculation with persistent state.

### 9. 🔔 Universal Neo-Pop Toast Notification (`src/components/ui/Toast.tsx`)
* Top-mounted spring-animated toast capsule with 1.8px black border and `popMd` hard shadow.
* Dynamic status icon badges (`Check`, `AlertTriangle`, `Info`) and optional Cyber Yellow action buttons.

---

## 🏗️ Software Architecture & Design Patterns

The codebase is organized around clean architectural and design patterns:

| Design Pattern | Implementation Location | Purpose |
| :--- | :--- | :--- |
| **Flux / Unidirectional Data Flow** | [`src/store/`](file:///c:/Users/Noufel/Documents/Web_Dev/MobileDev/LibApp/src/store) (Zustand) | Predictable, unidirectional state transitions for cart items, orders, auth, reviews, and reading progress. |
| **Observer / Pub-Sub** | [`toastStore.ts`](file:///c:/Users/Noufel/Documents/Web_Dev/MobileDev/LibApp/src/store/toastStore.ts) & [`Toast.tsx`](file:///c:/Users/Noufel/Documents/Web_Dev/MobileDev/LibApp/src/components/ui/Toast.tsx) | Any component can publish a notification; the root `ToastContainer` listens and triggers animated entry/exit. |
| **Container / Presentational** | `src/app/` vs. `src/components/` | Separates screen logic and data orchestration from pure presentation components. |
| **Decorator / Gesture Wrapper** | [`SwipeToDeleteRow.tsx`](file:///c:/Users/Noufel/Documents/Web_Dev/MobileDev/LibApp/src/components/gestures/SwipeToDeleteRow.tsx), [`ZoomableBookCover.tsx`](file:///c:/Users/Noufel/Documents/Web_Dev/MobileDev/LibApp/src/components/gestures/ZoomableBookCover.tsx) | Wraps standard cards with pan, swipe, and pinch gestures without polluting inner components. |
| **Facade Pattern** | Custom store hooks (`useCartStore`, `useAuthStore`) | Provides simplified APIs for cart totals, discounts, shipping thresholds, and checkout validation. |
| **Strategy Pattern** | [`CustomTabBar.tsx`](file:///c:/Users/Noufel/Documents/Web_Dev/MobileDev/LibApp/src/components/layout/CustomTabBar.tsx), [`Toast.tsx`](file:///c:/Users/Noufel/Documents/Web_Dev/MobileDev/LibApp/src/components/ui/Toast.tsx) | Resolves icons, colors, labels, and badges dynamically based on route names or notification types. |
| **Design Tokens (SSOT)** | [`theme.ts`](file:///c:/Users/Noufel/Documents/Web_Dev/MobileDev/LibApp/src/constants/theme.ts) | Centralized tokens for colors, shadows, border radii, and typography. |

---

## 📂 Project Directory Structure

```
LibApp/
├── src/
│   ├── app/                         # Expo Router file-based pages
│   │   ├── (tabs)/                  # Bottom tab navigator
│   │   │   ├── _layout.tsx          # Tab bar mount & route config
│   │   │   ├── index.tsx            # Screen 1: Home Storefront
│   │   │   ├── explore.tsx          # Screen 3: Explore / Top E-Books
│   │   │   ├── cart.tsx             # Screen 4: Cart & Bag
│   │   │   ├── reading.tsx          # Screen 6: Library & Wishlist
│   │   │   └── profile.tsx          # Screen 5: Profile & VIP Club
│   │   ├── book/
│   │   │   └── [id].tsx             # Screen 2: Book Details Screen
│   │   ├── checkout/
│   │   │   └── index.tsx            # Screen 7: Multi-Step Checkout
│   │   ├── orders/
│   │   │   └── index.tsx            # Order History & Past Purchases
│   │   ├── login.tsx                # Authentication & Guest Mode
│   │   └── _layout.tsx              # Root Layout with Font & Toast Mount
│   ├── components/
│   │   ├── checkout/
│   │   │   └── OrderReceiptModal.tsx# Digital Receipt Modal
│   │   ├── gestures/
│   │   │   ├── SwipeToDeleteRow.tsx # Swipe-to-delete gesture container
│   │   │   └── ZoomableBookCover.tsx# Pinch-to-zoom cover wrapper
│   │   ├── home/
│   │   │   ├── TrendingBooksCard.tsx# Electric Sky Blue trending shelf
│   │   │   └── SpotlightEbookCard.tsx# Top E-Book spotlight card
│   │   ├── layout/
│   │   │   ├── CustomTabBar.tsx     # Floating Tangerine dock
│   │   │   ├── HomeHeader.tsx       # Header with circular launcher
│   │   │   └── SectionHeader.tsx    # Section title with arrow button
│   │   ├── product/
│   │   │   ├── BookCard.tsx         # Universal book thumbnail card
│   │   │   ├── ContinueReadingCard.tsx# Reading progress card with ring
│   │   │   ├── BookReaderModal.tsx  # In-App 3-theme E-Reader
│   │   │   └── WriteReviewModal.tsx # Review submission modal
│   │   └── ui/
│   │       ├── Badge.tsx            # Product status badge
│   │       ├── CategorySelector.tsx # Horizontal category filter chips
│   │       ├── NeoPopSearchBar.tsx  # 3D Cyber Yellow offset search slab
│   │       └── Toast.tsx            # Universal Neo-Pop toast notification
│   ├── constants/
│   │   └── theme.ts                 # Neo-Pop color tokens, shadows, typography
│   ├── data/
│   │   ├── books.ts                 # Catalog dataset (Authority, Educated, etc.)
│   │   └── bookSamples.ts           # Excerpt texts for the in-app reader
│   ├── store/                       # Zustand atomic stores
│   │   ├── authStore.ts             # Auth session & current user
│   │   ├── cartStore.ts             # Cart items, quantities, shipping fee
│   │   ├── favoritesStore.ts        # Wishlist persistence
│   │   ├── ordersStore.ts           # Completed orders & receipts
│   │   ├── readingProgressStore.ts  # Reading themes, font scales, progress
│   │   ├── reviewsStore.ts          # Reviews & star ratings
│   │   └── toastStore.ts            # Global toast dispatching
│   └── types/
│       └── book.ts                  # TypeScript models & interfaces
├── app.json                         # Expo configuration
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript compiler configuration
└── README.md                        # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js 18+** installed on your system.
* **npm** or **yarn**.
* **Expo Go** on your iOS / Android physical device, or an iOS / Android simulator.

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

4. **Launch on your target device**:
   * **iOS Device**: Scan the QR code using the iOS Camera app (opens in Expo Go).
   * **Android Device**: Scan the QR code using the Expo Go app.
   * **Web Browser**: Press `w` in the terminal to launch the web preview.
   * **iOS Simulator**: Press `i` in the terminal.
   * **Android Emulator**: Press `a` in the terminal.

---

## 🛠️ Scripts & Quality Verification

* **Type Safety Check**:
  ```bash
  npx tsc --noEmit
  ```
* **Linting**:
  ```bash
  npm run lint
  ```

---

## 💻 Tech Stack Overview

* **Framework**: React Native 0.86, Expo SDK 57, Expo Router v4
* **Language**: TypeScript 5.3+
* **State Management**: Zustand 5
* **Animations & Physics**: React Native Reanimated 4, React Native Gesture Handler 2
* **Styling**: Vanilla React Native StyleSheet with Centralized Neo-Pop Design Tokens (`theme.ts`)
* **Typography**: Plus Jakarta Sans & Playfair Display (`@expo-google-fonts`)
* **Icons**: Lucide React Native (`lucide-react-native`)
* **Haptics**: Expo Haptics (`expo-haptics`)
* **Image Caching**: Expo Image (`expo-image`)

---

## 👨‍💻 Author

Crafted by **Noufel** — Designed with a passion for playful mobile interfaces, solid architecture, and tactile Neo-Pop design.
