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
  'digital': 'CA CONCERT ARTIST SERIES  •  CN DIGITAL SERIES  •  ES PORTABLE SERIES  •  KDP HOME DIGITAL  •  CS DIGITAL GRAND  •  NOVUS NV HYBRID SERIES  •  ',
}

export function ProductCategoryDisplay({ dealerTypeFilter }: ProductCategoryDisplayProps) {
  const text = productTexts[dealerTypeFilter]

  return (
    <div className="relative overflow-hidden py-3 bg-gradient-to-r from-kawai-pearl/60 via-white to-kawai-pearl/60 rounded-sm">
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
                className="flex-shrink-0 text-[11px] text-kawai-charcoal/50 whitespace-nowrap pr-3 font-semibold tracking-[0.12em]"
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
