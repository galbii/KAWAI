"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Menu,
  X,
  MoveRight,
  Hand,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TouchInteractionsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentScene: number;
  totalScenes: number;
  progress: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onSceneChange: (scene: number) => void;
  onShowMenu: () => void;
  children: React.ReactNode;
  className?: string;
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

interface PinchGesture {
  scale: number;
  center: { x: number; y: number };
}

export function MobileTouchInteractions({
  isPlaying,
  isMuted,
  currentScene,
  totalScenes,
  progress,
  onPlayPause,
  onMuteToggle,
  onSceneChange,
  onShowMenu,
  children,
  className = ''
}: TouchInteractionsProps) {
  const [showTouchHints, setShowTouchHints] = useState(true);
  const [showMobileControls, setShowMobileControls] = useState(true);
  const [lastTap, setLastTap] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [gestureType, setGestureType] = useState<'none' | 'swipe' | 'pinch' | 'pan'>('none');

  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Auto-hide mobile controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowMobileControls(true);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowMobileControls(false);
        }
      }, 4000);
    };

    const handleTouch = () => resetTimeout();
    
    document.addEventListener('touchstart', handleTouch);
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [isPlaying]);

  // Hide touch hints after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTouchHints(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Detect device orientation
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Handle swipe gestures
  const handleSwipe = useCallback((gesture: SwipeGesture) => {
    const { direction, distance, velocity } = gesture;
    
    // Require minimum distance and velocity for intentional swipes
    if (distance < 50 || velocity < 0.5) return;

    switch (direction) {
      case 'left':
        if (currentScene < totalScenes - 1) {
          onSceneChange(currentScene + 1);
        }
        break;
      case 'right':
        if (currentScene > 0) {
          onSceneChange(currentScene - 1);
        }
        break;
      case 'up':
        onShowMenu();
        break;
      case 'down':
        // Exit fullscreen or show controls
        if (isFullscreen) {
          document.exitFullscreen?.();
          setIsFullscreen(false);
        } else {
          setShowMobileControls(!showMobileControls);
        }
        break;
    }
  }, [currentScene, totalScenes, onSceneChange, onShowMenu, isFullscreen, showMobileControls]);

  // Handle pan gestures
  const handlePan = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    setGestureType('pan');
    
    // Update pan values
    setPanX(offset.x);
    setPanY(offset.y);
    
    // Update motion values for smooth animation
    x.set(offset.x);
    y.set(offset.y);
  }, [x, y]);

  const handlePanEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);
    const absVelX = Math.abs(velocity.x);
    const absVelY = Math.abs(velocity.y);
    
    // Determine if this was a swipe gesture
    if (absVelX > 500 || absVelY > 500) {
      let direction: 'left' | 'right' | 'up' | 'down';
      
      if (absX > absY) {
        direction = offset.x > 0 ? 'right' : 'left';
      } else {
        direction = offset.y > 0 ? 'down' : 'up';
      }
      
      handleSwipe({
        direction,
        distance: Math.max(absX, absY),
        velocity: Math.max(absVelX, absVelY) / 1000
      });
    }
    
    // Reset pan position with spring animation
    x.set(0);
    y.set(0);
    setPanX(0);
    setPanY(0);
    setGestureType('none');
    setIsDragging(false);
  }, [handleSwipe, x, y]);

  // Handle double tap
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double tap detected - toggle fullscreen
      if (!isFullscreen) {
        containerRef.current?.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    }
    setLastTap(now);
  }, [lastTap, isFullscreen]);

  // Handle single tap
  const handleSingleTap = useCallback(() => {
    const timer = setTimeout(() => {
      if (Date.now() - lastTap > 300) {
        // Single tap - toggle play/pause
        onPlayPause();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [lastTap, onPlayPause]);

  // Pinch to zoom (for supported content)
  const handlePinch = useCallback((newScale: number) => {
    setZoom(Math.max(0.5, Math.min(3, newScale)));
    scale.set(zoom);
  }, [zoom, scale]);

  // Reset gesture state
  const resetGestures = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    x.set(0);
    y.set(0);
    scale.set(1);
    setGestureType('none');
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden touch-pan-y ${className}`}
    >
      {/* Main content with gesture handling */}
      <motion.div
        className="w-full h-full"
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.1}
        onDragStart={() => {
          setIsDragging(true);
          setGestureType('pan');
        }}
        onDrag={handlePan}
        onDragEnd={handlePanEnd}
        onTap={handleSingleTap}
        onTapStart={handleDoubleTap}
        style={{
          x,
          y,
          scale
        }}
        animate={{
          scale: zoom
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </motion.div>

      {/* Touch hints overlay */}
      <AnimatePresence>
        {showTouchHints && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-40 pointer-events-none"
          >
            <div className="text-center text-white space-y-6 px-6">
              <h3 className="text-xl font-bold mb-4">Touch Gestures</h3>
              
              <div className="grid grid-cols-1 gap-4 max-w-sm">
                <motion.div
                  animate={{ x: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-3 bg-black/60 rounded-lg p-3"
                >
                  <MoveRight className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <p className="font-medium">Swipe left/right</p>
                    <p className="text-sm text-white/70">Change scenes</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-3 bg-black/60 rounded-lg p-3"
                >
                  <Hand className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <p className="font-medium">Tap</p>
                    <p className="text-sm text-white/70">Play/Pause</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 0.9, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-3 bg-black/60 rounded-lg p-3"
                >
                  <Hand className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <p className="font-medium">Double tap</p>
                    <p className="text-sm text-white/70">Fullscreen</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-3 bg-black/60 rounded-lg p-3"
                >
                  <Menu className="w-6 h-6 text-yellow-400" />
                  <div className="text-left">
                    <p className="font-medium">Swipe up</p>
                    <p className="text-sm text-white/70">Open menu</p>
                  </div>
                </motion.div>
              </div>

              <Button
                onClick={() => setShowTouchHints(false)}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white mt-4"
              >
                Got it!
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile control bar */}
      <AnimatePresence>
        {showMobileControls && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-md ${
              orientation === 'landscape' ? 'pb-2' : 'pb-safe'
            }`}
          >
            {/* Progress bar */}
            <div className="px-4 pt-2 pb-2">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-4 pb-4">
              {/* Left controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => currentScene > 0 && onSceneChange(currentScene - 1)}
                  disabled={currentScene === 0}
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <Button
                  onClick={onPlayPause}
                  size="sm"
                  className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>

                <Button
                  onClick={() => currentScene < totalScenes - 1 && onSceneChange(currentScene + 1)}
                  disabled={currentScene === totalScenes - 1}
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Center info */}
              <div className="text-center text-white">
                <p className="text-sm font-medium">
                  Scene {currentScene + 1} of {totalScenes}
                </p>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={onMuteToggle}
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={() => {
                    if (!isFullscreen) {
                      containerRef.current?.requestFullscreen?.();
                      setIsFullscreen(true);
                    } else {
                      document.exitFullscreen?.();
                      setIsFullscreen(false);
                    }
                  }}
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <Maximize className="w-4 h-4" />
                </Button>

                <Button
                  onClick={onShowMenu}
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene indicator dots (mobile) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex gap-2">
          {Array.from({ length: totalScenes }, (_, i) => (
            <button
              key={i}
              onClick={() => onSceneChange(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentScene
                  ? 'bg-red-500 scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to scene ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Zoom controls (when zoomed) */}
      <AnimatePresence>
        {zoom !== 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 z-40 flex flex-col gap-2"
          >
            <Button
              onClick={() => handlePinch(zoom + 0.2)}
              size="sm"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => handlePinch(zoom - 0.2)}
              size="sm"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={resetGestures}
              size="sm"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture feedback */}
      <AnimatePresence>
        {gestureType !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="bg-black/60 rounded-full p-4">
              {gestureType === 'pan' && <Hand className="w-8 h-8 text-white" />}
              {gestureType === 'pinch' && <ZoomIn className="w-8 h-8 text-white" />}
              {gestureType === 'swipe' && <MoveRight className="w-8 h-8 text-white" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orientation change hint */}
      {orientation === 'portrait' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-16 left-4 right-4 z-30 bg-black/80 rounded-lg p-3 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Rotate your device for better experience</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default MobileTouchInteractions;