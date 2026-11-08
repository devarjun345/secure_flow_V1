import { create } from 'zustand';
import type { ToastItem } from '@/components/ui/Toast';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  toasts: ToastItem[];
  modals: Record<string, boolean>;
  sidebarCollapsed: boolean;
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  toasts: [],
  modals: {},
  sidebarCollapsed: false,

  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    return id;
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  openModal: (id) => {
    set((state) => ({ modals: { ...state.modals, [id]: true } }));
  },

  closeModal: (id) => {
    set((state) => {
      const next = { ...state.modals };
      delete next[id];
      return { modals: next };
    });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
}));