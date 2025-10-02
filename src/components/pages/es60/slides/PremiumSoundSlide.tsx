"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Music, Music2, Radio, Waves, Disc3 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sound card data with correct SoundCloud URLs
const SOUND_VOICES = [
  {
    id: 'tine-ep',
    name: 'Tine EP',
    description: 'Classic Rhodes-style electric piano',
    soundCloudUrl: 'https://soundcloud.com/kawai-global/es60-04-tine-electric-piano',
    icon: Music,
    color: 'from-purple-500/20 to-pink-500/20',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500'
  },
  {
    id: 'modern-ep',
    name: 'Modern EP',
    description: 'DX-style FM electric piano',
    soundCloudUrl: 'https://soundcloud.com/kawai-global/es60-05-modern-electric-piano',
    icon: Music2,
    color: 'from-cyan-500/20 to-blue-500/20',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500'
  },
  {
    id: 'jazz-organ',
    name: 'Jazz Organ',
    description: 'Hammond-style drawbar organ',
    soundCloudUrl: 'https://soundcloud.com/kawai-global/es60-06-jazz-organ-original',
    icon: Radio,
    color: 'from-orange-500/20 to-amber-500/20',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500'
  },
  {
    id: 'clavi',
    name: 'Clavi',
    description: 'Funky Clavinet sound',
    soundCloudUrl: 'https://soundcloud.com/kawai-global/es60-10-clavi-original-kawai',
    icon: Waves,
    color: 'from-green-500/20 to-emerald-500/20',
    accentColor: 'text-green-400',
    borderColor: 'border-green-500'
  },
  {
    id: 'e-bass',
    name: 'E.Bass',
    description: 'Electric bass with authentic character',
    soundCloudUrl: 'https://soundcloud.com/kawai-global/es60-13-electric-bass-original',
    icon: Disc3,
    color: 'from-red-500/20 to-rose-500/20',
    accentColor: 'text-red-400',
    borderColor: 'border-red-500'
  }
];

