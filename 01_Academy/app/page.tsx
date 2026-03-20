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
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const onIncompletePaymentFound = async (payment: any) => {
    setStatusMsg("> Stuck payment detected. Attempting MESH Recovery...");
    try {
      if (payment.status.developer_approved && !payment.status.developer_completed) {
        // Step A: Complete it if it was already approved
        await fetch('/api/complete-handshake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction.txid })
        });
      } else if (!payment.status.developer_approved) {
        // Step B: Approve it if it's brand new
        await fetch('/api/payments/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: payment.identifier })
        });
      }
      alert("MESH RECOVERY SUCCESSFUL. Reloading for clean state.");
      window.location.reload();
    } catch (e) {
      setStatusMsg("> ERROR: Recovery Handshake failed.");
    }
  };

  const triggerMeshAuth = async () => {
    if (!isSdkReady) return;
    setIsAuthenticating(true);
    setStatusMsg(null);
    try {
      const authResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
      setPioneerData(authResult.user);
    } catch (error: any) {
      setStatusMsg("> AUTH ERROR: " + error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const executeTransaction = () => {
    setIsProcessing(true);
    setStatusMsg("> Handshaking with Blockchain...");

    window.Pi.createPayment({
      amount: 0.1, 
      memo: "Bazaar Academy: Testnet Validation", 
      metadata: { role: "Pioneer" }, 
    }, {
      onReadyForServerApproval: async (paymentId) => {
        setStatusMsg("> Server Approval in progress...");
        const res = await fetch('/api/payments/approve', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId }) 
        });
        if (!res.ok) throw new Error("Approval Denied by Adjudicator.");
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        setStatusMsg("> Blockchain verified. Finalizing...");
        const res = await fetch('/api/complete-handshake', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid }) 
        });
        if (res.ok) {
          setStatusMsg("SUCCESS: Node Validated.");
        } else {
          setStatusMsg("ERROR: Handshake incomplete.");
        }
        setIsProcessing(false);
      },
      onCancel: () => {
        setStatusMsg("> Aborted.");
        setIsProcessing(false);
      },
      onError: (e) => {
        setStatusMsg("> SDK ERROR: " + e.message);
        setIsProcessing(false);
        alert("SDK Block: " + e.message);
      }
    });
  };

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', fontFamily: 'monospace' }}>
      <div style={{ border: '1px solid #374151', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '400px', textAlign: 'center', backgroundColor: '#000', boxShadow: '0 0 20px rgba(234,179,8,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem', letterSpacing: '2px' }}>
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
              disabled={isProcessing}
              style={{ width: '100%', backgroundColor: isProcessing ? '#4b5563' : '#ca8a04', color: 'black', fontWeight: 'bold', padding: '1rem', borderRadius: '0.25rem', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer', textTransform: 'uppercase' }}
            >
              {isProcessing ? "Processing..." : "Send 0.1 Test-Pi"}
            </button>
            {statusMsg && <p style={{ color: statusMsg.includes("SUCCESS") ? "#22c55e" : "#ef4444", fontSize: '0.75rem', marginTop: '10px' }}>{statusMsg}</p>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={triggerMeshAuth}
              disabled={isAuthenticating}
              style={{ width: '100%', border: '1px solid #ca8a04', backgroundColor: 'transparent', color: '#eab308', fontWeight: 'bold', padding: '1rem', borderRadius: '0.25rem', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              {isAuthenticating ? "Authenticating..." : "Authenticate Testnet"}
            </button>
            {statusMsg && <p style={{ color: "#ef4444", fontSize: '0.75rem' }}>{statusMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}