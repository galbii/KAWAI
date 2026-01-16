/**
 * Example usage of useModal hook
 *
 * This file demonstrates various ways to use the useModal hook.
 * Delete this file when you no longer need the examples.
 */

'use client'

import { useModal } from '@/hooks'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

// Example 1: Basic modal
export function BasicModalExample() {
  const modal = useModal()

  return (
    <>
      <button onClick={modal.open}>Open Modal</button>

      <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
        <DialogContent>
          <DialogTitle>Basic Modal</DialogTitle>
          <p>This is a basic modal example.</p>
          <button onClick={modal.close}>Close</button>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Example 2: Auto-show modal with delay
export function AutoShowModalExample() {
  const modal = useModal({
    autoShow: {
      delay: 5000, // Show after 5 seconds
      storageKey: 'promo-modal-shown', // Only show once per user
    },
    onOpen: () => console.log('Promo modal opened'),
    onClose: () => console.log('Promo modal closed'),
  })

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
      <DialogContent>
        <DialogTitle>Special Offer!</DialogTitle>
        <p>Check out our latest piano collection.</p>
        <button onClick={modal.close}>Close</button>
      </DialogContent>
    </Dialog>
  )
}

// Example 3: Modal with default open state
export function DefaultOpenModalExample() {
  const modal = useModal({
    defaultOpen: true,
    onClose: () => {
      console.log('Welcome modal dismissed')
    },
  })

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
      <DialogContent>
        <DialogTitle>Welcome!</DialogTitle>
        <p>Welcome to KAWAI Piano.</p>
        <button onClick={modal.close}>Get Started</button>
      </DialogContent>
    </Dialog>
  )
}

// Example 4: Toggle modal
export function ToggleModalExample() {
  const modal = useModal()

  return (
    <>
      <button onClick={modal.toggle}>
        {modal.isOpen ? 'Close' : 'Open'} Modal
      </button>

      <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
        <DialogContent>
          <DialogTitle>Toggle Modal</DialogTitle>
          <p>Click the button again to close.</p>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Example 5: Newsletter signup modal with auto-show
export function NewsletterModalExample() {
  const modal = useModal({
    autoShow: {
      delay: 10000, // Show after 10 seconds
      storageKey: 'newsletter-modal-shown',
    },
  })

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
      <DialogContent>
        <DialogTitle>Stay Updated</DialogTitle>
        <p>Subscribe to our newsletter for the latest piano news.</p>
        <form>
          <input type="email" placeholder="Your email" />
          <button type="submit">Subscribe</button>
        </form>
        <button onClick={modal.close}>Maybe later</button>
      </DialogContent>
    </Dialog>
  )
}
