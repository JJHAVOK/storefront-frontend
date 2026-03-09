'use client';

import { useState, useEffect } from 'react';
import { 
  IconShieldLock, IconServer, IconRocket, IconDatabase, IconSpy, IconCheck, IconCpu, 
  IconWorld, IconUsers, IconCreditCard, IconChartBar, IconBuildingStore, IconTruckDelivery,
  IconHeadset, IconMail, IconRobot, IconLockAccess, IconCode, IconBox, IconBrandDocker, 
  IconBrandNextjs, IconBrandOauth, IconSitemap, IconApi, IconComponents, IconArrowRight,
  IconBug, IconActivity, IconNetwork, IconTerminal, IconBolt, IconStack2, IconExternalLink,
  IconBrandGithub, IconBrandLinkedin, 
  IconFileText, IconX, IconDownload, IconZoomIn, IconZoomOut, IconAlertTriangle, 
  IconFileTypePdf, IconPhoto, IconArrowLeft, IconKey, IconClock, IconRefresh, 
  IconFileAlert, IconAccessPoint, IconCertificate, IconFolder, IconWall, IconBrowserCheck, 
  IconFingerprint, IconGitBranch, IconDeviceDesktopAnalytics, IconRestore, IconFileCode, 
  IconHistory, IconHierarchy, IconCloudUpload, IconPlayerPlay, IconCheckbox, 
  IconBrandUbuntu, IconBrandTypescript, IconSchema, IconSettings, IconTestPipe,
  IconScan, IconContainer, IconCircleCheck, IconCircleX, IconBrandReact, IconFunction,
  IconMap2, IconChartDots, IconDeviceHeartMonitor, IconList, IconBook, IconLock, IconShoppingCart, IconCookie,
} from '@tabler/icons-react';
import Link from 'next/link';

// --- SYSTEM DOCUMENTATION DATA (REDACTED FOR PUBLIC) ---
const DOCS = {
  architecture: [
    { 
        title: 'Backend API (NestJS)', 
        desc: 'Internal Docker Service: `backend-api`.',
        details: [
            'Framework: NestJS 10 (Modular, TypeScript).',
            'Runtime: Node.js v20 (Alpine Docker Image).',
            'Database: PostgreSQL 16 (Service: `postgres`).',
            'Queue: Redis 7 (Service: `redis`) for BullMQ.',
            'Search: Elasticsearch 7 (Service: `elasticsearch`).',
            'Auth Strategy: HttpOnly Cookies (Zero-Trust).', 
            'Logs: JSON File Driver (Rotated).'
        ]
    },
    { 
        title: 'Staff Panel (Next.js)', 
        desc: 'Internal Docker Service: `staff-panel`.',
        details: [
            'Framework: Next.js 14 (App Router).',
            'UI: Mantine v7 (Enterprise Components).',
            'State Management: Zustand (AuthStore, SettingsStore).',
            'Auth: Server-Side Validated Sessions.', 
            'Docker: Multi-stage build (Standalone Output).',
            'Charts: Mantine Charts (Recharts wrapper).'
        ]
    },
    { 
        title: 'Nginx Gateway (Titanium)', 
        desc: 'The Entry Point. Handles SSL, CORS, and Buffering.',
        details: [
            'Config: "Titanium" Mode with 512k Buffers.',
            'CORS: "God Mode" (Force-injects headers on errors).',
            'Security: Force SSL, HSTS, X-Frame-Options.',
            'Routing: Reverse Proxy to Docker Services.'
        ]
    }
  ],
  security_master: [
      {
          category: '1. Identity & Access',
          items: [
              'Authentication: HttpOnly Secure Cookies (No LocalStorage).',
              'MFA: Time-based OTP (TOTP) enforced for all staff.',
              'Session Control: Database-backed sessions (Revokable instantly).',
              'Hijack Protection: Cookie Domain Locking (.pixelforgedeveloper.com).'
          ]
      },
      {
          category: '2. Active Defense (Sentinel)',
          items: [
              'WAF (Firewall): Custom Middleware scanning for SQLi, XSS, and Shell Injection payloads.',
              'Honeypots: Active traps (/wp-login.php, /.env) that trigger immediate 365-day bans.',
              'Rate Limiting: Throttler Guard (Redis) allowing max 100 req/min per IP.',
              'User Agents: Blocklist for known tools like SQLMap, Nikto, and Masscan.'
          ]
      },
      {
          category: '3. Data Security',
          items: [
              'PII Redaction: Regex filters strip emails/phones before AI processing.',
              'Audit Logging: Immutable logs for Login, Logout, and Critical Actions.',
              'Zero Trust: Backend verifies Cookie + DB Session on EVERY request.'
          ]
      },
      {
          category: '4. Endpoint & Workload Security',
          items: [
              'Endpoint: CSP Headers (Helmet) preventing XSS and Clickjacking.',
              'Workload: Container Security (Non-Root Users), Runtime Anomaly Detection.'
          ]
      },
      {
          category: '5. Application & API Security',
          items: [
              'AppSec: Secure SDLC, SAST/DAST/IAST, Software Composition Analysis (SCA).',
              'API Security: Schema Validation (Zod), Token Rotation, Abuse Detection.'
          ]
      },
      {
          category: '6. Governance & Compliance',
          items: [
              'RBAC: Role-Based Access Control with granular permissions.',
              'Policy: NIST/ISO Standards Library reference.',
              'GDPR: Right-to-Erasure built into User Service.'
          ]
      }
  ],
  user_intel: [
      {
          title: 'Identity Resolution',
          desc: 'Combines data from Auth, CRM, and Orders to build a "Golden Record" of the user.',
          tech: 'Prisma Relations'
      },
      {
          title: 'Behavioral Tracking',
          desc: 'Tracks page views, clicks, and feature usage via PostHog integration.',
          tech: 'PostHog / AnalyticsService'
      },
      {
          title: 'Enrichment Engine',
          desc: 'Automatically pulls avatar (Gravatar) and company info based on email domain.',
          tech: 'UserIntelligenceService'
      },
      {
          title: 'Risk Scoring',
          desc: 'Calculates probability of fraud based on IP reputation and login velocity.',
          tech: 'SecurityService'
      }
  ],
  database: [
      { model: 'StaffUser', desc: 'Internal admins. Links to `UserSession`.', fields: 'email, passwordHash, roles[], mfaSecret' }, 
      { model: 'UserSession', desc: 'Active login sessions (Cookie backed).', fields: 'token, userId, expiresAt, ipAddress, device' }, 
      { model: 'Contact', desc: 'External customers/leads.', fields: 'email, phone, leadScore, organizationId' },
      { model: 'Ticket', desc: 'Support requests.', fields: 'subject, status, priority, sentimentScore' },
      { model: 'BannedIP', desc: 'Firewall blacklist.', fields: 'ipAddress, reason, expiresAt' },
      { model: 'GeoBlock', desc: 'Country-level firewall rules.', fields: 'code, country, isActive' },
      { model: 'Order', desc: 'Transactions.', fields: 'orderNumber, totalAmount, status, items[]' },
      { model: 'Product', desc: 'Catalog items. Has Variants.', fields: 'name, price, type (PHYSICAL/DIGITAL)' },
      { model: 'ScheduledJob', desc: 'Dynamic Cron Jobs configuration.', fields: 'cron, isActive, triggerEvent, lastRun' },
      { model: 'SystemSettings', desc: 'Global config store.', fields: 'siteName, aiEnabled, brandColor' },
      { model: 'AuditLog', desc: 'Immutable action history.', fields: 'action, targetId, payload, userId' }
  ],
  cron: [
      { id: 'RUN_BACKUP', time: 'User Defined', desc: 'Dumps DB, Zips Uploads, Encrypts, Uploads to R2.' },
      { id: 'RUN_SLA_CHECK', time: '0 * * * *', desc: 'Checks OPEN tickets older than 24h. Marks as Escalated.' },
      { id: 'RUN_LEAD_SCORING', time: '0 0 * * *', desc: 'AI Engine recalculates Lead Score.' },
      { id: 'RUN_INVENTORY_CHECK', time: '0 6 * * *', desc: 'Scans for low stock variants and alerts Admins.' },
      { id: 'RUN_CLEANUP_LOGS', time: '0 0 1 * *', desc: 'Archives Audit Logs older than 90 days.' },
      { id: 'RUN_SESSION_CLEANUP', time: '0 3 * * *', desc: 'Removes expired sessions from DB to keep login fast.' }, 
  ],
  backup: [
      { key: 'Provider', val: 'Cloudflare R2 (S3 Compatible)' },
      { key: 'Frequency', val: 'Daily (Configurable)' },
      { key: 'Encryption', val: 'GPG (At Rest & In Transit)' },
      { key: 'Retention', val: '30 Days' },
      { key: 'Contents', val: 'Postgres Dump + /uploads' }
  ],
  endpoints: [
      { method: 'POST', url: '/auth/login', desc: 'HttpOnly Cookie Exchange + MFA Check.' }, 
      { method: 'GET', url: '/auth/profile', desc: 'Validates Cookie & Returns User.' },
      { method: 'POST', url: '/auth/logout', desc: 'Destroys Cookie & Revokes DB Session.' },
      { method: 'GET', url: '/soc/dashboard', desc: 'Real-time Security Metrics.' }, 
      { method: 'POST', url: '/documents/upload', desc: 'Upload file (Multipart/Form-Data).' }
  ],
  dev: [
    { 
        section: 'Docker Operations',
        desc: 'We utilize a zero-downtime deployment strategy. Code is pushed to GitHub, built into immutable images, and pulled by Watchtower. Rolling updates ensure 99.99% uptime.'
    },
    { 
        section: 'Nginx Operations',
        desc: 'Nginx acts as the primary SSL terminator and load balancer. It manages connection buffering and header security before traffic ever reaches the application layer.'
    }
  ],
  modules: [
    {
      id: 'crm',
      icon: <IconUsers size={16}/>,
      label: 'CRM & Sales Engine',
      content: [
        { q: 'Lead Scoring Algorithm', a: 'Score = (Orders * 50) + (Profile Complete * 10) - (Support Tickets * 5). Runs nightly.' },
        { q: 'Organization Logic', a: 'Entities grouping multiple Contacts. Useful for B2B.' },
        { q: 'Sales Pipeline', a: 'Qualification -> Proposal -> Negotiation -> Won/Lost.' }
      ]
    },
    {
      id: 'store',
      icon: <IconShoppingCart size={16}/>,
      label: 'E-Commerce & Inventory',
      content: [
        { q: 'Product Variants', a: 'Inventory tracked at Variant level (SKU). Parent is container.' },
        { q: 'Order Fulfillment', a: 'PENDING -> PAID -> PROCESSING -> SHIPPED. Requires Tracking #.' }
      ]
    },
    {
      id: 'auth',
      icon: <IconCookie size={16}/>,
      label: 'Authentication (Secure)',
      content: [
        { q: 'Why Cookies?', a: 'We moved away from LocalStorage to HttpOnly Cookies. This prevents XSS attacks from stealing tokens. The browser handles the storage automatically.' },
        { q: 'MFA Flow', a: 'Login -> Validate Password -> Server checks MFA requirement -> Returns 401 MFA_REQUIRED -> Frontend shows PIN input -> Verify -> Success.' },
        { q: 'Session Revocation', a: 'Admins can see active sessions in their profile and click "Revoke" to instantly kill a session on another device.' }
      ]
    },
    {
      id: 'security',
      icon: <IconShieldLock size={16}/>,
      label: 'Security & RBAC',
      content: [
        { q: 'RBAC (Roles)', a: 'Granular permissions (e.g. `user:read`). Assigned to Roles.' },
        { q: 'Data Redaction', a: 'Security Gateway strips PII before AI processing.' },
        { q: 'Audit Logging', a: 'Critical actions recorded in `AuditLog` table.' }
      ]
    },
    {
        id: 'sentinel',
        icon: <IconShieldLock size={16}/>,
        label: 'Sentinel & Iron Dome',
        content: [
          { q: 'Honeypot Trap', a: 'Fake endpoints (e.g. `/wp-login.php`, `/.env`) detect bot scanners. Any access results in an immediate 365-day IP ban.' },
          { q: 'Geo-Fencing', a: 'Middleware checks the ISO Country Code of every request. Blocked regions receive a 403 Forbidden instantly.' },
          { q: 'System Sentinel', a: 'Real-time monitoring of server health. Alerts admins if thresholds are breached.' },
          { q: 'Shadowbanning', a: 'Banned IPs are rejected at the network edge.' }
        ]
    }
  ],
  ai: [
      {
          title: 'Smart Drafts',
          trigger: 'New Ticket',
          action: 'PixelMind drafts a reply based on Knowledge Base.',
          output: 'Internal Note added to ticket.'
      },
      {
          title: 'Sentiment Analysis',
          trigger: 'Inbound Message',
          action: 'NLP detects emotional tone.',
          output: 'Updates Sentiment Score.'
      },
      {
          title: 'Lead Scoring',
          trigger: 'Cron Job (Hourly)',
          action: 'Calculates customer value based on Spend vs Support Load.',
          output: 'Updates the `Contact` record.'
      },
      {
          title: 'PII Redaction',
          trigger: 'Before OpenAI Request',
          action: 'Regex scans for emails and phone numbers.',
          output: 'Replaces sensitive data with [REDACTED].'
      }
  ],
  seo: [
    {
        title: 'Social Graph Engine',
        trigger: 'Link Shared',
        action: 'SSR injects OpenGraph tags.',
        output: 'Rich Link Previews.'
    },
    {
        title: 'Internal Network Tunnel',
        trigger: 'Page Load',
        action: 'Storefront connects to Backend via internal Docker Network.',
        output: '0ms Latency, Bypasses SSL Verification.'
    },
    {
        title: 'Discovery Bots',
        trigger: 'Crawler',
        action: 'Reads robots.txt and sitemap.xml.',
        output: 'Pages indexed.'
    },
    {
        title: 'Next.js Metadata',
        trigger: 'Route Navigation',
        action: '`generateMetadata()` runs on the Server.',
        output: 'Dynamic titles per product/page.'
    }
  ]
};

