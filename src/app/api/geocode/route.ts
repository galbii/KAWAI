import { NextResponse } from 'next/server'
import { nominatimGeocode } from '@/lib/payload/geocode'

export async function POST(req: Request) {
  try {
    const { street, city, state, zipCode, country } = await req.json()

    if (!state) {
      return NextResponse.json(
        { error: 'At minimum a state is required to geocode.' },
        { status: 422 },
      )
    }

    const coords = await nominatimGeocode(
      { street, city, state, zipCode, country },
      'KawaiPianoRetailPlatform/1.0 (admin manual geocoding)',
    )

    if (!coords) {
      return NextResponse.json(
        { error: 'All geocoding providers returned no results. Try adding more address detail.' },
        { status: 404 },
      )
    }

    return NextResponse.json(coords)
  } catch {
    return NextResponse.json({ error: 'Geocoding request failed.' }, { status: 500 })
  }
}
