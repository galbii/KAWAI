'use client'

import { useState, useEffect } from 'react'
import { eventMonitor, debugPostHogStatus, testEventCapture } from './lib/posthog-validation'
import { campaignReporting } from './lib/campaign-performance'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface ValidationError {
  eventName: string
  errors: string[]
  timestamp: string
}

interface EventValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface DebugEvent {
  eventName: string
  properties: Record<string, unknown>
  timestamp: string
  validation: EventValidation
}

// Only show in development
export default function PostHogDebugDashboard() {
  const [events, setEvents] = useState<DebugEvent[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [campaignData, setCampaignData] = useState<Record<string, unknown> | null>(null)

  // Only render in development
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  useEffect(() => {
    if (isDevelopment && isOpen) {
      refreshEvents()
      const interval = setInterval(refreshEvents, 2000) // Refresh every 2 seconds
      return () => clearInterval(interval)
    }
  }, [isOpen, isDevelopment])
  
  if (!isDevelopment) {
    return null
  }

  const refreshEvents = () => {
    setEvents(eventMonitor.getEvents())
    setErrors(eventMonitor.getValidationErrors())
    setCampaignData(campaignReporting.getCampaignSummary())
  }

  const handleTestEvents = async () => {
    await testEventCapture()
    refreshEvents()
  }

  const handleDebugStatus = () => {
    debugPostHogStatus()
  }

  const handleClearEvents = () => {
    eventMonitor.clearEvents()
    refreshEvents()
  }


  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
        >
          📊 PostHog Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-purple-600 text-white p-3 flex justify-between items-center">
        <h3 className="font-bold text-sm">PostHog Debug Dashboard</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 text-lg"
        >
          ×
        </button>
      </div>
      
      <div className="p-3 overflow-y-auto max-h-80">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            onClick={handleDebugStatus}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
          >
            Debug Status
          </Button>
          <Button
            onClick={handleTestEvents}
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white text-xs"
          >
            Test Events
          </Button>
          <Button
            onClick={refreshEvents}
            size="sm"
            className="bg-gray-500 hover:bg-gray-600 text-white text-xs"
          >
            Refresh
          </Button>
          <Button
            onClick={handleClearEvents}
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white text-xs"
          >
            Clear Events
          </Button>
        </div>

        {/* Event Statistics */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Card className="p-2">
              <div className="font-semibold text-blue-600">Total Events</div>
              <div className="text-xl font-bold">{events.length}</div>
            </Card>
            <Card className="p-2">
              <div className="font-semibold text-red-600">Validation Errors</div>
              <div className="text-xl font-bold">{errors.length}</div>
            </Card>
          </div>
        </div>

        {/* Campaign Attribution */}
        {campaignData && (
          <div className="mb-4">
            <h4 className="font-semibold text-purple-600 text-sm mb-2">Campaign Attribution:</h4>
            <Card className="p-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-semibold text-gray-700">Campaign:</div>
                  <div className="truncate">{campaignData && typeof campaignData === 'object' && 'campaign' in campaignData ? String(campaignData.campaign || 'N/A') : 'N/A'}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700">Source:</div>
                  <div className="truncate">{campaignData && typeof campaignData === 'object' && 'source' in campaignData ? String(campaignData.source || 'N/A') : 'N/A'}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700">Medium:</div>
                  <div className="truncate">{campaignData && typeof campaignData === 'object' && 'medium' in campaignData ? String(campaignData.medium || 'N/A') : 'N/A'}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700">Type:</div>
                  <div className="truncate">{campaignData && typeof campaignData === 'object' && 'isNewVisitor' in campaignData ? (Boolean(campaignData.isNewVisitor) ? 'New' : 'Returning') : 'Unknown'}</div>
                </div>
              </div>
              {(() => {
                if (campaignData && typeof campaignData === 'object' && 'referrer' in campaignData && campaignData.referrer) {
                  return (
                    <div className="mt-2 text-xs">
                      <div className="font-semibold text-gray-700">Referrer:</div>
                      <div className="truncate text-gray-600">{String(campaignData.referrer || 'N/A')}</div>
                    </div>
                  )
                }
                return null
              })()}
            </Card>
          </div>
        )}

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-red-600 text-sm mb-2">Recent Validation Errors:</h4>
            <div className="space-y-1">
              {errors.slice(-3).map((error, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-xs">
                  <div className="font-semibold">{error.eventName}</div>
                  <div className="text-red-600">{error.errors.join(', ')}</div>
                  <div className="text-gray-500 text-xs">{new Date(error.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Events */}
        <div>
          <h4 className="font-semibold text-gray-700 text-sm mb-2">Recent Events ({events.length}):</h4>
          <div className="space-y-1">
            {events.slice(-5).reverse().map((event, index) => (
              <div
                key={index}
                className={`border rounded p-2 text-xs ${
                  event.validation.isValid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold truncate flex-1">{event.eventName}</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {/* Event Properties Preview */}
                <div className="text-gray-600 text-xs">
                  {Object.keys(event.properties).slice(0, 3).map(key => (
                    <span key={key} className="mr-2">
                      {key}: {JSON.stringify(event.properties[key]).slice(0, 20)}
                    </span>
                  ))}
                  {Object.keys(event.properties).length > 3 && '...'}
                </div>
                
                {/* Validation Status */}
                <div className="mt-1">
                  <span className={`inline-block px-1 py-0.5 rounded text-xs ${
                    event.validation.isValid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {event.validation.isValid ? 'Valid' : `${event.validation.errors.length} Error(s)`}
                  </span>
                  {event.validation.warnings.length > 0 && (
                    <span className="ml-1 inline-block px-1 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                      {event.validation.warnings.length} Warning(s)
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {events.length === 0 && (
              <div className="text-gray-500 text-sm italic">No events captured yet</div>
            )}
          </div>
        </div>

        {/* Console Instructions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div className="font-semibold mb-1">Console Commands:</div>
            <div className="font-mono bg-gray-100 p-1 rounded">
              window.postHogDebug.status()
            </div>
            <div className="font-mono bg-gray-100 p-1 rounded mt-1">
              window.postHogDebug.monitor.printSummary()
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}