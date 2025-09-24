"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, Users, GraduationCap, Brain, Home } from "lucide-react";

interface FeatureHotspot {
  id: string;
  title: string;
  description: string;
  benefit: string;
  demographic: string;
  position: {
    x: number; // Percentage from left
    y: number; // Percentage from top
  };
  icon: React.ReactNode;
}

interface TooltipProps {
  hotspot: FeatureHotspot;
  onClose: () => void;
  position: { x: number; y: number };
}

function FeatureTooltip({ hotspot, onClose, position }: TooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute z-20 w-80 max-w-[90vw] rounded-xl p-6 shadow-2xl pointer-events-auto"
      style={{
        backgroundColor: '#FAF8F5',
        border: '2px solid #E11922',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -100%)',
        boxShadow: '0 20px 40px rgba(225, 25, 34, 0.3)'
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full transition-colors"
        style={{ color: '#E11922' }}
        aria-label="Close feature details"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{hotspot.icon}</div>
          <h3 className="text-lg font-bold" style={{ color: '#3C3530' }}>
            {hotspot.title}
          </h3>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: '#6B645C' }}>
          {hotspot.description}
        </p>

        <div 
          className="rounded-lg p-3"
          style={{ backgroundColor: '#F5F2ED' }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: '#8B7355' }}>
            Perfect for {hotspot.demographic}:
          </p>
          <p className="text-sm" style={{ color: '#5D4E37' }}>
            {hotspot.benefit}
          </p>
        </div>
      </div>

      {/* Tooltip Arrow */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
        style={{ 
          width: 0, 
          height: 0, 
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid #8B7355'
        }}
      />
    </motion.div>
  );
}

