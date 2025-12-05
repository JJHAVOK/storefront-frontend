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
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    // Redirect if cart empty
    if (items.length === 0) router.push('/cart');
    // Redirect if not logged in
    if (!user) router.push('/cart');
  }, [items, user, router]);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const res = await api.post('/stripe/create-checkout-session', {
         items: items.map(i => ({ 
             name: i.name, 
             price: i.price, 
             quantity: i.quantity,
             id: i.id 
         }))
      });
      
      if (res.data.url) {
          window.location.href = res.data.url; // External Redirect
      } else {
          alert('Payment gateway error.');
          setLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert('Checkout failed.');
      setLoading(false);
    }
  };

  if (!user || items.length === 0) return null;

  return (
    <main style={{ paddingTop: '150px', minHeight: '100vh' }} className="bg-light">
      <div className="container">
        <div className="row g-5">
          {/* Left: Order Details */}
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Review Order</h4>
            <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Shipping To</h6>
                    <p className="fw-bold mb-1">{user.firstName} {user.lastName}</p>
                    <p className="text-muted mb-0">{user.email}</p>
                    {/* Address logic would go here later */}
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

          {/* Right: Payment Action */}
          <div className="col-md-5 col-lg-4">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Summary</span>
              <span className="badge bg-primary rounded-pill">{items.length}</span>
            </h4>
            <ul className="list-group mb-3 shadow-sm">
              <li className="list-group-item d-flex justify-content-between">
                <span>Subtotal</span>
                <strong>${total().toFixed(2)}</strong>
              </li>
               <li className="list-group-item d-flex justify-content-between bg-light">
                <div className="text-success">
                  <h6 className="my-0">Promo code</h6>
                  <small>-</small>
                </div>
                <span className="text-success">-$0.00</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>${total().toFixed(2)}</strong>
              </li>
            </ul>

            <div className="card p-2 shadow-sm border-0 mb-3">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Promo code" value={coupon} onChange={e => setCoupon(e.target.value)} />
                <button type="submit" className="btn btn-secondary">Redeem</button>
              </div>
            </div>

            <button className="w-100 btn btn-primary btn-lg py-3 fw-bold shadow-sm" onClick={handlePayNow} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
            <Link href="/cart" className="d-block text-center mt-3 text-decoration-none">Back to Cart</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
