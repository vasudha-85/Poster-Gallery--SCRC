import React, { useState } from 'react';
import { Layers, Radio, CheckCircle, AlertCircle, Eye, QrCode } from 'lucide-react';
import QRCodeModal from './QRCodeModal';

export default function GalleryView({ exhibits, onSelect, onAdminClick }) {
  const [filter, setFilter] = useState('All');
  const [qrModalUrl, setQrModalUrl] = useState(null);

  const filteredExhibits = exhibits.filter(ex => {
    if (filter === 'Ready') return ex.audioStatus === 'Ready';
    if (filter === 'Pending') return ex.audioStatus === 'Missing';
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Interactive Poster Gallery</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          Scan, explore, and interact with immersive city exhibits through spatial audio and layered overlays.
        </p>
      </header>

      {/* Aggregate Analytical Counters */}
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
            <h3 className="text-3xl font-bold">4 / {exhibits.length}</h3>
            <span className="text-xs text-amber-500 mt-1 inline-block">2 tracks pending</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle size={20} /></div>
        </div>
      </section>

      {/* Catalog Filter Controls */}
      <section className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Exhibit Collection</h2>
          <p className="text-xs text-gray-400">{filteredExhibits.length} exhibits available</p>
        </div>
        <div className="flex gap-1 bg-[#131926] p-1 rounded-xl border border-[#1F293D] text-xs">
          {['All', 'Ready', 'Pending'].map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-lg font-medium transition ${filter === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Exhibit Cards Grid Layout */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredExhibits.map((exhibit) => (
          <div key={exhibit.id} className="group relative bg-[#131926] rounded-2xl border border-[#1F293D] overflow-hidden flex flex-col h-[400px] transition hover:border-gray-700">
            {/* Visual Simulated Mock Blueprint Grid Background */}
            <div className={`w-full flex-1 bg-gradient-to-b ${exhibit.color} relative p-4 flex flex-col justify-between`}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Dynamic Badges */}
              <div className="flex justify-between items-center relative z-10">
                <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/5">
                  📁 {exhibit.zones} zones
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${exhibit.audioStatus === 'Ready' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${exhibit.audioStatus === 'Ready' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  {exhibit.audioStatus === 'Ready' ? 'Audio' : 'Missing'}
                </span>
              </div>

              {/* Graphical Simulated Layout Columns bar representation */}
              <div className="w-full flex items-end gap-2 px-4 h-32 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="bg-white w-full h-24 rounded-t-sm"></div>
                <div className="bg-white w-full h-8 rounded-t-sm"></div>
                <div className="bg-white w-full h-16 rounded-t-sm"></div>
                <div className="bg-white w-full h-28 rounded-t-sm"></div>
                <div className="bg-white w-full h-12 rounded-t-sm"></div>
              </div>

              {/* Action Hover Glassmorphism Controls Panel */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-3 transition-opacity duration-200 z-20">
                <button onClick={() => onSelect(exhibit)} className="w-44 py-2.5 bg-blue-600 hover:bg-blue-700 font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg text-sm transition">
                  <Eye size={16} /> View Exhibit
                </button>
                <button onClick={() => setQrModalUrl(`https://e96eb0b9-4522-48e1-ac00-cffc7b9cde5c-${exhibit.id}`)} className="w-44 py-2.5 bg-[#1F293D] hover:bg-[#2D3A54] border border-[#374151] font-medium rounded-xl flex items-center justify-center gap-2 text-sm transition">
                  <QrCode size={16} /> Get QR Code
                </button>
              </div>
            </div>

            {/* Static Information Footer text details */}
            <div className="p-5 border-t border-[#1F293D] bg-[#0E1322]">
              <h3 className="font-bold text-base mb-1 group-hover:text-blue-400 transition-colors">{exhibit.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{exhibit.description}</p>
            </div>
          </div>
        ))}
      </section>

      {qrModalUrl && <QRCodeModal url={qrModalUrl} onClose={() => setQrModalUrl(null)} />}
    </div>
  );
}