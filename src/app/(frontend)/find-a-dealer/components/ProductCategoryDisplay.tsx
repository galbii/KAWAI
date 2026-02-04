'use client'

import { motion, AnimatePresence } from 'framer-motion'

type DealerTypeFilter = 'all' | 'professional-products' | 'acoustic-digital'

interface ProductCategoryDisplayProps {
  dealerTypeFilter: DealerTypeFilter
}

const productTexts = {
  'all': 'GRAND PIANOS  •  DIGITAL PIANOS  •  UPRIGHT PIANOS  •  HYBRID PIANOS  •  CONCERT  •  PROFESSIONAL  •  STAGE  •  STUDIO  •  ',
  'professional-products': 'MP11SE & MP7SE STAGE PIANOS  •  VPC1 VIRTUAL PIANO CONTROLLER  •  CA/CN/DG/KDP DIGITAL PIANOS  •  ES SERIES PORTABLE PIANOS  •  PROFESSIONAL ACCESSORIES  •  ',
  'acoustic-digital': 'GX BLAK & GL GRAND PIANOS  •  K SERIES PROFESSIONAL UPRIGHTS  •  NOVUS HYBRID PIANOS  •  AURES & ATX HYBRIDS  •  CA/CN/KDP/ES DIGITAL PIANOS  •  DESIGNER STUDIO & CONSOLE PIANOS  •  INSTITUTIONAL UPRIGHTS  •  ',
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
