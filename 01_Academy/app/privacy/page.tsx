"use client";

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', padding: '2rem', color: '#eab308', fontFamily: 'monospace', lineHeight: '1.6' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #374151', padding: '2rem', borderRadius: '0.5rem' }}>
        <h1 style={{ borderBottom: '1px solid #ca8a04', paddingBottom: '1rem', textTransform: 'uppercase' }}>Privacy Policy: Bazaar Academy</h1>
        <p style={{ marginTop: '1.5rem', color: '#9ca3af' }}>Effective Date: March 21, 2026</p>
        
        <h3 style={{ color: 'white', marginTop: '2rem' }}>1. DATA MINIMIZATION</h3>
        <p>Bazaar Academy follows the MESH Protocol: we only collect your Pi Network Username and UID via the official SDK. This is used exclusively to authenticate your progress in the 10-UID Validation Sprint.</p>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>2. ZERO LEAK POLICY</h3>
        <p>Project Bazaar does not sell, trade, or share Pioneer data with third-party advertisers. Your digital identity remains within the decentralized DAO environment.</p>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>3. TRANSACTION LOGGING</h3>
        <p>Transaction metadata (TXID, amount, and timestamp) is recorded on the Pi Testnet/Mainnet blockchain to verify node-level handshakes. This data is public on the ledger but shielded within our internal Adjudicator logic.</p>

        <div style={{ marginTop: '3rem', borderTop: '1px solid #374151', paddingTop: '1rem', fontSize: '0.8rem', opacity: 0.5 }}>
          STATUS: PRIVACY MESH ACTIVE | SECURED BY PROJECT BAZAAR
        </div>
      </div>
    </div>
  );
}