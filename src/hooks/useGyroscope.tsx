import { useState, useEffect, RefObject } from 'react';

export const useGyroscope = (containerRef: RefObject<HTMLDivElement>) => {
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);
  const [hasGyroscopeSupport, setHasGyroscopeSupport] = useState(false);
  
  useEffect(() => {
    // Check if device has gyroscope
    if (window.DeviceOrientationEvent) {
      // For iOS 13+ devices, we need to request permission
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        setHasGyroscopeSupport(true);
      } else {
        // For non-iOS devices
        setHasGyroscopeSupport(true);
      }
    }
  }, []);
  
  const requestGyroscopePermission = async () => {
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting gyroscope permission:', error);
        return false;
      }
    }
    return true;
  };
  
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (!containerRef.current || !gyroscopeEnabled) return;
    
    const beta = event.beta; // X-axis rotation (-180 to 180)
    const gamma = event.gamma; // Y-axis rotation (-90 to 90)
    
    if (beta !== null && gamma !== null) {
      // Apply rotation based on device orientation
      containerRef.current.style.transform = `rotateX(${beta}deg) rotateY(${gamma}deg)`;
    }
  };
  
  const toggleGyroscope = async () => {
    if (gyroscopeEnabled) {
      // Disable gyroscope
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      setGyroscopeEnabled(false);
      
      // Reset the container rotation
      if (containerRef.current) {
        containerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
    } else {
      // Enable gyroscope
      const permissionGranted = await requestGyroscopePermission();
      
      if (permissionGranted) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        setGyroscopeEnabled(true);
      }
    }
  };
  
  useEffect(() => {
    return () => {
      if (gyroscopeEnabled) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [gyroscopeEnabled, handleDeviceOrientation]);
  
  return { gyroscopeEnabled, toggleGyroscope, hasGyroscopeSupport };
};