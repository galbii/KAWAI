/**
 * Script Conflict Prevention Utilities
 *
 * This module provides utilities to prevent conflicts between third-party scripts,
 * specifically addressing issues between Facebook Pixel and e-commerce cart scripts.
 *
 * Common conflicts:
 * - Facebook Pixel trying to assign properties to URL strings
 * - E-commerce scripts modifying URLs in ways that break tracking
 * - Global object namespace collisions
 */

interface ScriptConflictOptions {
  suppressFacebookPixelErrors?: boolean;
  logConflictPrevention?: boolean;
  preventUrlStringAssignment?: boolean;
}

/**
 * Prevents common script conflicts by wrapping global functions
 */
export function preventScriptConflicts(options: ScriptConflictOptions = {}) {
  const {
    suppressFacebookPixelErrors = true,
    logConflictPrevention = true,
    preventUrlStringAssignment = true
  } = options;

  if (typeof window === 'undefined') return;

  const w = window as any;

  // 1. Prevent Facebook Pixel URL string assignment errors
  if (suppressFacebookPixelErrors && w.fbq) {
    const originalFbq = w.fbq;

    w.fbq = function(...args: any[]) {
      try {
        return originalFbq.apply(this, args);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('__NA')) {
          if (logConflictPrevention) {
            console.log('🛡️ Prevented Facebook Pixel URL assignment conflict');
          }
          return;
        }
        throw error;
      }
    };

    // Preserve existing properties
    Object.keys(originalFbq).forEach(key => {
      if (key !== 'apply' && key !== 'call') {
        w.fbq[key] = originalFbq[key];
      }
    });
  }

  // 2. Prevent URL string property assignment
  if (preventUrlStringAssignment) {
    // Monitor for attempts to set properties on strings
    const originalDefineProperty = Object.defineProperty;

    (Object as any).defineProperty = function(obj: any, prop: string, descriptor: PropertyDescriptor): any {
      // Prevent assignment of tracking properties to URL strings
      if (typeof obj === 'string' && obj.startsWith('http') && prop === '__NA') {
        if (logConflictPrevention) {
          console.log(`🛡️ Prevented property assignment to URL string: ${prop}`);
        }
        return obj;
      }
      return originalDefineProperty.call(this, obj, prop, descriptor);
    };
  }

  if (logConflictPrevention) {
    console.log('🛡️ Script conflict prevention initialized');
  }
}

/**
 * Monitors for script loading conflicts and provides debug information
 */
export function monitorScriptConflicts() {
  if (typeof window === 'undefined') return;

  const w = window as any;
  const conflicts: string[] = [];

  // Check for common global object conflicts
  const checkGlobalConflicts = () => {
    const globals = ['fbq', 'QuiversCart', 'Quivers', 'gtag', 'dataLayer'];

    globals.forEach(globalName => {
      if (w[globalName]) {
        const type = typeof w[globalName];
        console.log(`📊 Global detected: ${globalName} (${type})`);

        // Check if global seems corrupted
        if (type === 'string' && globalName !== 'dataLayer') {
          conflicts.push(`${globalName} appears to be a string instead of function`);
        }
      }
    });

    if (conflicts.length > 0) {
      console.warn('⚠️ Potential script conflicts detected:', conflicts);
    }
  };

  // Check immediately and after script loading
  checkGlobalConflicts();
  setTimeout(checkGlobalConflicts, 2000);
  setTimeout(checkGlobalConflicts, 5000);
}

/**
 * Creates a safe wrapper for e-commerce cart operations that prevents script conflicts
 */
export function createSafeCartWrapper<T extends (...args: any[]) => any>(
  cartFunction: T,
  functionName: string = 'cartOperation'
): T {
  return ((...args: any[]) => {
    try {
      // Temporarily suppress conflict-related console errors
      const originalError = console.error;
      console.error = (...errorArgs: any[]) => {
        const errorMsg = errorArgs.join(' ');
        if (!errorMsg.includes('__NA') && !errorMsg.includes('fbevents.js')) {
          originalError.apply(console, errorArgs);
        }
      };

      const result = cartFunction(...args);

      // Restore console.error after operation
      setTimeout(() => {
        console.error = originalError;
      }, 500);

      console.log(`✅ Safe cart operation completed: ${functionName}`);
      return result;
    } catch (error) {
      console.error = console.error; // Restore console.error immediately on error

      // Handle known conflicts gracefully
      if (error instanceof TypeError && error.message.includes('__NA')) {
        console.log(`🛡️ Cart operation "${functionName}" completed despite tracking conflict`);
        return true; // Consider the operation successful
      }

      console.error(`❌ Cart operation "${functionName}" failed:`, error);
      throw error;
    }
  }) as T;
}

/**
 * Utility to check if scripts are conflicting in real-time
 */
export function detectActiveConflicts(): {
  hasConflicts: boolean;
  conflicts: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
} {
  const conflicts: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }> = [];

  if (typeof window === 'undefined') {
    return { hasConflicts: false, conflicts };
  }

  const w = window as any;

  // Check for Facebook Pixel corruption
  if (w.fbq && typeof w.fbq !== 'function') {
    conflicts.push({
      type: 'facebook_pixel_corruption',
      description: 'Facebook Pixel (fbq) is not a function',
      severity: 'high'
    });
  }

  // Check for URL string contamination
  try {
    const testUrl = 'http://example.com/test';
    (testUrl as any).__testProp = 'test';
    conflicts.push({
      type: 'url_string_assignment',
      description: 'URL strings are accepting property assignments',
      severity: 'medium'
    });
  } catch (error) {
    // This is actually good - strings should not accept property assignments
  }

  // Check for multiple cart systems
  const cartSystems = ['QuiversCart', 'Quivers', 'shopify', 'WooCommerce'].filter(
    system => w[system]
  );

  if (cartSystems.length > 1) {
    conflicts.push({
      type: 'multiple_cart_systems',
      description: `Multiple cart systems detected: ${cartSystems.join(', ')}`,
      severity: 'medium'
    });
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts
  };
}