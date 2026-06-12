import React from 'react';
import { Layers, Radio, CheckCircle, LogOut, Plus } from 'lucide-react';

// Added destructured props here to fix the undefined runtime errors
export default function Dashboard({ onNewExhibit, onSignOut }) {
  
  // Mock data representing the 3 cards in your collection grid layout
  const exhibitItems = [
    { title: "Smart City Infrastructure", zones: 12, audio: true },
    { title: "Eco Environmental Monitor", zones: 8, audio: true },
    { title: "Smart Mobility & Transit", zones: 7, audio: false }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#1F293D]">
          <div>
            <h2 className="text-3xl text-white font-bold tracking-tight">Smart City • Interactive Exhibits</h2>
            <p className="text-xs text-gray-400 mt-1">Administrative Control and Asset Configuration Panel</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Navigates to the wizard section */}
            <button 
              onClick={onNewExhibit} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/10 transition"
            >
              <Plus size={16} /> New Exhibit
            </button>

            {/* Logout button to return safely to the login or gallery view */}
            <button 
              onClick={onSignOut}
              className="p-2.5 bg-[#131926] hover:bg-rose-950/20 border border-[#1F293D] hover:border-rose-900/40 text-gray-400 hover:text-rose-400 rounded-xl transition"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Analytics Grid Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#131926] border border-[#1F293D] rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Active Exhibits</p>
              <span className="text-3xl font-bold text-white">6</span>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><Layers size={20} /></div>
          </div>
          
          <div className="bg-[#131926] border border-[#1F293D] rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Highlight Zones</p>
              <span className="text-3xl font-bold text-white">27</span>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg"><Radio size={20} /></div>
          </div>
          
          <div className="bg-[#131926] border border-[#1F293D] rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Audio Ready</p>
              <span className="text-3xl font-bold text-white">4 / 6</span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle size={20} /></div>
          </div>
        </div>

        {/* Gallery Collection Layout Section */}
        <h3 className="text-xl text-white font-semibold mb-5">Exhibit Collection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exhibitItems.map((item, i) => (
            <div 
              key={i} 
              className="h-64 rounded-2xl bg-gradient-to-b from-[#131926] to-[#0f141f] border border-[#1F293D] p-6 flex flex-col justify-between hover:border-blue-500/40 transition group"
            >
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 font-mono">System Node #{1042 + i}</p>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-400 border-t border-[#1F293D]/60 pt-4">
                <span>📁 {item.zones} Monitored Zones</span>
                <span className="text-blue-500 font-medium group-hover:underline cursor-pointer">Configure →</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}