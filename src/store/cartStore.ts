import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, BookFormat, CartItem } from '@/types/book';

interface CartState {
  items: CartItem[];
  addItem: (book: Book, format: BookFormat) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book: Book, format: BookFormat) => {
        const { items } = get();
        const itemId = `${book.id}-${format}`;
        const existingItem = items.find((i) => i.id === itemId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: itemId,
                book,
                format,
                quantity: 1,
                price: book.price,
              },
            ],
          });
        }
      },

      removeItem: (itemId: string) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal > 50 ? 0 : 4.99; // Free delivery over $50
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },
    }),
    {
      name: 'lumina-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
