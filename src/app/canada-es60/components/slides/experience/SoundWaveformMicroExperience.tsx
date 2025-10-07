"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SoundWaveformMicroExperienceProps {
  isActive: boolean;
}

export function SoundWaveformMicroExperience({ isActive }: SoundWaveformMicroExperienceProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Generate waveform bars
  const waveformBars = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    baseHeight: Math.sin(i / 3) * 30 + 40,
  }));

  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
      setShowComparison(false);
    }
  }, [isActive]);

  const handlePlaySound = () => {
    if (!isActive) return;
    setIsPlaying(true);
    setShowComparison(true);

    // Simulate playback duration
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-6"
      >
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          Shigeru Kawai SK-EX Concert Grand
        </h3>
        <p className="text-white/70 text-sm">
          Premium harmonic imaging for smooth tonal transitions
        </p>
      </motion.div>

      {/* Waveform Visualization */}
      <div className="relative w-full max-w-lg h-32 md:h-40 flex items-center justify-center mb-6">
        <div className="flex items-end gap-1 h-full w-full">
          {waveformBars.map((bar, index) => (
            <motion.div
              key={bar.id}
              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm"
              initial={{ height: 4 }}
              animate={{
                height: isPlaying
                  ? [
                      bar.baseHeight,
                      bar.baseHeight * 1.5,
                      bar.baseHeight * 0.7,
                      bar.baseHeight * 1.2,
                      bar.baseHeight,
                    ]
                  : bar.baseHeight * 0.3,
                opacity: isPlaying ? 1 : 0.5,
              }}
              transition={{
                duration: 0.8,
                repeat: isPlaying ? Infinity : 0,
                delay: index * 0.02,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Play indicator */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Play Button */}
      <motion.button
        className="relative px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium
                   transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                   disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handlePlaySound}
        disabled={!isActive || isPlaying}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <span className="flex items-center gap-2">
            <motion.span
              className="inline-block w-2 h-2 bg-white rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            Playing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 3.732a.75.75 0 0 1 1.152-.633l9 5.25a.75.75 0 0 1 0 1.266l-9 5.25A.75.75 0 0 1 3 14.232V3.732Z" />
            </svg>
            Experience SK-EX Sound
          </span>
        )}
      </motion.button>

      {/* Sound Comparison */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl text-center"
          >
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-1">88-key Sampling</p>
              <p className="text-xs text-white/60">Individual note recording</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-1">Harmonic Imaging</p>
              <p className="text-xs text-white/60">Smooth tonal transitions</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-1">192 Polyphony</p>
              <p className="text-xs text-white/60">Rich, layered sound</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Value Proposition */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-xs md:text-sm text-blue-400 mt-4 text-center max-w-md"
      >
        The same concert grand sound as $2000+ pianos - best sound quality under $500
      </motion.p>

      {/* SEO Content (hidden) */}
      <div className="sr-only">
        Shigeru Kawai SK-EX concert grand piano samples with harmonic imaging technology.
        Best piano sound quality under $500. 192-note polyphony for rich, authentic piano tone.
        Professional concert grand sound in an affordable digital piano.
      </div>
    </div>
  );
}
