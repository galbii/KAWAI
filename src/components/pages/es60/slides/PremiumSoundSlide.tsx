"use client";

import { useRef, useState, useEffect } from 'react';
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

// SoundCloud Widget Hook
function useSoundCloudWidget(activeTrackUrl: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scriptLoadedRef = useRef(false);
  const widgetReadyRef = useRef(false);
  const iframeLoadedRef = useRef(false);

  // Track iframe load state
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeLoad = () => {
      console.log('[SoundCloud] Iframe onload event fired');
      iframeLoadedRef.current = true;
    };

    // Check if already loaded
    if (iframe.contentWindow) {
      try {
        // Try to access contentWindow - if successful, iframe is loaded
        const doc = iframe.contentWindow.document;
        if (doc && doc.readyState === 'complete') {
          console.log('[SoundCloud] Iframe already loaded');
          iframeLoadedRef.current = true;
        }
      } catch (e) {
        // Cross-origin, but that's okay - still means iframe is loading
        console.log('[SoundCloud] Iframe detected (cross-origin)');
      }
    }

    iframe.addEventListener('load', handleIframeLoad);

    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
    };
  }, []);

  // Initialize SoundCloud Widget API - wait for both script AND iframe
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeWidget = () => {
      console.log('[SoundCloud] Attempting to initialize widget', {
        hasIframe: !!iframeRef.current,
        hasSC: !!(window as any).SC,
        iframeLoaded: iframeLoadedRef.current
      });

      if (!iframeRef.current) {
        console.log('[SoundCloud] Iframe not available');
        return false;
      }

      if (!iframeLoadedRef.current) {
        console.log('[SoundCloud] Iframe not loaded yet');
        return false;
      }

      try {
        const SC = (window as any).SC;
        if (!SC || !SC.Widget) {
          console.log('[SoundCloud] SC.Widget not available');
          return false;
        }

        if (widgetRef.current) {
          console.log('[SoundCloud] Widget already initialized');
          return true;
        }

        widgetRef.current = SC.Widget(iframeRef.current);
        console.log('[SoundCloud] Widget initialized successfully');

        widgetRef.current.bind(SC.Widget.Events.READY, () => {
          console.log('[SoundCloud] Widget READY event fired');
          widgetReadyRef.current = true;
          setError(null);
        });

        widgetRef.current.bind(SC.Widget.Events.PLAY, () => {
          console.log('[SoundCloud] PLAY event');
          setIsPlaying(true);
          setIsLoading(false);
        });

        widgetRef.current.bind(SC.Widget.Events.PAUSE, () => {
          console.log('[SoundCloud] PAUSE event');
          setIsPlaying(false);
        });

        widgetRef.current.bind(SC.Widget.Events.FINISH, () => {
          console.log('[SoundCloud] FINISH event');
          setIsPlaying(false);
        });

        widgetRef.current.bind(SC.Widget.Events.ERROR, (error: any) => {
          console.error('[SoundCloud] ERROR event:', error);
          setError('Failed to load audio');
          setIsLoading(false);
          setIsPlaying(false);
        });

        return true;
      } catch (err) {
        console.error('[SoundCloud] Widget initialization error:', err);
        setError('Widget initialization failed');
        return false;
      }
    };

    const loadScriptAndInit = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://w.soundcloud.com/player/api.js"]');

      if (existingScript && (window as any).SC) {
        scriptLoadedRef.current = true;
        console.log('[SoundCloud] Script already loaded, initializing...');

        // Keep trying to initialize until successful (iframe might still be loading)
        const tryInit = setInterval(() => {
          if (initializeWidget()) {
            clearInterval(tryInit);
          }
        }, 200);

        // Give up after 10 seconds
        setTimeout(() => {
          clearInterval(tryInit);
          if (!widgetRef.current) {
            console.error('[SoundCloud] Failed to initialize after 10s');
            setError('Player initialization timeout');
          }
        }, 10000);
        return;
      }

      if (scriptLoadedRef.current) return;

      console.log('[SoundCloud] Loading widget API script...');
      const script = document.createElement('script');
      script.src = 'https://w.soundcloud.com/player/api.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        scriptLoadedRef.current = true;
        console.log('[SoundCloud] Widget API loaded successfully');

        // Keep trying to initialize until successful
        const tryInit = setInterval(() => {
          if (initializeWidget()) {
            clearInterval(tryInit);
          }
        }, 200);

        // Give up after 10 seconds
        setTimeout(() => {
          clearInterval(tryInit);
          if (!widgetRef.current) {
            console.error('[SoundCloud] Failed to initialize after 10s');
            setError('Player initialization timeout');
          }
        }, 10000);
      };

      script.onerror = () => {
        console.error('[SoundCloud] Failed to load Widget API script');
        setError('Failed to load SoundCloud player');
      };
    };

    // Wait a bit for component to mount, then load script
    const mountTimeout = setTimeout(loadScriptAndInit, 100);

    return () => {
      clearTimeout(mountTimeout);
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (!widgetRef.current || !activeTrackUrl) {
      console.log('[SoundCloud] Widget or track URL not ready', {
        hasWidget: !!widgetRef.current,
        trackUrl: activeTrackUrl
      });
      return;
    }

    console.log('[SoundCloud] Loading track:', activeTrackUrl);
    setIsLoading(true);
    setError(null);

    // Wait for widget to be ready before loading
    const loadTrack = () => {
      try {
        widgetRef.current.load(activeTrackUrl, {
          auto_play: true,
          hide_related: true,
          show_comments: false,
          show_user: false,
          show_reposts: false,
          visual: false,
          buying: false,
          sharing: false,
          download: false
        });
        console.log('[SoundCloud] Track load command sent');
      } catch (err) {
        console.error('[SoundCloud] Error loading track:', err);
        setError('Failed to load track');
        setIsLoading(false);
      }
    };

    if (widgetReadyRef.current) {
      loadTrack();
    } else {
      // Wait for widget to be ready
      const checkReady = setInterval(() => {
        if (widgetReadyRef.current) {
          clearInterval(checkReady);
          loadTrack();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkReady);
        if (!widgetReadyRef.current) {
          console.error('[SoundCloud] Widget ready timeout');
          setError('Player not ready');
          setIsLoading(false);
        }
      }, 5000);
    }
  }, [activeTrackUrl]);

  return { isLoading, isPlaying, error, iframeRef };
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
  const { isLoading, isPlaying, error, iframeRef } = useSoundCloudWidget(
    activeVoice?.soundCloudUrl || null
  );

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
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
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
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/90 max-w-4xl mx-auto leading-tight px-4" style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}>
                    17 meticulously sampled instruments including authentic Shigeru Kawai SK-EX concert grand and premium electric pianos, organs, and more.
                  </h3>
                </motion.div>

          {/* Sound Cards Grid - Full Width */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {SOUND_VOICES.map((voice, index) => {
                const Icon = voice.icon;
                const isActive = activeVoiceId === voice.id;

                return (
                  <motion.button
                    key={voice.id}
                    onClick={() => setActiveVoiceId(voice.id)}
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
                      "relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300",
                      "bg-black/40 backdrop-blur-sm min-h-[100px] md:min-h-[120px]",
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
                          "w-8 h-8 md:w-10 md:h-10 transition-colors",
                          isActive ? voice.accentColor : "text-white/60"
                        )}
                      />
                      <div>
                        <p className={cn(
                          "text-sm md:text-base font-bold transition-colors",
                          isActive ? voice.accentColor : "text-white"
                        )}>
                          {voice.name}
                        </p>
                        <p className="text-xs text-white/60 mt-1 hidden md:block">
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
            className="mt-8 md:mt-12"
          >
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 md:p-6 border border-blue-500/30 max-w-3xl mx-auto">
              <WaveformVisualizer isPlaying={isPlaying} />

              {activeVoice ? (
                <div className="text-center mt-4 space-y-2">
                  <p className={cn("text-lg font-bold", activeVoice.accentColor)}>
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
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {/* Crossed out original price - LEFT of button */}
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="relative text-3xl md:text-5xl font-bold text-white"
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
                className="bg-white text-red-600 px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300"
              >
                Only $499
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

          {/* Hidden SoundCloud iframe - Always rendered for proper initialization */}
          <div className="hidden">
            <iframe
              ref={iframeRef}
              id="sc-widget"
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUND_VOICES[0]?.soundCloudUrl || 'https://soundcloud.com/kawai-global/es60-04-tine-electric-piano')}&color=%2359b3f6&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
