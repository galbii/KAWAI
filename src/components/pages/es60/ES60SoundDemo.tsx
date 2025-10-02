"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

interface AudioControlState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

interface WaveformProps {
  isPlaying: boolean;
  amplitude: number;
  color: string;
}

function Waveform({ isPlaying, amplitude, color }: WaveformProps) {
  return (
    <div className="flex items-center justify-center h-16 gap-1">
      {Array.from({ length: 32 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ height: 4 }}
          animate={{
            height: isPlaying 
              ? Math.random() * amplitude * 40 + 4
              : 4,
          }}
          transition={{
            duration: 0.1,
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse",
            delay: i * 0.02,
          }}
        />
      ))}
    </div>
  );
}

export function ES60SoundDemo() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  
  // Audio refs - in real implementation, these would be actual audio elements
  const standardAudioRef = useRef<HTMLAudioElement>(null);
  const es60AudioRef = useRef<HTMLAudioElement>(null);
  
  const [standardAudio, setStandardAudio] = useState<AudioControlState>({
    isPlaying: false,
    currentTime: 0,
    duration: 30, // Mock duration
    volume: 0.7,
    isMuted: false,
  });
  
  const [es60Audio, setES60Audio] = useState<AudioControlState>({
    isPlaying: false,
    currentTime: 0,
    duration: 30, // Mock duration
    volume: 0.7,
    isMuted: false,
  });

  const [activeComparison, setActiveComparison] = useState<'standard' | 'es60' | null>(null);
  const [isLoadingStandard, setIsLoadingStandard] = useState(false);
  const [isLoadingES60, setIsLoadingES60] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Audio file paths
  const audioSamples = {
    standard: "/audio/standard-piano-sample.mp3",
    es60: "/audio/es60-skex-sample.mp3"
  };

  // Audio event handlers to track playback
  useEffect(() => {
    const standardAudio = standardAudioRef.current;
    if (!standardAudio) return;

    const updateTime = () => {
      setStandardAudio(prev => ({
        ...prev,
        currentTime: standardAudio.currentTime,
        duration: standardAudio.duration || prev.duration
      }));
    };

    const handleEnded = () => {
      setStandardAudio(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      standardAudio.currentTime = 0;
      setIsLoadingStandard(false);
    };

    const handleLoadedMetadata = () => {
      setStandardAudio(prev => ({ ...prev, duration: standardAudio.duration }));
      setIsLoadingStandard(false);
    };

    const handleLoadStart = () => {
      setIsLoadingStandard(true);
      setAudioError(null);
    };

    const handleCanPlay = () => {
      setIsLoadingStandard(false);
    };

    const handleError = () => {
      setIsLoadingStandard(false);
      setAudioError('Failed to load audio. Please check your connection.');
      setStandardAudio(prev => ({ ...prev, isPlaying: false }));
    };

    standardAudio.addEventListener('timeupdate', updateTime);
    standardAudio.addEventListener('ended', handleEnded);
    standardAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
    standardAudio.addEventListener('loadstart', handleLoadStart);
    standardAudio.addEventListener('canplay', handleCanPlay);
    standardAudio.addEventListener('error', handleError);

    return () => {
      standardAudio.removeEventListener('timeupdate', updateTime);
      standardAudio.removeEventListener('ended', handleEnded);
      standardAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      standardAudio.removeEventListener('loadstart', handleLoadStart);
      standardAudio.removeEventListener('canplay', handleCanPlay);
      standardAudio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const es60Audio = es60AudioRef.current;
    if (!es60Audio) return;

    const updateTime = () => {
      setES60Audio(prev => ({
        ...prev,
        currentTime: es60Audio.currentTime,
        duration: es60Audio.duration || prev.duration
      }));
    };

    const handleEnded = () => {
      setES60Audio(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      es60Audio.currentTime = 0;
      setIsLoadingES60(false);
    };

    const handleLoadedMetadata = () => {
      setES60Audio(prev => ({ ...prev, duration: es60Audio.duration }));
      setIsLoadingES60(false);
    };

    const handleLoadStart = () => {
      setIsLoadingES60(true);
      setAudioError(null);
    };

    const handleCanPlay = () => {
      setIsLoadingES60(false);
    };

    const handleError = () => {
      setIsLoadingES60(false);
      setAudioError('Failed to load audio. Please check your connection.');
      setES60Audio(prev => ({ ...prev, isPlaying: false }));
    };

    es60Audio.addEventListener('timeupdate', updateTime);
    es60Audio.addEventListener('ended', handleEnded);
    es60Audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    es60Audio.addEventListener('loadstart', handleLoadStart);
    es60Audio.addEventListener('canplay', handleCanPlay);
    es60Audio.addEventListener('error', handleError);

    return () => {
      es60Audio.removeEventListener('timeupdate', updateTime);
      es60Audio.removeEventListener('ended', handleEnded);
      es60Audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      es60Audio.removeEventListener('loadstart', handleLoadStart);
      es60Audio.removeEventListener('canplay', handleCanPlay);
      es60Audio.removeEventListener('error', handleError);
    };
  }, []);

  // Animation variants
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fadeInUp = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : 30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
      }
    }
  };

  const scaleIn = {
    hidden: { scale: prefersReducedMotion ? 1 : 0.95, opacity: prefersReducedMotion ? 1 : 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.4, ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number] }
    }
  };

  // Audio control functions with actual playback
  const playStandardAudio = async () => {
    // Stop ES60 audio if playing
    if (es60Audio.isPlaying && es60AudioRef.current) {
      es60AudioRef.current.pause();
      es60AudioRef.current.currentTime = 0;
      setES60Audio(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    }

    if (standardAudioRef.current) {
      if (standardAudio.isPlaying) {
        // Pause if already playing
        standardAudioRef.current.pause();
        setStandardAudio(prev => ({ ...prev, isPlaying: false }));
      } else {
        // Play audio
        setIsLoadingStandard(true);
        setAudioError(null);
        try {
          standardAudioRef.current.currentTime = 0;
          await standardAudioRef.current.play();
          setStandardAudio(prev => ({ ...prev, isPlaying: true }));
          setActiveComparison('standard');
          setIsLoadingStandard(false);
        } catch (error) {
          console.error('Failed to play standard audio:', error);
          setStandardAudio(prev => ({ ...prev, isPlaying: false }));
          setIsLoadingStandard(false);
          setAudioError('Unable to play audio. Please try again or check your browser settings.');
        }
      }
    }
  };

  const playES60Audio = async () => {
    // Stop standard audio if playing
    if (standardAudio.isPlaying && standardAudioRef.current) {
      standardAudioRef.current.pause();
      standardAudioRef.current.currentTime = 0;
      setStandardAudio(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    }

    if (es60AudioRef.current) {
      if (es60Audio.isPlaying) {
        // Pause if already playing
        es60AudioRef.current.pause();
        setES60Audio(prev => ({ ...prev, isPlaying: false }));
      } else {
        // Play audio
        setIsLoadingES60(true);
        setAudioError(null);
        try {
          es60AudioRef.current.currentTime = 0;
          await es60AudioRef.current.play();
          setES60Audio(prev => ({ ...prev, isPlaying: true }));
          setActiveComparison('es60');
          setIsLoadingES60(false);
        } catch (error) {
          console.error('Failed to play ES60 audio:', error);
          setES60Audio(prev => ({ ...prev, isPlaying: false }));
          setIsLoadingES60(false);
          setAudioError('Unable to play audio. Please try again or check your browser settings.');
        }
      }
    }
  };

  const resetComparison = () => {
    if (standardAudioRef.current) {
      standardAudioRef.current.pause();
      standardAudioRef.current.currentTime = 0;
    }
    if (es60AudioRef.current) {
      es60AudioRef.current.pause();
      es60AudioRef.current.currentTime = 0;
    }
    setStandardAudio(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    setES60Audio(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    setActiveComparison(null);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-24 relative overflow-hidden"
      style={{ backgroundColor: '#F5F2ED' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="soundwaves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 Q5 5 10 10 T20 10" stroke="#8B7355" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#soundwaves)"/>
        </svg>
      </div>

      <div className="container-brand max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#3C3530' }}>
            Hear the Difference
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#6B645C' }}>
            Experience why the ES60's Shigeru Kawai SK-EX samples deliver superior sound quality
            compared to typical digital pianos in this price range.
          </p>

          {/* Error Message */}
          {audioError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg max-w-2xl mx-auto"
              style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}
            >
              <p className="text-sm font-medium">{audioError}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Audio Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          
          {/* Standard Piano Demo */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`rounded-2xl p-8 transition-all duration-300 ${
              activeComparison === 'standard' 
                ? 'ring-2 shadow-xl' 
                : 'shadow-lg hover:shadow-xl'
            }`}
            style={{ 
              backgroundColor: '#FAF8F5',
              borderColor: activeComparison === 'standard' ? '#8B7355' : 'transparent',
              boxShadow: activeComparison === 'standard' 
                ? '0 20px 40px rgba(139, 115, 85, 0.2)' 
                : '0 10px 30px rgba(139, 115, 85, 0.1)'
            }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#3C3530' }}>
                Typical $500 Piano
              </h3>
              <p className="text-base" style={{ color: '#6B645C' }}>
                Standard digital piano sound sampling
              </p>
            </div>

            {/* Waveform Visualization */}
            <div className="mb-6">
              <Waveform 
                isPlaying={standardAudio.isPlaying} 
                amplitude={0.6}
                color="#A8A5A0"
              />
            </div>

            {/* Audio Controls */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={playStandardAudio}
                disabled={isLoadingStandard}
                className="flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#A8A5A0',
                  color: '#FAF8F5',
                  boxShadow: '0 4px 15px rgba(168, 165, 160, 0.3)'
                }}
                aria-label={standardAudio.isPlaying ? "Pause standard piano" : "Play standard piano"}
              >
                {isLoadingStandard ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : standardAudio.isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>

              {/* Progress Bar */}
              <div className="w-full">
                <div 
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#E8E3DB' }}
                >
                  <div 
                    className="h-full transition-all duration-100 rounded-full"
                    style={{ 
                      backgroundColor: '#A8A5A0',
                      width: `${(standardAudio.currentTime / standardAudio.duration) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-2" style={{ color: '#6B645C' }}>
                  <span>{Math.floor(standardAudio.currentTime)}s</span>
                  <span>{standardAudio.duration}s</span>
                </div>
              </div>
            </div>

            {/* Quality Indicators */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E8E3DB' }}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium" style={{ color: '#6B645C' }}>Quality:</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map((star) => (
                      <div 
                        key={star}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: star <= 2 ? '#A8A5A0' : '#E8E3DB' }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{ color: '#6B645C' }}>Richness:</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map((star) => (
                      <div 
                        key={star}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: star <= 1 ? '#A8A5A0' : '#E8E3DB' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ES60 Piano Demo */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`rounded-2xl p-8 transition-all duration-300 ${
              activeComparison === 'es60' 
                ? 'ring-2 shadow-xl' 
                : 'shadow-lg hover:shadow-xl'
            }`}
            style={{
              backgroundColor: '#FAF8F5',
              borderColor: activeComparison === 'es60' ? '#E11922' : 'transparent',
              boxShadow: activeComparison === 'es60'
                ? '0 20px 40px rgba(225, 25, 34, 0.2)'
                : '0 10px 30px rgba(139, 115, 85, 0.1)'
            }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#3C3530' }}>
                ES60 with SK-EX Samples
              </h3>
              <p className="text-base" style={{ color: '#6B645C' }}>
                Authentic Shigeru Kawai concert grand recordings
              </p>
            </div>

            {/* Waveform Visualization */}
            <div className="mb-6">
              <Waveform
                isPlaying={es60Audio.isPlaying}
                amplitude={1.0}
                color="#E11922"
              />
            </div>

            {/* Audio Controls */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={playES60Audio}
                disabled={isLoadingES60}
                className="flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#E11922',
                  color: '#FAF8F5',
                  boxShadow: '0 4px 15px rgba(225, 25, 34, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!isLoadingES60) e.currentTarget.style.backgroundColor = '#C7161F';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#E11922';
                }}
                aria-label={es60Audio.isPlaying ? "Pause ES60 piano" : "Play ES60 piano"}
              >
                {isLoadingES60 ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : es60Audio.isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>

              {/* Progress Bar */}
              <div className="w-full">
                <div 
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#E8E3DB' }}
                >
                  <div
                    className="h-full transition-all duration-100 rounded-full"
                    style={{
                      backgroundColor: '#E11922',
                      width: `${(es60Audio.currentTime / es60Audio.duration) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-2" style={{ color: '#6B645C' }}>
                  <span>{Math.floor(es60Audio.currentTime)}s</span>
                  <span>{es60Audio.duration}s</span>
                </div>
              </div>
            </div>

            {/* Quality Indicators */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E8E3DB' }}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium" style={{ color: '#6B645C' }}>Quality:</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map((star) => (
                      <div
                        key={star}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#E11922' }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium" style={{ color: '#6B645C' }}>Richness:</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map((star) => (
                      <div 
                        key={star}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#E11922' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Badge */}
            <div 
              className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              style={{ backgroundColor: '#E11922', color: '#FAF8F5' }}
            >
              Premium
            </div>
          </motion.div>
        </div>

        {/* Comparison Controls */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={resetComparison}
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: '#8B7355',
                color: '#FAF8F5',
                boxShadow: '0 4px 15px rgba(139, 115, 85, 0.2)'
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Comparison
            </button>
          </div>

          <div 
            className="rounded-xl p-6 max-w-2xl mx-auto"
            style={{ backgroundColor: '#FAF8F5', border: '1px solid #E8E3DB' }}
          >
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#3C3530' }}>
              What You're Hearing
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#6B645C' }}>
              The ES60 features authentic recordings from the world-renowned Shigeru Kawai SK-EX concert grand piano. 
              These samples capture the full dynamic range, harmonic complexity, and tonal character that makes 
              the difference between a good digital piano and an extraordinary one.
            </p>
          </div>
        </motion.div>

        {/* Audio elements with proper configuration for mobile */}
        <audio
          ref={standardAudioRef}
          preload="auto"
          playsInline
          crossOrigin="anonymous"
        >
          <source src={audioSamples.standard} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <audio
          ref={es60AudioRef}
          preload="auto"
          playsInline
          crossOrigin="anonymous"
        >
          <source src={audioSamples.es60} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </section>
  );
}