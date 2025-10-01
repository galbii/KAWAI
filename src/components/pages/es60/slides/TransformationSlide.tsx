"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Headphones, Home, Moon, Package } from 'lucide-react';
import Image from 'next/image';

type ScenarioType = 'student' | 'lateNight' | 'smallSpace';

interface Hotspot {
  x: number;
  y: number;
  label: string;
}

interface ScenarioFeature {
  icon: React.ReactNode;
  text: string;
}

interface ScenarioContent {
  headline: string;
  features: ScenarioFeature[];
  hotspots: Hotspot[];
  cta: string;
  color: string;
}

export function TransformationSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [showES60, setShowES60] = useState(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('student');

  // Trigger ES60 transformation when slide comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowES60(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowES60(false);
    }
    return undefined;
  }, [isInView]);

  // Scenario content definitions
  const scenarioContent: Record<ScenarioType, ScenarioContent> = {
    student: {
      headline: "Built for Student Life",
      features: [
        { icon: <Headphones className="w-5 h-5" />, text: "Dual headphones for roommate-friendly practice" },
        { icon: <Package className="w-5 h-5" />, text: "24 lbs - easy to move between home and dorm" },
        { icon: "🎹", text: "Full 88 keys with authentic weighted action" }
      ],
      hotspots: [
        { x: 15, y: 45, label: "Dual Headphone Jacks" },
        { x: 75, y: 60, label: "Ultra Portable - 24 lbs" }
      ],
      cta: "Perfect for college students and music majors",
      color: "blue"
    },
    lateNight: {
      headline: "Practice Without Limits",
      features: [
        { icon: <Moon className="w-5 h-5" />, text: "Silent practice anytime - no neighbor complaints" },
        { icon: <Headphones className="w-5 h-5" />, text: "Exceptional through-headphone sound quality" },
        { icon: "⚡", text: "Concert grand sound at any hour" }
      ],
      hotspots: [
        { x: 15, y: 45, label: "Silent Mode" },
        { x: 50, y: 35, label: "Premium Headphone Audio" }
      ],
      cta: "Ideal for late-night practice and apartment living",
      color: "purple"
    },
    smallSpace: {
      headline: "Big Sound, Small Footprint",
      features: [
        { icon: <Home className="w-5 h-5" />, text: "Compact design fits any room" },
        { icon: "🏋️", text: "Just 24 lbs - one person can move it" },
        { icon: "🎼", text: "Full concert grand sound, minimal space" }
      ],
      hotspots: [
        { x: 70, y: 60, label: "Only 24 lbs" },
        { x: 40, y: 30, label: "Compact Design" }
      ],
      cta: "Perfect for apartments and small studios",
      color: "green"
    }
  };

  const currentScenario = scenarioContent[activeScenario];

  // Helper to get color classes
  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        glow: 'rgba(59, 130, 246, 0.3)'
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        glow: 'rgba(168, 85, 247, 0.3)'
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        glow: 'rgba(34, 197, 94, 0.3)'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const currentColors = getColorClasses(currentScenario.color);

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
      {/* Particle System */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: isInView ? [0, 1, 0] : 0,
              scale: isInView ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: isInView ? Infinity : 0,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-7xl mx-auto px-4 md:px-6">
          {/* Transformation Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0.8
            }}
            transition={{ duration: 1.5 }}
            className="mb-8 md:mb-12"
          >
            <p className="text-red-400 text-sm md:text-lg font-medium mb-3 tracking-wide uppercase">
              Perfect for Beginners & Students
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Everything You Need
              <span className="block text-red-500">To Start Playing</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/80">
              Discover how the ES60 fits your lifestyle
            </p>
          </motion.div>

          {/* Scenario Switcher - Mobile Friendly */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: showES60 ? 1 : 0,
              y: showES60 ? 0 : -20
            }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
              {[
                { key: 'student' as ScenarioType, label: 'Student Life', icon: <Package className="w-4 h-4" /> },
                { key: 'lateNight' as ScenarioType, label: 'Late Night Learner', icon: <Moon className="w-4 h-4" /> },
                { key: 'smallSpace' as ScenarioType, label: 'Small Space Hero', icon: <Home className="w-4 h-4" /> }
              ].map((scenario) => {
                const isActive = activeScenario === scenario.key;
                const colors = getColorClasses(scenarioContent[scenario.key].color);

                return (
                  <motion.button
                    key={scenario.key}
                    onClick={() => setActiveScenario(scenario.key)}
                    className={`
                      px-3 sm:px-4 md:px-6 py-2.5 md:py-3 rounded-lg border-2 transition-all
                      flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-medium
                      min-h-[44px] min-w-[100px] sm:min-w-auto justify-center
                      ${isActive ? `${colors.border} ${colors.bg} ${colors.text}` : 'border-white/20 text-white/70 hover:border-white/40'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {scenario.icon}
                    <span className="hidden sm:inline">{scenario.label}</span>
                    <span className="sm:hidden">{scenario.label.split(' ')[0]}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Interactive Scenario Content */}
          <div className="relative w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">

              {/* Left: Dynamic Content */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: showES60 ? 1 : 0,
                  x: showES60 ? 0 : -100
                }}
                transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                className="order-2 lg:order-1 space-y-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScenario}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${currentColors.text}`}>
                      {currentScenario.headline}
                    </h3>

                    {/* Features List */}
                    <div className="space-y-4">
                      {currentScenario.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          className="flex items-start gap-2 sm:gap-3 bg-black/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-4 border border-white/10"
                        >
                          <div className={`flex-shrink-0 ${currentColors.text} w-6 h-6 flex items-center justify-center`}>
                            {typeof feature.icon === 'string' ? (
                              <span className="text-2xl">{feature.icon}</span>
                            ) : (
                              feature.icon
                            )}
                          </div>
                          <p className="text-white/90 text-sm md:text-base leading-relaxed">{feature.text}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className={`text-base md:text-lg font-medium ${currentColors.text}`}
                    >
                      {currentScenario.cta}
                    </motion.p>

                    {/* Price Section */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-black/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-red-500/30"
                    >
                      <p className="text-white/80 text-sm md:text-base mb-2">
                        Professional features at an affordable price
                      </p>
                      <p className="text-red-500 text-3xl md:text-4xl font-bold mb-1">
                        Only $499
                      </p>
                      <p className="text-white/70 text-xs md:text-sm">
                        Best affordable digital piano for beginners
                      </p>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Right: ES60 Image with Hotspots */}
              <motion.div
                className="order-1 lg:order-2 relative h-48 sm:h-64 md:h-80 lg:h-96"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: showES60 ? 1 : 0,
                  scale: showES60 ? 1 : 0.8
                }}
                transition={{ delay: 1, duration: 2, ease: "easeOut" }}
              >
                {/* ES60 Image */}
                <motion.div
                  className="relative w-full h-full"
                  animate={{
                    filter: showES60 ? [
                      `drop-shadow(0 0 30px ${currentColors.glow})`,
                      `drop-shadow(0 0 50px ${currentColors.glow})`,
                      `drop-shadow(0 0 30px ${currentColors.glow})`
                    ] : 'drop-shadow(0 0 30px rgba(225, 25, 34, 0.2))'
                  }}
                  transition={{
                    duration: 3,
                    repeat: showES60 ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src="/images/es60-above-closeup.png"
                    alt="ES60 Digital Piano"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {/* Interactive Hotspots */}
                <AnimatePresence mode="wait">
                  {showES60 && currentScenario.hotspots.map((hotspot, index) => (
                    <motion.div
                      key={`${activeScenario}-${index}`}
                      className="absolute"
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        delay: index * 0.2 + 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {/* Pulsing Dot */}
                      <motion.div
                        className={`w-4 h-4 rounded-full ${currentColors.bg} border-2 ${currentColors.border}`}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      {/* Label */}
                      <motion.div
                        className={`
                          absolute left-6 top-1/2 -translate-y-1/2
                          bg-black/90 backdrop-blur-sm rounded-lg px-2 py-1.5 md:px-3 md:py-2
                          border ${currentColors.border}
                          text-xs md:text-sm ${currentColors.text} font-medium
                          max-w-[120px] sm:max-w-none sm:whitespace-nowrap
                          break-words sm:break-normal
                        `}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.7 }}
                      >
                        {hotspot.label}
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}