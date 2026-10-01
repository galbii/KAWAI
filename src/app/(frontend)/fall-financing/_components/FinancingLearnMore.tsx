'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { learnMore } from './campaign'

/**
 * The explainer dialog: what the two-part term actually does to a payment.
 *
 * ── Read this before adding anything to it ───────────────────────────────
 *
 * This is NOT the Supporting Disclosure and must never become it. §4.4 of the
 * developer requirements forbids putting the disclosure behind an accordion,
 * tab, read-more toggle or modal — it has to be visible HTML text on page load,
 * which it is, in FinancingDisclosure at the foot of the page.
 *
 * What belongs here is the single mechanical fact the figures do not explain
 * themselves: the promotional payments are sized against the full 60-month
 * term, so they do not clear the balance, which is why the payment rises at
 * month 25. Nothing in here carries a footnote mark, an APR figure standing
 * alone, or any sentence lifted from the disclosure.
 *
 * Radix primitives with framer-motion chrome, matching LeadModal — the dialogs
 * on this page should feel like one thing.
 */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export function FinancingLearnMore({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const reduce = useReducedMotion()

  const panel = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15, ease: EASE_OUT_EXPO },
      }
    : {
        initial: { opacity: 0, scale: 0.94, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.97, y: 10 },
        transition: { type: 'spring' as const, stiffness: 320, damping: 28, mass: 0.7 },
      }

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
              />
            </DialogPrimitive.Overlay>

            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  initial={panel.initial}
                  animate={panel.animate}
                  exit={panel.exit}
                  transition={panel.transition}
                  className="pointer-events-auto relative max-h-[85vh] w-full max-w-lg overflow-y-auto bg-kawai-pearl p-6 text-kawai-black shadow-[0_30px_80px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:p-8"
                >
                  <DialogPrimitive.Close className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center text-kawai-charcoal/70 transition-colors hover:bg-kawai-black/5 hover:text-kawai-black focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red">
                    <XMarkIcon className="h-5 w-5" />
                    <span className="sr-only">{learnMore.closeCta}</span>
                  </DialogPrimitive.Close>

                  {/* h2, not h1 — the page h1 is the campaign name and a dialog
                      does not get to outrank it. */}
                  <DialogPrimitive.Title asChild>
                    <h2 className="promo-h2 pr-10 text-[1.6rem] leading-tight text-kawai-black">
                      {learnMore.heading}
                    </h2>
                  </DialogPrimitive.Title>

                  <DialogPrimitive.Description className="sr-only">
                    {learnMore.body[0]}
                  </DialogPrimitive.Description>

                  <div className="mt-6 space-y-4 border-t border-kawai-neutral pt-6">
                    {learnMore.body.map((para) => (
                      <p
                        key={para}
                        className="promo-body text-[0.95rem] leading-relaxed text-kawai-charcoal"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
