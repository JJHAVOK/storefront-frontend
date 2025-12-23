'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { StatusModal } from '@/components/StatusModal';


export default function ContactPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  // Status Modal State (Replaces the crashing alert/redirect)
  const [status, setStatus] = useState({ show: false, title: '', message: '', type: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' });

  // Autofill Logic
  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inbox/contact', formData);
      
      // Show Success Modal instead of crashing redirect
      setStatus({ 
          show: true, 
          title: 'Message Sent', 
          message: `We have received your inquiry and will respond to ${formData.email} shortly.`, 
          type: 'success' 
      });

      // Clear sensitive fields
      setFormData(prev => ({ ...prev, message: '', service: '' }));
      
    } catch (e: any) {
      console.error(e);
      setStatus({ 
          show: true, 
          title: 'Error', 
          message: 'Failed to send message. Please try again.', 
          type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-main">
        {/* --- STATUS MODAL --- */}
        <StatusModal 
            show={status.show} 
            title={status.title} 
            message={status.message} 
            type={status.type} 
            onClose={() => setStatus({ ...status, show: false })} 
        />

        <div className="contact-container">
            
            <section className="contact-form-section">
                <h1 className="form-title">Ready to Build Your Digital Future?</h1>
                <p className="form-subtitle">Tell us about your project—we're eager to hear your ideas and requirements.</p>
                
                <form id="contactForm" className="contact-form contact-form-page" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input 
                            type="text" 
                            id="name" 
                            required 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Work Email *</label>
                        <input 
                            type="email" 
                            id="email" 
                            required 
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="company">Company/Organization *</label>
                        <input type="text" id="company" required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="service">Interested Service *</label>
                        <select 
                            id="service" 
                            required 
                            value={formData.service} 
                            onChange={e => setFormData({...formData, service: e.target.value})}
                        >
                            <option value="">Select a Service</option>
                            <option value="Fullstack Development">Fullstack Development</option>
                            <option value="Architectural Consulting">Architectural Consulting</option>
                            <option value="MVP & Startup">MVP & Startup Development</option>
                            <option value="Support & Maintenance">Ongoing Support & Maintenance</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="message">Your Project Details *</label>
                        <textarea 
                            id="message" 
                            rows={5} 
                            required 
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})} 
                            placeholder="Describe your objectives, timeline, and budget range..."
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Sending...' : <span>Send Inquiry <i className="fas fa-paper-plane"></i></span>}
                    </button>
                </form>
            </section>

            <section className="contact-info-section">
                 <div className="info-block">
                    <h2>Our Details</h2>
                    <div className="info-item">
                        <i className="fas fa-phone-alt"></i>
                        <p>+1 (555) 123-4567</p>
                    </div>
                    <div className="info-item">
                        <i className="fas fa-envelope"></i>
                        <p>support@pixelforgedeveloper.com</p>
                    </div>
                    <div className="info-item address">
                        <i className="fas fa-map-marker-alt"></i>
                        <address>123 Development Drive<br />Suite 400<br />Tech City, CA 90210</address>
                    </div>
                </div>
                <div className="info-block map-container">
                    <h2>Our Location</h2>
                    <div className="map-placeholder">
                        <iframe src="https://maps.google.com/maps?q=0,0&z=15&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                    </div>
                </div>
            </section>
        </div>
    </main>
  );
}