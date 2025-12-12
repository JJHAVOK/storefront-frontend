'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { io } from 'socket.io-client';

export function StorefrontNotifications() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.readAt).length;

  const fetchNotifs = () => {
    api.get('/notifications').then(res => setNotifications(res.data)).catch(()=>{});
  };

  useEffect(() => { 
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 15000); 

      let socket: any;
      if (token) {
          socket = io('https://api.pixelforgedeveloper.com', {
              auth: { token: `Bearer ${token}` },
              transports: ['websocket'],
              reconnection: true
          });
          socket.on('notification', (newNotif: any) => {
              setNotifications(prev => [newNotif, ...prev]);
          });
      }

      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
          if (socket) socket.disconnect();
          clearInterval(interval);
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [token]);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
          await api.patch(`/notifications/${id}/read`);
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date() } : n));
      } catch(e) {}
  };

  // --- NEW: Mark All Read ---
  const handleMarkAllRead = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
          // We iterate or use a bulk endpoint if available. Iterating is fine for now.
          const unread = notifications.filter(n => !n.readAt);
          for (const n of unread) {
              await api.patch(`/notifications/${n.id}/read`);
          }
          // Update UI immediately
          setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
      } catch(e) {}
  };

  return (
    <div ref={dropdownRef} className="position-relative d-inline-block" style={{ marginRight: '20px' }}>
      
      {/* Bell Trigger */}
      <button 
        className="btn p-0 border-0 bg-transparent text-dark position-relative" 
        type="button" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="fas fa-bell" style={{ fontSize: '1.5rem', color: '#555' }}></i>
        {unreadCount > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
            style={{ fontSize: '0.65rem', border: '2px solid white' }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`dropdown-menu shadow-lg ${showDropdown ? 'show' : ''}`} 
        style={{ 
           display: showDropdown ? 'block' : 'none',
           width: '320px', 
           maxHeight: '400px', 
           overflowY: 'auto',
           border: '1px solid rgba(0,0,0,0.1)',
           borderRadius: '12px',
           position: 'absolute',
           // --- FIX ALIGNMENT ---
           right: '0', 
           left: 'auto',
           top: '100%',
           marginTop: '15px',
           zIndex: 9999
        }}
      >
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center sticky-top">
            <span className="fw-bold small text-uppercase text-muted">Notifications</span>
            {unreadCount > 0 && (
                <button 
                    onClick={handleMarkAllRead}
                    className="btn btn-link btn-sm p-0 text-decoration-none"
                    style={{ fontSize: '0.8rem' }}
                >
                    Mark all read
                </button>
            )}
        </div>

        {notifications.length === 0 ? (
            <div className="p-5 text-center text-muted">
                <i className="fas fa-bell-slash mb-3" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                <p className="small mb-0">No notifications yet.</p>
            </div>
        ) : (
            <div className="list-group list-group-flush">
                {notifications.map(n => (
                    <div 
                        key={n.id} 
                        className="list-group-item list-group-item-action p-3"
                        style={{ 
                            backgroundColor: !n.readAt ? '#f0f7ff' : 'white', 
                            borderLeft: !n.readAt ? '4px solid #0d6efd' : 'none',
                            cursor: 'default'
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0 small fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{n.title}</h6>
                            {!n.readAt && (
                                <button 
                                    className="btn btn-link btn-sm p-0 text-decoration-none" 
                                    onClick={(e) => handleMarkRead(n.id, e)}
                                    title="Mark as read"
                                >
                                    <i className="fas fa-check text-primary"></i>
                                </button>
                            )}
                        </div>
                        <p className="mb-1 small text-muted" style={{ lineHeight: '1.4' }}>{n.message}</p>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}