"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * PianoKeyboardDivider Component
 *
 * A minimalist decorative divider showing a top-down view of piano keys.
 * Clean, simple design that enhances brand identity without overwhelming the page.
 *
 * Features:
 * - Flat, top-down keyboard view
 * - Minimalist styling
 * - Subtle fade-in animation
 * - Fully responsive
 */

interface PianoKeyboardDividerProps {
  /** Number of octaves to display (default: 2) */
  octaves?: number;
  /** Custom className for styling */
  className?: string;
}

// Piano key pattern for one octave
const OCTAVE_PATTERN = [
  { note: 'C', hasBlackKey: true },
  { note: 'D', hasBlackKey: true },
  { note: 'E', hasBlackKey: false },
  { note: 'F', hasBlackKey: true },
  { note: 'G', hasBlackKey: true },
  { note: 'A', hasBlackKey: true },
  { note: 'B', hasBlackKey: false },
];

export function PianoKeyboardDivider({
  octaves = 2,
  className = ""
}: PianoKeyboardDividerProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Generate keys based on number of octaves
  const generateKeys = () => {
    const keys = [];
    const totalWhiteKeys = Math.floor(octaves * 7);

    for (let i = 0; i < totalWhiteKeys; i++) {
      const octaveIndex = i % 7;
      const keyData = OCTAVE_PATTERN[octaveIndex];

      if (!keyData) continue;

      keys.push({
        id: `key-${i}`,
        note: keyData.note,
        hasBlackKey: keyData.hasBlackKey,
        index: i
      });
    }

    return keys;
  };

  const keys = generateKeys();

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-kawai-black h-16 sm:h-20 md:h-24 lg:h-28 border-t-8 ${className}`}
      style={{ borderTopColor: '#A01829' }}
    >
      {/* Piano keyboard container - top-down view, fills full height */}
      <div className="relative w-full h-full">
        {/* White keys - base layer with staggered animation */}
        <div className="absolute inset-0 flex gap-px">
          {keys.map((key, index) => (
            <motion.div
              key={key.id}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.03,
                ease: "easeOut"
              }}
              style={{ transformOrigin: 'top' }}
              className="flex-1 bg-white border-r border-gray-300 last:border-r-0"
            />
          ))}
        </div>

        {/* Black keys - overlay layer with staggered animation */}
        <div className="absolute inset-0 flex">
          {keys.map((key, index) => {
            if (!key.hasBlackKey) {
              return <div key={`spacer-${key.id}`} className="flex-1" />;
            }

            return (
              <div key={`container-${key.id}`} className="flex-1 relative">
                {/* Black key positioned at right edge of white key */}
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.03 + 0.15,
                    ease: "easeOut"
                  }}
                  className="absolute top-0 h-3/5 w-3/5 bg-kawai-black border border-gray-800"
                  style={{
                    right: '-30%',
                    zIndex: 10,
                    transformOrigin: 'top'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
