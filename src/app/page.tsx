import Link from "next/link";
import { getSeoMetadata } from '@/lib/seo';

// 👇 Dynamic Metadata Generator
export async function generateMetadata() {
  return await getSeoMetadata('/');
}

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero" style={{ background: 'var(--color-dark-bg)', position: 'relative', overflow: 'hidden' }}>
        {/* Glowing orb effect for the high-tech SaaS look */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(9,9,11,0) 70%)', zIndex: 0 }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }} data-aos="fade-up">
            <span className="tagline" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>FULL-STACK POWER. INDUSTRY-AGNOSTIC.</span>
            <h1>Engineered, <strong>Custom Digital Platforms</strong> for Unmatched Performance.</h1>
            <p>From dynamic FinTech solutions to high-volume E-commerce—we engineer the entire architecture, front-to-back.</p>
            <Link href="/contact" className="btn btn-primary" style={{ backgroundColor: 'var(--color-primary)', border: 'none' }}>Book a Technical Deep Dive</Link>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="breadcrumb-container" style={{ backgroundColor: 'var(--color-light-bg)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
            <div className="breadcrumb">
                <Link href="/" style={{ color: 'var(--color-primary)' }}>Home</Link> <span style={{ opacity: 0.5 }}>/</span> <a href="#expertise" style={{ color: 'var(--color-text)' }}>Services</a> <span style={{ opacity: 0.5 }}>/</span> <span style={{ color: 'var(--color-white)' }}>Custom Full-Stack</span>
            </div>
        </div>
      </div>

      {/* EXPERTISE SECTION */}
      <section id="expertise" className="difference section-padding" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
        <div className="container">
            <h2 className="section-title" data-aos="fade-up">The Full-Stack Difference</h2>
            <div className="difference-rows"> 
                <div className="difference-row-top">
                    <div className="card glass-panel" data-aos="fade-up" data-aos-delay="100">
                        <i className="icon" style={{ color: 'var(--color-primary)' }}>⬡</i>
                        <h3>Front-End Mastery</h3>
                        <p>Delivering <strong>pixel-perfect</strong>, blazing-fast user interfaces (UI) and exceptional user experiences (UX) on any device.</p>
                    </div>
                    <div className="card glass-panel" data-aos="fade-up" data-aos-delay="200">
                        <i className="icon" style={{ color: 'var(--color-accent)' }}>⚙️</i>
                        <h3>Robust Back-End</h3>
                        <p>Building secure, scalable, and efficient server-side logic, databases, and APIs capable of handling massive loads.</p>
                    </div>
                </div>

                <div className="difference-row-bottom">
                    <div className="card glass-panel" data-aos="fade-up" data-aos-delay="300">
                        <i className="icon" style={{ color: 'var(--color-primary)' }}>🎯</i>
                        <h3>Industry Versatility</h3>
                        <p>Our solutions adapt to <strong>any sector</strong>—from SaaS to Logistics—ensuring compliance and market-specific features.</p>
                    </div>
                    <div className="card glass-panel" data-aos="fade-up" data-aos-delay="400">
                        <i className="icon" style={{ color: 'var(--color-accent)' }}>🔒</i>
                        <h3>Security & Compliance</h3>
                        <p>Implementing robust security protocols and industry-specific compliance (e.g., HIPAA, GDPR) from day one.</p>
                    </div>
                </div>
            </div> 
        </div>
      </section>

      {/* STACK SECTION */}
      <section id="stack" className="stack section-padding" style={{ backgroundColor: 'var(--color-light-bg)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
            <h2 className="section-title" data-aos="fade-up">Our Core Technologies</h2>
            <div className="stack-rows">
                <div className="stack-row-top">
                    <div className="stack-item item-large glass-panel" data-aos="fade-up" data-aos-delay="100">
                        <i className="stack-icon stack-icon-front" style={{ fontFamily: 'var(--font-mono)' }}>HTML5 / CSS3 / JavaScript / Bootstrap</i>
                        <p>Core Frontend Development</p>
                    </div>
                    <div className="stack-item item-large glass-panel" data-aos="fade-up" data-aos-delay="200">
                        <i className="stack-icon" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>React/Vue</i>
                        <p>Modern Frontend Frameworks</p>
                    </div>
                </div>
                <div className="stack-row-bottom">
                    <div className="stack-item glass-panel" data-aos="fade-up" data-aos-delay="300"><i className="stack-icon" style={{ fontFamily: 'var(--font-mono)' }}>Node.js/Python</i><p>High-Performance Backends</p></div>
                    <div className="stack-item glass-panel" data-aos="fade-up" data-aos-delay="400"><i className="stack-icon" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>PostgreSQL/Mongo</i><p>Scalable Database Solutions</p></div>
                    <div className="stack-item glass-panel" data-aos="fade-up" data-aos-delay="500"><i className="stack-icon" style={{ fontFamily: 'var(--font-mono)' }}>AWS/Azure</i><p>Reliable Cloud Infrastructure</p></div>
                </div>
            </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="portfolio section-padding" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
        <div className="container">
            <h2 className="section-title" data-aos="fade-up">Case Studies & Results</h2>
            <div className="portfolio-grid">
                <div className="portfolio-item glass-panel" data-aos="fade-up" data-aos-delay="100" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="industry-tag" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>E-Commerce</span>
                    <h3>High-Volume Retail Platform</h3>
                </div>
                <div className="portfolio-item glass-panel" data-aos="fade-up" data-aos-delay="200" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="industry-tag" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-dark-bg)' }}>FinTech</span>
                    <h3>Secure Payment Gateway</h3>
                </div>
                <div className="portfolio-item glass-panel" data-aos="fade-up" data-aos-delay="300" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="industry-tag" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>Healthcare</span>
                    <h3>HIPAA-Compliant Portal</h3>
                </div>
            </div>
            <a href="#" className="btn btn-secondary" style={{ border: '1px solid var(--color-primary)', color: 'var(--color-white)', background: 'transparent' }}>View Complete Success Stories</a>
        </div>
      </section>

      {/* SCROLL TO TOP */}
      <button id="scrollToTopBtn" title="Go to top">↑</button>
    </main>
  );
}