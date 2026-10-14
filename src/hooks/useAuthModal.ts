import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  defaultTab: 'signin' | 'signup';
  open: (tab?: 'signin' | 'signup') => void;
  close: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  defaultTab: 'signin',
  open: (tab = 'signin') => set({ isOpen: true, defaultTab: tab }),
  close: () => set({ isOpen: false }),
}));