import React, { useState } from 'react';
import { AlertTriangle, Save, Plus, X } from 'lucide-react';

export default function CanvasEditor({ exhibit, onSave, onCancel }) {
  const [sections, setSections] = useState(exhibit.sections);
  const [selectedSection, setSelectedSection] = useState(exhibit.sections[1] || null);

  const handleUpdateField = (field, value) => {
    if (!selectedSection) return;
    const updated = { ...selectedSection, [field]: value };
    setSelectedSection(updated);
    setSections(prev => prev.map(s => s.name === selectedSection.name ? updated : s));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0B0F19]">
      {/* Top Fixed Control Ribbon */}
      <header className="h-16 border-b border-[#1F293D] bg-[#131926] px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <h2 className="text-sm font-bold text-gray-200">{exhibit.title} <span className="text-xs font-normal text-gray-500 ml-1">— Canvas Editor</span></h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-3.5 py-1.5 border border-[#1F293D] text-gray-400 hover:text-white text-xs font-medium rounded-lg flex items-center gap-1.5 bg-[#0E1322] hover:bg-[#1A2333] transition">
            <AlertTriangle size={13} className="text-amber-500" /> Discard Changes
          </button>
          <button onClick={() => onSave(exhibit.id, sections)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-lg">
            <Save size={13} /> Save Configuration
          </button>
        </div>
      </header>

      {/* Full Workspace Frame Splitter columns */}
      <div className="flex-1 flex min-h-0 w-full">
        
        {/* Left Hand Sidebar Iterator Layout List blocks */}
        <aside className="w-64 border-r border-[#1F293D] bg-[#0E1322] p-4 flex flex-col justify-between shrink-0">
          <div className="flex flex-col min-h-0">
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">Sections ({sections.length})</h4>
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedSection(sec)}
                  className={`group w-full text-left px-3 py-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${selectedSection?.name === sec.name ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-[#131926]/50 border-transparent text-gray-400 hover:border-[#1F293D]'}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sec.color }}></span>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-gray-200 truncate">{sec.name}</p>
                      <p className="text-[9px] font-mono text-gray-500 mt-0.5">{sec.start}-{sec.end}</p>
                    </div>
                  </div>
                  <X size={12} className="text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-[#131926] border border-[#1F293D] hover:bg-[#1C263B] text-xs font-semibold text-gray-300 rounded-xl flex items-center justify-center gap-1.5 transition">
            <Plus size={13} /> Add New Section
          </button>
        </aside>

        {/* Center Interactive Drawing Canvas Node Container board element */}
        <div className="flex-1 bg-[#090D16] p-6 flex items-center justify-center relative overflow-hidden min-w-0">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>
          
          <div className="w-full h-full max-w-xl aspect-[3.5/4] bg-gradient-to-b from-[#111726] to-[#0D121F] border border-[#1F293D] rounded-2xl shadow-2xl relative p-4">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedSection(sec)}
                className={`absolute flex flex-col items-center justify-center transition-all ${sec.type === 'Circle' ? 'rounded-full' : 'rounded-lg'} ${selectedSection?.name === sec.name ? 'ring-2 ring-emerald-400 scale-[1.01] shadow-2xl z-20' : 'opacity-60 hover:opacity-80 z-10'}`}
                style={{
                  left: `${sec.x}%`,
                  top: `${sec.y}%`,
                  width: `${sec.w}%`,
                  height: `${sec.h}%`,
                  backgroundColor: `${sec.color}20`,
                  border: `2px solid ${sec.color}`
                }}
              >
                {selectedSection?.name === sec.name && (
                  <>
                    <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></span>
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></span>
                    <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></span>
                    <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></span>
                  </>
                )}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/5" style={{ color: sec.color }}>
                  {sec.name}
                </span>
              </div>
            ))}
            <span className="absolute bottom-3 right-4 text-[9px] font-mono text-gray-600 uppercase tracking-widest">5 zones</span>
          </div>
        </div>

        {/* Right Hand Inspector Property Panel Sidebar block layout column container */}
        <aside className="w-72 border-l border-[#1F293D] bg-[#131926] p-5 flex flex-col gap-5 overflow-y-auto shrink-0">
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Inspector</h4>
            <p className="text-[11px] text-gray-400">Modify properties of the active highlight block mapping.</p>
          </div>

          {selectedSection ? (
            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-gray-400 text-[11px] mb-1.5">Section Label</label>
                <input
                  type="text"
                  value={selectedSection.name}
                  onChange={(e) => handleUpdateField('name', e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 text-gray-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] mb-1.5">Shape Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Rect', 'Circle'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleUpdateField('type', t)}
                      className={`py-2 rounded-xl border text-[11px] font-semibold transition ${selectedSection.type === t ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#0B0F19] border-[#1F293D] text-gray-400 hover:text-white'}`}
                    >
                      {t === 'Rect' ? '🔳 Rect' : '🟡 Circle'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-400 text-[11px] mb-1">
                  <span>Time Range</span>
                  <span className="font-mono text-blue-400 font-semibold">{selectedSection.start} - {selectedSection.end}</span>
                </div>
                <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#1F293D] space-y-2">
                  <input type="range" min="0" max="100" className="w-full accent-blue-500" />
                  <div className="flex justify-between text-[10px] font-mono text-gray-600">
                    <span>0s</span>
                    <span>185s</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] mb-1.5">Border Color</label>
                <div className="flex items-center gap-3 bg-[#0B0F19] p-2 rounded-xl border border-[#1F293D]">
                  <input
                    type="color"
                    value={selectedSection.color}
                    onChange={(e) => handleUpdateField('color', e.target.value)}
                    className="w-7 h-7 rounded border border-transparent bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-gray-300 text-xs uppercase">{selectedSection.color}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] mb-1.5">Background Opacity</label>
                <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#1F293D] space-y-1">
                  <input type="range" min="0" max="100" defaultValue="25" className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>0%</span>
                    <span>25%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1F293D]">
                <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Geometry (% canvas)</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px] text-gray-400 bg-[#0B0F19] p-3 rounded-xl border border-[#1F293D]">
                  <div className="flex justify-between"><span>X:</span> <span className="text-gray-300 font-semibold">{selectedSection.x}.0%</span></div>
                  <div className="flex justify-between"><span>Y:</span> <span className="text-gray-300 font-semibold">{selectedSection.y}.0%</span></div>
                  <div className="flex justify-between"><span>W:</span> <span className="text-gray-300 font-semibold">{selectedSection.w}.0%</span></div>
                  <div className="flex justify-between"><span>H:</span> <span className="text-gray-300 font-semibold">{selectedSection.h}.0%</span></div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic text-center py-6">Select a region element to inspect properties.</p>
          )}
        </aside>
      </div>
    </div>
  );
}