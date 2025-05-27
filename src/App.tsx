import React, { useEffect, useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorScreen } from './components/ErrorScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoUrl = 'https://www.aparat.com/v/j753rt8';
  
  useEffect(() => {
    // Shorter loading time since we want to get to the video quickly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {isLoading ? (
        <LoadingScreen />
      ) : hasError ? (
        <ErrorScreen onRetry={() => {
          setHasError(false);
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 1000);
        }} />
      ) : (
        <VideoPlayer videoUrl={videoUrl} onError={handleError} autoFullscreen />
      )}
    </div>
  );
}

export default App;