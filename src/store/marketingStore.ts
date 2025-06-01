import { create } from 'zustand';
import { MarketingCampaign } from '../types';

interface MarketingState {
  campaigns: MarketingCampaign[];
  isLoading: boolean;
  error: string | null;
  loadCampaigns: () => Promise<void>;
  addCampaign: (campaign: MarketingCampaign) => void;
}

export const useMarketingStore = create<MarketingState>((set) => ({
  campaigns: [],
  isLoading: false,
  error: null,
  loadCampaigns: async () => {
    set({ isLoading: true });
    // TODO: Load campaigns from API or mock data
    set({ isLoading: false });
  },
  addCampaign: (campaign) => set((state) => ({ campaigns: [...state.campaigns, campaign] })),
})); 