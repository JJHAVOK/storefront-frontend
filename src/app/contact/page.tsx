'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore'; // <-- Import Auth

export default function ContactPage() {
  const { user } = useAuthStore(); // <-- Get User
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' });

  // --- 👇 AUTOFILL LOGIC 👇 ---
  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        }));
    }
  }, [user]);
  // --- 👆 END LOGIC 👆 ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inbox/contact', formData);
      setSent(true);
    } catch (e) {
      alert('Failed to send message. Please try again or email support@pixelforgedeveloper.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-main">
        <div className="contact-container">
            
            <section className="contact-form-section">
                <h1 className="form-title">Ready to Build Your Digital Future?</h1>
                <p className="form-subtitle">Tell us about your project—we're eager to hear your ideas and requirements.</p>
                
                {sent ? (
                   <div className="alert alert-success text-center p-5">
                      <h3><i className="fas fa-check-circle"></i> Message Sent!</h3>
                      <p>We have received your inquiry and will respond to <strong>{formData.email}</strong> shortly.</p>
                      <Link href="/" className="btn btn-primary mt-3">Return Home</Link>
                   </div>
                ) : (
                   <form id="contactForm" className="contact-form contact-form-page" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input 
                            type="text" 
                            id="name" 
                            required 
                            value={formData.name} // <-- Bind Value
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Work Email *</label>
                        <input 
                            type="email" 
                            id="email" 
                            required 
                            value={formData.email} // <-- Bind Value
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="company">Company/Organization *</label>
                        <input type="text" id="company" required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="service">Interested Service *</label>
                        <select id="service" required defaultValue="" onChange={e => setFormData({...formData, service: e.target.value})}>
                            <option value="" disabled>Select a Service</option>
                            <option value="Fullstack Development">Fullstack Development</option>
                            <option value="Architectural Consulting">Architectural Consulting</option>
                            <option value="MVP & Startup">MVP & Startup Development</option>
                            <option value="Support & Maintenance">Ongoing Support & Maintenance</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="message">Your Project Details *</label>
                        <textarea id="message" rows={5} required onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Describe your objectives, timeline, and budget range..."></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                       {loading ? 'Sending...' : <span>Send Inquiry <i className="fas fa-paper-plane"></i></span>}
                    </button>
                </form>
                )}
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