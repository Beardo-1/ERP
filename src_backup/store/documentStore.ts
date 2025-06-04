import { create } from 'zustand';
import { Document } from '../types';

interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  loadDocuments: () => Promise<void>;
  addDocument: (document: Document) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  isLoading: false,
  error: null,
  loadDocuments: async () => {
    set({ isLoading: true });
    // TODO: Load documents from API or mock data
    set({ isLoading: false });
  },
  addDocument: (document) => set((state) => ({ documents: [...state.documents, document] })),
})); 