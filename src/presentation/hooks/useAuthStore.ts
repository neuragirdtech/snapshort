import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../domain/entities/User';

export type AiProvider = 'gemini' | 'openai' | 'claude';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  
  // BYOK (Bring Your Own Key) Settings
  activeProvider: AiProvider;
  apiToken: string | null;

  setUser: (user: User | null, token: string | null) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (status: boolean) => void;
  setAiConfig: (provider: AiProvider, token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      _hasHydrated: false,
      
      activeProvider: 'gemini', // Default
      apiToken: null,

      setUser: (user, token) => set({ user, token, error: null }),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
      setHasHydrated: (status) => set({ _hasHydrated: status }),
      setAiConfig: (provider, token) => set({ activeProvider: provider, apiToken: token }),
      logout: () => set({ 
        user: null, 
        token: null, 
        error: null, 
        activeProvider: 'gemini',
        apiToken: null 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        return () => {
          state.setHasHydrated(true);
        };
      },
    }
  )
);
