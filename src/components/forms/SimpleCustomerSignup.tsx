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
  /** Optional localStorage key to prevent showing modal again after first view */
  storageKey?: string
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
  customTags = null,
  storageKey
}: SimpleCustomerSignupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { isOpen, close } = useModal({
    autoShow: {
      delay: showDelay,
      ...(storageKey && { storageKey })
    }
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
      {imageUrl ? (
        <>
          {/* Image - left column (60%), hidden on mobile */}
          <div className="hidden md:block relative h-full min-h-[500px]">
            <img
              src={imageUrl}
              alt="Piano promotion"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Form content - right column (40%) */}
          <div className="p-8 md:p-12 flex items-center justify-center bg-white">
            {isSubmitted ? (
              <SimpleCustomerSignupSuccess
                title={successTitle}
                message={successMessage}
                onClose={handleClose}
              />
            ) : (
              <div className="w-full max-w-md">
                <SimpleCustomerSignupForm
                  storefrontSlug={storefrontSlug}
                  title={title}
                  description={description}
                  submitButtonText={submitButtonText}
                  imageUrl={imageUrl}
                  customTags={customTags}
                  onSuccess={handleSuccess}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        // Centered layout (no image)
        isSubmitted ? (
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
        )
      )}
    </Modal>
  )
}
