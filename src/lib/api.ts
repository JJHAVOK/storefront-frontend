import axios from 'axios';
import { useAuthStore } from '@/lib/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.pixelforgedeveloper.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token & Anti-Zombie Timestamp
api.interceptors.request.use((config) => {
  const state = useAuthStore.getState();
  const token = state.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🛡️ ANTI-ZOMBIE (CORS SAFE): Add timestamp to all GET requests
  // This forces the browser to check with the server every time
  if (config.method === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }

  return config;
});

// Response Interceptor: Handle 401 (Revoked Session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const store = useAuthStore.getState();
      if (store.token) {
         console.warn("Session revoked by server. Logging out.");
         store.logout();
         if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
             window.location.href = '/login'; 
         }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
