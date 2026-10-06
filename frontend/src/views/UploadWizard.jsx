import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function UploadWizardBackButton({ onCancel }) {
  return (
    <button
      type="button"
      onClick={onCancel}
      aria-label="Back to previous upload step"
      className="p-2 text-gray-400 hover:text-white transition"
    >
      <ArrowLeft size={18} />
    </button>
  );
}
