import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BookReview {
  id: string;
  bookId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 - 5
  title: string;
  comment: string;
  date: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
}

interface ReviewsState {
  reviews: BookReview[];
  helpfulMap: Record<string, boolean>; // reviewId -> boolean
  addReview: (reviewData: Omit<BookReview, 'id' | 'date' | 'helpfulCount'>) => BookReview;
  toggleHelpful: (reviewId: string) => void;
  getReviewsForBook: (bookId: string) => BookReview[];
}

const INITIAL_SEED_REVIEWS: BookReview[] = [
  {
    id: 'rev-1',
    bookId: 'the-48-laws-of-power',
    userName: 'Alexander Wright',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'A masterclass in human psychology & statecraft',
    comment:
      'Greene synthesizes thousands of years of historical maneuvers into ruthless, brilliant truths. Whether you agree with the moral stance or not, understanding these laws is essential for self-defense in modern corporate and social environments.',
    date: 'Sep 12, 2026',
    helpfulCount: 42,
    isVerifiedPurchase: true,
  },
  {
    id: 'rev-2',
    bookId: 'the-48-laws-of-power',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    title: 'Fascinating historical anecdotes on every page',
    comment:
      'The storytelling alone is worth the price of admission. The breakdown of Louis XIV, Talleyrand, and Sun Tzu makes every chapter read like an epic chronicle.',
    date: 'Aug 29, 2026',
    helpfulCount: 19,
    isVerifiedPurchase: true,
  },
  {
    id: 'rev-3',
    bookId: 'atomic-habits',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'The 1% rule completely shifted my routine',
    comment:
      'Instead of focusing on monumental shifts, James Clear proves that tiny compounding behaviors create massive change. Clear, actionable, and grounded in real behavioral science.',
    date: 'Sep 4, 2026',
    helpfulCount: 56,
    isVerifiedPurchase: true,
  },
  {
    id: 'rev-4',
    bookId: 'cant-hurt-me',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Raw, visceral, and genuinely life-altering',
    comment:
      'David Goggins does not sugarcoat anything. His 40% rule and the concept of callous your mind have pushed me through marathon training when everything in me wanted to quit.',
    date: 'Aug 18, 2026',
    helpfulCount: 38,
    isVerifiedPurchase: true,
  },
  {
    id: 'rev-5',
    bookId: 'the-rational-male',
    userName: 'Damon Hayes',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Essential framework for interpersonal dynamics',
    comment:
      'Rollo provides a deeply analytical, psychological framework that strips away romantic idealism and explains human behavior as it actually occurs in the real world.',
    date: 'Jul 22, 2026',
    helpfulCount: 27,
    isVerifiedPurchase: true,
  },
];

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: INITIAL_SEED_REVIEWS,
      helpfulMap: {},

      addReview: (reviewData) => {
        const randomId = Math.floor(1000 + Math.random() * 9000);
        const newReview: BookReview = {
          ...reviewData,
          id: `rev-${Date.now()}-${randomId}`,
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          helpfulCount: 0,
        };

        set({ reviews: [newReview, ...get().reviews] });
        return newReview;
      },

      toggleHelpful: (reviewId: string) => {
        const { helpfulMap, reviews } = get();
        const isCurrentlyHelpful = !!helpfulMap[reviewId];

        set({
          helpfulMap: {
            ...helpfulMap,
            [reviewId]: !isCurrentlyHelpful,
          },
          reviews: reviews.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  helpfulCount: isCurrentlyHelpful
                    ? Math.max(0, r.helpfulCount - 1)
                    : r.helpfulCount + 1,
                }
              : r
          ),
        });
      },

      getReviewsForBook: (bookId: string) => {
        return get().reviews.filter((r) => r.bookId === bookId);
      },
    }),
    {
      name: 'lumina-reviews-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
