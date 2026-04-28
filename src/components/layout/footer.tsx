'use client'

import type React from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useActionState } from 'react'
import { cn } from '@/lib/utils'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { Button } from '@/components/ui/button'
import { submitNewsletterSignup, type NewsletterSignupResult } from '@/lib/actions/newsletter-signup'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn(className)} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn(className)} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// All footer quick links removed per user request
// const footerLinks = {
//   instruments: {
//     title: 'Instruments',
//     links: [
//       { label: 'Shigeru Kawai', href: '/pianos/shigeru-kawai' },
//       { label: 'Grand Pianos', href: '/pianos/grand' },
//       { label: 'Upright Pianos', href: '/pianos/upright' },
//       { label: 'Digital Pianos', href: '/pianos/digital' },
//       { label: 'Hybrid Pianos', href: '/pianos/hybrid' },
//       { label: 'Piano Finder', href: '/piano-finder' },
//     ]
//   },
//   explore: {
//     title: 'Explore',
//     links: [
//       { label: 'About Kawai', href: '/about' },
//       { label: 'Artists', href: '/artists' },
//       { label: 'Technology', href: '/technology' },
//       { label: 'Showroom', href: '/showroom' },
//       { label: 'Guides', href: '/guides' },
//     ]
//   },
// }

type SocialIconComponent = React.ComponentType<{ className?: string }>

const socialLinks: Array<{ icon: SocialIconComponent; href: string; label: string }> = [
  { icon: Instagram, href: 'https://www.instagram.com/kawaipianosus/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/KawaiPianosUS/', label: 'Facebook' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@kawaipianosus', label: 'TikTok' },
  { icon: XIcon, href: 'https://x.com/KawaiPianosUS', label: 'X / Twitter' },
  { icon: Youtube, href: 'https://www.youtube.com/@KawaiPianosUS', label: 'YouTube' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/9083672', label: 'LinkedIn' },
]

interface DealerLocationContactData {
  name: string
  address: string
  phone: string
  email?: string
  locationName?: string
  slug?: string
}

interface FooterProps {
  locationContactData?: DealerLocationContactData | null
  isSignaturePage?: boolean
}

export function Footer({ locationContactData, isSignaturePage = false }: FooterProps) {
  const [newsletterState, newsletterAction, newsletterPending] = useActionState<NewsletterSignupResult | null, FormData>(
    submitNewsletterSignup,
    null,
  )

  // Generate location-aware business name and description
  const businessName = locationContactData?.name || 'Kawai'
  const locationDescription = locationContactData?.locationName
    ? `${locationContactData.locationName}'s premier piano destination. Experience the harmony of traditional Japanese craftsmanship and innovative technology.`
    : 'Crafting exceptional pianos for over 95 years. Experience the harmony of traditional Japanese craftsmanship and innovative technology.'

  const linkVariants = {
    initial: { x: 0 },
    hover: {
      x: 2,
      transition: { duration: 0.2 }
    }
  }

  const socialVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  }

  return (
    <footer className="backdrop-blur-md bg-kawai-black/95 text-kawai-pearl border-t border-kawai-neutral/20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Company Info */}
          <div className="text-center">
            <div className="mb-6">
              <KawaiLogo
                size="sm"
                animated={true}
                theme="dark"
                {...(locationContactData?.locationName && { dealerName: locationContactData.locationName })}
                nonClickable={isSignaturePage}
              />
            </div>
            {locationContactData?.locationName && (
              <h2 className="text-2xl md:text-3xl font-semibold text-kawai-pearl mb-4 uppercase tracking-wide">
                {locationContactData.locationName}
              </h2>
            )}
            <p className="text-kawai-neutral mb-6 leading-relaxed">
              {locationDescription}
            </p>

            {/* Contact Info - Only show when location data is available */}
            {!isSignaturePage && locationContactData && (
              <div className="space-y-3 flex flex-col items-center">
                {locationContactData.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-kawai-red" />
                    <span>{locationContactData.phone}</span>
                  </div>
                )}
                {locationContactData.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-kawai-red" />
                    <span>{locationContactData.email}</span>
                  </div>
                )}
                {locationContactData.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-kawai-red" />
                    <span>{locationContactData.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Links - All removed */}
        </div>

        {/* Newsletter & Values - Hidden on signature page */}
        {!isSignaturePage && (
          <div className="border-t border-kawai-neutral/20 mt-12 pt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-kawai-pearl">Stay Connected</h3>
                <p className="text-kawai-neutral mb-4">
                  Join our community for piano insights, artist stories, and exclusive events.
                </p>
                {newsletterState?.success ? (
                  <p className="text-kawai-red font-medium">{newsletterState.message}</p>
                ) : (
                  <form action={newsletterAction} className="flex space-x-2">
                    {locationContactData?.slug && (
                      <input type="hidden" name="storefrontSlug" value={locationContactData.slug} />
                    )}
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-4 py-2 bg-kawai-black/60 border border-kawai-neutral/30 rounded-md text-kawai-pearl placeholder-kawai-neutral/60 focus:outline-none focus:ring-2 focus:ring-kawai-red backdrop-blur-sm"
                    />
                    <Button
                      type="submit"
                      disabled={newsletterPending}
                      className="px-6 py-2 bg-kawai-red hover:bg-kawai-red/90 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      {newsletterPending ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </form>
                )}
                {newsletterState && !newsletterState.success && (
                  <p className="text-red-400 text-sm mt-2">{newsletterState.message}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-kawai-pearl">Our Values</h3>
                <div className="space-y-2 text-sm text-kawai-neutral">
                  <div>• Uncompromising quality and craftsmanship</div>
                  <div>• Innovation rooted in tradition</div>
                  <div>• Making music accessible to everyone</div>
                  <div>• Sustainable manufacturing practices</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-kawai-neutral/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright + Legal Links */}
            <div className="flex flex-col md:flex-row items-center gap-3 text-kawai-neutral/80 text-sm mb-4 md:mb-0">
              <span>© 2026 Kawai America Corporation. All rights reserved.</span>
              <span className="hidden md:inline text-kawai-neutral/40">·</span>
              <Link href="/privacy" className="hover:text-kawai-red transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden md:inline text-kawai-neutral/40">·</span>
              <Link href="/terms" className="hover:text-kawai-red transition-colors">
                Terms of Service
              </Link>
              <span className="hidden md:inline text-kawai-neutral/40">·</span>
              <Link href="/return-policy" className="hover:text-kawai-red transition-colors">
                Return Policy
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.div key={social.label} variants={socialVariants} initial="initial" whileHover="hover">
                    <Link
                      href={social.href}
                      className="text-kawai-neutral/80 hover:text-kawai-red transition-colors"
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-7 w-7" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}