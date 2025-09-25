"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Headphones, Music, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SceneConfig {
  id: string;
  duration: number;
  title: string;
  description: string;
}

const SCENES: SceneConfig[] = [
  { id: 'opening', duration: 8000, title: 'Opening', description: 'Logo & Tagline Introduction' },
  { id: 'heritage', duration: 12000, title: 'Heritage', description: 'Concert Grand Legacy' },
  { id: 'transformation', duration: 15000, title: 'Innovation', description: 'ES60 Transformation' },
  { id: 'experience', duration: 10000, title: 'Experience', description: 'Sound & Feel Demo' },
  { id: 'finale', duration: 8000, title: 'Finale', description: 'Call to Action' }
];

export function ES60CinematicPresentation() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Start the cinematic experience
  const startPresentation = useCallback(() => {
    setHasStarted(true);
    setIsPlaying(true);
    setCurrentScene(0);
    setProgress(0);
    
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.log);
    }
  }, [isMuted]);

  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying || !hasStarted) return;

    const scene = SCENES[currentScene];
    if (!scene) return;

    // Progress tracking
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (scene.duration / 100));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    // Scene advancement
    timeoutRef.current = setTimeout(() => {
      setProgress(0);
      if (currentScene < SCENES.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, scene.duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentScene, isPlaying, hasStarted]);

  const togglePlayPause = () => {
    if (!hasStarted) {
      startPresentation();
      return;
    }
    
    setIsPlaying(!isPlaying);
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else if (!isMuted) {
        audioRef.current.play().catch(console.log);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const resetPresentation = () => {
    setCurrentScene(0);
    setProgress(0);
    setIsPlaying(false);
    setHasStarted(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ willChange: 'transform' }}
    >
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        preload="auto"
        className="hidden"
      >
        <source src="/audio/es60-ambient.mp3" type="audio/mpeg" />
      </audio>

      {/* Scene: Opening Logo & Tagline */}
      <AnimatePresence mode="wait">
        {currentScene === 0 && (
          <OpeningScene 
            key="opening"
            isActive={isPlaying}
            progress={progress}
          />
        )}

        {currentScene === 1 && (
          <HeritageScene 
            key="heritage"
            isActive={isPlaying}
            progress={progress}
          />
        )}

        {currentScene === 2 && (
          <TransformationScene 
            key="transformation"
            isActive={isPlaying}
            progress={progress}
          />
        )}

        {currentScene === 3 && (
          <ExperienceScene 
            key="experience"
            isActive={isPlaying}
            progress={progress}
          />
        )}

        {currentScene === 4 && (
          <FinaleScene 
            key="finale"
            isActive={isPlaying}
            progress={progress}
          />
        )}
      </AnimatePresence>

      {/* Control Interface */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 px-6 py-3 bg-black/80 backdrop-blur-md rounded-full border border-white/20"
        >
          {/* Play/Pause Button */}
          <Button
            onClick={togglePlayPause}
            size="sm"
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white border-0"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm font-medium">
              {SCENES[currentScene]?.title || 'Ready'}
            </span>
            <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-white/70 text-xs">
              {currentScene + 1}/{SCENES.length}
            </span>
          </div>

          {/* Audio Controls */}
          <Button
            onClick={toggleMute}
            size="sm"
            variant="ghost"
            className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>

          {/* Reset Button */}
          <Button
            onClick={resetPresentation}
            size="sm"
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs px-3"
          >
            Reset
          </Button>
        </motion.div>
      </div>

      {/* Skip to Experience Button */}
      {!hasStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute top-8 right-8 z-40"
        >
          <Button
            onClick={() => {
              setCurrentScene(3);
              setHasStarted(true);
              setIsPlaying(true);
            }}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            Skip to Demo
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Scene 1: Opening Logo & Tagline
function OpeningScene({ isActive, progress }: { isActive: boolean; progress: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)'
      }}
    >
      {/* Audio Visualization Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-red-500/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center z-10">
        {/* Kawai Logo Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 2,
            ease: [0.6, -0.05, 0.01, 0.99]
          }}
          className="mb-8"
        >
          <motion.h1
            className="text-8xl font-bold tracking-wider mb-4"
            style={{ 
              background: 'linear-gradient(45deg, #E11922, #FF4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(225, 25, 34, 0.5))'
            }}
            animate={{
              textShadow: [
                '0 0 20px rgba(225, 25, 34, 0.5)',
                '0 0 40px rgba(225, 25, 34, 0.8)',
                '0 0 20px rgba(225, 25, 34, 0.5)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            KAWAI
          </motion.h1>
        </motion.div>

        {/* Tagline with Typewriter Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="space-y-4"
        >
          <motion.p
            className="text-5xl font-light text-white mb-2"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Concert Grand Sound.
          </motion.p>
          <motion.p
            className="text-6xl font-bold text-red-500"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3.5, duration: 0.8, type: "spring" }}
          >
            $499.
          </motion.p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5, duration: 1.5 }}
          className="text-xl text-white/70 mt-8 max-w-md mx-auto"
        >
          Revolutionary digital piano technology made accessible
        </motion.p>
      </div>
    </motion.div>
  );
}

// Scene 2: Heritage & Concert Grand Legacy
function HeritageScene({ isActive, progress }: { isActive: boolean; progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(135deg, #2a1810 0%, #1a1a1a 50%, #000 100%)'
      }}
    >
      {/* Concert Hall Ambiance */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-transparent" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 30% 40%, rgba(255,223,186,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 60%, rgba(255,223,186,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 40%, rgba(255,223,186,0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-8">
          {/* Heritage Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="mb-12"
          >
            <p className="text-amber-300 text-lg font-medium mb-4 tracking-wide">
              HERITAGE
            </p>
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
              Born from
              <span className="block text-amber-400">Concert Grand</span>
              <span className="block">Excellence</span>
            </h2>
          </motion.div>

          {/* Shigeru Kawai SK-EX Showcase */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, duration: 2, type: "spring" }}
            className="relative"
          >
            {/* Grand Piano Silhouette */}
            <div className="relative mx-auto w-96 h-64">
              <motion.svg
                viewBox="0 0 400 250"
                className="w-full h-full"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 3, duration: 3 }}
              >
                <defs>
                  <linearGradient id="pianoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="50%" stopColor="#333" />
                    <stop offset="100%" stopColor="#111" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Grand Piano Body */}
                <motion.path
                  d="M50 150 Q50 100 100 100 L300 100 Q350 100 350 150 L350 200 Q350 220 330 220 L70 220 Q50 220 50 200 Z"
                  fill="url(#pianoGradient)"
                  stroke="#E11922"
                  strokeWidth="2"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 3, duration: 2 }}
                />
                
                {/* Piano Lid */}
                <motion.path
                  d="M100 100 L300 100 Q320 80 340 85 L355 90 Q350 100 350 150"
                  fill="none"
                  stroke="#E11922"
                  strokeWidth="2"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 4, duration: 1.5 }}
                />

                {/* Keyboard */}
                <motion.rect
                  x="80"
                  y="200"
                  width="240"
                  height="20"
                  fill="#f8f8f8"
                  stroke="#333"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 5, duration: 1 }}
                />
              </motion.svg>
              
              {/* Floating Labels */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 6, duration: 1 }}
                className="absolute -left-8 top-1/2 transform -translate-y-1/2"
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30">
                  <p className="text-amber-400 text-sm font-bold">Shigeru Kawai</p>
                  <p className="text-white text-xs">SK-EX Concert Grand</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 6.5, duration: 1 }}
                className="absolute -right-8 bottom-1/4"
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-500/30">
                  <p className="text-amber-400 text-sm font-bold">Premium Samples</p>
                  <p className="text-white text-xs">Studio Recorded</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Heritage Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 7, duration: 1.5 }}
            className="text-xl text-white/80 leading-relaxed mt-8"
          >
            Every note in the ES60 contains the soul of our legendary Shigeru Kawai SK-EX concert grand—
            <span className="text-amber-400 font-medium"> the same piano trusted by concert halls worldwide</span>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

