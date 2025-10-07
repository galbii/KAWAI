"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Star, Music } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { trackDealerLinkClick, trackBundlePopupOpen } from '../lib/tracking';

interface FinaleSlideProps {
  onOpenBundle?: () => void;
}

export function FinaleSlide({ onOpenBundle }: FinaleSlideProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [outboundUrl, setOutboundUrl] = useState('https://kawaius.com/find-a-dealer/acoustic-digital/');

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
        outboundParams.set('utm_content', 'finale_cta');
      }

      // Build final URL
      const finalUrl = `${baseUrl}?${outboundParams.toString()}`;
      setOutboundUrl(finalUrl);
    }
  }, []);

  // Handle dealer link click tracking
  const handleDealerLinkClick = () => {
    trackDealerLinkClick('es60_landing_page_finale');
  };

  // Handle bundle button click tracking
  const handleBundleClick = () => {
    if (onOpenBundle) {
      trackBundlePopupOpen('es60_landing_page_finale');
      onOpenBundle();
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
              y: isInView ? [0, -100] : 0,
              opacity: isInView ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: isInView ? Infinity : 0,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Final Message */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isInView ? 1 : 0.8,
              opacity: isInView ? 1 : 0
            }}
            transition={{
              duration: 1.5,
              type: "spring",
              delay: isInView ? 0.5 : 0
            }}
            className="mb-12"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] sm:drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
              Your Musical Journey
              <span className="block">Starts Here</span>
            </h2>
          </motion.div>

          {/* Awards & Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30
            }}
            transition={{
              delay: isInView ? 1.5 : 0,
              duration: 1.5
            }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12"
          >
            <motion.div
              className="flex items-center gap-2 text-white min-w-[140px] sm:min-w-0 justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-6 md:w-6 h-6 md:h-6 drop-shadow-lg flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Award Winning
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-white min-w-[140px] sm:min-w-0 justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-6 md:w-6 h-6 md:h-6 drop-shadow-lg flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                95+ Years Legacy
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-white min-w-[140px] sm:min-w-0 justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Music className="w-6 md:w-6 h-6 md:h-6 drop-shadow-lg flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Concert Quality
              </span>
            </motion.div>
          </motion.div>

          {/* Primary CTA */}
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
            className="space-y-6"
          >
            <div className="space-y-3 sm:space-y-4 px-4">
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="px-6 sm:px-8 md:px-12 py-4 md:py-6 text-base sm:text-lg md:text-xl font-bold bg-white text-red-600 hover:bg-gray-100 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto"
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
                    className="px-6 sm:px-8 md:px-12 py-4 md:py-6 text-base sm:text-lg md:text-xl font-bold bg-transparent text-white border-2 border-white hover:bg-white hover:text-black rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto"
                  >
                    ES60 Bundle
                  </Button>
                )}
              </div>

              <p className="text-white text-sm sm:text-base md:text-lg font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-relaxed">
                Professional sound. Unbeatable value at only $499.
              </p>
              <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                Perfect for students and apartment living
              </p>
            </div>
          </motion.div>

          {/* Value Proposition Reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{
              delay: isInView ? 3.5 : 0,
              duration: 1.5
            }}
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="space-y-2">
                <p className="text-3xl md:text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Only $499
                </p>
                <p className="text-white text-sm font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                  Best Sound Under $500
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  24 lbs
                </p>
                <p className="text-white text-sm font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                  Student-Portable
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Perfect
                </p>
                <p className="text-white text-sm font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                  For Beginners
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}