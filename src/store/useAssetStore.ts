import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserAssets } from '@/app/actions/assets';

export interface AssetStore {
  assets: any[];
  lastFetched: number | null;
  isLoading: boolean;
  fetchAssets: (force?: boolean) => Promise<void>;
  invalidate: () => void;
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: [],
      lastFetched: null,
      isLoading: false,
      
      fetchAssets: async (force = false) => {
        const { lastFetched, assets } = get();
        const now = Date.now();
        
        // Use cache if it exists, is not empty, and is less than 24 hours old
        // 24 hours = 24 * 60 * 60 * 1000 = 86400000 ms
        if (!force && lastFetched && assets.length > 0 && (now - lastFetched < 86400000)) {
          return;
        }

        set({ isLoading: true });
        try {
          const data = await getUserAssets();
          set({ assets: data, lastFetched: now, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch assets", error);
          set({ isLoading: false });
        }
      },
      
      invalidate: () => {
        set({ lastFetched: null });
      }
    }),
    {
      name: 'user-assets-cache',
    }
  )
);
