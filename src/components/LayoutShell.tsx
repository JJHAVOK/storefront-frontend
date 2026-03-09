'use client';

import { usePathname } from 'next/navigation';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from '@/components/ChatWidget';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes where we want a "Standalone" look (No Header/Footer/Chat)
  const isStandalone = pathname === '/ecosystem';

  return (
    <>
      {!isStandalone && <Header />}
      
      {children}
      
      {!isStandalone && (
        <>
          <ChatWidget />
          <Footer />
        </>
      )}
    </>
  );
}