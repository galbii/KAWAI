'use client'

/**
 * Custom Payload Admin Icon Component
 * Displayed above the nav in the admin panel
 * Condensed version of the full logo
 */
export const Icon = () => {
  return (
    <div className="flex items-center justify-center w-full px-4 py-2">
      <img
        src="/images/instrumental-to-life-logo.svg"
        alt="KAWAI"
        className="w-full h-auto"
        style={{ maxWidth: '120px' }}
      />
    </div>
  )
}
