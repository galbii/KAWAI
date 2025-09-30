"use client";

import { motion } from 'framer-motion';

interface ValueItem {
  value: string;
  label: string;
}

interface ValuePropositionProps {
  items: ValueItem[];
  isInView: boolean;
  delay?: number;
  title?: string;
}

export function ValueProposition({
  items,
  isInView,
  delay = 4.5,
  title
}: ValuePropositionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{
        delay: isInView ? delay : 0,
        duration: 1.5
      }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    >
      {title && (
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 20
            }}
            transition={{
              delay: isInView ? delay + (index * 0.2) : 0,
              duration: 0.8
            }}
          >
            <p className="text-2xl md:text-3xl font-bold text-white">
              {item.value}
            </p>
            <p className="text-white/70 text-sm">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
