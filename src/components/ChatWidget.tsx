'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import { IconMessageChatbot, IconX, IconSend, IconPaperclip, IconLoader, IconCheck, IconThumbUp } from '@tabler/icons-react';
import Link from 'next/link';

export function ChatWidget() {
  const { user, token } = useAuthStore() || {}; 
  
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [verified, setVerified] = useState(false); 
  const [resolutionPrompt, setResolutionPrompt] = useState(false); 
  const [mounted, setMounted] = useState(false);

  // Logic State
  const [chatStarted, setChatStarted] = useState(false);
  const [step, setStep] = useState<'INITIAL' | 'EMAIL_FORM' | 'PIN_VERIFY' | 'PIN_MISSING' | 'CHAT'>('INITIAL');
  const [ticketId, setTicketId] = useState('');
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [pinType, setPinType] = useState<'EMAIL' | 'ACCOUNT'>('EMAIL');

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  
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
  }, [user]);

  useEffect(() => {
      if (!user) {
          setEmail('');
      } else {
          setEmail(user.email);
      }
  }, [user]);

  useEffect(() => { 
      if (viewport.current) viewport.current.scrollTop = viewport.current.scrollHeight; 
  }, [messages, step, isOpen, resolutionPrompt]);

  // Load Persistence on Mount
  useEffect(() => {
      const storedId = localStorage.getItem('pf_active_chat_ticket');
      
      if (storedId) {
          setTicketId(storedId);
          setActiveTicket(storedId);
          setChatStarted(true);
          setStep('CHAT');
          loadTicketHistory(storedId); 

      } else if (user) {
          api.get('/customer/portal/tickets').then(res => {
              const openTicket = res.data.find((t: any) => t.status !== 'CLOSED' && t.status !== 'RESOLVED');
              if (openTicket) {
                  setTicketId(openTicket.id);
                  setActiveTicket(openTicket.id);
                  localStorage.setItem('pf_active_chat_ticket', openTicket.id);
                  setChatStarted(true);
                  setStep('CHAT');
                  if (isOpen) loadTicketHistory(openTicket.id);
              }
          }).catch(() => {});
      }
  }, [isOpen]);

  // --- FUNCTIONS ---

  const handleDeadTicket = () => {
      console.log("Cleaning up dead ticket session...");
      localStorage.removeItem('pf_active_chat_ticket');
      setActiveTicket(null);
      setTicketId('');
      setMessages([]);
      setChatStarted(false);
      setStep('INITIAL'); 
      setResolutionPrompt(false);
      
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
  };

  const connectSocket = (tid: string) => {
      if (!tid) return;
      
      const s = io('https://api.pixelforgedeveloper.com/chat', { 
          auth: { token: token ? `Bearer ${token}` : undefined },
          transports: ['websocket'] 
      });

      s.on('connect', () => { s.emit('join_ticket', tid); });
      
      s.on('ticket_history', (history: any[]) => {
          if (Array.isArray(history)) {
             setMessages(history); 
             setChatStarted(true);
             setStep('CHAT');
          }
      });
      
      s.on('request_pin', (data: any) => { 
          setPinType(data?.type === 'ACCOUNT' ? 'ACCOUNT' : 'EMAIL');
          setStep('PIN_VERIFY'); 
          setShowPinInput(true);
          setLoading(false); 
      });

      s.on('request_resolution', () => {
          setResolutionPrompt(true);
      });

      // --- NEW: Handle Close Signal ---
      s.on('ticket_closed', () => {
          handleDeadTicket();
      });

      s.on('pin_missing', () => {
          setStep('PIN_MISSING');
          setLoading(false);
      });
      
      s.on('pin_success', () => { 
          setVerified(true);
          setShowPinInput(false); 
          setPin('');
          setTimeout(() => {
             setVerified(false);
             setStep('CHAT'); 
             setChatStarted(true);
          }, 1500); 
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

      s.on('ticket_error', handleDeadTicket);

      setSocket(s);
      return () => { s.disconnect(); };
  };

  const loadTicketHistory = async (tid: string) => {
      try {
          const res = await api.get(`/customer/portal/tickets/${tid}`);
          if (res.data) {
              if (res.data.status === 'CLOSED' || res.data.status === 'RESOLVED') {
                  handleDeadTicket();
                  return;
              }

              setChatStarted(true);
              setStep('CHAT');
              
              if (res.data.messages && Array.isArray(res.data.messages)) {
                 const mapped = res.data.messages.map((m: any) => ({
                     id: m.id,
                     content: m.content,
                     sender: m.staffUserId ? 'STAFF' : 'CUSTOMER',
                     createdAt: m.createdAt
                 }));
                 setMessages(mapped);
              }

              if(!socket) connectSocket(tid);
          }
      } catch (e) { 
          handleDeadTicket(); 
      }
  };

  const handleStart = () => { setIsOpen(true); };

  const handleSubmitEmail = async (e: React.FormEvent) => {
      e.preventDefault(); setLoading(true); setError('');
      try {
          const finalSubject = `[${issueType}] ${subject}`;
          const headers: any = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch('https://api.pixelforgedeveloper.com/customer/portal/tickets', {
              method: 'POST', headers,
              body: JSON.stringify({ email, subject: finalSubject, message: description })
          });
          
          if (!res.ok) throw new Error('Failed to create ticket');
          const data = await res.json();
          const newId = data.id || data.data?.id;

          if(newId) {
             setTicketId(newId);
             setActiveTicket(newId);
             localStorage.setItem('pf_active_chat_ticket', newId);
             setChatStarted(true);
             setStep('CHAT'); 
             setMessages([{ id: 'init', content: description, sender: 'CUSTOMER', createdAt: new Date().toISOString() }]);
             connectSocket(newId);
             setLoading(false);
          } else { throw new Error('No ID returned'); }
      } catch(e: any) { setLoading(false); setError(e.message || 'Failed to start chat.'); }
  };

  const handlePinSubmit = () => { 
      if(pin.length < 4) { setPinError(true); return; }
      setPinError(false); setLoading(true); 
      socket?.emit('verify_pin', { ticketId: activeTicket || ticketId, pin }); 
  };

  const handleResolutionResponse = (isResolved: boolean) => {
      setResolutionPrompt(false);
      const text = isResolved 
         ? "Yes, you can close this ticket. Everything is good! 👍" 
         : "No, I still have questions. Please keep it open.";
      
      if (socket && socket.connected) {
          socket.emit('send_message', { ticketId: activeTicket || ticketId, content: text });
      }
      setMessages(prev => [...prev, { id: 'temp-'+Date.now(), content: text, sender: 'CUSTOMER', createdAt: new Date().toISOString() }]);
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
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            await api.post('/chat/messages', { ticketId: tid, content: input }, { headers });
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

  if (!mounted) return null;

  if (!isOpen) return (
      <button onClick={handleStart} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2147483647, width: '75px', height: '75px', borderRadius: '50%', backgroundColor: '#0d6efd', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconMessageChatbot size={40} />
      </button>
  );

  return (
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2147483647, width: '380px', height: '600px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #dee2e6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ backgroundColor: '#0d6efd', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><IconMessageChatbot size={20}/> Support</span>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><IconX size={20}/></button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#f8f9fa' }} ref={viewport}>
              {/* SUCCESS OVERLAY */}
              {verified && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ backgroundColor: '#28a745', borderRadius: '50%', padding: '20px', marginBottom: '15px' }}>
                          <IconCheck size={40} color="white" />
                      </div>
                      <h4 style={{ color: '#28a745', margin: 0 }}>Verified!</h4>
                  </div>
              )}

              {!chatStarted ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px' }}>
                      <div style={{ backgroundColor: '#e7f1ff', padding: '20px', borderRadius: '50%' }}><IconMessageChatbot size={40} className="text-blue-600"/></div>
                      <div style={{textAlign: 'center'}}><h3 style={{ margin: 0, fontSize: '1.25rem' }}>How can we help?</h3><p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#6c757d' }}>We reply in a few minutes.</p></div>
                      
                      <form onSubmit={handleSubmitEmail} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           {user?.email ? (
                               <div style={{ padding: '10px', backgroundColor: '#e9ecef', borderRadius: '8px', fontSize: '0.9rem', color: '#495057', textAlign: 'center' }}>Continuing as <strong>{user.email}</strong></div>
                           ) : (
                               <input style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da' }} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required type="email"/>
                           )}
                           <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da', appearance: 'none', backgroundColor: 'white', backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }} value={issueType} onChange={e => setIssueType(e.target.value)}><option>General Inquiry</option><option>Order Issue</option><option>Billing</option><option>Technical Support</option></select>
                           <input style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da' }} placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} required />
                           <textarea style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da', minHeight: '80px' }} placeholder="Message" value={description} onChange={e=>setDescription(e.target.value)} required />
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
                      
                      {/* RESOLUTION PROMPT */}
                      {resolutionPrompt && (
                          <div style={{ backgroundColor: 'white', border: '2px solid #20c997', borderRadius: '8px', padding: '15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                              <IconThumbUp size={30} color="#20c997" style={{ marginBottom: '10px' }} />
                              <h5 style={{ fontSize: '1rem', margin: '0 0 10px' }}>Is your issue resolved?</h5>
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                  <button onClick={() => handleResolutionResponse(true)} style={{ backgroundColor: '#20c997', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', fontSize: '0.9rem', cursor: 'pointer' }}>Yes, Close Ticket</button>
                                  <button onClick={() => handleResolutionResponse(false)} style={{ backgroundColor: '#e9ecef', color: '#333', border: 'none', borderRadius: '5px', padding: '8px 15px', fontSize: '0.9rem', cursor: 'pointer' }}>No, not yet</button>
                              </div>
                          </div>
                      )}

                      {(step === 'PIN_VERIFY' || showPinInput) && (
                          <div style={{ border: '1px solid #ffecb5', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#664d03', fontWeight: 'bold' }}>🔒 Security Check</p>
                              <p style={{ margin: '0 0 10px', fontSize: '0.8rem' }}>{pinType === 'ACCOUNT' ? 'Enter Account PIN' : `Enter PIN sent to ${email}`}</p>
                              {pinError && <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 5px' }}>⚠️ Incorrect PIN. Try again.</p>}
                              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}><input style={{ width: '100px', textAlign: 'center', padding: '5px', border: pinError ? '1px solid #dc3545' : '1px solid #ced4da', borderRadius: '4px' }} placeholder="000000" maxLength={6} value={pin} onChange={e=>setPin(e.target.value)} /><button onClick={submitPin} style={{ backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '4px', padding: '0 10px' }}>Verify</button></div>
                          </div>
                      )}
                      
                      {step === 'PIN_MISSING' && (
                          <div style={{ border: '1px solid #cff4fc', backgroundColor: '#e0cffc', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                              <p style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#333', fontWeight: 'bold' }}>⚠️ Setup Required</p>
                              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#555' }}>You need a Security PIN to chat.</p>
                              <Link href="/dashboard/settings/security" className="btn btn-sm btn-dark text-white text-decoration-none" style={{ padding: '5px 10px', borderRadius: '5px', display: 'inline-block' }}>Set PIN Now</Link>
                          </div>
                      )}
                      <div ref={messagesEndRef} />
                  </div>
              )}
          </div>

          {(step === 'CHAT' || (chatStarted && step !== 'PIN_VERIFY' && step !== 'PIN_MISSING')) && (
              <div style={{ padding: '10px 15px', backgroundColor: 'white', borderTop: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{ width: '45px', height: '45px', borderRadius: '50%', border: 'none', backgroundColor: '#f1f3f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconPaperclip size={26} color="#6c757d"/></button>
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} />
                  <input style={{ flex: 1, border: 'none', backgroundColor: '#f1f3f5', padding: '10px 15px', borderRadius: '20px', outline: 'none', fontSize: '0.9rem' }} placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                  <button onClick={handleSend} style={{ width: '45px', height: '45px', borderRadius: '50%', border: 'none', backgroundColor: '#0d6efd', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconSend size={26} /></button>
              </div>
          )}
      </div>
  );
}