import React from 'react';
import { X, Download, Share2 } from 'lucide-react';

export default function QRCodeModal({ exhibitId, title, onClose }) {
  const dynamicUrl = `https://e96eb0b9-4522-48e1-ac00-cffc7b9cde5c-${exhibitId}.web-app.com`;

  const handleDownload = () => {
    alert(`Downloading QR code asset file for: ${title}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title, url: dynamicUrl });
      } catch (err) {
        console.log("Sharing failed or cancelled.");
      }
    } else {
      navigator.clipboard.writeText(dynamicUrl);
      alert("Link copied directly to your clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#111622] border border-[#1F293D] w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#1F293D]/50 hover:bg-[#2D3A54] text-gray-400 hover:text-white border border-[#374151]/40 transition"
        >
          <X size={16} />
        </button>

        <div className="mb-5">
          <h3 className="text-lg font-bold text-white">QR Code</h3>
          <p className="text-xs text-gray-400 truncate mt-0.5">{title}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl flex items-center justify-center mx-auto w-56 h-56 border border-white/10 mb-5">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dynamicUrl)}&color=0-0-0&bgcolor=fff&qzone=1`}
            alt={`${title} QR Code`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="bg-[#0B0F19] border border-[#1F293D] rounded-xl px-3 py-2.5 mb-5 flex items-center overflow-hidden">
          <p className="text-xs text-cyan-400 font-mono select-all truncate w-full">
            {dynamicUrl}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleDownload}
            className="py-2.5 px-4 bg-[#1F293D] hover:bg-[#2D3A54] border border-[#374151] rounded-xl text-gray-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download size={14} /> Download
          </button>
          
          <button 
            onClick={handleShare}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Share2 size={14} /> Share
          </button>
        </div>

      </div>
    </div>
  );
}