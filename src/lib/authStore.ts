import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// We do NOT import api here to avoid circular dependencies.
// The API interceptor handles the logic on its own.

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  publicSlug?: string;
  metadata?: any;
}

interface AuthState {
  user: User | null;
  // Token removed from interface (Cookie handles it)
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login: (user) => {
        // We no longer touch localStorage or API headers manually.
        // The browser has already received the Set-Cookie header from the login response.
        set({ user });
      },

      logout: () => {
        // We only clear the client-side user data.
        // The API call to /auth/logout (handled in the component) kills the cookie.
        set({ user: null });
      },

      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'customer-storage', // Persists only the User Profile
    }
  )
);