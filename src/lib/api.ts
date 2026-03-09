import axios from 'axios';
import { useAuthStore } from '@/lib/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.pixelforgedeveloper.com',
  withCredentials: true, // Enables Cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (config.method === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // [FIX] Safely extract the error message
    const msg = error.response?.data?.message;

    // [CRITICAL] Only redirect if it is a REAL session failure (401)
    // AND it is NOT an MFA challenge.
    if (error.response?.status === 401 && msg !== 'MFA_REQUIRED') {
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          console.warn("Session expired. Logging out.");
          useAuthStore.getState().logout();
          window.location.href = '/login'; 
      }
    }
    
    // Pass the error back to the UI so AuthModal can see "MFA_REQUIRED"
    return Promise.reject(error);
  }
);

export default api;