// Simplified SoundCloud Widget Hook - Mobile-Optimized Approach
function useSoundCloudWidget() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Load SoundCloud API script once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script already loaded
    if ((window as any).SC) {
      console.log('[SoundCloud] API already loaded');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => console.log('[SoundCloud] API loaded');
    script.onerror = () => {
      console.error('[SoundCloud] Failed to load API');
      setError('Failed to load player');
    };

    return () => {
      // Don't remove script - it can be reused
    };
  }, []);

  // Initialize widget after iframe mounts
  useEffect(() => {
    if (!iframeRef.current || widgetRef.current) return;

    // Wait for SC to be available
    const initWidget = setInterval(() => {
      if ((window as any).SC && iframeRef.current) {
        console.log('[SoundCloud] Initializing widget...');
        const SC = (window as any).SC;

        try {
          widgetRef.current = SC.Widget(iframeRef.current);

          // Bind READY event
          widgetRef.current.bind(SC.Widget.Events.READY, () => {
            console.log('[SoundCloud] ✅ READY');
            setIsReady(true);
            setError(null);
          });

          // Bind PLAY event
          widgetRef.current.bind(SC.Widget.Events.PLAY, () => {
            console.log('[SoundCloud] Playing');
            setIsPlaying(true);
            setIsLoading(false);
          });

          // Bind PAUSE event
          widgetRef.current.bind(SC.Widget.Events.PAUSE, () => {
            console.log('[SoundCloud] Paused');
            setIsPlaying(false);
          });

          // Bind FINISH event
          widgetRef.current.bind(SC.Widget.Events.FINISH, () => {
            console.log('[SoundCloud] Finished');
            setIsPlaying(false);
          });

          // Bind ERROR event
          widgetRef.current.bind(SC.Widget.Events.ERROR, () => {
            console.error('[SoundCloud] Error playing track');
            setError('Failed to play');
            setIsLoading(false);
          });

          clearInterval(initWidget);
        } catch (err) {
          console.error('[SoundCloud] Init error:', err);
        }
      }
    }, 100);

    // Cleanup
    return () => clearInterval(initWidget);
  }, []);

  // Expose a loadAndPlay function for the parent component to call
  // This must be called synchronously within user gesture for mobile
  const loadAndPlay = useCallback((soundCloudUrl: string) => {
    if (!widgetRef.current || !isReady) {
      console.warn('[SoundCloud] Widget not ready');
      setError('Player not ready, please try again');
      return false;
    }

    console.log('[SoundCloud] Loading:', soundCloudUrl);

    // Set loading state
    setIsLoading(true);
    setError(null);

    // Stop current track before loading new one
    widgetRef.current.pause();

    // Load new track synchronously within user gesture context
    // CRITICAL: This must happen in the click handler, not in a useEffect
    widgetRef.current.load(soundCloudUrl, {
      auto_play: false, // Don't use autoplay - it's blocked on mobile
      hide_related: true,
      show_comments: false,
      show_user: false,
      show_reposts: false,
      visual: false,
      callback: () => {
        // Play explicitly after load completes (still within gesture context)
        console.log('[SoundCloud] Load complete, playing...');
        widgetRef.current?.play();

        // Fallback: try playing again after short delay for stubborn browsers
        setTimeout(() => {
          widgetRef.current?.play();
        }, 100);
      }
    });

    return true;
  }, [isReady]);

  return { isLoading, isPlaying, error, iframeRef, loadAndPlay };
}

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

  const activeVoice = SOUND_VOICES.find(v => v.id === activeVoiceId);
  const { isLoading, isPlaying, error, iframeRef, loadAndPlay } = useSoundCloudWidget();

  // Handle voice card click - coordinates parent state + widget playback
  // MUST be synchronous for mobile gesture context
  const handleVoiceClick = useCallback((voice: typeof SOUND_VOICES[0]) => {
    // Set parent component state
    setActiveVoiceId(voice.id);

    // Load and play in widget (synchronously within gesture)
    loadAndPlay(voice.soundCloudUrl);
  }, [loadAndPlay]);

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

  // Reset active voice when leaving view
  useEffect(() => {
    if (!isInView) {
      setActiveVoiceId(null);
    }
  }, [isInView]);

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

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
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
                    Only $499
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
                {/* Heading Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-center mb-8 md:mb-10"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/90 max-w-4xl mx-auto leading-tight px-4" style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}>
                    17 meticulously sampled instruments including authentic Shigeru Kawai SK-EX concert grand and premium electric pianos, organs, and more.
                  </h3>
                </motion.div>

          {/* Sound Cards Grid - Full Width */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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
                      "relative p-3 sm:p-4 md:p-6 rounded-xl border-2 transition-all duration-300",
                      "bg-black/40 backdrop-blur-sm min-h-[90px] sm:min-h-[100px] md:min-h-[120px]",
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

                    <div className="flex flex-col items-center gap-2 text-center">
                      <Icon
                        className={cn(
                          "w-9 h-9 md:w-10 md:h-10 transition-colors",
                          isActive ? voice.accentColor : "text-white/60"
                        )}
                      />
                      <div>
                        <p className={cn(
                          "text-sm sm:text-base md:text-base font-bold transition-colors",
                          isActive ? voice.accentColor : "text-white"
                        )}>
                          {voice.name}
                        </p>
                        <p className="text-xs text-white/60 mt-1 line-clamp-1 sm:line-clamp-none">
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
            className="mt-6 md:mt-12"
          >
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 md:p-6 border border-blue-500/30 max-w-3xl mx-auto">
              <WaveformVisualizer isPlaying={isPlaying} />

              {activeVoice ? (
                <div className="text-center mt-4 space-y-2">
                  <p className={cn("text-base sm:text-lg font-bold", activeVoice.accentColor)}>
                    {activeVoice.name}
                  </p>
                  <p className="text-sm text-white/70">
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
                <p className="text-center text-white/60 text-sm mt-4">
                  Tap a sound card to hear it
                </p>
              )}
            </div>
          </motion.div>

          {/* Price Display - Button Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-center mt-8 md:mt-12"
          >
            <div className="flex flex-row items-center justify-center gap-3 md:gap-4">
              {/* Crossed out original price - LEFT of button */}
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="relative text-2xl sm:text-3xl md:text-5xl font-bold text-white"
                style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}
              >
                $599
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
                className="bg-white text-red-600 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 text-base sm:text-lg md:text-xl font-bold rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 min-h-[48px]"
              >
                Only $499
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

          {/* SoundCloud player - invisible but technically visible for iOS Safari */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '1px',
            height: '1px',
            opacity: 0.01, // Slightly visible instead of 0 - iOS Safari requirement
            pointerEvents: 'none',
            zIndex: -1, // Just behind content, not -9999
            overflow: 'hidden'
            // Note: No visibility: hidden - iOS Safari blocks audio from hidden elements
          }}>
            <iframe
              ref={iframeRef}
              id="sc-widget"
              width="1"
              height="1"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              title="SoundCloud Player"
              style={{
                opacity: 0.01,
                pointerEvents: 'none'
                // Note: No visibility: hidden - critical for mobile audio
              }}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUND_VOICES[0]?.soundCloudUrl || 'https://soundcloud.com/kawai-global/es60-04-tine-electric-piano')}&color=%2359b3f6&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&show_artwork=false&show_playcount=false`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
