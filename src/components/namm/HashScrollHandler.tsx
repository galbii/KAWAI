'use client'

import { useEffect } from 'react'

/**
 * Hash Scroll Handler for NAMM 2026 Page
 *
 * Handles smooth scrolling to hash anchors when navigating from other pages.
 * This component runs on the client side to detect URL hash and scroll after page load.
 */
export function HashScrollHandler() {
  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash

    if (hash) {
      // Remove the # symbol
      const targetId = hash.substring(1)

      // Small delay to ensure the page is fully rendered
      setTimeout(() => {
        const element = document.getElementById(targetId)

        if (element) {
          const headerOffset = 80 // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }, [])

  // This component doesn't render anything
  return null
}
