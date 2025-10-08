"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Music, Music2, Radio, Waves, Disc3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

// Sound card data with local audio files
const SOUND_VOICES = [
  {
    id: 'tine-ep',
    name: 'Tine EP',
    description: 'Classic Rhodes-style electric piano',
    audioUrl: '/sounds/es60/tine-ep.mp3',
    icon: Music,
    color: 'from-purple-500/20 to-pink-500/20',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500'
  },
  {
    id: 'modern-ep',
    name: 'Modern EP',
    description: 'DX-style FM electric piano',
    audioUrl: '/sounds/es60/modern-ep.mp3',
    icon: Music2,
    color: 'from-cyan-500/20 to-blue-500/20',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500'
  },
  {
    id: 'jazz-organ',
    name: 'Jazz Organ',
    description: 'Hammond-style drawbar organ',
    audioUrl: '/sounds/es60/jazz-organ.mp3',
    icon: Radio,
    color: 'from-orange-500/20 to-amber-500/20',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500'
  },
  {
    id: 'clavi',
    name: 'Clavi',
    description: 'Funky Clavinet sound',
    audioUrl: '/sounds/es60/clavi.mp3',
    icon: Waves,
    color: 'from-green-500/20 to-emerald-500/20',
    accentColor: 'text-green-400',
    borderColor: 'border-green-500'
  },
  {
    id: 'e-bass',
    name: 'E.Bass',
    description: 'Electric bass with authentic character',
    audioUrl: '/sounds/es60/e-bass.mp3',
    icon: Disc3,
    color: 'from-red-500/20 to-rose-500/20',
    accentColor: 'text-red-400',
    borderColor: 'border-red-500'
  }
] as const;

// Waveform Visualization Component
function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = 10;

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-full"
          animate={{
            height: isPlaying
              ? [
                  `${20 + Math.random() * 30}%`,
                  `${40 + Math.random() * 60}%`,
                  `${20 + Math.random() * 30}%`
                ]
              : '20%',
            opacity: isPlaying ? [0.5, 1, 0.5] : 0.3
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.05
          }}
        />
      ))}
    </div>
  );
}

