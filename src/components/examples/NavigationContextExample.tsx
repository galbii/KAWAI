'use client'

/**
 * NavigationContextExample Component
 * 
 * Demonstrates the navigation context system functionality and provides
 * a testing interface for developers to verify context-aware navigation.
 * 
 * This component shows:
 * - Current navigation origin detection
 * - Context-aware link generation
 * - Home URL resolution
 * - Origin preservation across navigation
 */

import { useNavigationContext, useContextAwareNavigation } from '@/contexts/NavigationContext'
import { ContextAwareLink } from '@/components/ui/ContextAwareLink'

export function NavigationContextExample() {
  const { origin, isInitialized } = useNavigationContext()
  const navigation = useContextAwareNavigation()

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
            <div className="font-mono text-indigo-600 mt-1">{navigation.getHomeUrl()}</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Context-Aware Links</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ContextAwareLink 
            href="/pianos" 
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded border text-center transition-colors"
          >
            Pianos (with context)
          </ContextAwareLink>
          
          <ContextAwareLink 
            href="/contact" 
            className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded border text-center transition-colors"
          >
            Contact (with context)
          </ContextAwareLink>
          
          <ContextAwareLink 
            href="/products" 
            preserveOrigin={false}
            className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded border text-center transition-colors"
          >
            Products (no context)
          </ContextAwareLink>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>• Blue and green links preserve navigation origin</p>
          <p>• Red link ignores origin (always goes to main site)</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Generated URLs</h4>
        <div className="space-y-2 text-sm">
          {[
            { path: '/pianos', preserve: true },
            { path: '/contact', preserve: true },
            { path: '/products', preserve: false },
            { path: '/about', preserve: true },
          ].map(({ path, preserve }) => (
            <div key={path} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="font-mono text-gray-600">{path}</span>
              <span className="font-mono text-blue-600">
                {navigation.getContextAwareUrl(path, preserve)}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${preserve ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {preserve ? 'Context' : 'No Context'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 border-t pt-4">
        <p><strong>How it works:</strong></p>
        <p>• When users visit dealer locations (e.g., /st-louis), the system tracks their origin</p>
        <p>• Navigation links can preserve this context using URL parameters</p>
        <p>• The logo and home links automatically return users to their original context</p>
        <p>• Session storage maintains context across page refreshes</p>
      </div>
    </div>
  )
}