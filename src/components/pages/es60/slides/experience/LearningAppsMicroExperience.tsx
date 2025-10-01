"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LearningAppsMicroExperienceProps {
  isActive: boolean;
}

interface App {
  id: string;
  name: string;
  icon: string;
  category: 'learning' | 'production' | 'utility';
  description: string;
  color: string;
}

const apps: App[] = [
  {
    id: 'simplypiano',
    name: 'Simply Piano',
    icon: '📱',
    category: 'learning',
    description: 'Interactive lessons that listen and adapt to your playing',
    color: 'blue',
  },
  {
    id: 'flowkey',
    name: 'Flowkey',
    icon: '🎼',
    category: 'learning',
    description: 'Learn your favorite songs with instant feedback',
    color: 'purple',
  },
  {
    id: 'playground',
    name: 'Playground Sessions',
    icon: '🎮',
    category: 'learning',
    description: 'Gamified lessons make practice fun and engaging',
    color: 'green',
  },
  {
    id: 'pianoremote',
    name: 'PianoRemote',
    icon: '📲',
    category: 'utility',
    description: 'KAWAI app for MIDI recording and rhythm patterns',
    color: 'red',
  },
  {
    id: 'daw',
    name: 'DAW Support',
    icon: '🎚️',
    category: 'production',
    description: 'Connect to GarageBand, Logic, FL Studio, and more',
    color: 'orange',
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    icon: '🎹',
    category: 'learning',
    description: 'Visual falling notes make reading music intuitive',
    color: 'cyan',
  },
];

export function LearningAppsMicroExperience({ isActive }: LearningAppsMicroExperienceProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const activeApp = selectedApp ? apps.find(app => app.id === selectedApp) : null;
  const displayApp = activeApp || (hoveredApp ? apps.find(app => app.id === hoveredApp) : null);

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
          Connect & Learn Your Way
        </h3>
        <p className="text-white/70 text-sm">
          USB-MIDI connects to popular learning apps and music software
        </p>
      </motion.div>

      {/* App Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 w-full max-w-2xl">
        {apps.map((app, index) => {
          const isSelected = selectedApp === app.id;
          const isHovered = hoveredApp === app.id;

          return (
            <motion.button
              key={app.id}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                         ${isSelected
                           ? `border-${app.color}-500 bg-${app.color}-500/10 shadow-lg`
                           : isHovered
                           ? 'border-white/40 bg-white/10'
                           : 'border-white/20 bg-white/5 hover:border-white/30'
                         }`}
              onClick={() => setSelectedApp(isSelected ? null : app.id)}
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
              disabled={!isActive}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 0.9,
              }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              {...(isActive && !isSelected ? { whileHover: { scale: 1.02 } } : {})}
              whileTap={{ scale: 0.98 }}
            >
              {/* App Icon */}
              <div className="text-3xl md:text-4xl mb-2">{app.icon}</div>

              {/* App Name */}
              <p className={`text-xs md:text-sm font-medium transition-colors
                           ${isSelected ? 'text-white' : 'text-white/80'}`}>
                {app.name}
              </p>

              {/* Category Badge */}
              <div className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block
                             ${app.category === 'learning'
                               ? 'bg-blue-500/20 text-blue-300'
                               : app.category === 'production'
                               ? 'bg-orange-500/20 text-orange-300'
                               : 'bg-green-500/20 text-green-300'
                             }`}>
                {app.category}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className={`absolute -top-1 -right-1 w-5 h-5 bg-${app.color}-500 rounded-full
                             flex items-center justify-center shadow-lg`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* App Description */}
      <AnimatePresence mode="wait">
        {displayApp && (
          <motion.div
            key={displayApp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`bg-${displayApp.color}-500/10 border border-${displayApp.color}-500/30
                       rounded-xl p-4 text-center max-w-md w-full`}
          >
            <p className="text-sm md:text-base text-white font-medium mb-1">
              {displayApp.name}
            </p>
            <p className="text-xs md:text-sm text-white/70">
              {displayApp.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 flex items-center gap-3 text-white/60 text-xs md:text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-lg">🎹</span>
          </div>
          <span>ES60</span>
        </div>

        {/* USB Connection */}
        <motion.div
          className="flex items-center gap-1"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <div className="w-8 h-0.5 bg-blue-500/50" />
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </motion.div>

        <div className="flex items-center gap-2">
          <span>USB-MIDI</span>
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-lg">💻</span>
          </div>
        </div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
        transition={{ delay: 1 }}
        className="mt-4 grid grid-cols-3 gap-2 text-center text-xs w-full max-w-md"
      >
        <div className="bg-white/5 rounded-lg p-2">
          <p className="font-medium text-white">Plug & Play</p>
          <p className="text-white/60">No drivers</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="font-medium text-white">MIDI In/Out</p>
          <p className="text-white/60">Full control</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="font-medium text-white">iOS/Android</p>
          <p className="text-white/60">Mobile ready</p>
        </div>
      </motion.div>

      {/* SEO Content (hidden) */}
      <div className="sr-only">
        USB-MIDI connectivity for Simply Piano, Flowkey, Playground Sessions, Synthesia learning apps.
        Compatible with GarageBand, Logic Pro, FL Studio DAW software. PianoRemote app for MIDI recording.
        Best MIDI piano keyboard for beginners. Connect to music learning apps and production software.
      </div>
    </div>
  );
}
