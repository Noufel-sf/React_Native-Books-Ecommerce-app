export type BookFormat = 'Hardcover' | 'Paperback' | 'E-Book' | 'Audiobook';

export type BookBadge = 'Popular' | 'Bestseller' | 'New' | 'Trending' | 'Read Now' | 'Picked';

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorBio?: string;
  originalYear?: number;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  badge?: BookBadge;
  picked?: boolean;
  hasCrown?: boolean;
  genres: string[];
  pages: number;
  audioLength?: string;
  language: string;
  availableFormats: BookFormat[];
  description: string;
  publisher: string;
  isbn: string;
  inStock: boolean;
  fileSize?: string;
  purchasesCount?: string;
  releaseDate?: string;
  ratingBreakdown?: { 5: number; 4: number; 3: number; 2: number; 1: number };
  readingProgress?: number; // 0 - 100%
  currentPage?: number;
}

export interface GenreCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface CartItem {
  id: string; // unique item id: `${bookId}-${format}`
  book: Book;
  format: BookFormat;
  quantity: number;
  price: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isVerified: boolean;
  unreadNotifications: number;
}
