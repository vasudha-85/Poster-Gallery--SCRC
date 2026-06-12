import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowLeft, Layers, Radio, CheckCircle, LogOut, Plus } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // Starts on login page
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setError('');
      setCurrentView('dashboard'); // Forces view change to dashboard immediately
    } else {
      setError('Invalid administrative password token specified.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100">
      
      {/* 1. LOGIN VIEW */}
      {currentView === 'login' && (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="w-full max-w-md bg-[#131926] border border-[#1F293D] rounded-2xl p-8 shadow-2xl relative z-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center shadow-lg mb-3">
                <Shield size={22} className="stroke-[2.5]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">QR-Play Admin</h2>
              <p className="text-xs text-gray-400 mt-0.5">Secure Management Portal</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <div className="flex mb-3">
                  <span className="bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-500/10">
                    Administrator Authorization
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  Enter your credentials to access the administrative panel workspace.
                </p>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-gray-200 placeholder-gray-600 font-medium"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 font-mono mt-2.5 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-[#1F293D]/40">
                  🔑 Demo password: <span className="text-blue-400 font-bold">admin123</span>
                </p>
              </div>

              {error && <p className="text-xs text-rose-400 font-medium bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-lg">{error}</p>}

              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-semibold text-sm rounded-xl transition text-white shadow-lg cursor-pointer">
                Sign In Securely
              </button>
            </form>

            <button type="button" onClick={() => alert("Navigating to Gallery")} className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 mx-auto transition font-medium cursor-pointer">
              <ArrowLeft size={14} /> Back to Gallery
            </button>
          </div>
        </div>
      )}

      {/* 2. DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#1F293D]">
              <div>
                <h2 className="text-3xl text-white font-bold tracking-tight">Smart City • Interactive Exhibits</h2>
                <p className="text-xs text-gray-400 mt-1">Administrative Control Panel</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentView('new-exhibit')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
                  <Plus size={16} /> New Exhibit
                </button>
                <button onClick={() => { setPassword(''); setCurrentView('login'); }} className="p-2.5 bg-[#131926] border border-[#1F293D] text-gray-400 hover:text-rose-400 rounded-xl transition">
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* Stat Counters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#131926] border border-[#1F293D] rounded-xl p-6 flex justify-between items-center">
                <div><p className="text-xs text-gray-400 mb-1">Active Exhibits</p><span className="text-3xl font-bold">6</span></div>
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><Layers size={20} /></div>
              </div>
              <div className="bg-[#131926] border border-[#1F293D] rounded-xl p-6 flex justify-between items-center">
                <div><p className="text-xs text-gray-400 mb-1">Highlight Zones</p><span className="text-3xl font-bold">27</span></div>
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg"><Radio size={20} /></div>
              </div>
              <div className="bg-[#131926] border border-[#1F293D] rounded-xl p-6 flex justify-between items-center">
                <div><p className="text-xs text-gray-400 mb-1">Audio Ready</p><span className="text-3xl font-bold">4 / 6</span></div>
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle size={20} /></div>
              </div>
            </div>

            {/* Collections Grid Cards Layout */}
            <h3 className="text-xl text-white font-semibold mb-5">Exhibit Collection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Smart City Infrastructure", "Eco Environmental Monitor", "Smart Mobility & Transit"].map((title, i) => (
                <div key={i} className="h-60 rounded-2xl bg-[#131926] border border-[#1F293D] p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{title}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-1">System Node #{1042 + i}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400 border-t border-[#1F293D]/60 pt-4">
                    <span>Monitored Layer Grid Asset</span>
                    <span className="text-blue-500 font-medium cursor-pointer hover:underline">Configure →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. NEW EXHIBIT VIEW */}
      {currentView === 'new-exhibit' && (
        <div className="p-8 max-w-5xl mx-auto">
          <button onClick={() => setCurrentView('dashboard')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl mb-4 text-xs font-semibold transition">
            ← Cancel and Return to Dashboard
          </button>
          <div className="bg-[#131926] p-8 rounded-2xl border border-[#1F293D]">
            <h2 className="text-xl font-bold text-white">New Exhibit Upload Wizard Stage 1</h2>
          </div>
        </div>
      )}

    </div>
  );
}