"use client";

export default function TermsOfService() {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', padding: '2rem', color: '#eab308', fontFamily: 'monospace', lineHeight: '1.6' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #374151', padding: '2rem', borderRadius: '0.5rem' }}>
        <h1 style={{ borderBottom: '1px solid #ca8a04', paddingBottom: '1rem', textTransform: 'uppercase' }}>Terms of Service: Bazaar Academy</h1>
        
        <h3 style={{ color: 'white', marginTop: '2rem' }}>1. THE ACADEMY MANDATE</h3>
        <p>Usage of this node is restricted to Real Pioneers of the Pi Network. You agree that this is a training environment for the future Bazaar DAO ecosystem.</p>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>2. TESTNET DISCLOSURE</h3>
        <p>All transactions executed within the Academy during the Sandbox phase utilize Test-Pi. These assets have no real-world financial value and are for logic-validation only.</p>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>3. CODE IS LAW</h3>
        <p>By interacting with the Bazaar Adjudicator, you agree to the MESH Protocol. Any attempt to exploit or manipulate the decentralized handshake will result in a node-level blacklist.</p>

        <h3 style={{ color: 'white', marginTop: '2rem' }}>4. EVOLUTION CLAUSE</h3>
        <p>These terms will evolve as Project Bazaar moves from the 10-UID Validation Sprint to the V23 Mainnet deployment.</p>

        <div style={{ marginTop: '3rem', borderTop: '1px solid #374151', paddingTop: '1rem', fontSize: '0.8rem', opacity: 0.5 }}>
          STATUS: TERMS MESH ACTIVE | IN CODE WE TRUST
        </div>
      </div>
    </div>
  );
}