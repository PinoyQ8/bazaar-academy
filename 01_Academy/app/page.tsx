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

export default function PioneerAuthGate() {
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
        window.Pi.init({ version: "2.0", sandbox: true });
        setIsSdkReady(true);
      } catch (e) {
        console.error("SDK Init Error:", e);
      }
    };
    document.body.appendChild(script);
  }, []);

  const onIncompletePaymentFound = async (payment: any) => {
    console.log("Ghost payment detected. Synchronizing MESH...", payment);
    // If the payment hit the blockchain, it will have a txid. We must send it to Vercel.
    if (payment.transaction && payment.transaction.txid) {
      try {
        const response = await fetch('/api/complete-handshake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            paymentId: payment.identifier, 
            txid: payment.transaction.txid 
          })
        });
        
        if (response.ok) {
          alert("MESH SYNC: Ghost payment finalized. Step #10 Confirmed.");
        } else {
          alert("Adjudicator rejected the ghost payment sync.");
        }
      } catch (error) {
        console.error("Adjudicator offline during sync.");
      }
    }
  };

  const triggerMeshAuth = async () => {
    if (!isSdkReady) return;
    setIsAuthenticating(true);
    setErrorLog(null);
    try {
      // We pass the new recovery function here
      const authResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
      await verifyWithAdjudicator(authResult.accessToken, authResult.user);
    } catch (error: any) {
      setErrorLog("MESH Auth Denied: " + error.message);
      setIsAuthenticating(false);
    }
  };

  const verifyWithAdjudicator = async (accessToken: string, user: PioneerData) => {
    try {
      const response = await fetch('/api/verify-pioneer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });
      if (response.ok) {
        setPioneerData(user);
      } else {
        setErrorLog("Edge Adjudicator verification failed.");
      }
    } catch (error) {
      setErrorLog("Bridge connection error.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const executeTransaction = () => {
    if (!isSdkReady) {
      alert("MESH Error: SDK not initialized.");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStatus("> Initiating MESH Transaction...");

    window.Pi.createPayment({
      amount: 1, 
      memo: "Project Bazaar: E-Network Tier 2 Access", 
      metadata: { role: "Service Provider Verification" }, 
    }, {
      onReadyForServerApproval: async (paymentId: string) => {
        setPaymentStatus("> Requesting Adjudicator Approval...");
        try {
          const response = await fetch('/api/payments/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          });
          if (!response.ok) throw new Error("Approval rejected.");
        } catch (error: any) {
          setPaymentStatus("> ERROR: Adjudicator denied transaction.");
          alert("Approval Failed: Check PI_API_KEY in Vercel.");
        }
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        setPaymentStatus("> Blockchain consensus reached. Finalizing Handshake...");
        try {
          const response = await fetch('/api/complete-handshake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid })
          });
          if (response.ok) {
            setPaymentStatus("> HANDSHAKE COMPLETE. Node access granted.");
          } else {
            throw new Error("Handshake failed.");
          }
        } catch (error) {
          setPaymentStatus("> ERROR: Completion failed.");
        } finally {
          setIsProcessingPayment(false);
        }
      },
      onCancel: (paymentId: string) => {
        setPaymentStatus("> Transaction aborted by Pioneer.");
        setIsProcessingPayment(false);
      },
      onError: (error: Error, payment?: any) => {
        setPaymentStatus(`> MESH Error: ${error.message}`);
        setIsProcessingPayment(false);
        // CRITICAL DEBUG: Forces mobile browser to show the reason for the hang
        alert("SDK BLOCK: " + error.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="mesh-container bg-black text-yellow-500 p-8 rounded-lg border border-gray-700 max-w-md w-full shadow-[0_0_20px_rgba(234,179,8,0.1)]">
        <h2 className="text-2xl font-bold mb-4 tracking-wide border-b border-gray-700 pb-2">Adjudicator Entry: Testnet</h2>
        
        {pioneerData ? (
          <div className="mt-4 flex flex-col gap-4">
            <div className="border border-green-500 p-4 rounded bg-gray-900">
              <p className="text-green-400 font-mono text-sm mb-2">&gt; Status: Verified</p>
              <p className="text-white text-lg">Welcome, Pioneer <span className="font-bold text-yellow-500">{pioneerData.username}</span>.</p>
            </div>
            
            <div className="border border-yellow-500 p-4 rounded bg-gray-900 mt-2">
              <p className="text-sm text-gray-400 mb-4">Execute a 1 Test-Pi transaction to verify Sandbox completion.</p>
              <button 
                onClick={executeTransaction} 
                disabled={isProcessingPayment}
                className={`w-full font-bold py-3 px-4 rounded border transition-all duration-200 uppercase ${
                  isProcessingPayment ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800 text-yellow-500 border-yellow-500"
                }`}
              >
                {isProcessingPayment ? "Processing Block..." : "Execute Payment"}
              </button>
              
              {paymentStatus && (
                <div className="mt-4 bg-black border border-gray-800 p-3 rounded font-mono text-sm">
                  <span className={paymentStatus.includes("COMPLETE") ? "text-green-400" : paymentStatus.includes("ERROR") ? "text-red-500" : "text-gray-400"}>
                    {paymentStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            <button 
              onClick={triggerMeshAuth} 
              disabled={!isSdkReady || isAuthenticating}
              className={`font-bold py-3 px-4 rounded border transition-all duration-200 ${
                !isSdkReady || isAuthenticating 
                  ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed" 
                  : "bg-gray-900 hover:bg-gray-800 text-white border-yellow-500 hover:border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
              }`}
            >
              {!isSdkReady 
                ? "Syncing Pi SDK..." 
                : isAuthenticating 
                ? "Bridging to Adjudicator..." 
                : "Authenticate via Pi Sandbox"}
            </button>
            
            <button 
              onClick={() => setPioneerData({ username: "Bazaar_Founder_Dev", uid: "DEV_OVERRIDE_01" })}
              className="mt-4 text-[10px] text-gray-600 hover:text-yellow-500 uppercase tracking-widest transition-colors font-mono"
            >
              [ Execute Adjudicator Bypass ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}