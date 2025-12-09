import React, { useState } from 'react';
import { Wifi, Copy, Check } from 'lucide-react';
import { WIFI_SSID } from '../types';

export const WifiCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(WIFI_SSID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-md mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-blue-500/20 rounded-full">
          <Wifi className="w-5 h-5 text-blue-300" />
        </div>
        <span className="font-bold text-sm text-blue-100 uppercase tracking-wider">Free Wi-Fi</span>
      </div>
      
      <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/5">
        <code className="text-lg font-mono font-bold text-white">{WIFI_SSID}</code>
        <button 
          onClick={handleCopy}
          className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          aria-label="Copy Wi-Fi SSID"
        >
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-300" />}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        SSIDをタップまたはボタンでコピーできます
      </p>
    </div>
  );
};