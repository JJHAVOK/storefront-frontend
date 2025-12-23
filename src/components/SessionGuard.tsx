"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';

export function SessionGuard() {
  const { token, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !token) return;

    // ⚡️ PULSE CHECK:
    // We hit a protected endpoint. If the session is dead, the API returns 401.
    // The interceptor in api.ts will catch it and force a logout.
    api.get('/customer/auth/sessions').catch(() => {
       // Errors are handled by the interceptor
    });
  }, [mounted, token]);

  return null; // This component renders nothing
}