// Scene 3: Transformation from Concert Grand to ES60
function TransformationScene({ isActive, progress }: { isActive: boolean; progress: number }) {
  const [showES60, setShowES60] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowES60(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
      }}
    >
      {/* Particle System */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center">
          {/* Transformation Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="mb-16"
          >
            <p className="text-red-400 text-lg font-medium mb-4 tracking-wide">
              INNOVATION
            </p>
            <h2 className="text-5xl font-bold text-white mb-4">
              Transformed for
              <span className="block text-red-500">Every Musician</span>
            </h2>
          </motion.div>

          {/* Morphing Animation Container */}
          <div className="relative w-full max-w-6xl mx-auto h-80">
            {/* Concert Grand (morphs out) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: showES60 ? 0 : 1,
                scale: showES60 ? 1.2 : 1,
                filter: showES60 ? 'blur(20px)' : 'blur(0px)'
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <div className="text-center">
                <div className="w-96 h-48 mx-auto mb-6 relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <path
                      d="M50 120 Q50 80 100 80 L300 80 Q350 80 350 120 L350 160 Q350 180 330 180 L70 180 Q50 180 50 160 Z"
                      fill="#1a1a1a"
                      stroke="#666"
                      strokeWidth="2"
                    />
                    <rect x="80" y="160" width="240" height="20" fill="#f8f8f8" stroke="#333" />
                  </svg>
                </div>
                <p className="text-white/60 text-lg">Concert Grand</p>
              </div>
            </motion.div>

            {/* ES60 (morphs in) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: showES60 ? 1 : 0,
                scale: showES60 ? 1 : 0.8,
                filter: showES60 ? 'blur(0px)' : 'blur(10px)'
              }}
              transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
            >
              <div className="text-center">
                {/* ES60 Illustration */}
                <div className="w-80 h-32 mx-auto mb-6 relative">
                  <motion.div
                    className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border-2 border-red-500 shadow-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(225, 25, 34, 0.5)',
                        '0 0 40px rgba(225, 25, 34, 0.8)',
                        '0 0 20px rgba(225, 25, 34, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-center justify-center h-full">
                      <span className="text-white font-bold text-2xl">ES60</span>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Specifications */}
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 1 }}
                    className="text-center"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-red-500/30">
                      <p className="text-red-400 text-lg font-bold">24 lbs</p>
                      <p className="text-white/70 text-sm">Ultra Portable</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 1 }}
                    className="text-center"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-red-500/30">
                      <Headphones className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">Dual Headphones</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4, duration: 1 }}
                    className="text-center"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-red-500/30">
                      <p className="text-red-400 text-lg font-bold">192</p>
                      <p className="text-white/70 text-sm">Note Polyphony</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Sound Wave Animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: showES60 ? 1 : 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute border border-red-500/30 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    width: [`${20 + i * 40}px`, `${200 + i * 80}px`],
                    height: [`${20 + i * 40}px`, `${200 + i * 80}px`],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Price Revelation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 5, duration: 1.5, type: "spring" }}
            className="mt-12"
          >
            <p className="text-3xl text-white mb-2">Same legendary sound</p>
            <p className="text-5xl font-bold text-red-500">Just $499</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Scene 4: Experience Demo
