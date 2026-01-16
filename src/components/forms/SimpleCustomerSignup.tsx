'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { useModal } from '@/hooks'
import { SimpleCustomerSignupForm } from './SimpleCustomerSignupForm'
import { SimpleCustomerSignupSuccess } from './SimpleCustomerSignupSuccess'

/**
 * Simple Customer Signup Form Component - Modal Popup
 *
 * Displays as a modal popup when the page loads. Collects email, first name, and last name,
 * then creates/updates a Shopify customer tagged with the storefront location.
 *
 * @example
 * ```tsx
 * // In a storefront page
 * <SimpleCustomerSignup storefrontSlug="dallas" />
 * ```
 */

interface SimpleCustomerSignupProps {
  storefrontSlug: string
  title?: string
  description?: string
  submitButtonText?: string
  /** Delay in milliseconds before showing the modal (default: 1000ms) */
  showDelay?: number
  /** Success message title shown after form submission */
  successTitle?: string
  /** Success message description shown after form submission */
  successMessage?: string
  /** Optional image URL to display on the left side (desktop only) */
  imageUrl?: string | null
  /** Optional custom tags from Payload CMS to apply to customers */
  customTags?: Array<{ tag: string }> | null
}

export function SimpleCustomerSignup({
  storefrontSlug,
  title = 'Stay Connected',
  description = 'Sign up to receive updates about our piano collection and exclusive offers.',
  submitButtonText = 'Sign Up',
  showDelay = 1000,
  successTitle = 'Thank You for Signing Up!',
  successMessage = "We'll be in touch soon with updates about our piano collection.",
  imageUrl = null,
  customTags = null
}: SimpleCustomerSignupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { isOpen, close } = useModal({
    autoShow: { delay: showDelay }
  })

  const handleSuccess = () => {
    setIsSubmitted(true)
  }

  const handleClose = () => {
    close()
    // Reset submitted state when modal closes
    if (isSubmitted) {
      setTimeout(() => setIsSubmitted(false), 300)
    }
  }

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={imageUrl ? 'full' : 'md'}
      layout={imageUrl ? 'split' : 'centered'}
      closeOnOverlayClick={true}
      closeOnEscape={true}
      showCloseButton={true}
    >
      {isSubmitted ? (
        <SimpleCustomerSignupSuccess
          title={successTitle}
          message={successMessage}
          onClose={handleClose}
        />
      ) : (
        <SimpleCustomerSignupForm
          storefrontSlug={storefrontSlug}
          title={title}
          description={description}
          submitButtonText={submitButtonText}
          imageUrl={imageUrl}
          customTags={customTags}
          onSuccess={handleSuccess}
        />
      )}
    </Modal>
  )
}
