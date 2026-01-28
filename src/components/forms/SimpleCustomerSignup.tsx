'use client'

import { useState, useMemo, useEffect } from 'react'
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

  // Debug: Log component mount and props
  useEffect(() => {
    console.log('[SimpleCustomerSignup] Component mounted with props:', {
      storefrontSlug,
      showDelay,
      storageKey,
      title,
      description,
      hasImageUrl: !!imageUrl,
      customTagsCount: customTags?.length || 0
    })
  }, [])

  // Memoize autoShow config to prevent effect from re-running on every render
  const autoShowConfig = useMemo(() => {
    const config = {
      delay: showDelay,
      ...(storageKey && { storageKey })
    }
    console.log('[SimpleCustomerSignup] autoShowConfig created:', config)
    return config
  }, [showDelay, storageKey])

  const { isOpen, close } = useModal({
    autoShow: autoShowConfig
  })

  // Debug: Track isOpen state changes
  useEffect(() => {
    console.log('[SimpleCustomerSignup] isOpen changed to:', isOpen)
  }, [isOpen])

  const handleSuccess = () => {
    setIsSubmitted(true)
  }

  const handleClose = () => {
    console.log('[SimpleCustomerSignup] Closing modal')
    close()
    // Reset submitted state when modal closes
    if (isSubmitted) {
      setTimeout(() => setIsSubmitted(false), 300)
    }
  }

  // Let the Modal component handle visibility via isOpen prop
  // The Radix Dialog needs to be mounted in the DOM to properly handle state changes
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
