'use client'

/**
 * EventInfoBox Component
 *
 * Minimizable overlay sidebar displaying key NAMM 2026 event information
 * Desktop: Fixed overlay on right side (starts minimized)
 * Mobile: Stacked at top of content
 *
 * Features:
 * - Event dates and location
 * - Booth information
 * - Quick links to registration and directions
 * - CTA button to plan visit
 * - Minimize/expand toggle
 */

import { useState, useEffect } from 'react'
import { Calendar, MapPin, ExternalLink, Navigation, ChevronRight, ChevronLeft, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NAMM_EVENT, getCountdownToNAMM, type CountdownTime } from '@/lib/namm-utils'
import { cn } from '@/lib/utils'

interface EventInfoBoxProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * EventInfoBox - Displays essential NAMM event details with minimize/expand toggle
 *
 * @example
 * <EventInfoBox />
 * <EventInfoBox className="custom-class" />
 */
export default function EventInfoBox({ className }: EventInfoBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMapOptions, setShowMapOptions] = useState(false)
  const [countdown, setCountdown] = useState<CountdownTime>(getCountdownToNAMM())

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownToNAMM())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const googleMapsUrl = "https://www.google.com/maps/place/Anaheim+Convention+Center"
  const appleMapsUrl = "https://maps.apple.com/?address=800%20W%20Katella%20Ave,%20Anaheim,%20CA%2092802"

  return (
    <>
      {/* Mobile: Circular Icon Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'lg:hidden',
          'w-14 h-14 rounded-full',
          'bg-white border-2 border-kawai-red',
          'shadow-lg',
          'flex items-center justify-center',
          'hover:bg-kawai-red/5 transition-all',
          'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
          isExpanded && 'hidden'
        )}
        aria-label="View event details"
      >
        <Info className="w-6 h-6 text-kawai-red" />
      </button>

      {/* Desktop: Horizontal Bar or Mobile: Full Screen Modal */}
      <Card
        className={cn(
          'border-2 border-kawai-red/20 shadow-xl bg-white/95 backdrop-blur-sm',
          'transition-all duration-300 ease-in-out',
          'overflow-hidden',
          // Desktop styles
          'hidden lg:block lg:rounded-xl',
          isExpanded ? 'lg:w-80' : 'lg:w-48',
          isExpanded ? 'lg:max-h-[calc(100vh-6rem)]' : 'lg:h-16',
          // Mobile modal styles
          isExpanded && 'block fixed inset-4 z-[60] rounded-2xl max-h-[calc(100vh-2rem)]',
          className
        )}
      >
        {/* Desktop: Minimized State - Horizontal Layout */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex h-full w-full items-center justify-between px-4 gap-3 hover:bg-kawai-red/5 transition-colors cursor-pointer"
            aria-label="Expand event details"
            aria-expanded={false}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-kawai-red flex-shrink-0" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-kawai-red tracking-wider whitespace-nowrap">
                  EVENT INFO
                </span>
                {!countdown.hasStarted && !countdown.hasEnded && countdown.days > 0 && (
                  <span className="text-[10px] text-kawai-black/50 font-medium whitespace-nowrap">
                    {countdown.days}d {countdown.hours}h {countdown.minutes}m
                  </span>
                )}
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-kawai-red -rotate-90" />
          </button>
        )}

      {/* Expanded State - Full Content with Scroll */}
      {isExpanded && (
        <div className="flex flex-col h-full max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-6rem)]">
          <CardHeader className="border-b border-kawai-red/10 bg-kawai-red/5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-kawai-black flex items-center gap-2">
                <Calendar className="w-6 h-6 text-kawai-red" />
                Event Details
              </CardTitle>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-kawai-red/10 rounded-lg transition-colors"
                aria-label="Close event details"
                aria-expanded={true}
              >
                <X className="w-5 h-5 text-kawai-red lg:hidden" />
                <ChevronRight className="hidden lg:block w-5 h-5 text-kawai-red rotate-90" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Event Dates */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-kawai-black/70 uppercase tracking-wide">
              Event Dates
            </h3>
            <p className="text-lg font-bold text-kawai-black">
              January 22-24, 2026
            </p>
            <p className="text-sm text-kawai-black/60">
              9:00 AM - 6:00 PM Daily
            </p>

            {/* Countdown Timer - Subtle */}
            {!countdown.hasStarted && !countdown.hasEnded && countdown.days > 0 && (
              <div className="mt-3 pt-3 border-t border-kawai-black/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-kawai-black/50 uppercase tracking-wide">Countdown</span>
                  <span className="font-mono font-semibold text-kawai-red/80">
                    {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                  </span>
                </div>
              </div>
            )}

            {countdown.hasStarted && !countdown.hasEnded && (
              <div className="mt-3 pt-3 border-t border-kawai-black/5">
                <p className="text-xs text-kawai-red font-semibold uppercase tracking-wide">
                  🔴 Event is Live Now!
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-kawai-black/10" />

          {/* Location */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-kawai-black/70 uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-kawai-red" />
              Location
            </h3>
            <div className="space-y-1">
              <p className="font-semibold text-kawai-black">
                {NAMM_EVENT.venue}
              </p>
              <p className="text-sm text-kawai-black/60">
                800 W Katella Ave<br />
                Anaheim, CA 92802
              </p>
            </div>
            <button
              onClick={() => setShowMapOptions(!showMapOptions)}
              className="inline-flex items-center gap-1 text-sm text-kawai-red hover:text-kawai-red/80 transition-colors font-medium"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
              <ChevronRight className={cn(
                "w-3 h-3 transition-transform",
                showMapOptions && "rotate-90"
              )} />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-kawai-black/10" />

          {/* Booth Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-kawai-black/70 uppercase tracking-wide">
              Kawai Booth
            </h3>
            <div className="bg-kawai-red/10 border-l-4 border-kawai-red rounded-r-lg px-4 py-3">
              <p className="text-lg font-bold text-kawai-red">
                Booth {NAMM_EVENT.booth}
              </p>
              <p className="text-xs text-kawai-black/60 mt-1">
                Hall B · First Floor
              </p>
              <p className="text-xs text-kawai-black/50 mt-1">
                Visit us for hands-on demos
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-kawai-black/10" />

          {/* Registration Link */}
          <div className="space-y-3">
            <p className="text-sm text-kawai-black/70">
              NAMM is a trade-only event. Registration required.
            </p>
            <a
              href="https://www.namm.org/registration"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-kawai-red hover:text-kawai-red/80 transition-colors font-semibold"
            >
              Register at NAMM.org
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* CTA Button - Get Directions */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowMapOptions(!showMapOptions)}
              className="w-full bg-kawai-red hover:bg-kawai-red/90 text-white font-semibold h-12 text-base shadow-md hover:shadow-lg transition-all"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
              <ChevronRight className={cn(
                "w-4 h-4 ml-auto transition-transform",
                showMapOptions && "rotate-90"
              )} />
            </Button>

            {/* Map Options Dropdown */}
            {showMapOptions && (
              <div className="space-y-2 p-3 bg-kawai-black/5 rounded-lg border border-kawai-red/10">
                <p className="text-xs text-kawai-black/60 font-medium uppercase tracking-wide mb-2">
                  Choose your map app:
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white border border-kawai-black/10 rounded-lg hover:border-kawai-red/30 hover:bg-kawai-red/5 transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-kawai-black group-hover:text-kawai-red transition-colors">
                      Google Maps
                    </p>
                    <p className="text-xs text-kawai-black/50">
                      Open in Google Maps
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-kawai-black/30 group-hover:text-kawai-red transition-colors" />
                </a>
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white border border-kawai-black/10 rounded-lg hover:border-kawai-red/30 hover:bg-kawai-red/5 transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-kawai-black group-hover:text-kawai-red transition-colors">
                      Apple Maps
                    </p>
                    <p className="text-xs text-kawai-black/50">
                      Open in Apple Maps
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-kawai-black/30 group-hover:text-kawai-red transition-colors" />
                </a>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-kawai-black/10">
            <p className="text-xs text-kawai-black/50 text-center leading-relaxed">
              Can't attend in person? Visit a Kawai dealer near you for personalized consultations.
            </p>
          </div>
        </CardContent>
        </div>
      )}
      </Card>

      {/* Mobile: Backdrop Overlay */}
      {isExpanded && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[59]"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
