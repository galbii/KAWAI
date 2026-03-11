'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { DealerType } from './DealerTypeFilter'

interface ProductCategoryDisplayProps {
  dealerTypeFilter: DealerType
}

const productTexts: Record<DealerType, string> = {
  'all': 'GRAND PIANOS  •  DIGITAL PIANOS  •  UPRIGHT PIANOS  •  HYBRID PIANOS  •  CONCERT  •  PROFESSIONAL  •  STAGE  •  STUDIO  •  ',
  'shigeru': 'SHIGERU KAWAI SK SERIES  •  SK-EX CONCERT GRAND  •  SK-7 ARTIST GRAND  •  SK-5 PROFESSIONAL  •  SK-3 STUDIO GRAND  •  SK-2 CHAMBER GRAND  •  HANDCRAFTED PRECISION  •  ',
  'acoustic': 'GX BLAK CONCERT GRANDS  •  GL GRAND SERIES  •  K PROFESSIONAL UPRIGHTS  •  ND DESIGNER SERIES  •  NOVUS HYBRID PIANOS  •  ANYTIME ATX & AURES SERIES  •  INSTITUTIONAL UPRIGHTS  •  ',
  'professional': 'MP11SE STAGE PIANO  •  MP7SE STAGE PIANO  •  ES PORTABLE SERIES  •  VPC1 VIRTUAL CONTROLLER  •  CA CONCERT ARTIST  •  CN DIGITAL SERIES  •  KDP HOME DIGITAL  •  ',
}

export function ProductCategoryDisplay({ dealerTypeFilter }: ProductCategoryDisplayProps) {
  const text = productTexts[dealerTypeFilter]

  return (
    <div className="relative overflow-hidden py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={dealerTypeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="flex">
            {/* Repeat text multiple times for seamless infinite scroll */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 text-[15px] text-gray-700 whitespace-nowrap pr-3 font-medium tracking-wide"
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
      </AnimatePresence>
    </div>
  )
}
