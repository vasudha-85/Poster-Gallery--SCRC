import React from 'react'

export default function Dashboard(){
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl text-white font-bold mb-6">Smart City • Interactive Exhibits</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 text-white">Active Exhibits<br/><span className="text-3xl">6</span></div>
          <div className="bg-slate-800 rounded-xl p-6 text-white">Highlight Zones<br/><span className="text-3xl">27</span></div>
          <div className="bg-slate-800 rounded-xl p-6 text-white">Audio Ready<br/><span className="text-3xl">4 / 6</span></div>
        </div>
        <h3 className="text-xl text-white mb-4">Exhibit Collection</h3>
        <div className="grid grid-cols-3 gap-6">
          {new Array(3).fill(0).map((_,i)=>(
            <div key={i} className="h-72 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 p-6"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
