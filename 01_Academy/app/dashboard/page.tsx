"use client";
import Link from 'next/link';

// 1. Hard-Code the Academy App Registry
const ACADEMY_APPS = [
  {
    id: "mesh-scan",
    title: "App 01: MESH-SCAN",
    description: "Node Security Auditor. Execute vulnerability checks on simulated E-Network infrastructure.",
    status: "Online",
    route: "/apps/mesh-scan",
    color: "border-yellow-500",
  },
  {
    id: "alpha-track",
    title: "App 02: Alpha Track Simulator",
    description: "Interactive Service Provider Manual. Practice Zero Garbage data sorting and Adjudicator logic.",
    status: "Pending Deployment",
    route: "/apps/alpha-track",
    color: "border-gray-600",
  },
  {
    id: "dao-forge",
    title: "App 03: DAO Forge",
    description: "Governance Sandbox. Draft and vote on MESH Protocol updates prior to v23 Mainnet integration.",
    status: "Pending Deployment",
    route: "/apps/dao-forge",
    color: "border-gray-600",
  }
];

export default function DashboardGate() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12 selection:bg-yellow-500 selection:text-black">
      
      {/* HUD Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wider">PROJECT BAZAAR <span className="text-yellow-500">ACADEMY</span></h1>
          {/* MESH-Patch: Using &gt; to shield the compiler */}
          <p className="font-mono text-sm text-gray-500 mt-2">&gt; Protocol: Neo | Status: Tier 2 Secured</p>
        </div>
        <div className="mt-4 md:mt-0 text-right bg-gray-900 border border-gray-700 p-3 rounded">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">System Metrics</p>
          <p className="font-mono text-green-400 text-sm">&gt; Uptime Shield: 92%</p>
          <p className="font-mono text-green-400 text-sm">&gt; Bridge Status: Active</p>
        </div>
      </header>

      {/* Directory Grid */}
      <main>
        <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-3">E-Network App Directory</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACADEMY_APPS.map((app) => (
            <Link href={app.route} key={app.id} className="group outline-none">
              <div className={`bg-gray-900 border ${app.color} p-6 rounded-lg h-full transition-all duration-300 hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)] relative overflow-hidden`}>
                
                {/* Visual Node Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-800 to-transparent opacity-50"></div>
                
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors">{app.title}</h3>
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    app.status === 'Online' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {app.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-800">
                  {/* String literals in JS ternaries do not require HTML entity shielding */}
                  <span className="text-xs font-mono text-yellow-500 uppercase group-hover:tracking-widest transition-all duration-300">
                    {app.status === 'Online' ? '> Execute Logic' : '> Awaiting Hard-Code'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

    </div>
  );
}