'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface StatusModalProps {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
}

export function StatusModal({ show, type, title, message, onClose, autoClose = true }: StatusModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Auto-close logic
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (show) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [show]);

  if (!mounted || !show) return null;

  const colorClass = type === 'success' ? 'text-success' : 'text-danger';
  const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

  // Use Portal to render outside main DOM hierarchy
  return createPortal(
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000 }} tabIndex={-1} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg p-4 text-center">
          <div className={`mb-3 ${colorClass}`}>
            <i className={`${iconClass} fa-4x`}></i>
          </div>
          <h4 className="fw-bold mb-2">{title}</h4>
          <p className="text-muted mb-4">{message}</p>
          <button className="btn btn-outline-dark px-4" onClick={onClose}>Okay</button>
        </div>
      </div>
    </div>,
    document.body
  );
}