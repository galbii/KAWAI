'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface WelcomeScreenProps {
  onContinue: () => void
  className?: string
}

export function WelcomeScreen({ onContinue, className }: WelcomeScreenProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <div className={cn("min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4", className)}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Kawai Logo */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div className="flex justify-center">
              <Image
                src="/images/Kawai (Red)(2).png"
                alt="Kawai Piano"
                width={200}
                height={52}
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-kawai-black mb-6">
              <span className="block font-serif text-kawai-red">Exclusive Invitation</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-kawai-black/80 max-w-2xl mx-auto leading-relaxed mb-6">
              Request your invitation to our exclusive signature piano event featuring KAWAI's most prestigious instruments and master craftsman consultations.
            </p>
            <p className="text-lg text-kawai-black/60 max-w-xl mx-auto">
              Answer a few quick questions to confirm your eligibility for this exclusive, invitation-only event.
            </p>
          </motion.div>

          {/* Ready Check */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.button
              onClick={onContinue}
              className="bg-kawai-red text-white px-8 py-4 text-lg font-medium rounded-lg hover:bg-kawai-red/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              Request Invitation
            </motion.button>
          </motion.div>

          {/* Minimal Info */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default WelcomeScreen