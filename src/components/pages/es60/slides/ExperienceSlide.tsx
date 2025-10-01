"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ExperienceSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [isMuted, setIsMuted] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Autoplay video ONLY when slide comes into view
  useEffect(() => {
    if (isInView && iframeRef.current?.contentWindow && !hasPlayed) {
      // Small delay to ensure iframe is ready
      const timer = setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo' }),
            '*'
          );
          setHasPlayed(true);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else if (!isInView) {
      // Pause video when slide is out of view
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo' }),
          '*'
        );
      }
      setHasPlayed(false);
    }
    return undefined;
  }, [isInView, hasPlayed]);

  // Handle sound toggle - only toggles mute, doesn't pause
  const handleSoundToggle = () => {
    if (!iframeRef.current) return;

    // Toggle mute state
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // Send postMessage to YouTube iframe to control mute only
    if (iframeRef.current.contentWindow) {
      // Toggle mute (video keeps playing)
      if (newMutedState) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'mute' }),
          '*'
        );
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute' }),
          '*'
        );
      }
    }
  };

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
      {/* YouTube Video Embed - Full Screen with cropped controls */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          ref={iframeRef}
          className="absolute border-0 pointer-events-none"
          style={{
            width: '120%',
            height: '120%',
            left: '-10%',
            top: '-10%'
          }}
          src="https://www.youtube.com/embed/OZXS57zZds8?mute=1&loop=1&playlist=OZXS57zZds8&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&enablejsapi=1&autohide=1&cc_load_policy=0"
          title="ES60 Experience"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Overlay - "Instrumental to Life" - Always visible with enhanced fade-in */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 1 }}
        className="absolute top-1/3 left-0 right-0 z-20 px-4"
      >
        <div className="text-center">
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl"
            style={{ fontFamily: '"Buenapark JF", "Crimson Text", serif' }}
          >
            Instrumental to Life
          </h2>
          <motion.div
            className="mt-4 h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 2 }}
          />

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0.8
            }}
            transition={{
              delay: isInView ? 2.5 : 0,
              duration: 1,
              type: "spring"
            }}
            className="mt-60"
          >
            <Button
              size="lg"
              className="px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold bg-white text-red-600 hover:bg-gray-100 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/contact?product=es60&action=purchase">
                Get Your ES60 Today
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Sound Toggle Button - Bottom Right */}
      <motion.button
        onClick={handleSoundToggle}
        className="absolute bottom-8 right-8 z-30 p-4 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </motion.button>

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