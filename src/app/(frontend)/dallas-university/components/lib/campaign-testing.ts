/**
 * Campaign Tracking Testing Utilities
 * Provides comprehensive testing tools for UTD campaign tracking
 */

import { getCampaignContext, formatSourceSection, getCampaignUTMEquivalent, CAMPAIGN_CONFIGS, type CampaignContext } from './campaign-context'
import { captureWithValidation, validateEventProperties } from './posthog-validation'
import { POSTHOG_CONFIG } from './posthog-config'

export interface CampaignTestResult {
  testName: string
  success: boolean
  errors: string[]
  warnings: string[]
  campaignContext?: CampaignContext
  eventData?: Record<string, unknown>
}

export class CampaignTrackingTester {
  private results: CampaignTestResult[] = []

  async runAllTests(): Promise<CampaignTestResult[]> {
    this.results = []
    
    console.group('🧪 Campaign Tracking Test Suite')
    
    // Test 1: Campaign Context Resolution
    await this.testCampaignContextResolution()
    
    // Test 2: UTD Campaign Event Tracking
    await this.testUTDCampaignEvents()
    
    // Test 3: Main Campaign Event Tracking
    await this.testMainCampaignEvents()
    
    // Test 4: Source Section Enhancement
    await this.testSourceSectionEnhancement()
    
    // Test 5: UTM Data Generation
    await this.testUTMDataGeneration()
    
    // Test 6: Event Validation with Campaign Properties
    await this.testEventValidation()
    
    console.log(`\n📊 Test Results: ${this.getPassedCount()}/${this.results.length} passed`)
    if (this.getFailedCount() > 0) {
      console.warn(`⚠️  ${this.getFailedCount()} tests failed`)
      this.printFailures()
    } else {
      console.log('✅ All campaign tracking tests passed!')
    }
    
    console.groupEnd()
    
    return this.results
  }

  private async testCampaignContextResolution(): Promise<void> {
    const testPaths = [
      { path: '/university-dallas/', expected: 'UTD' },
      { path: '/university-dallas/components', expected: 'UTD' },
      { path: '/', expected: 'kawai_direct' },
      { path: '/home', expected: 'kawai_direct' },
      { path: '/unknown-path', expected: 'kawai_direct' }
    ]

    let allPassed = true
    const errors: string[] = []

    for (const testPath of testPaths) {
      try {
        const context = getCampaignContext(testPath.path)
        
        if (context.partner !== testPath.expected) {
          allPassed = false
          errors.push(`Path '${testPath.path}' resolved to partner '${context.partner}', expected '${testPath.expected}'`)
        }
      } catch (error) {
        allPassed = false
        errors.push(`Error testing path '${testPath.path}': ${error}`)
      }
    }

    this.results.push({
      testName: 'Campaign Context Resolution',
      success: allPassed,
      errors,
      warnings: []
    })

    console.log(`${allPassed ? '✅' : '❌'} Campaign Context Resolution`)
  }

  private async testUTDCampaignEvents(): Promise<void> {
    const utdContext = getCampaignContext('/university-dallas/')
    let success = true
    const errors: string[] = []

    try {
      // Test Piano Model Viewed Event
      const pianoEvent = await captureWithValidation(
        POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED,
        {
          model_name: 'CA99',
          model_price: '$4,799',
          model_category: 'Digital',
          time_spent_seconds: 45,
          source_section: formatSourceSection(utdContext, 'gallery'),
          interaction_type: 'view',
          ...utdContext,
          ...getCampaignUTMEquivalent(utdContext)
        },
        { skipValidation: false, logValidation: false }
      )

      if (!pianoEvent.success) {
        success = false
        errors.push('UTD Piano Event failed to capture')
        errors.push(...pianoEvent.validation.errors)
      }

      // Test Consultation Intent Event
      const consultationEvent = await captureWithValidation(
        POSTHOG_CONFIG.EVENTS.CONSULTATION_INTENT_SIGNAL,
        {
          trigger_source: 'hero_cta',
          models_viewed_count: 2,
          session_duration_seconds: 120,
          engagement_score: 85,
          time_to_intent_seconds: 30,
          high_intent: true,
          ...utdContext,
          ...getCampaignUTMEquivalent(utdContext)
        },
        { skipValidation: false, logValidation: false }
      )

      if (!consultationEvent.success) {
        success = false
        errors.push('UTD Consultation Event failed to capture')
        errors.push(...consultationEvent.validation.errors)
      }

    } catch (error) {
      success = false
      errors.push(`UTD Campaign Events test error: ${error}`)
    }

    this.results.push({
      testName: 'UTD Campaign Events',
      success,
      errors,
      warnings: [],
      campaignContext: utdContext
    })

    console.log(`${success ? '✅' : '❌'} UTD Campaign Events`)
  }

