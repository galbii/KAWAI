/**
 * Data Retention Configuration for KAWAI Piano Landing Page
 * 
 * This file centralizes all data retention policies for compliance
 * with GDPR, CCPA, and other privacy regulations.
 */

export const DATA_RETENTION_CONFIG = {
  // PostHog Analytics Data
  analytics: {
    // Event data retention (days)
    events: {
      pageviews: 365,           // 1 year - for seasonal analysis
      piano_interactions: 730,  // 2 years - for product insights
      consultation_bookings: 1095, // 3 years - for business analysis
      error_tracking: 90,       // 3 months - for debugging
      general_events: 365       // 1 year - default retention
    },
    
    // Session recording retention
    session_recordings: {
      retention_days: 90,       // 3 months maximum
      sample_rate: 0.1,         // 10% of consented users
      auto_delete: true,        // Automatic deletion after retention period
      mask_sensitive_data: true // Always mask PII
    },
    
    // User profiles and properties
    user_profiles: {
      identified_users: 1095,   // 3 years - for returning customers
      anonymous_users: 365,     // 1 year - for behavior analysis
      consultation_leads: 2555, // 7 years - for business records
      deleted_users: 0          // Immediate deletion upon request
    }
  },

  // Heatmap Data
  heatmaps: {
    retention_days: 180,        // 6 months - sufficient for UX insights
    aggregation_level: 'page',  // Aggregate by page, not individual users
    sample_rate: 0.15,          // 15% of consented users
    auto_archive: true,         // Archive old data instead of deleting
    privacy_mode: true          // Enhanced privacy for heatmap collection
  },

  // Feature Flag Data
  feature_flags: {
    flag_evaluations: 30,       // 1 month - for debugging
    flag_history: 365,          // 1 year - for A/B test analysis
    user_flag_overrides: 90     // 3 months - for personalization
  },

  // Error Tracking and Debugging
  error_tracking: {
    application_errors: 90,     // 3 months
    performance_metrics: 30,    // 1 month
    debug_logs: 7,              // 1 week
    stack_traces: 90            // 3 months (anonymized)
  },

  // Consent and Privacy Records
  privacy: {
    consent_records: 2555,      // 7 years - legal requirement
    data_requests: 2555,        // 7 years - GDPR compliance
    deletion_logs: 2555,        // 7 years - audit trail
    privacy_policy_acceptance: 2555 // 7 years - legal compliance
  },

  // Campaign and Attribution Data
  marketing: {
    utm_parameters: 365,        // 1 year - for campaign analysis
    referrer_data: 180,         // 6 months - for traffic analysis
    campaign_attribution: 730,  // 2 years - for ROI analysis
    a_b_test_results: 1095      // 3 years - for long-term insights
  }
} as const

/**
 * Data Classification for GDPR Compliance
 */
export const DATA_CLASSIFICATION = {
  // Personal Data (requires consent, subject to deletion requests)
  personal_data: [
    'email',
    'name', 
    'phone',
    'ip_address',
    'user_agent',
    'device_id'
  ],

  // Behavioral Data (requires consent, can be anonymized)
  behavioral_data: [
    'pageviews',
    'piano_preferences',
    'session_recordings',
    'heatmap_interactions',
    'consultation_bookings'
  ],

  // Technical Data (legitimate interest, minimal retention)
  technical_data: [
    'performance_metrics',
    'error_logs',
    'feature_flag_evaluations',
    'system_diagnostics'
  ],

  // Legal Basis Data (must be retained for compliance)
  compliance_data: [
    'consent_records',
    'privacy_requests',
    'deletion_logs',
    'audit_trails'
  ]
} as const

/**
 * Automated Cleanup Configuration
 */
export const CLEANUP_CONFIG = {
  // How often to run cleanup jobs
  schedule: {
    daily_cleanup: true,        // Clean up expired session data
    weekly_cleanup: true,       // Archive old events
    monthly_cleanup: true,      // Full data audit and cleanup
    yearly_audit: true          // Complete compliance audit
  },

  // Grace periods before actual deletion
  grace_periods: {
    soft_delete_days: 30,       // Soft delete period
    hard_delete_days: 7,        // Final deletion after soft delete
    user_request_days: 3,       // Time to fulfill deletion requests
    data_export_days: 14        // Time to fulfill export requests
  },

  // Notifications for cleanup actions
  notifications: {
    before_deletion: true,      // Notify before automated deletion
    after_cleanup: true,        // Confirm cleanup completion
    compliance_reports: true,   // Monthly compliance reports
    retention_warnings: true    // Warn when approaching limits
  }
} as const

/**
 * PostHog-specific Retention Settings
 * These are applied in the PostHog configuration
 */
export const POSTHOG_RETENTION_SETTINGS = {
  // Session recording configuration
  session_recording: {
    sample_rate: DATA_RETENTION_CONFIG.analytics.session_recordings.sample_rate,
    mask_all_inputs: true,
    mask_text_selector: '.ph-mask, .sensitive',
    recording_config: {
      // Automatically stop recording after 30 minutes
      max_session_duration: 30 * 60 * 1000, // 30 minutes in ms
      // Reduce capture frequency for privacy
      capture_performance: false,
      // Don't record cross-origin iframes
      record_cross_origin_iframes: false
    }
  },

  // Event retention policies
  event_properties: {
    // Automatically remove PII after processing
    sanitize_properties: true,
    // Maximum properties per event
    max_properties: 50,
    // Truncate long text values
    max_property_length: 1000
  },

  // Heatmap specific settings
  heatmaps: {
    sample_rate: DATA_RETENTION_CONFIG.heatmaps.sample_rate,
    privacy_mode: true,
    // Only capture click and scroll events for heatmaps
    tracked_interactions: ['click', 'scroll'],
    // Exclude sensitive elements
    exclude_selectors: ['.sensitive', '[data-private]', 'input[type="password"]']
  }
} as const

/**
 * Helper function to get retention period for a data type
 */
export function getRetentionDays(dataType: string): number {
  // Flatten the config object to search for the data type
  const flattenConfig = (obj: Record<string, unknown>, prefix = ''): Record<string, number> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return { ...acc, ...flattenConfig(value as Record<string, unknown>, newKey) }
      } else if (typeof value === 'number') {
        return { ...acc, [newKey]: value, [key]: value }
      }
      
      return acc
    }, {} as Record<string, number>)
  }

  const flattened = flattenConfig(DATA_RETENTION_CONFIG)
  return flattened[dataType] || flattened[`analytics.events.${dataType}`] || 365 // Default to 1 year
}

/**
 * Check if data type requires user consent
 */
export function requiresConsent(dataType: string): boolean {
  return [
    ...DATA_CLASSIFICATION.personal_data,
    ...DATA_CLASSIFICATION.behavioral_data
  ].some(type => dataType.includes(type) || type.includes(dataType))
}

/**
 * Get appropriate legal basis for data processing
 */
export function getLegalBasis(dataType: string): 'consent' | 'legitimate_interest' | 'legal_obligation' {
  if (DATA_CLASSIFICATION.compliance_data.some(type => dataType.includes(type))) {
    return 'legal_obligation'
  }
  
  if (requiresConsent(dataType)) {
    return 'consent'
  }
  
  return 'legitimate_interest'
}