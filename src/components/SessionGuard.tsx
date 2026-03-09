'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';

export function SessionGuard() {
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const verifySession = async () => {
        if (user) {
            try {
                // Use profile endpoint to verify cookie
                await api.get('/customer/auth/profile'); 
            } catch (error: any) {
                // [CRITICAL FIX] Only logout if it's a REAL session error (401)
                // Ignore network errors or server glitches
                if (error.response && error.response.status === 401) {
                     console.warn("Session invalid (401), clearing store.");
                     logout();
                }
            }
        }
    };

    // Verify on mount
    verifySession();
    
    // Periodic check every 2 minutes
    const interval = setInterval(verifySession, 2 * 60 * 1000);
    return () => clearInterval(interval);

  }, [mounted, user, logout]);

  return null; 
}