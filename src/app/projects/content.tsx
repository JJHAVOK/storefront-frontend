'use client';

import Link from "next/link";
import { useState, useEffect } from "react";


// --- PROJECT DATA ---
const projects = [
  { id: 1, title: "Corporate Landing Page", category: "functional", tech: ["html", "css", "javascript"], image: "[Web UI Snapshot]", desc: "Optimized for loading speed and core SEO performance. Achieved 95+ PageSpeed score." },
  { id: 2, title: "Analytics Dashboard System", category: "web-app", tech: ["react", "express.js", "mongodb"], image: "[React Dashboard Mockup]", desc: "Real-time data visualization tool processing over 100k events per hour." },
  { id: 3, title: "Custom Logistics API", category: "backend", tech: ["python", "django", "postgresql"], image: "[Server Rack Illustration]", desc: "High-availability API managing supply chain integration and routing optimization." },
  { id: 4, title: "Scaled FinTech DB Migration", category: "database", tech: ["postgresql", "aws"], image: "[Database Schema]", desc: "Migration and optimization of a 10TB financial database for enhanced query speed." },
  { id: 5, title: "Customer Service Portal", category: "web-app", tech: ["vue.js", "node.js"], image: "[Mobile App View]", desc: "Intuitive self-service portal reducing support tickets by 30% through improved UX." },
  { id: 6, title: "GDPR Data Anonymizer", category: "security", tech: ["node.js", "c#"], image: "[Security Lock]", desc: "Automated tool for redacting PII and ensuring regional data governance compliance." },
  { id: 7, title: "Enterprise Scheduling Tool", category: "software", tech: ["java", "spring"], image: "[Java Console]", desc: "Robust desktop application for managing complex internal resource scheduling." },
  { id: 8, title: "Legacy System API Wrapper", category: "backend", tech: ["php", "laravel", "mysql"], image: "[PHP Code]", desc: "Created a modern API layer to extend the lifespan of critical legacy systems." },
];

// --- FILTER GROUPS ---
const filterGroups = [
  { title: "Functional Websites", techs: ["html", "react", "angularjs", "vue.js", "bootstrap5"] },
  { title: "Backend Systems", techs: ["python", "php", "java", "c#", "ruby", "go", "node.js", "django", "express.js"] },
  { title: "Database", techs: ["postgresql", "mysql", "mongodb"] },
  { title: "Web Applications", techs: ["react", "vue.js", "javascript"] },
  { title: "Software Applications", techs: ["java", "c#"] },
  { title: "Security & Compliance", techs: ["python", "node.js"] },
  { title: "Game Modding", techs: ["c#", "java"] },
];

