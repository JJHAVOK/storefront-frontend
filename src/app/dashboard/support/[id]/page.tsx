'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';

export default function SupportDetail() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      // Load Ticket Data
      api.get(`/customer/portal/tickets`).then(res => {
          const t = res.data.find((x: any) => x.id === id);
          if (t) {
              setTicket(t);
              // Load full details (messages) via specific endpoint if created, otherwise rely on list data or create a specific endpoint
              // Ideally: GET /customer/portal/tickets/:id
              api.get(`/customer/portal/tickets/${id}`).then(d => setMessages(d.data.messages || []));
          }
      });
  }, [id]);

  // Socket Connection
  useEffect(() => {
      if (!token || !id) return;
      const newSocket = io('https://api.pixelforgedeveloper.com/chat', { auth: { token: `Bearer ${token}` } });
      
      newSocket.on('connect', () => {
          newSocket.emit('join_ticket', id);
      });

      newSocket.on('new_message', (msg) => {
          setMessages(prev => [...prev, msg]);
          scrollToBottom();
      });

      setSocket(newSocket);
      return () => { newSocket.disconnect(); }
  }, [token, id]);

  const scrollToBottom = () => setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

  const handleSend = () => {
      if(!input.trim() || !socket) return;
      socket.emit('send_message', { ticketId: id, content: input });
      setInput('');
  };

  if (!ticket) return <div className="container py-5 mt-5">Loading...</div>;

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
        <Link href="/dashboard/support" className="text-decoration-none text-muted mb-3 d-inline-block"><i className="fas fa-arrow-left"></i> Back</Link>
        
        <div className="card shadow-sm" style={{ height: '70vh' }}>
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">{ticket.subject} <span className="badge bg-secondary ms-2">{ticket.status}</span></h5>
                <span className="text-muted small">#{ticket.ticketNumber}</span>
            </div>
            
            <div className="card-body bg-light overflow-auto">
                {messages.map((m, i) => (
                    <div key={i} className={`d-flex mb-3 ${m.sender === 'CUSTOMER' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`p-3 rounded-3 shadow-sm ${m.sender === 'CUSTOMER' ? 'bg-primary text-white' : 'bg-white text-dark'}`} style={{ maxWidth: '70%' }}>
                            <div className="small fw-bold mb-1">{m.sender === 'CUSTOMER' ? 'You' : (m.senderName || 'Support')}</div>
                            {m.content}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>

            <div className="card-footer bg-white p-3">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                    <button className="btn btn-primary" onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    </div>
  );
}
