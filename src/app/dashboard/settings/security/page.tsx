'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function SecuritySettings() {
  const [pin, setPin] = useState('');
  const [hasPin, setHasPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
      api.get('/customer/portal/security/pin-status')
         .then(res => setHasPin(res.data.hasPin))
         .catch(() => {});
  }, []);

  const handleSave = async () => {
      setMessage(null);
      if(pin.length < 4 || pin.length > 6) {
          setMessage({ text: 'PIN must be 4-6 digits', type: 'error' });
          return;
      }
      setLoading(true);
      try {
          await api.post('/customer/portal/security/pin', { pin });
          setMessage({ text: 'PIN Updated Successfully', type: 'success' });
          setHasPin(true);
          setPin('');
      } catch(e) {
          setMessage({ text: 'Failed to update PIN', type: 'error' });
      } finally {
          setLoading(false);
      }
  };

  return (
      <div className="container py-4">
          <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold"><i className="fas fa-shield-alt me-2 text-primary"></i>Security PIN</h5>
              </div>
              <div className="card-body p-4">
                  <p className="text-muted small mb-4">
                      This PIN is used to verify your identity when chatting with support staff. 
                      It is encrypted and staff members cannot see it.
                  </p>
                  
                  {message && (
                      <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`}>
                          {message.text}
                      </div>
                  )}

                  <div className={`alert alert-${hasPin ? 'success' : 'warning'} d-inline-block px-3 py-2 mb-4`}>
                      <strong>Status:</strong> {hasPin ? '✅ Active (PIN Set)' : '⚠️ Not Set'}
                  </div>

                  <div className="mb-4" style={{ maxWidth: '300px' }}>
                      <label className="form-label fw-bold small text-uppercase text-muted">Set New PIN (4-6 Digits)</label>
                      <input 
                          type="password" 
                          className="form-control form-control-lg" 
                          value={pin}
                          onChange={e => setPin(e.target.value.replace(/\D/g,''))} // Numbers only
                          maxLength={6}
                          placeholder="••••"
                      />
                  </div>
                  <button className="btn btn-primary px-4" onClick={handleSave} disabled={loading}>
                      {loading ? 'Saving...' : 'Save PIN'}
                  </button>
              </div>
          </div>
      </div>
  );
}