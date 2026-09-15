import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '@/types/book';

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type PaymentMethodType = 'credit_card' | 'apple_pay' | 'cod';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

interface OrdersState {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  cancelOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  clearAllOrders: () => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (orderData) => {
        const randomDigits = Math.floor(10000 + Math.random() * 90000);
        const newOrder: Order = {
          ...orderData,
          id: `LUM-${randomDigits}`,
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          status: 'Processing',
        };

        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },

      cancelOrder: (orderId: string) => {
        set({ orders: get().orders.filter((o) => o.id !== orderId) });
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((o) => o.id === orderId);
      },

      clearAllOrders: () => {
        set({ orders: [] });
      },
    }),
    {
      name: 'lumina-orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
