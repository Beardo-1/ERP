import { create } from 'zustand';
import { User, UserRole } from '../types';
import { users } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would validate credentials against a backend
      // For demo purposes, we'll just check if the email exists in our mock data
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user && password.length > 0) { // Simple check for demo
        set({ 
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Invalid email or password'
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'An error occurred during login'
      });
    }
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  }
}));