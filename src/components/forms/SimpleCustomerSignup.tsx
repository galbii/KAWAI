'use client'

import { useState, useMemo } from 'react'
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
  storageKey,
}: SimpleCustomerSignupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Memoize autoShow config to prevent effect from re-running on every render
  const autoShowConfig = useMemo(
    () => ({
      delay: showDelay,
      ...(storageKey && { storageKey }),
    }),
    [showDelay, storageKey],
  )

  const { isOpen, close } = useModal({ autoShow: autoShowConfig })

  const handleSuccess = () => setIsSubmitted(true)

  const handleClose = () => {
    close()
    // Reset submitted state after the close animation settles
    if (isSubmitted) {
      setTimeout(() => setIsSubmitted(false), 300)
    }
  }

  const content = isSubmitted ? (
    <SimpleCustomerSignupSuccess title={successTitle} message={successMessage} onClose={handleClose} />
  ) : (
    <SimpleCustomerSignupForm
      storefrontSlug={storefrontSlug}
      title={title}
      description={description}
      submitButtonText={submitButtonText}
      imageUrl={imageUrl}
      customTags={customTags}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={imageUrl ? 'full' : 'md'}
      layout={imageUrl ? 'split' : 'centered'}
      className={
        imageUrl
          ? 'p-0 overflow-hidden rounded-2xl max-w-[calc(100vw-2rem)] md:max-w-5xl md:grid-cols-2'
          : 'p-0 overflow-hidden rounded-2xl sm:rounded-2xl max-w-[calc(100vw-2rem)] sm:max-w-md'
      }
      closeOnOverlayClick={true}
      closeOnEscape={true}
      showCloseButton={false}
    >
      {imageUrl ? (
        <>
          {/* Image — left column, hidden on mobile. Blurred backdrop fills the
              panel; the full graphic sits sharp on top so no text is cropped. */}
          <div className="hidden md:block relative self-stretch min-h-[480px] overflow-hidden bg-kawai-black">
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
            />
            <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-contain" />
          </div>
          {/* Form / success — right column */}
          {content}
        </>
      ) : (
        content
      )}
    </Modal>
  )
}
