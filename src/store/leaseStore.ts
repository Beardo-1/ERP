import { create } from 'zustand';
import { Lease } from '../types';

interface LeaseState {
  leases: Lease[];
  isLoading: boolean;
  error: string | null;
  loadLeases: () => Promise<void>;
  addLease: (lease: Lease) => void;
}

export const useLeaseStore = create<LeaseState>((set) => ({
  leases: [],
  isLoading: false,
  error: null,
  loadLeases: async () => {
    set({ isLoading: true });
    // TODO: Load leases from API or mock data
    set({ isLoading: false });
  },
  addLease: (lease) => set((state) => ({ leases: [...state.leases, lease] })),
})); 