'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !localStorage.getItem('customer_token')) {
      router.push('/'); 
    }
  }, [isMounted, router]);

  if (!isMounted) return null; 

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: 'fas fa-home' },
	{ name: 'My Profile', href: user?.publicSlug ? `/profile/${user.publicSlug}` : '#', icon: 'fas fa-user' },
    { name: 'My Orders', href: '/dashboard/orders', icon: 'fas fa-shopping-cart' },
    { name: 'Projects', href: '/dashboard/projects', icon: 'fas fa-tasks' },
	{ name: 'Organization', href: '/dashboard/organization', icon: 'fas fa-building' },
    { name: 'Support', href: '/dashboard/support', icon: 'fas fa-life-ring' },
    { name: 'Security PIN', href: '/dashboard/settings/security', icon: 'fas fa-lock' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'fas fa-cog' },
  ];

  return (
    // Added 'p-3' here to push everything off the browser edges
    <div className="d-flex bg-light p-3" id="wrapper" style={{ marginTop: '100px', minHeight: 'calc(100vh - 100px)' }}>
      
      {/* Sidebar: Added 'rounded' and 'me-3' for separation */}
      <div 
        className="bg-white border shadow-sm rounded-3 me-3" 
        id="sidebar-wrapper" 
        style={{ width: '280px', flexShrink: 0, overflow: 'hidden' }}
      >
        <div className="sidebar-heading bg-white p-4 border-bottom text-center">
           <h5 className="fw-bold text-uppercase m-0 text-primary">Client Portal</h5>
           <small className="text-muted">Welcome, {user?.firstName}</small>
        </div>
        
        <div className="list-group list-group-flush p-3">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`list-group-item list-group-item-action p-3 mb-2 rounded-3 border-0 d-flex align-items-center ${
                pathname === item.href ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-transparent hover-bg-light'
              }`}
              style={{ transition: 'all 0.2s' }}
            >
              <i className={`${item.icon} me-3`} style={{ width: '24px', textAlign: 'center' }}></i> 
              <span className="fw-bold">{item.name}</span>
            </Link>
          ))}
          
          <div className="border-top my-2"></div>
          
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="list-group-item list-group-item-action p-3 rounded-3 text-danger border-0 bg-transparent"
          >
            <i className="fas fa-sign-out-alt me-3" style={{ width: '24px', textAlign: 'center' }}></i> 
            <strong>Logout</strong>
          </button>
        </div>
      </div>

      {/* Page Content: Added 'rounded' and 'shadow' */}
      <div id="page-content-wrapper" className="w-100 bg-white rounded-3 shadow-sm border p-4">
        <div className="container-fluid">
            {children}
        </div>
      </div>
    </div>
  );
}