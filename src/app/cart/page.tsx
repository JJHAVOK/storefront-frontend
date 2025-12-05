'use client';

import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

// Replace with your PUBLISHABLE key (Safe to be public)
const stripePromise = loadStripe('pk_test_51...'); 

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
       alert('Please log in to checkout.');
       return;
    }
    setLoading(true);
    try {
      // 1. Create Checkout Session on Backend
      const res = await api.post('/stripe/create-checkout-session', {
         items: items.map(i => ({ priceId: 'price_placeholder', quantity: i.quantity, name: i.name, amount: i.price })), // You might need to adjust backend to accept raw line items or Price IDs
         customerEmail: user.email 
      });
      
      // 2. Redirect to Stripe
      window.location.href = res.data.url;
    } catch (e) {
      alert('Checkout failed. Check console.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: '150px', minHeight: '100vh' }} className="bg-light">
      <div className="container">
        <h2 className="text-uppercase mb-4">Your Cart</h2>
        
        <div className="row">
           {/* Cart Items */}
           <div className="col-lg-8">
              {items.length === 0 ? (
                 <div className="alert alert-info">Your cart is empty. <Link href="/shop">Go Shopping</Link></div>
              ) : (
                 <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body p-0">
                       <table className="table table-hover mb-0">
                          <thead className="bg-light">
                             <tr>
                                <th className="p-3">Product</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Qty</th>
                                <th className="p-3">Total</th>
                                <th></th>
                             </tr>
                          </thead>
                          <tbody>
                             {items.map(item => (
                                <tr key={item.id}>
                                   <td className="p-3 fw-bold">{item.name}</td>
                                   <td className="p-3">${item.price.toFixed(2)}</td>
                                   <td className="p-3">
                                      <button className="btn btn-sm btn-light border me-2" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                      {item.quantity}
                                      <button className="btn btn-sm btn-light border ms-2" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                   </td>
                                   <td className="p-3 fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                                   <td className="p-3">
                                      <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)}><i className="fas fa-trash"></i></button>
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
              <div className="card shadow-sm border-0">
                 <div className="card-header bg-white fw-bold text-uppercase py-3">Order Summary</div>
                 <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                       <span>Subtotal</span>
                       <span>${total().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                       <span>Tax (Est.)</span>
                       <span>$0.00</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4 fs-4 fw-bold text-primary">
                       <span>Total</span>
                       <span>${total().toFixed(2)}</span>
                    </div>
                    
                    <button 
                       className="btn btn-primary btn-xl w-100 text-uppercase" 
                       disabled={items.length === 0 || loading}
                       onClick={handleCheckout}
                    >
                       {loading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
