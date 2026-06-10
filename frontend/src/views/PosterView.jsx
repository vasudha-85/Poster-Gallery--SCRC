import React from "react"
import { useParams } from "react-router-dom"

export default function PosterView(){
  const { id } = useParams()
  return (
    <div className="min-h-screen bg-slate-900 text-sky-400 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-slate-800 rounded-lg p-4">Poster Canvas {id}</div>
        <div className="col-span-1 bg-slate-800 rounded-lg p-4">Media Panel</div>
      </div>
    </div>
  )
}
