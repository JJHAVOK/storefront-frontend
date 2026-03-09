'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ⚠️ REPLACE WITH YOUR REAL POSTHOG KEY
    const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_w2hRhckHgBtWr4Ns7b225y94Y1cq5kv6Jm7Ucs3xMFn';
    const POSTHOG_HOST = 'https://us.i.posthog.com'; // or 'https://eu.i.posthog.com'
    
    if (typeof window !== 'undefined' && POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        // 👇 CRITICAL CHANGE: Use local proxy instead of cloud URL
        api_host: '/ingest', 
        ui_host: 'https://us.posthog.com', // Keep this for the dashboard links
        person_profiles: 'identified_only', 
        capture_pageview: false, 
        autocapture: true,
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}