'use client';

import { useState, useEffect } from 'react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px', // <--- MOVED TO LEFT
        width: '50px',
        height: '50px',
        zIndex: 9998, // Below chat widget (9999) but above content
        transition: 'all 0.3s ease',
        border: '2px solid rgba(255,255,255,0.2)'
      }}
      title="Scroll to Top"
    >
      <i className="fas fa-arrow-up text-white"></i>
    </button>
  );
}
