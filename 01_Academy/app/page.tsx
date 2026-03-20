"use client";
import { useEffect, useState } from 'react';

// 1. MESH Hard-Coding: The Global Pi Registry (Identity + Payments)
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
  
  // Auth States
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  // Payment States
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.onload = () => {
      window.Pi.init({ version: "2.0", sandbox: true });
      setIsSdkReady(true);
    };
    document.body.appendChild(script);
  }, []);

  const triggerMeshAuth = async () => {
    if (!isSdkReady) return;
    setIsAuthenticating(true);
    setErrorLog(null);

    try {
      const authResult = await window.Pi.authenticate(['username', 'payments'], (payment) => console.log("Incomplete transaction:", payment));
      await verifyWithAdjudicator(authResult.accessToken, authResult.user);
    } catch (error) {
      setErrorLog("Authentication rejected by the MESH.");
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
        } catch (error) {
          setPaymentStatus("> ERROR: Adjudicator denied transaction.");
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
              {/* MESH-Patch: Shielded terminal syntax */}
              <p className="text-green-400 font-mono text-sm mb-2">&gt; Status: Verified</p>
              <p className="text-white text-lg">Welcome, Pioneer <span className="font-bold text-yellow-500">{pioneerData.username}</span>.</p>
            </div>
            
            {/* Payment Sub-Module */}
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
            
            {errorLog && (
              <div className="bg-red-900/20 border border-red-500 p-3 rounded">
                {/* MESH-Patch: Shielded terminal syntax */}
                <p className="text-red-500 text-sm font-mono">&gt; ERROR: {errorLog}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}