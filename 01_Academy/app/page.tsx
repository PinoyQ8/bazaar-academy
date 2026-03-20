"use client";
import { useEffect, useState } from 'react';

// 1. Expanded MESH Hard-Coding: Define the full Pi SDK interface
declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: any) => void
      ) => Promise<{ accessToken: string; user: { username: string; uid: string } }>;
      
      // NEW: Transaction Gateway Logic
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

// Define the Pioneer Data Structure
interface PioneerData {
  username: string;
  uid: string;
}

export default function PioneerAuthGate() {
  const [pioneerData, setPioneerData] = useState<PioneerData | null>(null);
  
  // Hard-coded states for connection and security shielding
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  useEffect(() => {
    // 2. Inject the Pi SDK into the Academy Testnet RAM
    const script = document.createElement('script');
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.onload = () => {
      // Initialize strictly in Sandbox mode for Testnet
      window.Pi.init({ version: "2.0", sandbox: true });
      setIsSdkReady(true); // Signal that the gate is ready
    };
    document.body.appendChild(script);
  }, []);

  const triggerMeshAuth = async () => {
    if (!isSdkReady) return;
    
    setIsAuthenticating(true);
    setErrorLog(null);

    try {
      // 3. Request authentication from the Pioneer's Test Wallet
      const scopes = ['username', 'payments'];
      const onIncompletePaymentFound = (payment: any) => { 
        console.log("Incomplete transaction detected in RAM:", payment); 
      };

      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      
      // 4. Buffer the auth token and send to Edge Verification
      await verifyWithAdjudicator(authResult.accessToken, authResult.user);

    } catch (error) {
      console.error("MESH Auth Failed:", error);
      setErrorLog("Authentication rejected by the MESH.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const verifyWithAdjudicator = async (accessToken: string, user: PioneerData) => {
    // Route to Phase 3 (Backend)
    try {
      const response = await fetch('/api/verify-pioneer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      if (response.ok) {
        setPioneerData(user);
        console.log("Pioneer Verified. Accessing E-Network Tier 2.");
      } else {
        setErrorLog("Edge Adjudicator verification failed.");
      }
    } catch (error) {
      setErrorLog("Bridge connection error.");
    }
  };

  return (
    <div className="mesh-container bg-black text-yellow-500 p-8 rounded-lg border border-gray-700 font-sans max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 tracking-wide border-b border-gray-700 pb-2">Adjudicator Entry: Testnet</h2>
      
      {pioneerData ? (
        <div className="border border-green-500 p-4 rounded bg-gray-900 mt-4">
          <p className="text-green-400 font-mono text-sm mb-2"> Status: Verified</p>
          <p className="text-white text-lg">Welcome, Pioneer <span className="font-bold text-yellow-500">{pioneerData.username}</span>.</p>
          <p className="text-sm text-gray-400 mt-2">Uptime Shield: 92%</p>
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
              <p className="text-red-500 text-sm font-mono"> ERROR: {errorLog}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}