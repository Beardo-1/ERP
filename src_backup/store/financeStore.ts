import { create } from 'zustand';
import { FinancialTransaction } from '../types';

interface FinanceState {
  transactions: FinancialTransaction[];
  isLoading: boolean;
  error: string | null;
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: FinancialTransaction) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,
  loadTransactions: async () => {
    set({ isLoading: true });
    // TODO: Load transactions from API or mock data
    set({ isLoading: false });
  },
  addTransaction: (transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),
})); 