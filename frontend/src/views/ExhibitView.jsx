import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

export default function ExhibitView({ exhibit, onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState(exhibit?.sections?.[0] || null);

  return (
    <div className="p-6 flex flex-col h-screen bg-[#0B0F19]">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Back to gallery" onClick={onBack} className="p-2 bg-[#131926] border border-[#1F293D] rounded-xl hover:bg-[#1E293B] transition text-white">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">{exhibit.title}</h2>
            <p className="text-xs text-gray-400">🌐 {exhibit?.sections?.length || 0} interactive sections</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs rounded-full font-medium">
          🔷 Rail Network
        </span>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
        {/* Map Layout canvas element */}
        <div className="lg:col-span-2 bg-[#131926] border border-[#1F293D] rounded-2xl relative overflow-hidden flex items-center justify-center p-4 min-h-[400px]">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          <div className="w-full h-full relative max-w-2xl aspect-[4/3] bg-gradient-to-b from-[#111622] to-[#0D111A] border border-slate-800 rounded-xl shadow-2xl">
            {exhibit?.sections?.map((sec, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentSection(sec)}
                className={`absolute appearance-none p-0 text-inherit cursor-pointer flex flex-col items-center justify-center transition-all ${sec.type === 'Circle' ? 'rounded-full' : 'rounded-lg'} ${currentSection?.name === sec.name ? 'ring-2 ring-white scale-[1.02] shadow-2xl' : 'opacity-70'}`}
                style={{
                  left: `${sec.x}%`,
                  top: `${sec.y}%`,
                  width: `${sec.w}%`,
                  height: `${sec.h}%`,
                  backgroundColor: `${sec.color}25`,
                  border: `2px solid ${sec.color}`
                }}
              >
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/5" style={{ color: sec.color }}>
                  {sec.name}
                </span>
              </button>
            ))}
          </div>
          <span className="absolute bottom-4 right-4 text-[10px] tracking-widest font-mono text-gray-500 uppercase bg-black/30 px-2 py-1 rounded border border-white/5">{exhibit.zones} zones</span>
        </div>

        {/* Audio Interface Sidebar block */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="bg-[#131926] border border-[#1F293D] rounded-2xl p-5 flex flex-col">
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Audio Track</h4>
            
            <div className="bg-[#0B0F19] h-24 rounded-xl flex items-center justify-center gap-[3px] px-6 mb-3 border border-[#1F293D]">
              {Array.from({ length: 34 }).map((_, i) => {
                const heights = [20, 32, 45, 22, 12, 55, 64, 40, 24, 70, 85, 50, 30, 60, 40, 20, 44, 62, 75, 40, 22, 50, 68, 30, 15, 45, 60, 35, 20, 55, 40, 25, 12, 8];
                return (
                  <div key={i} className={`w-[3px] rounded-full transition-colors duration-300 ${isPlaying && i < 14 ? 'bg-blue-500' : 'bg-gray-700'}`} style={{ height: `${heights[i % heights.length]}%` }}></div>
                );
              })}
            </div>

            <div className="flex justify-between text-[11px] font-mono text-gray-500 px-1 mb-6">
              <span>0:00</span>
              <span>{exhibit.duration}</span>
            </div>

            <div className="flex items-center justify-center gap-6 mb-2">
              <button className="text-gray-400 hover:text-white transition"><SkipBack size={18} /></button>
              <button type="button" aria-label={isPlaying ? 'Pause audio' : 'Play audio'} onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition">
                {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
              </button>
              <button className="text-gray-400 hover:text-white transition"><SkipForward size={18} /></button>
            </div>
          </div>

          {/* Timeline Chapters */}
          <div className="bg-[#131926] border border-[#1F293D] rounded-2xl p-5 flex-1 flex flex-col min-h-0">
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Timeline Chapters</h4>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {exhibit?.sections?.map((sec, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCurrentSection(sec)}
                  className={`appearance-none w-full text-left p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${currentSection?.name === sec.name ? 'bg-blue-600/10 border-blue-500/40 text-white' : 'bg-[#0E1322] border-[#1F293D] text-gray-400 hover:border-gray-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sec.color }}></span>
                    <div>
                      <p className="text-xs font-semibold text-gray-200">{sec.name}</p>
                      <p className="text-[10px] font-mono text-gray-500 mt-0.5">⏱️ {sec.start} - {sec.end}</p>
                    </div>
                  </div>
                  {currentSection?.name === sec.name && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
