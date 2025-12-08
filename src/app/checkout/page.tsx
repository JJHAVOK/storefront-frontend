'use client';

import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // --- HYDRATION FIX ---
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand to load from localStorage
    useCartStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only run this check AFTER hydration is complete
    if (isHydrated) {
        if (items.length === 0) router.push('/cart');
        if (!user) router.push('/cart');
    }
  }, [isHydrated, items, user, router]);

  const subtotal = total();
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
      if(!couponCode) return;
      setPromoError('');
      setPromoSuccess('');
      try {
          const res = await api.post('/ecommerce/promotions/validate', { code: couponCode, cartTotal: subtotal });
          setDiscount(res.data.discountAmount);
          setPromoSuccess(`Coupon applied! Saved $${res.data.discountAmount.toFixed(2)}`);
      } catch(e: any) {
          setDiscount(0);
          setPromoError(e.response?.data?.message || 'Invalid coupon code');
      }
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const res = await api.post('/stripe/create-checkout-session', {
         items: items.map(i => ({ 
             name: i.name, 
             price: i.price, 
             quantity: i.quantity,
             id: i.id 
         })),
         discountAmount: discount 
      });
      
      if (res.data.url) {
          window.location.href = res.data.url;
      } else {
          alert('No checkout URL returned from server.');
          setLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  // Show nothing or a loader while waiting for storage
  if (!isHydrated) return <div className="p-5 text-center">Loading...</div>;
  if (!user || items.length === 0) return null;

  return (
    <main style={{ paddingTop: '150px', minHeight: '100vh' }} className="bg-light">
      <div className="container">
        <div className="row g-5">
          {/* Order Details */}
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Review Order</h4>
            <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Customer</h6>
                    <p className="fw-bold mb-1">{user.firstName} {user.lastName}</p>
                    <p className="text-muted mb-0">{user.email}</p>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white">Items</div>
                <ul className="list-group list-group-flush">
                    {items.map(item => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 className="my-0">{item.name}</h6>
                                <small className="text-muted">Qty: {item.quantity}</small>
                            </div>
                            <span className="text-muted">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

          {/* Summary & Payment */}
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-sm border-0">
               <div className="card-header bg-white fw-bold py-3">Order Summary</div>
               <div className="card-body">
                   <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item d-flex justify-content-between border-0 px-0">
                        <span>Subtotal</span>
                        <strong>${subtotal.toFixed(2)}</strong>
                      </li>
                      {discount > 0 && (
                          <li className="list-group-item d-flex justify-content-between border-0 px-0 text-success">
                            <span>Discount</span>
                            <strong>-${discount.toFixed(2)}</strong>
                          </li>
                      )}
                      <li className="list-group-item d-flex justify-content-between border-0 px-0">
                        <span>Tax (Est.)</span>
                        <span>$0.00</span>
                      </li>
                      <hr />
                      <li className="list-group-item d-flex justify-content-between border-0 px-0 pb-0">
                        <span className="fs-4 fw-bold">Total</span>
                        <span className="fs-4 fw-bold text-primary">${finalTotal.toFixed(2)}</span>
                      </li>
                   </ul>

                   {/* Coupon Input */}
                   <div className="input-group mb-3">
                      <input 
                          type="text" 
                          className={`form-control ${promoError ? 'is-invalid' : ''} ${promoSuccess ? 'is-valid' : ''}`}
                          placeholder="Promo code" 
                          value={couponCode} 
                          onChange={e => setCouponCode(e.target.value)} 
                      />
                      <button className="btn btn-secondary" onClick={handleApplyCoupon}>Redeem</button>
                   </div>
                   {promoError && <div className="text-danger small mb-3">{promoError}</div>}
                   {promoSuccess && <div className="text-success small mb-3">{promoSuccess}</div>}

                   <button 
                       className="w-100 btn btn-primary btn-lg py-3 fw-bold shadow-sm" 
                       onClick={handlePayNow} 
                       disabled={loading}
                   >
                       {loading ? 'Processing...' : 'Pay Now'}
                   </button>
                   <Link href="/cart" className="d-block text-center mt-3 text-decoration-none">Back to Cart</Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}