"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Star, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FinaleSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

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
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
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
              className="flex items-center gap-2 text-white/90"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-5 md:w-6 h-5 md:h-6" />
              <span className="font-medium text-sm md:text-base">Award Winning</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-white/90"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-5 md:w-6 h-5 md:h-6" />
              <span className="font-medium text-sm md:text-base">95+ Years Legacy</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-white/90"
              whileHover={{ scale: 1.05 }}
            >
              <Music className="w-5 md:w-6 h-5 md:h-6" />
              <span className="font-medium text-sm md:text-base">Concert Quality</span>
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
                <Link href="/contact?product=es60&action=purchase">
                  Get Your ES60 Today
                </Link>
              </Button>

              <p className="text-white/80 text-base md:text-lg">
                Best beginner digital piano. Professional sound. Unbeatable value at only $499.
              </p>
              <p className="text-white/60 text-sm md:text-base">
                Perfect for students, adult learners, and apartment living
              </p>
            </div>
          </motion.div>

          {/* Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isInView ? 1 : 0, 
              y: isInView ? 0 : 20 
            }}
            transition={{ 
              delay: isInView ? 3.5 : 0, 
              duration: 1 
            }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
          >
            <Button
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10 px-6 py-3"
              asChild
            >
              <Link href="/contact?product=es60&action=demo">
                Schedule Demo
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10 px-6 py-3"
              asChild
            >
              <Link href="/es60">
                Return to ES60 Page
              </Link>
            </Button>
          </motion.div>

          {/* Value Proposition Reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ 
              delay: isInView ? 4.5 : 0, 
              duration: 1.5 
            }}
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-white">Only $499</p>
                <p className="text-white/70 text-sm">Best Sound Under $500</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-white">24 lbs</p>
                <p className="text-white/70 text-sm">Student-Portable</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-white">Perfect</p>
                <p className="text-white/70 text-sm">For Beginners</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}