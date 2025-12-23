'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { useCartStore } from '@/lib/cartStore';
import { AuthModal } from './AuthModal';
import { getAvatarUrl } from '@/lib/utils'; 
import api from '@/lib/api';
import { StorefrontNotifications } from './StorefrontNotifications';

export function Header() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
    setIsHydrated(true);

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
       await api.post('/customer/auth/logout');
    } catch(e) {
       console.error("Logout log failed", e);
    }
    
    // FIX: Clear Chat Session on Logout
    localStorage.removeItem('pf_active_chat_ticket');
    
    logout();
    setShowDropdown(false);
    
    // Force reload to clear React state cleanly
    window.location.href = '/'; 
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/') ? 'active' : '';
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {showAuthModal && (
        <AuthModal 
          mode={authMode} 
          onClose={() => setShowAuthModal(false)} 
          onSwitch={() => setAuthMode(prev => prev === 'login' ? 'register' : 'login')}
        />
      )}

      <div className="top-bar">
        <div className="container">
            <div className="top-bar-left">
                <a href="tel:0000000000"><i className="fas fa-phone-alt"></i> 000 000 0000</a>
            </div>
            <div className="top-bar-center">
                <a href="mailto:emailus@jeemail.com"><i className="fas fa-envelope"></i> emailus@jeemail.com</a>
            </div>
            <div className="top-bar-right"></div>
        </div>
      </div>

      <header className="header">
          <div className="container header-content d-flex justify-content-between align-items-center">
              <Link href="/" className="logo">PixelSolutions</Link>
              
              <nav className="nav-column d-none d-lg-block">
                  <div className="nav-main-links">
                      <Link href="/" className={isActive('/')}>Home</Link>
                      <Link href="/shop" className={isActive('/shop')}>Shop</Link>
                      <Link href="/blog" className={isActive('/blog')}>Blog</Link>
                      <Link href="/projects" className={isActive('/projects')}>Projects</Link>
                      <Link href="/about" className={isActive('/about')}>About Us</Link>
                      {/* Contact restored below */}
                      <Link href="/contact" className={isActive('/contact')}>Contact</Link>
                  </div>
              </nav>
              
              <div className="d-flex align-items-center">
                  
                  {/* Help Center Button */}
                  <Link 
                    href="/knowledge-base" 
                    className="btn btn-outline-secondary d-none d-md-flex align-items-center justify-content-center"
                    style={{ 
                        height: '45px', 
                        borderRadius: '8px', 
                        fontWeight: '600', 
                        padding: '0 15px',
                        border: '1px solid #dee2e6',
                        marginRight: '5px'
                    }}
                    title="Knowledge Base / FAQ"
                  >
                     <i className="fas fa-question-circle me-2"></i> Help
                  </Link>

                  {/* Cart Button */}
                  <Link 
                    href="/cart" 
                    className="btn position-relative d-flex align-items-center justify-content-center"
                    style={{ 
                        width: '45px', 
                        height: '45px', 
                        borderRadius: '50%', 
                        backgroundColor: '#f8f9fa', 
                        border: '1px solid #dee2e6',
                        color: '#212529',
                        transition: 'all 0.2s',
                        marginRight: '15px'
                    }}
                  >
                     <i className="fas fa-shopping-cart"></i>
                     {isHydrated && cartCount > 0 && (
                       <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem', border: '2px solid white' }}>
                         {cartCount}
                       </span>
                     )}
                  </Link>

                  {/* Auth Section */}
                  <div style={{ marginRight: '15px' }}> 
                    {isHydrated && user ? (
                       <div className="d-flex align-items-center">
                           <div style={{ marginRight: '15px' }}>
                               <StorefrontNotifications />
                           </div>

                           <div className="dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
                             <button 
                               className="btn btn-outline-dark dropdown-toggle d-flex align-items-center px-2" 
                               type="button" 
                               onClick={() => setShowDropdown(!showDropdown)}
                               style={{ height: '45px', borderRadius: '8px', fontWeight: '600', minWidth: '160px', justifyContent: 'space-between' }}
                             >
                               <div className="d-flex align-items-center">
                                   <img 
                                       src={getAvatarUrl(user)} 
                                       alt="Profile" 
                                       className="rounded-circle" 
                                       style={{ width: '24px', height: '24px', objectFit: 'cover', marginRight: '10px' }}
                                   />
                                   <span className="text-truncate" style={{ maxWidth: '100px' }}>{user.firstName}</span>
                               </div>
                             </button>
                             
                             <ul 
                               className={`dropdown-menu dropdown-menu-end ${showDropdown ? 'show' : ''}`} 
                               style={{ 
                                   display: showDropdown ? 'block' : 'none', 
                                   position: 'absolute', 
                                   right: 0, 
                                   top: '120%', 
                                   zIndex: 9999,
                                   minWidth: '220px',
                                   boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                   border: 'none',
                                   borderRadius: '12px',
                                   overflow: 'hidden'
                               }}
                             >
                               <li><Link className="dropdown-item py-2" href="/dashboard"><i className="fas fa-tachometer-alt me-2 text-muted"></i> Dashboard</Link></li>
                               <li><Link className="dropdown-item py-2" href={user?.publicSlug ? `/profile/${user.publicSlug}` : '#'}><i className="fas fa-user me-2 text-muted"></i> My Profile</Link></li>
                               <li><Link className="dropdown-item py-2" href="/dashboard/orders"><i className="fas fa-box me-2 text-muted"></i> My Orders</Link></li>
                               <li><Link className="dropdown-item py-2" href="/dashboard/projects"><i className="fas fa-project-diagram me-2 text-muted"></i> Projects</Link></li>
                               <li><Link className="dropdown-item py-2" href="/dashboard/organization"><i className="fas fa-building me-2 text-muted"></i> Organization</Link></li>
                               <li><Link className="dropdown-item py-2" href="/dashboard/support"><i className="fas fa-life-ring me-2 text-muted"></i> Support Tickets</Link></li>
                               <li><Link className="dropdown-item py-2" href="/dashboard/settings"><i className="fas fa-cog me-2 text-muted"></i> Settings</Link></li>
                               <li><hr className="dropdown-divider" /></li>
                               <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i> Logout</button></li>
                             </ul>
                           </div>
                       </div>
                    ) : (
                       <button 
                         onClick={openLogin} 
                         className="btn btn-link text-dark text-decoration-none fw-bold text-uppercase"
                         style={{ letterSpacing: '1px' }}
                       >
                         Log In
                       </button>
                    )}
                  </div>

                  {/* Primary CTA */}
                  <Link href="/contact" className="btn btn-primary px-4 d-flex align-items-center" style={{ height: '45px', borderRadius: '8px', fontWeight: '700' }}>
                     Start Project
                  </Link>
              </div>
          </div>
      </header>
    </>
  );
}