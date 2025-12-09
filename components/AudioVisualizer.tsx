import React from 'react';

export const AudioVisualizer: React.FC = () => {
  return (
    <div className="flex justify-center items-end space-x-1 h-8 mb-4">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="w-2 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full audio-bar"
          style={{ animationDelay: `${i * 0.1}s`, opacity: 0.8 }}
        ></div>
      ))}
    </div>
  );
};