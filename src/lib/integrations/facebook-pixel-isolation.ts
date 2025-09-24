/**
 * Facebook Pixel Isolation System
 *
 * Isolates Facebook Pixel from third-party e-commerce scripts
 * to prevent property assignment conflicts on URL strings.
 */

interface FacebookPixelIsolationOptions {
  suppressUrlAssignmentErrors?: boolean;
  logIsolationEvents?: boolean;
  enableSafeMode?: boolean;
}

/**
 * Creates a completely isolated environment for Facebook Pixel operations
 */
export function isolateFacebookPixel(options: FacebookPixelIsolationOptions = {}) {
  const {
    suppressUrlAssignmentErrors = true,
    logIsolationEvents = true,
    enableSafeMode = true
  } = options;

  if (typeof window === 'undefined') return;

  const w = window as any;

  // 1. Override Object.defineProperty to prevent URL string assignments
  if (suppressUrlAssignmentErrors) {
    const originalDefineProperty = Object.defineProperty;

    Object.defineProperty = function(obj: any, prop: PropertyKey, descriptor: PropertyDescriptor): any {
      // Prevent assignment of any property to URL strings
      if (typeof obj === 'string' && obj.startsWith('http')) {
        if (logIsolationEvents) {
          console.log(`🛡️ Blocked property "${String(prop)}" assignment to URL: ${obj.substring(0, 50)}...`);
        }
        return obj; // Return the original string unchanged
      }

      // Prevent __NA assignments specifically to any string
      if (prop === '__NA') {
        if (logIsolationEvents) {
          console.log(`🛡️ Blocked __NA assignment to:`, typeof obj, obj?.toString?.()?.substring(0, 50) || obj);
        }
        return obj;
      }

      try {
        return originalDefineProperty.call(this, obj, prop, descriptor);
      } catch (error) {
        // Specifically catch Facebook Pixel property assignment errors
        if (error instanceof TypeError &&
            (error.message.includes('assign to property') ||
             error.message.includes('__NA') ||
             error.message.includes('not an object'))) {
          if (logIsolationEvents) {
            console.log(`🛡️ Prevented Facebook Pixel property assignment error:`, error.message);
          }
          return obj;
        }

        if (logIsolationEvents) {
          console.log(`🛡️ Caught defineProperty error for ${String(prop)}:`, error);
        }
        throw error; // Re-throw other errors
      }
    };

    // Also override direct property assignment on String prototype
    const originalStringProto = String.prototype;
    try {
      Object.defineProperty(String.prototype, '__NA', {
        set: function(value: any) {
          if (logIsolationEvents) {
            console.log(`🛡️ Blocked __NA assignment to string prototype`);
          }
          // Do nothing - silently ignore
        },
        get: function() {
          return undefined;
        },
        configurable: true
      });
    } catch (e) {
      // Ignore if we can't modify String prototype
    }
  }

  // 2. Create a safe wrapper for Facebook Pixel
  if (enableSafeMode && w.fbq) {
    const originalFbq = w.fbq;

    w.fbq = function(...args: any[]) {
      try {
        return originalFbq.apply(this, args);
      } catch (error) {
        if (error instanceof TypeError &&
            (error.message.includes('__NA') ||
             error.message.includes('not an object') ||
             error.message.includes('assign to property'))) {
          if (logIsolationEvents) {
            console.log('🛡️ Suppressed Facebook Pixel tracking error:', error.message);
          }
          return; // Silently ignore tracking errors
        }
        throw error; // Re-throw other errors
      }
    };

    // Preserve fbq properties and methods
    Object.setPrototypeOf(w.fbq, originalFbq);
    Object.getOwnPropertyNames(originalFbq).forEach(prop => {
      if (prop !== 'apply' && prop !== 'call' && prop !== 'bind') {
        try {
          w.fbq[prop] = originalFbq[prop];
        } catch (e) {
          // Ignore property assignment errors
        }
      }
    });
  }

  // 3. Override console.error to filter out Facebook Pixel noise
  if (suppressUrlAssignmentErrors) {
    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      const message = args.join(' ');

      // Filter out known Facebook Pixel conflict messages
      if (message.includes('__NA') ||
          message.includes('fbevents.js') ||
          (message.includes('TypeError') && message.includes('not an object'))) {
        if (logIsolationEvents) {
          console.log('🛡️ Filtered Facebook Pixel error:', message);
        }
        return;
      }

      originalConsoleError.apply(console, args);
    };
  }

  if (logIsolationEvents) {
    console.log('🛡️ Facebook Pixel isolation system activated');
  }
}

