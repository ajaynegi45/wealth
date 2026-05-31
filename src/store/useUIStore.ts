import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIStore {
  hideAmounts: boolean;
  toggleHideAmounts: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      hideAmounts: false,
      toggleHideAmounts: () => set((state) => ({ hideAmounts: !state.hideAmounts })),
    }),
    {
      name: 'ui-preferences',
    }
  )
);
