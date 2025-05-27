import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-white">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold mb-2">Loading Video</h2>
      <p className="text-gray-300 text-center">Preparing your 360° experience...</p>
    </div>
  );
};