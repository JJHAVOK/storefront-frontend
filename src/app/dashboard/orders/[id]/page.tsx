'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { StatusModal } from '@/components/StatusModal';
import Link from 'next/link';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [returnItem, setReturnItem] = useState<any>(null); // Item being returned
  const [reason, setReason] = useState('');
  
  const [status, setStatus] = useState({ show: false, title: '', message: '', type: 'success' as 'success' | 'error' });
  const showStatus = (title: string, msg: string, type: 'success' | 'error' = 'success') => setStatus({ show: true, title, message: msg, type });

  // Note: We need a backend endpoint to get a SINGLE order by ID for the customer.
  // We didn't explicitly create `GET /customer/portal/orders/:id`.
  // We will assume `GET /customer/portal/orders` returns list, let's update CustomerPortalController quickly in next step or use filter.
  // For now, let's fetch all and find (not efficient but works for now), OR add endpoint.
  // Better: We'll add the endpoint.
  
  const fetchOrder = () => {
     api.get(`/customer/portal/orders/${id}`)
        .then(res => setOrder(res.data))
        .catch(e => console.error(e))
        .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleSubmitReturn = async () => {
      try {
          await api.post('/ecommerce/returns', {
              orderId: order.id,
              orderItemId: returnItem.id,
              reason
          });
          showStatus('Success', 'Return requested. We will review it shortly.');
          setReturnItem(null);
          setReason('');
      } catch(e: any) {
          showStatus('Error', e.response?.data?.message || 'Failed to request return.', 'error');
      }
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (!order) return <div className="p-5 text-center">Order not found.</div>;

  return (
    <div>
      <StatusModal show={status.show} title={status.title} message={status.message} type={status.type} onClose={() => setStatus({ ...status, show: false })} />

      <div className="d-flex justify-content-between align-items-center mb-4">
         <h2 className="mb-0 fw-bold">Order #{order.orderNumber}</h2>
         <Link href="/dashboard/orders" className="btn btn-outline-secondary btn-sm">Back to Orders</Link>
      </div>

      <div className="card shadow-sm border-0 mb-4">
         <div className="card-header bg-white py-3">
             <div className="d-flex justify-content-between">
                 <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                 <span className="badge bg-primary">{order.status}</span>
             </div>
         </div>
         <div className="card-body">
            <div className="table-responsive">
                <table className="table align-middle">
                    <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th>Action</th></tr></thead>
                    <tbody>
                        {order.items.map((item: any) => (
                           <tr key={item.id}>
                               <td>
                                   <div className="fw-bold">{item.productName}</div>
                                   <small className="text-muted">{item.productSku}</small>
                               </td>
                               <td>${item.unitPrice.toFixed(2)}</td>
                               <td>{item.quantity}</td>
                               <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                               <td>
                                   <button 
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => setReturnItem(item)}
                                   >
                                      Return Item
                                   </button>
                               </td>
                           </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="row mt-4">
                <div className="col-md-6 offset-md-6 text-end">
                    <h5>Total Paid: <span className="text-primary fw-bold">${order.totalAmount.toFixed(2)}</span></h5>
                </div>
            </div>
         </div>
      </div>

      {/* Return Modal */}
      {returnItem && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg border-0">
                    <div className="modal-header">
                        <h5 className="modal-title">Return {returnItem.productName}</h5>
                        <button className="btn-close" onClick={() => setReturnItem(null)}></button>
                    </div>
                    <div className="modal-body">
                        <label className="form-label">Reason for Return</label>
                        <select className="form-select mb-3" value={reason} onChange={e => setReason(e.target.value)}>
                            <option value="">Select a reason...</option>
                            <option value="Damaged">Item Damaged</option>
                            <option value="Wrong Item">Wrong Item Sent</option>
                            <option value="Changed Mind">Changed Mind</option>
                            <option value="Defective">Defective</option>
                        </select>
                    </div>
                    <div className="modal-footer border-0">
                        <button className="btn btn-light" onClick={() => setReturnItem(null)}>Cancel</button>
                        <button className="btn btn-danger" onClick={handleSubmitReturn} disabled={!reason}>Submit Request</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
