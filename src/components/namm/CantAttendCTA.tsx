/**
 * CantAttendCTA Component
 *
 * Converts visitors who can't attend NAMM to other engagement opportunities
 * Includes dealer finder, newsletter signup, and virtual demo links
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CantAttendCTAProps {
  className?: string
  dealerFinderUrl?: string
  virtualDemosUrl?: string
}

// Icon components
const MapIcon = () => (
  <svg className="w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
)

const EmailIcon = () => (
  <svg className="w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const VideoIcon = () => (
  <svg className="w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address')
      return
    }

    // Console log for now (Agent 4 can integrate with CRM)
    console.log('Newsletter signup:', {
      email,
      source: 'NAMM 2026 Landing Page',
      timestamp: new Date().toISOString()
    })

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <EmailIcon />
      <h3 className="text-xl md:text-2xl font-bold text-white">
        Get Updates
      </h3>
      <p className="text-white/90 text-sm md:text-base">
        Subscribe for NAMM highlights and exclusive content
      </p>

      {status === 'success' ? (
        <div className="bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-lg p-4">
          <p className="text-white font-medium text-sm">
            ✓ Successfully subscribed! Check your email for confirmation.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email for NAMM updates"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'submitting'}
            className={cn(
              "bg-white/10 backdrop-blur-sm border-2 border-white/30",
              "text-white placeholder:text-white/60",
              "focus:border-white focus:bg-white/20",
              "disabled:opacity-50"
            )}
            aria-label="Email address"
            required
          />

          {status === 'error' && (
            <p className="text-xs text-red-200">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={status === 'submitting'}
            className={cn(
              "w-full bg-white text-kawai-red font-bold",
              "hover:bg-white/90 transition-all",
              "disabled:opacity-50"
            )}
          >
            {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      )}
    </div>
  )
}

export default function CantAttendCTA({
  className,
  dealerFinderUrl = '/dealers',
  virtualDemosUrl = '/pianos'
}: CantAttendCTAProps) {
  return (
    <section className={cn(
      "relative py-16 px-4 md:py-20",
      "bg-gradient-to-br from-kawai-red via-red-700 to-red-900",
      "overflow-hidden",
      className
    )}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Can't Make It to NAMM?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Experience Kawai at a showroom near you
          </p>
        </div>

        {/* CTA Options Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Find a Dealer */}
          <div className={cn(
            "bg-white/10 backdrop-blur-sm rounded-xl p-8",
            "border-2 border-white/20",
            "hover:bg-white/20 hover:border-white/40",
            "transition-all duration-300",
            "text-center"
          )}>
            <MapIcon />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              Find a Dealer
            </h3>
            <p className="text-white/90 text-sm md:text-base mb-6">
              Visit an authorized Kawai dealer for hands-on experience
            </p>
            <Button
              asChild
              className={cn(
                "w-full bg-white text-kawai-red font-bold",
                "hover:bg-white/90 transition-all"
              )}
            >
              <Link href={dealerFinderUrl}>
                Locate Showrooms
              </Link>
            </Button>
          </div>

          {/* Newsletter Signup */}
          <div className={cn(
            "bg-white/10 backdrop-blur-sm rounded-xl p-8",
            "border-2 border-white/20",
            "hover:bg-white/20 hover:border-white/40",
            "transition-all duration-300",
            "text-center"
          )}>
            <NewsletterSignup />
          </div>

          {/* Virtual Demos */}
          <div className={cn(
            "bg-white/10 backdrop-blur-sm rounded-xl p-8",
            "border-2 border-white/20",
            "hover:bg-white/20 hover:border-white/40",
            "transition-all duration-300",
            "text-center"
          )}>
            <VideoIcon />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              Virtual Demos
            </h3>
            <p className="text-white/90 text-sm md:text-base mb-6">
              Explore our instruments with detailed videos and guides
            </p>
            <Button
              asChild
              className={cn(
                "w-full bg-white text-kawai-red font-bold",
                "hover:bg-white/90 transition-all"
              )}
            >
              <Link href={virtualDemosUrl}>
                Watch Demos
              </Link>
            </Button>
          </div>
        </div>

        {/* Additional CTA */}
        <div className="mt-12 text-center">
          <p className="text-white/80 text-sm">
            Questions? Contact us at{' '}
            <a
              href="mailto:info@kawaius.com"
              className="underline hover:text-white transition-colors font-medium"
            >
              info@kawaius.com
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export { NewsletterSignup }
