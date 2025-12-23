'use client';

import { useState } from 'react';
import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* --- THE CONSENT BANNER --- */}
      <CookieConsent
        location="bottom"
        buttonText="I Accept"
        enableDeclineButton
        declineButtonText="Required Only"
        cookieName="pixelforge_consent_v1" // 👈 v1 forces it to reappear for testing
        style={{ 
            background: "rgba(26, 27, 30, 0.98)", 
            borderTop: "1px solid #373A40", 
            alignItems: "center", 
            zIndex: 99990, 
            padding: "15px 20px", 
            display: "flex",
            justifyContent: "center", 
            gap: "15px",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.4)"
        }}
        buttonStyle={{ 
            background: "#228BE6", 
            color: "white", 
            fontSize: "14px", 
            fontWeight: "bold", 
            borderRadius: "6px", 
            padding: "10px 30px",
            margin: "0" 
        }}
        declineButtonStyle={{
            background: "transparent",
            border: "1px solid #555",
            color: "#ccc",
            fontSize: "14px",
            borderRadius: "6px",
            padding: "10px 20px",
            margin: "0"
        }}
        contentStyle={{
            flex: "unset",
            margin: "0",
            fontSize: "14px",
            color: "#C1C2C5"
        }}
        expires={150}
      >
        <span>
            🍪 We use cookies to enhance security and analyze traffic. 
        </span>
        <button 
            onClick={() => setShowModal(true)}
            style={{ 
                background: "none", 
                border: "none", 
                color: "#228BE6", 
                textDecoration: "underline", 
                cursor: "pointer", 
                marginLeft: "8px",
                fontSize: "14px" 
            }}
        >
            Learn More
        </button>
      </CookieConsent>

      {/* --- THE INFO MODAL --- */}
      {showModal && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 99999, // Above the banner
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                backgroundColor: '#1A1B1E',
                color: '#fff',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '90%',
                border: '1px solid #373A40',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                fontFamily: 'Inter, sans-serif'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #373A40', paddingBottom: '10px' }}>
                    🛡️ Data Privacy & Cookies
                </h2>
                
                <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                    <h4 style={{ color: '#228BE6', marginBottom: '10px' }}>1. What are cookies?</h4>
                    <p style={{ fontSize: '14px', color: '#C1C2C5', lineHeight: '1.6' }}>
                        Cookies are small text files stored on your device. We use them to keep you logged in and to protect your session from hijackers.
                    </p>

                    <h4 style={{ color: '#228BE6', marginTop: '20px', marginBottom: '10px' }}>2. What we track</h4>
                    <ul style={{ fontSize: '14px', color: '#C1C2C5', lineHeight: '1.6', paddingLeft: '20px' }}>
                        <li><strong>Strictly Necessary:</strong> Auth tokens and security hashes (Iron Dome) required for the site to function.</li>
                        <li><strong>Performance:</strong> Aggregated data on page load speeds to help us improve the platform.</li>
                        <li><strong>Functionality:</strong> Storing your language preferences and shopping cart items.</li>
                    </ul>

                    <h4 style={{ color: '#228BE6', marginTop: '20px', marginBottom: '10px' }}>3. Your Safety</h4>
                    <p style={{ fontSize: '14px', color: '#C1C2C5', lineHeight: '1.6' }}>
                        We <strong>never</strong> sell your personal data. All tracking data is anonymized. Our tracking is strictly compliant with GDPR and CCPA regulations.
                    </p>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                        onClick={() => setShowModal(false)}
                        style={{
                            background: '#228BE6',
                            color: 'white',
                            border: 'none',
                            padding: '10px 25px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}