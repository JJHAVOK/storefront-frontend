import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
            <span className="tagline">FULL-STACK POWER. INDUSTRY-AGNOSTIC.</span>
            <h1>Engineered, <strong>Custom Digital Platforms</strong> for Unmatched Performance.</h1>
            <p>From dynamic FinTech solutions to high-volume E-commerce—we engineer the entire architecture, front-to-back.</p>
            <Link href="/contact" className="btn btn-primary">Book a Technical Deep Dive</Link>
        </div>
      </section>

      {/* BREADCRUMB (Optional on Home, but kept per your design) */}
      <div className="breadcrumb-container">
        <div className="container">
            <div className="breadcrumb">
                <Link href="/">Home</Link> / <a href="#expertise">Services</a> / Custom Full-Stack
            </div>
        </div>
      </div>

      {/* EXPERTISE SECTION */}
      <section id="expertise" className="difference section-padding">
        <div className="container">
            <h2 className="section-title">The Full-Stack Difference</h2>
            <div className="difference-rows"> 
                <div className="difference-row-top">
                    <div className="card">
                        <i className="icon">⬡</i>
                        <h3>Front-End Mastery</h3>
                        <p>Delivering <strong>pixel-perfect</strong>, blazing-fast user interfaces (UI) and exceptional user experiences (UX) on any device.</p>
                    </div>
                    <div className="card">
                        <i className="icon">⚙️</i>
                        <h3>Robust Back-End</h3>
                        <p>Building secure, scalable, and efficient server-side logic, databases, and APIs capable of handling massive loads.</p>
                    </div>
                </div>

                <div className="difference-row-bottom">
                    <div className="card">
                        <i className="icon">🎯</i>
                        <h3>Industry Versatility</h3>
                        <p>Our solutions adapt to <strong>any sector</strong>—from SaaS to Logistics—ensuring compliance and market-specific features.</p>
                    </div>
                    <div className="card">
                        <i className="icon">🔒</i>
                        <h3>Security & Compliance</h3>
                        <p>Implementing robust security protocols and industry-specific compliance (e.g., HIPAA, GDPR) from day one.</p>
                    </div>
                </div>
            </div> 
        </div>
      </section>

      {/* STACK SECTION */}
      <section id="stack" className="stack section-padding">
        <div className="container">
            <h2 className="section-title">Our Core Technologies</h2>
            <div className="stack-rows">
                <div className="stack-row-top">
                    <div className="stack-item item-large">
                        <i className="stack-icon stack-icon-front">HTML5 / CSS3 / JavaScript / Bootstrap</i>
                        <p>Core Frontend Development</p>
                    </div>
                    <div className="stack-item item-large">
                        <i className="stack-icon">React/Vue</i>
                        <p>Modern Frontend Frameworks</p>
                    </div>
                </div>
                <div className="stack-row-bottom">
                    <div className="stack-item"><i className="stack-icon">Node.js/Python</i><p>High-Performance Backends</p></div>
                    <div className="stack-item"><i className="stack-icon">PostgreSQL/Mongo</i><p>Scalable Database Solutions</p></div>
                    <div className="stack-item"><i className="stack-icon">AWS/Azure</i><p>Reliable Cloud Infrastructure</p></div>
                </div>
            </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION (Simplified for brevity) */}
      <section id="portfolio" className="portfolio section-padding">
        <div className="container">
            <h2 className="section-title">Case Studies & Results</h2>
            <div className="portfolio-grid">
                <div className="portfolio-item"><span className="industry-tag">E-Commerce</span><h3>High-Volume Retail Platform</h3></div>
                <div className="portfolio-item"><span className="industry-tag">FinTech</span><h3>Secure Payment Gateway</h3></div>
                <div className="portfolio-item"><span className="industry-tag">Healthcare</span><h3>HIPAA-Compliant Portal</h3></div>
            </div>
            <a href="#" className="btn btn-secondary">View Complete Success Stories</a>
        </div>
      </section>

      {/* SCROLL TO TOP */}
      <button id="scrollToTopBtn" title="Go to top">↑</button>
    </main>
  );
}