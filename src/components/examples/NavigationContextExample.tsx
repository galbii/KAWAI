'use client'

/**
 * NavigationContextExample — dev debug component.
 * Shows current dealer context state (cookie-driven).
 */

import { useNavigationContext } from '@/contexts/NavigationContext'
import Link from 'next/link'

export function NavigationContextExample() {
  const { origin, isInitialized } = useNavigationContext()

  if (!isInitialized) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border">
        <p className="text-gray-600">Loading navigation context...</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Navigation Context Debug Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <strong className="text-gray-700">Base Path:</strong>
            <div className="font-mono text-blue-600 mt-1">{origin.basePath}</div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <strong className="text-gray-700">Is Dealer Location:</strong>
            <div className="font-mono mt-1">
              <span className={origin.isDealerLocation ? 'text-green-600' : 'text-gray-600'}>
                {origin.isDealerLocation ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {origin.dealerSlug && (
            <div className="bg-gray-50 p-3 rounded">
              <strong className="text-gray-700">Dealer Slug:</strong>
              <div className="font-mono text-purple-600 mt-1">{origin.dealerSlug}</div>
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded">
            <strong className="text-gray-700">Home URL:</strong>
            <div className="font-mono text-indigo-600 mt-1">{origin.basePath}</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Sample Links</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/pianos"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded border text-center transition-colors"
          >
            Pianos
          </Link>
          <Link
            href="/contact"
            className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded border text-center transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>

      <div className="text-xs text-gray-500 border-t pt-4">
        <p><strong>How it works:</strong></p>
        <p>• Middleware sets <code>kawai-dealer-slug</code> cookie when visiting /store/[slug]</p>
        <p>• Cookie is read server-side (HeaderDynamic, FooterDynamic) and client-side (NavigationContext)</p>
        <p>• Logo home link points back to the dealer storefront while cookie is active</p>
        <p>• Cookie is a session cookie — cleared when the browser closes or user visits /</p>
      </div>
    </div>
  )
}
