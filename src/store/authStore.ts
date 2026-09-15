import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types/book';
import { CURRENT_USER } from '@/data/books';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  continueAsGuest: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: CURRENT_USER,
      isAuthenticated: true,
      isGuest: false,

      login: async (email: string, _password?: string) => {
        // Simulated network delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        const nameFromEmail = email.split('@')[0];
        const formattedName =
          nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

        set({
          user: {
            id: `user-${Date.now()}`,
            name: email === CURRENT_USER.email ? CURRENT_USER.name : formattedName,
            email: email.toLowerCase(),
            avatarUrl: CURRENT_USER.avatarUrl,
            isVerified: true,
            unreadNotifications: 3,
          },
          isAuthenticated: true,
          isGuest: false,
        });

        return true;
      },

      signup: async (name: string, email: string, _password?: string) => {
        await new Promise((resolve) => setTimeout(resolve, 600));

        set({
          user: {
            id: `user-${Date.now()}`,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
            isVerified: true,
            unreadNotifications: 1,
          },
          isAuthenticated: true,
          isGuest: false,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
        });
      },

      continueAsGuest: () => {
        set({
          user: null,
          isAuthenticated: false,
          isGuest: true,
        });
      },
    }),
    {
      name: 'lumina-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
