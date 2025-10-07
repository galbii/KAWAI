"use client";

import { motion } from 'framer-motion';

interface Spec {
  value: string | number;
  label: string;
}

interface SpecificationGridProps {
  specs: Spec[];
  isInView: boolean;
  delay?: number;
}

export function SpecificationGrid({
  specs,
  isInView,
  delay = 1.5
}: SpecificationGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 30
      }}
      transition={{ delay: isInView ? delay : 0, duration: 1 }}
      className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/20"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
        {specs.map((spec, index) => (
          <motion.div
            key={spec.label}
            className="space-y-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0.8
            }}
            transition={{
              delay: isInView ? delay + (index * 0.1) : 0,
              duration: 0.5
            }}
          >
            <p className="text-2xl md:text-3xl font-bold text-blue-400">
              {spec.value}
            </p>
            <p className="text-white/70 text-sm">{spec.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
