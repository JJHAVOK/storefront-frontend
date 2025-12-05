'use client';

import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import { useState } from 'react';
import Link from 'next/link';
import { AuthModal } from '@/components/AuthModal';

// --- TOAST COMPONENT ---
function Toast({ message, type, show, onClose }: { message: string, type: 'success' | 'error', show: boolean, onClose: () => void }) {
  if (!show) return null;
  const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
  const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999, marginTop: '80px' }}>
      <div className={`toast show align-items-center text-white ${bgClass} border-0 shadow-lg`} role="alert">
        <div className="d-flex">
          <div className="toast-body fs-6">
             <i className={`${iconClass} me-2`}></i> {message}
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const handleCheckout = () => {
    if (!user) {
       setAuthMode('login');
       setShowAuthModal(true);
       return;
    }
    // Redirect to new checkout page
    window.location.href = '/checkout'; 
  };

  return (
    <main style={{ paddingTop: '150px', minHeight: '100vh' }} className="bg-light">
      
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          mode={authMode} 
          onClose={() => setShowAuthModal(false)} 
          onSwitch={() => setAuthMode(prev => prev === 'login' ? 'register' : 'login')}
          preventRedirect={true} 
        />
      )}

      <div className="container">
        <h2 className="text-uppercase mb-4 fw-bold">Your Cart</h2>
        
        <div className="row">
           {/* Cart Items */}
           <div className="col-lg-8">
              {items.length === 0 ? (
                 <div className="alert alert-light shadow-sm text-center py-5">
                    <h4>Your cart is empty</h4>
                    <p className="text-muted">Looks like you haven't added anything yet.</p>
                    <Link href="/shop" className="btn btn-primary mt-2">Go Shopping</Link>
                 </div>
              ) : (
                 <div className="card shadow-sm border-0 mb-4 overflow-hidden rounded-3">
                    <div className="card-body p-0">
                       <table className="table table-hover mb-0 align-middle">
                          <thead className="bg-light">
                             <tr>
                                <th className="p-3 border-0 text-uppercase small text-muted">Product</th>
                                <th className="p-3 border-0 text-uppercase small text-muted">Price</th>
                                <th className="p-3 border-0 text-uppercase small text-muted">Qty</th>
                                <th className="p-3 border-0 text-uppercase small text-muted">Total</th>
                                <th className="border-0"></th>
                             </tr>
                          </thead>
                          <tbody>
                             {items.map(item => (
                                <tr key={item.id}>
                                   <td className="p-3 fw-bold">{item.name}</td>
                                   <td className="p-3">${item.price.toFixed(2)}</td>
                                   <td className="p-3">
                                      <div className="btn-group btn-group-sm">
                                        <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                        <button className="btn btn-outline-secondary disabled text-dark fw-bold" style={{ width: '40px' }}>{item.quantity}</button>
                                        <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                      </div>
                                   </td>
                                   <td className="p-3 fw-bold text-primary">${(item.price * item.quantity).toFixed(2)}</td>
                                   <td className="p-3 text-end">
                                      <button className="btn btn-link text-danger p-0" onClick={() => removeItem(item.id)}>
                                        <i className="fas fa-trash-alt"></i>
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}
           </div>

           {/* Summary */}
           <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-3">
                 <div className="card-header bg-white fw-bold text-uppercase py-3 border-bottom">Order Summary</div>
                 <div className="card-body p-4">
                    <div className="d-flex justify-content-between mb-2 text-muted">
                       <span>Subtotal</span>
                       <span>${total().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4 text-muted">
                       <span>Tax (Est.)</span>
                       <span>$0.00</span>
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between mb-4">
                       <span className="fs-5 fw-bold">Total</span>
                       <span className="fs-4 fw-bold text-primary">${total().toFixed(2)}</span>
                    </div>
                    
                    <button 
                       className="btn btn-primary btn-xl w-100 text-uppercase fw-bold rounded-pill" 
                       disabled={items.length === 0 || loading}
                       onClick={handleCheckout}
                    >
                       {loading ? (
                           <span><span className="spinner-border spinner-border-sm me-2"></span> Processing...</span>
                       ) : (
                           <>Proceed to Checkout <i className="fas fa-arrow-right ms-2"></i></>
                       )}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}