'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // MFA State
  const [showMfa, setShowMfa] = useState(false);
  const [pin, setPin] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Call Backend
      const payload: any = { email, password };
      // If MFA is active, include the code
      if (showMfa) {
          payload.code = pin; 
      }

      const res = await api.post('/customer/auth/login', payload);
      
      // 2. Success! Update Client State
      login(res.data.user); 
      
      // 3. Redirect
      router.push('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed.';
      
      // Check for MFA Challenge
      if (msg === 'MFA_REQUIRED' || err.response?.status === 403) {
          setShowMfa(true);
          setError(''); // Clear previous errors
          // Focus pin input logically happens on render
      } else {
          setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-section bg-light" style={{ minHeight: '100vh', paddingTop: '150px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header"><h3 className="text-center font-weight-light my-4">Customer Login</h3></div>
              <div className="card-body">
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleLogin}>
                  {!showMfa ? (
                      <>
                          <div className="form-floating mb-3">
                            <input 
                              className="form-control" 
                              id="inputEmail" 
                              type="email" 
                              placeholder="name@example.com" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                            <label htmlFor="inputEmail">Email address</label>
                          </div>
                          <div className="form-floating mb-3">
                            <input 
                              className="form-control" 
                              id="inputPassword" 
                              type="password" 
                              placeholder="Password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <label htmlFor="inputPassword">Password</label>
                          </div>
                      </>
                  ) : (
                      <div className="mb-4 text-center">
                          <div className="alert alert-info py-2 small">
                              <i className="fas fa-shield-alt me-2"></i>
                              Enter the security code sent to your email or app.
                          </div>
                          <div className="form-floating mb-3">
                            <input 
                              className="form-control text-center fw-bold letter-spacing-2" 
                              style={{ letterSpacing: '5px', fontSize: '1.2rem' }}
                              id="inputPin" 
                              type="text" 
                              placeholder="000000" 
                              value={pin}
                              onChange={(e) => setPin(e.target.value)}
                              maxLength={6}
                              required
                              autoFocus
                            />
                            <label htmlFor="inputPin" className="text-center w-100">Security PIN</label>
                          </div>
                      </div>
                  )}

                  <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                    {!showMfa && <a className="small" href="#">Forgot Password?</a>}
                    {showMfa && <button type="button" className="btn btn-link text-muted btn-sm" onClick={() => setShowMfa(false)}>Cancel</button>}
                    
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? 'Verifying...' : (showMfa ? 'Verify & Login' : 'Login')}
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <div className="small"><Link href="/register">Need an account? Sign up!</Link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}