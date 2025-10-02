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
  const [outboundUrl, setOutboundUrl] = useState('https://kawaius.com/product/kawai-es60/');
  const [isMobile, setIsMobile] = useState(false);

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
    video: { delay: isMobile ? 1.8 : 2.3, duration: isMobile ? 0.8 : 1 },
    videoPlay: isMobile ? 2200 : 2800,
    soundToggle: { delay: isMobile ? 2.8 : 3.5, duration: isMobile ? 0.4 : 0.5 },
    cta: { delay: isMobile ? 4.0 : 5.0, duration: isMobile ? 0.8 : 1 }
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

  // Autoplay video with improved timing - plays during video reveal animation
  useEffect(() => {
    if (isInView && iframeRef.current?.contentWindow && !hasPlayed) {
      // Delay based on mobile/desktop timing for dramatic reveal
      const timer = setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo' }),
            '*'
          );
          setHasPlayed(true);
        }
      }, timing.videoPlay);
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
  }, [isInView, hasPlayed, timing.videoPlay]);

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
      className="relative w-full h-screen overflow-hidden scroll-snap-slide flex flex-col items-center justify-center"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: timing.container.duration }}
    >
      <div className="w-full max-w-5xl px-4 md:px-8">
        {/* Heading - "Instrumental to Life" - Right above video */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
          transition={{ duration: timing.heading.duration, ease: 'easeOut', delay: timing.heading.delay }}
          className="mb-4 md:mb-6 z-20"
        >
          <div className="text-center">
            <h2
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl"
              style={{ fontFamily: '"Buenapark JF", "Crimson Text", serif' }}
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

        {/* Video Container */}
        <motion.div
          className="relative w-full mb-6 md:mb-8"
          style={{ aspectRatio: '16/9' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.95 }}
          transition={{ duration: timing.video.duration, ease: 'easeOut', delay: timing.video.delay }}
        >
          {/* YouTube Video Embed with cropped controls and hidden overlays */}
          <div className="absolute inset-0 overflow-hidden rounded-lg md:rounded-xl shadow-2xl">
            <iframe
              ref={iframeRef}
              className="absolute border-0"
              style={{
                width: '140%',
                height: '140%',
                left: '-20%',
                top: '-20%',
                pointerEvents: 'none'
              }}
              src="https://www.youtube.com/embed/OZXS57zZds8?autoplay=0&mute=1&loop=1&playlist=OZXS57zZds8&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&enablejsapi=1&autohide=1&cc_load_policy=0&widget_referrer=1"
              title="ES60 Experience"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={false}
            />

            {/* Overlay to block YouTube branding/overlays */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(to right, rgba(0,0,0,0.01) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.01) 100%),
                  linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.01) 100%)
                `,
                mixBlendMode: 'normal'
              }}
            />
          </div>

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

        {/* CTA Button - Closer to video */}
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