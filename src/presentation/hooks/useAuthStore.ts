import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../domain/entities/User';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null, token: string | null) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user, token) => set({ user, token, error: null }),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, token: null, error: null }),
    }),
    {
      name: 'auth-storage', // kunci unik untuk penyimpanan di HP
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