function ExperienceScene({ isActive, progress }: { isActive: boolean; progress: number }) {
  const [activeDemo, setActiveDemo] = useState(0);
  
  const demos = [
    { title: "Touch Response", icon: "🎹", description: "Responsive Hammer Compact II Action" },
    { title: "Concert Sound", icon: "🎼", description: "Shigeru Kawai SK-EX Samples" },
    { title: "Silent Practice", icon: "🎧", description: "Dual Headphone Outputs" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % demos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [demos.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
      }}
    >
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-5xl mx-auto px-8">
          {/* Experience Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="mb-16"
          >
            <p className="text-blue-400 text-lg font-medium mb-4 tracking-wide">
              EXPERIENCE
            </p>
            <h2 className="text-6xl font-bold text-white mb-6">
              Feel the
              <span className="block text-blue-400">Difference</span>
            </h2>
          </motion.div>

          {/* Interactive Demo Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.title}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                  index === activeDemo
                    ? 'border-blue-500 bg-blue-500/10 shadow-2xl'
                    : 'border-white/20 bg-white/5'
                }`}
                animate={{
                  scale: index === activeDemo ? 1.05 : 1,
                  y: index === activeDemo ? -10 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-4xl mb-4">{demo.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                <p className="text-white/70">{demo.description}</p>
                
                {index === activeDemo && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1.5 }}
            className="space-y-6"
          >
            <p className="text-xl text-white/80">
              Ready to experience the ES60 for yourself?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                asChild
              >
                <Link href="/contact?product=es60&action=demo">
                  Schedule Demo
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 border-white/30 text-white hover:bg-white/10 rounded-lg font-semibold"
                asChild
              >
                <Link href="/products/es60">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Scene 5: Finale & Call to Action
function FinaleScene({ isActive, progress }: { isActive: boolean; progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(45deg, #E11922 0%, #C7161F 50%, #A01119 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-8">
          {/* Final Message */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
            className="mb-12"
          >
            <h2 className="text-7xl font-bold text-white mb-8">
              Your Musical
              <span className="block">Journey Starts</span>
              <span className="block">Here</span>
            </h2>
          </motion.div>

          {/* Awards & Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="flex justify-center items-center gap-8 mb-12"
          >
            <div className="flex items-center gap-2 text-white/90">
              <Award className="w-6 h-6" />
              <span className="font-medium">Award Winning</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Star className="w-6 h-6" />
              <span className="font-medium">95+ Years Legacy</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Music className="w-6 h-6" />
              <span className="font-medium">Concert Quality</span>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 1, type: "spring" }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Button
                size="lg"
                className="px-12 py-6 text-xl font-bold bg-white text-red-600 hover:bg-gray-100 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/contact?product=es60&action=purchase">
                  Get Your ES60 Today
                </Link>
              </Button>
              
              <p className="text-white/80 text-lg">
                Concert grand sound. Portable design. Unbeatable value.
              </p>
              
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 px-6 py-3"
                  asChild
                >
                  <Link href="/contact?product=es60&action=demo">
                    Schedule Demo
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 px-6 py-3"
                  asChild
                >
                  <Link href="/products/es60">
                    Full Specs
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}