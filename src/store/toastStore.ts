import { create } from 'zustand';

export interface ToastData {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'error';
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastState {
  currentToast: ToastData | null;
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  hideToast: () => void;
}

let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  currentToast: null,

  showToast: (toast) => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }

    const newToast: ToastData = {
      ...toast,
      id: `toast-${Date.now()}`,
      duration: toast.duration ?? 3500,
    };

    set({ currentToast: newToast });

    timeoutHandle = setTimeout(() => {
      set({ currentToast: null });
    }, newToast.duration);
  },

  hideToast: () => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    set({ currentToast: null });
  },
}));
