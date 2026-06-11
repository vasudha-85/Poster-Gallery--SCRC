import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBack }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLoginSuccess();
    } else {
      setError('Invalid administrative password token specified.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-95">
      <div className="w-full max-w-md bg-[#131926] border border-[#1F293D] rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-600/20 mb-3">
            ⚡
          </div>
          <h2 className="text-xl font-bold">QR-Play Admin</h2>
          <p className="text-xs text-gray-500 mt-0.5">Secure Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Administrator Login</label>
            <p className="text-[11px] text-gray-500 mb-3">Enter your credentials to access the admin panel.</p>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-gray-200 placeholder-gray-600"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-gray-600 font-mono mt-2">Demo password: admin123</p>
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/10">
            Sign In Securely
          </button>
        </form>

        <button onClick={onBack} className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mx-auto transition">
          <ArrowLeft size={12} /> Back to Gallery
        </button>
      </div>
    </div>
  );
}