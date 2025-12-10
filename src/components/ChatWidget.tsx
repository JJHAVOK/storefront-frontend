'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';

export function ChatWidget() {
  const { user, token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Expose Open Function
  useEffect(() => {
      (window as any).openChatWidget = () => setIsOpen(true);
      return () => { delete (window as any).openChatWidget; };
  }, []);

  // 1. Initial Load & Persistence
  useEffect(() => {
      const storedTicketId = localStorage.getItem('pf_active_chat_ticket');
      if (storedTicketId) {
          setActiveTicket(storedTicketId);
          loadTicketHistory(storedTicketId);
      } else if (user) {
          // Check for existing open ticket on server
          api.get('/customer/portal/tickets').then(res => {
              const openTicket = res.data.find((t: any) => t.status !== 'CLOSED' && t.status !== 'RESOLVED');
              if (openTicket) {
                  setActiveTicket(openTicket.id);
                  localStorage.setItem('pf_active_chat_ticket', openTicket.id);
                  loadTicketHistory(openTicket.id);
              }
          }).catch(() => {});
      }
  }, [user]);

  const loadTicketHistory = async (ticketId: string) => {
      try {
          const res = await api.get(`/customer/portal/tickets/${ticketId}`);
          if (res.data) {
              // --- FIX 1: Normalize API Data to match Socket Format ---
              const normalizedMessages = (res.data.messages || []).map((m: any) => ({
                  ...m,
                  // If staffUserId is null, it's the customer. If set, it's staff.
                  sender: m.staffUserId ? 'STAFF' : 'CUSTOMER',
                  senderName: m.staffUserId ? (m.staffUser?.firstName || 'Staff') : 'Customer'
              }));
              setMessages(normalizedMessages);
              scrollToBottom();
          }
      } catch (e) {
          // If 404/Error, assume ticket is dead/deleted
          handleDeadTicket();
      }
  };

  const handleDeadTicket = () => {
      console.log('Ticket is dead or deleted. Resetting widget.');
      localStorage.removeItem('pf_active_chat_ticket');
      setActiveTicket(null);
      setMessages([]);
      // Force socket to leave room if possible or just rely on new join
  };

  // 2. Socket Connection
  useEffect(() => {
    if (isOpen && token && !socket) {
      const newSocket = io('https://api.pixelforgedeveloper.com/chat', {
        auth: { token: `Bearer ${token}` },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
          if (activeTicket) newSocket.emit('join_ticket', activeTicket);
      });
      
      newSocket.on('new_message', (msg) => {
        setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
        });
        scrollToBottom();
      });

      // --- FIX 2: Handle Deleted Tickets Instantly ---
      newSocket.on('ticket_error', () => {
          handleDeadTicket();
      });

      setSocket(newSocket);
      return () => { newSocket.disconnect(); };
    }
  }, [isOpen, token, activeTicket]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Case A: Active Ticket -> Send via Socket
    if (activeTicket && socket && socket.connected) {
        socket.emit('send_message', { ticketId: activeTicket, content: input });
        setInput('');
    } 
    // Case B: No Ticket (or Dead Ticket State) -> Create New via API
    else {
        try {
            const res = await api.post('/customer/portal/tickets', { 
                subject: 'Live Chat Support', 
                priority: 'MEDIUM', 
                message: input 
            });
            
            const newTicketId = res.data.id;
            
            // Commit to state immediately
            setActiveTicket(newTicketId);
            localStorage.setItem('pf_active_chat_ticket', newTicketId);
            
            // Join Room
            if (socket) socket.emit('join_ticket', newTicketId);
            
            // Add initial message locally
            setMessages([{ 
                id: 'temp-' + Date.now(), 
                content: input, 
                sender: 'CUSTOMER', 
                createdAt: new Date().toISOString() 
            }]);
            
            setInput('');
        } catch (e) {
            console.error("Failed to start chat", e);
            // If create fails (e.g. auth issue), don't lock UI
            handleDeadTicket();
        }
    }
  };

  if (!user) return null; 

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
        {!isOpen && (
            <button 
                onClick={() => setIsOpen(true)}
                className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                style={{ width: '60px', height: '60px', fontSize: '24px' }}
            >
                <i className="fas fa-comment-dots"></i>
            </button>
        )}

        {isOpen && (
            <div className="card shadow-lg border-0" style={{ width: '360px', height: '520px', display: 'flex', flexDirection: 'column', borderRadius: '15px' }}>
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <span className="fw-bold"><i className="fas fa-headset me-2"></i>Support Team</span>
                    <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-link text-white text-decoration-none"><i className="fas fa-times fa-lg"></i></button>
                </div>
                
                <div className="card-body p-3" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
                    {messages.length === 0 && (
                        <div className="text-center mt-5">
                            <div className="bg-white p-3 rounded-circle d-inline-block shadow-sm mb-3">
                                <i className="fas fa-hand-holding-heart text-primary fa-2x"></i>
                            </div>
                            <p className="text-muted small">How can we help you today?</p>
                        </div>
                    )}
                    
                    {messages.map((m, i) => {
                        const isMe = m.sender === 'CUSTOMER';
                        return (
                            <div key={i} className={`d-flex flex-column mb-3 ${isMe ? 'align-items-end' : 'align-items-start'}`}>
                                <div 
                                    className={`p-3 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                    style={{ 
                                        maxWidth: '80%', 
                                        fontSize: '0.9rem',
                                        borderRadius: '18px',
                                        borderBottomRightRadius: isMe ? '4px' : '18px',
                                        borderBottomLeftRadius: !isMe ? '4px' : '18px'
                                    }}
                                >
                                    {m.content}
                                </div>
                                <small className="text-muted mt-1" style={{ fontSize: '0.65rem', padding: '0 5px' }}>
                                    {isMe ? 'You' : (m.senderName || 'Staff')} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </small>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="card-footer bg-white p-2 border-top-0">
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light rounded-pill px-3" 
                            placeholder="Type a message..." 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            style={{ boxShadow: 'none' }}
                        />
                        <button 
                            className="btn btn-primary rounded-circle ms-2 d-flex align-items-center justify-content-center" 
                            onClick={handleSend}
                            style={{ width: '40px', height: '40px' }}
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}