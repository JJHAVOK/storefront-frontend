import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.pixelforgedeveloper.com', // Connects to your existing backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach token if it exists in localStorage (Client-side only)
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('customer_token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export default api;
