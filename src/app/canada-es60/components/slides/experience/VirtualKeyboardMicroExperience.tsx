"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface VirtualKeyboardMicroExperienceProps {
  isActive: boolean;
}

interface KeyState {
  pressed: boolean;
  velocity: number;
}

export function VirtualKeyboardMicroExperience({ isActive }: VirtualKeyboardMicroExperienceProps) {
  const [keyStates, setKeyStates] = useState<Record<number, KeyState>>({});

  // 12 keys (one octave) - white and black keys
  const keys = [
    { id: 0, type: 'white', note: 'C' },
    { id: 1, type: 'black', note: 'C#' },
    { id: 2, type: 'white', note: 'D' },
    { id: 3, type: 'black', note: 'D#' },
    { id: 4, type: 'white', note: 'E' },
    { id: 5, type: 'white', note: 'F' },
    { id: 6, type: 'black', note: 'F#' },
    { id: 7, type: 'white', note: 'G' },
    { id: 8, type: 'black', note: 'G#' },
    { id: 9, type: 'white', note: 'A' },
    { id: 10, type: 'black', note: 'A#' },
    { id: 11, type: 'white', note: 'B' },
  ];

  const handleKeyPress = (keyId: number) => {
    if (!isActive) return;

    const velocity = Math.random() * 0.5 + 0.5; // Random velocity between 0.5 and 1
    setKeyStates(prev => ({ ...prev, [keyId]: { pressed: true, velocity } }));

    setTimeout(() => {
      setKeyStates(prev => ({ ...prev, [keyId]: { pressed: false, velocity: 0 } }));
    }, 200 + velocity * 200); // Release time varies with velocity
  };

  const whiteKeys = keys.filter(k => k.type === 'white');
  const blackKeys = keys.filter(k => k.type === 'black');

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Instruction */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white/80 text-sm mb-4 text-center"
      >
        Click or tap keys to feel the weighted action response
      </motion.p>

      {/* Virtual Keyboard */}
      <div className="relative w-full max-w-md h-32 md:h-40">
        {/* White Keys */}
        <div className="absolute inset-0 flex">
          {whiteKeys.map((key, index) => {
            const keyState = keyStates[key.id];
            const isPressed = keyState?.pressed ?? false;
            const velocity = keyState?.velocity ?? 0;

            return (
              <motion.button
                key={key.id}
                className="flex-1 relative bg-white rounded-b-lg border-2 border-gray-300 cursor-pointer
                          hover:bg-gray-100 transition-colors duration-100
                          focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  boxShadow: isPressed
                    ? 'inset 0 4px 8px rgba(0,0,0,0.3)'
                    : '0 2px 4px rgba(0,0,0,0.2)',
                }}
                animate={{
                  y: isPressed ? 8 * velocity : 0,
                  backgroundColor: isPressed ? '#e5e7eb' : '#ffffff',
                }}
                transition={{
                  type: "spring",
                  stiffness: 300 - (velocity * 100), // Heavier press = slower return
                  damping: 20,
                }}
                onClick={() => handleKeyPress(key.id)}
                disabled={!isActive}
                aria-label={`Play ${key.note} key`}
              >
                {/* Key label */}
                <span className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 select-none">
                  {key.note}
                </span>

                {/* Weighted indicator on first press */}
                {isPressed && (
                  <motion.div
                    className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-500"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {Math.round(velocity * 127)}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Black Keys */}
        <div className="absolute inset-0 flex pointer-events-none">
          {blackKeys.map((key, index) => {
            const keyState = keyStates[key.id];
            const isPressed = keyState?.pressed ?? false;
            const velocity = keyState?.velocity ?? 0;

            // Position black keys between white keys
            const positions = [0.67, 1.67, 3.67, 4.67, 5.67]; // Between C-C#, D-D#, F-F#, G-G#, A-A#
            const leftPosition = positions[index] ?? 0;

            return (
              <motion.button
                key={key.id}
                className="absolute bg-gray-900 rounded-b-md border border-black cursor-pointer
                          hover:bg-gray-800 transition-colors duration-100 pointer-events-auto
                          focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{
                  left: `${(leftPosition / whiteKeys.length) * 100}%`,
                  width: '8%',
                  height: '60%',
                  zIndex: 10,
                  boxShadow: isPressed
                    ? 'inset 0 3px 6px rgba(0,0,0,0.5)'
                    : '0 2px 4px rgba(0,0,0,0.4)',
                }}
                animate={{
                  y: isPressed ? 6 * velocity : 0,
                  backgroundColor: isPressed ? '#1f2937' : '#111827',
                }}
                transition={{
                  type: "spring",
                  stiffness: 300 - (velocity * 100),
                  damping: 20,
                }}
                onClick={() => handleKeyPress(key.id)}
                disabled={!isActive}
                aria-label={`Play ${key.note} key`}
              >
                {/* Velocity indicator */}
                {isPressed && (
                  <motion.div
                    className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-400"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {Math.round(velocity * 127)}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Comparison Callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 grid grid-cols-2 gap-4 text-center max-w-md w-full"
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-xs text-red-400 font-medium mb-1">Non-Weighted</p>
          <p className="text-xs text-white/60">No velocity response</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-xs text-green-400 font-medium mb-1">ES60 Weighted</p>
          <p className="text-xs text-white/60">127 velocity levels</p>
        </div>
      </motion.div>

      {/* SEO Content (hidden) */}
      <div className="sr-only">
        88-key responsive hammer lite action keyboard with weighted keys for authentic piano feel.
        Velocity-sensitive keys teach proper technique from day one. Best weighted keyboard under $500.
        Realistic piano key action for beginners and students.
      </div>
    </div>
  );
}
