import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ReaderTheme = 'light' | 'sepia' | 'dark';
export type ReaderFont = 'serif' | 'sans';

export interface BookProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  progressPercent: number; // 0 to 100
  lastChapterIndex: number;
  lastReadTimestamp: number;
}

interface ReadingProgressState {
  progressMap: Record<string, BookProgress>;
  bookmarks: Record<string, boolean>; // bookId -> bookmarked
  theme: ReaderTheme;
  fontSize: number; // 14 to 24
  fontFamily: ReaderFont;
  lineSpacing: number; // 1.4 to 2.0

  // Actions
  setTheme: (theme: ReaderTheme) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (font: ReaderFont) => void;
  setLineSpacing: (spacing: number) => void;
  toggleBookmark: (bookId: string) => boolean;
  isBookmarked: (bookId: string) => boolean;
  updateProgress: (
    bookId: string,
    progress: {
      currentPage?: number;
      totalPages?: number;
      progressPercent: number;
      lastChapterIndex?: number;
    }
  ) => void;
  getProgress: (bookId: string) => BookProgress | undefined;
}

const INITIAL_PROGRESS: Record<string, BookProgress> = {
  'atomic-habits': {
    bookId: 'atomic-habits',
    currentPage: 144,
    totalPages: 320,
    progressPercent: 45,
    lastChapterIndex: 0,
    lastReadTimestamp: Date.now() - 3600000,
  },
  'cant-hurt-me': {
    bookId: 'cant-hurt-me',
    currentPage: 102,
    totalPages: 364,
    progressPercent: 28,
    lastChapterIndex: 0,
    lastReadTimestamp: Date.now() - 86400000,
  },
  'the-48-laws-of-power': {
    bookId: 'the-48-laws-of-power',
    currentPage: 68,
    totalPages: 452,
    progressPercent: 15,
    lastChapterIndex: 0,
    lastReadTimestamp: Date.now() - 172800000,
  },
};

export const useReadingProgressStore = create<ReadingProgressState>()(
  persist(
    (set, get) => ({
      progressMap: INITIAL_PROGRESS,
      bookmarks: {
        'atomic-habits': true,
      },
      theme: 'light',
      fontSize: 17,
      fontFamily: 'serif',
      lineSpacing: 1.6,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize: Math.max(13, Math.min(24, fontSize)) }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setLineSpacing: (lineSpacing) => set({ lineSpacing }),

      toggleBookmark: (bookId) => {
        const current = !!get().bookmarks[bookId];
        const next = !current;
        set({
          bookmarks: {
            ...get().bookmarks,
            [bookId]: next,
          },
        });
        return next;
      },

      isBookmarked: (bookId) => {
        return !!get().bookmarks[bookId];
      },

      updateProgress: (bookId, { currentPage, totalPages, progressPercent, lastChapterIndex }) => {
        const existing = get().progressMap[bookId];
        const currentTotal = totalPages ?? existing?.totalPages ?? 300;
        const boundedPercent = Math.max(0, Math.min(100, Math.round(progressPercent)));
        const calculatedPage =
          currentPage ?? Math.max(1, Math.round((boundedPercent / 100) * currentTotal));

        set({
          progressMap: {
            ...get().progressMap,
            [bookId]: {
              bookId,
              currentPage: calculatedPage,
              totalPages: currentTotal,
              progressPercent: boundedPercent,
              lastChapterIndex: lastChapterIndex ?? existing?.lastChapterIndex ?? 0,
              lastReadTimestamp: Date.now(),
            },
          },
        });
      },

      getProgress: (bookId) => {
        return get().progressMap[bookId];
      },
    }),
    {
      name: 'lumina-reading-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
