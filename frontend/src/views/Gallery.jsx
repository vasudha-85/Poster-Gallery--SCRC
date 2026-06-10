import React from "react"

export default function Gallery(){
  return (
    <div className="min-h-screen bg-slate-900 text-sky-400 font-sans">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">QR-Play Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-lg p-4">Poster Card</div>
        </div>
      </div>
    </div>
  )
}
