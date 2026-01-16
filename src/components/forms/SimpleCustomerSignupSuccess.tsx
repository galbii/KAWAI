import { XMarkIcon } from '@heroicons/react/24/outline'

/**
 * SimpleCustomerSignupSuccess Component
 *
 * Displays a success message after form submission in a modal overlay.
 * Extracted from SimpleCustomerSignup to separate success state rendering.
 *
 * @example
 * ```tsx
 * <SimpleCustomerSignupSuccess
 *   title="Thank You!"
 *   message="We'll be in touch soon."
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */

interface SimpleCustomerSignupSuccessProps {
  title?: string
  message?: string
  onClose: () => void
}

export function SimpleCustomerSignupSuccess({
  title = 'Thank You for Signing Up!',
  message = "We'll be in touch soon with updates about our piano collection.",
  onClose
}: SimpleCustomerSignupSuccessProps) {
  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-kawai-black/40 hover:text-kawai-black transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Success Content */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-kawai-black mb-2">
              {title}
            </h3>
            <p className="text-kawai-black/70 mb-6">
              {message}
            </p>
            <button
              onClick={onClose}
              className="bg-kawai-red hover:bg-kawai-black text-white px-8 py-3 rounded-md font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
