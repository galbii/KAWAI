'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useNavigationContext } from '@/contexts/NavigationContext'
import { getContextAwareAriaLabel } from '@/lib/navigation-utils'

interface KawaiLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  theme?: 'light' | 'dark'
  dealerName?: string
  /** Override the home URL (if not provided, uses navigation context) */
  homeUrl?: string
  /** Override aria-label for accessibility */
  ariaLabel?: string
  /** Make logo non-clickable (render as div instead of Link) */
  nonClickable?: boolean
}

const sizeMap = {
  sm: { width: 140, height: 28, textSize: 'text-sm', subText: 'text-xs' },
  md: { width: 180, height: 36, textSize: 'text-base', subText: 'text-xs' },
  lg: { width: 240, height: 48, textSize: 'text-xl', subText: 'text-xs' }
}

export function KawaiLogo({
  className,
  size = 'md',
  animated = true,
  theme = 'light',
  dealerName,
  homeUrl,
  ariaLabel,
  nonClickable = false
}: KawaiLogoProps) {
  const { width, height, textSize, subText } = sizeMap[size]

  // Navigation context is now initialised server-side from the cookie, so the
  // first client render always matches the server render — no hydration mismatch,
  // no mounted guard needed.
  const { origin, isInitialized } = useNavigationContext()
  const contextAwareHomeUrl = homeUrl ?? '/'
  const contextAwareAriaLabel = ariaLabel || getContextAwareAriaLabel('Kawai Piano - Home', origin)

  // Handle logo click - scroll to top if already on home page
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if we're on the home page by comparing current path with contextAwareHomeUrl
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.replace(/\/$/, '') // Remove trailing slash
      const targetPath = contextAwareHomeUrl.replace(/\/$/, '') // Remove trailing slash

      // If we're already on the target page, scroll to top instead of navigating
      if (currentPath === targetPath || (currentPath === '' && targetPath === '')) {
        e.preventDefault()
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  }
  
  
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

  // Parse dealer name into location and suffix based on navigation context
  const parseLocationText = (dealerName?: string) => {
    // If we're on the main site (not a dealer location), no text - just logo
    if (!origin.isDealerLocation) {
      return { location: '', suffix: '' }
    }

    // For dealer locations without a name, just show logo
    if (!dealerName) {
      return { location: '', suffix: '' }
    }

    // Handle different dealer name formats - strip out "Piano Gallery" and "Kawai" references
    const cleanName = dealerName
      .replace(/PIANO GALLERY/gi, '')
      .replace(/KAWAI/gi, '')
      .trim()
    const locationName = cleanName ? cleanName.toUpperCase() : ''

    // Only show text if we have a valid location name
    if (!locationName) {
      return { location: '', suffix: '' }
    }

    return { location: locationName, suffix: 'Official Storefront' }
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
      {location && (
        <>
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
      )}
    </>
  )

  // Determine layout direction based on whether we have a location
  const layoutClasses = location
    ? "flex items-center space-x-2 sm:space-x-3"
    : "flex flex-col items-center space-y-1"

  if (animated) {
    if (nonClickable) {
      return (
        <div className={cn("kawai-logo-container", className)}>
          <motion.div
            className={layoutClasses}
            variants={logoVariants}
            initial="initial"
            whileHover="hover"
          >
            <LogoContent />
          </motion.div>
        </div>
      )
    }

    return (
      <Link
        href={contextAwareHomeUrl}
        className={cn("kawai-logo-container", className)}
        aria-label={contextAwareAriaLabel}
        onClick={handleLogoClick}
      >
        <motion.div
          className={layoutClasses}
          variants={logoVariants}
          initial="initial"
          whileHover="hover"
        >
          <LogoContent />
        </motion.div>
      </Link>
    )
  }

  if (nonClickable) {
    return (
      <div className={cn("kawai-logo-container", className)}>
        <div className={layoutClasses}>
          <LogoContent />
        </div>
      </div>
    )
  }

  return (
    <Link
      href={contextAwareHomeUrl}
      className={cn("kawai-logo-container", className)}
      aria-label={contextAwareAriaLabel}
      onClick={handleLogoClick}
    >
      <div className={layoutClasses}>
        <LogoContent />
      </div>
    </Link>
  )
}