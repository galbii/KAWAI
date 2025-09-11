'use client'

import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface LandingHeroBlockProps {
  content?: {
    preHeadline?: string | null
    headline?: string | null
    subheadline?: string | null
    description?: string | null
    highlightText?: string | null
  }
  cta?: {
    primaryButton?: {
      text?: string | null
      link?: string | null
      style?: 'primary' | 'secondary' | 'accent' | 'gradient' | null
      size?: 'medium' | 'large' | 'xl' | null
      icon?: string | null
      openInNewTab?: boolean | null
    }
    secondaryButton?: {
      text?: string | null
      link?: string | null
      style?: 'outline' | 'ghost' | 'link' | null
      openInNewTab?: boolean | null
    }
    ctaNote?: string | null
  }
  media?: {
    backgroundImage?: string | Media | null
    foregroundImage?: string | Media | null
    backgroundVideo?: string | Media | null
    videoSettings?: {
      autoplay?: boolean | null
      muted?: boolean | null
      loop?: boolean | null
    }
    overlay?: {
      enable?: boolean | null
      color?: 'dark' | 'light' | 'brand' | 'gradient' | null
      opacity?: number | null
    }
  }
  layout?: {
    height?: 'medium' | 'large' | 'xl' | 'fullscreen' | null
    contentPosition?: 'center' | 'center-left' | 'center-right' | 'left' | 'right' | null
    contentWidth?: 'small' | 'medium' | 'large' | 'full' | null
    textAlignment?: 'left' | 'center' | 'right' | null
  }
  campaign?: {
    showUrgency?: boolean | null
    urgencyText?: string | null
    showCountdown?: boolean | null
    countdownEndDate?: string | null
    showSocialProof?: boolean | null
    socialProofText?: string | null
    testimonialQuote?: string | null
    testimonialAuthor?: string | null
  }
}

// Countdown Timer Component
function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const targetDate = new Date(endDate).getTime()
    
    const updateTimer = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
        setIsActive(true)
      } else {
        setIsActive(false)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  if (!isActive) return null

  return (
    <div className="flex gap-2 justify-center items-center text-white bg-black/20 rounded-lg p-3 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className="text-xs opacity-75">DAYS</div>
      </div>
      <div className="text-xl opacity-50">:</div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-xs opacity-75">HRS</div>
      </div>
      <div className="text-xl opacity-50">:</div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-xs opacity-75">MIN</div>
      </div>
      <div className="text-xl opacity-50">:</div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-xs opacity-75">SEC</div>
      </div>
    </div>
  )
}

