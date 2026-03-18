'use client';

import React, { useState } from 'react';

// STRIPPED CORE: NO IMPORTS, NO EXTERNAL CSS
export default function BazaarAdminTerminal() {
  // MESH STATE SIMULATION (Running securely in RAM)
  const [treasuryBZR, setTreasuryBZR] = useState(1100);
  const [basePrice, setBasePrice] = useState(15);
  const [isGreenNode, setIsGreenNode] = useState(true);

  // INLINE ESCROW LOGIC (Bypassing external 'lib' for Academy stability)
  const calculateEscrow = () => {
    if (!isGreenNode) {
      return { buyerPays: basePrice, subsidy: 0, log: "DENIED: Red Flag Node. Full retail price enforced." };
    }

    const surplus = treasuryBZR - 1100;
    if (surplus <= 0) {
      return { buyerPays: basePrice, subsidy: 0, log: "STANDBY: Treasury at baseline. 0% Subsidy." };
    }

    // 1% discount per 100 BZR surplus, capped at 20%
    let discount = Math.floor(surplus / 100) * 0.01;
    if (discount > 0.20) discount = 0.20;

    const subsidyAmount = basePrice * discount;
    return {
      buyerPays: parseFloat((basePrice - subsidyAmount).toFixed(2)),
      subsidy: parseFloat(subsidyAmount.toFixed(2)),
      log: `SUCCESS: ${(discount * 100).toFixed(0)}% DAO Subsidy Applied.`
    };
  };

  const route = calculateEscrow();

  return (
    <div style={{
      backgroundColor: 'black',
      color: '#00ff00',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      margin: 0,
      padding: '40px',
      boxSizing: 'border-box'
    }}>
      <div style={{ border: '1px solid #333', padding: '40px', textAlign: 'center', width: '100%', maxWidth: '800px', backgroundColor: '#050505' }}>
        <h1 style={{ letterSpacing: '0.5em', color: 'white', margin: '0 0 10px 0' }}>BAZAAR_OS</h1>
        <p style={{ color: '#0891b2', margin: '0' }}>NODE: X570-TAICHI // EMERGENCY SIGNAL METAMORPHOSIS</p>
        <hr style={{ borderColor: '#222', margin: '20px 0' }} />
        <p style={{ color: '#fff', fontSize: '14px', marginBottom: '30px', fontWeight: 'bold' }}>DEFLATIONARY PRICING PROTOCOL: LIVE SIMULATION</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', textAlign: 'left' }}>
          
          {/* OVERRIDE CONTROLS */}
          <div style={{ border: '1px solid #164e63', padding: '20px', flex: '1', minWidth: '250px' }}>
            <h3 style={{ color: '#0891b2', marginTop: 0, fontSize: '16px' }}>OVERRIDE CONTROLS</h3>
            <div style={{ marginTop: '15px' }}>
              <label style={{ color: '#666', fontSize: '12px' }}>TREASURY TOTAL (BZR):</label><br/>
              <input 
                type="number" 
                value={treasuryBZR} 
                onChange={(e) => setTreasuryBZR(Number(e.target.value))}
                style={{ background: '#000', color: '#00ff00', border: '1px solid #06b6d4', width: '100%', padding: '8px', marginTop: '5px', fontFamily: 'monospace', outline: 'none' }}
              />
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ color: '#666', fontSize: '12px' }}>ASSET BASE PRICE (BZR):</label><br/>
              <input 
                type="number" 
                value={basePrice} 
                onChange={(e) => setBasePrice(Number(e.target.value))}
                style={{ background: '#000', color: '#00ff00', border: '1px solid #06b6d4', width: '100%', padding: '8px', marginTop: '5px', fontFamily: 'monospace', outline: 'none' }}
              />
            </div>
            <div style={{ marginTop: '25px' }}>
              <button 
                onClick={() => setIsGreenNode(!isGreenNode)}
                style={{ 
                  background: isGreenNode ? '#166534' : '#991b1b', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '12px', 
                  width: '100%', 
                  cursor: 'pointer', 
                  fontFamily: 'monospace', 
                  fontWeight: 'bold',
                  letterSpacing: '0.1em'
                }}
              >
                STATUS: {isGreenNode ? '10/10 GREEN NODE' : 'RED FLAG (EXTRACTION)'}
              </button>
            </div>
          </div>

          {/* ESCROW ROUTING */}
          <div style={{ border: '1px solid #164e63', padding: '20px', flex: '1', minWidth: '250px', backgroundColor: 'rgba(8, 145, 178, 0.05)' }}>
            <h3 style={{ color: '#0891b2', marginTop: 0, fontSize: '16px' }}>ESCROW ROUTING</h3>
            <p style={{ color: '#fff', fontSize: '20px', margin: '15px 0' }}><strong>BUYER PAYS:</strong> {route.buyerPays} BZR</p>
            <p style={{ color: '#06b6d4', margin: '10px 0' }}><strong>DAO SUBSIDY:</strong> {route.subsidy} BZR</p>
            <p style={{ color: '#10b981', margin: '10px 0' }}><strong>SELLER RECEIVES:</strong> {basePrice} BZR</p>
            <hr style={{ borderColor: '#164e63', margin: '20px 0' }} />
            <p style={{ fontSize: '12px', color: '#94a3b8', background: '#111', padding: '12px', borderLeft: '3px solid #0891b2', margin: 0 }}>{route.log}</p>
          </div>

        </div>
        
        <p style={{ fontSize: '10px', color: '#444', marginTop: '40px' }}>STATUS: BYPASSING TAILWIND & HYDRATION // MESH LOGIC ACTIVE</p>
      </div>
    </div>
  );
}