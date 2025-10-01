"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Star, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FinaleSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
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
        outboundParams.set('utm_content', 'finale_cta');
      }

      // Build final URL
      const finalUrl = `${baseUrl}?${outboundParams.toString()}`;
      setOutboundUrl(finalUrl);
    }
  }, []);

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
        utm_campaign: utmCampaign,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_content: utmContent,
        source: 'es60_landing_page_finale'
      });

      // Also track as a custom event for additional granularity
      (window as any).fbq('trackCustom', 'ES60_ProductClick', {
        campaign: utmCampaign,
        value: 499,
        currency: 'USD',
        source: 'finale_slide'
      });
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
            <h2
              className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
              style={{ textShadow: '3px 3px 15px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5)' }}
            >
              Your Musical
              <span className="block">Journey Starts</span>
              <span className="block">Here</span>
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
            className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-12"
          >
            <motion.div
              className="flex items-center gap-2 text-white"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-5 md:w-6 h-5 md:h-6 drop-shadow-lg" />
              <span
                className="font-semibold text-sm md:text-base"
                style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
              >
                Award Winning
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-white"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-5 md:w-6 h-5 md:h-6 drop-shadow-lg" />
              <span
                className="font-semibold text-sm md:text-base"
                style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
              >
                95+ Years Legacy
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-white"
              whileHover={{ scale: 1.05 }}
            >
              <Music className="w-5 md:w-6 h-5 md:h-6 drop-shadow-lg" />
              <span
                className="font-semibold text-sm md:text-base"
                style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
              >
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
            <div className="space-y-4">
              <Button
                size="lg"
                className="px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold bg-white text-red-600 hover:bg-gray-100 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
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

              <p
                className="text-white text-base md:text-lg font-medium"
                style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
              >
                Best beginner digital piano. Professional sound. Unbeatable value at only $499.
              </p>
              <p
                className="text-white/90 text-sm md:text-base"
                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)' }}
              >
                Perfect for students, adult learners, and apartment living
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <p
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
                >
                  Only $499
                </p>
                <p
                  className="text-white text-sm font-medium"
                  style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)' }}
                >
                  Best Sound Under $500
                </p>
              </div>
              <div className="space-y-2">
                <p
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
                >
                  24 lbs
                </p>
                <p
                  className="text-white text-sm font-medium"
                  style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)' }}
                >
                  Student-Portable
                </p>
              </div>
              <div className="space-y-2">
                <p
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
                >
                  Perfect
                </p>
                <p
                  className="text-white text-sm font-medium"
                  style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)' }}
                >
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