# Productlines CMS Integration Guide

This guide explains how the Kawai piano website has been updated to use dynamic data from the Payload CMS Productlines collection instead of hardcoded data.

## Overview

The integration provides seamless content management for piano series data with the following benefits:

- **Dynamic Content**: Piano series and models can be managed through the CMS
- **Flexible Slides**: Each series can have custom carousel slides
- **Fallback Support**: Graceful degradation to hardcoded data if CMS is unavailable
- **Performance**: Server-side rendering with client-side hydration
- **TypeScript**: Full type safety for all CMS data

## Files Modified/Created

### New Files Created

1. **`/src/lib/types.ts`** - Added TypeScript interfaces for Productlines CMS data
2. **`/src/lib/payload.ts`** - Client-side CMS API utilities
3. **`/src/lib/payload-server.ts`** - Server-side CMS API utilities  
4. **`/src/components/piano/digital-piano-series-container.tsx`** - Server component for digital pianos
5. **`/src/components/piano/grand-piano-series-container.tsx`** - Server component for grand pianos
6. **`/src/app/(frontend)/pianos/digital/page-server.tsx`** - Server-rendered digital page example

### Modified Files

1. **`/src/components/piano/unified-piano-series.tsx`** - Updated to handle CMS slides
2. **`/src/components/piano/clean-series-browser.tsx`** - Updated to accept CMS data
3. **`/src/app/(frontend)/pianos/digital/page.tsx`** - Updated to fetch CMS data
4. **`/src/app/(frontend)/pianos/grand/page.tsx`** - Updated to fetch CMS data

## CMS Data Structure

The Productlines collection supports:

```typescript
interface Productline {
  id: string
  name: string              // Series name (e.g., "CA Series")
  slug: string             // URL-friendly slug
  category: string         // 'digital', 'grand', 'hybrid', 'upright'
  description: string      // Series description
  highlight?: string       // Optional highlighted text
  image: ProductlineMedia  // Main series image
  pianos: ProductlinePiano[] // Array of piano models
  slides?: ProductlineSlide[] // Optional carousel slides
  featured: boolean        // Featured series flag
  sortOrder?: number       // Display order
}
```

## Usage Patterns

### Client-Side Data Fetching

```tsx
import { getProductlines, transformProductlinesToSeries } from '@/lib/payload'

const [productlines, setProductlines] = useState<Productline[]>([])
const [series, setSeries] = useState(fallbackData)

useEffect(() => {
  async function fetchData() {
    try {
      const data = await getProductlines('digital')
      setProductlines(data)
      if (data.length > 0) {
        setSeries(transformProductlinesToSeries(data))
      }
    } catch (error) {
      // Graceful fallback to hardcoded data
    }
  }
  fetchData()
}, [])
```

### Server-Side Data Fetching

```tsx
import { getProductlinesServer, transformProductlinesToSeriesServer } from '@/lib/payload-server'

export default async function Page() {
  const productlines = await getProductlinesServer('digital')
  const series = transformProductlinesToSeriesServer(productlines)
  
  return <UnifiedPianoSeries series={series} />
}
```

## Dynamic Carousel Slides

The carousel now supports dynamic slides from the CMS:

1. **Slides Field**: Each Productline can have an array of slides with title and image
2. **Automatic Fallback**: If no slides are defined, the carousel uses piano images
3. **Smooth Animation**: Maintains the same visual behavior regardless of content source

### In the CMS:
- Add slides through the "Slides" array field in each Productline
- Each slide needs a title and image
- Images can be uploaded through the media manager

### In the Component:
```tsx
// The carousel automatically detects and uses slides
const carouselItems = activeSeriesData ? 
  (activeSeriesData.slides && activeSeriesData.slides.length > 0 
    ? [...activeSeriesData.slides, ...activeSeriesData.slides]
    : [...activeSeriesData.pianos, ...activeSeriesData.pianos]
  ) : []
```

## Environment Configuration

Set up the Payload API URL in your environment:

```env
# For server-side requests (recommended)
PAYLOAD_API_URL=http://localhost:3000/api

# For client-side requests (fallback)
NEXT_PUBLIC_PAYLOAD_API_URL=http://localhost:3000/api
```

## Error Handling & Fallbacks

The integration includes robust error handling:

1. **Network Errors**: If CMS is unavailable, falls back to hardcoded data
2. **Missing Images**: Default piano images are used for missing media
3. **Loading States**: Skeleton UI shown while data loads
4. **Type Safety**: All data is validated through TypeScript interfaces

## Performance Optimizations

- **Server-Side Rendering**: Initial data fetched on the server
- **Caching**: 5-minute revalidation for server requests
- **Lazy Loading**: Images loaded as needed
- **Graceful Degradation**: Fast fallback to static data

## Migration Strategy

The implementation allows for gradual migration:

1. **Phase 1**: Use existing pages with client-side CMS fetching (current state)
2. **Phase 2**: Gradually replace with server components for better performance
3. **Phase 3**: Remove hardcoded fallback data once CMS is stable

## Testing the Integration

1. **With CMS**: Ensure Payload CMS is running and has Productlines data
2. **Without CMS**: Stop CMS server to test fallback behavior
3. **Data Validation**: Check that all images and links work correctly
4. **Performance**: Verify loading states and error handling

## Next Steps

1. Populate the Productlines collection with actual piano data
2. Upload and organize images in the media library
3. Test the integration thoroughly
4. Consider migrating to server components for better performance
5. Add caching strategies for production deployment

The integration maintains all existing visual design and functionality while providing flexible content management through the CMS.