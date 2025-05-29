import React, { useEffect, useRef, useState } from 'react';
import { Camera, Compass, Volume2, VolumeX, Maximize, Pause, Play } from 'lucide-react';
import { useGyroscope } from '../hooks/useGyroscope';

interface VideoPlayerProps {
  videoUrl: string;
  onError: () => void;
  autoFullscreen?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onError, autoFullscreen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { gyroscopeEnabled, toggleGyroscope, hasGyroscopeSupport } = useGyroscope(containerRef);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [controlsVisible, setControlsVisible] = useState(true);
  
  useEffect(() => {
    const embedUrl = `https://www.aparat.com/video/video/embed/videohash/j753rt8/vt/frame?hd=1&autoplay=1`;
    
    if (containerRef.current) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.className = "w-full h-full absolute top-0 left-0";
      iframe.onload = () => {
        setIsPlaying(true);
        if (autoFullscreen) {
          handleFullscreenToggle();
        }
      };
      iframe.onerror = onError;
      
      containerRef.current.appendChild(iframe);

      // Auto-hide controls after 3 seconds
      const timer = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        if (containerRef.current) {
          const iframe = containerRef.current.querySelector('iframe');
          if (iframe) {
            containerRef.current.removeChild(iframe);
          }
        }
      };
    }
  }, [videoUrl, onError, autoFullscreen]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;
      
      setRotation({
        x: rotation.x + deltaY * 0.5,
        y: rotation.y + deltaX * 0.5
      });
      
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, we would control the actual video playback
  };
  
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // In a real implementation, we would control the actual video volume
  };
  
  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseEnter = () => {
    setControlsVisible(true);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setControlsVisible(false);
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="w-full max-w-none aspect-video relative">
      <div 
        ref={containerRef}
        className="w-full h-full relative overflow-hidden bg-black rounded-lg shadow-xl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
      >
        {/* Video will be embedded here by useEffect */}
      </div>
      
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePlayPause}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button 
              onClick={handleMuteToggle}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasGyroscopeSupport && (
              <button 
                onClick={toggleGyroscope}
                className={`text-white transition-colors ${gyroscopeEnabled ? 'text-blue-400' : 'hover:text-blue-400'}`}
                aria-label={gyroscopeEnabled ? "Disable Gyroscope" : "Enable Gyroscope"}
              >
                <Compass size={24} />
              </button>
            )}
            
            <button 
              onClick={handleFullscreenToggle}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              <Maximize size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile touch instructions */}
      <div className={`absolute top-4 left-4 md:left-auto md:right-4 bg-black/60 text-white text-xs md:text-sm px-3 py-2 rounded-full pointer-events-none transition-opacity duration-300 ${
        controlsVisible ? 'opacity-70' : 'opacity-0'
      }`}>
        <div className="flex items-center space-x-2">
          <Camera size={16} />
          <span>Drag to rotate view</span>
        </div>
      </div>
    </div>
  );
};