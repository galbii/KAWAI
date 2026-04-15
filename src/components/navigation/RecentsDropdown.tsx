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
            initial={{ x: 72, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 72, opacity: 0 }}
            transition={tabSpring}
            whileHover={{ x: -6 }}
            onMouseEnter={onTabMouseEnter}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[9200] cursor-pointer group"
          >
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-3',
                'w-[34px] py-6',
                'bg-white rounded-l-2xl',
                'border-y border-l border-kawai-neutral/25',
                'shadow-[-10px_0_32px_rgba(30,27,22,0.09),-3px_0_8px_rgba(30,27,22,0.05)]',
                'transition-shadow duration-300',
                'group-hover:shadow-[-14px_0_40px_rgba(30,27,22,0.14),-4px_0_12px_rgba(30,27,22,0.08)]',
              )}
            >
              {/* Accent line */}
              <span className="w-[2px] h-5 rounded-full bg-kawai-red/30 group-hover:bg-kawai-red transition-colors duration-300" />

              {/* Label */}
              <span
                className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal group-hover:text-kawai-red tracking-[0.35em] uppercase select-none transition-colors duration-300"
                style={{
                  fontSize: '8px',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                Recents
              </span>

              {/* Accent line */}
              <span className="w-[2px] h-5 rounded-full bg-kawai-red/30 group-hover:bg-kawai-red transition-colors duration-300" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="recents-panel"
            initial={{ x: 280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 280, opacity: 0 }}
            transition={panelSpring}
            onMouseEnter={onPanelMouseEnter}
            onMouseLeave={onPanelMouseLeave}
            className={cn(
              'fixed right-0 top-1/2 -translate-y-1/2 z-[9200]',
              'w-[268px]',
              'bg-white rounded-l-2xl overflow-hidden',
              'border-y border-l border-kawai-neutral/25',
              'shadow-[-16px_0_48px_rgba(30,27,22,0.12),-5px_0_16px_rgba(30,27,22,0.07)]',
              className,
            )}
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <span
                className="text-kawai-red font-[family-name:var(--font-brand-sans)] tracking-[0.45em] uppercase select-none"
                style={{ fontSize: '9px' }}
              >
                Recents
              </span>
              <button
                onClick={onClose}
                className="text-kawai-charcoal/40 hover:text-kawai-black transition-colors duration-150"
                aria-label="Close recently visited"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Entries */}
            <div className="pb-4">
              {history.map((entry, i) => (
                <Link
                  key={`${entry.path}-${entry.visitedAt}`}
                  href={entry.path}
                  onClick={onClose}
                  className={cn(
                    'group/entry flex flex-col',
                    'px-5 py-3',
                    'border-l-[2px] border-transparent hover:border-kawai-red',
                    'transition-[border-color] duration-200',
                    i > 0 && 'border-t border-kawai-neutral/15',
                  )}
                >
                  <span
                    className="font-[family-name:var(--font-brand-sans)] text-kawai-black group-hover/entry:text-kawai-red truncate transition-colors duration-150"
                    style={{ fontSize: '13px', fontWeight: 500, lineHeight: '1.4' }}
                  >
                    {formatHistoryTitle(entry.title, entry.path)}
                  </span>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span
                      className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/40 truncate"
                      style={{ fontSize: '11px' }}
                    >
                      {entry.path}
                    </span>
                    <span
                      className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/35 whitespace-nowrap shrink-0"
                      style={{ fontSize: '11px' }}
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
