import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="contact-main">
        <div className="contact-container">
            
            <section className="contact-form-section">
                <h1 className="form-title">Ready to Build Your Digital Future?</h1>
                <p className="form-subtitle">Tell us about your project—we&apos;re eager to hear your ideas and requirements.</p>
                
                <form id="contactForm" className="contact-form contact-form-page">
                    
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input type="text" id="name" name="name" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Work Email *</label>
                        <input type="email" id="email" name="email" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="company">Company/Organization *</label>
                        <input type="text" id="company" name="company" required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="service">Interested Service *</label>
                        <select id="service" name="service" required defaultValue="">
                            <option value="" disabled>Select a Service</option>
                            <option value="fullstack">Fullstack Development</option>
                            <option value="consulting">Architectural Consulting</option>
                            <option value="mvp">MVP & Startup Development</option>
                            <option value="support">Ongoing Support & Maintenance</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="message">Your Project Details *</label>
                        <textarea id="message" name="message" rows={5} required placeholder="Describe your objectives, timeline, and budget range..."></textarea>
                    </div>

                    <button type="submit" className="submit-btn">Send Inquiry <i className="fas fa-paper-plane"></i></button>

                    <p className="form-footer-note">*All fields are required. We respect your privacy.</p>
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
                        <p>contact@digitalengineers.com</p>
                    </div>
                    <div className="info-item address">
                        <i className="fas fa-map-marker-alt"></i>
                        <address>
                            123 Development Drive<br />
                            Suite 400<br />
                            Tech City, CA 90210
                        </address>
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