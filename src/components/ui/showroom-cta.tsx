'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Music, 
  Users, 
  Award,
  CheckCircle,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShowroomLocation {
  id: string
  name: string
  address: string
  city: string
  phone: string
  hours: {
    weekday: string
    saturday: string
    sunday: string
  }
  specialties: string[]
  image?: string
}

const showroomLocations: ShowroomLocation[] = [
  {
    id: 'main',
    name: 'Kawai Piano Center - Main Showroom',
    address: '123 Music Lane',
    city: 'Piano City, PC 12345',
    phone: '(555) 123-4567',
    hours: {
      weekday: '9:00 AM - 7:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '12:00 PM - 5:00 PM'
    },
    specialties: ['Grand Pianos', 'Digital Pianos', 'Expert Consultations']
  }
]

interface ShowroomCTAProps {
  variant?: 'inline' | 'banner' | 'modal' | 'sidebar' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  showLocations?: boolean
  primaryAction?: 'schedule' | 'contact' | 'directions'
  className?: string
  onClose?: () => void
}

export function ShowroomCTA({ 
  variant = 'inline',
  size = 'md',
  showLocations = true,
  primaryAction = 'schedule',
  className,
  onClose
}: ShowroomCTAProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>(showroomLocations[0]?.id || '')

  if (variant === 'floating') {
    return (
      <div className={cn(
        "fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm",
        className
      )}>
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center mb-3">
          <Music className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Try Before You Buy</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Experience our pianos in person at our showroom.
        </p>
        <Button size="sm" className="w-full" asChild>
          <Link href="/experience/schedule-visit">
            Schedule Visit <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Visit Our Showroom</h2>
            {onClose && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          
          <div className="p-6">
            <ShowroomCTAContent 
              size="lg" 
              showLocations={showLocations}
              primaryAction={primaryAction}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={cn(
        "bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200",
        className
      )}>
        <ShowroomCTAContent 
          size="sm" 
          showLocations={false}
          primaryAction={primaryAction}
          selectedLocation={selectedLocation}
        />
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className={cn(
        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 sm:py-12",
        className
      )}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Experience Kawai Excellence in Person
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Touch, hear, and feel the difference. Our showroom experts will help you find your perfect piano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild>
                <Link href="/experience/schedule-visit">
                  Schedule Showroom Visit <Calendar className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/experience/showrooms">
                  Find Location <MapPin className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default inline variant
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-lg border border-gray-200",
      size === 'sm' && "p-4",
      size === 'md' && "p-6",
      size === 'lg' && "p-8",
      className
    )}>
      <ShowroomCTAContent 
        size={size} 
        showLocations={showLocations}
        primaryAction={primaryAction}
        selectedLocation={selectedLocation}
      />
    </div>
  )
}

function ShowroomCTAContent({ 
  size, 
  showLocations, 
  primaryAction,
  selectedLocation
}: {
  size: 'sm' | 'md' | 'lg'
  showLocations: boolean
  primaryAction: 'schedule' | 'contact' | 'directions'
  selectedLocation: string
}) {
  const location = showroomLocations.find(loc => loc.id === selectedLocation) || showroomLocations[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Music className="h-8 w-8 text-blue-600 mr-3" />
          <h3 className={cn(
            "font-bold text-gray-900",
            size === 'sm' && "text-lg",
            size === 'md' && "text-xl",
            size === 'lg' && "text-2xl"
          )}>
            Visit Our Showroom
          </h3>
        </div>
        <p className={cn(
          "text-gray-600",
          size === 'sm' && "text-sm",
          size === 'md' && "text-base",
          size === 'lg' && "text-lg"
        )}>
          Experience the difference in person. Try our pianos and get expert guidance.
        </p>
      </div>

      {/* Benefits */}
      <div className={cn(
        "grid gap-4",
        size === 'lg' ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"
      )}>
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Try Before You Buy</h4>
            <p className="text-sm text-gray-600">Play multiple models to find your perfect match</p>
          </div>
        </div>
        <div className="flex items-start">
          <Users className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Expert Guidance</h4>
            <p className="text-sm text-gray-600">Get personalized recommendations from our specialists</p>
          </div>
        </div>
        <div className="flex items-start">
          <Award className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Exclusive Access</h4>
            <p className="text-sm text-gray-600">See limited editions and special models</p>
          </div>
        </div>
      </div>

      {/* Location Info */}
      {showLocations && location && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">{location.name}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <div>{location.address}</div>
                <div className="text-gray-600">{location.city}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
              <span>{location.phone}</span>
            </div>
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <div>Mon-Fri: {location.hours.weekday}</div>
                <div>Sat: {location.hours.saturday}</div>
                <div>Sun: {location.hours.sunday}</div>
              </div>
            </div>
          </div>
          
          {location.specialties.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Specialties:</div>
              <div className="flex flex-wrap gap-1">
                {location.specialties.map((specialty, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className={cn(
        "flex gap-3",
        size === 'sm' ? "flex-col" : "flex-col sm:flex-row"
      )}>
        {primaryAction === 'schedule' ? (
          <>
            <Button className="flex-1" asChild>
              <Link href="/experience/schedule-visit">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Visit
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`tel:${location?.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Link>
            </Button>
          </>
        ) : primaryAction === 'contact' ? (
          <>
            <Button className="flex-1" asChild>
              <Link href={`tel:${location?.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/experience/schedule-visit">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Visit
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button className="flex-1" asChild>
              <Link href="/experience/showrooms">
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/experience/schedule-visit">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Visit
              </Link>
            </Button>
          </>
        )}
      </div>

      {/* Additional Info */}
      {size === 'lg' && (
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Can't visit in person? 
            <Link href="/experience/virtual-tours" className="text-blue-600 hover:underline ml-1">
              Take a virtual tour
            </Link>
            {' '}or{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact us online
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

// Quick CTA components for specific use cases
export function QuickScheduleCTA({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Button size="sm" asChild>
        <Link href="/experience/schedule-visit">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Visit
        </Link>
      </Button>
      <span className="text-sm text-gray-500">or</span>
      <Button variant="outline" size="sm" asChild>
        <Link href="tel:(555) 123-4567">
          <Phone className="mr-2 h-4 w-4" />
          Call
        </Link>
      </Button>
    </div>
  )
}

export function InlineShowroomLink({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href="/experience/schedule-visit"
      className={cn(
        "inline-flex items-center text-blue-600 hover:text-blue-700 font-medium",
        className
      )}
    >
      {children}
      <ArrowRight className="ml-1 h-4 w-4" />
    </Link>
  )
}