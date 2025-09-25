/**
 * Quivers Hovercart Integration Utilities
 * Provides a unified interface for interacting with the Quivers shopping cart system
 */

import { createSafeEcommerceContext } from './facebook-pixel-isolation';

export interface QuiversCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  sku?: string;
}

export interface QuiversCartAPI {
  addToCart: (item: QuiversCartItem) => void;
  removeFromCart: (itemId: string) => void;
  getCart: () => QuiversCartItem[];
  clearCart: () => void;
  showCart: () => void;
  hideCart: () => void;
}

/**
 * Checks if Quivers cart is available in the global scope
 */
export function isQuiversAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  const w = window as any;
  return !!(w.QuiversCart || w.Quivers || w.quivers);
}

/**
 * Gets the Quivers cart API object if available
 */
export function getQuiversAPI(): QuiversCartAPI | null {
  if (!isQuiversAvailable()) return null;

  const w = window as any;
  return w.QuiversCart || w.Quivers || w.quivers || null;
}

/**
 * Adds an item to the Quivers cart with fallback behavior
 */
export function addToQuiversCart(
  item: QuiversCartItem,
  fallbackUrl?: string
): boolean {
  const api = getQuiversAPI();

  if (api && typeof api.addToCart === 'function') {
    // Create a safe isolated context for the cart operation
    const safeAddToCart = createSafeEcommerceContext(
      () => {
        console.log('🛒 Adding item to Quivers cart (isolated):', item);
        api.addToCart(item);
        return true;
      },
      'addToQuiversCart'
    );

    try {
      const result = safeAddToCart();
      if (result) {
        console.log('✅ Item successfully added to Quivers cart');
        return true;
      }
    } catch (error) {
      console.error('❌ Cart operation failed:', error);

      // Try fallback if cart operation fails
      if (fallbackUrl && typeof window !== 'undefined') {
        console.log('🔄 Using fallback URL due to cart error');
        window.location.href = fallbackUrl;
        return true;
      }
    }
  }

  // Fallback behavior
  console.log('🔄 Quivers cart not available, using fallback');
  if (fallbackUrl && typeof window !== 'undefined') {
    window.location.href = fallbackUrl;
  }

  return false;
}

/**
 * Shows the Quivers cart overlay if available
 */
export function showQuiversCart(): boolean {
  const api = getQuiversAPI();

  if (api && typeof api.showCart === 'function') {
    const safeShowCart = createSafeEcommerceContext(
      () => {
        console.log('🛒 Showing Quivers cart overlay (isolated)');
        api.showCart();
        return true;
      },
      'showQuiversCart'
    );

    try {
      return safeShowCart();
    } catch (error) {
      console.error('❌ Error showing Quivers cart:', error);
    }
  }

  return false;
}

/**
 * Waits for Quivers to load and executes a callback
 */
export function onQuiversReady(callback: (api: QuiversCartAPI) => void, timeout = 10000): void {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();

  const checkQuivers = () => {
    const api = getQuiversAPI();

    if (api) {
      callback(api);
      return;
    }

    if (Date.now() - startTime > timeout) {
      console.warn('Quivers cart did not load within timeout period');
      return;
    }

    setTimeout(checkQuivers, 100);
  };

  checkQuivers();
}

/**
 * Creates a Kawai piano product object for Quivers cart
 */
export function createKawaiPianoCartItem(
  model: string,
  price: number,
  options?: Partial<QuiversCartItem>
): QuiversCartItem {
  const baseItem: QuiversCartItem = {
    id: `kawai-${model.toLowerCase().replace(/\s+/g, '-')}`,
    name: `Kawai ${model} Digital Piano`,
    price,
    quantity: 1,
    // Use a generic placeholder or omit image to avoid broken requests
    image: '/images/kawai-logo.png', // Use a placeholder image
    description: `Premium ${model} digital piano from Kawai`,
    sku: `KAWAI-${model.toUpperCase()}`,
    ...options
  };

  return baseItem;
}

// Export commonly used piano models for easy reference
export const KAWAI_PIANO_MODELS = {
  ES60: createKawaiPianoCartItem('ES60', 1799),
  CA901: createKawaiPianoCartItem('CA901', 4999),
  // Add more models as needed
} as const;