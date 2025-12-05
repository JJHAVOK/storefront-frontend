import Link from "next/link";

export function Footer() {
  return (
    <footer className="main-footer">
        <div className="container">
            <div className="footer-grid">
                
                <div className="footer-col footer-nav">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link href="/#expertise">Our Services</Link></li>
                        <li><Link href="/#stack">Technology Stack</Link></li>
                        <li><Link href="/projects">Our Work</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                <div className="footer-col footer-testimonial">
                    <h3>Client Testimonial</h3>
                    <p className="quote">"Jaime the PixelForge dev engineered a system that reduced our processing time by 40%. True full-stack expertise."</p>
                    <p className="client">- Sarah K., CTO of Nexus Corp</p>
                </div>

                <div className="footer-col footer-legal">
                    <h3>Legal & Resources</h3>
                    <ul>
                        <li><Link href="#">Privacy Policy</Link></li>
                        <li><Link href="#">Terms and Conditions</Link></li>
                        <li><Link href="#">Careers</Link></li>
                        <li><Link href="#">Sitemap</Link></li>
                    </ul>
                </div>

                <div className="footer-col footer-search">
                    <h3>Find Information</h3>
                    <form className="footer-search-form">
                        <input type="search" placeholder="Search the site..." />
                        <button type="submit">Go</button>
                    </form>
                </div>
            </div>
        </div>

        <div className="footer-copyright-row">
            <div className="container">
                <p className="copyright-info">© 2025 PixelSolutions DEV. All rights reserved. | Full-Stack Custom Development Experts.</p>
            </div>
        </div>
    </footer>
  );
}
