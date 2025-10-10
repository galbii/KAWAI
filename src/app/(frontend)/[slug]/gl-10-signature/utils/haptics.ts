/**
 * Haptic feedback utilities for mobile devices
 * Provides tactile feedback on interactions
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error'

/**
 * Trigger haptic feedback on supported devices
 * Falls back gracefully on unsupported devices
 */
export function triggerHaptic(pattern: HapticPattern = 'light'): void {
  // Check if vibration API is available
  if (!('vibrate' in navigator)) {
    return
  }

  try {
    const patterns: Record<HapticPattern, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      error: [20, 50, 20, 50, 20]
    }

    const vibrationPattern = patterns[pattern]
    navigator.vibrate(vibrationPattern)
  } catch (error) {
    // Silently fail if vibration is not supported or blocked
    console.debug('Haptic feedback not available:', error)
  }
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return 'vibrate' in navigator
}
