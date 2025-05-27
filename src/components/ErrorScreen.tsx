import React from 'react';

interface ErrorScreenProps {
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-white max-w-md">
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
        <span className="text-white text-2xl font-bold">!</span>
      </div>
      <h2 className="text-xl font-semibold mb-2">Video Loading Error</h2>
      <p className="text-gray-300 text-center mb-6">
        We couldn't load the 360° video. This might be due to connection issues or the video may be temporarily unavailable.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};