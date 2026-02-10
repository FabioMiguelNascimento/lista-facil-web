import api from '@/lib/api';
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/users/me');
      set({ user: data });
    } catch (error) {
      set({ user: null });
    } finally {
      set({ isLoading: false });
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
}));
