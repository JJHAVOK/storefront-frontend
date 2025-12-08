'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';

interface AuthModalProps {
  mode: 'login' | 'register';
  onSwitch: () => void; 
  onClose: () => void; 
  preventRedirect?: boolean; 
}

export function AuthModal({ mode, onSwitch, onClose, preventRedirect = false }: AuthModalProps) {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Password Strength ---
  const [strength, setStrength] = useState(0);
  useEffect(() => {
    if (mode === 'register') {
      let score = 0;
      const pass = formData.password;
      if (pass.length >= 8) score += 25;
      if (/[A-Z]/.test(pass)) score += 25;
      if (/[0-9]/.test(pass)) score += 25;
      if (/[^A-Za-z0-9]/.test(pass)) score += 25;
      setStrength(score);
    }
  }, [formData.password, mode]);

  const getStrengthColor = () => {
    if (strength < 50) return 'bg-danger';
    if (strength < 75) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register' && strength < 75) {
      setError('Password is too weak. Use 8+ chars, numbers, and symbols.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        const payload = { ...formData, code: mfaRequired ? mfaCode : undefined };
        const res = await api.post('/customer/auth/login', payload);
        
        login(res.data.access_token, res.data.user);
        onClose(); 
        if (!preventRedirect) router.push('/dashboard'); 
      } else {
        // REGISTER
        await api.post('/customer/auth/register', {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
        });
        
        setIsSuccess(true);
        
        // Auto-Login Logic
        setTimeout(async () => {
           try {
              const res = await api.post('/customer/auth/login', { 
                email: formData.email, 
                password: formData.password 
              });
              login(res.data.access_token, res.data.user);
              onClose();
              if (!preventRedirect) router.push('/dashboard');
           } catch(e) {
              setIsSuccess(false);
              onSwitch(); // Switch to login form
           }
        }, 2000);
      }
    } catch (err: any) {
      if (err.response?.data?.message === 'MFA_REQUIRED') {
         setMfaRequired(true);
         setError('');
         setLoading(false);
         return;
      }

      console.error('AUTH ERROR:', err);
      let msg = 'Authentication failed.';
      if (err.response) {
          msg = err.response.data?.message || `Server Error: ${err.response.status}`;
      } else if (err.request) {
          msg = 'Network Error: Could not reach server.';
      }
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
      return (
        <div className="modal fade show" style={{ display: 'block', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content shadow-lg border-0 p-5 text-center">
                    <div className="mb-4 text-success">
                        <i className="fas fa-check-circle fa-5x"></i>
                    </div>
                    <h3 className="fw-bold mb-2">Account Created!</h3>
                    <p className="text-muted">Logging you in...</p>
                    <div className="spinner-border text-primary mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)' }} 
      tabIndex={-1} 
      role="dialog"
      onClick={onClose} 
    >
      <div 
        className="modal-dialog modal-dialog-centered" 
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="modal-content shadow-lg border-0">
          
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-uppercase text-dark">
              {mfaRequired ? 'Two-Factor Auth' : (mode === 'login' ? 'Welcome Back' : 'Create Account')}
            </h5>
            <button 
              type="button" 
              className="btn btn-link text-dark text-decoration-none" 
              onClick={onClose} 
              aria-label="Close"
              style={{ fontSize: '1.5rem' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-body pt-4">
            {error && <div className="alert alert-danger small">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              {!mfaRequired ? (
                 <>
                    {mode === 'register' && (
                      <div className="row mb-3">
                        <div className="col">
                          <input type="text" className="form-control" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                        </div>
                        <div className="col">
                          <input type="text" className="form-control" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <input type="email" className="form-control" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    
                    <div className="mb-3">
                      <input type="password" className="form-control" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                      
                      {mode === 'register' && formData.password && (
                        <div className="mt-2">
                            <div className="progress" style={{ height: '5px' }}>
                                <div className={`progress-bar ${getStrengthColor()}`} role="progressbar" style={{ width: `${strength}%` }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>8+ chars, Upper, Num, Special</small>
                                <small className={`fw-bold ${strength < 50 ? 'text-danger' : strength < 75 ? 'text-warning' : 'text-success'}`} style={{ fontSize: '0.75rem' }}>{getStrengthText()}</small>
                            </div>
                        </div>
                      )}
                    </div>
                 </>
              ) : (
                 <div className="mb-3 text-center">
                    <p className="text-muted mb-3">Enter the 6-digit code from your authenticator app.</p>
                    <input 
                       type="text" 
                       className="form-control form-control-lg text-center fw-bold" 
                       placeholder="000 000" 
                       maxLength={6}
                       value={mfaCode}
                       onChange={e => setMfaCode(e.target.value)}
                       autoFocus
                       style={{ letterSpacing: '5px', fontSize: '1.5rem' }}
                    />
                 </div>
              )}

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Processing...' : (mfaRequired ? 'Verify' : (mode === 'login' ? 'Sign In' : 'Register'))}
                </button>
              </div>
            </form>
          </div>
          
          {!mfaRequired && (
              <div className="modal-footer justify-content-center bg-light border-0">
                <button className="btn btn-link text-decoration-none" onClick={onSwitch}>
                  {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}