import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  favorites: string[]; // Book IDs
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Pre-populate with one favorite matching the reference design (e.g. 'queen-of-nothing')
      favorites: ['queen-of-nothing', 'the-secret-history'],

      toggleFavorite: (bookId: string) => {
        const { favorites } = get();
        const exists = favorites.includes(bookId);
        set({
          favorites: exists
            ? favorites.filter((id) => id !== bookId)
            : [...favorites, bookId],
        });
      },

      isFavorite: (bookId: string) => {
        return get().favorites.includes(bookId);
      },
    }),
    {
      name: 'lumina-favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
