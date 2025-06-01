import { create } from 'zustand';
import { Property } from '../types';

interface PropertyState {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  loadProperties: () => Promise<void>;
  addProperty: (property: Property) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  isLoading: false,
  error: null,
  loadProperties: async () => {
    set({ isLoading: true });
    // TODO: Load properties from API or mock data
    set({ isLoading: false });
  },
  addProperty: (property) => set((state) => ({ properties: [...state.properties, property] })),
})); 