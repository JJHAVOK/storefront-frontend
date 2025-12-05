'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, token, login } = useAuthStore();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', bio: '', avatarUrl: ''
  });

  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState(''); 

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '', 
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
        const uploadRes = await api.post('/documents/upload/avatar', uploadFormData, {
             headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        const newAvatarUrl = uploadRes.data.url;
        console.log("Uploaded Avatar URL:", newAvatarUrl); // Debug
        
        const profileRes = await api.patch('/customer/auth/profile', {
            ...formData,
            avatarUrl: newAvatarUrl
        });

        // Update UI immediately
        setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
        
        // Update Global Store
        if (profileRes.data.user && token) {
           login(token, profileRes.data.user);
        }
        
        setMessage({ type: 'success', text: 'Avatar updated successfully!' });
    } catch (error: any) {
        console.error("Avatar Upload Error:", error);
        setMessage({ type: 'danger', text: error.response?.data?.message || 'Avatar upload failed.' });
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.patch('/customer/auth/profile', formData);
      if (res.data.user && token) {
         login(token, res.data.user);
      }
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

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
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'profile' ? 'active fw-bold text-primary border-bottom-0' : 'text-muted'}`} onClick={() => setActiveTab('profile')}>
                    <i className="fas fa-user me-2"></i> Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'security' ? 'active fw-bold text-primary border-bottom-0' : 'text-muted'}`} onClick={() => setActiveTab('security')}>
                    <i className="fas fa-shield-alt me-2"></i> Security
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'org' ? 'active fw-bold text-primary border-bottom-0' : 'text-muted'}`} onClick={() => setActiveTab('org')}>
                    <i className="fas fa-building me-2"></i> Organization
                  </button>
                </li>
                 <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'notifications' ? 'active fw-bold text-primary border-bottom-0' : 'text-muted'}`} onClick={() => setActiveTab('notifications')}>
                    <i className="fas fa-bell me-2"></i> Notifications
                  </button>
                </li>
              </ul>
          </div>

          <div className="card-body p-4">
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center mb-5">
                        <div className="position-relative me-4">
                            <img 
                                src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=0D8ABC&color=fff`} 
                                className="rounded-circle shadow-sm" 
                                width="100" height="100" 
                                alt="Profile"
                                style={{ objectFit: 'cover', border: '4px solid #f8f9fa' }}
                            />
                            <label 
                                className="btn btn-primary position-absolute rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                                style={{ width: '35px', height: '35px', bottom: '0', right: '0', border: '2px solid white', cursor: 'pointer' }}
                            >
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
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-uppercase text-muted">First Name</label>
                            <input type="text" className="form-control form-control-lg fs-6" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-uppercase text-muted">Last Name</label>
                            <input type="text" className="form-control form-control-lg fs-6" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold small text-uppercase text-muted">Bio</label>
                        <textarea className="form-control" rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary px-4" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
              )}
              
              {/* Other tabs (Security, Org, Notifications) remain the same as previous... */}
              {/* For brevity, I am not re-pasting them, but DO NOT delete them from your file if you copy-paste this. */}
              {/* Just make sure the "activeTab" logic covers them. */}
              
               {/* --- SECURITY TAB --- */}
              {activeTab === 'security' && (
                 <div>
                    <h5 className="fw-bold mb-3">Login Sessions</h5>
                    <div className="list-group mb-4 shadow-sm">
                       <div className="list-group-item d-flex justify-content-between align-items-center p-3">
                           <div className="d-flex align-items-center">
                               <div className="bg-light p-2 rounded me-3"><i className="fas fa-desktop text-muted"></i></div>
                               <div>
                                   <div className="fw-bold">Current Session</div>
                                   <small className="text-muted">IP: 127.0.0.1 • Chrome on Windows</small>
                               </div>
                           </div>
                           <span className="badge bg-success rounded-pill">Active</span>
                       </div>
                    </div>
                    <hr className="my-4 text-muted" />
                    <h5 className="fw-bold text-danger mb-3">Danger Zone</h5>
                    <button className="btn btn-outline-danger btn-sm">Delete Account</button>
                 </div>
              )}

              {/* --- NOTIFICATIONS TAB --- */}
              {activeTab === 'notifications' && (
                  <div>
                     <h5 className="fw-bold mb-3">Email Preferences</h5>
                     <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="notif1" defaultChecked />
                        <label className="form-check-label" htmlFor="notif1">Order Updates</label>
                     </div>
                     <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="notif2" defaultChecked />
                        <label className="form-check-label" htmlFor="notif2">Ticket Replies</label>
                     </div>
                     <button className="btn btn-primary mt-3">Save Preferences</button>
                  </div>
              )}

              {/* --- ORGANIZATION TAB --- */}
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
                                      <p className="small text-muted mb-3">You will become the owner.</p>
                                      <input className="form-control mb-3" placeholder="Company Name" value={orgName} onChange={e => setOrgName(e.target.value)} />
                                      <button className="btn btn-primary w-100" onClick={handleCreateOrg}>Create Organization</button>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-6">
                              <div className="card h-100 border shadow-sm">
                                  <div className="card-body">
                                      <h6 className="fw-bold">Join Existing</h6>
                                      <p className="small text-muted mb-3">Enter an invite code from your admin.</p>
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