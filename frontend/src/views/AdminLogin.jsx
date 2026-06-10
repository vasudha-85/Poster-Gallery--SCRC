import React from "react"

export default function AdminLogin(){
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-8 w-96">
        <h2 className="text-2xl text-sky-400 mb-4">Admin Login</h2>
        <input className="w-full p-2 mb-3 rounded bg-slate-900" placeholder="Email" />
        <input className="w-full p-2 mb-3 rounded bg-slate-900" placeholder="Password" type="password" />
        <button className="w-full bg-sky-600 text-white p-2 rounded">Sign In Securely</button>
      </div>
    </div>
  )
}
