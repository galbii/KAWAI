"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface ValueCarouselItem {
  title: string;
  description: string;
  icon: string;
  benefit: string;
}

export function ES60Hero() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.2 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Value carousel data focusing on demographics and benefits
  const valueItems: ValueCarouselItem[] = [
    {
      title: "Real Piano Feel",
      description: "88-key Responsive Hammer Compact II Action with graded weight",
      icon: "🎹",
      benefit: "Professional touch that builds proper technique from day one"
    },
    {
      title: "Concert Hall Sound",
      description: "Authentic Shigeru Kawai SK-EX concert grand samples",
      icon: "🎼",
      benefit: "Inspiring sound quality that motivates practice and performance"
    },
    {
      title: "Silent Practice",
      description: "Dual headphone outputs for lessons and quiet practice",
      icon: "🎧",
      benefit: "Practice anytime without disturbing others - perfect for families"
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % valueItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, valueItems.length]);

  // Accessibility: Respect reduced motion preferences
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fadeInUp = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : 30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
      }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ 
        backgroundColor: '#FAF8F5',
        backgroundImage: 'linear-gradient(135deg, #FAF8F5 0%, #F5F2ED 100%)',
        willChange: 'transform' 
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: '#8B7355' }}
        />
        <div 
          className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full opacity-5"
          style={{ backgroundColor: '#9CAF88' }}
        />
      </div>
      
      {/* Main Content Container */}
      <div className="container-brand max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Hero Message & CTA */}
          <div className="order-2 lg:order-1">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: '#6B645C' }}
              >
                <span style={{ color: '#E11922' }}>Kawai</span> ES60 Digital Piano
              </p>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4" style={{ color: '#3C3530' }}>
                <span style={{ color: '#E11922' }}>Kawai</span> ES60: The Best Affordable Digital Piano for Beginners
              </h1>

              <h2 className="text-xl lg:text-2xl font-semibold mb-6" style={{ color: '#6B645C' }}>
                Concert Grand Sound Quality | 88 Weighted Keys | Under $500
              </h2>
            </motion.div>

            <motion.p
              className="text-lg lg:text-xl leading-relaxed mb-8 max-w-lg"
              style={{ color: '#6B645C' }}
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.4 }}
            >
              Start your musical journey with authentic Shigeru Kawai SK-EX concert grand piano sound—the same professional sampling found in $2,000+ models. With 88 fully weighted keys and Responsive Hammer Compact II action, this beginner digital piano delivers the touch and tone of an acoustic grand at an exceptional value. Perfect for adult learners, students, and apartment living.
            </motion.p>

            {/* Quick Specs Grid */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg max-w-lg"
                style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E3DB' }}
              >
                {[
                  'Professional Concert Grand Sound (SK-EX)',
                  '88 Weighted Keys (RHL Action)',
                  '192-Note Polyphony',
                  'Dual Headphone Outputs',
                  'Only 24 lbs / Ultra-Portable',
                  '$499 MSRP'
                ].map((spec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 flex-shrink-0" style={{ color: '#9CAF88' }}>✓</span>
                    <span className="text-sm font-medium" style={{ color: '#3C3530' }}>{spec}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.7 }}
            >
              <Button
                size="lg"
                className="px-8 py-4 text-base font-semibold rounded-lg transition-all duration-300 hover:transform hover:scale-105"
                style={{
                  backgroundColor: '#E11922',
                  color: '#FAF8F5',
                  boxShadow: '0 4px 20px rgba(225, 25, 34, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#C7161F';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#E11922';
                }}
                asChild
              >
                <Link href="/contact?product=es60&action=demo">
                  Find Your ES60
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Product Image & Value Carousel */}
          <div className="order-1 lg:order-2">
            {/* Product Image */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
              className="relative mb-8"
            >
              <div 
                className="rounded-2xl p-8 shadow-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #F5F2ED 0%, #E8E3DB 100%)',
                  boxShadow: '0 20px 40px rgba(139, 115, 85, 0.15)'
                }}
              >
                {/* ES60 Piano Illustration */}
                <div className="rounded-lg w-full h-auto flex items-center justify-center min-h-[300px]" style={{ backgroundColor: '#F5F2ED' }}>
                  <svg
                    width="500"
                    height="300"
                    viewBox="0 0 500 300"
                    className="w-full h-auto rounded-lg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="500" height="300" fill="#F5F2ED" rx="8"/>
                    {/* Piano body */}
                    <rect x="40" y="120" width="420" height="80" fill="#5D4E37" rx="8"/>
                    <rect x="50" y="130" width="400" height="60" fill="#8B7355" rx="4"/>
                    
                    {/* Piano keyboard */}
                    <rect x="40" y="200" width="420" height="80" fill="#3C3530" rx="4"/>
                    {/* White keys */}
                    <rect x="50" y="210" width="16" height="60" fill="#FAF8F5" stroke="#A8A5A0"/>
                    <rect x="70" y="210" width="16" height="60" fill="#FAF8F5" stroke="#A8A5A0"/>
                    <rect x="90" y="210" width="16" height="60" fill="#FAF8F5" stroke="#A8A5A0"/>
                    <rect x="110" y="210" width="16" height="60" fill="#FAF8F5" stroke="#A8A5A0"/>
                    <rect x="130" y="210" width="16" height="60" fill="#FAF8F5" stroke="#A8A5A0"/>
                    <rect x="150" y="210" width="16" height="60" fill="#FAF8F5" stroke="#A8A5A0"/>
                    <rect x="170" y="210" width="16" height="60" fill="#FAF8F5" stroke="#A8A5A0"/>
                    
                    {/* Black keys */}
                    <rect x="58" y="210" width="10" height="40" fill="#3C3530"/>
                    <rect x="78" y="210" width="10" height="40" fill="#3C3530"/>
                    <rect x="118" y="210" width="10" height="40" fill="#3C3530"/>
                    <rect x="138" y="210" width="10" height="40" fill="#3C3530"/>
                    <rect x="158" y="210" width="10" height="40" fill="#3C3530"/>
                    
                    {/* Kawai ES60 text */}
                    <text x="250" y="155" textAnchor="middle" fill="#E11922" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold">
                      KAWAI
                    </text>
                    <text x="250" y="175" textAnchor="middle" fill="#F5F2ED" fontSize="16" fontFamily="Arial, sans-serif">
                      ES60
                    </text>
                  </svg>
                </div>

                {/* Price Badge */}
                <div 
                  className="absolute -top-3 -right-3 px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                  style={{ backgroundColor: '#9CAF88', color: '#FAF8F5' }}
                >
                  $499 MSRP
                </div>
              </div>
            </motion.div>

            {/* Interactive Value Carousel */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div 
                className="rounded-xl p-6 min-h-[200px]"
                style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E3DB' }}
              >
                {/* Carousel Controls */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#3C3530' }}>
                    Why Choose ES60?
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="p-1 rounded-full transition-colors hover:bg-red-50"
                      style={{ color: '#E11922' }}
                      aria-label={isAutoPlaying ? "Pause carousel" : "Play carousel"}
                    >
                      {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => prev === 0 ? valueItems.length - 1 : prev - 1)}
                      className="p-1 rounded-full transition-colors hover:bg-red-50"
                      style={{ color: '#E11922' }}
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % valueItems.length)}
                      className="p-1 rounded-full transition-colors hover:bg-red-50"
                      style={{ color: '#E11922' }}
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Carousel Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{valueItems[currentSlide]?.icon}</span>
                      <h4 className="text-xl font-bold" style={{ color: '#3C3530' }}>
                        {valueItems[currentSlide]?.title}
                      </h4>
                    </div>
                    <p className="text-base" style={{ color: '#6B645C' }}>
                      {valueItems[currentSlide]?.description}
                    </p>
                    <p className="text-sm font-medium" style={{ color: '#E11922' }}>
                      {valueItems[currentSlide]?.benefit}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {valueItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'opacity-100' : 'opacity-40'
                      }`}
                      style={{
                        backgroundColor: index === currentSlide ? '#E11922' : '#8B7355'
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}