'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { Button } from '@/components/ui/button'

const footerLinks = {
  instruments: {
    title: 'Instruments',
    links: [
      { label: 'Shigeru Kawai', href: '/pianos/series/shigeru-kawai' },
      { label: 'Grand Pianos', href: '/pianos/grand' },
      { label: 'Upright Pianos', href: '/pianos/upright' },
      { label: 'Digital Pianos', href: '/pianos/digital' },
      { label: 'Hybrid Pianos', href: '/pianos/hybrid' },
      { label: 'Pre-Owned', href: '/pianos/pre-owned' },
      { label: 'Piano Finder', href: '/piano-finder' },
    ]
  },
  innovation: {
    title: 'Innovation',
    links: [
      { label: 'Millennium III Action', href: '/innovation/millennium-action' },
      { label: 'Harmonic Imaging', href: '/innovation/harmonic-imaging' },
      { label: 'Grand Feel Action', href: '/innovation/grand-feel-action' },
      { label: 'Sound Technologies', href: '/innovation/sound-tech' },
      { label: 'Craftsmanship', href: '/innovation/craftsmanship' },
    ]
  },
  heritage: {
    title: 'Heritage',
    links: [
      { label: 'Kawai Story', href: '/heritage/kawai-story' },
      { label: 'Family Legacy', href: '/heritage/family-legacy' },
      { label: 'Awards', href: '/heritage/awards' },
      { label: 'Artists', href: '/heritage/artists' },
      { label: 'Manufacturing', href: '/heritage/manufacturing' },
    ]
  },
  experience: {
    title: 'Experience',
    links: [
      { label: 'Showroom Locations', href: '/experience/showrooms' },
      { label: 'Schedule Visit', href: '/experience/schedule-visit' },
      { label: 'Virtual Tours', href: '/experience/virtual-tours' },
      { label: 'Piano Services', href: '/experience/services' },
      { label: 'Events', href: '/experience/events' },
    ]
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Buying Guide', href: '/resources/buying-guide' },
      { label: 'Piano Care', href: '/resources/piano-care' },
      { label: 'Learning Center', href: '/resources/learning-center' },
      { label: 'Financing', href: '/resources/financing' },
      { label: 'Downloads', href: '/resources/downloads' },
    ]
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Service Centers', href: '/support/service-centers' },
      { label: 'Warranty', href: '/support/warranty' },
      { label: 'FAQ', href: '/support/faq' },
      { label: 'Privacy Policy', href: '/privacy' },
    ]
  }
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
]

export function Footer() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <KawaiLogo size="sm" animated={true} theme="dark" />
            </div>
            <p className="text-kawai-neutral mb-6 leading-relaxed">
              Crafting exceptional pianos for over 95 years. Experience the harmony of 
              traditional Japanese craftsmanship and innovative technology.
            </p>
            <div className="text-sm text-kawai-neutral/80 mb-6">
              <div className="mb-2">Est. 1927 • Hamamatsu, Japan</div>
              <div>"Making beautiful music accessible to all"</div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-kawai-red" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-kawai-red" />
                <span>info@kawaipianocenter.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-kawai-red" />
                <span>123 Music Lane, Piano City, PC 12345</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-lg mb-4 text-kawai-pearl">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link
                        href={link.href}
                        className="text-kawai-neutral hover:text-kawai-red transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter & Values */}
        <div className="border-t border-kawai-neutral/20 mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-kawai-pearl">Stay Connected</h3>
              <p className="text-kawai-neutral mb-4">
                Join our community for piano insights, artist stories, and exclusive events.
              </p>
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-kawai-black/60 border border-kawai-neutral/30 rounded-md text-kawai-pearl placeholder-kawai-neutral/60 focus:outline-none focus:ring-2 focus:ring-kawai-red backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  className="px-6 py-2 bg-kawai-red hover:bg-kawai-red/90 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Subscribe
                </Button>
              </form>
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
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-kawai-neutral/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-kawai-neutral/80 text-sm mb-4 md:mb-0">
              © 2024 Kawai Musical Instruments Mfg. Co., Ltd. All rights reserved.
              <div className="mt-1">Crafted with precision in Hamamatsu, Japan since 1927.</div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.div key={social.label} variants={socialVariants} initial="initial" whileHover="hover">
                    <Link
                      href={social.href}
                      className="text-kawai-neutral/80 hover:text-kawai-red transition-colors"
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