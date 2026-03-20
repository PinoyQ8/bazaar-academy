"use client";
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: any) => void
      ) => Promise<{ accessToken: string; user: { username: string; uid: string } }>;
      createPayment: (
        paymentData: { amount: number; memo: string; metadata: any },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: any) => void;
        }
      ) => void;
    };
  }
}

interface PioneerData {
  username: string;
  uid: string;
}

export default function AcademyDevGate() {
  const [pioneerData, setPioneerData] = useState<PioneerData | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.onload = () => {
      try {
        window.Pi.init({ version: "2.0", sandbox: true });
        setIsSdkReady(true);
      } catch (e) {
        console.error("SDK Init Error:", e);
      }
    };
    document.body.appendChild(script);
  }, []);

  // 1. MESH RECOVERY: This clears the "Pending Payment" error on the S23
  const onIncompletePaymentFound = async (payment: any) => {
    console.log("Ghost payment detected. Resyncing Adjudicator...", payment);
    try {
      await fetch('/api/payments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.identifier })
      });
      alert("MESH RECOVERY: Stuck payment identified and approved. Reloading...");
      window.location.reload(); 
    } catch (e) {
      console.error("Recovery Handshake Failed", e);
    }
  };

  const triggerMeshAuth = async () => {
    if (!isSdkReady) return;
    setIsAuthenticating(true);
    try {
      // 2. Pass the recovery function into the authentication bridge
      const authResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
      setPioneerData(authResult.user);
    } catch (error: any) {
      console.error("Auth Denied:", error.message);
      // If the error says "Already has a pending payment," the onIncompletePaymentFound above should trigger
    } finally {
      setIsAuthenticating(false);
    }
  };

  const executeTransaction = () => {
    setIsProcessingPayment(true);
    setPaymentStatus("> Executing...");

    window.Pi.createPayment({
      amount: 0.1, 
      memo: "Academy Testnet Validation", 
      metadata: { role: "Pioneer" }, 
    }, {
      onReadyForServerApproval: (paymentId) => {
        return fetch('/api/payments/approve', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId }) 
        });
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        fetch('/api/complete-handshake', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid }) 
        });
        setPaymentStatus("SUCCESS");
        setIsProcessingPayment(false);
      },
      onCancel: () => setIsProcessingPayment(false),
      onError: (e) => {
        setIsProcessingPayment(false);
        alert("MESH Error: " + e.message);
      }
    });
  };

  // 3. UI RENDER: Using Hard-Coded Inline Styles for S23 Compatibility
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', fontFamily: 'monospace' }}>
      <div style={{ border: '1px solid #374151', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '400px', textAlign: 'center', backgroundColor: '#000' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
          BAZAAR ACADEMY
        </h2>
        
        {!isSdkReady ? (
          <div style={{ fontSize: '0.875rem', opacity: 0.5 }}>SYNCING MESH...</div>
        ) : pioneerData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#111827', padding: '1rem', borderRadius: '0.25rem', border: '1px solid #064e3b' }}>
              <p style={{ color: 'white', fontSize: '0.875rem' }}>
                Welcome, <span style={{ color: '#eab308', fontWeight: 'bold' }}>{pioneerData.username}</span>
              </p>
            </div>
            <button 
              onClick={executeTransaction}
              disabled={isProcessingPayment}
              style={{ width: '100%', backgroundColor: '#ca8a04', color: 'black', fontWeight: 'bold', padding: '1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              {isProcessingPayment ? "Processing..." : "Send 0.1 Test-Pi"}
            </button>
            {paymentStatus && <p style={{ color: '#22c55e', fontSize: '0.75rem' }}>{paymentStatus}</p>}
          </div>
        ) : (
          <button 
            onClick={triggerMeshAuth}
            disabled={isAuthenticating}
            style={{ width: '100%', border: '1px solid #ca8a04', backgroundColor: 'transparent', color: '#eab308', fontWeight: 'bold', padding: '1rem', borderRadius: '0.25rem', cursor: 'pointer', textTransform: 'uppercase' }}
          >
            {isAuthenticating ? "Authenticating..." : "Authenticate Testnet"}
          </button>
        )}
      </div>
    </div>
  );
}