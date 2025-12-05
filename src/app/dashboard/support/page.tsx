'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function MySupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const fetchTickets = () => {
    api.get('/customer/portal/tickets')
      .then(res => setTickets(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/customer/portal/tickets', { subject, message });
      setShowForm(false);
      setSubject('');
      setMessage('');
      fetchTickets();
      alert('Ticket created!');
    } catch(e) {
      alert('Failed to create ticket.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
         <h2>Support Tickets</h2>
         <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Open New Ticket'}
         </button>
      </div>

      {showForm && (
        <div className="card mb-4 shadow-sm">
           <div className="card-body">
              <form onSubmit={handleSubmit}>
                 <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input className="form-control" value={subject} onChange={e => setSubject(e.target.value)} required />
                 </div>
                 <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows={4} value={message} onChange={e => setMessage(e.target.value)} required></textarea>
                 </div>
                 <button className="btn btn-success" type="submit">Submit Ticket</button>
              </form>
           </div>
        </div>
      )}

      <div className="list-group">
        {tickets.length === 0 ? (
           <div className="list-group-item text-center text-muted">No tickets found.</div>
        ) : (
           tickets.map(t => (
             <div key={t.id} className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{t.subject} <span className="badge bg-secondary" style={{fontSize: '0.7rem'}}>{t.status}</span></h5>
                  <small>{new Date(t.createdAt).toLocaleDateString()}</small>
                </div>
                <p className="mb-1 text-muted">Ticket #{t.ticketNumber}</p>
                
                {/* Simple Chat View for Customer */}
                {t.messages && t.messages.length > 0 && (
                   <div className="mt-3 bg-light p-3 rounded">
                      {t.messages.map((m: any) => (
                         <div key={m.id} className={`d-flex mb-2 ${!m.staffUserId ? 'justify-content-end' : ''}`}>
                            <div className={`p-2 rounded ${!m.staffUserId ? 'bg-primary text-white' : 'bg-white border'}`} style={{maxWidth: '80%'}}>
                               <small className="d-block fw-bold mb-1">{!m.staffUserId ? 'You' : 'Support Agent'}</small>
                               {m.content}
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
           ))
        )}
      </div>
    </div>
  );
}