"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CinematicTriggerProps {
  variant?: 'floating' | 'inline' | 'modal';
  delay?: number;
  showOnScroll?: boolean;
  className?: string;
}

export function CinematicTrigger({ 
  variant = 'floating', 
  delay = 3000,
  showOnScroll = true,
  className = ''
}: CinematicTriggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Show trigger after delay or scroll
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showOnScroll) {
      const handleScroll = () => {
        if (window.scrollY > 100) {
          setHasScrolled(true);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      if (!showOnScroll || hasScrolled) {
        timeoutId = setTimeout(() => {
          if (!isDismissed) {
            setIsVisible(true);
          }
        }, delay);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [delay, showOnScroll, hasScrolled, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (isDismissed) return null;

  // Floating Variant (bottom-right corner)
  if (variant === 'floating') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className={`fixed bottom-6 right-6 z-50 max-w-sm ${className}`}
          >
            <div className="relative bg-black/90 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 shadow-2xl">
              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Animated Background */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">
                    Premium Experience
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg leading-tight">
                  Watch the ES60 
                  <span className="block text-red-400">Cinematic Story</span>
                </h3>

                <p className="text-white/80 text-sm leading-relaxed">
                  Experience the revolutionary transformation from concert grand to portable excellence through immersive visual storytelling.
                </p>

                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <Volume2 className="w-3 h-3" />
                  <span>Audio experience included</span>
                </div>

                <Button
                  asChild
                  className="w-full bg-red-600 hover:bg-red-700 text-white border-0 font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/es60/cinematic" className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    <span>Watch Now</span>
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Inline Variant (within content)
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        className={`relative bg-gradient-to-br from-black to-gray-900 rounded-2xl p-8 border border-red-500/20 ${className}`}
      >
        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-red-500/50"
          animate={{
            boxShadow: [
              '0 0 20px rgba(225, 25, 34, 0.3)',
              '0 0 40px rgba(225, 25, 34, 0.6)',
              '0 0 20px rgba(225, 25, 34, 0.3)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-red-400 animate-pulse" />
            <span className="text-red-400 font-bold text-lg uppercase tracking-wider">
              Cinematic Experience
            </span>
            <Sparkles className="w-6 h-6 text-red-400 animate-pulse" />
          </div>

          <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight">
            Experience the ES60 Story
            <span className="block text-red-400">Like Never Before</span>
          </h3>

          <p className="text-white/80 text-lg leading-relaxed max-w-lg mx-auto">
            Journey through the revolutionary transformation from Shigeru Kawai concert grand heritage to accessible excellence. An immersive visual experience that reveals the magic behind $499.
          </p>

          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white border-0 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <Link href="/es60/cinematic" className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                <span>Watch Cinematic Experience</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-1">
              <Volume2 className="w-4 h-4" />
              <span>Premium Audio</span>
            </div>
            <div className="w-1 h-1 bg-white/40 rounded-full" />
            <span>5-Minute Experience</span>
            <div className="w-1 h-1 bg-white/40 rounded-full" />
            <span>Cinema Quality</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Modal Variant (fullscreen overlay)
  if (variant === 'modal') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-black border border-red-500/30 rounded-3xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
                  <h2 className="text-red-400 font-bold text-2xl uppercase tracking-wider">
                    Cinematic Experience
                  </h2>
                  <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
                </div>

                <h3 className="text-white font-bold text-3xl lg:text-4xl leading-tight">
                  Discover the ES60
                  <span className="block text-red-400">Revolutionary Story</span>
                </h3>

                <p className="text-white/80 text-xl leading-relaxed">
                  Experience an immersive journey from Shigeru Kawai concert grand heritage to the accessible excellence of the ES60. Premium visual storytelling meets revolutionary piano innovation.
                </p>

                <div className="grid grid-cols-3 gap-6 my-8">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎹</div>
                    <p className="text-white/70 text-sm">Concert Grand Heritage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">✨</div>
                    <p className="text-white/70 text-sm">Cinematic Quality</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎥</div>
                    <p className="text-white/70 text-sm">5-Minute Journey</p>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white border-0 font-bold px-12 py-4 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <Link href="/es60/cinematic" className="flex items-center gap-3">
                    <Play className="w-6 h-6" />
                    <span>Begin Experience</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return null;
}