export function PremiumSoundSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showHeaderText, setShowHeaderText] = useState(true);
  const [showSoundUI, setShowSoundUI] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const activeVoice = SOUND_VOICES.find(v => v.id === activeVoiceId);
  const { isLoading, isPlaying, error, play, stop } = useAudioPlayer();

  // Handle voice card click - coordinates parent state + audio playback with toggle behavior
  const handleVoiceClick = useCallback((voice: { id: string; audioUrl: string }) => {
    // Check if clicking the same card that's already active - toggle it off
    if (activeVoiceId === voice.id) {
      stop();
      setActiveVoiceId(null);
      console.log('[Audio] Stopped and deselected:', voice.id);
      return;
    }

    // Mark audio as unlocked on first interaction (iOS requirement)
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      console.log('[Audio] Audio unlocked by user interaction');
    }

    // Set parent component state
    setActiveVoiceId(voice.id);

    // Play audio (works reliably on iOS)
    play(voice.audioUrl);
    console.log('[Audio] Playing:', voice.id);
  }, [play, stop, audioUnlocked, activeVoiceId]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect prefers-reduced-motion setting
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Control animation sequence: header text → fade out → sound UI
  useEffect(() => {
    if (isInView) {
      // Show header text initially
      setShowHeaderText(true);
      setShowSoundUI(false);

      // Hide header text after 1.5 seconds
      const hideHeaderTimer = setTimeout(() => {
        setShowHeaderText(false);
      }, 1500);

      // Show sound UI after header fades (at 2 seconds)
      const showUITimer = setTimeout(() => {
        setShowSoundUI(true);
      }, 2000);

      return () => {
        clearTimeout(hideHeaderTimer);
        clearTimeout(showUITimer);
      };
    } else {
      // Reset when slide goes out of view
      setShowHeaderText(true);
      setShowSoundUI(false);
      return undefined;
    }
  }, [isInView]);

  // Stop audio and reset state when leaving view
  useEffect(() => {
    if (!isInView) {
      stop();
      setActiveVoiceId(null);
    }
  }, [isInView, stop]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden scroll-snap-slide"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 1.5 }}
    >
      {/* Ambient Background Particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-20">
          {[...Array(isMobile ? 15 : 50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: isInView ? [0, 1.5, 0] : 0,
                opacity: isInView ? [0, 0.8, 0] : 0,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: isInView ? Infinity : 0,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Radial gradient ambiance */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isInView ? [
              'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 40%, rgba(59,130,246,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)'
            ] : 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 50%)'
          }}
          transition={{ duration: 6, repeat: isInView ? Infinity : 0 }}
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center py-8 md:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          {/* Header Text - Shows first, then fades out */}
          <AnimatePresence>
            {showHeaderText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center max-w-4xl mx-auto px-6">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-blue-400 text-sm md:text-lg font-medium mb-4 tracking-wide uppercase"
                    style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.5)' }}
                  >
                    Premium Sounds
                  </motion.p>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                    style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}
                  >
                    <span className="block">Professional Sounds</span>
                    <span className="block text-blue-400">Beyond Piano</span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-2xl md:text-3xl text-blue-300 font-bold"
                    style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}
                  >
                    Only $799
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sound UI - Shows after header fades */}
          <AnimatePresence>
            {showSoundUI && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="w-full"
              >
                {/* Heading Text - Hidden on mobile to prevent cutoff */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-center mb-8 md:mb-10 hidden md:block"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/90 max-w-4xl mx-auto leading-tight px-4" style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}>
                    17 meticulously sampled instruments including authentic Shigeru Kawai SK-EX concert grand and premium electric pianos, organs, and more.
                  </h3>
                </motion.div>

          {/* Sound Cards Grid - Full Width */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
              {SOUND_VOICES.map((voice, index) => {
                const Icon = voice.icon;
                const isActive = activeVoiceId === voice.id;

                return (
                  <motion.button
                    key={voice.id}
                    onClick={() => handleVoiceClick(voice)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      scale: isInView ? 1 : 0.8
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      delay: isInView ? index * 0.1 : 0,
                      duration: 0.5
                    }}
                    className={cn(
                      "relative p-2 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300",
                      "bg-black/40 backdrop-blur-sm min-h-[70px] sm:min-h-[100px] md:min-h-[120px]",
                      "hover:shadow-lg hover:shadow-blue-500/20 active:scale-95",
                      "touch-manipulation",
                      isActive
                        ? `${voice.borderColor} bg-gradient-to-br ${voice.color} shadow-xl`
                        : "border-white/20 hover:border-blue-400/50"
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}

                    {/* Glow effect */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl -z-10 blur-xl"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          background: `linear-gradient(135deg, ${voice.color})`
                        }}
                      />
                    )}

                    <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
                      <Icon
                        className={cn(
                          "w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-colors",
                          isActive ? voice.accentColor : "text-white/60"
                        )}
                      />
                      <div>
                        <p className={cn(
                          "text-xs sm:text-sm md:text-base font-bold transition-colors",
                          isActive ? voice.accentColor : "text-white"
                        )}>
                          {voice.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-none">
                          {voice.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Waveform Visualizer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-3 sm:mt-6 md:mt-12"
          >
            <div className="bg-black/60 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-blue-500/30 max-w-3xl mx-auto">
              <WaveformVisualizer isPlaying={isPlaying} />

              {activeVoice ? (
                <div className="text-center mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  <p className={cn("text-sm sm:text-base md:text-lg font-bold", activeVoice.accentColor)}>
                    {activeVoice.name}
                  </p>
                  <p className="text-xs sm:text-sm text-white/70">
                    {activeVoice.description}
                  </p>
                  {isLoading && (
                    <p className="text-xs text-blue-400 animate-pulse">Loading...</p>
                  )}
                  {error && (
                    <p className="text-xs text-red-400">{error}</p>
                  )}
                </div>
              ) : (
                <div className="text-center mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  <p className="text-white/60 text-xs sm:text-sm">
                    Tap a sound card to hear it
                  </p>
                  {isMobile && !audioUnlocked && (
                    <p className="text-[10px] sm:text-xs text-blue-400/80">
                      🎵 First tap unlocks audio on mobile
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Price Display - Button Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-center mt-4 sm:mt-8 md:mt-12"
          >
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
              {/* Crossed out original price - LEFT of button */}
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="relative text-xl sm:text-2xl md:text-5xl font-bold text-white"
                style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}
              >
                $999
                <motion.div
                  className="absolute top-1/2 left-0 right-0 h-1 bg-red-500 transform -translate-y-1/2"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                  style={{
                    transformOrigin: 'left',
                    boxShadow: '0 0 8px rgba(225, 25, 34, 0.8)'
                  }}
                />
              </motion.span>

              {/* Price Button */}
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 1.7,
                  duration: 0.6,
                  type: "spring"
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-600 px-4 sm:px-6 md:px-12 py-2 sm:py-3 md:py-6 text-sm sm:text-base md:text-xl font-bold rounded-xl sm:rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 min-h-[44px] sm:min-h-[48px]"
              >
                Only $799
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
}
