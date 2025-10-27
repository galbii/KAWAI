'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
// Consent manager import removed
import { 
  Shield, 
  Eye, 
  Download, 
  Trash2, 
  Settings, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface PrivacyControlsProps {
  className?: string
  variant?: 'inline' | 'modal' | 'banner'
}

export function PrivacyControls({ className = '', variant = 'inline' }: PrivacyControlsProps) {
  // Consent management removed
  const consentStatus = 'unknown' as 'accepted' | 'declined' | 'unknown' | 'pending'
  const hasConsent = false
  const acceptConsent = () => {}
  const declineConsent = () => {}
  const exportUserData = () => {}
  const deleteUserData = () => {}

  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleExportData = async () => {
    if (!hasConsent) {
      alert('Data export requires consent to be granted.')
      return
    }

    setIsExporting(true)
    try {
      const userData = await exportUserData()
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kawai-privacy-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteData = async () => {
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteUserData()
      alert('Your data has been successfully deleted.')
      // Reload the page to reset the application state
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete data:', error)
      alert('Failed to delete data. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (variant === 'banner' && consentStatus !== 'pending') {
    return null // Don't show banner if consent is already given/declined
  }

  const getStatusIcon = () => {
    switch (consentStatus) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusText = () => {
    switch (consentStatus) {
      case 'accepted':
        return 'Analytics consent granted'
      case 'declined':
        return 'Analytics consent declined'
      default:
        return 'Analytics consent pending'
    }
  }

  const getStatusDescription = () => {
    switch (consentStatus) {
      case 'accepted':
        return 'We are collecting analytics data to improve your piano shopping experience. This includes page views, consultation bookings, and piano preferences.'
      case 'declined':
        return 'Analytics data collection is disabled. We only collect essential information needed for piano consultations.'
      default:
        return 'We would like to collect analytics data to improve your experience. You can change this at any time.'
    }
  }

  if (variant === 'banner') {
    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-kawai-gold-200 shadow-lg z-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Shield className="w-6 h-6 text-kawai-gold-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Privacy & Analytics Consent
                </p>
                <p className="text-sm text-gray-600">
                  We use analytics to improve your piano shopping experience. 
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="ml-1 text-kawai-gold-600 hover:text-kawai-gold-700 underline"
                  >
                    Learn more
                  </button>
                </p>
                {showDetails && (
                  <div className="mt-3 p-3 bg-kawai-gold-50 rounded-lg text-sm text-gray-700">
                    <p className="mb-2">We collect:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Page views and navigation patterns</li>
                      <li>Piano model interactions and preferences</li>
                      <li>Consultation booking attempts and completions</li>
                      <li>Technical data for performance improvement</li>
                    </ul>
                    <p className="mt-2 text-xs">
                      Your email and personal details are only collected when you book a consultation 
                      and are handled separately from analytics data.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={declineConsent}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Decline
              </Button>
              <Button
                onClick={acceptConsent}
                size="sm"
                className="bg-kawai-gold-600 hover:bg-kawai-gold-700 text-white"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-kawai-gold-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Privacy & Data Controls
          </h3>
        </div>

        {/* Current Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon()}
            <span className="font-medium text-gray-900">
              {getStatusText()}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {getStatusDescription()}
          </p>
        </div>

        {/* Consent Controls */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Analytics Consent
          </h4>
          
          <div className="flex gap-2">
            <Button
              onClick={acceptConsent}
              variant={hasConsent ? "default" : "outline"}
              size="sm"
              className={hasConsent ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Allow Analytics
            </Button>
            <Button
              onClick={declineConsent}
              variant={!hasConsent && consentStatus === 'declined' ? "destructive" : "outline"}
              size="sm"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Decline Analytics
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Your Data Rights (GDPR)
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              onClick={handleExportData}
              disabled={!hasConsent || isExporting}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export My Data'}
            </Button>
            
            <Button
              onClick={handleDeleteData}
              disabled={isDeleting}
              variant="outline"
              size="sm"
              className="justify-start text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete My Data'}
            </Button>
          </div>
        </div>

        {/* Information */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                What we track when you consent:
              </p>
              <ul className="text-blue-800 space-y-1 text-xs">
                <li>• Page views and time spent on site</li>
                <li>• Piano models you view and interact with</li>
                <li>• Consultation booking funnel progression</li>
                <li>• General technical performance data</li>
              </ul>
              <p className="text-blue-700 mt-2 text-xs">
                <strong>We never track:</strong> Passwords, payment info, or sensitive personal data.
                Consultation details are handled separately with your explicit consent.
              </p>
            </div>
          </div>
        </div>

        {/* Session Recording Notice */}
        {hasConsent && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900 mb-1">
                  Session Recording Active (10% sample)
                </p>
                <p className="text-yellow-800 text-xs">
                  We may record a small sample of sessions to improve user experience. 
                  All sensitive inputs are masked, and recordings are automatically deleted after 90 days.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}