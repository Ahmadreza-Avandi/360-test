import React, { useEffect, useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorScreen } from './components/ErrorScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoUrl = 'https://www.aparat.com/v/j753rt8';
  
  useEffect(() => {
    // Minimal loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      {isLoading ? (
        <LoadingScreen />
      ) : hasError ? (
        <ErrorScreen onRetry={() => {
          setHasError(false);
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 500);
        }} />
      ) : (
        <VideoPlayer videoUrl={videoUrl} onError={handleError} autoFullscreen autoplay />
      )}
    </div>
  );
}

export default App;