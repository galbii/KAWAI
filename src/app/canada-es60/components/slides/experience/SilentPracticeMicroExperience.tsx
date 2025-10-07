"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SilentPracticeMicroExperienceProps {
  isActive: boolean;
}

type Scenario = 'apartment' | 'dorm' | 'latenight';

interface ScenarioConfig {
  id: Scenario;
  icon: string;
  title: string;
  message: string;
  detail: string;
  color: string;
}

const scenarios: ScenarioConfig[] = [
  {
    id: 'apartment',
    icon: '🏢',
    title: 'Apartment',
    message: 'Practice anytime without disturbing neighbors',
    detail: 'Perfect for city living and shared walls',
    color: 'blue',
  },
  {
    id: 'dorm',
    icon: '🎓',
    title: 'Dorm Room',
    message: 'Dual headphone jacks for late-night sessions',
    detail: 'Study and practice with a friend',
    color: 'green',
  },
  {
    id: 'latenight',
    icon: '🌙',
    title: 'Late Night',
    message: 'Exceptional through-headphone sound quality',
    detail: '2am inspiration sessions - no problem',
    color: 'purple',
  },
];

export function SilentPracticeMicroExperience({ isActive }: SilentPracticeMicroExperienceProps) {
  const [activeScenario, setActiveScenario] = useState<Scenario>('apartment');

  const currentScenario = scenarios.find(s => s.id === activeScenario) || scenarios[0]!;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-8"
      >
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          Practice Anytime, Anywhere
        </h3>
        <p className="text-white/70 text-sm">
          Choose your scenario to see how ES60 fits your lifestyle
        </p>
      </motion.div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 w-full max-w-md">
        {scenarios.map((scenario, index) => {
          const isSelectedScenario = scenario.id === activeScenario;

          return (
            <motion.button
              key={scenario.id}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                         ${isSelectedScenario
                           ? `border-${scenario.color}-500 bg-${scenario.color}-500/10`
                           : 'border-white/20 bg-white/5 hover:border-white/40'
                         }`}
              onClick={() => setActiveScenario(scenario.id)}
              disabled={!isActive}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isActive ? 1 : 0,
                y: isActive ? 0 : 20,
                scale: isSelectedScenario ? 1.05 : 1,
              }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              {...(isActive && !isSelectedScenario ? { whileHover: { scale: 1.02 } } : {})}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-3xl md:text-4xl mb-2">{scenario.icon}</div>
              <p className={`text-xs md:text-sm font-medium transition-colors
                           ${isSelectedScenario ? 'text-white' : 'text-white/70'}`}>
                {scenario.title}
              </p>

              {/* Active indicator */}
              {isSelectedScenario && (
                <motion.div
                  className={`absolute -top-1 -right-1 w-4 h-4 bg-${scenario.color}-500 rounded-full
                             flex items-center justify-center`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Scenario Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-lg"
        >
          {/* Main Message */}
          <motion.div
            className={`bg-${currentScenario.color}-500/10 border border-${currentScenario.color}-500/30
                       rounded-xl p-6 mb-4`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <p className="text-lg md:text-xl font-semibold text-white mb-2">
              {currentScenario.message}
            </p>
            <p className="text-sm text-white/70">
              {currentScenario.detail}
            </p>
          </motion.div>

          {/* Visual Representation */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Piano Icon */}
            <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎹</span>
            </div>

            {/* Connection Line */}
            <div className="flex-1 max-w-[100px] relative">
              <div className={`h-1 bg-${currentScenario.color}-500/30 rounded-full`} />
              <motion.div
                className={`absolute top-0 left-0 h-1 bg-${currentScenario.color}-500 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </div>

            {/* Headphones Icon */}
            <div className={`w-16 h-16 bg-${currentScenario.color}-500/20 rounded-lg
                           flex items-center justify-center border-2 border-${currentScenario.color}-500/50`}>
              <span className="text-2xl">🎧</span>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-2 gap-3 text-xs md:text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-lg p-2">
              <p className="font-medium text-white">Dual Outputs</p>
              <p className="text-white/60">Practice together</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-2">
              <p className="font-medium text-white">Premium Sound</p>
              <p className="text-white/60">Studio quality</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* SEO Content (hidden) */}
      <div className="sr-only">
        Silent practice with dual headphone jacks. Perfect for apartments, dorms, and late-night practice.
        Exceptional headphone sound quality for quiet practice sessions. Best piano for apartment living.
        Practice piano without disturbing neighbors or roommates.
      </div>
    </div>
  );
}
