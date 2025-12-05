'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { getAvatarUrl } from '@/lib/utils';

export default function SettingsPage() {
  const { user, token, login } = useAuthStore();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile State
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', bio: '', avatarUrl: ''
  });

  // Password State
  const [passData, setPassData] = useState({ new: '' });

  // Org State
  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState(''); 

  // Notification State
  const [notifs, setNotifs] = useState({
     orders: true,
     tickets: true,
     projects: true,
     marketing: false,
     security: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '', // Email is now editable via state
        phone: user.phone || '', 
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || ''
      });
      
      // Load preferences from metadata if exists
      if (user.metadata && (user.metadata as any).notifications) {
          setNotifs({ ...notifs, ...(user.metadata as any).notifications });
      }
    }
  }, [user]);

  // --- AVATAR ---
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
        const uploadRes = await api.post('/documents/upload/avatar', uploadFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const newAvatarUrl = uploadRes.data.url;
        
        // Update profile immediately with new URL
        const profileRes = await api.patch('/customer/auth/profile', { ...formData, avatarUrl: newAvatarUrl });

        setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
        if (profileRes.data.user && token) {
           login(token, profileRes.data.user);
           router.refresh();
        }
        setMessage({ type: 'success', text: 'Avatar updated!' });
    } catch (error: any) {
        setMessage({ type: 'danger', text: 'Avatar upload failed.' });
    } finally { setLoading(false); }
  };

  // --- PROFILE UPDATE (Includes Email) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.patch('/customer/auth/profile', formData);
      
      // If email changed, user might need to re-login eventually, but for now just update local store
      if (res.data.user && token) {
         login(token, res.data.user);
      }
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error: any) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  // --- PASSWORD ---
  const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      if (passData.new.length < 6) {
         setMessage({ type: 'danger', text: 'Password must be 6+ chars.' });
         return;
      }
      try {
          await api.patch('/customer/auth/password', { password: passData.new });
          setMessage({ type: 'success', text: 'Password updated successfully.' });
          setPassData({ new: '' });
      } catch(e: any) {
          setMessage({ type: 'danger', text: 'Failed to update password.' });
      }
  };

  // --- NOTIFICATIONS ---
  const handleSaveNotifs = async () => {
      setLoading(true);
      try {
          // We save notifications into the 'metadata' JSON field of the user
          // First, get existing metadata from user object
          const existingMeta = (user as any)?.metadata || {};
          const newMeta = { ...existingMeta, notifications: notifs };

          const res = await api.patch('/customer/auth/profile', { metadata: newMeta });
          
          if (res.data.user && token) login(token, res.data.user);
          setMessage({ type: 'success', text: 'Preferences saved.' });
      } catch (e) {
          setMessage({ type: 'danger', text: 'Failed to save preferences.' });
      } finally { setLoading(false); }
  };

  // --- ORG ---
  const handleCreateOrg = async () => {
      if(!orgName) return;
      try {
          await api.post('/customer/portal/organization', { name: orgName });
          alert('Organization Created!');
          router.push('/dashboard/organization'); 
      } catch(e: any) { 
          alert(e.response?.data?.message || 'Failed to create org.');
      }
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold text-dark">Account Settings</h2>
      
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      <div className="card shadow-sm border-0 overflow-hidden">
          <div className="card-header bg-white border-bottom-0 pt-4 px-4">
              <ul className="nav nav-tabs card-header-tabs d-flex flex-row">
                <li className="nav-item"><button className={`nav-link ${activeTab === 'profile' ? 'active fw-bold text-primary border-bottom-0' : 'text-muted'}`} onClick={() => setActiveTab('profile')}><i className="fas fa-user me-2"></i> Profile</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'security' ? 'active fw-bold text-primary border-bottom-0' : 'text-muted'}`} onClick={() => setActiveTab('security')}><i className="fas fa-shield-alt me-2"></i> Security</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'org' ? 'active fw-bold text-primary border-bottom-0' : 'text-muted'}`} onClick={() => setActiveTab('org')}><i className="fas fa-building me-2"></i> Organization</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'notifications' ? 'active fw-bold text-primary border-bottom-0' : 'text-muted'}`} onClick={() => setActiveTab('notifications')}><i className="fas fa-bell me-2"></i> Notifications</button></li>
              </ul>
          </div>

          <div className="card-body p-4">
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center mb-5">
                        <div className="position-relative me-4">
                            <img src={getAvatarUrl(formData)} className="rounded-circle shadow-sm" width="100" height="100" alt="Profile" style={{ objectFit: 'cover', border: '4px solid #f8f9fa' }} />
                            <label className="btn btn-primary position-absolute rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', bottom: '0', right: '0', border: '2px solid white', cursor: 'pointer' }}>
                                <i className="fas fa-camera fa-sm"></i>
                                <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                            </label>
                        </div>
                        <div className="ms-3"> 
                            <h4 className="m-0 fw-bold">{formData.firstName} {formData.lastName}</h4>
                            <small className="text-muted">Manage your public profile details</small>
                        </div>
                    </div>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6"><label className="form-label fw-bold small text-muted">First Name</label><input type="text" className="form-control" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
                        <div className="col-md-6"><label className="form-label fw-bold small text-muted">Last Name</label><input type="text" className="form-control" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
                    </div>
                    
                    {/* --- EDITABLE EMAIL --- */}
                    <div className="mb-4">
                        <label className="form-label fw-bold small text-muted">Email Address</label>
                        <input 
                           type="email" 
                           className="form-control" 
                           value={formData.email} 
                           onChange={e => setFormData({...formData, email: e.target.value})} 
                           required
                        />
                        <small className="text-muted">Changing this will update your login email.</small>
                    </div>

                    <div className="mb-4"><label className="form-label fw-bold small text-muted">Bio</label><textarea className="form-control" rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea></div>
                    <div className="d-flex justify-content-end"><button type="submit" className="btn btn-primary px-4" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button></div>
                </form>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                 <div>
                    <h5 className="fw-bold mb-3">Change Password</h5>
                    <form onSubmit={handlePasswordChange}>
                       <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input type="password" className="form-control" required minLength={6} value={passData.new} onChange={e => setPassData({ new: e.target.value })} />
                       </div>
                       <button className="btn btn-warning">Update Password</button>
                    </form>
                    <hr className="my-4 text-muted" />
                    <h5 className="fw-bold text-danger mb-3">Danger Zone</h5>
                    <button className="btn btn-outline-danger btn-sm">Delete Account</button>
                 </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                  <div>
                     <h5 className="fw-bold mb-3">Email Preferences</h5>
                     <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" checked={notifs.orders} onChange={e => setNotifs({...notifs, orders: e.target.checked})} id="n1" />
                        <label className="form-check-label" htmlFor="n1">Order Updates</label>
                     </div>
                     <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" checked={notifs.tickets} onChange={e => setNotifs({...notifs, tickets: e.target.checked})} id="n2" />
                        <label className="form-check-label" htmlFor="n2">Ticket Replies</label>
                     </div>
                     <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" checked={notifs.projects} onChange={e => setNotifs({...notifs, projects: e.target.checked})} id="n3" />
                        <label className="form-check-label" htmlFor="n3">Project Updates</label>
                     </div>
                     <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" checked={notifs.security} onChange={e => setNotifs({...notifs, security: e.target.checked})} id="n4" />
                        <label className="form-check-label" htmlFor="n4">Security Alerts</label>
                     </div>
                     <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" checked={notifs.marketing} onChange={e => setNotifs({...notifs, marketing: e.target.checked})} id="n5" />
                        <label className="form-check-label" htmlFor="n5">Marketing & Newsletter</label>
                     </div>
                     <button className="btn btn-primary mt-3" onClick={handleSaveNotifs} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Preferences'}
                     </button>
                  </div>
              )}

              {/* ORGANIZATION TAB */}
              {activeTab === 'org' && (
                  <div>
                      <div className="text-center py-4">
                          <div className="mb-3"><i className="fas fa-building fa-3x text-muted opacity-50"></i></div>
                          <h5>Join or Create an Organization</h5>
                          <p className="text-muted small w-75 mx-auto">Organizations allow you to share projects, orders, and tickets with your team.</p>
                      </div>
                      <div className="row g-4">
                          <div className="col-md-6">
                              <div className="card h-100 border shadow-sm">
                                  <div className="card-body">
                                      <h6 className="fw-bold">Create New Organization</h6>
                                      <input className="form-control mb-3" placeholder="Company Name" value={orgName} onChange={e => setOrgName(e.target.value)} />
                                      <button className="btn btn-primary w-100" onClick={handleCreateOrg}>Create Organization</button>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-6">
                              <div className="card h-100 border shadow-sm">
                                  <div className="card-body">
                                      <h6 className="fw-bold">Join Existing</h6>
                                      <input className="form-control mb-3" placeholder="Invite Code" value={inviteCode} onChange={e => setInviteCode(e.target.value)} />
                                      <button className="btn btn-outline-primary w-100">Join Team</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}