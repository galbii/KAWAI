"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../ui/button';
import { trackDealerLinkClick, trackBundlePopupOpen } from '../lib/tracking';

interface OpeningSlideProps {
  onOpenBundle?: () => void;
}

export function OpeningSlide({ onOpenBundle }: OpeningSlideProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [showES60Logo, setShowES60Logo] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [outboundUrl, setOutboundUrl] = useState('https://kawaius.com/find-a-dealer/acoustic-digital/');

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect prefers-reduced-motion setting
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Control the ES60 logo display timing
  useEffect(() => {
    if (isInView) {
      // Show ES60 logo initially
      setShowES60Logo(true);
      setShowMainContent(false);

      // Hide ES60 logo after 2 seconds
      const hideLogoTimer = setTimeout(() => {
        setShowES60Logo(false);
      }, 2000);

      // Show main content immediately after ES60 fades (at 2 seconds)
      const showContentTimer = setTimeout(() => {
        setShowMainContent(true);
      }, 2000);

      return () => {
        clearTimeout(hideLogoTimer);
        clearTimeout(showContentTimer);
      };
    } else {
      // Reset when slide goes out of view
      setShowES60Logo(true);
      setShowMainContent(false);
      return undefined;
    }
  }, [isInView]);

  // Build outbound URL with preserved UTM parameters and fbclid
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      const baseUrl = 'https://kawaius.com/find-a-dealer/acoustic-digital/';
      const outboundParams = new URLSearchParams();

      // Preserve all UTM parameters from the incoming URL
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
      utmParams.forEach(param => {
        const value = currentParams.get(param);
        if (value) {
          outboundParams.set(param, value);
        }
      });

      // Preserve fbclid (Facebook Click ID) - critical for attribution
      const fbclid = currentParams.get('fbclid');
      if (fbclid) {
        outboundParams.set('fbclid', fbclid);
      }

      // If no UTM parameters were found, use default ones
      if (!outboundParams.has('utm_source')) {
        outboundParams.set('utm_source', 'direct');
        outboundParams.set('utm_medium', 'referral');
        outboundParams.set('utm_campaign', 'es60_awareness_campaign');
        outboundParams.set('utm_content', 'opening_cta');
      }

      // Build final URL
      const finalUrl = `${baseUrl}?${outboundParams.toString()}`;
      setOutboundUrl(finalUrl);
    }
  }, []);

  // Handle dealer link click tracking
  const handleDealerLinkClick = () => {
    trackDealerLinkClick('es60_landing_page_opening');
  };

  // Handle bundle button click tracking
  const handleBundleClick = () => {
    if (onOpenBundle) {
      trackBundlePopupOpen('es60_landing_page_opening');
      onOpenBundle();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden scroll-snap-slide"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* ES60 Text - Opening Animation (First Thing Shown) */}
      <AnimatePresence>
        {showES60Logo && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.h1
              className="text-[5rem] sm:text-[8rem] md:text-[16rem] lg:text-[20rem] font-bold text-white tracking-tight"
              style={{
                textShadow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.4)'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 1.1,
                opacity: 0
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut"
              }}
            >
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.4)',
                    '0 0 60px rgba(255, 255, 255, 1), 0 0 120px rgba(255, 255, 255, 0.6)',
                    '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.4)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ES60
              </motion.span>
            </motion.h1>

            {/* Tagline under ES60 */}
            <div className="mt-4 md:mt-8 max-w-sm sm:max-w-none mx-auto px-4 text-center">
              <motion.p
                className="text-lg sm:text-xl md:text-3xl font-light text-white"
                style={{
                  textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -20
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.8
                }}
              >
                Performance you can feel.
              </motion.p>
              <motion.p
                className="text-lg sm:text-xl md:text-3xl font-light text-white mt-1"
                style={{
                  textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -20
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 1.4
                }}
              >
                Value you can trust.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Audio Visualization Background */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0">
          {[...Array(isMobile ? 8 : 20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-red-500/5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content - Only show after ES60 logo */}
      <AnimatePresence>
        {showMainContent && (
          <motion.div
            className="text-center z-10 max-w-4xl mx-auto px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Kawai Logo Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0
              }}
              className="mb-8"
            >
              <motion.div
                className="relative w-48 sm:w-64 md:w-96 h-16 sm:h-20 md:h-32 mx-auto mb-4"
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(225, 25, 34, 0.5))',
                    'drop-shadow(0 0 40px rgba(225, 25, 34, 0.8))',
                    'drop-shadow(0 0 20px rgba(225, 25, 34, 0.5))'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/images/Kawai (Red)(2).png"
                  alt="Kawai"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Tagline with Sequential Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="space-y-4"
            >
              <motion.p
                className="text-2xl sm:text-3xl md:text-5xl font-light text-white mb-2"
                style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                Concert Grand Sound Made Affordable.
              </motion.p>

              <motion.div
                className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 1.4,
                  duration: 0.6,
                  type: "spring"
                }}
              >
                {/* Crossed out original price */}
                <motion.span
                  className="text-3xl sm:text-4xl md:text-6xl font-bold text-white relative"
                  style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  $599
                  <motion.div
                    className="absolute top-1/2 left-0 right-0 h-1 bg-red-500 transform -translate-y-1/2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.9, duration: 0.4 }}
                    style={{
                      transformOrigin: 'left',
                      boxShadow: '0 0 8px rgba(225, 25, 34, 0.8)'
                    }}
                  />
                </motion.span>

                {/* Current price */}
                <motion.span
                  className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-500"
                  style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.8, duration: 0.5 }}
                >
                  Only $499.
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 3.3,
                duration: 0.8
              }}
              className="text-base sm:text-lg md:text-xl text-white/90 mt-8 max-w-md md:max-w-2xl mx-auto leading-relaxed px-4"
              style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.5)' }}
            >
              Professional sound quality for students, adult learners, and everyone starting their musical journey
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 4.0,
                type: "spring"
              }}
              className="mt-8"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl md:rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto min-h-[48px]"
                  asChild
                >
                  <a
                    href={outboundUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDealerLinkClick}
                  >
                    Find a Dealer
                  </a>
                </Button>

                {onOpenBundle && (
                  <Button
                    size="lg"
                    onClick={handleBundleClick}
                    className="px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold bg-transparent text-white border-2 border-white hover:bg-white hover:text-black rounded-xl md:rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto min-h-[48px]"
                  >
                    ES60 Bundle
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 3.9,
                duration: 0.6
              }}
              className="absolute bottom-12 md:bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
                className="flex flex-col items-center text-white/50"
              >
                <span className="text-sm mb-2">Scroll to explore</span>
                <div className="w-0.5 h-8 bg-white/30 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}