// --- ACCORDION ITEM COMPONENT (Fixes the JS issue) ---
function AccordionItem({ title, icon, children, isOpen, onToggle }: any) {
  return (
    <div className="accordion-item">
      <button 
        className="accordion-header" 
        aria-expanded={isOpen} 
        onClick={onToggle}
        type="button"
      >
        <span className="header-content-left">
            <i className={`fas fa-${icon} arrow-left-guide`}></i>
            <h3><i className={`fas fa-${icon}`}></i> {title}</h3>
        </span>
        <span className="header-content-right">
            <span className="click-me-text">Click Me</span>
            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} toggle-icon`}></i>
        </span>
      </button>
      <div 
        className={`accordion-panel ${isOpen ? 'open' : ''}`} 
        style={{ display: isOpen ? 'block' : 'none' }}
      >
          {children}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  
  // State for Accordion (Track which one is open by ID/Index)
  const [openAccordion, setOpenAccordion] = useState<number | null>(0); // Default 0 (first one) open

  // Handle Checkbox Change
  const toggleFilter = (tech: string) => {
    if (tech === "all") {
      setSelectedTechs([]); 
      return;
    }
    setSelectedTechs(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  // Filter Logic
  useEffect(() => {
    let result = projects;

    // 1. Filter by Tech
    if (selectedTechs.length > 0) {
      result = result.filter(p => p.tech.some(t => selectedTechs.includes(t)));
    }

    // 2. Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.desc.toLowerCase().includes(q) ||
        p.tech.some(t => t.includes(q))
      );
    }

    setFilteredProjects(result);
  }, [selectedTechs, searchQuery]);

  const toggleAccordion = (index: number) => {
     // If clicking the already open one, close it (set to null). Otherwise open the new one.
     setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <main className="body-projects">
        {/* --- STORY / ACCORDION SECTION --- */}
        <section className="story-projects section-padding-small">
            <div className="container">
                <div className="story-grid-projects-swapped">
                    
                    <div className="story-accordion">
                        {/* Accordion 1 */}
                        <AccordionItem 
                           title="Full-Stack Approach" 
                           icon="code" 
                           isOpen={openAccordion === 0} 
                           onToggle={() => toggleAccordion(0)}
                        >
                            <p>We tackle complexity by owning the entire vertical—from API design to cloud deployment—ensuring zero gaps between layers of technology.</p>
                        </AccordionItem>

                        {/* Accordion 2 */}
                        <AccordionItem 
                           title="Performance Benchmarks" 
                           icon="rocket" 
                           isOpen={openAccordion === 1} 
                           onToggle={() => toggleAccordion(1)}
                        >
                             <p>Our solutions aren&apos;t just functional; they&apos;re engineered for speed. We guarantee metrics that define success: low latency, high concurrency, and minimal TCO.</p>
                        </AccordionItem>

                        {/* Accordion 3 */}
                        <AccordionItem 
                           title="Security-First Design" 
                           icon="shield-alt" 
                           isOpen={openAccordion === 2} 
                           onToggle={() => toggleAccordion(2)}
                        >
                            <p>Compliance and defense are baked into the architecture from the start. We prioritize protocols that protect sensitive data and user privacy across all systems.</p>
                        </AccordionItem>
                    </div>

                    <div className="story-text">
                        <h2 className="section-title-left">Our Engineering Philosophy</h2>
                        <p className="lead-paragraph">Every project in this catalogue represents a <strong>unique strategic challenge</strong> that required custom architecture, not boilerplate code. We view technology as the ultimate competitive differentiator.</p>
                        <p>Our featured work showcases our ability to deliver end-to-end solutions: from crafting a pixel-perfect React front-end to optimizing complex PostgreSQL database clusters. Review our portfolio to see how technical excellence translates into tangible business results.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- BREADCRUMB --- */}
        <div className="breadcrumb-container">
            <div className="container breadcrumb-inner-content">
                <div className="breadcrumb">
                    <Link href="/">Home</Link> / <a href="#"> Projects Catalogue </a>
                </div>
            </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="container mt-4 mb-0">
            <input 
              type="text" 
              className="form-control form-control-lg" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* --- PROJECTS CATALOGUE --- */}
        <section className="projects-catalogue section-padding">
            <div className="container projects-grid-container">
                
                {/* --- SIDEBAR FILTERS --- */}
                <aside className="projects-sidebar">
                    <h3>Filter by Category</h3>
                    
                    <div className="filter-group">
                      <label className="checkbox-container">Show All Projects
                        <input 
                          type="checkbox" 
                          checked={selectedTechs.length === 0} 
                          onChange={() => setSelectedTechs([])} 
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    
                    {filterGroups.map((group, idx) => (
                      <div className="filter-group" key={idx}>
                          <h4>{group.title}</h4>
                          {group.techs.map(tech => (
                             <label key={tech} style={{ display: 'block', marginBottom: '5px', cursor: 'pointer' }}>
                               <input 
                                 type="checkbox" 
                                 checked={selectedTechs.includes(tech)}
                                 onChange={() => toggleFilter(tech)}
                                 style={{ marginRight: '8px' }}
                               /> 
                               <span style={{ textTransform: 'capitalize' }}>{tech}</span>
                             </label>
                          ))}
                      </div>
                    ))}
                </aside>

                {/* --- CONTENT --- */}
                <div className="projects-content">
                    <div className="projects-catalogue-header">
                        <h2>Total Projects ({filteredProjects.length})</h2> 
                    </div>

                    {filteredProjects.length === 0 && (
                       <div className="alert alert-warning">No projects found matching your criteria.</div>
                    )}

                    <div className="project-grid">
                        {filteredProjects.map(project => (
                           <div className="project-card" key={project.id}>
                               <div className="project-image-placeholder">{project.image}</div>
                               <div className="project-info">
                                   <h3>{project.title}</h3>
                                   <span className="tech-stack">{project.tech.join(", ").toUpperCase()}</span>
                                   <p>{project.desc}</p>
                               </div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
}