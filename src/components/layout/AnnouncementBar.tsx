'use client'

import { useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AnnouncementBarProps {
  messages: string[]
  link?: string
  style: 'gradient' | 'red' | 'black' | 'white' | 'red-gradient'
  size: 'small' | 'medium' | 'large'
  speed?: number
  divider?: 'bullet' | 'pipe' | 'slash' | 'dash' | 'star' | 'diamond' | 'spaces'
}

const styleClasses = {
  gradient: 'bg-gradient-to-r from-gray-50 via-white to-gray-50 text-gray-700',
  red: 'bg-kawai-red text-white',
  black: 'bg-kawai-charcoal text-white',
  white: 'bg-white text-kawai-charcoal border-b border-gray-200',
  'red-gradient': 'bg-gradient-to-r from-kawai-red via-red-600 to-kawai-red text-white'
}

const sizeClasses = {
  small: 'text-xs md:text-sm py-1.5',
  medium: 'text-sm md:text-base py-2',
  large: 'text-base md:text-lg py-2.5'
}

// Height values for CSS variable (reduced for more compact appearance)
const sizeHeights = {
  small: '28px',
  medium: '36px',
  large: '42px'
}

// Divider characters
const dividerChars = {
  bullet: '•',
  pipe: '|',
  slash: '/',
  dash: '-',
  star: '★',
  diamond: '◆',
  spaces: ''
}

export function AnnouncementBar({
  messages,
  link,
  style,
  size,
  speed = 40,
  divider = 'bullet'
}: AnnouncementBarProps) {
  // Set CSS variable on document root so it's accessible by header and layout
  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--announcement-bar-height', sizeHeights[size])

    // Cleanup: remove the variable when component unmounts
    return () => {
      document.documentElement.style.setProperty('--announcement-bar-height', '0px')
    }
  }, [size])

  // Concatenate all messages with selected divider (trim each message first)
  const dividerChar = dividerChars[divider]
  const separator = dividerChar ? `  ${dividerChar}  ` : '     '
  const text = messages
    .map(msg => msg.trim())
    .filter(msg => msg.length > 0)
    .join(separator)

  const content = (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 w-full overflow-hidden',
        styleClasses[style],
        sizeClasses[size]
      )}
      style={{
        top: 'calc(var(--geo-banner-height, 0px) + var(--admin-bar-height, 0px))',
        transition: 'top 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
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
              className={cn(
                'flex-shrink-0 whitespace-nowrap pr-12 font-semibold tracking-wide',
                link && 'cursor-pointer hover:opacity-80 transition-opacity'
              )}
              animate={{
                x: ['0%', '-100%'],
              }}
              transition={{
                x: {
                  duration: speed,
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

  // If there's a link, wrap in a Link component
  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    )
  }

  return content
}
