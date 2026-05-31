import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIStore {
  hideAmounts: boolean;
  toggleHideAmounts: () => void;
  isAddAssetModalOpen: boolean;
  setAddAssetModalOpen: (val: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      hideAmounts: false,
      toggleHideAmounts: () => set((state) => ({ hideAmounts: !state.hideAmounts })),
      isAddAssetModalOpen: false,
      setAddAssetModalOpen: (val) => set({ isAddAssetModalOpen: val }),
    }),
    {
      name: 'ui-preferences',
    }
  )
);
