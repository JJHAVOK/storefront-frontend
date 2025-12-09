import axios from 'axios';
import { useAuthStore } from '@/lib/authStore';

const api = axios.create({
  baseURL: 'https://api.pixelforgedeveloper.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  // Access the token from the Zustand store
  const state = useAuthStore.getState();
  const token = state.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 (Logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear auth (optional: redirect)
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;