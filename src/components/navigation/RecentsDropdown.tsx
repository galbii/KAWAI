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
  /** Attach to the panel so hovering it cancels the close timeout */
  onPanelMouseEnter?: () => void
  onPanelMouseLeave?: () => void
  className?: string
}

export function RecentsDropdown({
  isOpen,
  onClose,
  history,
  onPanelMouseEnter,
  onPanelMouseLeave,
  className,
}: RecentsDropdownProps) {
  if (history.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="recents-dropdown"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          onMouseEnter={onPanelMouseEnter}
          onMouseLeave={onPanelMouseLeave}
          className={cn(
            'fixed bottom-6 right-6 z-[9200]',
            'w-[460px]',
            'bg-white rounded-2xl overflow-hidden',
            'border border-kawai-neutral/20',
            'shadow-[0_20px_60px_rgba(30,27,22,0.18),0_8px_24px_rgba(30,27,22,0.12),0_2px_6px_rgba(30,27,22,0.08)]',
            className,
          )}
        >
          {/* Label row */}
          <div className="flex items-center justify-between px-7 pt-6 pb-4">
            <span
              className="text-kawai-red font-[family-name:var(--font-brand-sans)] tracking-[0.45em] uppercase select-none"
              style={{ fontSize: '9px' }}
            >
              Recents
            </span>
            <button
              onClick={onClose}
              className="text-kawai-charcoal hover:text-kawai-black transition-colors duration-150"
              aria-label="Close recently visited"
            >
              <X className="h-3.5 w-3.5" />
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
                  'group flex items-start justify-between',
                  'pl-7 pr-7 py-4',
                  'border-l-[3px] border-transparent hover:border-kawai-red',
                  'transition-[border-color] duration-200',
                  i > 0 && 'border-t border-kawai-neutral/15',
                )}
              >
                <div className="flex flex-col min-w-0 flex-1 mr-6">
                  <span
                    className="font-[family-name:var(--font-brand-sans)] text-kawai-black group-hover:text-kawai-red truncate transition-colors duration-150"
                    style={{ fontSize: '15px', fontWeight: 500, lineHeight: '1.4' }}
                  >
                    {formatHistoryTitle(entry.title, entry.path)}
                  </span>
                  <span
                    className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/55 truncate mt-1"
                    style={{ fontSize: '12px', letterSpacing: '0.01em' }}
                  >
                    {entry.path}
                  </span>
                </div>

                <span
                  className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/50 whitespace-nowrap shrink-0 mt-0.5"
                  style={{ fontSize: '12px' }}
                >
                  {formatHistoryTime(entry.visitedAt)}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
