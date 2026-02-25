/**
 * Nominatim (OpenStreetMap) forward geocoding proxy.
 * Keeps the API call server-side so the User-Agent is consistent
 * and Next.js can cache responses to respect Nominatim rate limits.
 *
 * Usage:
 *   GET /api/search/nominatim?q=Boston+MA&limit=5
 *   GET /api/search/nominatim?postalcode=63026&country=US
 *   GET /api/search/nominatim?street=...&city=...&state=...&postalcode=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const params = new URLSearchParams(searchParams)

  params.set('format', 'json')
  params.set('addressdetails', '1')
  if (!params.has('limit')) params.set('limit', '7')
  if (!params.has('countrycodes')) params.set('countrycodes', 'us')

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      'User-Agent': 'KawaiPianoRetailPlatform/1.0 (dealer finder search)',
      Accept: 'application/json',
    },
    // Cache each unique query for 1 hour — respects Nominatim rate limits automatically
    next: { revalidate: 3600 },
  })

  const data = await res.json()
  return Response.json(data)
}
