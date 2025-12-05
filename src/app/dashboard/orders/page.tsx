'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/portal/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 className="mb-4">My Orders</h2>
      <div className="table-responsive">
        <table className="table table-hover border">
          <thead className="table-light">
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tracking</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4 text-muted">No orders found.</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o.id}>
                  <td className="fw-bold">{o.orderNumber}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>${o.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${o.status === 'SHIPPED' ? 'bg-success' : 'bg-primary'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    {o.shipments && o.shipments[0] ? (
                       <span>{o.shipments[0].carrier}: {o.shipments[0].trackingNumber}</span>
                    ) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}