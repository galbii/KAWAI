'use client'

import { motion } from 'framer-motion'

export function RebateModelsScroll() {
  const text = 'K15EP ATX3  •  K200EP ATX4  •  K300EP AURES2  •  K500EP AURES2  •  GL10EP ATX4  •  GL30EP AURES2  •  GX2EP AURES2  •  SAVE UP TO $5,000  •  '

  return (
    <div className="relative overflow-hidden py-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div className="flex">
          {/* Repeat text multiple times for seamless infinite scroll */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 text-xl md:text-2xl text-gray-700 whitespace-nowrap pr-4 font-semibold tracking-wide"
              animate={{
                x: ['0%', '-100%'],
              }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              {text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
