
import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0E1117]/95 backdrop-blur-md">
      <div className="flex space-x-2 mb-6">
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
      </div>
      <p className="text-white font-medium text-lg text-center px-4 max-w-md">
        {message}
      </p>
    </div>
  );
};

export default LoadingOverlay;
