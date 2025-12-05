'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';

export default function SuccessPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear the cart on successful load
    clearCart();
  }, []);

  return (
    <main style={{ marginTop: '100px', minHeight: '80vh' }} className="d-flex align-items-center">
      <div className="container text-center">
        <div className="mb-4">
           <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
        </div>
        <h1 className="fw-bold mb-3">Payment Successful!</h1>
        <p className="lead text-muted mb-5">
           Thank you for your order. We have sent a confirmation email to you.
           <br />You can track your order status in your dashboard.
        </p>
        <div className="d-flex justify-content-center gap-3">
           <Link href="/dashboard/orders" className="btn btn-outline-dark btn-lg">View Orders</Link>
           <Link href="/shop" className="btn btn-primary btn-lg">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
