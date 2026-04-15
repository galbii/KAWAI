'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatHistoryTitle, formatHistoryTime, type PageHistoryEntry } from '@/lib/page-history-storage'

interface RecentsDropdownProps {
  isOpen: boolean
  onClose: () => void
  history: PageHistoryEntry[]
  onPanelMouseEnter?: () => void
  onPanelMouseLeave?: () => void
  onTabMouseEnter?: () => void
  className?: string
}

const panelSpring = { type: 'spring', stiffness: 280, damping: 28, mass: 0.9 } as const
const tabSpring  = { type: 'spring', stiffness: 320, damping: 26, mass: 0.8 } as const

export function RecentsDropdown({
  isOpen,
  onClose,
  history,
  onPanelMouseEnter,
  onPanelMouseLeave,
  onTabMouseEnter,
  className,
}: RecentsDropdownProps) {
  if (history.length === 0) return null

  return (
    <>
      {/* Tab — visible when panel is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="recents-tab"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={tabSpring}
            whileHover={{ x: -5 }}
            onMouseEnter={onTabMouseEnter}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[9200] cursor-pointer group"
          >
            <div
              className={cn(
                'relative flex flex-col items-center justify-center gap-3',
                'w-[36px] py-6',
                'rounded-l-xl overflow-hidden',
                'bg-white/80 backdrop-blur-xl',
                'border-y border-l border-black/[0.07]',
                'shadow-[-4px_0_16px_rgba(0,0,0,0.06)]',
                'transition-shadow duration-300',
                'group-hover:shadow-[-6px_0_20px_rgba(0,0,0,0.09)]',
              )}
            >
              {/* Sheen */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

              <span className="relative w-[1.5px] h-4 rounded-full bg-kawai-neutral group-hover:bg-kawai-red transition-colors duration-300" />

              <span
                className="relative font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/60 group-hover:text-kawai-red tracking-[0.3em] uppercase select-none transition-colors duration-300"
                style={{ fontSize: '9px', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Recents
              </span>

              <span className="relative w-[1.5px] h-4 rounded-full bg-kawai-neutral group-hover:bg-kawai-red transition-colors duration-300" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="recents-panel"
            initial={{ x: 260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 260, opacity: 0 }}
            transition={panelSpring}
            onMouseEnter={onPanelMouseEnter}
            onMouseLeave={onPanelMouseLeave}
            className={cn(
              'fixed right-0 top-1/2 -translate-y-1/2 z-[9200]',
              'w-[248px]',
              'rounded-l-xl overflow-hidden',
              'bg-white/80 backdrop-blur-xl',
              'border-y border-l border-black/[0.07]',
              'shadow-[-6px_0_24px_rgba(0,0,0,0.07)]',
              className,
            )}
          >
            {/* Sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-0" />

            {/* Header row */}
            <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2.5">
              <span
                className="text-kawai-red font-[family-name:var(--font-brand-sans)] tracking-[0.4em] uppercase select-none"
                style={{ fontSize: '8px' }}
              >
                Recents
              </span>
              <button
                onClick={onClose}
                className="text-kawai-charcoal/30 hover:text-kawai-charcoal transition-colors duration-150"
                aria-label="Close recently visited"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>

            {/* Entries */}
            <div className="relative z-10 pb-3">
              {history.map((entry, i) => (
                <Link
                  key={`${entry.path}-${entry.visitedAt}`}
                  href={entry.path}
                  onClick={onClose}
                  className={cn(
                    'group/entry flex flex-col',
                    'px-4 py-2.5',
                    'border-l-[2px] border-transparent hover:border-kawai-red',
                    'hover:bg-black/[0.02]',
                    'transition-[border-color,background-color] duration-200',
                    i > 0 && 'border-t border-black/[0.05]',
                  )}
                >
                  <span
                    className="font-[family-name:var(--font-brand-sans)] text-kawai-black/80 group-hover/entry:text-kawai-red truncate transition-colors duration-150"
                    style={{ fontSize: '12px', fontWeight: 500, lineHeight: '1.4' }}
                  >
                    {formatHistoryTitle(entry.title, entry.path)}
                  </span>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span
                      className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/35 truncate"
                      style={{ fontSize: '10px' }}
                    >
                      {entry.path}
                    </span>
                    <span
                      className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/30 whitespace-nowrap shrink-0"
                      style={{ fontSize: '10px' }}
                    >
                      {formatHistoryTime(entry.visitedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
