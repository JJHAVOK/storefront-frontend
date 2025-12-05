import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      {/* --- 1. MISSION STORY (Top) --- */}
      <section className="story section-padding">
        <div className="container">
            <div className="story-grid">
                <div className="story-text">
                    <h2 className="section-title-left">Our Mission, Our Story</h2>
                    <p className="lead-paragraph">Founded in 2018, AURA DEV emerged from the desire to bridge the gap between high-level business strategy and robust, scalable technology implementation. We saw too many companies settle for off-the-shelf solutions that limited growth.</p>
                    <p>Our approach is centered around a deep technical consultancy phase, ensuring every line of code serves a strategic business purpose. We don&apos;t just write code; we architect <strong>future-proof digital ecosystems</strong> designed for resilience and market adaptability. This dedication to end-to-end quality has defined our journey.</p>
                </div>
                <div className="story-image">
                    <div className="image-placeholder"></div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 2. BREADCRUMB (Middle) --- */}
      <div className="breadcrumb-container">
        <div className="container breadcrumb-inner-content">
            <div className="breadcrumb">
                <Link href="/">Home</Link> / <a href="#">About Us </a>
            </div>
        </div>
      </div>

      {/* --- 3. VALUES SECTION --- */}
      <section className="values section-padding">
        <div className="container">
            <h2 className="section-title">Our Guiding Principles</h2>
            <div className="values-grid">
                <div className="card">
                    <i className="fas fa-microchip icon"></i>
                    <h3>Technical Integrity</h3>
                    <p>We build without shortcuts. Scalability and security are non-negotiable foundations for all our projects.</p>
                </div>
                <div className="card">
                    <i className="fas fa-lightbulb icon"></i>
                    <h3>Strategic Innovation</h3>
                    <p>We focus on emerging tech that provides a true competitive edge, ensuring long-term value for our clients.</p>
                </div>
                <div className="card">
                    <i className="fas fa-handshake icon"></i>
                    <h3>Transparent Partnership</h3>
                    <p>Clear, consistent communication and collaborative processes are the keys to mutual success.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- 4. TEAM SECTION --- */}
      <section className="team section-padding">
        <div className="container">
            <h2 className="section-title section-title-white">Meet the Leadership</h2>
            <div className="team-grid">
                <div className="team-member">
                    <div className="member-image-placeholder"></div>
                    <h3>Alexandria V.</h3>
                    <span className="member-title">CEO & Lead Architect</span>
                    <p>Visionary behind the AURA methodology, specializing in high-frequency trading platforms.</p>
                </div>
                <div className="team-member">
                    <div className="member-image-placeholder"></div>
                    <h3>Ben K.</h3>
                    <span className="member-title">CTO & Infrastructure Head</span>
                    <p>Oversees cloud resilience and global deployment strategies across AWS and Azure ecosystems.</p>
                </div>
                <div className="team-member">
                    <div className="member-image-placeholder"></div>
                    <h3>Sarah M.</h3>
                    <span className="member-title">Head of Product & UX</span>
                    <p>Ensures that technical power is always paired with intuitive, user-centric front-end design.</p>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}