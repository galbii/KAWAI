/**
 * Nominatim (OpenStreetMap) reverse geocoding proxy.
 * Converts lat/lon coordinates into a human-readable address.
 *
 * Usage:
 *   GET /api/search/nominatim/reverse?lat=38.627&lon=-90.199
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return Response.json({ error: 'lat and lon are required' }, { status: 400 })
  }

  const params = new URLSearchParams({ lat, lon, format: 'json', addressdetails: '1' })

  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      'User-Agent': 'KawaiPianoRetailPlatform/1.0 (dealer finder reverse geocoding)',
      Accept: 'application/json',
    },
    next: { revalidate: 3600 },
  })

  const data = await res.json()
  return Response.json(data)
}
