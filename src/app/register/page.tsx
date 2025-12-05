'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/customer/auth/register', formData);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-section bg-light" style={{ minHeight: '100vh', paddingTop: '150px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header"><h3 className="text-center font-weight-light my-4">Create Account</h3></div>
              <div className="card-body">
                
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">Account created! Redirecting...</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3 mb-md-0">
                        <input 
                            className="form-control" id="inputFirstName" type="text" placeholder="Enter your first name" 
                            value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required
                        />
                        <label htmlFor="inputFirstName">First name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input 
                            className="form-control" id="inputLastName" type="text" placeholder="Enter your last name" 
                            value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required
                        />
                        <label htmlFor="inputLastName">Last name</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-floating mb-3">
                    <input 
                        className="form-control" id="inputEmail" type="email" placeholder="name@example.com" 
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
                    />
                    <label htmlFor="inputEmail">Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input 
                        className="form-control" id="inputPassword" type="password" placeholder="Create a password" 
                        value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required
                    />
                    <label htmlFor="inputPassword">Password</label>
                  </div>
                  <div className="mt-4 mb-0">
                    <div className="d-grid">
                        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <div className="small"><Link href="/login">Have an account? Go to login</Link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
