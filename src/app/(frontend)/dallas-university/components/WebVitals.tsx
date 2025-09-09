'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { trackWebVitals } from './lib/analytics'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Determine rating based on thresholds
    const getMetricRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
      const thresholds = {
        LCP: { good: 2500, poor: 4000 },
        FID: { good: 100, poor: 300 },
        CLS: { good: 0.1, poor: 0.25 },
        INP: { good: 200, poor: 500 },
        TTFB: { good: 800, poor: 1800 },
        FCP: { good: 1800, poor: 3000 }
      }

      const threshold = thresholds[name as keyof typeof thresholds]
      if (!threshold) return 'good'

      if (value <= threshold.good) return 'good'
      if (value <= threshold.poor) return 'needs-improvement'
      return 'poor'
    }

    // Handle Core Web Vitals
    if (['LCP', 'FID', 'CLS', 'INP', 'TTFB', 'FCP'].includes(metric.name)) {
      const rating = getMetricRating(metric.name, metric.value)
      trackWebVitals.coreVital(metric.name, metric.value, rating, metric.id)
    }

    // Handle Next.js specific metrics
    if (metric.name.startsWith('Next.js-')) {
      trackWebVitals.nextjsMetric(
        metric.name, 
        metric.value, 
        (metric as { navigationType?: string }).navigationType || 'unknown'
      )
    }

    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Web Vitals: ${metric.name}`, {
        value: metric.value,
        rating: metric.name.startsWith('Next.js-') ? 'N/A' : getMetricRating(metric.name, metric.value),
        id: metric.id
      })
    }
  })

  return null
}