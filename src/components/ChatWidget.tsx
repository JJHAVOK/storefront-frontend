'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import { IconMessageChatbot, IconX, IconSend, IconPaperclip, IconLoader } from '@tabler/icons-react';

export function ChatWidget() {
  const { user, token } = useAuthStore() || {}; 
  
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Logic State
  const [chatStarted, setChatStarted] = useState(false);
  const [step, setStep] = useState<'INITIAL' | 'EMAIL_FORM' | 'PIN_VERIFY' | 'CHAT'>('INITIAL');
  const [ticketId, setTicketId] = useState('');
  const [activeTicket, setActiveTicket] = useState<string | null>(null);

  // Data State
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  
  // Form Inputs
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [issueType, setIssueType] = useState('General Inquiry');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [socket, setSocket] = useState<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
      setMounted(true);
      if (user?.email) setEmail(user.email);
      (window as any).openChatWidget = () => setIsOpen(true);
      return () => { delete (window as any).openChatWidget; };
  }, [user]);

  useEffect(() => { 
      if (viewport.current) viewport.current.scrollTop = viewport.current.scrollHeight; 
  }, [messages, step, isOpen]);

  // Load Persistence
  useEffect(() => {
      const storedId = localStorage.getItem('pf_active_chat_ticket');
      if (storedId) {
          setTicketId(storedId);
          setActiveTicket(storedId);
          if (isOpen && !socket) connectSocket(storedId);
      } else if (user) {
          api.get('/customer/portal/tickets').then(res => {
              const openTicket = res.data.find((t: any) => t.status !== 'CLOSED' && t.status !== 'RESOLVED');
              if (openTicket) {
                  setTicketId(openTicket.id);
                  setActiveTicket(openTicket.id);
                  localStorage.setItem('pf_active_chat_ticket', openTicket.id);
                  if (isOpen) loadTicketHistory(openTicket.id);
              }
          }).catch(() => {});
      }
  }, [isOpen, user]);

  const connectSocket = (tid: string) => {
      if (!tid) return;
      
      const s = io('https://api.pixelforgedeveloper.com/chat', { 
          auth: { token: token ? `Bearer ${token}` : undefined },
          transports: ['websocket'] 
      });

      s.on('connect', () => { s.emit('join_ticket', tid); });
      s.on('ticket_created', (t: any) => { 
          setLoading(false); 
          setTicketId(t.id); 
          setActiveTicket(t.id);
          localStorage.setItem('pf_active_chat_ticket', t.id);
          setStep('CHAT'); 
          setChatStarted(true);
      });
      s.on('request_pin', () => { setStep('PIN_VERIFY'); setLoading(false); });
      s.on('pin_success', (msg) => { 
          setShowPinInput(false); setPin(''); 
          setStep('CHAT'); 
          setChatStarted(true);
          setMessages(prev => [...prev, { id: 'sys-'+Date.now(), content: 'Identity Verified', sender: 'SYSTEM', createdAt: new Date().toISOString() }]);
      });
      s.on('pin_failed', () => { 
          setPinError(true); 
          setTimeout(() => setPinError(false), 3000); 
          setLoading(false);
      });
      s.on('new_message', (m: any) => { 
          setMessages(prev => { 
              if (prev.some(x => x.id === m.id)) return prev; 
              return [...prev, m]; 
          }); 
      });
      s.on('ticket_error', () => { 
          localStorage.removeItem('pf_active_chat_ticket');
          setActiveTicket(null);
          setMessages([]);
          setChatStarted(false);
          setStep('INITIAL');
      });

      setSocket(s);
  };

  const loadTicketHistory = async (tid: string) => {
      try {
          const res = await api.get(`/customer/portal/tickets/${tid}`);
          if (res.data) {
              const normalizedMessages = (res.data.messages || []).map((m: any) => ({
                  ...m,
                  sender: m.staffUserId ? 'STAFF' : 'CUSTOMER',
                  senderName: m.staffUserId ? (m.staffUser?.firstName || 'Staff') : 'Customer'
              }));
              setMessages(normalizedMessages);
              setChatStarted(true);
              setStep('CHAT');
              scrollToBottom();
          }
      } catch (e) { 
          // If 404 or unauthorized, clear ticket
          localStorage.removeItem('pf_active_chat_ticket');
          setActiveTicket(null);
      }
  };

  const handleStart = () => { setIsOpen(true); };

  const handleSubmitEmail = async (e: React.FormEvent) => {
      e.preventDefault(); setLoading(true); setError('');
      try {
          const finalSubject = `[${issueType}] ${subject}`;
          
          // FIX: Add Authorization Header
          const headers: any = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch('https://api.pixelforgedeveloper.com/customer/portal/tickets', {
              method: 'POST', 
              headers: headers,
              body: JSON.stringify({ email, subject: finalSubject, message: description })
          });

          if (!res.ok) {
              if (res.status === 401) throw new Error("Please log in to start a chat.");
              throw new Error("Failed to create ticket.");
          }

          const data = await res.json();
          // Access ID safely
          const newId = data.id || data.data?.id;

          if(newId) {
             setTicketId(newId);
             setActiveTicket(newId);
             localStorage.setItem('pf_active_chat_ticket', newId);
             
             // Optimistic switch
             setChatStarted(true);
             setStep('CHAT'); 
             setMessages([{ id: 'init', content: description, sender: 'CUSTOMER', createdAt: new Date().toISOString() }]);
             
             connectSocket(newId);
             setLoading(false);
          } else {
             throw new Error('No ID returned');
          }
      } catch(e: any) { 
          setLoading(false); 
          setError(e.message || 'Failed to start chat. Try again.'); 
      }
  };

  const handlePinSubmit = () => { 
      if(pin.length < 6) { setPinError(true); return; }
      setPinError(false); setLoading(true); 
      socket?.emit('verify_pin', { ticketId: activeTicket || ticketId, pin }); 
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const tempMsg = { id: 'temp-'+Date.now(), content: input, sender: 'CUSTOMER', createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);

    const tid = activeTicket || ticketId;
    if (tid) {
        if (socket && socket.connected) {
            socket.emit('send_message', { ticketId: tid, content: input });
        } else {
            await api.post('/chat/messages', { ticketId: tid, content: input });
        }
        setInput('');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      alert("File upload available in dashboard only for now.");
      if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const submitPin = () => { handlePinSubmit(); };
  const scrollToBottom = () => { setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); };

  if (!mounted) return null;

  if (!isOpen) return (
      <button onClick={handleStart} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2147483647, width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#0d6efd', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconMessageChatbot size={36} />
      </button>
  );

  return (
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2147483647, width: '380px', height: '600px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #dee2e6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ backgroundColor: '#0d6efd', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><IconMessageChatbot size={20}/> Support</span>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><IconX size={20}/></button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#f8f9fa' }} ref={viewport}>
              {!chatStarted ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px' }}>
                      <div style={{ backgroundColor: '#e7f1ff', padding: '20px', borderRadius: '50%' }}><IconMessageChatbot size={40} className="text-blue-600"/></div>
                      <div style={{textAlign: 'center'}}><h3 style={{ margin: 0, fontSize: '1.25rem' }}>How can we help?</h3><p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#6c757d' }}>We reply in a few minutes.</p></div>
                      
                      <form onSubmit={handleSubmitEmail} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                           <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da' }} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required type="email"/>
                           <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da' }} value={issueType} onChange={e => setIssueType(e.target.value)}><option>General Inquiry</option><option>Order Issue</option><option>Billing</option><option>Technical Support</option></select>
                           <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da' }} placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} required />
                           <textarea style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', minHeight: '80px' }} placeholder="Message" value={description} onChange={e=>setDescription(e.target.value)} required />
                           {error && <div style={{ color: '#dc3545', fontSize: '0.85rem', textAlign: 'center', backgroundColor: '#f8d7da', padding: '5px', borderRadius: '5px' }}>{error}</div>}
                           <button disabled={loading} style={{ padding: '12px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>{loading ? <IconLoader className="animate-spin inline"/> : 'Start Chat'}</button>
                      </form>
                  </div>
              ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {messages.map((m, i) => {
                          const isMe = m.sender === 'CUSTOMER';
                          if (m.sender === 'SYSTEM') return <div key={i} style={{ textAlign: 'center', margin: '5px 0', fontSize: '0.75rem', color: '#6c757d' }}>{m.content}</div>;
                          return <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', backgroundColor: isMe ? '#0d6efd' : 'white', color: isMe ? 'white' : 'black', padding: '10px', borderRadius: '10px', maxWidth: '85%', fontSize: '0.9rem', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{m.content}</div>;
                      })}
                      {(showPinInput || step === 'PIN_VERIFY') && (
                          <div style={{ border: '1px solid #ffecb5', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#664d03', fontWeight: 'bold' }}>🔒 Security Check</p>
                              <p style={{ margin: '0 0 10px', fontSize: '0.8rem' }}>Enter PIN sent to {email}</p>
                              {pinError && <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 5px' }}>⚠️ Incorrect PIN. Try again.</p>}
                              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}><input style={{ width: '100px', textAlign: 'center', padding: '5px', border: pinError ? '1px solid #dc3545' : '1px solid #ced4da', borderRadius: '4px' }} placeholder="000000" maxLength={6} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g, ''))} /><button onClick={submitPin} style={{ backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '4px', padding: '0 10px' }}>Verify</button></div>
                          </div>
                      )}
                      <div ref={messagesEndRef} />
                  </div>
              )}
          </div>

          {(step === 'CHAT' || chatStarted) && (
              <div style={{ padding: '10px 15px', backgroundColor: 'white', borderTop: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: '#f1f3f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconPaperclip size={24} color="#6c757d"/></button>
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} />
                  <input style={{ flex: 1, border: 'none', backgroundColor: '#f1f3f5', padding: '10px 15px', borderRadius: '20px', outline: 'none', fontSize: '0.9rem' }} placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                  <button onClick={handleSend} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: '#0d6efd', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconSend size={24} /></button>
              </div>
          )}
      </div>
  );
}