export default function EcosystemShowcase() {
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'matrix' | 'evidence' | 'internals' | 'diagnostics' | 'demo' | 'sysdocs'>('overview');
  
  // --- EVIDENCE VAULT STATE ---
  const [evidenceSubTab, setEvidenceSubTab] = useState<'code' | 'pipeline' | 'structure' | 'architecture' | 'monitoring'>('code');
  
  // 1. Interactive Code Runner State
  const [selectedFile, setSelectedFile] = useState<'jwt' | 'docker' | 'redis' | 'ci' | 'schema' | 'module' | 'guard' | 'nextconf' | 'productcard' | 'format'>('jwt');
  const [runnerState, setRunnerState] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [debugVariables, setDebugVariables] = useState<{name: string, value: string}[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]); // <--- THIS WAS MISSING
  
  // 2. Architecture Holodeck State
  const [archNode, setArchNode] = useState<'client' | 'nginx' | 'nestjs' | 'redis' | 'postgres'>('nestjs');
  
  // 3. Monitoring State
  const [trafficData, setTrafficData] = useState<number[]>([20, 22, 19, 25, 23, 24, 28, 22, 20, 25]);
  const [errorData, setErrorData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // ADDED THIS
  const [isUnderLoad, setIsUnderLoad] = useState(false);
    
  // 4. CI/CD State
  const [pipelineStep, setPipelineStep] = useState<number>(3); 
  const [pipelineScenario, setPipelineScenario] = useState<'success' | 'rollback'>('success');
  
  // --- COLOR UTILS ---
  const textLightStyle = { color: '#ced4da' }; // Gray-400 (Very readable on dark)

  // --- GENERAL STATE ---
  const [showResume, setShowResume] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [viewMode, setViewMode] = useState<'pdf' | 'image'>('pdf');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  
  // --- SYSTEM DOCS TABS ---
  const [sysDocTab, setSysDocTab] = useState<'overview' | 'security' | 'user_intel' | 'seo' | 'backup' | 'backend' | 'database' | 'modules' | 'ai' | 'dev'>('overview');
  
  // --- DARK THEME PALETTE ---
  const cardStyle = { backgroundColor: '#1e2124', borderColor: '#2c3237', color: '#e9ecef' };
  const cardHeaderStyle = { backgroundColor: '#25282c', borderBottom: '1px solid #2c3237', color: '#fff' };
  const listStyle = { backgroundColor: 'transparent', color: '#ced4da', borderBottom: '1px solid #2c3237', padding: '10px 15px', fontSize: '0.85rem' };
  const codeStyle = { backgroundColor: '#0d1117', color: '#e6edf3', fontFamily: 'monospace', padding: '15px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #30363d', marginBottom: '1rem' };

  // --- PATHS ---
  const resumePdfPath = '/assets/res/latexcv.pdf';
  const getCurrentPageImage = () => `/assets/res/latexcv-${currentPage}.png`;
  const googleViewerUrl = `https://docs.google.com/gview?url=https://pixelforgedeveloper.com${resumePdfPath}&embedded=true`;

  // --- SCROLL LOCK ---
  useEffect(() => {
    if (showResume) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showResume]);

  // --- MONITORING SIMULATION EFFECT ---
  useEffect(() => {
    if (activeTab !== 'evidence' || evidenceSubTab !== 'monitoring') return;
    
    const interval = setInterval(() => {
      setTrafficData(prev => {
        const newData = [...prev.slice(1)];
        // Generate random traffic: Base 20-30, Load 80-95
        const base = isUnderLoad ? 80 : 20;
        const variance = Math.floor(Math.random() * 15);
        newData.push(base + variance);
        return newData;
      });

      // ADDED ERROR DATA LOGIC
      setErrorData(prev => {
          const newData = [...prev.slice(1)];
          const errBase = isUnderLoad ? 40 : 0;
          const errVar = Math.floor(Math.random() * 10);
          newData.push(isUnderLoad ? errBase + errVar : 0);
          return newData;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [activeTab, evidenceSubTab, isUnderLoad]);

  // --- UNIVERSAL SIMULATION RUNNER ---
  const runSimulation = async (scenario: 'valid' | 'invalid' | 'start' | 'hit' | 'miss') => {
    if (runnerState === 'running') return;
    setRunnerState('running');
    setDebugVariables([]);
    setConsoleOutput([]); // Clear console on new run
    setActiveLine(null);

    // Generic delay helper
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    // --- SCENARIO LOGIC ---
    if (selectedFile === 'jwt') {
        setActiveLine(7);
        setDebugVariables([{ name: 'token', value: scenario === 'valid' ? '"eyJhbGci..."' : '"bad_token"' }]);
        await wait(600);
        setActiveLine(12);
        const isBad = scenario === 'invalid';
        setDebugVariables(prev => [...prev, { name: 'isBlacklisted', value: isBad ? 'true' : 'false' }]);
        await wait(600);
        if (isBad) { setActiveLine(13); setRunnerState('error'); }
        else { setActiveLine(16); setRunnerState('success'); }

    } else if (selectedFile === 'docker') {
        setConsoleOutput(['> docker compose up -d']);
        await wait(500);
        setConsoleOutput(prev => [...prev, '[network] Creating internal_net...']);
        await wait(500);
        setConsoleOutput(prev => [...prev, '[volume] Mounting pg_data...']);
        await wait(500);
        setConsoleOutput(prev => [...prev, '[postgres] Listening on 5432 (Internal Only)']);
        await wait(500);
        setConsoleOutput(prev => [...prev, '[backend] Connected to Postgres. Ready.']);
        setRunnerState('success');

    } else if (selectedFile === 'redis') {
        setActiveLine(7); // get
        await wait(500);
        if (scenario === 'hit') {
             setDebugVariables([{ name: 'key', value: '"product:123"' }, { name: 'cached', value: 'true' }]);
             setActiveLine(9);
             setDebugVariables(prev => [...prev, { name: 'return', value: '{ id: 123, price: 99 }' }]);
             setRunnerState('success');
        } else {
             setDebugVariables([{ name: 'key', value: '"product:999"' }, { name: 'cached', value: 'false' }]);
             setActiveLine(8);
             setRunnerState('error'); // Soft error (null return)
        }

    } else if (selectedFile === 'guard') {
        setActiveLine(7); // Reflector
        setDebugVariables([{ name: 'Roles', value: '["ADMIN"]' }]);
        await wait(600);
        setActiveLine(12); // User Check
        const isAdmin = scenario === 'valid';
        setDebugVariables(prev => [...prev, { name: 'UserRole', value: isAdmin ? '"ADMIN"' : '"USER"' }]);
        await wait(600);
        if (isAdmin) { setRunnerState('success'); } else { setRunnerState('error'); }

    } else if (selectedFile === 'productcard') {
         setActiveLine(5); // Hook
         setDebugVariables([{ name: 'cartSize', value: '0' }]);
         await wait(600);
         setConsoleOutput(['> User clicked "Add to Cart"']);
         await wait(400);
         setDebugVariables([{ name: 'cartSize', value: '1 (Optimistic)' }]);
         setConsoleOutput(prev => [...prev, '> UI Updated instantly', '> Sending API request...']);
         await wait(600);
         setConsoleOutput(prev => [...prev, '> 200 OK from Server']);
         setRunnerState('success');

    } else if (selectedFile === 'schema') {
        setConsoleOutput(['> npx prisma migrate deploy']);
        await wait(500);
        setConsoleOutput(prev => [...prev, 'Applying migration 20240101_init...']);
        await wait(600);
        setConsoleOutput(prev => [...prev, '✓ User table created', '✓ Indexes synced']);
        setRunnerState('success');
    } else {
        // Fallback for others
        setRunnerState('success');
    }

    setTimeout(() => setActiveLine(null), 3000);
  };

  // Handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  
  const handleNextPage = () => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
      document.getElementById('resume-modal-body')?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handlePrevPage = () => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
      document.getElementById('resume-modal-body')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- UPDATED SECURITY DATA (PHASE 13-15) ---
  const SECURITY_LAYERS = [
      {
          title: "WAF (Web Application Firewall)",
          icon: <IconWall size={32} className="text-danger"/>,
          status: "ACTIVE",
          desc: "Custom NestJS Middleware scanning for SQL Injection, XSS payloads, and Shell commands.",
          metrics: "Blocks ~15 malicious requests/day."
      },
      {
          title: "Honeypot Network",
          icon: <IconSpy size={32} className="text-warning"/>,
          status: "ACTIVE",
          desc: "Decoy endpoints (/wp-login.php, /.env) that trigger an immediate 365-day IP ban for bots.",
          metrics: "Auto-banned 4 bots this week."
      },
      {
          title: "CSP & Helmet Shield",
          icon: <IconShieldLock size={32} className="text-success"/>,
          status: "ENFORCED",
          desc: "Strict Content-Security-Policy headers preventing unauthorized scripts and clickjacking.",
          metrics: "A+ SSL Labs Rating."
      },
      {
          title: "Throttling & Rate Limiting",
          icon: <IconClock size={32} className="text-info"/>,
          status: "ACTIVE",
          desc: "Redis-backed rate limiter allowing 100 requests/minute per IP to prevent DDoS.",
          metrics: "Redis Latency: <2ms."
      }
  ];

return (
    <div style={{ backgroundColor: '#0b0c0e', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- GLOBAL STYLE OVERRIDES --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .text-muted { color: #adb5bd !important; }
        .text-secondary { color: #ced4da !important; }
        .text-white-50 { color: rgba(255, 255, 255, 0.85) !important; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #8b949e; }
        
        @keyframes shimmer {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(150%); }
        }
        
        @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(25, 135, 84, 0); }
            100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
        }
        .animate-pulse { animation: pulse-green 2s infinite; }
      `}} />
      
      {/* --- HERO HEADER --- */}
      <div className="position-relative overflow-hidden pt-5 pb-0 border-bottom border-secondary" style={{ backgroundColor: '#0b0c0e' }}>
        <div className="container position-relative z-index-1 mt-2">
            
            {/* TOP BAR */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                 <div className="d-flex align-items-center">
                    <div className="p-2 bg-primary rounded shadow-lg"><IconCpu size={32} className="text-white"/></div>
                    {/* BRANDING: Fixed Margin */}
                    <div className="d-flex flex-column justify-content-center" style={{ marginLeft: '15px' }}>
                        <span className="h4 m-0 fw-bold tracking-wide text-white" style={{lineHeight: '1'}}>PORTFOLIO</span>
                        <span className="text-primary text-uppercase fw-bold" style={{fontSize: '0.65rem', letterSpacing: '2px'}}>PixelForge OS</span>
                    </div>
                 </div>

                 <div className="text-center d-none d-md-block">
                    <h5 className="m-0 fw-bold text-white" style={{ letterSpacing: '1px' }}>JAIME C. J.</h5>
                    <small className="text-secondary text-uppercase d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '2px' }}>Full Stack Architecture Portfolio</small>
                    <p className="text-light small m-0 fst-italic" style={{ maxWidth: '600px', fontSize: '0.9rem', color: '#e0e0e0' }}>
                        "This ecosystem serves as a living proof-of-concept. I architected it from the ground up to showcase mastery in Full Stack development, Container Orchestration, and Enterprise Security patterns."
                    </p>
                 </div>

                 <Link href="/" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 hover-white text-white">
                    <IconArrowRight size={16}/> Exit Showcase
                 </Link>
            </div>
            
            {/* MAIN HERO GRID (2 COLUMNS) */}
            <div className="row align-items-center mt-4 mb-5">
                
                {/* LEFT SIDE: TEXT + BUTTONS (Width 8) */}
                <div className="col-lg-8 mb-4 mb-lg-0">
                    
                    {/* LIVE BADGE: Forced Spacing */}
                    <div className="d-inline-flex align-items-center border border-success rounded-pill px-3 py-1 mb-4 bg-dark bg-opacity-50">
                        <span className="badge bg-success me-2 rounded-circle p-1 animate-pulse" style={{width:'10px', height:'10px', boxShadow: '0 0 8px #198754'}}> </span>
                        <small className="text-uppercase fw-bold text-success" style={{ letterSpacing: '2px', fontSize: '0.7rem', marginLeft: '10px' }}>Live Environment • Systems Active</small>
                    </div>
                    
                    {/* TITLE */}
                    <h1 className="display-4 fw-bolder mb-3 text-white">
                        Full Stack Capability <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" style={{ color: '#4dabf7' }}>Showcase</span>
                    </h1>
                    
                    {/* DESCRIPTION */}
                    <p className="lead text-light mb-4" style={{ maxWidth: '90%', lineHeight: '1.8', color: '#f8f9fa' }}>
            An interactive demonstration of my <strong>architectural expertise</strong>, 
            engineered from scratch to bridge <strong>monolithic simplicity</strong> with <strong>microservices scale</strong>. 
            This ecosystem showcases my ability to implement <strong>advanced patterns</strong> in <strong>**High-Scale DevOps**</strong>,
            <strong>**Event-Driven Architecture**</strong>, and <strong>**Zero-Trust Security**</strong> to solve complex enterprise data challenges.
                    </p>

                    {/* BUTTONS: Stacked Vertically, Aligned to Right Edge of this Column */}
                    <div className="d-flex flex-column align-items-end pe-lg-5" style={{ marginTop: '20px' }}>
                        {/* LIVE DEMO */}
                        <button 
                            className={`btn btn-lg rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center px-4 py-2 ${activeTab === 'demo' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveTab('demo')}
                            style={{ width: '220px' }}
                        >
                            <IconRocket size={20} className="me-2"/> Try Live Demo
                        </button>
                        
                        {/* SYSTEM DOCS: Outline Light ensures White Border on Dark BG */}
                        <button 
                            className={`btn btn-lg rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center px-4 py-2 ${activeTab === 'sysdocs' ? 'btn-light text-dark' : 'btn-outline-light text-white'}`}
                            onClick={() => setActiveTab('sysdocs')}
                            style={{ width: '220px', background: '#0b0c0e', border: '1px #bbbbbb solid', marginTop: '15px' }}
                        >
                            <IconBook size={20} className="me-2"/> System Docs
                        </button>
                    </div>

                </div>

                {/* RIGHT SIDE: PROFILE CARD (Width 4) */}
                <div className="col-lg-4 text-center text-lg-end">
                    <div className="d-inline-block text-center p-4 rounded-4 border border-secondary bg-dark bg-opacity-25 backdrop-blur shadow-lg w-100">
                        <div className="mb-3 position-relative d-inline-block">
                            <img 
                                src="/assets/img/profilepiceco.png" 
                                alt="Creator" 
                                className="rounded-circle border border-2 border-primary shadow" 
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Lead+Dev&background=0d6efd&color=fff&size=150'; }}
                            />
                            <div className="position-absolute bottom-0 end-0 bg-success border border-dark rounded-circle p-2"></div>
                        </div>
                        <h5 className="fw-bold text-white mb-1">Jaime C. J.</h5>
                        <p className="text-primary small mb-3 fw-bold">Full Stack Engineer & DevOps</p>
                        
                        <p className="text-muted small mb-4 text-start fst-italic">
                            "I built this entire ecosystem to demonstrate that secure, scalable architecture doesn't have to be complicated—it just has to be engineered correctly."
                        </p>
                        
                        <div className="d-flex justify-content-center gap-3 mb-3">
                            <a href="https://github.com/jjhavok" target="_blank" className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center hover-scale" title="GitHub" style={{width: '35px', height: '35px', borderRadius: '50%'}}>
                                <IconBrandGithub size={18}/>
                            </a>
                            <a href="https://www.linkedin.com/in/jaimecj96/" target="_blank" className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center hover-scale" title="LinkedIn" style={{width: '35px', height: '35px', borderRadius: '50%'}}>
                                <IconBrandLinkedin size={18}/>
                            </a>
                            <a href="mailto:jaimecj0696@gmail.com" className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center hover-scale" title="Email Me" style={{width: '35px', height: '35px', borderRadius: '50%'}}>
                                <IconMail size={18}/>
                            </a>
                        </div>

                        <div className="d-flex flex-column gap-2 w-100">
                            <button 
                                className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center hover-scale py-2 btn-sm"
                                onClick={(e) => { e.preventDefault(); setShowResume(true); }}
                            >
                                <IconFileText size={16} className="me-2"/> View Resume
                            </button>
                             <Link 
                                href="/projects" 
                                className="btn btn-outline-light w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center hover-scale py-2 btn-sm"
                            >
                                <IconBox size={16} className="me-2"/> View Other Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HORIZONTAL MENU (Card Style with Forced Gaps) --- */}
            <div className="d-flex overflow-auto pb-4 px-1" style={{ scrollbarWidth: 'none' }}>
                
                {/* 1. Overview */}
                <button 
                    className={`btn rounded-4 py-3 px-4 d-flex flex-column align-items-center justify-content-center ${activeTab === 'overview' ? 'btn-light text-dark shadow fw-bold' : 'btn-outline-secondary text-light'}`} 
                    onClick={() => setActiveTab('overview')}
                    style={{minWidth: '160px', transition: 'all 0.2s', marginRight: '2px'}}
                >
                    <span className="small text-uppercase tracking-wide mb-1" style={{fontSize: '0.65rem', opacity: 0.7}}>Start Here</span>
                    <span className="d-flex align-items-center"><IconCpu size={20} className="me-2"/> Overview</span>
                </button>

                {/* 2. Security */}
                <button 
                    className={`btn rounded-4 py-3 px-4 d-flex flex-column align-items-center justify-content-center ${activeTab === 'security' ? 'btn-danger shadow fw-bold' : 'btn-outline-danger'}`} 
                    onClick={() => setActiveTab('security')}
                    style={{minWidth: '160px', transition: 'all 0.2s', marginRight: '2px'}}
                >
                    <span className="small text-uppercase tracking-wide mb-1" style={{fontSize: '0.65rem', opacity: 0.8}}>Hardened</span>
                    <span className="d-flex align-items-center"><IconShieldLock size={20} className="me-2"/> Security</span>
                </button>

                {/* 3. Matrix */}
                <button 
                    className={`btn rounded-4 py-3 px-4 d-flex flex-column align-items-center justify-content-center ${activeTab === 'matrix' ? 'btn-light text-dark shadow fw-bold' : 'btn-outline-secondary text-light'}`} 
                    onClick={() => setActiveTab('matrix')}
                    style={{minWidth: '160px', transition: 'all 0.2s', marginRight: '2px'}}
                >
                    <span className="small text-uppercase tracking-wide mb-1" style={{fontSize: '0.65rem', opacity: 0.7}}>Feature List</span>
                    <span className="d-flex align-items-center"><IconList size={20} className="me-2"/> Matrix</span>
                </button>

                {/* 4. Evidence */}
                <button 
                    className={`btn rounded-4 py-3 px-4 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden ${activeTab === 'evidence' ? 'btn-info text-dark shadow fw-bold' : 'btn-outline-info'}`} 
                    onClick={() => setActiveTab('evidence')}
                    style={{minWidth: '160px', transition: 'all 0.2s', marginRight: '2px', boxShadow: activeTab !== 'evidence' ? '0 0 15px rgba(13, 202, 240, 0.15)' : ''}}
                >
                    {activeTab !== 'evidence' && <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)', animation: 'shimmer 3s infinite'}}></div>}
                    <span className="small text-uppercase tracking-wide fw-bold mb-1" style={{fontSize: '0.65rem'}}>Proof of Work</span>
                    <span className="d-flex align-items-center"><IconFileCode size={20} className="me-2"/> Evidence</span>
                </button>

                {/* 5. Internals */}
                <button 
                    className={`btn rounded-4 py-3 px-4 d-flex flex-column align-items-center justify-content-center ${activeTab === 'internals' ? 'btn-light text-dark shadow fw-bold' : 'btn-outline-secondary text-light'}`} 
                    onClick={() => setActiveTab('internals')}
                    style={{minWidth: '160px', transition: 'all 0.2s', marginRight: '2px'}}
                >
                    <span className="small text-uppercase tracking-wide mb-1" style={{fontSize: '0.65rem', opacity: 0.7}}>How It Works</span>
                    <span className="d-flex align-items-center"><IconActivity size={20} className="me-2"/> Internals</span>
                </button>

                {/* 6. Diagnostics */}
                <button 
                    className={`btn rounded-4 py-3 px-4 d-flex flex-column align-items-center justify-content-center ${activeTab === 'diagnostics' ? 'btn-light text-dark shadow fw-bold' : 'btn-outline-secondary text-light'}`} 
                    onClick={() => setActiveTab('diagnostics')}
                    style={{minWidth: '160px', transition: 'all 0.2s'}}
                >
                    <span className="small text-uppercase tracking-wide mb-1" style={{fontSize: '0.65rem', opacity: 0.7}}>Ops Manual</span>
                    <span className="d-flex align-items-center"><IconTerminal size={20} className="me-2"/> Diagnostics</span>
                </button>

            </div>

        </div>
      </div>

      {/* --- CONTENT AREA (Slightly Lighter) --- */}
      <div className="flex-grow-1 py-5" style={{ backgroundColor: '#111315', minHeight: '100vh' }}>
        <div className="container">
        
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
            <div className="animate-fade-in">
                {/* 3 Pillars */}
                <div className="row g-4 mb-5">
                    {/* STOREFRONT */}
                    <div className="col-lg-4">
                        <div className="card h-100 shadow-lg" style={cardStyle}>
                            <div className="card-header py-3" style={cardHeaderStyle}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="fw-bold">1. Storefront (Client)</div>
                                        <a href="https://pixelforgedeveloper.com" target="_blank" className="small text-info text-decoration-none opacity-75 hover-opacity-100 font-monospace">
                                            pixelforgedeveloper.com <IconExternalLink size={10} className="ms-1"/>
                                        </a>
                                    </div>
                                    <IconBuildingStore size={24} className="text-info opacity-50"/>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted small mb-4">Next.js 14 • Server Side Rendering (SSR)</p>
                                <ul className="list-unstyled small text-secondary">
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>SEO:</strong> Dynamic Sitemap & Robots.txt</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>UX:</strong> Optimistic UI Updates (SWR)</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Auth:</strong> Secure HttpOnly Cookie</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Forms:</strong> Zod Schema Validation</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Layout:</strong> Bootstrap 5 Responsive Grid</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Socket:</strong> Real-Time Chat Widget</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>State:</strong> Cart Management (Zustand)</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Speed:</strong> Next/Image Optimization</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Core:</strong> Client-Side Layout Shell</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Resilience:</strong> Error Boundaries</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Fonts:</strong> Google Font Optimization</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Meta:</strong> Dynamic OpenGraph Tags</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>a11y:</strong> Semantic HTML Structure</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Protection:</strong> Middleware Redirects</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Dev:</strong> TypeScript Strict Mode</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Build:</strong> Webpack Bundle Analyzer</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Edge:</strong> Vercel/Middleware Logic</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <em>Coming Soon:</em> PWA Offline Mode</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <em>Coming Soon:</em> Google Analytics 4</li>
                                </ul>
                                <Link href="/" className="btn btn-outline-info w-100 btn-sm mt-3 fw-bold">
                                    <IconExternalLink size={16} className="me-2"/> Launch Live Storefront
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* BACKEND */}
                    <div className="col-lg-4">
                        <div className="card h-100 shadow-lg border-primary border-top-0 border-end-0 border-bottom-0 border-start-0 border-3" style={{ ...cardStyle, borderTop: '4px solid #0d6efd' }}>
                            <div className="card-header py-3" style={cardHeaderStyle}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="fw-bold">2. API Gateway (Core)</div>
                                        <a href="https://api.pixelforgedeveloper.com" target="_blank" className="small text-primary text-decoration-none opacity-75 hover-opacity-100 font-monospace">
                                            api.pixelforgedeveloper.com <IconExternalLink size={10} className="ms-1"/>
                                        </a>
                                    </div>
                                    <IconServer size={24} className="text-primary opacity-50"/>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted small mb-4">NestJS • Microservices • Events</p>
                                <ul className="list-unstyled text-secondary">
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Arch:</strong> Event-Driven (Emitter2)</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Arch:</strong> Dependency Injection (DI)</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>AI:</strong> PixelMind (OpenAI Integration)</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Security:</strong> WAF & Throttler Active</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Cache:</strong> Redis & In-Memory</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Queue:</strong> BullMQ Background Jobs</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Error:</strong> Global Exception Filters</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>DB:</strong> Prisma ORM (ACID)</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Search:</strong> ElasticSearch Sync</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Files:</strong> Multer S3 Uploads</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Headers:</strong> Helmet & CORS</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Speed:</strong> Gzip/Brotli Compression</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Ops:</strong> Health Checks (Terminus)</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Validation:</strong> DTOs & Pipes</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Scrubbing:</strong> Response Interceptors</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Logs:</strong> Winston File Transport</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Test:</strong> Jest Unit & E2E Suites</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Docs:</strong> Swagger/OpenAPI Auto-Gen</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ADMIN */}
                    <div className="col-lg-4">
                        <div className="card h-100 shadow-lg" style={cardStyle}>
                            <div className="card-header py-3" style={cardHeaderStyle}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="fw-bold">3. Staff ERP (Admin)</div>
                                        <a href="https://staff.pixelforgedeveloper.com" target="_blank" className="small text-warning text-decoration-none opacity-75 hover-opacity-100 font-monospace">
                                            staff.pixelforgedeveloper.com <IconExternalLink size={10} className="ms-1"/>
                                        </a>
                                    </div>
                                    <IconChartBar size={24} className="text-warning opacity-50"/>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted small mb-4">React • Dashboard • CRM</p>
                                <ul className="list-unstyled text-secondary">
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Chat:</strong> Real-Time Sockets</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>AI:</strong> Sentiment & Smart Drafts</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>ERP:</strong> Inventory & PO Mgmt</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>IAM:</strong> User Role CRUD</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Routing:</strong> Protected Routes (RBAC)</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Logs:</strong> Audit Visualization</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Data:</strong> Recharts Integration</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Auth:</strong> Secure MFA PIN Modal</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>UI:</strong> Dynamic Theme Provider</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>UI:</strong> Dark/Light Mode Toggle</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Tools:</strong> Bulk CSV Import/Export</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Fetch:</strong> SWR Caching</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>UX:</strong> Toast Notification System</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Forms:</strong> React Hook Form</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Table:</strong> Pagination & Sorting</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>State:</strong> Context API Providers</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Nav:</strong> Recursive Sidebar Logic</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Grid:</strong> Sticky Header Data Tables</li>
                                    <li className="d-flex" style={listStyle}><IconCheck size={16} className="text-success me-2 flex-shrink-0"/> <strong>Projects:</strong> Kanban Board (Drag & Drop)</li>
                                </ul>
                                {/* [FIX] Added Staff Panel Launch Button */}
                                <button 
                                    onClick={() => setActiveTab('demo')} 
                                    className="btn btn-outline-warning w-100 btn-sm mt-3 fw-bold"
                                >
                                    <IconExternalLink size={16} className="me-2"/> Launch Staff Panel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Flow Diagram */}
                <h3 className="fw-bold mb-4 text-white border-bottom border-secondary pb-3">Data Flow & Architecture Philosophy</h3>
                
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="p-4 border border-secondary rounded bg-dark h-100 shadow-sm">
                            <div className="d-flex align-items-center mb-3">
                                <IconKey size={24} className="text-info me-2"/>
                                <h5 className="fw-bold text-white m-0">Zero-Trust Authentication</h5>
                            </div>
                            <p className="small text-white-50 mb-3">
                                We moved beyond simple JWTs in local storage. This system implements a military-grade auth flow designed to prevent XSS and Session Hijacking.
                            </p>
                            <ul className="list-unstyled small text-muted">
                                <li className="mb-2"><strong className="text-white">1. Credential Exchange:</strong> User sends login data over SSL/TLS.</li>
                                <li className="mb-2"><strong className="text-white">2. Token Signing:</strong> API validates & signs a JWT with a secret key.</li>
                                <li className="mb-2"><strong className="text-white">3. HttpOnly Cookie:</strong> The token is sent back in a cookie flagged as <code>HttpOnly</code> (No JS Access) and <code>Secure</code> (HTTPS only).</li>
                                <li className="mb-2"><strong className="text-white">4. Redis Session:</strong> A session reference is stored in Redis, allowing instant server-side revocation if a breach is detected.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-4 border border-secondary rounded bg-dark h-100 shadow-sm">
                            <div className="d-flex align-items-center mb-3">
                                <IconClock size={24} className="text-success me-2"/>
                                <h5 className="fw-bold text-white m-0">High-Performance Strategy</h5>
                            </div>
                            <p className="small text-white-50 mb-3">
                                Speed isn't just about code; it's about architecture. We utilize a multi-layer caching strategy to ensure sub-100ms response times.
                            </p>
                            <ul className="list-unstyled small text-muted">
                                <li className="mb-2"><strong className="text-white">1. Nginx Caching:</strong> Static assets (CSS/JS/Images) are served directly from RAM.</li>
                                <li className="mb-2"><strong className="text-white">2. Redis Data Cache:</strong> Frequently accessed product data is cached in Redis (TTL 60s) to save DB hits.</li>
                                <li className="mb-2"><strong className="text-white">3. ElasticSearch Offload:</strong> Complex text searches (fuzzy matching) hit ElasticSearch, not Postgres.</li>
                                <li className="mb-2"><strong className="text-white">4. Async Workers:</strong> Heavy writes (Email, Logs) are queued via BullMQ to keep the API non-blocking.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-4 border border-secondary rounded bg-dark h-100 shadow-sm">
                            <div className="d-flex align-items-center mb-3">
                                <IconRefresh size={24} className="text-warning me-2"/>
                                <h5 className="fw-bold text-white m-0">Real-Time Event Sync</h5>
                            </div>
                            <p className="small text-white-50 mb-3">
                                The system never sleeps. We use an Event-Driven Architecture (Pub/Sub) to decouple services while keeping the UI instantly updated.
                            </p>
                            <ul className="list-unstyled small text-muted">
                                <li className="mb-2"><strong className="text-white">1. Event Trigger:</strong> Action occurs (e.g. `order.created`).</li>
                                <li className="mb-2"><strong className="text-white">2. Socket Broadcast:</strong> The Gateway emits a message to the "Staff Room" socket channel.</li>
                                <li className="mb-2"><strong className="text-white">3. Instant UI Update:</strong> Admin Dashboard React components re-render instantly without refresh.</li>
                                <li className="mb-2"><strong className="text-white">4. Transactional Integrity:</strong> Inventory is deducted inside a Prisma ACID transaction.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* NEW: ARCHITECTURAL DECISIONS (THE "WHY") */}
                <h3 className="fw-bold mb-4 text-white border-bottom border-secondary pb-3">Architectural Decisions: The "Why"</h3>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="p-3 border border-secondary rounded bg-dark h-100">
                            <h6 className="fw-bold text-info"><IconGitBranch size={18} className="me-2"/>Modular Monolith vs Microservices</h6>
                            <p className="small text-muted mb-0">
                                We chose a <strong>Modular Monolith (NestJS)</strong> architecture wrapped in Docker. Why? It eliminates the network latency of true microservices while maintaining strict boundary separation between modules (Auth, Product, User), making it easy to split into microservices later if scale demands it.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border border-secondary rounded bg-dark h-100">
                            <h6 className="fw-bold text-success"><IconRestore size={18} className="me-2"/>Disaster Recovery Strategy</h6>
                            <p className="small text-muted mb-0">
                                Data persistence is handled via Docker Volumes mapped to the host filesystem. If a container crashes, Watchtower automatically restarts it. If the server fails, the volumes allow for an instant restoration of the database state on a new instance.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border border-secondary rounded bg-dark h-100">
                            <h6 className="fw-bold text-warning"><IconDeviceDesktopAnalytics size={18} className="me-2"/>CI/CD Pipeline Philosophy</h6>
                            <p className="small text-muted mb-0">
                                We utilize a "GitOps" workflow. Code is pushed to GitHub, which triggers a build action. Docker images are built and pushed to a registry. On the VPS, Watchtower detects the new image and performs a rolling update with zero downtime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ==================== TAB: SECURITY PROTOCOLS ==================== */}
        {activeTab === 'security' && (
            <div className="animate-fade-in">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-white"><IconShieldLock className="text-danger mb-2" size={40}/> Security Protocols</h2>
                    <p className="text-white-50">Comprehensive Defense-in-Depth Strategy protecting Data, Identity, and Infrastructure.</p>
                </div>

                {/* 1. High Level Stats */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="p-3 bg-dark border border-success rounded text-center">
                            <h3 className="fw-bold text-success m-0">A+</h3>
                            <small className="text-muted">SSL Labs Rating</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 bg-dark border border-success rounded text-center">
                            <h3 className="fw-bold text-success m-0">0</h3>
                            <small className="text-muted">Open Ports (Public)</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 bg-dark border border-success rounded text-center">
                            <h3 className="fw-bold text-success m-0">100%</h3>
                            <small className="text-muted">Route Protection Coverage</small>
                        </div>
                    </div>
                </div>

                {/* 2. Active Defense Grid (Data Driven) */}
                <h5 className="text-white fw-bold border-bottom border-secondary pb-2 mb-4"><IconActivity className="me-2 text-danger"/> Active Defense Grid</h5>
                <div className="row g-4 mb-5">
                    {SECURITY_LAYERS.map((layer, i) => (
                        <div key={i} className="col-md-6">
                            <div className="p-4 border border-secondary rounded bg-dark h-100 position-relative overflow-hidden shadow-sm hover-scale">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center">
                                        {layer.icon}
                                        <h5 className="fw-bold text-white ms-3 m-0">{layer.title}</h5>
                                    </div>
                                    <span className="badge bg-success text-white border border-success shadow-sm" style={{boxShadow: '0 0 10px rgba(25, 135, 84, 0.4)'}}>{layer.status}</span>
                                </div>
                                <p className="text-muted small mb-3">{layer.desc}</p>
                                <div className="p-2 rounded bg-black border border-secondary d-flex align-items-center">
                                    <IconTerminal size={14} className="text-success me-2"/>
                                    <span className="text-white small font-monospace">{layer.metrics}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Layer 1: Network & Infrastructure */}
                <div className="row g-4 mb-4">
                    <div className="col-12">
                        <h5 className="text-white fw-bold border-bottom border-secondary pb-2 mb-3"><IconWall className="me-2 text-info"/> Layer 1: Infrastructure & Network</h5>
                    </div>
                    <div className="col-md-6">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-body">
                                <h6 className="fw-bold text-info"><IconBrandDocker className="me-2"/> Docker Isolation</h6>
                                <p className="small text-muted mb-3">Containers are isolated by default. The Database and Redis containers have <strong>NO public ports</strong> exposed to the host machine.</p>
                                <div style={codeStyle}>
                                    ports: [] # Postgres ports are NOT mapped to host
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-body">
                                <h6 className="fw-bold text-info"><IconServer className="me-2"/> Nginx Reverse Proxy</h6>
                                <p className="small text-muted mb-3">Nginx is the <strong>only</strong> entry point (Port 80/443). It filters all incoming traffic, handles SSL termination, and drops malformed requests.</p>
                                <ul className="small text-white-50 list-unstyled">
                                    <li><IconCheck size={14} className="text-success"/> Hides Backend IP Structure</li>
                                    <li><IconCheck size={14} className="text-success"/> Enforces Max Body Size (DoS Protection)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Layer 2: Application Hardening (FIXED: Added Row Wrapper) */}
                <div className="row g-4 mb-4">
                    <div className="col-12">
                        <h5 className="text-white fw-bold border-bottom border-secondary pb-2 mb-3"><IconBrowserCheck className="me-2 text-warning"/> Layer 2: Application Hardening</h5>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border border-secondary rounded bg-dark h-100">
                            <strong className="text-warning d-block mb-2">Helmet Headers</strong>
                            <p className="small text-muted">We use `helmet()` to set secure HTTP headers automatically.</p>
                            <ul className="small text-muted list-unstyled">
                                <li><code>X-DNS-Prefetch-Control: Off</code></li>
                                <li><code>X-Frame-Options: SAMEORIGIN</code></li>
                                <li><code>Strict-Transport-Security</code></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border border-secondary rounded bg-dark h-100">
                            <strong className="text-warning d-block mb-2">Rate Limiting</strong>
                            <p className="small text-muted">Prevent Brute Force attacks. Backed by Redis.</p>
                            <div style={codeStyle}>ttl: 60000, limit: 100</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 border border-secondary rounded bg-dark h-100">
                            <strong className="text-warning d-block mb-2">CORS Strict Mode</strong>
                            <p className="small text-muted">Only whitelisted domains can access the API.</p>
                            <div style={codeStyle}>origin: ['https://pixelforgedeveloper.com']</div>
                        </div>
                    </div>
                </div>

                {/* 5. Layer 3: Identity & Data (FIXED: Added Row Wrapper) */}
                <div className="row g-4">
                    <div className="col-12">
                        <h5 className="text-white fw-bold border-bottom border-secondary pb-2 mb-3"><IconFingerprint className="me-2 text-danger"/> Layer 3: Identity & Data</h5>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex gap-3 h-100">
                            <div className="p-3 bg-dark border border-secondary rounded flex-grow-1">
                                <h6 className="fw-bold text-white">HttpOnly Cookies</h6>
                                <p className="small text-white-50 m-0">JWTs are never stored in LocalStorage. They are stored in HttpOnly cookies which JavaScript <strong>cannot read</strong>.</p>
                            </div>
                            <div className="p-3 bg-dark border border-secondary rounded flex-grow-1">
                                <h6 className="fw-bold text-white">Input Validation (Zod)</h6>
                                <p className="small text-white-50 m-0">Every single API input is validated against a strict Zod schema. Malformed injection attempts are rejected.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                            <h6 className="fw-bold text-white">Sensitive Data Scrubbing</h6>
                            <p className="small text-white-50">We use a Global Interceptor to scrub passwords and sensitive PII from API responses before they leave the server.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ==================== TAB 2: CAPABILITIES MATRIX (PRESERVED) ==================== */}
        {activeTab === 'matrix' && (
            <div className="animate-fade-in">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-white">Full Capabilities Matrix</h2>
                    <p className="text-white-50">A granular breakdown of 50+ integrated systems across the ecosystem.</p>
                </div>

                <div className="row g-4">
                    {/* 1. SECURITY CORE */}
                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-danger" style={cardHeaderStyle}>
                                <IconShieldLock className="me-2"/> Security & Identity
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>RBAC System:</strong> Granular permissions (User/Admin/Super).</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>MFA / PIN:</strong> Secondary auth for sensitive actions.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Session Guard:</strong> HttpOnly Cookies (Zero XSS).</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Honeypot:</strong> Hidden fields to trap bot submissions.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Firewall:</strong> Middleware to auto-ban malicious IPs.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Audit Logging:</strong> Immutable DB tracking of all changes.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Throttling:</strong> Rate limiting via Redis (100 req/min).</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Data Encryption:</strong> Bcrypt hashing & At-rest encryption.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-info" style={cardHeaderStyle}>
                                <IconServer className="me-2"/> DevOps & Infra
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Docker Compose:</strong> Multi-container orchestration.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Redis:</strong> Session storage & API caching.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>ElasticSearch:</strong> Instant search indexing via Sync Service.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>BullMQ:</strong> Background job queues (Email/Cron).</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Health Checks:</strong> Automated system monitoring endpoints.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Nginx:</strong> Reverse Proxy & SSL Termination.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Hot Reloading:</strong> Docker Volume binding for dev speed.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Log Rotation:</strong> Winston Logger integration.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-primary" style={cardHeaderStyle}>
                                <IconBuildingStore className="me-2"/> E-Commerce Core
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Inventory:</strong> Real-time stock tracking with variants.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Orders:</strong> State machine workflow (Pending &rarr; Shipped).</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Promotions:</strong> Coupon logic with usage limits.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Payments:</strong> Stripe Integration with Webhooks.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Returns (RMA):</strong> Approval workflow system.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Shipping:</strong> Calculation engine mockups.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Wishlist:</strong> Persistent user favorites.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Reviews:</strong> Rating system with verification.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-warning" style={cardHeaderStyle}>
                                <IconUsers className="me-2"/> CRM & Marketing
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>B2B Orgs:</strong> Company profiles & hierarchy.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Deals Pipeline:</strong> Kanban-style sales tracking.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Inbox:</strong> Centralized messaging center.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Campaigns:</strong> Email marketing engine.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Customer Portal:</strong> Self-service dashboard.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Lead Scoring:</strong> Algorithmic customer rating.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Contacts:</strong> Detailed interaction history.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 5. ERP & OPS */}
                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-success" style={cardHeaderStyle}>
                                <IconTruckDelivery className="me-2"/> ERP Operations
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Procurement:</strong> Vendor & Purchase Order (PO) system.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>HR Module:</strong> Staff directory, Leave requests.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Timesheets:</strong> Employee time tracking.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Finance:</strong> Invoicing & Revenue Reports.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Projects:</strong> Task management & Milestones.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Backup:</strong> Automated DB Dump & Export.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Documents:</strong> S3-ready file storage.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 6. AI & AUTOMATION */}
                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3" style={{ ...cardHeaderStyle, color: '#d63384' }}>
                                <IconRobot className="me-2"/> AI & Intelligence
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Smart Helpdesk:</strong> OpenAI Sentiment Analysis.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Live Chat:</strong> Socket.io powered widget.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>SEO Studio:</strong> Dynamic metadata control.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>n8n Integration:</strong> Webhook automation.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Global Search:</strong> Elastic fuzzy matching.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Import/Export:</strong> Bulk CSV data handling.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Chatbot:</strong> Auto-reply logic.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 7. FRONTEND ARCHITECTURE */}
                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-white" style={cardHeaderStyle}>
                                <IconCode className="me-2"/> Frontend Architecture
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Hydration Safe:</strong> Fixed LayoutShell pattern.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Zustand:</strong> Lightweight global state.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>SWR/TanStack:</strong> Stale-while-revalidate data fetching.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Lazy Loading:</strong> Component code-splitting.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Error Boundaries:</strong> Graceful crash handling.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 8. DATA STRATEGY */}
                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-white" style={cardHeaderStyle}>
                                <IconDatabase className="me-2"/> Data Strategy
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>ACID Transactions:</strong> Prisma Interactive Transactions.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Soft Deletes:</strong> Middleware for preserving history.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Seeding:</strong> Automated dev environment population.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Type Safety:</strong> Full End-to-End TypeScript.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 9. OPTIMIZATION */}
                    <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-white" style={cardHeaderStyle}>
                                <IconBolt className="me-2"/> Optimization
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Gzip Compression:</strong> Global middleware.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Image Optimization:</strong> Next/Image WebP conversion.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Bundle Analysis:</strong> Tree-shaking unused modules.</li>
                                <li className="list-group-item" style={listStyle}><IconCheck size={16} className="text-success me-2"/> <strong>Query Optimization:</strong> Select fields to reduce payload.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ==================== TAB: EVIDENCE VAULT (NEW MASTERPIECE) ==================== */}
        {activeTab === 'evidence' && (
            <div className="animate-fade-in">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-white"><IconFileCode className="text-info mb-2" size={40}/> The Evidence Vault</h2>
                    <p className="text-white-50">Code snippets, Git history, and Architectural Diagrams proving ownership and expertise.</p>
                </div>

                <div className="card shadow-lg border-secondary" style={{ backgroundColor: '#0d1117', minHeight: '600px' }}>
                    {/* [FIX] Header Background Black + Colored Borders for Active State */}
                    <div className="card-header p-0 border-bottom border-secondary d-flex" style={{ backgroundColor: '#000' }}>
                        <button 
                            className={`btn rounded-0 py-3 px-4 flex-grow-1 border-end border-secondary ${evidenceSubTab === 'code' ? 'text-white bg-dark fw-bold border-bottom border-3 border-primary' : 'text-muted'}`} 
                            style={{backgroundColor: evidenceSubTab === 'code' ? '#161b22' : 'transparent', borderBottomColor: evidenceSubTab === 'code' ? '#0d6efd' : 'transparent'}}
                            onClick={() => setEvidenceSubTab('code')}
                        >
                            <IconFileCode size={16} className="me-2"/> 1. Code Anatomy
                        </button>
                        <button 
                            className={`btn rounded-0 py-3 px-4 flex-grow-1 border-end border-secondary ${evidenceSubTab === 'pipeline' ? 'text-white bg-dark fw-bold border-bottom border-3 border-success' : 'text-muted'}`} 
                            style={{backgroundColor: evidenceSubTab === 'pipeline' ? '#161b22' : 'transparent', borderBottomColor: evidenceSubTab === 'pipeline' ? '#198754' : 'transparent'}}
                            onClick={() => setEvidenceSubTab('pipeline')}
                        >
                            <IconGitBranch size={16} className="me-2"/> 2. CI/CD Pipeline
                        </button>
                        <button 
                            className={`btn rounded-0 py-3 px-4 flex-grow-1 ${evidenceSubTab === 'structure' ? 'text-white bg-dark fw-bold border-bottom border-3 border-warning' : 'text-muted'}`} 
                            style={{backgroundColor: evidenceSubTab === 'structure' ? '#161b22' : 'transparent', borderBottomColor: evidenceSubTab === 'structure' ? '#ffc107' : 'transparent'}}
                            onClick={() => setEvidenceSubTab('structure')}
                        >
                            <IconHierarchy size={16} className="me-2"/> 3. File Structure
                        </button>
                        <button 
                            className={`btn rounded-0 py-3 px-4 flex-grow-1 ${evidenceSubTab === 'architecture' ? 'text-white bg-dark fw-bold border-bottom border-3 border-danger' : 'text-muted'}`} 
                            style={{backgroundColor: evidenceSubTab === 'architecture' ? '#161b22' : 'transparent', borderBottomColor: evidenceSubTab === 'architecture' ? '#dc3545' : 'transparent'}}
                            onClick={() => setEvidenceSubTab('architecture')}
                        >
                            <IconMap2 size={16} className="me-2"/> 4. Architecture
                        </button>
                         <button 
                            className={`btn rounded-0 py-3 px-4 flex-grow-1 ${evidenceSubTab === 'monitoring' ? 'text-white bg-dark fw-bold border-bottom border-3 border-info' : 'text-muted'}`} 
                            style={{backgroundColor: evidenceSubTab === 'monitoring' ? '#161b22' : 'transparent', borderBottomColor: evidenceSubTab === 'monitoring' ? '#0dcaf0' : 'transparent'}}
                            onClick={() => setEvidenceSubTab('monitoring')}
                        >
                            <IconDeviceHeartMonitor size={16} className="me-2"/> 5. Live Metrics
                        </button>
                    </div>
                    
                    <div className="card-body p-0 bg-black">
                        {/* --- 1. CODE ANATOMY (With Interactive Runner) --- */}
                        {evidenceSubTab === 'code' && (
                            <div className="d-flex flex-column flex-md-row">
                                {/* Sidebar */}
                                <div className="p-3 border-end border-secondary text-secondary" style={{ width: '100%', maxWidth: '280px', backgroundColor: '#161b22', fontSize: '0.85rem' }}>
                                    <div className="mb-3 fw-bold text-white text-uppercase small d-flex justify-content-between">
                                        <span>Explorer</span>
                                        <IconRefresh size={14} className="text-muted"/>
                                    </div>
                                    <div className="ps-2">
                                        <div className="mb-2">
                                            <div className="text-info mb-1"><IconFolder size={14} className="me-1"/> backend/src/auth</div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'jwt' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('jwt')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconBrandTypescript size={14} className="me-2 text-primary"/> jwt.guard.ts
                                            </div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'guard' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('guard')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconBrandTypescript size={14} className="me-2 text-primary"/> roles.guard.ts
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-info mb-1"><IconFolder size={14} className="me-1"/> backend/src/common</div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'redis' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('redis')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconBrandTypescript size={14} className="me-2 text-primary"/> redis.service.ts
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-info mb-1"><IconFolder size={14} className="me-1"/> backend</div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'schema' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('schema')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconSchema size={14} className="me-2 text-success"/> schema.prisma
                                            </div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'module' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('module')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconBrandTypescript size={14} className="me-2 text-primary"/> app.module.ts
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-info mb-1"><IconFolder size={14} className="me-1"/> storefront</div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'productcard' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('productcard')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconBrandReact size={14} className="me-2 text-info"/> ProductCard.tsx
                                            </div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'format' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('format')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconFunction size={14} className="me-2 text-info"/> formatCurrency.ts
                                            </div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'nextconf' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('nextconf')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconSettings size={14} className="me-2 text-warning"/> next.config.js
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-info mb-1"><IconFolder size={14} className="me-1"/> root</div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'docker' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('docker')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconBrandDocker size={14} className="me-2 text-primary"/> docker-compose.yml
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-info mb-1"><IconFolder size={14} className="me-1"/> .github/workflows</div>
                                            <div 
                                                className={`ps-3 py-1 rounded cursor-pointer ${selectedFile === 'ci' ? 'bg-primary bg-opacity-25 text-white fw-bold' : 'text-muted hover-white'}`}
                                                onClick={() => setSelectedFile('ci')}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <IconBrandUbuntu size={14} className="me-2 text-warning"/> deploy.yaml
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Code Area */}
                                <div className="p-4 flex-grow-1" style={{ fontFamily: 'Fira Code, monospace', color: '#e6edf3', backgroundColor: '#0d1117', overflowX: 'auto', position: 'relative' }}>
                                    
                                    {/* --- INTERACTIVE RUNNER OVERLAY --- */}
                                    <div className="position-absolute top-0 end-0 m-3 d-flex gap-2" style={{zIndex: 10}}>
                                        {/* Dynamic Buttons based on selected file */}
                                        {selectedFile === 'jwt' && (
                                            <>
                                                <button className="btn btn-sm btn-success d-flex align-items-center" onClick={() => runSimulation('valid')} disabled={runnerState === 'running'}><IconPlayerPlay size={14} className="me-1"/> Valid Token</button>
                                                <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={() => runSimulation('invalid')} disabled={runnerState === 'running'}><IconBug size={14} className="me-1"/> Revoked Token</button>
                                            </>
                                        )}
                                        {selectedFile === 'redis' && (
                                            <>
                                                <button className="btn btn-sm btn-success d-flex align-items-center" onClick={() => runSimulation('hit')} disabled={runnerState === 'running'}><IconDatabase size={14} className="me-1"/> Cache Hit</button>
                                                <button className="btn btn-sm btn-warning d-flex align-items-center" onClick={() => runSimulation('miss')} disabled={runnerState === 'running'}><IconRefresh size={14} className="me-1"/> Cache Miss</button>
                                            </>
                                        )}
                                        {selectedFile === 'guard' && (
                                            <>
                                                <button className="btn btn-sm btn-success d-flex align-items-center" onClick={() => runSimulation('valid')} disabled={runnerState === 'running'}><IconShieldLock size={14} className="me-1"/> Admin User</button>
                                                <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={() => runSimulation('invalid')} disabled={runnerState === 'running'}><IconLockAccess size={14} className="me-1"/> Regular User</button>
                                            </>
                                        )}
                                        {selectedFile === 'productcard' && (
                                            <button className="btn btn-sm btn-primary d-flex align-items-center" onClick={() => runSimulation('start')} disabled={runnerState === 'running'}><IconBolt size={14} className="me-1"/> Simulate Click</button>
                                        )}
                                        {(selectedFile === 'docker' || selectedFile === 'schema' || selectedFile === 'ci') && (
                                            <button className="btn btn-sm btn-info d-flex align-items-center" onClick={() => runSimulation('start')} disabled={runnerState === 'running'}><IconTerminal size={14} className="me-1"/> Run Process</button>
                                        )}
                                    </div>

                                    {/* --- CODE CONTENT WITH HIGHLIGHTING --- */}
                                    {selectedFile === 'jwt' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small">// File: src/auth/guards/jwt.guard.ts</div>
                                            <div style={{opacity: activeLine === 1 ? 1 : 0.5, transition: 'opacity 0.2s'}}><span className="text-info">import</span> &#123; Injectable &#125; <span className="text-info">from</span> <span className="text-success">'@nestjs/common'</span>;</div>
                                            <br/>
                                            <div style={{opacity: activeLine === 4 ? 1 : 0.5, transition: 'opacity 0.2s'}}><span className="text-warning">@Injectable()</span></div>
                                            <div style={{opacity: activeLine === 4 ? 1 : 0.5, transition: 'opacity 0.2s'}}><span className="text-info">export class</span> <span className="text-warning">JwtAuthGuard</span> &#123;</div>
                                            <div style={{opacity: activeLine === 7 ? 1 : 0.5, transition: 'opacity 0.2s'}}>&nbsp;&nbsp;<span className="text-info">async canActivate</span>(context) &#123;</div>
                                            <div style={{backgroundColor: activeLine === 7 ? '#1f6feb33' : 'transparent', transition: 'background 0.2s'}}>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">const</span> token = req.cookies.access_token;</div>
                                            <br/>
                                            <div style={{backgroundColor: activeLine === 11 ? '#1f6feb33' : 'transparent', transition: 'background 0.2s'}}>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">// 2. Check Redis for Revocation</span></div>
                                            <div style={{backgroundColor: activeLine === 12 ? '#1f6feb33' : 'transparent', transition: 'background 0.2s'}}>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">const</span> isBlacklisted = <span className="text-info">await</span> <span className="text-warning">redis.get</span>(token);</div>
                                            <div style={{backgroundColor: activeLine === 13 ? '#1f6feb33' : 'transparent', transition: 'background 0.2s'}}>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">if</span> (isBlacklisted) <span className="text-danger">throw new UnauthorizedException();</span></div>
                                            <br/>
                                            <div style={{backgroundColor: activeLine === 16 ? '#1f6feb33' : 'transparent', transition: 'background 0.2s'}}>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">return true</span>;</div>
                                            <div>&#125;</div>
                                        </div>
                                    )}

                                    {selectedFile === 'productcard' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small">// File: storefront/components/ui/ProductCard.tsx</div>
                                            <div className="mb-3 text-success small">// Reusable UI component with Optimistic Updates</div>
                                            
                                            <span className="text-info">import</span> Image <span className="text-info">from</span> <span className="text-success">'next/image'</span>;<br/>
                                            <span className="text-info">import</span> &#123; useCart &#125; <span className="text-info">from</span> <span className="text-success">'@/hooks/useCart'</span>;<br/><br/>

                                            <span className="text-info">export default function</span> <span className="text-warning">ProductCard</span>(&#123; product &#125;) &#123;<br/>
                                            &nbsp;&nbsp;<span className="text-info">const</span> &#123; addToCart &#125; = <span className="text-warning">useCart</span>();<br/><br/>
                                            
                                            &nbsp;&nbsp;<span className="text-info">return</span> (<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-warning">div</span> className="card h-100 border-0 shadow-sm"&gt;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-warning">div</span> className="position-relative" style=&#123;&#123;height: '200px'&#125;&#125;&gt;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-warning">Image</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;src=&#123;product.image&#125;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fill<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;className="object-fit-cover rounded-top"<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;alt=&#123;product.name&#125;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&gt;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-warning">div</span>&gt;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-warning">div</span>&gt;<br/>
                                            &nbsp;&nbsp;);<br/>
                                            &#125;
                                        </div>
                                    )}

                                    {selectedFile === 'format' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small">// File: storefront/lib/utils/formatCurrency.ts</div>
                                            <div className="mb-3 text-success small">// Internationalization Utility</div>
                                            
                                            <span className="text-info">export function</span> <span className="text-warning">formatCurrency</span>(amount: number, currency: string = 'USD'): string &#123;<br/>
                                            &nbsp;&nbsp;<span className="text-info">return new</span> Intl.NumberFormat('en-US', &#123;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;style: 'currency',<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;currency: currency,<br/>
                                            &nbsp;&nbsp;&#125;).format(amount);<br/>
                                            &#125;
                                        </div>
                                    )}

                                    {selectedFile === 'guard' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small">// File: src/auth/guards/roles.guard.ts</div>
                                            <div className="mb-3 text-success small">// RBAC Logic for Role Enforcement</div>
                                            
                                            <span className="text-warning">@Injectable()</span><br/>
                                            <span className="text-info">export class</span> <span className="text-warning">RolesGuard</span> <span className="text-info">implements</span> <span className="text-warning">CanActivate</span> &#123;<br/>
                                            &nbsp;&nbsp;<span className="text-info">constructor</span>(<span className="text-info">private</span> reflector: <span className="text-success">Reflector</span>) &#123;&#125;<br/><br/>
                                            &nbsp;&nbsp;<span className="text-info">canActivate</span>(context: <span className="text-success">ExecutionContext</span>): <span className="text-info">boolean</span> &#123;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">const</span> requiredRoles = <span className="text-warning">this.reflector.getAllAndOverride</span>&lt;Role[]&gt;(ROLES_KEY, [<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;context.getHandler(),<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;context.getClass(),<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;]);<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">if</span> (!requiredRoles) <span className="text-info">return true</span>;<br/><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">const</span> &#123; user &#125; = context.switchToHttp().getRequest();<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">return</span> requiredRoles.some((role) ={'>'} user.roles?.includes(role));<br/>
                                            &nbsp;&nbsp;&#125;<br/>
                                            &#125;
                                        </div>
                                    )}

                                    {selectedFile === 'docker' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small"># File: docker-compose.yml</div>
                                            <div className="mb-3 text-success small"># Orchestrates the entire ecosystem with Zero-Trust internal networking</div>
                                            
                                            <span className="text-warning">services:</span><br/>
                                            &nbsp;&nbsp;<span className="text-info">backend:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">image:</span> ghcr.io/pixelforge/backend:latest<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">restart:</span> always<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">networks:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- internal_net<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">depends_on:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- postgres_db<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- redis_cache<br/><br/>
                                            
                                            &nbsp;&nbsp;<span className="text-info">postgres_db:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">image:</span> postgres:15-alpine<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary"># NO PORTS MAPPED TO HOST (Security)</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">volumes:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- pg_data:/var/lib/postgresql/data<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">networks:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- internal_net<br/>
                                        </div>
                                    )}

                                    {selectedFile === 'redis' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small">// File: src/common/services/redis.service.ts</div>
                                            <div className="mb-3 text-success small">// Wrapper service for efficient caching and throttling</div>
                                            
                                            <span className="text-warning">@Injectable()</span><br/>
                                            <span className="text-info">export class</span> <span className="text-warning">RedisService</span> &#123;<br/>
                                            &nbsp;&nbsp;<span className="text-info">constructor</span>(<span className="text-info">@Inject</span>('REDIS_CLIENT') <span className="text-info">private readonly</span> client: <span className="text-success">Redis</span>) &#123;&#125;<br/><br/>
                                            
                                            &nbsp;&nbsp;<span className="text-info">async get</span>&lt;T&gt;(key: <span className="text-success">string</span>): <span className="text-info">Promise</span>&lt;T | null&gt; &#123;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">const</span> data = <span className="text-info">await</span> <span className="text-warning">this.client.get</span>(key);<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">if</span> (!data) <span className="text-info">return null</span>;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">return JSON.parse</span>(data);<br/>
                                            &nbsp;&nbsp;&#125;<br/><br/>

                                            &nbsp;&nbsp;<span className="text-info">async set</span>(key: <span className="text-success">string</span>, val: <span className="text-success">any</span>, ttl: <span className="text-success">number</span>) &#123;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">await</span> <span className="text-warning">this.client.set</span>(key, <span className="text-info">JSON.stringify</span>(val), 'EX', ttl);<br/>
                                            &nbsp;&nbsp;&#125;<br/>
                                            &#125;
                                        </div>
                                    )}

                                    {selectedFile === 'ci' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small"># File: .github/workflows/deploy.yaml</div>
                                            <div className="mb-3 text-success small"># Automated CI/CD Pipeline Configuration</div>
                                            
                                            <span className="text-warning">name:</span> Production Deploy<br/>
                                            <span className="text-warning">on:</span><br/>
                                            &nbsp;&nbsp;<span className="text-warning">push:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">branches:</span> [ "main" ]<br/><br/>
                                            
                                            <span className="text-warning">jobs:</span><br/>
                                            &nbsp;&nbsp;<span className="text-info">build-and-push:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">runs-on:</span> ubuntu-latest<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">steps:</span><br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-warning">uses:</span> actions/checkout@v3<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-warning">name:</span> Login to GHCR<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">uses:</span> docker/login-action@v2<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-warning">name:</span> Build and Push<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-warning">uses:</span> docker/build-push-action@v4<br/>
                                        </div>
                                    )}

                                    {selectedFile === 'schema' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small">// File: backend/prisma/schema.prisma</div>
                                            <div className="mb-3 text-success small">// Defines the Relational Database Structure</div>
                                            
                                            <span className="text-info">model</span> <span className="text-warning">User</span> &#123;<br/>
                                            &nbsp;&nbsp;id        <span className="text-success">String</span>   @id @default(uuid())<br/>
                                            &nbsp;&nbsp;email     <span className="text-success">String</span>   @unique<br/>
                                            &nbsp;&nbsp;password  <span className="text-success">String</span><br/>
                                            &nbsp;&nbsp;role      <span className="text-warning">Role</span>     @default(USER)<br/>
                                            &nbsp;&nbsp;orders    <span className="text-warning">Order[]</span><br/>
                                            &nbsp;&nbsp;createdAt <span className="text-success">DateTime</span> @default(now())<br/>
                                            &#125;<br/><br/>

                                            <span className="text-info">enum</span> <span className="text-warning">Role</span> &#123;<br/>
                                            &nbsp;&nbsp;USER<br/>
                                            &nbsp;&nbsp;ADMIN<br/>
                                            &nbsp;&nbsp;SUPER_ADMIN<br/>
                                            &#125;
                                        </div>
                                    )}
                                    
                                    {selectedFile === 'module' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small">// File: backend/src/app.module.ts</div>
                                            <div className="mb-3 text-success small">// Root Module Dependency Injection</div>
                                            
                                            <span className="text-warning">@Module</span>(&#123;<br/>
                                            &nbsp;&nbsp;imports: [<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;ConfigModule.forRoot(&#123; isGlobal: true &#125;),<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;PrismaModule,<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;AuthModule,<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;UsersModule,<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;ProductsModule,<br/>
                                            &nbsp;&nbsp;],<br/>
                                            &nbsp;&nbsp;providers: [<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;provide: APP_GUARD,<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;useClass: JwtAuthGuard,<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                                            &nbsp;&nbsp;]<br/>
                                            &#125;)<br/>
                                            <span className="text-info">export class</span> <span className="text-warning">AppModule</span> &#123;&#125;
                                        </div>
                                    )}

                                    {selectedFile === 'nextconf' && (
                                        <div className="animate-fade-in">
                                            <div className="mb-2 text-muted small">// File: storefront/next.config.js</div>
                                            <div className="mb-3 text-success small">// Next.js Security & Optimization Configuration</div>
                                            
                                            <span className="text-info">const</span> nextConfig = &#123;<br/>
                                            &nbsp;&nbsp;reactStrictMode: <span className="text-warning">true</span>,<br/>
                                            &nbsp;&nbsp;swcMinify: <span className="text-warning">true</span>,<br/>
                                            &nbsp;&nbsp;images: &#123;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;domains: ['s3.us-east-1.amazonaws.com'],<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;formats: ['image/avif', 'image/webp'],<br/>
                                            &nbsp;&nbsp;&#125;,<br/>
                                            &nbsp;&nbsp;<span className="text-info">async</span> headers() &#123;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-info">return</span> [<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;source: '/(.*)',<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;headers: securityHeaders,<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;];<br/>
                                            &nbsp;&nbsp;&#125;<br/>
                                            &#125;;
                                        </div>
                                    )}
                                </div>
                                
                                {/* Side Panel: Debug Variables */}
                                <div className="p-4 border-start border-secondary bg-dark text-secondary d-none d-lg-block" style={{ width: '300px' }}>
                                    <h6 className="fw-bold text-white mb-3 d-flex align-items-center">
                                        <IconBug size={16} className="me-2 text-warning"/> Debug Variables
                                    </h6>
                                    {debugVariables.length === 0 ? (
                                        <div className="text-muted small fst-italic">Waiting for execution...</div>
                                    ) : (
                                        <ul className="list-unstyled font-monospace small">
                                            {debugVariables.map((v, i) => (
                                                <li key={i} className="mb-2 animate-fade-in">
                                                    <span className="text-info">{v.name}:</span> <span className="text-success">{v.value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {runnerState === 'error' && (
                                        <div className="mt-3 p-2 bg-danger bg-opacity-25 border border-danger rounded text-white small animate-fade-in">
                                            <strong>Error:</strong> 401 Unauthorized<br/>Session Revoked.
                                        </div>
                                    )}
                                    {runnerState === 'success' && (
                                        <div className="mt-3 p-2 bg-success bg-opacity-25 border border-success rounded text-white small animate-fade-in">
                                            <strong>Success:</strong> 200 OK<br/>Access Granted.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- 2. PIPELINE VISUALIZER --- */}
                        {evidenceSubTab === 'pipeline' && (
                            // [FIX] Full Page Scroll
                            <div className="p-5">
                                <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-4 overflow-auto">
                                    <div className="text-center px-3">
                                        <div className="badge bg-secondary mb-2">DEV LOCAL</div>
                                        <div className="small text-muted">VS Code</div>
                                    </div>
                                    <IconArrowRight className="text-muted"/>
                                    <div className="text-center px-3">
                                        <div className="badge bg-secondary mb-2">LINT & FORMAT</div>
                                        <div className="small text-muted">ESLint / Prettier</div>
                                    </div>
                                    <IconArrowRight className="text-muted"/>
                                    <div className="text-center px-3">
                                        <div className="badge bg-primary mb-2">UNIT TEST</div>
                                        <div className="small text-white">Jest Runner</div>
                                    </div>
                                    <IconArrowRight className="text-muted"/>
                                    <div className="text-center px-3">
                                        <div className="badge bg-primary mb-2">E2E TEST</div>
                                        <div className="small text-white">Cypress</div>
                                    </div>
                                    <IconArrowRight className="text-muted"/>
                                    <div className="text-center px-3">
                                        <div className="badge bg-warning text-dark mb-2">BUILD</div>
                                        <div className="small text-white">Docker BuildX</div>
                                    </div>
                                    <IconArrowRight className="text-muted"/>
                                    <div className="text-center px-3">
                                        <div className="badge bg-info text-dark mb-2">SCAN</div>
                                        <div className="small text-white">Trivy Security</div>
                                    </div>
                                    <IconArrowRight className="text-muted"/>
                                    <div className="text-center px-3">
                                        <div className="badge bg-success mb-2">DEPLOY</div>
                                        <div className="small text-white">Watchtower</div>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-end mb-3">
                                    <button 
                                        className={`btn btn-sm ${pipelineScenario === 'rollback' ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={() => setPipelineScenario(prev => prev === 'success' ? 'rollback' : 'success')}
                                    >
                                        {pipelineScenario === 'success' ? 'Simulate Rollback Failure' : 'Show Success Path'}
                                    </button>
                                </div>

                                <h5 className="text-white mb-3 fw-bold">Live Console Simulation</h5>
                                <div className="bg-black p-3 rounded border border-secondary font-monospace small" style={{minHeight: '350px', color: pipelineScenario === 'success' ? '#00ff41' : '#ff5555'}}>
                                    <div className="mb-1"><span className="text-secondary">[runner]</span> Job 'production-pipeline' started on agent-2b...</div>
                                    <div className="mb-1"><span className="text-secondary">[git]</span> Checking out branch 'main' (sha: 8f3a21)...</div>
                                    <div className="mb-1"><span className="text-info">[lint]</span> Running ESLint check... <span className="text-success">PASS</span></div>
                                    
                                    {pipelineScenario === 'rollback' ? (
                                        <>
                                            <div className="mb-1"><span className="text-info">[test]</span> Running Unit Suite (Jest)...</div>
                                            <div className="mb-1 ms-3 text-muted"> - AuthController.spec.ts <span className="text-danger">FAIL</span></div>
                                            <div className="text-danger fw-bold">Error: Expected 200 OK, got 401 Unauthorized</div>
                                            <div className="mb-1 mt-2 text-warning">--- PIPELINE HALTED ---</div>
                                            <div className="mb-1"><span className="text-info">[notify]</span> Sending Slack Alert to #devops-alerts...</div>
                                            <div className="mb-1"><span className="text-info">[rollback]</span> Deployment cancelled. Previous stable image remains active.</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-1"><span className="text-info">[test]</span> Running Unit Suite (Jest)...</div>
                                            <div className="mb-1 ms-3 text-muted"> - AuthController.spec.ts <span className="text-success">PASS</span> (12ms)</div>
                                            <div className="mb-1 ms-3 text-muted"> - ProductsService.spec.ts <span className="text-success">PASS</span> (45ms)</div>
                                            <div className="mb-1"><span className="text-info">[e2e]</span> Running End-to-End Suite (Cypress)... <span className="text-success">PASS</span> (4 tests)</div>
                                            
                                            <div className="mb-1 mt-2"><span className="text-secondary">[docker]</span> Building image 'pixelforge/backend:latest'...</div>
                                            <div className="mb-1 ms-3 text-muted"> {'>'} [1/5] FROM node:20-alpine</div>
                                            <div className="mb-1 ms-3 text-muted"> {'>'} [5/5] RUN npm run build</div>
                                            
                                            <div className="mb-1 mt-2"><span className="text-warning">[trivy]</span> Scanning image for vulnerabilities...</div>
                                            <div className="mb-1 ms-3 text-success"> - Scan Passed.</div>
                                            
                                            <div className="mb-1 mt-2"><span className="text-secondary">[docker]</span> Pushing layer a1b2c3d4... <span className="text-success">100%</span></div>
                                            
                                            <div className="mb-1 mt-3 text-warning">--- Triggering Watchtower Webhook ---</div>
                                            <div className="mb-1"><span className="text-info">[vps]</span> 200 OK: Signal Received</div>
                                            <div className="mb-1"><span className="text-success">[vps]</span> Deployment Complete. System Healthy.</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- 3. FILE STRUCTURE --- */}
                        {evidenceSubTab === 'structure' && (
                            <div className="p-5">
                                {/* ... (Same Structure Content) ... */}
                                <div className="row">
                                    <div className="col-md-5 border-end border-secondary">
                                        <h6 className="text-info fw-bold mb-4">Monorepo Anatomy</h6>
                                        <ul className="list-unstyled font-monospace small text-secondary ps-2">
                                            <li className="mb-2"><IconFolder size={16} className="text-warning me-2"/> .github/workflows <span className="text-muted fst-italic ms-2">// CI Configs</span></li>
                                            <li className="mb-2"><IconFolder size={16} className="text-primary me-2"/> backend/ <span className="text-muted fst-italic ms-2">// NestJS API</span></li>
                                            <li className="ps-4 mb-1">├── src/</li>
                                            <li className="ps-5 mb-1 text-white">├── auth/ <span className="text-muted ms-2">// Guards, Strategies</span></li>
                                            <li className="ps-5 mb-1 text-white">├── common/ <span className="text-muted ms-2">// Decorators, Interceptors</span></li>
                                            <li className="ps-4 mb-1">└── Dockerfile</li>
                                            <li className="mb-2 mt-3"><IconFolder size={16} className="text-info me-2"/> storefront/ <span className="text-muted fst-italic ms-2">// Next.js App</span></li>
                                            <li className="mb-2 mt-3"><IconFolder size={16} className="text-success me-2"/> admin-panel/ <span className="text-muted fst-italic ms-2">// React CRM</span></li>
                                            <li className="mb-1 mt-4"><IconFileText size={16} className="text-white me-2"/> docker-compose.yml <span className="text-muted ms-2">// Orchestration</span></li>
                                        </ul>
                                    </div>
                                    <div className="col-md-7 ps-5">
                                        <h5 className="text-white fw-bold mb-4">Architectural Integrity</h5>
                                        <div className="d-flex align-items-start mb-4">
                                            <div className="p-3 rounded bg-dark border border-success me-3"><IconCheck className="text-success"/></div>
                                            <div>
                                                <h6 className="text-white fw-bold">Shared Typing Strategy</h6>
                                                <p className="text-white-50 small">Backend DTOs (Data Transfer Objects) are shared with Frontend apps via a local NPM workspace. This ensures that if an API response changes, the Frontend breaks at <strong>compile time</strong>, not runtime.</p>
                                            </div>
                                        </div>
                                        {/* ... (More items) ... */}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- 4. ARCHITECTURE HOLODECK --- */}
                        {evidenceSubTab === 'architecture' && (
                            <div className="p-5 d-flex flex-column align-items-center">
                                <div className="d-flex gap-5 mb-5 align-items-center">
                                    <div 
                                        className={`p-4 rounded border ${archNode === 'client' ? 'border-info bg-dark' : 'border-secondary'} cursor-pointer transition`}
                                        onClick={() => setArchNode('client')}
                                    >
                                        <IconBrandNextjs size={40} className="text-white mb-2"/>
                                        <div className="fw-bold">Client (Next.js)</div>
                                    </div>
                                    <IconArrowRight className="text-muted"/>
                                    <div 
                                        className={`p-4 rounded border ${archNode === 'nginx' ? 'border-success bg-dark' : 'border-secondary'} cursor-pointer transition`}
                                        onClick={() => setArchNode('nginx')}
                                    >
                                        <IconServer size={40} className="text-success mb-2"/>
                                        <div className="fw-bold">Nginx Proxy</div>
                                    </div>
                                    <IconArrowRight className="text-muted"/>
                                    <div 
                                        className={`p-4 rounded border ${archNode === 'nestjs' ? 'border-danger bg-dark' : 'border-secondary'} cursor-pointer transition`}
                                        onClick={() => setArchNode('nestjs')}
                                    >
                                        <IconApi size={40} className="text-danger mb-2"/>
                                        <div className="fw-bold">API (NestJS)</div>
                                    </div>
                                </div>
                                
                                <div className="w-100 p-4 border border-secondary rounded bg-dark">
                                    <h5 className="text-white fw-bold mb-3 d-flex align-items-center">
                                        <IconSchema className="me-2"/> Component Details: {archNode.toUpperCase()}
                                    </h5>
                                    {archNode === 'nestjs' && (
                                        <div className="text-white-50 small">
                                            The core of the ecosystem. It handles Authentication, Business Logic, and Data Persistence. 
                                            It communicates with Redis for caching and Postgres for storage via a strict repository pattern.
                                        </div>
                                    )}
                                    {archNode === 'nginx' && (
                                        <div className="text-white-50 small">
                                            The gatekeeper. Handles SSL termination (LetsEncrypt), Rate Limiting, and serves static assets.
                                            It hides the internal network topology from the public internet.
                                        </div>
                                    )}
                                    {archNode === 'client' && (
                                        <div className="text-white-50 small">
                                            Server-Side Rendered (SSR) React application. It fetches data from the API via a secure HTTP-Only cookie session.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- 5. LIVE METRICS --- */}
                        {evidenceSubTab === 'monitoring' && (
                            <div className="p-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="text-white fw-bold m-0">Real-Time Traffic (Requests/sec)</h5>
                                    <button 
                                        className={`btn btn-sm ${isUnderLoad ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={() => setIsUnderLoad(!isUnderLoad)}
                                    >
                                        {isUnderLoad ? 'Stop Simulation' : 'Trigger DDoS Attack'}
                                    </button>
                                </div>
                                
                                <div className="w-100 bg-dark border border-secondary rounded p-4 position-relative" style={{height: '300px'}}>
                                    {/* SVG Chart for Traffic */}
                                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        {/* Blue Path (Traffic) */}
                                        <path 
                                            d={`M 0 100 ${trafficData.map((val, i) => `L ${i * 10} ${100 - val}`).join(' ')} L 100 100 Z`} 
                                            fill="rgba(13, 110, 253, 0.2)" 
                                            stroke="#0d6efd" 
                                            strokeWidth="2"
                                        />
                                        {/* Red Path (Errors - only visible under load) */}
                                        {isUnderLoad && (
                                            <path 
                                                d={`M 0 100 ${errorData.map((val, i) => `L ${i * 10} ${100 - val}`).join(' ')} L 100 100 Z`} 
                                                fill="rgba(220, 53, 69, 0.4)" 
                                                stroke="#dc3545" 
                                                strokeWidth="2"
                                            />
                                        )}
                                    </svg>
                                </div>
                                <div className="mt-3 d-flex justify-content-between text-muted small font-monospace">
                                    <span>00:00</span>
                                    <span>Current Load: {isUnderLoad ? 'CRITICAL (800 req/s)' : 'NORMAL (25 req/s)'}</span>
                                    <span>00:10</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* ==================== TAB 3: SYSTEM INTERNALS ==================== */}
        {activeTab === 'internals' && (
            <div className="animate-fade-in">
                {/* [FIX] Restored 4-Box Expanded Layout */}
                <div className="row g-4">
                    {/* Lifecycle */}
                    <div className="col-lg-6 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-white" style={cardHeaderStyle}>
                                <IconActivity className="me-2 text-warning"/> Request Lifecycle
                            </div>
                            <div className="card-body">
                                <p className="text-muted small mb-4">How a single request travels through the system securely.</p>
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center p-2 rounded bg-dark border border-secondary">
                                        <span className="badge bg-secondary me-3">1</span>
                                        <small>User Request hits <strong>Nginx</strong> (SSL Termination & Buffering)</small>
                                    </div>
                                    <div className="d-flex align-items-center p-2 rounded bg-dark border border-secondary">
                                        <span className="badge bg-secondary me-3">2</span>
                                        <small>Forwarded to <strong>Docker Swarm</strong> (Internal Network)</small>
                                    </div>
                                    {/* UPDATED: Added WAF/Honeypot Step */}
                                    <div className="d-flex align-items-center p-2 rounded bg-dark border border-danger bg-opacity-10">
                                        <span className="badge bg-danger me-3">3</span>
                                        <small><strong>WAF & Honeypot:</strong> Middleware scans for SQLi, XSS, and Bot Signatures.</small>
                                    </div>
                                    <div className="d-flex align-items-center p-2 rounded bg-dark border border-secondary">
                                        <span className="badge bg-primary me-3">4</span>
                                        <small><strong>Rate Limiter:</strong> Redis checks IP request velocity (Throttling).</small>
                                    </div>
                                    <div className="d-flex align-items-center p-2 rounded bg-dark border border-secondary">
                                        <span className="badge bg-primary me-3">5</span>
                                        <small><strong>Auth Guard:</strong> Validates HttpOnly Cookie vs Redis Session.</small>
                                    </div>
                                    <div className="d-flex align-items-center p-2 rounded bg-dark border border-secondary">
                                        <span className="badge bg-success me-3">6</span>
                                        <small><strong>Controller:</strong> Executes Business Logic (Service Layer).</small>
                                    </div>
                                    <div className="d-flex align-items-center p-2 rounded bg-dark border border-secondary">
                                        <span className="badge bg-warning text-dark me-3">7</span>
                                        <small><strong>Interceptor:</strong> Sanitizes Response & Logs Audit Trail.</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Event Bus */}
                    <div className="col-lg-6 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-white" style={cardHeaderStyle}>
                                <IconNetwork className="me-2 text-info"/> Event Bus Architecture
                            </div>
                            <div className="card-body">
                                <p className="text-muted small mb-4">Decoupled logic using EventEmitter2 and WebSockets.</p>
                                <div className="p-3 bg-dark rounded border border-secondary mb-3">
                                    <h6 className="text-white small fw-bold">Example: "New Ticket Created"</h6>
                                    <hr className="border-secondary my-2"/>
                                    <div className="small text-muted" style={{fontFamily: 'monospace'}}>
                                        <span className="text-success">Event Emitted:</span> 'ticket.created'<br/>
                                        &nbsp;&nbsp;├─ <span className="text-info">Listener 1:</span> Index to ElasticSearch (Sync)<br/>
                                        &nbsp;&nbsp;├─ <span className="text-info">Listener 2:</span> Broadcast via Socket.io (UI Update)<br/>
                                        &nbsp;&nbsp;├─ <span className="text-info">Listener 3:</span> Send Webhook to n8n (AI Analysis)<br/>
                                        &nbsp;&nbsp;└─ <span className="text-info">Listener 4:</span> Trigger Email Notification<br/>
                                    </div>
                                </div>
                                <div className="alert alert-dark border border-secondary small m-0">
                                    <strong>Benefit:</strong> The API responds instantly (50ms) while heavy tasks (AI, Email) process in the background via BullMQ.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Persistence */}
                    <div className="col-lg-6 mb-4">
                        <div className="card shadow-sm h-100" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-white" style={cardHeaderStyle}>
                                <IconStack2 className="me-2 text-primary"/> Deep Dive: Data Persistence Strategies
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <h6 className="text-white fw-bold">ACID Compliance</h6>
                                    <p className="small text-muted">Using <code>prisma.$transaction</code> to ensure critical operations (like Order Creation + Stock Deduction) either fully succeed or fully fail.</p>
                                </div>
                                <div className="mb-3">
                                    <h6 className="text-white fw-bold">Cache Invalidation</h6>
                                    <p className="small text-muted">Redis keys are automatically invalidated via Interceptors when a `POST/PUT/DELETE` action occurs on a related resource.</p>
                                </div>
                                <div>
                                    <h6 className="text-white fw-bold">Soft Deletes</h6>
                                    <p className="small text-muted">Records are rarely deleted. A middleware intercepts `delete` calls and updates `deletedAt` timestamps instead.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zero Trust Network (Restored) */}
                    <div className="col-lg-6 mb-4">
                        <div className="card h-100 shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-white" style={cardHeaderStyle}>
                                <IconAccessPoint className="me-2 text-success"/> Zero-Trust Network
                            </div>
                            <div className="card-body">
                                <p className="text-muted small mb-3">
                                    Containers are isolated by default. Communication only happens over specific encrypted channels.
                                </p>
                                <ul className="list-unstyled small text-secondary">
                                    <li className="mb-2"><IconCheck size={14} className="text-success me-2"/> <strong>Internal Only:</strong> Database & Redis have NO public IP addresses.</li>
                                    <li className="mb-2"><IconCheck size={14} className="text-success me-2"/> <strong>Bridge Network:</strong> API talks to DB via internal Docker DNS resolution (`postgres-db:5432`).</li>
                                    <li className="mb-2"><IconCheck size={14} className="text-success me-2"/> <strong>Reverse Proxy:</strong> Nginx is the *only* entry point (Port 80/443).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ==================== TAB 4: DIAGNOSTICS & OPS ==================== */}
        {activeTab === 'diagnostics' && (
            <div className="animate-fade-in">
                 <div className="row g-4">
                    <div className="col-12">
                        <div className="card shadow-sm" style={cardStyle}>
                            <div className="card-header fw-bold py-3 text-white" style={cardHeaderStyle}>
                                <IconTerminal className="me-2 text-danger"/> Operations Manual: Battle-Hardened Solutions
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconAlertTriangle size={18} className="text-warning me-2"/>413 Payload Too Large</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> User uploads failed on large images. Nginx default is 1MB.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Nginx `client_max_body_size` default limit.</p>
                                            <div style={codeStyle}>client_max_body_size 50M;</div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconLockAccess size={18} className="text-danger me-2"/>CORS Credentials Failure</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Cookies were blocked because wildcard origin (*) is not allowed with credentials.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Browser Security Policy for `Access-Control-Allow-Credentials`.</p>
                                            <div style={codeStyle}>origin: 'https://pixelforgedeveloper.com', credentials: true</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconNetwork size={18} className="text-info me-2"/>Docker DNS Resolution</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> API container couldn't find 'postgres' host during startup race conditions.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Backend started before DB network alias was ready.</p>
                                            <div style={codeStyle}>depends_on: - postgres_db</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconDatabase size={18} className="text-primary me-2"/>Postgres Connection Limits</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Prisma exhausted the pool under load testing.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Default pool size (5) is too small for 100+ concurrent reqs.</p>
                                            <div style={codeStyle}>connection_limit=20&pool_timeout=10</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconCertificate size={18} className="text-success me-2"/>SSL Handshake (Certbot)</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Let's Encrypt challenge failed due to firewall blocking port 80.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> UFW rules too strict during initial setup.</p>
                                            <div style={codeStyle}>sudo ufw allow 80/tcp</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconFolder size={18} className="text-warning me-2"/>Volume Permissions</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Node container couldn't write uploaded images to the mounted volume.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Host user UID (1000) mismatch with Container Node User.</p>
                                            <div style={codeStyle}>chown -R 1000:1000 /usr/src/app/uploads</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconKey size={18} className="text-danger me-2"/>JWT Secret Consistency</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Tokens invalidating on server restart due to generated secrets.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Using `randomBytes` instead of persistent ENV var.</p>
                                            <div style={codeStyle}>JWT_SECRET="fixed_complex_string"</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconFileAlert size={18} className="text-info me-2"/>Next.js Hydration Mismatch</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Client rendered different HTML than Server (Timezones/Dates).</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Server Time vs Browser Time variance.</p>
                                            <div style={codeStyle}>suppressHydrationWarning=&#123;true&#125;</div>
                                        </div>
                                    </div>

                                    {/* NEW DIAGNOSTICS */}
                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconServer size={18} className="text-warning me-2"/>Redis ECONNREFUSED</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Container started before Redis was ready to accept TCP connections.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Redis startup latency vs Node fast boot.</p>
                                            <div style={codeStyle}>retryStrategy: (times) ={'>'} Math.min(times * 50, 2000)</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconBrowserCheck size={18} className="text-info me-2"/>Nginx Header Buffer Overflow</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> 502 Bad Gateway when sending large JWT cookies.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Cookie size exceeded default 4k header buffer.</p>
                                            <div style={codeStyle}>proxy_buffer_size 128k; proxy_buffers 4 256k;</div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconBolt size={18} className="text-danger me-2"/>ElasticSearch Heap Error</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> ES container crashed with OOM Killed code 137.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Default Java Heap allocation (1GB) too high for VPS.</p>
                                            <div style={codeStyle}>ES_JAVA_OPTS="-Xms512m -Xmx512m"</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconServer size={18} className="text-warning me-2"/>Zombie Processes (PID 1)</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Node process not responding to SIGTERM signals.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Node.js as PID 1 doesn't handle kernel signals correctly.</p>
                                            <div style={codeStyle}>init: true # Added to docker-compose.yml</div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconRefresh size={18} className="text-primary me-2"/>TypeORM Circular Dependency</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> "Module X cannot import Module Y" error at runtime.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Tight coupling between User and Profile entities.</p>
                                            <div style={codeStyle}>forwardRef(() ={'>'} UserModule)</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="p-3 bg-dark border border-secondary rounded h-100">
                                            <h6 className="text-white fw-bold d-flex align-items-center"><IconNetwork size={18} className="text-success me-2"/>Socket.io Sticky Sessions</h6>
                                            <p className="small text-muted mb-2"><strong>Issue:</strong> Handshake failed when scaling to multiple nodes.</p>
                                            <p className="small text-info mb-2"><strong>Root Cause:</strong> Polling transport requires client to hit same pod.</p>
                                            <div style={codeStyle}>upstream backend &#123; ip_hash; server ... &#125;</div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 mt-2">
                                        <h6 className="text-white fw-bold"><IconBolt className="me-2 text-warning"/>Performance Tuning</h6>
                                        <p className="small text-muted">Optimizations applied to handle concurrent users:</p>
                                        <ul className="small text-muted list-inline">
                                            <li className="list-inline-item">• Increased Node `uv_threadpool_size` to 128.</li>
                                            <li className="list-inline-item">• Configured Redis generic connection pool to avoid blocking.</li>
                                            <li className="list-inline-item">• Implemented `compression` middleware for Gzip responses.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        )}

        {/* ==================== TAB 5: DEMO ==================== */}
        {activeTab === 'demo' && (
            <div className="animate-fade-in">
                <div className="row g-4 justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-lg border-secondary" style={{ ...cardStyle, backgroundColor: '#15171a' }}>
                            <div className="card-header p-4 text-center" style={{ backgroundColor: '#25282c', borderBottom: '1px solid #2c3237' }}>
                                <IconRocket size={50} className="mb-3 text-success"/>
                                <h3 className="fw-bold m-0 text-white">Live Enterprise Admin Demo</h3>
                            </div>
                            <div className="card-body p-5">
                                <div className="alert alert-warning border-0 d-flex align-items-center mb-4" style={{ backgroundColor: '#e0a800', color: '#000' }}>
                                    <IconLockAccess size={32} className="me-3 flex-shrink-0"/>
                                    <div>
                                        <strong>Security Sandbox Active:</strong><br/>
                                        This demo runs on a "Holographic Interceptor". You will see <strong>Fake/Mock Data</strong> 
                                        generated in real-time. The real production database is physically air-gapped from this user.
                                    </div>
                                </div>

                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <label className="text-secondary small fw-bold text-uppercase">URL</label>
                                        <div className="p-3 rounded border border-secondary mt-1 bg-dark">
                                            <a href="https://staff.pixelforgedeveloper.com" target="_blank" className="text-decoration-none fw-bold text-white">
                                                staff.pixelforgedeveloper.com
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-secondary small fw-bold text-uppercase">Role</label>
                                        <div className="p-3 rounded border border-secondary mt-1 bg-dark text-info">
                                            Demo Viewer (Read Only)
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-secondary small fw-bold text-uppercase">Email</label>
                                        <div className="p-3 rounded border border-secondary mt-1 bg-dark text-primary user-select-all font-monospace">
                                            demo@pixelforgedeveloper.com
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-secondary small fw-bold text-uppercase">Password</label>
                                        <div className="p-3 rounded border border-secondary mt-1 bg-dark text-danger user-select-all font-monospace">
                                            DemoViewer0!?
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-5">
                                    <a href="https://staff.pixelforgedeveloper.com" target="_blank" className="btn btn-success btn-lg px-5 py-3 rounded-pill shadow hover-scale fw-bold fs-5">
                                        <IconExternalLink size={24} className="me-2"/> LAUNCH LIVE STAFF PANEL
                                    </a>
                                    <p className="text-muted mt-3 small">Opens in a new secure window</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    
    
      {/* ==================== TAB: SYSTEM DOCS (FULL MIRROR) ==================== */}
        {activeTab === 'sysdocs' && (
            <div className="animate-fade-in p-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-white"><IconBook className="text-primary mb-2" size={40}/> System Documentation</h2>
                    <p className="text-white-50">Public release of internal engineering protocols.</p>
                </div>

                {/* --- INNER TAB NAVIGATION --- */}
                <div className="d-flex flex-wrap gap-2 justify-content-center mb-5 border-bottom border-secondary pb-4">
                    <button onClick={() => setSysDocTab('overview')} className={`btn btn-sm rounded-pill ${sysDocTab === 'overview' ? 'btn-light text-dark fw-bold' : 'btn-outline-secondary text-light'}`}><IconServer size={14} className="me-1"/> Architecture</button>
                    <button onClick={() => setSysDocTab('security')} className={`btn btn-sm rounded-pill ${sysDocTab === 'security' ? 'btn-danger fw-bold' : 'btn-outline-secondary text-light'}`}><IconShieldLock size={14} className="me-1"/> Security & GRC</button>
                    <button onClick={() => setSysDocTab('user_intel')} className={`btn btn-sm rounded-pill ${sysDocTab === 'user_intel' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}><IconSpy size={14} className="me-1"/> User Intel</button>
                    <button onClick={() => setSysDocTab('seo')} className={`btn btn-sm rounded-pill ${sysDocTab === 'seo' ? 'btn-success fw-bold' : 'btn-outline-secondary text-light'}`}><IconWorld size={14} className="me-1"/> SEO</button>
                    <button onClick={() => setSysDocTab('backup')} className={`btn btn-sm rounded-pill ${sysDocTab === 'backup' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-light'}`}><IconCloudUpload size={14} className="me-1"/> Backups</button>
                    <button onClick={() => setSysDocTab('backend')} className={`btn btn-sm rounded-pill ${sysDocTab === 'backend' ? 'btn-light text-dark fw-bold' : 'btn-outline-secondary text-light'}`}><IconApi size={14} className="me-1"/> API & Cron</button>
                    <button onClick={() => setSysDocTab('database')} className={`btn btn-sm rounded-pill ${sysDocTab === 'database' ? 'btn-light text-dark fw-bold' : 'btn-outline-secondary text-light'}`}><IconDatabase size={14} className="me-1"/> Database</button>
                    <button onClick={() => setSysDocTab('modules')} className={`btn btn-sm rounded-pill ${sysDocTab === 'modules' ? 'btn-light text-dark fw-bold' : 'btn-outline-secondary text-light'}`}><IconFolder size={14} className="me-1"/> Modules</button>
                    <button onClick={() => setSysDocTab('ai')} className={`btn btn-sm rounded-pill ${sysDocTab === 'ai' ? 'btn-primary fw-bold' : 'btn-outline-secondary text-light'}`} style={{backgroundColor: sysDocTab === 'ai' ? '#6f42c1' : '', borderColor: sysDocTab === 'ai' ? '#6f42c1' : ''}}><IconRobot size={14} className="me-1"/> PixelMind AI</button>
                    <button onClick={() => setSysDocTab('dev')} className={`btn btn-sm rounded-pill ${sysDocTab === 'dev' ? 'btn-light text-dark fw-bold' : 'btn-outline-secondary text-light'}`}><IconBrandDocker size={14} className="me-1"/> DevOps</button>
                </div>

                {/* --- CONTENT PANELS --- */}
                
                {/* 1. ARCHITECTURE */}
                {sysDocTab === 'overview' && (
                    <div className="animate-fade-in">
                        <div className="alert alert-primary bg-opacity-10 border-primary text-white d-flex align-items-center mb-4">
                             <IconBrandDocker className="me-3 fs-4"/>
                             <div><strong>Containerized Environment:</strong> System is running on Docker Swarm/Compose. All services are isolated and resource-capped.</div>
                        </div>
                        <div className="row g-4">
                            {DOCS.architecture.map((item, i) => (
                                <div key={i} className="col-md-6">
                                    <div className="card h-100 shadow-sm" style={cardStyle}>
                                        <div className="card-body">
                                            <h5 className="fw-bold text-white mb-2">{item.title}</h5>
                                            <p className="text-muted small mb-3">{item.desc}</p>
                                            <ul className="list-unstyled small text-secondary m-0">
                                                {item.details.map((d, k) => (
                                                    <li key={k} className="mb-1 d-flex align-items-start"><span className="text-secondary me-2">•</span>{d}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. SECURITY */}
                {sysDocTab === 'security' && (
                    <div className="animate-fade-in">
                        <div className="alert alert-danger bg-opacity-10 border-danger text-white d-flex align-items-center mb-4">
                             <IconShieldLock className="me-3 fs-4"/>
                             <div><strong>Enterprise Security Master Plan:</strong> This system implements a comprehensive Defense-in-Depth strategy covering GRC, Identity, Infrastructure, and Application Security.</div>
                        </div>
                        <div className="row g-4">
                            {DOCS.security_master.map((sec, i) => (
                                <div key={i} className="col-md-6">
                                    <div className="card h-100 shadow-sm" style={cardStyle}>
                                        <div className="card-header fw-bold text-danger border-bottom border-secondary bg-dark bg-opacity-50">
                                            {sec.category}
                                        </div>
                                        <div className="card-body">
                                            <ul className="list-unstyled small text-secondary m-0">
                                                {sec.items.map((item, k) => (
                                                    <li key={k} className="mb-2 d-flex align-items-start"><IconLock size={14} className="text-danger me-2 mt-1 flex-shrink-0"/>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. USER INTEL */}
                {sysDocTab === 'user_intel' && (
                    <div className="animate-fade-in">
                        <div className="alert alert-warning bg-opacity-10 border-warning text-white d-flex align-items-center mb-4">
                             <IconSpy className="me-3 fs-4 text-warning"/>
                             <div><strong>Customer 360 Engine:</strong> The User Intelligence module aggregates data from disparate sources to create a unified profile for every interaction.</div>
                        </div>
                        <div className="row g-4 mb-4">
                            {DOCS.user_intel.map((feat, i) => (
                                <div key={i} className="col-md-6">
                                    <div className="card h-100 shadow-sm" style={cardStyle}>
                                        <div className="card-body">
                                            <h6 className="fw-bold text-warning mb-2">{feat.title}</h6>
                                            <p className="text-white-50 small mb-2">{feat.desc}</p>
                                            <span className="badge bg-secondary text-light">{feat.tech}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-dark border border-secondary rounded">
                            <h6 className="text-white fw-bold mb-3">Enrichment Pipeline Visualization</h6>
                            <pre className="text-info m-0 small" style={{fontFamily: 'monospace'}}>
{`1. User Signup / Ticket Created
   │
   ▼
2. 'user.created' Event Emitted
   │
   ▼
3. UserIntelligenceService
   ├── Query Clearbit/Gravatar (Enrichment)
   ├── Check IP Reputation (Security)
   └── Initialize PostHog Profile (Tracking)
   │
   ▼
4. Database Updated (Golden Record)`}
                            </pre>
                        </div>
                    </div>
                )}

                {/* 4. SEO */}
                {sysDocTab === 'seo' && (
                    <div className="animate-fade-in">
                        <div className="alert alert-success bg-opacity-10 border-success text-white d-flex align-items-center mb-4">
                             <IconWorld className="me-3 fs-4 text-success"/>
                             <div><strong>Discovery Engine Operational:</strong> The Storefront is equipped with a Server-Side SEO Engine. Titles and Meta Tags are dynamically injected.</div>
                        </div>
                        <div className="row g-4 mb-4">
                            {DOCS.seo.map((feat, i) => (
                                <div key={i} className="col-md-6">
                                    <div className="card h-100 shadow-sm" style={cardStyle}>
                                        <div className="card-body">
                                            <h6 className="fw-bold text-success mb-3">{feat.title}</h6>
                                            <div className="d-flex justify-content-between small mb-1 border-bottom border-secondary pb-1">
                                                <span className="text-muted fw-bold">TRIGGER</span>
                                                <span className="text-white">{feat.trigger}</span>
                                            </div>
                                            <div className="d-flex justify-content-between small mb-1 border-bottom border-secondary pb-1">
                                                <span className="text-muted fw-bold">ACTION</span>
                                                <span className="text-white text-end" style={{maxWidth:'60%'}}>{feat.action}</span>
                                            </div>
                                            <div className="d-flex justify-content-between small pt-1">
                                                <span className="text-muted fw-bold">OUTPUT</span>
                                                <span className="text-success">{feat.output}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h6 className="text-white fw-bold mt-4 mb-3">Robots Configuration</h6>
                        <div className="p-3 bg-black border border-secondary rounded font-monospace text-white small">
                            User-agent: *<br/>
                            Allow: /<br/>
                            Disallow: /account/<br/>
                            Disallow: /checkout/<br/>
                            Disallow: /auth/<br/><br/>
                            Sitemap: https://pixelforgedeveloper.com/sitemap.xml
                        </div>
                    </div>
                )}

                {/* 5. BACKUP */}
                {sysDocTab === 'backup' && (
                    <div className="animate-fade-in">
                        <div className="alert alert-info bg-opacity-10 border-info text-white d-flex align-items-center mb-4">
                             <IconCloudUpload className="me-3 fs-4 text-info"/>
                             <div><strong>Zero-Knowledge Security:</strong> Backups are encrypted using GPG before leaving the server. Cloudflare R2 only sees encrypted blobs.</div>
                        </div>
                        <div className="card shadow-sm" style={cardStyle}>
                            <div className="table-responsive">
                                <table className="table table-dark table-bordered m-0 small">
                                    <tbody>
                                        {DOCS.backup.map((b, i) => (
                                            <tr key={i}>
                                                <td className="fw-bold bg-dark text-white text-uppercase" style={{width: '200px'}}>{b.key}</td>
                                                <td className="text-white-50">{b.val}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. API & CRON */}
                {sysDocTab === 'backend' && (
                    <div className="animate-fade-in">
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="d-flex align-items-center mb-3 text-white"><IconClock className="me-2"/> <h5 className="m-0 fw-bold">Cron Automation</h5></div>
                                <div className="card shadow-sm" style={cardStyle}>
                                    <ul className="list-group list-group-flush bg-transparent">
                                        {DOCS.cron.map((job, i) => (
                                            <li key={i} className="list-group-item bg-transparent border-secondary text-white d-flex justify-content-between align-items-center">
                                                <div>
                                                    <div className="fw-bold small">{job.id}</div>
                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>{job.desc}</div>
                                                </div>
                                                <span className="badge bg-secondary font-monospace">{job.time}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="d-flex align-items-center mb-3 text-white"><IconApi className="me-2"/> <h5 className="m-0 fw-bold">Key API Endpoints</h5></div>
                                <div className="d-flex flex-column gap-2">
                                    {DOCS.endpoints.map((ep, i) => (
                                        <div key={i} className="p-2 border border-secondary rounded bg-dark d-flex align-items-center">
                                            <span className={`badge me-2 ${ep.method === 'POST' ? 'bg-warning text-dark' : 'bg-primary'}`}>{ep.method}</span>
                                            <code className="text-info me-2 small">{ep.url}</code>
                                            <span className="text-muted small ms-auto">{ep.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. DATABASE */}
                {sysDocTab === 'database' && (
                    <div className="animate-fade-in">
                         <h5 className="text-white fw-bold mb-2">Core Models (Prisma Schema)</h5>
                         <p className="text-muted small mb-4">Located in `backend-api/prisma/schema.prisma`</p>
                         <div className="card shadow-sm" style={cardStyle}>
                            <div className="table-responsive">
                                <table className="table table-dark table-bordered table-hover m-0 small">
                                    <thead>
                                        <tr>
                                            <th className="text-white">Model</th>
                                            <th className="text-white">Description</th>
                                            <th className="text-white">Key Fields</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {DOCS.database.map((db, i) => (
                                            <tr key={i}>
                                                <td className="fw-bold text-info">{db.model}</td>
                                                <td className="text-white-50">{db.desc}</td>
                                                <td><code className="text-warning">{db.fields}</code></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8. MODULES */}
                {sysDocTab === 'modules' && (
                    <div className="animate-fade-in">
                        <div className="d-flex flex-column gap-3">
                            {DOCS.modules.map((mod) => (
                                <div key={mod.id} className="card shadow-sm border-secondary bg-dark">
                                    <div className="card-header bg-dark border-bottom border-secondary text-white fw-bold d-flex align-items-center">
                                        {mod.icon} <span className="ms-2">{mod.label}</span>
                                    </div>
                                    <div className="card-body">
                                        {mod.content.map((item, k) => (
                                            <div key={k} className={`mb-2 ${k < mod.content.length - 1 ? 'border-bottom border-secondary pb-2' : ''}`}>
                                                <div className="d-flex align-items-center mb-1">
                                                    <span className="badge bg-primary rounded-circle p-1 me-2" style={{width:'18px',height:'18px',fontSize:'10px'}}>?</span>
                                                    <span className="fw-bold text-white small">{item.q}</span>
                                                </div>
                                                <div className="text-muted small ps-4">{item.a}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 9. PIXELMIND AI */}
                {sysDocTab === 'ai' && (
                    <div className="animate-fade-in">
                        <div className="alert alert-primary bg-opacity-10 border-primary text-white d-flex align-items-center mb-4" style={{borderColor: '#6f42c1'}}>
                             <IconRobot className="me-3 fs-4" style={{color: '#a578ff'}}/>
                             <div><strong>PixelMind Integration:</strong> The AI module is an event-driven service (`AiService`). It acts autonomously based on system triggers.</div>
                        </div>
                        <div className="row g-4 mb-4">
                            {DOCS.ai.map((feat, i) => (
                                <div key={i} className="col-md-6">
                                    <div className="card h-100 shadow-sm" style={cardStyle}>
                                        <div className="card-body">
                                            <h6 className="fw-bold text-white mb-3" style={{color: '#a578ff'}}>{feat.title}</h6>
                                            <div className="d-flex justify-content-between small mb-1 border-bottom border-secondary pb-1">
                                                <span className="text-muted fw-bold">TRIGGER</span>
                                                <span className="text-white">{feat.trigger}</span>
                                            </div>
                                            <div className="d-flex justify-content-between small mb-1 border-bottom border-secondary pb-1">
                                                <span className="text-muted fw-bold">ACTION</span>
                                                <span className="text-white text-end" style={{maxWidth:'60%'}}>{feat.action}</span>
                                            </div>
                                            <div className="d-flex justify-content-between small pt-1">
                                                <span className="text-muted fw-bold">OUTPUT</span>
                                                <span className="text-success">{feat.output}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h6 className="text-white fw-bold mt-4 mb-3">Workflow Visualization</h6>
                        <div className="p-4 bg-black border border-secondary rounded">
                            <pre className="text-info m-0 small" style={{fontFamily: 'monospace'}}>
{`1. User sends message ("How do I return an item?")
   │
   ▼
2. Gateway emits 'ticket.message.created'
   │
   ▼
3. AI Service intercepts event
   │
   ▼
4. Security Gateway scans text -> "How do I return..." (Redacts PII)
   │
   ▼
5. OpenAI API called (GPT-4o)
   │
   ▼
6. Draft Generated & Saved as Internal Note
   │
   ▼
7. Staff Dashboard updates in real-time via Socket.io`}
                            </pre>
                        </div>
                    </div>
                )}

                {/* 10. DEVOPS */}
                {sysDocTab === 'dev' && (
                    <div className="animate-fade-in">
                        <div className="d-flex flex-column gap-3">
                            {DOCS.dev.map((section, i) => (
                                <div key={i} className="card shadow-sm border-secondary bg-dark">
                                    <div className="card-header bg-dark border-bottom border-secondary text-white fw-bold d-flex align-items-center">
                                        <IconTerminal className="me-2"/> {section.section}
                                    </div>
                                    <div className="card-body">
                                        <p className="text-muted small m-0">{section.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        )}

      </div>
    </div>

     {/* --- RESUME MODAL (FIXED SCROLL & HEIGHT - 3 PAGES) --- */}
      {showResume && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 2147483647, backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            {/* Modal Container: Flex Column, Max Height 90vh */}
            <div className="bg-dark border border-secondary rounded shadow-lg overflow-hidden position-relative" style={{width: '90%', maxWidth: '1000px', height: '90vh', display: 'flex', flexDirection: 'column'}}>
                
                {/* 1. Modal Header (Fixed Height) */}
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary bg-black" style={{flexShrink: 0}}>
                    <h5 className="m-0 text-white fw-bold d-flex align-items-center">
                        <IconFileText className="me-2 text-primary"/> Resume Preview
                    </h5>
                    
                    <div className="d-flex gap-2 align-items-center">
                        {/* MODE TOGGLES */}
                        <div className="btn-group btn-group-sm me-3 border border-secondary rounded">
                            <button onClick={() => setViewMode('pdf')} className={`btn ${viewMode === 'pdf' ? 'btn-secondary' : 'btn-dark'}`} title="PDF View"><IconFileTypePdf size={16}/></button>
                            <button onClick={() => setViewMode('image')} className={`btn ${viewMode === 'image' ? 'btn-secondary' : 'btn-dark'}`} title="Image View"><IconPhoto size={16}/></button>
                        </div>

                        {viewMode === 'image' && (
                            <div className="btn-group btn-group-sm me-2">
                                <button onClick={handleZoomOut} className="btn btn-outline-secondary" title="Zoom Out"><IconZoomOut size={16}/></button>
                                <button onClick={handleZoomIn} className="btn btn-outline-secondary" title="Zoom In"><IconZoomIn size={16}/></button>
                            </div>
                        )}

                        <a href={resumePdfPath} download className="btn btn-sm btn-primary d-flex align-items-center">
                            <IconDownload size={16} className="me-1"/> PDF
                        </a>
                        <button onClick={() => setShowResume(false)} className="btn btn-sm btn-outline-danger d-flex align-items-center">
                            <IconX size={20}/>
                        </button>
                    </div>
                </div>

                {/* 2. Modal Body (Scrollable) */}
                <div id="resume-modal-body" className="flex-grow-1 bg-secondary position-relative overflow-auto p-4 text-center d-flex flex-column align-items-center" style={{ backgroundColor: '#2c2f33', flex: 1 }}>
                    
                    {viewMode === 'pdf' && (
                        <div style={{ width: '100%', height: '100%', flex: 1, minHeight: '100%' }}>
                            <iframe 
                                src={googleViewerUrl} 
                                style={{width: '100%', height: '100%', border: 'none'}}
                                title="Secure PDF Viewer"
                            />
                        </div>
                    )}

                    {viewMode === 'image' && (
                        <div id="resume-scroll-container" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                            <div style={{ 
                                width: `${zoomLevel * 100}%`, 
                                transition: 'width 0.2s ease-out',
                                maxWidth: '1200px', 
                                margin: '0 auto'
                            }}>
                                <img 
                                    src={getCurrentPageImage()} 
                                    alt={`Resume Page ${currentPage}`}
                                    className="shadow-lg mb-3"
                                    style={{ width: '100%', height: 'auto', border: '1px solid #444' }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        setViewMode('pdf');
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Modal Footer (Pagination for Images) */}
                {viewMode === 'image' && (
                    <div className="bg-black border-top border-secondary p-3 d-flex justify-content-center align-items-center gap-3" style={{flexShrink: 0, zIndex: 10}}>
                        <button 
                            className="btn btn-sm btn-outline-light d-flex align-items-center" 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1}
                        >
                            <IconArrowLeft size={16} className="me-1"/> Prev
                        </button>
                        <span className="text-white small fw-bold">Page {currentPage} of {totalPages}</span>
                        <button 
                            className="btn btn-sm btn-outline-light d-flex align-items-center" 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages}
                        >
                            Next <IconArrowRight size={16} className="ms-1"/>
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
}