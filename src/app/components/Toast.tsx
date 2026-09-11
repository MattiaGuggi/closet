'use client';

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | string;
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-5 fade-in duration-300">
      {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
      {type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
      
      <span className="text-sm font-medium">{message}</span>
      
      <button 
        onClick={onClose}
        className="ml-2 text-zinc-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;