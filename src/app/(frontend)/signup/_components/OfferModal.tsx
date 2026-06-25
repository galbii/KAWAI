'use client'

import { Modal } from '@/components/ui/modal'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { OfferSignupForm } from './OfferSignupForm'
import { offerCopy } from './scenes'

/**
 * Dealer-discount popup. A thin shell around the shared {@link OfferSignupForm}
 * so the modal and the inline hero card render the exact same form — change the
 * form once, both placements update. The dialog unmounts on close (Radix), so
 * each reopen starts fresh; no manual reset needed.
 */

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function OfferModal({ isOpen, onClose }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="max-h-[90vh] overflow-y-auto bg-kawai-pearl text-kawai-black"
    >
      {/* Visually-hidden labels satisfy the dialog's a11y contract; the visible
          heading/body live inside OfferSignupForm. */}
      <DialogTitle className="sr-only">{offerCopy.headline}</DialogTitle>
      <DialogDescription className="sr-only">{offerCopy.body}</DialogDescription>

      <OfferSignupForm />
    </Modal>
  )
}
