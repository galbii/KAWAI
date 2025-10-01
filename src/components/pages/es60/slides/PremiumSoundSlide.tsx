"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
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

  // Initialize SoundCloud Widget API
  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoadedRef.current) return;

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://w.soundcloud.com/player/api.js"]');
    if (existingScript) {
      scriptLoadedRef.current = true;
      if (iframeRef.current && (window as any).SC) {
        initializeWidget();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      scriptLoadedRef.current = true;
      console.log('[SoundCloud] Widget API loaded successfully');
      if (iframeRef.current && (window as any).SC) {
        initializeWidget();
      }
    };

    script.onerror = () => {
      console.error('[SoundCloud] Failed to load Widget API script');
      setError('Failed to load SoundCloud player');
    };

    function initializeWidget() {
      try {
        widgetRef.current = (window as any).SC.Widget(iframeRef.current);
        console.log('[SoundCloud] Widget initialized');

        widgetRef.current.bind((window as any).SC.Widget.Events.READY, () => {
          console.log('[SoundCloud] Widget ready');
          setError(null);
        });

        widgetRef.current.bind((window as any).SC.Widget.Events.PLAY, () => {
          console.log('[SoundCloud] Playing');
          setIsPlaying(true);
          setIsLoading(false);
        });

        widgetRef.current.bind((window as any).SC.Widget.Events.PAUSE, () => {
          console.log('[SoundCloud] Paused');
          setIsPlaying(false);
        });

        widgetRef.current.bind((window as any).SC.Widget.Events.FINISH, () => {
          console.log('[SoundCloud] Finished');
          setIsPlaying(false);
        });

        widgetRef.current.bind((window as any).SC.Widget.Events.ERROR, (error: any) => {
          console.error('[SoundCloud] Widget error:', error);
          setError('Failed to load audio');
          setIsLoading(false);
          setIsPlaying(false);
        });
      } catch (err) {
        console.error('[SoundCloud] Widget initialization error:', err);
        setError('Widget initialization failed');
      }
    }

    return () => {
      // Don't remove script on cleanup as it may be used by other instances
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (!widgetRef.current || !activeTrackUrl) return;

    console.log('[SoundCloud] Loading track:', activeTrackUrl);
    setIsLoading(true);
    setError(null);

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
    } catch (err) {
      console.error('[SoundCloud] Error loading track:', err);
      setError('Failed to load track');
      setIsLoading(false);
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

  const activeVoice = SOUND_VOICES.find(v => v.id === activeVoiceId);
  const { isLoading, isPlaying, error, iframeRef } = useSoundCloudWidget(
    activeVoice?.soundCloudUrl || null
  );

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
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
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
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30
            }}
            transition={{ duration: 1.2 }}
            className="text-center mb-12"
          >
            <p className="text-blue-400 text-sm md:text-lg font-medium mb-4 tracking-wide uppercase">
              Premium Sounds
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              <span className="block">Professional Sounds</span>
              <span className="block text-blue-400">Beyond Piano</span>
              <span className="block text-2xl md:text-3xl text-blue-300 mt-2">Only $499</span>
            </h2>
            <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              17 meticulously sampled instruments including authentic Shigeru Kawai SK-EX concert grand and premium electric pianos, organs, and more.
              <span className="text-blue-400 font-medium"> The best sound variety under $500</span> for beginners exploring different musical styles.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Sound Cards - Desktop: 3 cols, Mobile: 2 cols */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
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
                        "relative p-4 rounded-xl border-2 transition-all duration-300",
                        "bg-black/40 backdrop-blur-sm",
                        "hover:shadow-lg hover:shadow-blue-500/20",
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

            {/* Audio Player & Visualizer - Desktop: 2 cols, Mobile: Full width */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: isInView ? 1 : 0,
                x: isInView ? 0 : 50
              }}
              transition={{ delay: isInView ? 0.8 : 0, duration: 1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Waveform Visualizer */}
              <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
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
                    Click a sound card to hear it
                  </p>
                )}
              </div>

              {/* Hidden SoundCloud iframe */}
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

              {/* Additional Info */}
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-bold text-lg mb-3">Explore Musical Variety</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Perfect for beginners exploring genres beyond classical piano. From jazz standards to modern pop,
                  the ES60 gives you professional sounds to experiment with different styles and discover your musical voice.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 20
            }}
            transition={{ delay: isInView ? 1.2 : 0, duration: 1 }}
            className="text-center mt-12"
          >
            <p className="text-base md:text-lg text-white/70">
              17 premium voices • Authentic sampling • Studio-quality sound
            </p>
            <p className="text-xl md:text-2xl text-blue-400 font-bold mt-2">
              All for just $499
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
