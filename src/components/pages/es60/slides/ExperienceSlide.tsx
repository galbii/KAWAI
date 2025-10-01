"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { VirtualKeyboardMicroExperience } from './experience/VirtualKeyboardMicroExperience';
import { SoundWaveformMicroExperience } from './experience/SoundWaveformMicroExperience';
import { SilentPracticeMicroExperience } from './experience/SilentPracticeMicroExperience';
import { LearningAppsMicroExperience } from './experience/LearningAppsMicroExperience';

interface JourneyStation {
  id: number;
  title: string;
  icon: string;
  description: string;
  detail: string;
  component: React.ComponentType<{ isActive: boolean }>;
}

export function ExperienceSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [activeStation, setActiveStation] = useState<1 | 2 | 3 | 4>(1);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const stations: JourneyStation[] = [
    {
      id: 1,
      title: "Real Piano Feel",
      icon: "🎹",
      description: "88-Key Responsive Hammer Lite Action",
      detail: "Authentic weighted keys teach proper technique from day one",
      component: VirtualKeyboardMicroExperience
    },
    {
      id: 2,
      title: "Concert Grand Sound",
      icon: "🎼",
      description: "Shigeru Kawai SK-EX Samples",
      detail: "The same concert grand sound as $2000+ pianos",
      component: SoundWaveformMicroExperience
    },
    {
      id: 3,
      title: "Silent Practice",
      icon: "🎧",
      description: "Perfect for Apartments & Dorms",
      detail: "Dual headphone jacks for late-night practice sessions",
      component: SilentPracticeMicroExperience
    },
    {
      id: 4,
      title: "Learning Apps",
      icon: "📱",
      description: "USB-MIDI Connectivity",
      detail: "Connect to Simply Piano, Flowkey, DAWs, and more",
      component: LearningAppsMicroExperience
    }
  ];

  // Auto-advance through stations
  useEffect(() => {
    if (isInView && autoAdvance) {
      const interval = setInterval(() => {
        setActiveStation(prev => (prev === 4 ? 1 : (prev + 1) as 1 | 2 | 3 | 4));
      }, 8000); // 8 seconds per station
      return () => clearInterval(interval);
    } else if (!isInView) {
      setActiveStation(1);
    }
    return undefined;
  }, [isInView, autoAdvance]);

  const handleStationClick = (stationId: 1 | 2 | 3 | 4) => {
    setActiveStation(stationId);
    setAutoAdvance(false); // Pause auto-advance on manual interaction
    // Resume auto-advance after 15 seconds
    setTimeout(() => setAutoAdvance(true), 15000);
  };

  const handleNextStation = () => {
    setActiveStation(prev => (prev === 4 ? 1 : (prev + 1) as 1 | 2 | 3 | 4));
    setAutoAdvance(false);
    setTimeout(() => setAutoAdvance(true), 15000);
  };

  const handlePreviousStation = () => {
    setActiveStation(prev => (prev === 1 ? 4 : (prev - 1) as 1 | 2 | 3 | 4));
    setAutoAdvance(false);
    setTimeout(() => setAutoAdvance(true), 15000);
  };

  const currentStation = stations.find(s => s.id === activeStation) || stations[0]!;
  const StationComponent = currentStation.component;

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
      {/* Background Ambiance */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              scale: isInView ? [1, 1.5, 1] : 1,
              opacity: isInView ? [0.3, 0.8, 0.3] : 0.3,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: isInView ? Infinity : 0,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30
            }}
            transition={{ duration: 1.5 }}
            className="text-center mb-8"
          >
            <p className="text-blue-400 text-sm md:text-lg font-medium mb-3 tracking-wide uppercase">
              Interactive Learning Journey
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Experience the
              <span className="block text-blue-400">ES60 Difference</span>
            </h2>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              Discover why the ES60 is the perfect piano for beginners
            </p>
          </motion.div>

          {/* Journey Timeline - Desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="hidden md:flex items-center justify-center mb-8"
          >
            <div className="relative w-full max-w-4xl">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-white/10 rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${((activeStation - 1) / 3) * 100}%`
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              {/* Station Markers */}
              <div className="relative flex justify-between">
                {stations.map((station) => {
                  const isActive = station.id === activeStation;
                  const isPassed = station.id < activeStation;

                  return (
                    <button
                      key={station.id}
                      onClick={() => handleStationClick(station.id as 1 | 2 | 3 | 4)}
                      disabled={!isInView}
                      className="group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-2"
                      aria-label={`Navigate to ${station.title} station`}
                    >
                      {/* Station Marker */}
                      <motion.div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                                   ${isActive
                                     ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50'
                                     : isPassed
                                     ? 'bg-blue-500/50 border-blue-400/50'
                                     : 'bg-white/10 border-white/30 group-hover:border-white/50'
                                   }`}
                        animate={{
                          scale: isActive ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: 2,
                          repeat: isActive ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        <span className="text-xl">{station.icon}</span>

                        {/* Active Pulse */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-blue-400"
                            animate={{
                              scale: [1, 1.3],
                              opacity: [1, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                        )}
                      </motion.div>

                      {/* Station Label */}
                      <div className="mt-3 text-center max-w-[120px]">
                        <p className={`text-xs md:text-sm font-medium transition-colors
                                     ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>
                          {station.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Journey Timeline - Mobile (Vertical) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex md:hidden justify-center mb-6"
          >
            <div className="flex gap-2">
              {stations.map((station) => {
                const isActive = station.id === activeStation;

                return (
                  <button
                    key={station.id}
                    onClick={() => handleStationClick(station.id as 1 | 2 | 3 | 4)}
                    disabled={!isInView}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                               ${isActive
                                 ? 'bg-blue-500 border-blue-400 shadow-lg'
                                 : 'bg-white/10 border-white/30'
                               }`}
                    aria-label={`Navigate to ${station.title} station`}
                  >
                    <span className="text-lg">{station.icon}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Station Content Area */}
          <motion.div
            className="relative bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
            style={{ minHeight: '400px', maxHeight: '500px' }}
          >
            {/* Station Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStation.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-blue-400 text-xs md:text-sm font-medium mb-1">
                    Station {currentStation.id} of 4
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {currentStation.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/70">
                    {currentStation.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Station Experience */}
            <div className="relative h-full pt-20 pb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStation.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <StationComponent isActive={isInView} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-10">
              <button
                onClick={handlePreviousStation}
                disabled={!isInView}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                aria-label="Previous station"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {stations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => handleStationClick(station.id as 1 | 2 | 3 | 4)}
                    disabled={!isInView}
                    className={`w-2 h-2 rounded-full transition-all
                               ${station.id === activeStation
                                 ? 'bg-blue-500 w-6'
                                 : 'bg-white/30 hover:bg-white/50'
                               }`}
                    aria-label={`Go to station ${station.id}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextStation}
                disabled={!isInView}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                aria-label="Next station"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Bottom Message with Price */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-center mt-6"
          >
            <p className="text-base md:text-lg text-white/80 mb-2">
              The perfect affordable digital piano for beginners who want professional results
            </p>
            <p className="text-xl md:text-2xl font-bold text-blue-400">
              Only $499
            </p>
          </motion.div>
        </div>
      </div>

      {/* SEO Content (hidden) */}
      <div className="sr-only">
        Best beginner digital piano under $500. ES60 features 88-key weighted keyboard with Responsive Hammer Lite Action,
        Shigeru Kawai SK-EX concert grand piano samples, dual headphone outputs for silent practice,
        USB-MIDI connectivity for learning apps like Simply Piano and Flowkey. Perfect for apartments, dorms,
        students, and adult learners. Professional piano features at an affordable price.
      </div>
    </motion.div>
  );
}