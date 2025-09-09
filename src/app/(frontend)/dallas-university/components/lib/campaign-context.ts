/**
 * Campaign Context System for UTD Campaign Tracking
 * Provides campaign-specific context for PostHog event tracking
 */

export interface CampaignContext {
  campaign_id: string
  partner: string
  event_context: string
  page_variant: string
  target_audience: string
  campaign_type: 'university_partnership' | 'direct_marketing'
  university?: string
  program_focus?: string
}

export interface CampaignConfig {
  name: string
  context: CampaignContext
  routes: string[]
}

/**
 * Campaign configurations for different marketing initiatives
 */
export const CAMPAIGN_CONFIGS: Record<string, CampaignConfig> = {
  'university-dallas': {
    name: 'University of Texas at Dallas Partnership',
    context: {
      campaign_id: 'utd-partnership-2025',
      partner: 'UTD',
      event_context: 'university_partnership',
      page_variant: 'university-dallas',
      target_audience: 'students_faculty',
      campaign_type: 'university_partnership',
      university: 'University of Texas at Dallas',
      program_focus: 'music_education'
    },
    routes: ['/university-dallas', '/university-dallas/']
  },
  'main-landing': {
    name: 'Main KAWAI Landing Page',
    context: {
      campaign_id: 'kawai-main-2025',
      partner: 'kawai_direct',
      event_context: 'direct_marketing',
      page_variant: 'main-landing',
      target_audience: 'general_public',
      campaign_type: 'direct_marketing'
    },
    routes: ['/', '/home']
  }
}

/**
 * Get campaign context based on URL pathname
 */
export const getCampaignContext = (pathname: string): CampaignContext => {
  // Find matching campaign by checking routes
  for (const [, config] of Object.entries(CAMPAIGN_CONFIGS)) {
    const isMatch = config.routes.some(route => {
      if (route === '/') {
        return pathname === '/' || pathname === ''
      }
      return pathname.startsWith(route)
    })
    
    if (isMatch) {
      return config.context
    }
  }
  
  // Default to main landing campaign
  return CAMPAIGN_CONFIGS['main-landing'].context
}

/**
 * Get campaign configuration by key
 */
export const getCampaignConfig = (campaignKey: string): CampaignConfig | null => {
  return CAMPAIGN_CONFIGS[campaignKey] || null
}

/**
 * Get all available campaigns
 */
export const getAllCampaigns = (): CampaignConfig[] => {
  return Object.values(CAMPAIGN_CONFIGS)
}

/**
 * Enhanced source section format for campaign tracking
 * Combines campaign variant with section for better analytics
 */
export const formatSourceSection = (
  campaignContext: CampaignContext, 
  section: string
): string => {
  return `${campaignContext.page_variant}:${section}`
}

/**
 * Get UTM parameters equivalent from campaign context
 */
export const getCampaignUTMEquivalent = (context: CampaignContext) => {
  return {
    utm_source: context.partner.toLowerCase(),
    utm_medium: context.campaign_type === 'university_partnership' ? 'partnership' : 'direct',
    utm_campaign: context.campaign_id,
    utm_content: context.page_variant,
    utm_term: context.target_audience
  }
}

/**
 * Validate if pathname belongs to a specific campaign
 */
export const isUTDCampaign = (pathname: string): boolean => {
  const context = getCampaignContext(pathname)
  return context.partner === 'UTD'
}

export const isMainCampaign = (pathname: string): boolean => {
  const context = getCampaignContext(pathname)
  return context.partner === 'kawai_direct'
}