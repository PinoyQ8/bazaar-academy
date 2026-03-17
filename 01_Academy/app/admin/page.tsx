'use client';

// STRIPPED CORE: NO IMPORTS, NO EXTERNAL CSS
export default function BazaarAdminTerminal() {
  return (
    <div style={{
      backgroundColor: 'black',
      color: '#00ff00',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      margin: 0,
      padding: 0
    }}>
      <div style={{ border: '1px solid #333', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ letterSpacing: '0.5em', color: 'white' }}>BAZAAR_OS</h1>
        <p style={{ color: '#0891b2' }}>NODE: X570-TAICHI // EMERGENCY SIGNAL</p>
        <hr style={{ borderColor: '#222', margin: '20px 0' }} />
        <p>IF YOU CAN SEE THIS, THE CLOUD CIRCUIT IS ACTIVE.</p>
        <p style={{ fontSize: '10px', color: '#444' }}>STATUS: BYPASSING TAILWIND & HYDRATION</p>
      </div>
    </div>
  );
}