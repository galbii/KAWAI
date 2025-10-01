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
      transition={{ duration: 1.5 }}
    >
      <div className="w-full max-w-5xl px-4 md:px-8">
        {/* Heading - "Instrumental to Life" - Right above video */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 1 }}
          className="mb-4 md:mb-6 z-20"
        >
          <div className="text-center">
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl"
              style={{ fontFamily: '"Buenapark JF", "Crimson Text", serif' }}
            >
              Instrumental to Life
            </h2>
            <motion.div
              className="mt-3 md:mt-4 h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 2 }}
            />
          </div>
        </motion.div>

        {/* Video Container */}
        <div className="relative w-full mb-6 md:mb-8" style={{ aspectRatio: '16/9' }}>
          {/* YouTube Video Embed with cropped controls */}
          <div className="absolute inset-0 overflow-hidden rounded-lg md:rounded-xl shadow-2xl">
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

          {/* Sound Toggle Button - Bottom Right of Video */}
          <motion.button
            onClick={handleSoundToggle}
            className="absolute -bottom-4 -right-4 md:bottom-4 md:right-4 z-30 p-3 md:p-4 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            )}
          </motion.button>
        </div>

        {/* CTA Button - Closer to video */}
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
          className="z-20"
        >
          <div className="text-center">
            <Button
              size="lg"
              className="px-6 md:px-12 py-3 md:py-6 text-base md:text-xl font-bold bg-white text-red-600 hover:bg-gray-100 rounded-xl md:rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full max-w-md"
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