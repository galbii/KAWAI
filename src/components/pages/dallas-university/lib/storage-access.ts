'use client'

// Storage Access API utility for comprehensive third-party cookie access
export async function requestStorageAccess(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  try {
    // Check if Storage Access API is available
    if ('storage' in navigator && 'requestStorageAccess' in document) {
      // Check if we already have storage access
      const hasAccess = await document.hasStorageAccess()
      
      if (!hasAccess) {
        console.log('Requesting storage access for third-party cookies...')
        await document.requestStorageAccess()
        console.log('Storage access granted!')
        return true
      } else {
        console.log('Storage access already granted')
        return true
      }
    } else {
      // Storage Access API not available, try alternative methods
      console.log('Storage Access API not available, trying alternative methods...')
      
      // Try to enable partitioned cookies via document.cookie
      try {
        document.cookie = 'test_partitioned=1; SameSite=None; Secure; Partitioned'
        console.log('Partitioned cookie support enabled')
      } catch {
        console.log('Partitioned cookie not supported')
      }
      
      return false
    }
  } catch (error) {
    console.warn('Storage access request failed:', error)
    return false
  }
}

// Enhanced storage access for all third-party services
export async function initializeComprehensiveStorageAccess(): Promise<void> {
  if (typeof window === 'undefined') return
  
  // Set document.domain if on same domain (for SHSU partnership)
  try {
    if (window.location.hostname.includes('shsu') || window.location.hostname.includes('sam')) {
      // This helps with subdomain cookie sharing
      document.domain = window.location.hostname.split('.').slice(-2).join('.')
    }
  } catch (e) {
    console.log('Could not set document.domain:', e)
  }
  
  // Request storage access immediately if user has already interacted
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    await requestStorageAccess()
  }
  
  // Also request on next user interaction
  const requestOnInteraction = () => {
    requestStorageAccess().finally(() => {
      document.removeEventListener('click', requestOnInteraction)
      document.removeEventListener('touchstart', requestOnInteraction)
      document.removeEventListener('keydown', requestOnInteraction)
    })
  }
  
  // Add event listeners for various user interactions
  document.addEventListener('click', requestOnInteraction, { once: true })
  document.addEventListener('touchstart', requestOnInteraction, { once: true })
  document.addEventListener('keydown', requestOnInteraction, { once: true })
}

// Legacy function for backward compatibility
export function initializeStorageAccess(): void {
  initializeComprehensiveStorageAccess()
}