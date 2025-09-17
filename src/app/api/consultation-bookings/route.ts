import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Validation schemas for the booking data
interface BookingData {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  selectedDate: string
  selectedTime: string
  pianoInterest?: string
  notes?: string
  eventType: string
  status: string
  sourceSignaturePage?: string
  userAgent?: string
  ipAddress?: string
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate date format and range
function isValidDate(date: string): boolean {
  const validDates = ['2024-10-09', '2024-10-10', '2024-10-11', '2024-10-12']
  return validDates.includes(date)
}

// Validate time format
function isValidTime(time: string): boolean {
  const validTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
  return validTimes.includes(time)
}

// Validate booking data
function validateBookingData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length === 0) {
    errors.push('First name is required')
  }

  if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
    errors.push('Last name is required')
  }

  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('Valid email address is required')
  }

  if (!data.selectedDate || !isValidDate(data.selectedDate)) {
    errors.push('Valid date selection is required (October 9-12, 2024)')
  }

  if (!data.selectedTime || !isValidTime(data.selectedTime)) {
    errors.push('Valid time selection is required')
  }

  // Optional field validation
  if (data.phoneNumber && typeof data.phoneNumber !== 'string') {
    errors.push('Phone number must be a string')
  }

  if (data.notes && typeof data.notes !== 'string') {
    errors.push('Notes must be a string')
  }

  if (data.pianoInterest && typeof data.pianoInterest !== 'string') {
    errors.push('Piano interest must be a string')
  }

  return { isValid: errors.length === 0, errors }
}

// Get client IP address from request
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return realIP || clientIP || 'unknown'
}

// POST - Create a new consultation booking
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    console.log('Received booking request:', body)

    // Validate the data
    const validation = validateBookingData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Get Payload instance
    const payload = await getPayload({ config })

    // Prepare booking data with additional metadata
    const bookingData: Partial<BookingData> = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.toLowerCase().trim(),
      phoneNumber: body.phoneNumber?.trim() || '',
      selectedDate: body.selectedDate,
      selectedTime: body.selectedTime,
      pianoInterest: body.pianoInterest || '',
      notes: body.notes?.trim() || '',
      eventType: body.eventType || 'premium-consultation',
      status: body.status || 'pending',
      sourceSignaturePage: body.sourceSignaturePage || '',
      userAgent: body.userAgent || request.headers.get('user-agent') || '',
      ipAddress: getClientIP(request),
    }

    console.log('Creating booking with data:', bookingData)

    // Create the booking in the database
    const booking = await payload.create({
      collection: 'consultation-bookings' as any, // Type will be updated after regeneration
      data: bookingData,
    })

    console.log('Booking created successfully:', booking.id)

    // Return success response
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        selectedDate: booking.selectedDate,
        selectedTime: booking.selectedTime,
        status: booking.status,
        createdAt: booking.createdAt,
      },
      message: 'Consultation booking created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating consultation booking:', error)

    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to create booking',
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Retrieve booking by ID or list bookings (for future use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')
    const email = searchParams.get('email')

    // Get Payload instance
    const payload = await getPayload({ config })

    if (bookingId) {
      // Get specific booking by ID
      const booking = await payload.findByID({
        collection: 'consultation-bookings' as any,
        id: bookingId,
      })

      return NextResponse.json({ booking })
    } else if (email) {
      // Find bookings by email
      const bookings = await payload.find({
        collection: 'consultation-bookings' as any,
        where: {
          email: {
            equals: email.toLowerCase().trim()
          }
        },
        sort: '-createdAt',
        limit: 10,
      })

      return NextResponse.json({ bookings: bookings.docs })
    } else {
      // List recent bookings (admin access only - in production add authentication)
      const bookings = await payload.find({
        collection: 'consultation-bookings' as any,
        sort: '-createdAt',
        limit: 50,
      })

      return NextResponse.json({ bookings: bookings.docs })
    }

  } catch (error) {
    console.error('Error retrieving consultation bookings:', error)

    return NextResponse.json(
      { error: 'Failed to retrieve bookings' },
      { status: 500 }
    )
  }
}

// OPTIONS - Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}