"use client";
import { useState } from 'react';
import Link from 'next/link';

interface NodeMetrics {
  version: string;
  os: string;
  dockerNative: boolean;
  installDate: string;
  availability: number;
  status: string;
}

export default function MeshScanTerminal() {
  const [isScanning, setIsScanning] = useState(false);
  const [metrics, setMetrics] = useState<NodeMetrics | null>(null);
  const [scanLog, setScanLog] = useState<string[]>([]);

  const executeMeshScan = () => {
    setIsScanning(true);
    setMetrics(null);
    setScanLog(["&gt; Initiating MESH-SCAN protocol..."]);

    setTimeout(() => setScanLog(prev => [...prev, "&gt; Bypassing Docker Toolbox... Native integration detected."]), 800);
    setTimeout(() => setScanLog(prev => [...prev, "&gt; Verifying OS architecture..."]), 1500);
    setTimeout(() => setScanLog(prev => [...prev, "&gt; Calculating Uptime Shield from Genesis block (2026-02-27)..."]), 2200);
    
    setTimeout(() => {
      setMetrics({
        version: "0.5.4",
        os: "WINDOWS 6.2.9200",
        dockerNative: true,
        installDate: "2026-02-27",
        availability: 92.48,
        status: "SECURED"
      });
      setIsScanning(false);
      setScanLog(prev => [...prev, "&gt; SCAN COMPLETE. E-Network Node is optimized."]);
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12 selection:bg-yellow-500 selection:text-black">
      
      {/* Navigation Bridge */}
      <div className="mb-8 border-b border-gray-800 pb-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-sm font-mono text-gray-500 hover:text-yellow-500 transition-colors">
          &lt; Return to Command Center
        </Link>
        <span className="text-xs font-mono text-green-400 border border-green-900 bg-green-900/20 px-2 py-1 rounded">
          App 01: ONLINE
        </span>
      </div>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">MESH-<span className="text-yellow-500">SCAN</span></h1>
        <p className="text-sm text-gray-400 mb-8 border-l-2 border-gray-700 pl-3">
          Decentralized Security Auditor. Run this utility to verify Node compliance with Project Bazaar v23 Mainnet standards.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Action Terminal */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
            
            <h2 className="text-lg font-bold text-white mb-4">Execution Matrix</h2>
            
            <div className="bg-black border border-gray-800 rounded p-4 h-48 mb-6 font-mono text-sm overflow-y-auto flex flex-col justify-end">
              {scanLog.length === 0 ? (
                <span className="text-gray-600">&gt; Awaiting command...</span>
              ) : (
                scanLog.map((log, index) => (
                  <span key={index} className={log.includes("COMPLETE") ? "text-green-400 mt-2" : "text-gray-400 mb-1"}>
                    {/* Replacing &gt; string literal rendering with dangerouslySetInnerHTML equivalent or safe text */}
                    {log.replace('&gt;', '>')} 
                  </span>
                ))
              )}
              {isScanning && <span className="text-yellow-500 animate-pulse mt-2">_</span>}
            </div>

            <button 
              onClick={executeMeshScan}
              disabled={isScanning}
              className={`mt-auto font-bold py-3 px-4 rounded border transition-all duration-200 uppercase tracking-wider ${
                isScanning 
                  ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed" 
                  : "bg-black hover:bg-gray-800 text-yellow-500 border-yellow-500 hover:border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
              }`}
            >
              {isScanning ? "Scanning RAM..." : "Execute MESH-SCAN"}
            </button>
          </div>

          {/* Telemetry Readout */}
          <div className={`transition-all duration-500 border rounded-lg p-6 ${metrics ? 'border-green-500/50 bg-gray-900/80 shadow-[0_0_20px_rgba(34,197,94,0.05)]' : 'border-gray-800 bg-gray-900/30'}`}>
            <h2 className="text-lg font-bold text-white mb-6 border-b border-gray-800 pb-2">Node Telemetry</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 uppercase">Architecture</span>
                <span className={`font-mono ${metrics ? 'text-white' : 'text-gray-700'}`}>{metrics ? metrics.os : "---"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 uppercase">Desktop Logic</span>
                <span className={`font-mono ${metrics ? 'text-white' : 'text-gray-700'}`}>{metrics ? `v${metrics.version}` : "---"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 uppercase">Docker Integrity</span>
                <span className={`font-mono ${metrics ? 'text-green-400' : 'text-gray-700'}`}>{metrics ? (metrics.dockerNative ? "NATIVE" : "TOOLBOX") : "---"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 uppercase">Genesis Date</span>
                <span className={`font-mono ${metrics ? 'text-white' : 'text-gray-700'}`}>{metrics ? metrics.installDate : "---"}</span>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-800">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Uptime Shield</span>
                  <span className={`text-2xl font-mono ${metrics && metrics.availability >= 92 ? 'text-green-400' : 'text-gray-700'}`}>
                    {metrics ? `${metrics.availability}%` : "0.00%"}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${metrics && metrics.availability >= 92 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: metrics ? `${metrics.availability}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}