'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import type { LocationConfig } from '../event.config'

interface FooterProps {
  businessLocation: LocationConfig
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
]

export function Footer({ businessLocation }: FooterProps) {

  const socialVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  }

  return (
    <footer
      className="border-t border-white/10"
      style={{ backgroundColor: '#080510' }}
    >
      <div style={{ height: '3px', background: '#4D1979' }} />
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-6">
              <Image
                src="/images/optimized/logos/kawai-logo-red-1x.webp"
                alt="Kawai Piano"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-white/70 mb-6 leading-relaxed text-sm">
              Crafting exceptional pianos for over 95 years. Experience the harmony of
              traditional Japanese craftsmanship and innovative technology.
            </p>
            <div className="text-xs text-white/25 tracking-wide">
              <div className="mb-2">Est. 1927 &bull; Hamamatsu, Japan</div>
              <div>&ldquo;Making beautiful music accessible to all&rdquo;</div>
            </div>
          </div>

          <div>
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Stay Connected
            </h3>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Join our community for piano insights, artist stories, and exclusive events.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex space-x-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded text-white placeholder:text-white/25 focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'white',
                  color: '#4D1979',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </form>
          </div>

          <div>
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.30)' }} />
                <a
                  href={`tel:${businessLocation.phone.replace(/\D/g, '')}`}
                  onClick={() => {}}
                  className="text-white/55 hover:text-white/70 transition-colors text-sm"
                >
                  {businessLocation.phone}
                </a>
              </div>
              {businessLocation.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.30)' }} />
                  <a
                    href={`mailto:${businessLocation.email}`}
                    onClick={() => {}}
                    className="text-white/55 hover:text-white/70 transition-colors text-sm"
                  >
                    {businessLocation.email}
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.30)' }} />
                <span className="text-white/55 text-sm">{businessLocation.address}, {businessLocation.city}, {businessLocation.state} {businessLocation.zip}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-white/25 mb-4 md:mb-0">
              &copy; 2024 Kawai Musical Instruments Mfg. Co., Ltd. All rights reserved.
              <div className="mt-1 tracking-wide">Crafted with precision in Hamamatsu, Japan since 1927.</div>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.div key={social.label} variants={socialVariants} initial="initial" whileHover="hover">
                    <Link
                      href={social.href}
                      className="text-white/30 hover:text-white/70 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5" />
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