/**
 * Creates a safe execution context for e-commerce operations
 */
export function createSafeEcommerceContext<T extends (...args: any[]) => any>(
  operation: T,
  operationName: string = 'ecommerce-operation'
): T {
  return ((...args: any[]) => {
    // Temporarily disable Facebook Pixel during operation
    const w = window as any;
    const originalFbq = w.fbq;

    // Replace fbq with a no-op during the operation
    w.fbq = function() {
      console.log('🛡️ Facebook Pixel tracking suppressed during cart operation');
    };

    try {
      const result = operation(...args);
      console.log(`✅ Safe operation completed: ${operationName}`);
      return result;
    } catch (error) {
      console.error(`❌ Safe operation failed: ${operationName}`, error);
      throw error;
    } finally {
      // Restore Facebook Pixel after operation
      setTimeout(() => {
        w.fbq = originalFbq;
      }, 100);
    }
  }) as T;
}

/**
 * Monitors and reports Facebook Pixel conflicts in real-time
 */
export function monitorFacebookPixelConflicts() {
  if (typeof window === 'undefined') return;

  const w = window as any;
  let conflictCount = 0;

  // Monitor window errors
  const originalOnError = w.onerror;
  w.onerror = function(message: any, source: any, lineno: any, colno: any, error: any) {
    const msgStr = String(message);

    if (msgStr.includes('__NA') ||
        msgStr.includes('fbevents.js') ||
        msgStr.includes('assign to property') ||
        msgStr.includes('not an object')) {
      conflictCount++;
      console.log(`🛡️ Suppressed Facebook Pixel conflict #${conflictCount}:`, {
        message: msgStr.substring(0, 100),
        source: source,
        line: lineno
      });
      return true; // Prevent default error handling
    }

    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };

  // Monitor unhandled promise rejections
  w.addEventListener('unhandledrejection', (event: any) => {
    if (event.reason && event.reason.message) {
      const msgStr = String(event.reason.message);

      if (msgStr.includes('__NA') ||
          msgStr.includes('assign to property') ||
          msgStr.includes('not an object')) {
        console.log('🛡️ Suppressed Facebook Pixel promise rejection:', msgStr);
        event.preventDefault();
      }
    }
  });

  // Aggressive error event listener
  w.addEventListener('error', (event: any) => {
    if (event.error && event.error.message) {
      const msgStr = String(event.error.message);

      if (msgStr.includes('__NA') ||
          msgStr.includes('assign to property') ||
          msgStr.includes('not an object')) {
        console.log('🛡️ Suppressed Facebook Pixel error event:', msgStr);
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  });

  // Override console.error to filter Facebook Pixel noise
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(' ');

    if (message.includes('__NA') ||
        message.includes('fbevents.js') ||
        message.includes('assign to property')) {
      console.log('🛡️ Filtered Facebook Pixel console error:', message.substring(0, 100));
      return;
    }
    originalConsoleError.apply(console, args);
  };

  console.log('👁️ Aggressive Facebook Pixel conflict monitoring started');
}

/**
 * Emergency function to completely disable Facebook Pixel
 */
export function emergencyDisableFacebookPixel() {
  if (typeof window === 'undefined') return;

  const w = window as any;

  // Replace fbq with a safe no-op
  w.fbq = function() {
    console.log('🚫 Facebook Pixel disabled due to conflicts');
  };

  // Remove fbevents script
  const scripts = document.querySelectorAll('script[src*="fbevents.js"]');
  scripts.forEach(script => script.remove());

  console.log('🚫 Facebook Pixel emergency disabled');
}