export function ES60Features() {
  const sectionRef = useRef(null);
  const pianoContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 50, y: 50 });

  // Feature hotspots with demographic-focused benefits
  const hotspots: FeatureHotspot[] = [
    {
      id: "weighted-keys",
      title: "88-Key Responsive Hammer Compact II",
      description: "Weighted keys with authentic piano touch and graded resistance from bass to treble, just like an acoustic piano.",
      benefit: "Builds proper finger strength and technique from the beginning, ensuring smooth transition to acoustic pianos.",
      demographic: "Adult Beginners & Parents",
      position: { x: 25, y: 85 },
      icon: <GraduationCap className="w-6 h-6" style={{ color: '#8B7355' }} />
    },
    {
      id: "headphone-jacks",
      title: "Dual Headphone Outputs",
      description: "Two headphone jacks allow for private practice or teacher-student lessons without disturbing others.",
      benefit: "Practice anytime day or night without noise concerns - perfect for apartment living and family harmony.",
      demographic: "Families & College Students",
      position: { x: 75, y: 60 },
      icon: <Home className="w-6 h-6" style={{ color: '#9CAF88' }} />
    },
    {
      id: "compact-design",
      title: "Ultra-Portable Design",
      description: "Only 37 lbs and compact dimensions make it easy to move between rooms, gigs, or dorm rooms.",
      benefit: "Take your music anywhere - from home practice to performances, lessons, or study sessions.",
      demographic: "College Students & Performers",
      position: { x: 85, y: 30 },
      icon: <Users className="w-6 h-6" style={{ color: '#A8A5A0' }} />
    },
    {
      id: "skex-samples",
      title: "Shigeru Kawai SK-EX Samples",
      description: "Premium concert grand piano recordings from one of the world's most prestigious instruments.",
      benefit: "Inspiring sound quality that motivates practice and provides cognitive benefits through rich, complex tones.",
      demographic: "Rediscovering Adults",
      position: { x: 45, y: 40 },
      icon: <Brain className="w-6 h-6" style={{ color: '#5D4E37' }} />
    }
  ];

  // Animation variants
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
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number]
      }
    }
  };

  const handleHotspotClick = (hotspot: FeatureHotspot) => {
    if (activeHotspot === hotspot.id) {
      setActiveHotspot(null);
      return;
    }

    // Calculate tooltip position relative to piano container
    if (pianoContainerRef.current) {
      const rect = pianoContainerRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      
      // Adjust tooltip position to stay within viewport
      let x = hotspot.position.x;
      let y = hotspot.position.y;
      
      // Prevent tooltip from going off-screen
      if (x > 75) x = 75; // Keep away from right edge
      if (x < 25) x = 25; // Keep away from left edge
      if (y < 30) y = 30; // Keep away from top
      
      setTooltipPosition({ x, y });
    }
    
    setActiveHotspot(hotspot.id);
  };

  const activeHotspotData = hotspots.find(h => h.id === activeHotspot);

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-24 relative overflow-hidden"
      style={{ backgroundColor: '#FAF8F5' }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/3 -left-20 w-40 h-40 rounded-full opacity-5"
          style={{ backgroundColor: '#9CAF88' }}
        />
        <div 
          className="absolute bottom-1/4 -right-20 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: '#8B7355' }}
        />
      </div>

      <div className="container-brand max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#3C3530' }}>
            Explore Every Detail
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: '#6B645C' }}>
            Discover how each ES60 feature is designed with your musical journey in mind. 
            Tap the hotspots to learn more.
          </p>
          
          {/* Interactive Instructions */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ backgroundColor: '#F5F2ED', color: '#E11922' }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#8B7355' }}
            />
            Tap the dots to explore features
          </div>
        </motion.div>

        {/* Interactive Piano with Hotspots */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.3 }}
          className="relative max-w-4xl mx-auto"
        >
          <div 
            ref={pianoContainerRef}
            className="relative w-full h-auto"
            style={{ minHeight: '400px' }}
          >
            {/* ES60 Piano Illustration */}
            <svg
              width="100%"
              height="400"
              viewBox="0 0 800 400"
              className="w-full h-auto rounded-xl shadow-lg"
              style={{ backgroundColor: '#F5F2ED' }}
            >
              {/* Piano Stand/Base */}
              <rect x="100" y="320" width="600" height="60" fill="#8B7355" rx="8"/>
              <rect x="120" y="340" width="560" height="20" fill="#5D4E37" rx="4"/>
              
              {/* Piano Body */}
              <rect x="80" y="180" width="640" height="140" fill="#5D4E37" rx="12"/>
              <rect x="100" y="200" width="600" height="100" fill="#8B7355" rx="8"/>
              
              {/* Control Panel */}
              <rect x="580" y="220" width="100" height="60" fill="#3C3530" rx="4"/>
              <circle cx="620" cy="240" r="3" fill="#9CAF88"/>
              <circle cx="640" cy="240" r="3" fill="#A8A5A0"/>
              <rect x="590" y="255" width="80" height="15" fill="#6B645C" rx="2"/>
              
              {/* Headphone Jacks */}
              <circle cx="650" cy="190" r="6" fill="#3C3530"/>
              <circle cx="670" cy="190" r="6" fill="#3C3530"/>
              
              {/* Piano Keyboard */}
              <rect x="80" y="320" width="640" height="80" fill="#3C3530" rx="4"/>
              
              {/* White Keys */}
              {Array.from({ length: 21 }).map((_, i) => (
                <rect 
                  key={`white-${i}`}
                  x={90 + (i * 29)} 
                  y="330" 
                  width="26" 
                  height="60" 
                  fill="#FAF8F5" 
                  stroke="#E8E3DB"
                  strokeWidth="1"
                />
              ))}
              
              {/* Black Keys */}
              {[1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18, 19, 20].map((position) => (
                <rect 
                  key={`black-${position}`}
                  x={75 + (position * 29)} 
                  y="330" 
                  width="18" 
                  height="40" 
                  fill="#3C3530"
                />
              ))}
              
              {/* Kawai Logo */}
              <text x="400" y="250" textAnchor="middle" fill="#FAF8F5" fontSize="28" fontFamily="Arial, sans-serif" fontWeight="bold">
                KAWAI
              </text>
              <text x="400" y="275" textAnchor="middle" fill="#F5F2ED" fontSize="18" fontFamily="Arial, sans-serif">
                ES60
              </text>
              
              {/* Keyboard Detail */}
              <text x="400" y="355" textAnchor="middle" fill="#6B645C" fontSize="12" fontFamily="Arial, sans-serif">
                88-Key Responsive Hammer Compact II Action
              </text>
            </svg>

            {/* Interactive Hotspots */}
            {hotspots.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                className="absolute w-6 h-6 rounded-full border-2 transition-all duration-300 z-10"
                style={{
                  left: `${hotspot.position.x}%`,
                  top: `${hotspot.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: activeHotspot === hotspot.id ? '#E11922' : '#FAF8F5',
                  borderColor: '#E11922',
                  boxShadow: activeHotspot === hotspot.id
                    ? '0 0 20px rgba(225, 25, 34, 0.5)'
                    : '0 4px 10px rgba(225, 25, 34, 0.2)'
                }}
                onClick={() => handleHotspotClick(hotspot)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Explore ${hotspot.title}`}
              >
                <motion.div
                  className="w-2 h-2 rounded-full mx-auto"
                  style={{
                    backgroundColor: activeHotspot === hotspot.id ? '#FAF8F5' : '#E11922'
                  }}
                  animate={activeHotspot !== hotspot.id ? { 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.button>
            ))}

            {/* Feature Tooltip */}
            <AnimatePresence>
              {activeHotspot && activeHotspotData && (
                <FeatureTooltip
                  hotspot={activeHotspotData}
                  position={tooltipPosition}
                  onClose={() => setActiveHotspot(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Feature Benefits Summary */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.5 }}
          className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className={`rounded-xl p-6 transition-all duration-300 cursor-pointer ${
                activeHotspot === hotspot.id ? 'ring-2 shadow-lg' : 'shadow-md hover:shadow-lg'
              }`}
              style={{ 
                backgroundColor: '#F5F2ED',
                borderColor: activeHotspot === hotspot.id ? '#8B7355' : 'transparent'
              }}
              onClick={() => handleHotspotClick(hotspot)}
            >
              <div className="flex items-center gap-3 mb-3">
                {hotspot.icon}
                <h3 className="font-semibold text-sm" style={{ color: '#3C3530' }}>
                  {hotspot.title}
                </h3>
              </div>
              <p className="text-xs" style={{ color: '#6B645C' }}>
                {hotspot.demographic}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.7 }}
          className="text-center mt-16"
        >
          <div 
            className="rounded-2xl p-8 max-w-2xl mx-auto"
            style={{ backgroundColor: '#F5F2ED', border: '1px solid #E8E3DB' }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#3C3530' }}>
              Ready to Experience the ES60?
            </h3>
            <p className="text-base mb-6" style={{ color: '#6B645C' }}>
              Every feature is thoughtfully designed to support your musical journey, 
              whether you're just beginning or rediscovering your passion for piano.
            </p>
            <motion.button
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: '#8B7355',
                color: '#FAF8F5',
                boxShadow: '0 4px 15px rgba(139, 115, 85, 0.2)'
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/contact?product=es60&action=demo';
                }
              }}
            >
              Schedule Your Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}