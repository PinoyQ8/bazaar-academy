"use client";
import { useEffect, useState } from 'react';

// 1. MESH Hard-Coding: The Global Pi Registry
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
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.onload = () => {
      try {
        // MESH-SYNC: Academy locked to Testnet (sandbox: true)
        window.Pi.init({ version: "2.0", sandbox: true });
        setIsSdkReady(true);
      } catch (e) {
        console.error("SDK Init Error:", e);
      }
    };
    document.body.appendChild(script);
  }, []);

  const onIncompletePaymentFound = async (payment: any) => {
    if (payment.transaction && payment.transaction.txid) {
      try {
        await fetch('/api/complete-handshake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            paymentId: payment.identifier, 
            txid: payment.transaction.txid 
          })
        });
        alert("MESH SYNC: Ghost payment recovered.");
      } catch (error) {
        console.error("Adjudicator sync failed.");
      }
    }
  };

  const triggerMeshAuth = async () => {
    if (!isSdkReady) return;
    setIsAuthenticating(true);
    setErrorLog(null);
    try {
      const authResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
      const response = await fetch('/api/verify-pioneer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: authResult.accessToken })
      });
      if (response.ok) setPioneerData(authResult.user);
      else setErrorLog("Adjudicator verification failed.");
    } catch (error: any) {
      setErrorLog("MESH Auth Denied: " + error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const executeTransaction = () => {
    setIsProcessingPayment(true);
    setPaymentStatus("> Initiating MESH Transaction...");

    window.Pi.createPayment({
      amount: 1, 
      memo: "Bazaar Academy: Testnet Validation", 
      metadata: { role: "Pioneer Training" }, 
    }, {
      onReadyForServerApproval: async (paymentId) => {
        await fetch('/api/payments/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        const response = await fetch('/api/complete-handshake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid })
        });
        if (response.ok) setPaymentStatus("> HANDSHAKE COMPLETE.");
        setIsProcessingPayment(false);
      },
      onCancel: () => setIsProcessingPayment(false),
      onError: (error) => {
        setPaymentStatus(`> MESH Error: ${error.message}`);
        setIsProcessingPayment(false);
        alert("SDK BLOCK: " + error.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans text-yellow-500">
      {/* MESH Diagnostic Header */}
      <p className="fixed top-4 text-[10px] uppercase tracking-[0.3em] opacity-40">
        MESH-SCAN: {isSdkReady ? "Active" : "Syncing..."}
      </p>

      <div className="bg-black border border-gray-800 p-8 rounded-lg max-w-md w-full shadow-[0_0_30px_rgba(234,179,8,0.05)]">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Academy Adjudicator</h2>
        
        {!isSdkReady ? (
          <div className="animate-pulse text-sm">Initializing E-Network Bridge...</div>
        ) : pioneerData ? (
          <div className="space-y-4">
            <div className="bg-gray-900/50 border border-green-900/50 p-4 rounded">
              <p className="text-xs text-green-500 mb-1 font-mono">&gt; Identity Verified</p>
              <p className="text-white">Pioneer: <span className="text-yellow-500 font-bold">{pioneerData.username}</span></p>
            </div>
            
            <button 
              onClick={executeTransaction}
              disabled={isProcessingPayment}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-black py-4 rounded transition-all uppercase text-sm"
            >
              {isProcessingPayment ? "Processing Block..." : "Execute 1 Test-Pi"}
            </button>
            <p className="text-[10px] text-center text-gray-600 italic">{paymentStatus}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={triggerMeshAuth}
              disabled={isAuthenticating}
              className="w-full border border-yellow-500 hover:bg-yellow-500/10 text-yellow-500 font-bold py-4 rounded transition-all uppercase text-sm"
            >
              {isAuthenticating ? "Bridging..." : "Authenticate via Pi Sandbox"}
            </button>
            {errorLog && <p className="text-red-500 text-[10px] font-mono">{errorLog}</p>}
          </div>
        )}
      </div>
    </div>
  );
}