import api from '@/lib/api';
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  avatarUrl?: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean; // for actions like login/register
  isCheckingAuth: boolean; // initial bootstrapping auth check
  checkAuth: () => Promise<void>;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setAvatarUrl: (url: string | null) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const { data } = await api.get('/users/me');
      set({ user: data });
    } catch (error) {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/login', credentials);
      const { data } = await api.get('/users/me');
      set({ user: data });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (credentials: { email: string; password: string }) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/register', credentials);
      const { data } = await api.get('/users/me');
      set({ user: data });
    } finally {
      set({ isLoading: false });
    }
  },


  logout: async () => {
    try {
      const { disconnectSocket } = await import('@/hooks/useSocket');
      disconnectSocket();
    } catch (e) {
    }

    try {
      await api.post('/auth/logout');
    } catch (e) {
    }

    set({ user: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  // Atualiza apenas localmente e tenta persistir no backend (se disponível)
  setAvatarUrl: async (url: string | null) => {
    set((state) => ({ user: state.user ? { ...state.user, avatarUrl: url } : state.user }));
    try {
      // Tentativa de persistir no backend caso exista endpoint
      await api.patch('/users/me', { avatarUrl: url });
    } catch (e) {
      // Silencioso: backend pode não suportar ainda
    }
  },
}));
