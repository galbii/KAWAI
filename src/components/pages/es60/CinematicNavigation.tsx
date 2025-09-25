"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Settings, 
  Bookmark, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Circle,
  CircleDot
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SceneConfig {
  id: string;
  duration: number;
  title: string;
  description: string;
  thumbnail?: string;
  keyMoments?: number[]; // Timestamps for bookmarkable moments
}

interface NavigationProps {
  scenes: SceneConfig[];
  currentScene: number;
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  onSceneChange: (sceneIndex: number) => void;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onReset: () => void;
  onBookmark?: (sceneIndex: number, timestamp: number) => void;
  bookmarks?: Array<{ scene: number; timestamp: number; title: string }>;
  hasStarted: boolean;
}

export function CinematicNavigation({
  scenes,
  currentScene,
  isPlaying,
  isMuted,
  progress,
  onSceneChange,
  onPlayPause,
  onMuteToggle,
  onReset,
  onBookmark,
  bookmarks = [],
  hasStarted
}: NavigationProps) {
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScenePreview, setShowScenePreview] = useState(false);
  const [previewScene, setPreviewScene] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    autoAdvance: true,
    showHints: true,
    audioEnabled: true,
    keyboardShortcuts: true
  });

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => {
        if (isPlaying && hasStarted) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseMove = () => resetTimeout();
    const handleKeyPress = () => resetTimeout();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);
    
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, hasStarted]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!userPreferences.keyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          onPlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentScene > 0) onSceneChange(currentScene - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentScene < scenes.length - 1) onSceneChange(currentScene + 1);
          break;
        case 'm':
          e.preventDefault();
          onMuteToggle();
          break;
        case 'r':
          e.preventDefault();
          onReset();
          break;
        case 'Escape':
          e.preventDefault();
          setShowSettings(false);
          setShowScenePreview(false);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'b':
          e.preventDefault();
          if (onBookmark) {
            onBookmark(currentScene, progress);
          }
          break;
        default:
          // Number keys 1-5 for scene selection
          const num = parseInt(e.key);
          if (num >= 1 && num <= scenes.length) {
            e.preventDefault();
            onSceneChange(num - 1);
          }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentScene, onSceneChange, onPlayPause, onMuteToggle, onReset, onBookmark, progress, scenes.length, userPreferences.keyboardShortcuts]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      onSceneChange(currentScene + 1);
    }
  };

  const previousScene = () => {
    if (currentScene > 0) {
      onSceneChange(currentScene - 1);
    }
  };

  const handleScenePreview = (sceneIndex: number) => {
    setPreviewScene(sceneIndex);
    setShowScenePreview(true);
  };

  const handleBookmarkAdd = () => {
    if (onBookmark) {
      onBookmark(currentScene, progress);
    }
  };

  return (
    <>
      {/* Main Navigation Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-md"
          >
            <div className="container mx-auto px-6 py-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/70 text-sm font-medium min-w-0">
                    {scenes[currentScene]?.title}
                  </span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500 rounded-full relative"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    >
                      {/* Bookmarks on progress bar */}
                      {bookmarks
                        .filter(bookmark => bookmark.scene === currentScene)
                        .map((bookmark, index) => (
                          <div
                            key={index}
                            className="absolute top-0 w-2 h-2 bg-yellow-400 rounded-full transform -translate-y-0.5"
                            style={{ left: `${bookmark.timestamp}%` }}
                            title={bookmark.title}
                          />
                        ))}
                    </motion.div>
                  </div>
                  <span className="text-white/70 text-xs min-w-0">
                    {currentScene + 1}/{scenes.length}
                  </span>
                </div>

                {/* Scene Navigation Dots */}
                <div className="flex justify-center gap-2 mb-4">
                  {scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      onClick={() => onSceneChange(index)}
                      onMouseEnter={() => handleScenePreview(index)}
                      className="group relative"
                      aria-label={`Go to ${scene.title}`}
                    >
                      {index === currentScene ? (
                        <CircleDot className="w-3 h-3 text-red-500" />
                      ) : (
                        <Circle className="w-3 h-3 text-white/40 group-hover:text-white/70 transition-colors" />
                      )}
                      
                      {/* Scene tooltip */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {scene.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={previousScene}
                    disabled={currentScene === 0}
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={onPlayPause}
                    size="sm"
                    className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </Button>

                  <Button
                    onClick={nextScene}
                    disabled={currentScene === scenes.length - 1}
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Center Info */}
                <div className="flex-1 text-center hidden md:block">
                  <p className="text-white text-sm font-medium">
                    {scenes[currentScene]?.description}
                  </p>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2">
                  {onBookmark && (
                    <Button
                      onClick={handleBookmarkAdd}
                      size="sm"
                      variant="ghost"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                      title="Bookmark this moment (B)"
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    onClick={onMuteToggle}
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    title="Toggle audio (M)"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    title="Toggle fullscreen (F)"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={() => setShowSettings(true)}
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={onReset}
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    title="Reset presentation (R)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-bold text-xl mb-6">Experience Settings</h3>
              
              <div className="space-y-6">
                {/* Auto-advance toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Auto-advance scenes</label>
                  <button
                    onClick={() => setUserPreferences(prev => ({ ...prev, autoAdvance: !prev.autoAdvance }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      userPreferences.autoAdvance ? 'bg-red-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      userPreferences.autoAdvance ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Show hints toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Show interaction hints</label>
                  <button
                    onClick={() => setUserPreferences(prev => ({ ...prev, showHints: !prev.showHints }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      userPreferences.showHints ? 'bg-red-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      userPreferences.showHints ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Keyboard shortcuts toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-white/80">Keyboard shortcuts</label>
                  <button
                    onClick={() => setUserPreferences(prev => ({ ...prev, keyboardShortcuts: !prev.keyboardShortcuts }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      userPreferences.keyboardShortcuts ? 'bg-red-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      userPreferences.keyboardShortcuts ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Keyboard shortcuts help */}
                {userPreferences.keyboardShortcuts && (
                  <div className="bg-white/5 rounded-lg p-4 mt-4">
                    <h4 className="text-white font-medium mb-3">Keyboard Shortcuts</h4>
                    <div className="space-y-2 text-sm text-white/70">
                      <div className="flex justify-between">
                        <span>Play/Pause</span>
                        <kbd className="bg-white/10 px-2 py-1 rounded">Space / K</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Previous/Next Scene</span>
                        <kbd className="bg-white/10 px-2 py-1 rounded">← / →</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle Audio</span>
                        <kbd className="bg-white/10 px-2 py-1 rounded">M</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Fullscreen</span>
                        <kbd className="bg-white/10 px-2 py-1 rounded">F</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Bookmark</span>
                        <kbd className="bg-white/10 px-2 py-1 rounded">B</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Reset</span>
                        <kbd className="bg-white/10 px-2 py-1 rounded">R</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Scene 1-5</span>
                        <kbd className="bg-white/10 px-2 py-1 rounded">1-5</kbd>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowSettings(false)}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
              >
                Close Settings
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene Preview Tooltip */}
      <AnimatePresence>
        {showScenePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 border border-white/20 rounded-lg p-4 max-w-xs"
            onMouseLeave={() => setShowScenePreview(false)}
          >
            <h4 className="text-white font-medium mb-2">
              {scenes[previewScene]?.title}
            </h4>
            <p className="text-white/70 text-sm">
              {scenes[previewScene]?.description}
            </p>
            {scenes[previewScene]?.thumbnail && (
              <img 
                src={scenes[previewScene].thumbnail} 
                alt={scenes[previewScene].title}
                className="w-full h-20 object-cover rounded mt-3"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookmarks List (if bookmarks exist) */}
      {bookmarks.length > 0 && (
        <div className="fixed top-4 left-4 z-40">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/80 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-3"
          >
            <h4 className="text-yellow-400 font-medium text-sm mb-2 flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Bookmarks
            </h4>
            <div className="space-y-2">
              {bookmarks.slice(0, 5).map((bookmark, index) => (
                <button
                  key={index}
                  onClick={() => onSceneChange(bookmark.scene)}
                  className="block text-white/70 hover:text-white text-xs text-left w-full"
                >
                  Scene {bookmark.scene + 1}: {bookmark.title}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default CinematicNavigation;