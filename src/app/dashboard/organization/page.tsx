'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function OrgManagementPage() {
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Create Form
  const [orgName, setOrgName] = useState('');

  const fetchOrg = () => {
    api.get('/customer/portal/organization')
      .then(res => setOrg(res.data))
      .catch(() => {}) // 404 means no org
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrg(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/customer/portal/organization', { name: orgName });
      fetchOrg();
    } catch(err: any) { 
       // Log the real error
       console.error(err);
       const msg = err.response?.data?.message || 'Failed to create organization.';
       alert(msg); 
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!org) {
      return (
          <div className="text-center py-5">
              <h3 className="mb-4">You are not part of an Organization yet.</h3>
              <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '500px' }}>
                  <div className="card-body">
                      <h5>Create a New Organization</h5>
                      <p className="text-muted small">Become the team lead and invite others.</p>
                      <form onSubmit={handleCreate}>
                          <input className="form-control mb-3" placeholder="Organization Name" value={orgName} onChange={e => setOrgName(e.target.value)} required />
                          <button className="btn btn-primary w-100">Create Organization</button>
                      </form>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{org.name}</h2>
            <span className="badge bg-success">Active</span>
        </div>
        
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white fw-bold">Team Members</div>
            <div className="list-group list-group-flush">
                {org.contacts?.map((c: any) => (
                    <div key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <div className="fw-bold">{c.firstName} {c.lastName}</div>
                            <small className="text-muted">{c.email}</small>
                        </div>
                        <span className="badge bg-light text-dark border">Member</span>
                    </div>
                ))}
            </div>
            <div className="card-body border-top">
                <h6>Invite Member</h6>
                <div className="input-group">
                    <input type="email" className="form-control" placeholder="Colleague's Email" />
                    <button className="btn btn-outline-primary">Send Invite</button>
                </div>
            </div>
        </div>
    </div>
  );
}