export function LandingHeroBlock({
  content = {},
  cta = {},
  media = {},
  layout = {},
  campaign = {}
}: LandingHeroBlockProps) {
  // Layout classes
  const heightClasses = {
    medium: 'min-h-[600px]',
    large: 'min-h-[800px]',
    xl: 'min-h-[1000px]',
    fullscreen: 'min-h-screen'
  }

  const contentPositionClasses = {
    center: 'justify-center items-center',
    'center-left': 'justify-center items-start',
    'center-right': 'justify-center items-end',
    left: 'justify-start items-center',
    right: 'justify-end items-center'
  }

  const contentWidthClasses = {
    small: 'max-w-lg',
    medium: 'max-w-3xl',
    large: 'max-w-5xl',
    full: 'max-w-none'
  }

  const textAlignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  // Overlay classes
  const overlayColorClasses = {
    dark: 'bg-black/60',
    light: 'bg-white/60',
    brand: 'bg-kawai-red/60',
    gradient: 'bg-gradient-to-r from-kawai-black/80 to-kawai-red/60'
  }

  // Button style classes
  const buttonStyleClasses = {
    primary: 'bg-kawai-red hover:bg-kawai-red/90 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-gray-100 text-kawai-black shadow-lg hover:shadow-xl',
    accent: 'bg-kawai-gold hover:bg-kawai-gold/90 text-kawai-black shadow-lg hover:shadow-xl',
    gradient: 'bg-gradient-to-r from-kawai-red to-kawai-gold hover:from-kawai-red/90 hover:to-kawai-gold/90 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-kawai-black',
    ghost: 'text-white hover:bg-white/10',
    link: 'text-white underline hover:no-underline'
  }

  const buttonSizeClasses = {
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
    xl: 'px-12 py-5 text-xl'
  }

  const heightClass = heightClasses[layout.height || 'large']
  const contentPosition = contentPositionClasses[layout.contentPosition || 'center-left']
  const contentWidth = contentWidthClasses[layout.contentWidth || 'medium']
  const textAlignment = textAlignmentClasses[layout.textAlignment || 'left']

  const overlayColor = overlayColorClasses[media.overlay?.color || 'dark']
  const overlayOpacity = media.overlay?.opacity || 0.6

  const hasBackground = media.backgroundImage
  const hasVideo = media.backgroundVideo
  const hasForeground = media.foregroundImage

  return (
    <section className={cn('relative overflow-hidden', heightClass)}>
      {/* Background Media */}
      {hasBackground && !hasVideo && (
        <div className="absolute inset-0 z-0">
          <MediaRenderer 
            media={media.backgroundImage!}
            preset="hero"
            priority={true}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {hasVideo && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay={media.videoSettings?.autoplay !== false}
            muted={media.videoSettings?.muted !== false}
            loop={media.videoSettings?.loop !== false}
            playsInline
            className="w-full h-full object-cover"
          >
            <source 
              src={typeof media.backgroundVideo === 'string' ? media.backgroundVideo : media.backgroundVideo?.url || ''} 
              type="video/mp4" 
            />
          </video>
        </div>
      )}

      {/* Overlay */}
      {media.overlay?.enable !== false && (
        <div 
          className={cn('absolute inset-0 z-10', overlayColor)}
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content Container */}
      <div className={cn('relative z-20 w-full h-full flex', contentPosition)}>
        <div className="container mx-auto px-6">
          <div className={cn('flex items-center justify-between gap-12', 
            hasForeground && layout.contentPosition !== 'center' ? 'flex-row' : 'flex-col'
          )}>
            {/* Main Content */}
            <div className={cn('flex-1', contentWidth, textAlignment)}>
              <div className="space-y-6">
                {/* Campaign Elements */}
                {campaign.showUrgency && campaign.urgencyText && (
                  <div className="inline-flex items-center gap-2 bg-kawai-red text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    {campaign.urgencyText}
                  </div>
                )}

                {/* Pre-headline */}
                {content.preHeadline && (
                  <div className="text-kawai-gold font-semibold text-sm uppercase tracking-wider">
                    {content.preHeadline}
                  </div>
                )}

                {/* Main Headline */}
                {content.headline && (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight">
                    {content.headline}
                    {content.highlightText && (
                      <span className="block text-kawai-gold mt-2">
                        {content.highlightText}
                      </span>
                    )}
                  </h1>
                )}

                {/* Sub-headline */}
                {content.subheadline && (
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 leading-relaxed">
                    {content.subheadline}
                  </h2>
                )}

                {/* Description */}
                {content.description && (
                  <p className="text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl">
                    {content.description}
                  </p>
                )}

                {/* Social Proof */}
                {campaign.showSocialProof && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    {campaign.socialProofText && (
                      <div className="text-white/90 text-sm font-medium mb-2">
                        {campaign.socialProofText}
                      </div>
                    )}
                    {campaign.testimonialQuote && (
                      <blockquote className="text-white italic">
                        "{campaign.testimonialQuote}"
                        {campaign.testimonialAuthor && (
                          <footer className="text-white/70 text-sm mt-1">
                            — {campaign.testimonialAuthor}
                          </footer>
                        )}
                      </blockquote>
                    )}
                  </div>
                )}

                {/* Countdown Timer */}
                {campaign.showCountdown && campaign.countdownEndDate && (
                  <CountdownTimer endDate={campaign.countdownEndDate} />
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {cta.primaryButton?.text && cta.primaryButton.link && (
                    <Button
                      asChild
                      className={cn(
                        'transition-all duration-300 hover:-translate-y-0.5 group font-semibold',
                        buttonStyleClasses[cta.primaryButton.style || 'primary'],
                        buttonSizeClasses[cta.primaryButton.size || 'large']
                      )}
                    >
                      <Link 
                        href={cta.primaryButton.link}
                        target={cta.primaryButton.openInNewTab ? '_blank' : undefined}
                        rel={cta.primaryButton.openInNewTab ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center"
                      >
                        <span>{cta.primaryButton.text}</span>
                        {cta.primaryButton.icon && (
                          <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        )}
                      </Link>
                    </Button>
                  )}

                  {cta.secondaryButton?.text && cta.secondaryButton.link && (
                    <Button
                      asChild
                      variant="outline"
                      className={cn(
                        'transition-all duration-300 hover:-translate-y-0.5 font-medium',
                        buttonStyleClasses[cta.secondaryButton.style || 'outline'],
                        buttonSizeClasses.large
                      )}
                    >
                      <Link 
                        href={cta.secondaryButton.link}
                        target={cta.secondaryButton.openInNewTab ? '_blank' : undefined}
                        rel={cta.secondaryButton.openInNewTab ? 'noopener noreferrer' : undefined}
                      >
                        {cta.secondaryButton.text}
                      </Link>
                    </Button>
                  )}
                </div>

                {/* CTA Note */}
                {cta.ctaNote && (
                  <p className="text-white/70 text-sm">
                    {cta.ctaNote}
                  </p>
                )}
              </div>
            </div>

            {/* Foreground Image */}
            {hasForeground && (
              <div className="flex-shrink-0 max-w-md lg:max-w-lg">
                <MediaRenderer 
                  media={media.foregroundImage!}
                  preset="hero"
                  priority={true}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}