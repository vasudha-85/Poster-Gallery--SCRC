import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Radio, CheckCircle, Eye, QrCode } from 'lucide-react';
import QRCodeModal from './QRCodeModal';
import ExhibitView from './ExhibitView';

export default function Gallery() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [selectedQrExhibit, setSelectedQrExhibit] = useState(null);
  const [activeExhibitView, setActiveExhibitView] = useState(null);
  
  // Track the unique active card hover state explicitly
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Exhibit catalog data structure
  const exhibits = [
    {
      id: 'smart-city-2045',
      title: 'Smart City Infrastructure 2045',
      description: 'Explore the future of connected urban systems and intelligent transportation networks.',
      zones: 5,
      audioStatus: 'Ready',
      duration: '4:20',
      color: 'from-blue-600/20 to-blue-950/40',
      sections: [
        { name: 'Core Substation', type: 'Circle', x: 10, y: 15, w: 25, h: 25, color: '#2563eb', start: '0:00', end: '1:15' },
        { name: 'Transit Node A', type: 'Square', x: 45, y: 20, w: 40, h: 30, color: '#06b6d4', start: '1:15', end: '2:45' },
        { name: 'Residential Sector', type: 'Square', x: 20, y: 55, w: 60, h: 35, color: '#10b981', start: '2:45', end: '4:20' }
      ]
    },
    {
      id: 'urban-mobility',
      title: 'Urban Mobility Network',
      description: 'A deep dive into next-generation public transit and autonomous vehicle corridors.',
      zones: 3,
      audioStatus: 'Ready',
      duration: '3:05',
      color: 'from-emerald-600/20 to-emerald-950/40',
      sections: [
        { name: 'Hyperloop Central', type: 'Circle', x: 35, y: 10, w: 30, h: 40, color: '#10b981', start: '0:00', end: '1:40' },
        { name: 'Drone Port Depot', type: 'Square', x: 15, y: 60, w: 70, h: 30, color: '#f59e0b', start: '1:40', end: '3:05' }
      ]
    },
    {
      id: 'energy-grid',
      title: 'Renewable Energy Grid',
      description: 'Distributed solar, wind and battery storage for the modern smart city.',
      zones: 7,
      audioStatus: 'Missing',
      duration: '0:00',
      color: 'from-amber-700/20 to-amber-950/40',
      sections: []
    }
  ];

  const filteredExhibits = exhibits.filter(ex => {
    if (filter === 'Ready') return ex.audioStatus === 'Ready';
    if (filter === 'Pending') return ex.audioStatus === 'Missing';
    return true;
  });

  if (activeExhibitView) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-gray-100">
        <ExhibitView 
          exhibit={activeExhibitView} 
          onBack={() => setActiveExhibitView(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-8 relative">
      <div className="absolute top-6 right-8">
        <button 
          onClick={() => navigate('/admin')} 
          className="px-4 py-2 bg-[#131926] hover:bg-[#1F293D] border border-[#1F293D] text-xs font-semibold rounded-xl transition text-gray-300"
        >
          Portal Login 🔒
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full pt-6">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Interactive Poster Gallery</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Scan, explore, and interact with immersive city exhibits through spatial audio and layered overlays.
          </p>
        </header>

        {/* Status Tracker Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#131926] p-6 rounded-2xl border border-[#1F293D] flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Active Exhibits</p>
              <h3 className="text-3xl font-bold">{exhibits.length}</h3>
              <span className="text-xs text-emerald-400 mt-1 inline-block">+2 added this month</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><Layers size={20} /></div>
          </div>
          <div className="bg-[#131926] p-6 rounded-2xl border border-[#1F293D] flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Highlight Zones</p>
              <h3 className="text-3xl font-bold">27</h3>
              <span className="text-xs text-gray-500 mt-1 inline-block">Across all exhibits</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400"><Radio size={20} /></div>
          </div>
          <div className="bg-[#131926] p-6 rounded-2xl border border-[#1F293D] flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Audio Ready</p>
              <h3 className="text-3xl font-bold">4 / 6</h3>
              <span className="text-xs text-amber-500 mt-1 inline-block">2 tracks pending</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle size={20} /></div>
          </div>
        </section>

        {/* Filter Navigation Header */}
        <section className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Exhibit Collection</h2>
            <p className="text-xs text-gray-400">{filteredExhibits.length} exhibits available</p>
          </div>
          <div className="flex gap-1 bg-[#131926] p-1 rounded-xl border border-[#1F293D] text-xs">
            {['All', 'Ready', 'Pending'].map((t) => (
              <button 
                key={t} 
                onClick={() => setFilter(t)} 
                className={`px-4 py-2 rounded-lg font-medium transition ${filter === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Poster Canvas Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredExhibits.map((exhibit) => (
            <div 
              key={exhibit.id} 
              onMouseEnter={() => setHoveredCardId(exhibit.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className="group relative bg-[#131926] rounded-2xl border border-[#1F293D] overflow-hidden flex flex-col h-[400px] transition duration-200 hover:border-gray-700"
            >
              
              {/* Card Body - Content Layout */}
              <div className={`w-full flex-1 bg-gradient-to-b ${exhibit.color} relative p-4 flex flex-col justify-between`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="flex justify-between items-center relative z-10">
                  <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/5">
                    ⚙️ {exhibit.zones} zones
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${exhibit.audioStatus === 'Ready' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${exhibit.audioStatus === 'Ready' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {exhibit.audioStatus === 'Ready' ? 'Audio' : 'Missing'}
                  </span>
                </div>

                {/* Grid Visual Indicator Bars */}
                <div className="w-full flex items-end gap-2 px-4 h-32 opacity-20 group-hover:opacity-40 transition-opacity duration-200">
                  <div className="bg-white w-full h-24 rounded-t-sm"></div>
                  <div className="bg-white w-full h-8 rounded-t-sm"></div>
                  <div className="bg-white w-full h-16 rounded-t-sm"></div>
                  <div className="bg-white w-full h-28 rounded-t-sm"></div>
                  <div className="bg-white w-full h-12 rounded-t-sm"></div>
                </div>

                {/* Smooth Action Overlay Menu */}
                <div 
                  className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center gap-3 transition-opacity duration-200 z-20 ${
                    hoveredCardId === exhibit.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <button 
                    onClick={() => setActiveExhibitView(exhibit)} 
                    className="w-44 py-2.5 bg-blue-600 hover:bg-blue-700 font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg text-sm transition text-white"
                  >
                    <Eye size={16} /> View Exhibit
                  </button>
                  <button 
                    onClick={() => setSelectedQrExhibit(exhibit)} 
                    className="w-44 py-2.5 bg-[#1F293D] hover:bg-[#2D3A54] border border-[#374151] font-medium rounded-xl flex items-center justify-center gap-2 text-sm transition text-white"
                  >
                    <QrCode size={16} /> Get QR Code
                  </button>
                </div>
              </div>

              {/* Card Static Descriptive Text Block */}
              <div className="p-5 border-t border-[#1F293D] bg-[#0E1322]">
                <h3 className={`font-bold text-base mb-1 transition-colors duration-200 ${hoveredCardId === exhibit.id ? 'text-blue-400' : 'text-gray-100'}`}>
                  {exhibit.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{exhibit.description}</p>
              </div>

            </div>
          ))}
        </section>
      </div>

      {selectedQrExhibit && (
        <QRCodeModal 
          exhibitId={selectedQrExhibit.id} 
          title={selectedQrExhibit.title} 
          onClose={() => setSelectedQrExhibit(null)} 
        />
      )}
    </div>
  );
}