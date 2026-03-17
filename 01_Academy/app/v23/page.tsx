'use client';

import React from 'react';

export default function V23Secure() {
  return (
    <div style={{ 
      backgroundColor: '#000', 
      minHeight: '100vh', 
      color: '#0891b2', 
      fontFamily: 'monospace', 
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        border: '1px solid #164e63', 
        padding: '30px', 
        maxWidth: '600px', 
        width: '100%',
        backgroundColor: 'rgba(8, 145, 178, 0.05)',
        boxShadow: '0 0 20px rgba(8, 145, 178, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          letterSpacing: '0.4em', 
          color: '#fff', 
          borderBottom: '1px solid #164e63',
          paddingBottom: '15px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          BAZAAR_OS: v23.2-SECURE
        </h1>

        <div style={{ fontSize: '12px', lineHeight: '2' }}>
          <p><span style={{ color: '#475569' }}>NODE_ID:</span> X570-TAICHI</p>
          <p><span style={{ color: '#475569' }}>PROTOCOL:</span> THE MESH</p>
          <p><span style={{ color: '#475569' }}>STATUS:</span> <span style={{ color: '#166534' }}>● LINK_ESTABLISHED</span></p>
          <p><span style={{ color: '#475569' }}>UPTIME:</span> 91.21% SHIELD ACTIVE</p>
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '10px', 
          border: '1px dashed #164e63', 
          textAlign: 'center',
          fontSize: '10px',
          color: '#06b6d4'
        }}>
          GENESIS 100 PORTAL: BROADCASTING
        </div>
      </div>

      <footer style={{ marginTop: '20px', fontSize: '9px', color: '#1e293b', letterSpacing: '0.2em' }}>
        SECURE SECTOR // DOMAIN VALIDATED
      </footer>
    </div>
  );
}