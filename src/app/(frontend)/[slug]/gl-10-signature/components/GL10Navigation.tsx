'use client'

import { motion } from 'framer-motion'
import { PlayCircle, Grid3x3, Piano, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewType = 'signature' | 'gallery' | 'baby-grand' | 'millennium-action'

interface GL10NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  currentStep: number
  className?: string
}

interface NavItem {
  id: ViewType
  label: string
  icon: React.ReactNode
  description: string
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'signature',
    label: 'Experience',
    icon: <PlayCircle className="w-5 h-5" />,
    description: 'Return to your signature journey'
  },
  {
    id: 'millennium-action',
    label: 'GL-10',
    icon: <Settings className="w-5 h-5" />,
    description: 'Advanced action technology'
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: <Grid3x3 className="w-5 h-5" />,
    description: 'Explore stunning imagery'
  },
  {
    id: 'baby-grand',
    label: 'Features',
    icon: <Piano className="w-5 h-5" />,
    description: 'Features & specifications'
  }
]

export default function GL10Navigation({
  currentView,
  onViewChange,
  currentStep,
  className
}: GL10NavigationProps) {
  const handleNavClick = (view: ViewType) => {
    onViewChange(view)
  }

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      className={cn(
        'fixed bottom-6 left-0 right-0 z-50',
        'flex justify-center items-center',
        'pointer-events-none',
        className
      )}
    >
      {/* Glassmorphism Navigation Container */}
      <div
        className={cn(
          'pointer-events-auto',
          'max-w-fit mx-auto px-3 py-2.5',
          // Glassmorphism effects
          'bg-[#FAF8F5]/10 backdrop-blur-[24px]',
          'border border-white/20',
          'rounded-full',
          'shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
          // Inner shadow for depth
          'shadow-inner shadow-white/10',
          // Mobile optimization
          'md:px-4 md:py-3'
        )}
      >
        {/* Navigation Items */}
        <div className="flex items-center gap-1 md:gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'relative group',
                'flex items-center gap-2',
                'px-3 py-2 md:px-4 md:py-2.5',
                'rounded-full',
                'text-sm font-medium',
                'transition-all duration-300 ease-out',
                'min-w-[44px] min-h-[44px]', // Touch target size
                // Hover effects
                'hover:scale-105',
                // Active state
                currentView === item.id
                  ? [
                      'bg-gradient-to-r from-[#8B7355]/30 to-[#D4AF37]/20',
                      'text-[#8B7355]',
                      'shadow-[0_0_20px_rgba(139,115,85,0.3)]',
                      'backdrop-blur-sm'
                    ]
                  : [
                      'text-gray-700 hover:text-kawai-red',
                      'hover:bg-white/30'
                    ]
              )}
              aria-label={item.description}
              title={item.description}
            >
              {/* Icon */}
              <span className={cn(
                'transition-all duration-300',
                currentView === item.id && 'scale-110'
              )}>
                {item.icon}
              </span>

              {/* Label - Hidden on mobile, shown on desktop */}
              <span className="hidden md:inline-block whitespace-nowrap">
                {item.label}
              </span>

              {/* Active indicator glow */}
              {currentView === item.id && (
                <motion.div
                  layoutId="activeNavGlow"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B7355]/20 to-[#D4AF37]/20 blur-md -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
