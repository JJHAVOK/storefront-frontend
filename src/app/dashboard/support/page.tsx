'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function SupportList() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    api.get('/customer/portal/tickets').then(res => setTickets(res.data)).catch(()=>{});
  }, []);

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">My Support Tickets</h1>
        {/* FIX: Cast window to any to avoid TS error */}
        <button className="btn btn-primary" onClick={() => (window as any).openChatWidget?.()}>
            <i className="fas fa-plus me-2"></i>New Ticket
        </button>
      </div>

      <div className="list-group shadow-sm">
        {tickets.map(t => (
            <Link key={t.id} href={`/dashboard/support/${t.id}`} className="list-group-item list-group-item-action p-4 d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-1 fw-bold">{t.subject}</h5>
                    <small className="text-muted">Ticket #{t.ticketNumber} • {new Date(t.createdAt).toLocaleDateString()}</small>
                </div>
                <div>
                    <span className={`badge rounded-pill ${t.status === 'RESOLVED' ? 'bg-success' : 'bg-primary'}`}>{t.status}</span>
                    <i className="fas fa-chevron-right ms-3 text-muted"></i>
                </div>
            </Link>
        ))}
        {tickets.length === 0 && <div className="p-5 text-center text-muted">No tickets found.</div>}
      </div>
    </div>
  );
}