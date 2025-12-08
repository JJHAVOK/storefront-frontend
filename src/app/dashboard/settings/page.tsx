'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { getAvatarUrl } from '@/lib/utils';
import { StatusModal } from '@/components/StatusModal';

// --- REUSABLE CONFIRMATION MODAL ---
function ConfirmationModal({ show, title, message, confirmLabel, confirmColor = 'danger', onConfirm, onCancel }: any) {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000 }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold text-dark">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body text-muted">{message}</div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
            <button type="button" className={`btn btn-${confirmColor}`} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, token, login, logout } = useAuthStore();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Status Modal State
  const [status, setStatus] = useState({ show: false, title: '', message: '', type: 'success' as 'success' | 'error' });
  const showStatus = (title: string, msg: string, type: 'success' | 'error' = 'success') => {
    setStatus({ show: true, title, message: msg, type });
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', bio: '', avatarUrl: '' });
  const [passData, setPassData] = useState({ new: '' });
  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState(''); 
  const [notifs, setNotifs] = useState({ orders: true, tickets: true, projects: true, marketing: false, security: true });

  // Security State
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [mfaData, setMfaData] = useState<{ qrCodeUrl: string, secret: string } | null>(null);
  const [mfaToken, setMfaToken] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '',
        phone: user.phone || '', bio: user.bio || '', avatarUrl: user.avatarUrl || ''
      });
      if (user.metadata && (user.metadata as any).notifications) {
          setNotifs({ ...notifs, ...(user.metadata as any).notifications });
      }
      
      // Fetch Security Data
      api.get('/security/history/me').then(res => setLoginHistory(res.data)).catch(()=>{});
      api.get('/security/mfa/status').then(res => setMfaEnabled(res.data.enabled)).catch(()=>{});
      api.get('/customer/auth/sessions').then(res => setActiveSessions(res.data)).catch(()=>{});
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
        const uploadRes = await api.post('/documents/upload/avatar', uploadFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const newAvatarUrl = uploadRes.data.url;
        const profileRes = await api.patch('/customer/auth/profile', { ...formData, avatarUrl: newAvatarUrl });

        setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
        if (profileRes.data.user && token) {
           login(token, profileRes.data.user);
           router.refresh();
        }
        showStatus('Success', 'Avatar updated successfully!');
    } catch (error: any) { showStatus('Error', 'Avatar upload failed.', 'error'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch('/customer/auth/profile', formData);
      if (res.data.user && token) login(token, res.data.user);
      showStatus('Saved', 'Profile updated successfully.');
    } catch (error: any) { showStatus('Error', error.response?.data?.message || 'Failed to update profile.', 'error'); } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      if (passData.new.length < 6) { showStatus('Error', 'Password must be 6+ chars.', 'error'); return; }
      try {
          await api.patch('/customer/auth/password', { password: passData.new });
          showStatus('Success', 'Password updated successfully.');
          setPassData({ new: '' });
      } catch(e: any) { showStatus('Error', 'Failed to update password.', 'error'); }
  };

  const handleDeactivate = async () => {
      setShowDeactivateModal(false);
      try {
          await api.post('/customer/auth/deactivate');
          showStatus('Account Deactivated', 'You have been logged out.', 'success');
          setTimeout(() => { logout(); router.push('/'); }, 2000);
      } catch(e: any) { showStatus('Error', 'Failed to deactivate.', 'error'); }
  };

  const handleDelete = async () => {
      setShowDeleteModal(false);
      try {
          await api.delete('/customer/auth/delete');
          showStatus('Account Deleted', 'Your data has been removed.', 'success');
          setTimeout(() => { logout(); router.push('/'); }, 2000);
      } catch(e: any) { showStatus('Error', 'Failed to delete account.', 'error'); }
  };

  const handleSaveNotifs = async () => {
      setLoading(true);
      try {
          const existingMeta = (user as any)?.metadata || {};
          const newMeta = { ...existingMeta, notifications: notifs };
          const res = await api.patch('/customer/auth/profile', { metadata: newMeta });
          if (res.data.user && token) login(token, res.data.user);
          showStatus('Saved', 'Preferences saved.');
      } catch (e) { showStatus('Error', 'Failed to save preferences.', 'error'); } 
      finally { setLoading(false); }
  };

  const handleCreateOrg = async () => {
      if(!orgName) return;
      try {
          await api.post('/customer/portal/organization', { name: orgName });
          showStatus('Success', 'Organization Created!');
          setTimeout(() => router.push('/dashboard/organization'), 1500);
      } catch(e: any) { showStatus('Error', e.response?.data?.message || 'Failed to create org.', 'error'); }
  };

  const handleSetupMfa = async () => {
     try {
        const res = await api.post('/security/mfa/setup');
        setMfaData(res.data);
     } catch(e) { showStatus('Error', 'Failed to setup MFA', 'error'); }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
        await api.post('/security/mfa/verify', { token: mfaToken });
        showStatus('Success', 'MFA Enabled!', 'success');
        setMfaEnabled(true);
        setMfaData(null);
     } catch(e) { showStatus('Error', 'Invalid Code', 'error'); }
  };

  const handleRevokeSession = async (id: string) => {
      try {
          await api.delete(`/customer/auth/sessions/${id}`);
          setActiveSessions(prev => prev.filter(s => s.id !== id));
          showStatus('Success', 'Session revoked.');
      } catch(e) { showStatus('Error', 'Failed to revoke session.', 'error'); }
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold text-dark">Account Settings</h2>
      <StatusModal show={status.show} title={status.title} message={status.message} type={status.type} onClose={() => setStatus({ ...status, show: false })} />
      <ConfirmationModal show={showDeactivateModal} title="Deactivate Account?" message="Are you sure?" confirmLabel="Deactivate" confirmColor="warning" onConfirm={handleDeactivate} onCancel={() => setShowDeactivateModal(false)} />
      <ConfirmationModal show={showDeleteModal} title="Delete Account?" message="This action cannot be undone." confirmLabel="Delete Forever" confirmColor="danger" onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} />

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
                    <div className="mb-4"><label className="form-label fw-bold small text-muted">Email Address</label><input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /><small className="text-muted">Changing this will update your login email.</small></div>
                    <div className="mb-4"><label className="form-label fw-bold small text-muted">Bio</label><textarea className="form-control" rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea></div>
                    <div className="d-flex justify-content-end"><button type="submit" className="btn btn-primary px-4" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button></div>
                </form>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                 <div>
                    <div className="mb-5 border-bottom pb-4">
                       <h5 className="fw-bold mb-3">Two-Factor Authentication</h5>
                       {mfaEnabled ? (
                          <div className="alert alert-success d-flex align-items-center"><i className="fas fa-check-circle me-2"></i> Two-factor authentication is currently enabled.</div>
                       ) : (
                           !mfaData ? (
                              <button className="btn btn-outline-primary" onClick={handleSetupMfa}>Enable MFA</button>
                           ) : (
                              <div className="bg-light p-3 rounded">
                                 <p className="small mb-2">Scan this QR code with Google Authenticator:</p>
                                 <img src={mfaData.qrCodeUrl} alt="QR Code" className="border p-2 bg-white mb-3" width="150" />
                                 <form onSubmit={handleVerifyMfa} className="d-flex gap-2 align-items-center">
                                    <input type="text" className="form-control" placeholder="6-digit code" value={mfaToken} onChange={e => setMfaToken(e.target.value)} style={{maxWidth:'150px'}} />
                                    <button className="btn btn-primary">Verify & Enable</button>
                                 </form>
                              </div>
                           )
                       )}
                    </div>

                    <h5 className="fw-bold mb-3">Active Sessions</h5>
                    <div className="list-group mb-4 shadow-sm">
                       {activeSessions.length === 0 && <div className="p-3 text-muted">No active sessions found.</div>}
                       {activeSessions.map(s => (
                           <div key={s.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                               <div className="d-flex align-items-center">
                                   <div className="bg-light p-2 rounded me-3"><i className="fas fa-desktop text-muted"></i></div>
                                   <div>
                                       <div className="fw-bold">{s.userAgent ? s.userAgent.substring(0, 30) + '...' : 'Unknown Device'}</div>
                                       <small className="text-muted">IP: {s.ipAddress} • Started: {new Date(s.createdAt).toLocaleDateString()}</small>
                                   </div>
                               </div>
                               <button className="btn btn-outline-danger btn-sm" onClick={() => handleRevokeSession(s.id)}>Revoke</button>
                           </div>
                       ))}
                    </div>

                    <h5 className="fw-bold mb-3">Login History</h5>
                    <div className="table-responsive mb-4 shadow-sm border rounded">
                        <table className="table table-hover mb-0 small">
                           <thead className="table-light"><tr><th className="p-3 border-0">Date</th><th className="p-3 border-0">Device</th><th className="p-3 border-0">IP</th><th className="p-3 border-0">Status</th></tr></thead>
                           <tbody>
                              {loginHistory.map(log => (
                                 <tr key={log.id}>
                                    <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                                    <td className="p-3">{log.device}</td>
                                    <td className="p-3">{log.ipAddress}</td>
                                    <td className="p-3"><span className={`badge ${log.status==='SUCCESS'?'bg-success':'bg-danger'}`}>{log.status}</span></td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                    </div>

                    <h5 className="fw-bold mb-3">Change Password</h5>
                    <form onSubmit={handlePasswordChange}>
                       <div className="mb-3"><label className="form-label">New Password</label><input type="password" className="form-control" required minLength={6} value={passData.new} onChange={e => setPassData({ new: e.target.value })} /></div>
                       <button className="btn btn-warning">Update Password</button>
                    </form>
                    <hr className="my-4 text-muted" />
                    <h5 className="fw-bold text-danger mb-3">Danger Zone</h5>
                    <div className="d-flex gap-3"><button className="btn btn-outline-warning" onClick={() => setShowDeactivateModal(true)}>Deactivate Account</button><button className="btn btn-outline-danger" onClick={() => setShowDeleteModal(true)}>Delete Account Permanently</button></div>
                 </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                  <div>
                     <h5 className="fw-bold mb-3">Email Preferences</h5>
                     {Object.keys(notifs).map(key => (
                        <div className="form-check form-switch mb-3" key={key}>
                            <input className="form-check-input" type="checkbox" id={`notif-${key}`} checked={(notifs as any)[key]} onChange={e => setNotifs({...notifs, [key]: e.target.checked})} />
                            <label className="form-check-label text-capitalize" htmlFor={`notif-${key}`}>{key} Updates</label>
                        </div>
                     ))}
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