  private async testMainCampaignEvents(): Promise<void> {
    const mainContext = getCampaignContext('/')
    let success = true
    const errors: string[] = []

    try {
      // Test Piano Model Viewed Event for main campaign
      const pianoEvent = await captureWithValidation(
        POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED,
        {
          model_name: 'ES120',
          model_price: '$949',
          model_category: 'Digital',
          time_spent_seconds: 30,
          source_section: formatSourceSection(mainContext, 'hero'),
          interaction_type: 'view',
          ...mainContext,
          ...getCampaignUTMEquivalent(mainContext)
        },
        { skipValidation: false, logValidation: false }
      )

      if (!pianoEvent.success) {
        success = false
        errors.push('Main Campaign Piano Event failed to capture')
        errors.push(...pianoEvent.validation.errors)
      }

    } catch (error) {
      success = false
      errors.push(`Main Campaign Events test error: ${error}`)
    }

    this.results.push({
      testName: 'Main Campaign Events',
      success,
      errors,
      warnings: [],
      campaignContext: mainContext
    })

    console.log(`${success ? '✅' : '❌'} Main Campaign Events`)
  }

  private async testSourceSectionEnhancement(): Promise<void> {
    let success = true
    const errors: string[] = []

    try {
      const utdContext = getCampaignContext('/university-dallas/')
      const mainContext = getCampaignContext('/')

      const utdEnhanced = formatSourceSection(utdContext, 'gallery')
      const mainEnhanced = formatSourceSection(mainContext, 'hero')

      if (utdEnhanced !== 'university-dallas:gallery') {
        success = false
        errors.push(`UTD enhanced section expected 'university-dallas:gallery', got '${utdEnhanced}'`)
      }

      if (mainEnhanced !== 'main-landing:hero') {
        success = false
        errors.push(`Main enhanced section expected 'main-landing:hero', got '${mainEnhanced}'`)
      }

    } catch (error) {
      success = false
      errors.push(`Source Section Enhancement test error: ${error}`)
    }

    this.results.push({
      testName: 'Source Section Enhancement',
      success,
      errors,
      warnings: []
    })

    console.log(`${success ? '✅' : '❌'} Source Section Enhancement`)
  }

  private async testUTMDataGeneration(): Promise<void> {
    let success = true
    const errors: string[] = []

    try {
      const utdContext = getCampaignContext('/university-dallas/')
      const utmData = getCampaignUTMEquivalent(utdContext)

      const expectedUTM = {
        utm_source: 'utd',
        utm_medium: 'partnership',
        utm_campaign: 'utd-partnership-2025',
        utm_content: 'university-dallas',
        utm_term: 'students_faculty'
      }

      for (const [key, expectedValue] of Object.entries(expectedUTM)) {
        if (utmData[key as keyof typeof utmData] !== expectedValue) {
          success = false
          errors.push(`UTM ${key} expected '${expectedValue}', got '${utmData[key as keyof typeof utmData]}'`)
        }
      }

    } catch (error) {
      success = false
      errors.push(`UTM Data Generation test error: ${error}`)
    }

    this.results.push({
      testName: 'UTM Data Generation',
      success,
      errors,
      warnings: []
    })

    console.log(`${success ? '✅' : '❌'} UTM Data Generation`)
  }

  private async testEventValidation(): Promise<void> {
    let success = true
    const errors: string[] = []

    try {
      const utdContext = getCampaignContext('/university-dallas/')
      
      // Test valid event with campaign properties
      const validValidation = validateEventProperties(
        POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED,
        {
          model_name: 'CA99',
          model_price: '$4,799',
          model_category: 'Digital',
          time_spent_seconds: 45,
          source_section: 'university-dallas:gallery',
          interaction_type: 'view',
          ...utdContext,
          ...getCampaignUTMEquivalent(utdContext)
        }
      )

      if (!validValidation.isValid) {
        success = false
        errors.push('Valid UTD event failed validation')
        errors.push(...validValidation.errors)
      }

      // Test invalid campaign type
      const invalidValidation = validateEventProperties(
        POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED,
        {
          model_name: 'CA99',
          model_price: '$4,799',
          model_category: 'Digital',
          campaign_type: 'invalid_campaign_type'
        }
      )

      if (invalidValidation.isValid) {
        success = false
        errors.push('Invalid campaign type should have failed validation')
      }

    } catch (error) {
      success = false
      errors.push(`Event Validation test error: ${error}`)
    }

    this.results.push({
      testName: 'Event Validation with Campaign Properties',
      success,
      errors,
      warnings: []
    })

    console.log(`${success ? '✅' : '❌'} Event Validation with Campaign Properties`)
  }

  private getPassedCount(): number {
    return this.results.filter(r => r.success).length
  }

  private getFailedCount(): number {
    return this.results.filter(r => !r.success).length
  }

  private printFailures(): void {
    const failures = this.results.filter(r => !r.success)
    
    console.group('❌ Failed Tests Details')
    failures.forEach(failure => {
      console.group(failure.testName)
      failure.errors.forEach(error => console.error(`  • ${error}`))
      console.groupEnd()
    })
    console.groupEnd()
  }

  getResults(): CampaignTestResult[] {
    return [...this.results]
  }
}

// Convenience function for quick testing
export async function testCampaignTracking(): Promise<CampaignTestResult[]> {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Campaign tracking tests only available in development mode')
    return []
  }

  const tester = new CampaignTrackingTester()
  return await tester.runAllTests()
}

// Export for use in development tools
export const campaignTester = new CampaignTrackingTester()

// Development helper to expose testing functions globally
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as Window & { campaignDebug?: Record<string, unknown> }).campaignDebug = {
    testCampaignTracking,
    campaignTester,
    getCampaignContext,
    formatSourceSection,
    getCampaignUTMEquivalent,
    CAMPAIGN_CONFIGS
  }
}