'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { OfferSignupForm } from './OfferSignupForm'
import { offerCopy } from './campaign'
import { EASE_OUT_EXPO } from './motion'

/**
 * Dealer-discount popup. A thin shell around the shared {@link OfferSignupForm}
 * so the modal and the inline hero card render the exact same form.
 *
 * Built on Radix Dialog primitives (focus trap, Escape, click-outside, aria) but
 * animated with framer-motion for a snappier feel than the CSS-keyframe shared
 * Modal: a blurred backdrop fades in while the panel springs up. Reduced motion
 * collapses to a plain fade.
 *
 * Square corners, like every other edge on this page — the rounded shell it
 * inherited from /signup2 belongs to that page's brand-pill vocabulary.
 */

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function OfferModal({ isOpen, onClose }: Props) {
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
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
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
                  className="pointer-events-auto relative max-h-[90vh] w-full max-w-md overflow-y-auto bg-kawai-pearl p-6 text-kawai-black shadow-[0_30px_80px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:p-8"
                >
                  {/* Visually-hidden labels satisfy the dialog's a11y contract; the
                      visible heading/body live inside OfferSignupForm. */}
                  <DialogPrimitive.Title className="sr-only">{offerCopy.headline}</DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">{offerCopy.body}</DialogPrimitive.Description>

                  <DialogPrimitive.Close
                    className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center text-kawai-charcoal/70 transition-colors hover:bg-kawai-black/5 hover:text-kawai-black focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>

                  <OfferSignupForm />
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
