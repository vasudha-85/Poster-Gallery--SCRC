import React from 'react';
import { X, Download, Share2 } from 'lucide-react';

export default function QRCodeModal({ url, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#131926] border border-[#1F293D] w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 bg-[#1E293B] rounded-full transition">
          <X size={16} />
        </button>
        <h3 className="text-lg font-bold mb-0.5">QR Code</h3>
        <p className="text-xs text-gray-400 mb-6">Smart City Infrastructure 2045</p>

        {/* Scaled Crisp QR Template Box */}
        <div className="bg-white p-4 rounded-2xl w-56 h-56 mx-auto mb-6 flex items-center justify-center shadow-inner">
          <div className="bg-[#0B0F19] w-full h-full rounded-lg flex items-center justify-center text-white font-mono text-[10px] p-2 text-center break-all">
            {/* Swappable container for real canvas renderer QR engine */}
            <div className="bg-black p-2 rounded">
              <div className="w-36 h-36 border-4 border-white grid grid-cols-3 p-1">
                <div className="border-4 border-white bg-black"></div>
                <div></div>
                <div className="border-4 border-white bg-black"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0F19] text-[#06B6D4] text-xs font-mono p-3 rounded-xl border border-blue-950/40 break-all mb-5 text-center">
          {url}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="py-2.5 bg-[#1F293D] hover:bg-[#2A374E] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition">
            <Download size={14} /> Download
          </button>
          <button className="py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}