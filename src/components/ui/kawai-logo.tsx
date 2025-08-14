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
}

const sizeMap = {
  sm: { width: 160, height: 32, textSize: 'text-lg', subText: 'text-xs' },
  md: { width: 240, height: 48, textSize: 'text-xl', subText: 'text-xs' },
  lg: { width: 320, height: 64, textSize: 'text-3xl', subText: 'text-sm' }
}

export function KawaiLogo({ className, size = 'md', animated = true, theme = 'light' }: KawaiLogoProps) {
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

  const LogoContent = () => (
    <>
      <Image
        src={`/images/logos/kawai-logo-red-${size === 'sm' ? '1x' : size === 'md' ? '2x' : '3x'}.png`}
        alt="Kawai Piano"
        width={width}
        height={height}
        className="object-contain"
        priority
        quality={90}
        sizes={`(max-width: 768px) ${sizeMap.sm.width}px, (max-width: 1024px) ${sizeMap.md.width}px, ${sizeMap.lg.width}px`}
        style={{
          width: size === 'sm' ? '160px' : size === 'md' ? '240px' : '320px',
          height: 'auto'
        }}
      />
      {animated ? (
        <motion.div variants={textVariants}>
          <div className={cn("font-bold tracking-wide kawai-heading", textColors[theme].primary, textSize)}>
            ST. LOUIS
          </div>
          <div className={cn("-mt-1 tracking-widest font-medium", textColors[theme].secondary, subText)}>
            PIANO GALLERY
          </div>
        </motion.div>
      ) : (
        <div>
          <div className={cn("font-bold tracking-wide kawai-heading", textColors[theme].primary, textSize)}>
            ST. LOUIS
          </div>
          <div className={cn("-mt-1 tracking-widest font-medium", textColors[theme].secondary, subText)}>
            PIANO GALLERY
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
          className="flex items-center space-x-3"
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
      <div className="flex items-center space-x-3">
        <LogoContent />
      </div>
    </Link>
  )
}