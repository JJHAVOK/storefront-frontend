'use client';

import dynamic from 'next/dynamic';
import { PostHogProvider } from './PostHogProvider';

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
});

export function PostHogWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  );
}