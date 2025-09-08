'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface KawaiLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  theme?: 'light' | 'dark'
  dealerName?: string
}

const sizeMap = {
  sm: { width: 140, height: 28, textSize: 'text-sm', subText: 'text-xs' },
  md: { width: 180, height: 36, textSize: 'text-base', subText: 'text-xs' },
  lg: { width: 240, height: 48, textSize: 'text-xl', subText: 'text-xs' }
}

export function KawaiLogo({ className, size = 'md', animated = true, theme = 'light', dealerName }: KawaiLogoProps) {
  const { width, height, textSize, subText } = sizeMap[size]
  
  const textColors = {
    light: {
      primary: 'text-gray-900',
      secondary: 'text-gray-500'
    },
    dark: {
      primary: 'text-white',
      secondary: 'text-gray-300'
    }
  }

  const logoVariants = {
    initial: { scale: 1, filter: 'drop-shadow(0 2px 4px rgba(30, 27, 22, 0.1))' },
    hover: { 
      scale: 1.02,
      filter: 'drop-shadow(0 8px 16px rgba(30, 27, 22, 0.15))',
      transition: { 
        duration: 0.3,
      }
    }
  }

  const textVariants = {
    initial: { y: 0 },
    hover: { 
      y: -1,
      transition: { 
        duration: 0.3,
      }
    }
  }

  // Parse dealer name into location and suffix
  const parseLocationText = (dealerName?: string) => {
    if (!dealerName) {
      return { location: 'ST. LOUIS', suffix: 'PIANO GALLERY' }
    }
    
    // Handle different dealer name formats
    if (dealerName.toUpperCase().includes('PIANO GALLERY')) {
      const location = dealerName.replace(/PIANO GALLERY/i, '').trim().toUpperCase()
      return { location: location || 'KAWAI', suffix: 'PIANO GALLERY' }
    } else {
      return { location: dealerName.toUpperCase(), suffix: 'PIANO GALLERY' }
    }
  }

  const { location, suffix } = parseLocationText(dealerName)

  const LogoContent = () => (
    <>
      <Image
        src={`/images/logos/kawai-logo-red-${size === 'sm' ? '1x' : size === 'md' ? '2x' : '3x'}.png`}
        alt="Kawai Piano"
        width={width}
        height={height}
        className="object-contain flex-shrink-0"
        priority
        quality={90}
        sizes={`(max-width: 768px) ${sizeMap.sm.width}px, (max-width: 1024px) ${sizeMap.md.width}px, ${sizeMap.lg.width}px`}
        style={{
          width: size === 'sm' ? '140px' : size === 'md' ? '180px' : '240px',
          height: 'auto'
        }}
      />
      {animated ? (
        <motion.div variants={textVariants} className="flex-shrink-0">
          <div className={cn("font-bold tracking-wide kawai-heading whitespace-nowrap", textColors[theme].primary, textSize)}>
            {location}
          </div>
          <div className={cn("-mt-1 tracking-widest font-medium whitespace-nowrap", textColors[theme].secondary, subText)}>
            {suffix}
          </div>
        </motion.div>
      ) : (
        <div className="flex-shrink-0">
          <div className={cn("font-bold tracking-wide kawai-heading whitespace-nowrap", textColors[theme].primary, textSize)}>
            {location}
          </div>
          <div className={cn("-mt-1 tracking-widest font-medium whitespace-nowrap", textColors[theme].secondary, subText)}>
            {suffix}
          </div>
        </div>
      )}
    </>
  )

  if (animated) {
    return (
      <Link 
        href="/" 
        className={cn("kawai-logo-container", className)}
        aria-label="Kawai Piano - Home"
      >
        <motion.div 
          className="flex items-center space-x-2 sm:space-x-3"
          variants={logoVariants}
          initial="initial"
          whileHover="hover"
        >
          <LogoContent />
        </motion.div>
      </Link>
    )
  }

  return (
    <Link 
      href="/" 
      className={cn("kawai-logo-container", className)}
      aria-label="Kawai Piano - Home"
    >
      <div className="flex items-center space-x-2 sm:space-x-3">
        <LogoContent />
      </div>
    </Link>
  )
}