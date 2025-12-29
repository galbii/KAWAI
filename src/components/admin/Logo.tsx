'use client'

/**
 * Custom Payload Admin Logo Component
 * Displayed on the login/signup view
 */
export const Logo = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <img
        src="/images/instrumental-to-life-logo.svg"
        alt="KAWAI - Instrumental to Life"
        className="w-full max-w-md h-auto"
        style={{ maxWidth: '400px' }}
      />
    </div>
  )
}
