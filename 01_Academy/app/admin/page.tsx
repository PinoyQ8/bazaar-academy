'use client';

import React, { useState, useEffect } from 'react';

export default function BazaarAdminTerminal() {
  const [time, setTime] = useState('');
  
  // 1. MESH-SCAN LOG BUFFER
  const logs = [
    "[SYSTEM]: 91.91% UPTIME SHIELD ACTIVE",
    "[STATUS]: GENESIS 100 IMMUTABLE",
    "[NETWORK]: NODE X570-TAICHI BROADCASTING",
    "[SECURITY]: VERCEL EDGE HANDSHAKE COMPLETE",
    "[SYNC]: WAITING FOR PIONEER INBOUND..."
  ];

  // 2. Real-time Clock for Uptime Monitoring
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen font-mono p-4 md:p-8 transition-colors duration-500 bg-black text-cyan-500">
      <div className="max-w-4xl mx-auto border border-gray-900 p-6 bg-black/50 shadow-2xl">
        
        {/* MATTE BAZAAR_OS HEADER */}
        <header className="border-b border-gray-800 pb-4 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-600 animate-pulse shadow-[0_0_8px_#0891b2]"></div>
            <div>
              <h1 className="text-xl font-bold tracking-[0.3em] text-gray-100 uppercase">
                BAZAAR_OS <span className="text-xs text-cyan-700">v23.2</span>
              </h1>
              <p className="text-[10px] text-gray-600 font-bold tracking-[0.1em] uppercase">
                Node: X570-TAICHI // {time || 'SYNCING...'}
              </p>
            </div>
          </div>
          
          <div className="border border-cyan-900/50 px-3 py-1 bg-cyan-950/10">
             <p className="text-[10px] text-cyan-400 font-bold tracking-widest animate-pulse">
               ● EDGE_LINK_ACTIVE
             </p>
          </div>
        </header>

        {/* MESH-SCAN FEED */}
        <section className="mb-8">
          <div className="bg-gray-950/50 border border-gray-900 p-4 h-48 overflow-y-auto scrollbar-hide mb-4 font-mono text-xs">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-700 mr-2">[{time}]</span>
                <span className={log.includes('SYSTEM') ? 'text-cyan-400' : 'text-gray-400'}>
                  {log}
                </span>
              </div>
            ))}
            <div className="text-cyan-600 animate-pulse mt-2">_ Awaiting operator input...</div>
          </div>
        </section>

        {/* COMMAND INTERFACE */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => alert('MESH-SCAN: Scanning local sector...')}
            className="border border-gray-800 p-3 text-left hover:bg-cyan-950/20 hover:border-cyan-700 transition-all group"
          >
            <span className="text-[10px] text-gray-600 block uppercase">Action 01</span>
            <span className="text-sm text-gray-300 group-hover:text-cyan-400 font-bold uppercase tracking-widest">Run Mesh-Scan</span>
          </button>

          <button 
            onClick={() => window.open('/validation-key.txt', '_blank')}
            className="border border-gray-800 p-3 text-left hover:bg-cyan-950/20 hover:border-cyan-700 transition-all group"
          >
            <span className="text-[10px] text-gray-600 block uppercase">Action 02</span>
            <span className="text-sm text-gray-300 group-hover:text-cyan-400 font-bold uppercase tracking-widest">Verify Payload</span>
          </button>
        </main>

        <footer className="mt-12 text-[9px] text-gray-800 text-center uppercase tracking-[0.5em]">
          Project Bazaar // Secure Infrastructure Sector
        </footer>

      </div>
    </div>
  );
}