"use client";

import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  icon: string;
  description: string;
  detail: string;
  isActive?: boolean;
  index: number;
  isInView: boolean;
}

export function FeatureCard({
  title,
  icon,
  description,
  detail,
  isActive = false,
  index,
  isInView
}: FeatureCardProps) {
  return (
    <motion.div
      className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
        isActive
          ? 'border-blue-500 bg-blue-500/10 shadow-2xl'
          : 'border-white/20 bg-white/5'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20,
        scale: isActive ? 1.05 : 1,
      }}
      transition={{
        delay: isInView ? index * 0.2 : 0,
        duration: 0.8
      }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm md:text-base mb-3">{description}</p>

      <motion.p
        className="text-blue-400 text-xs md:text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isActive ? 1 : 0.7
        }}
        transition={{ duration: 0.3 }}
      >
        {detail}
      </motion.p>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      )}

      {/* Glow effect for active card */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-blue-500/20 rounded-2xl -z-10"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
}
