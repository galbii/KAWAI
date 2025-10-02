"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ExperienceSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [isMuted, setIsMuted] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [outboundUrl, setOutboundUrl] = useState('https://kawaius.com/product/kawai-es60/');
  const [isMobile, setIsMobile] = useState(false);

  // No longer needed - using HTML5 video instead of YouTube iframe

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation timing configuration - faster on mobile
  const timing = {
    container: { delay: 0, duration: isMobile ? 0.6 : 0.8 },
    heading: { delay: isMobile ? 0.2 : 0.3, duration: isMobile ? 0.8 : 1 },
    underline: { delay: isMobile ? 1.2 : 1.5, duration: isMobile ? 0.5 : 0.7 },
    video: { delay: 0, duration: 0.4 }, // Immediate, quick fade-in
    videoPlay: isMobile ? 2200 : 2800,
    soundToggle: { delay: isMobile ? 0.5 : 0.6, duration: isMobile ? 0.4 : 0.5 }, // Adjusted to follow video
    cta: { delay: isMobile ? 1.5 : 1.8, duration: isMobile ? 0.8 : 1 } // Adjusted to follow video
  };

  // Build outbound URL with preserved UTM parameters and fbclid
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      const baseUrl = 'https://kawaius.com/product/kawai-es60/';
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
        outboundParams.set('utm_content', 'video_cta');
      }

      // Build final URL
      const finalUrl = `${baseUrl}?${outboundParams.toString()}`;
      setOutboundUrl(finalUrl);
    }
  }, []);

  // Control video playback based on slide visibility
  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      // Play video when in view
      videoRef.current.play().catch((error) => {
        console.warn('Video autoplay failed:', error);
      });
    } else {
      // Pause video when slide is out of view
      videoRef.current.pause();
    }
  }, [isInView]);

  // Handle external link click tracking
  const handleExternalLinkClick = () => {
    // Get UTM parameters from URL for tracking
    const urlParams = new URLSearchParams(window.location.search);
    const utmCampaign = urlParams.get('utm_campaign') || 'direct';
    const utmSource = urlParams.get('utm_source') || 'direct';
    const utmMedium = urlParams.get('utm_medium') || 'none';
    const utmContent = urlParams.get('utm_content') || 'none';

    // Track the outbound click as a conversion event with UTM data
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'ES60 Digital Piano',
        content_category: 'Digital Piano',
        value: 499,
        currency: 'USD',
        // Pass UTM parameters as custom parameters
        utm_campaign: utmCampaign,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_content: utmContent,
        source: 'es60_landing_page'
      });

      // Also track as a custom event for additional granularity
      (window as any).fbq('trackCustom', 'ES60_ProductClick', {
        campaign: utmCampaign,
        value: 499,
        currency: 'USD'
      });
    }
  };

  // Handle sound toggle - uses native video.muted property for reliable mobile support
  const handleSoundToggle = () => {
    if (!videoRef.current) return;

    // Toggle mute state
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    setAudioUnlocked(true);

    // Use native video.muted property (most reliable on mobile)
    videoRef.current.muted = newMutedState;

    // Ensure playback continues after unmuting (iOS requirement)
    if (!newMutedState) {
      videoRef.current.play().catch((error) => {
        console.warn('Video play after unmute failed:', error);
      });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden scroll-snap-slide flex flex-col items-center justify-center"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: timing.container.duration }}
    >
      {/* Heading - "Instrumental to Life" - Centered with max-width */}
      <div className="w-full max-w-5xl px-4 md:px-8 mx-auto mb-4 md:mb-6">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
          transition={{ duration: timing.heading.duration, ease: 'easeOut', delay: timing.heading.delay }}
          className="z-20"
        >
          <div className="text-center">
            <h2
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide"
              style={{
                fontFamily: '"Buenapark JF", "Crimson Text", serif',
                textShadow: `
                  0 0 30px rgba(0, 0, 0, 1),
                  0 0 60px rgba(0, 0, 0, 1),
                  0 1px 3px rgba(0, 0, 0, 1),
                  0 2px 6px rgba(0, 0, 0, 1),
                  0 4px 12px rgba(0, 0, 0, 0.95),
                  0 8px 24px rgba(0, 0, 0, 0.9),
                  0 16px 48px rgba(0, 0, 0, 0.8)
                `
              }}
            >
              Instrumental to Life
            </h2>
            <motion.div
              className="mt-3 md:mt-4 h-1 w-20 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
              transition={{ duration: timing.underline.duration, ease: 'easeOut', delay: timing.underline.delay }}
            />
          </div>
        </motion.div>
      </div>

      {/* Video Container - Full horizontal viewport width */}
      <motion.div
        className="relative w-screen mb-6 md:mb-8"
        style={{ aspectRatio: '16/9' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: timing.video.duration, ease: 'easeOut', delay: timing.video.delay }}
      >
          {/* HTML5 Video - Reliable mobile audio control */}
          <div className="absolute inset-0 overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={(e) => console.error('Video load error:', e)}
            >
              <source src="/videos/es60-experience-optimized.webm" type="video/webm" />
              <source src="/videos/es60-experience-optimized.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Mobile instruction hint - shows before first interaction */}
          {!audioUnlocked && isMobile && (
            <motion.div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs md:text-sm pointer-events-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -10 }}
              transition={{ delay: timing.video.delay + 1, duration: 0.5 }}
            >
              Tap 🔊 below to enable sound
            </motion.div>
          )}

          {/* Sound Toggle Button - Bottom Right of Video */}
          <motion.button
            onClick={handleSoundToggle}
            className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-40 p-3 md:p-4 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ pointerEvents: 'auto' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isInView ? 1 : 0,
              scale: isInView ? (isMuted ? [1, 1.1, 1] : 1) : 0.8
            }}
            transition={{
              opacity: { delay: timing.soundToggle.delay, duration: timing.soundToggle.duration },
              scale: isMuted
                ? { delay: timing.soundToggle.delay, duration: 0.6, repeat: Infinity, repeatDelay: 1 }
                : { delay: timing.soundToggle.delay, duration: timing.soundToggle.duration }
            }}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            )}
          </motion.button>
        </motion.div>

      {/* CTA Button - Centered with max-width */}
      <div className="w-full max-w-5xl px-4 md:px-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isInView ? 1 : 0,
            scale: isInView ? 1 : 0.8
          }}
          transition={{
            delay: isInView ? timing.cta.delay : 0,
            duration: timing.cta.duration,
            type: "spring"
          }}
          className="z-20"
        >
          <div className="text-center">
            <Button
              size="lg"
              className="px-6 md:px-12 py-4 md:py-6 text-base md:text-xl font-bold bg-white text-red-600 hover:bg-gray-100 rounded-xl md:rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full max-w-md min-h-[48px]"
              asChild
            >
              <a
                href={outboundUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
              >
                Get Your ES60 Today
              </a>
            </Button>
          </div>
        </motion.div>
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