"use client";
import { useState } from 'react';

export default function MeshPaymentGateway() {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTransaction = () => {
    setIsProcessing(true);
    setPaymentStatus("&gt; Initiating MESH Transaction...");

    // 1. Trigger the native Pi Wallet UI in the Pi Browser
    window.Pi.createPayment({
      amount: 1, // Amount in Test-Pi
      memo: "Project Bazaar: E-Network Tier 2 Access", // Transaction description
      metadata: { role: "Service Provider Verification" }, // Internal tracking logic
    }, {
      // 2. Adjudicator Server Approval
      onReadyForServerApproval: async (paymentId: string) => {
        setPaymentStatus("&gt; Requesting Adjudicator Approval...");
        try {
          const response = await fetch('/api/payments/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          });
          if (!response.ok) throw new Error("Approval rejected.");
        } catch (error) {
          console.error(error);
          setPaymentStatus("&gt; ERROR: Adjudicator denied transaction.");
        }
      },

      // 3. Adjudicator Server Completion (After blockchain consensus)
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        setPaymentStatus("&gt; Blockchain consensus reached. Finalizing...");
        try {
          const response = await fetch('/api/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid })
          });
          if (response.ok) {
            setPaymentStatus("&gt; TRANSACTION COMPLETE. Node access granted.");
          }
        } catch (error) {
          setPaymentStatus("&gt; ERROR: Completion failed.");
        } finally {
          setIsProcessing(false);
        }
      },

      // 4. Exception Handling
      onCancel: (paymentId: string) => {
        setPaymentStatus("&gt; Transaction aborted by Pioneer.");
        setIsProcessing(false);
      },
      onError: (error: Error, payment?: any) => {
        setPaymentStatus(`&gt; MESH Error: ${error.message}`);
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="bg-gray-900 border border-yellow-500 p-6 rounded-lg relative overflow-hidden">
      <h3 className="text-lg font-bold text-white mb-2">Network Protocol: User-to-App Transfer</h3>
      <p className="text-sm text-gray-400 mb-4">Execute a 1 Test-Pi transaction to verify Sandbox completion.</p>
      
      <button 
        onClick={executeTransaction} 
        disabled={isProcessing}
        className={`w-full font-bold py-3 px-4 rounded border transition-all duration-200 uppercase ${
          isProcessing ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800 text-yellow-500 border-yellow-500"
        }`}
      >
        {isProcessing ? "Processing Block..." : "Execute Payment"}
      </button>

      {paymentStatus && (
        <div className="mt-4 bg-black border border-gray-800 p-3 rounded font-mono text-sm">
          <span className={paymentStatus.includes("COMPLETE") ? "text-green-400" : paymentStatus.includes("ERROR") ? "text-red-500" : "text-gray-400"}>
            {paymentStatus.replace('&gt;', '>')}
          </span>
        </div>
      )}
    </div>
  );
}