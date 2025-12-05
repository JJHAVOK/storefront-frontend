import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  publicSlug?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (token, user) => {
        localStorage.setItem('customer_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('customer_token');
        delete api.defaults.headers.common['Authorization'];
        set({ token: null, user: null });
      },
    }),
    { name: 'customer-storage' }
  )
);