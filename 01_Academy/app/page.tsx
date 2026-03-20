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

  const triggerMeshAuth = async () => {
    if (!isSdkReady) return;
    setIsAuthenticating(true);
    try {
      const authResult = await window.Pi.authenticate(['username', 'payments'], () => {});
      setPioneerData(authResult.user);
    } catch (error: any) {
      console.error("Auth Denied:", error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const executeTransaction = () => {
    setIsProcessingPayment(true);
    window.Pi.createPayment({
      amount: 0.1, 
      memo: "Academy Testnet Validation", 
      metadata: { role: "Pioneer" }, 
    }, {
      onReadyForServerApproval: (id) => fetch('/api/payments/approve', { method: 'POST', body: JSON.stringify({ id }) }),
      onReadyForServerCompletion: (id, txid) => {
        fetch('/api/complete-handshake', { method: 'POST', body: JSON.stringify({ id, txid }) });
        setPaymentStatus("SUCCESS");
        setIsProcessingPayment(false);
      },
      onCancel: () => setIsProcessingPayment(false),
      onError: (e) => {
        setIsProcessingPayment(false);
        alert(e.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="bg-black text-yellow-500 p-8 rounded-lg border border-gray-800 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-2 uppercase tracking-widest">
          Bazaar Academy
        </h2>
        
        {!isSdkReady ? (
          <div className="text-sm animate-pulse text-gray-500">Syncing MESH...</div>
        ) : pioneerData ? (
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded border border-green-900">
              <p className="text-white text-sm">Welcome, <span className="text-yellow-500 font-bold">{pioneerData.username}</span></p>
            </div>
            <button 
              onClick={executeTransaction}
              disabled={isProcessingPayment}
              className="w-full bg-yellow-600 text-black font-bold py-3 rounded uppercase text-xs"
            >
              {isProcessingPayment ? "Processing..." : "Send 0.1 Test-Pi"}
            </button>
            {paymentStatus && <p className="text-green-500 text-center text-xs mt-2">Transaction Finalized</p>}
          </div>
        ) : (
          <button 
            onClick={triggerMeshAuth}
            disabled={isAuthenticating}
            className="w-full border border-yellow-600 text-yellow-500 font-bold py-3 rounded uppercase text-xs hover:bg-yellow-600/10"
          >
            {isAuthenticating ? "Authenticating..." : "Authenticate Testnet"}
          </button>
        )}
      </div>
    </div>
  );
}