# HomePage CMS Integration - Implementation Guide

## Overview
This guide provides a complete implementation for integrating the HomePage collection with the frontend components using Payload CMS. The integration follows the same patterns used by the PianosPage.

## Architecture Summary

### 1. API Integration Approach
- **API Routes**: Created `/api/home-page` and `/api/home-page/singleton` endpoints
- **Data Fetching**: Added `getHomePage()`, `getCachedHomePage()`, and `getHomePageData()` functions in payload.ts
- **Server-side Rendering**: Uses Next.js App Router with React Server Components
- **Caching**: Implements 5-minute cache with automatic revalidation

### 2. Component Integration Pattern
Each homepage component now accepts optional `data` props and falls back to defaults:

```typescript
export function ComponentName({ data = DEFAULT_COMPONENT_DATA }: ComponentProps) {
  // Component uses data.field instead of hardcoded values
  return <div>{data.title}</div>
}
```

### 3. Data Flow Architecture
```
HomePage Collection (CMS) 
  → API Route (/api/home-page)
  → payload.ts (getHomePageData)
  → page.tsx (Server Component)
  → Individual Components (with data props)
```

## Files Created/Modified

### API Integration
- ✅ **Created**: `/src/app/(frontend)/api/home-page/route.ts` - Main API endpoint
- ✅ **Created**: `/src/app/(frontend)/api/home-page/singleton/route.ts` - Singleton endpoint
- ✅ **Modified**: `/src/lib/payload.ts` - Added HomePage data fetching functions

### Type Definitions
- ✅ **Created**: `/src/lib/types/homepage.ts` - Complete TypeScript interfaces and default values

### Components Updated
- ✅ **Updated**: `/src/components/homepage/hero.tsx` - Fully integrated with CMS data
- ✅ **Updated**: `/src/components/homepage/showroom-location.tsx` - Partially integrated (example)
- ✅ **Updated**: `/src/app/(frontend)/page.tsx` - Complete server-side data fetching

## Component Integration Status

### ✅ Completed Components
1. **Hero Component** - Fully integrated
   - Uses heroSection data from CMS
   - Supports background video from Media collection
   - Falls back to DEFAULT_HERO_DATA

2. **ShowroomLocation Component** - Partially integrated (example)
   - Uses showroomSection data from CMS
   - Integrated basic fields (header, title, description, contact info)
   - Falls back to DEFAULT_SHOWROOM_DATA

### ⏳ Remaining Components (Implementation Pattern Provided)

The following components need to be updated using the same pattern:

3. **PianoCollection Component**
   - Accept `PianoCollectionProps` with optional `data` prop
   - Use `pianoCollectionSection` data structure
   - Import `DEFAULT_PIANO_COLLECTION_DATA` as fallback
   - Update hardcoded strings to use `data.fieldName`

4. **PianoGallery Component**
   - Accept `PianoGalleryProps` with optional `data` prop
   - Use `pianoGallerySection` data structure
   - Map over `data.pianoCategories` array
   - Support Media objects for category images

5. **NewsCarousel Component**
   - Accept `NewsCarouselProps` with optional `data` prop
   - Use `newsCarouselSection` data structure
   - Map over `data.newsItems` array
   - Support `data.autoPlayDuration` for carousel timing

6. **ContactForm Component**
   - Accept `ContactFormProps` with optional `data` prop
   - Use `contactFormSection` data structure
   - Use `data.formOptions` for dropdown values
   - Support `data.benefits` and `data.stepTitles` arrays

## Implementation Pattern for Remaining Components

For each remaining component, follow this pattern:

### 1. Update Component Signature
```typescript
import type { ComponentNameProps } from "@/lib/types/homepage";
import { DEFAULT_COMPONENT_DATA } from "@/lib/types/homepage";

export function ComponentName({ data = DEFAULT_COMPONENT_DATA }: ComponentNameProps) {
```

### 2. Replace Hardcoded Values
```typescript
// Before:
<h2>Hardcoded Title</h2>

// After:
<h2>{data.title}</h2>
```

### 3. Handle Arrays
```typescript
// Before:
{hardcodedItems.map(item => ...)}

// After:
{data.items.map(item => ...)}
```

### 4. Handle Media Fields
```typescript
// Use MediaRenderer for CMS media fields
{data.image && (
  <MediaRenderer
    media={data.image}
    preset="gallery"
    className="..."
  />
)}
```

## Error Handling and Fallback Mechanisms

### 1. Server-Side Error Handling
The main page component includes comprehensive error handling:
```typescript
async function HomePageContent() {
  let homePageData: HomePageData | null = null;
  let error: string | null = null;

  try {
    homePageData = await getHomePageData();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load homepage data';
    console.error('Homepage data fetch error:', error);
  }

  // Components use fallback defaults if data is null
  return <Hero data={homePageData?.heroSection} />
}
```

### 2. Component-Level Fallbacks
Each component has default data:
```typescript
export function Hero({ data = DEFAULT_HERO_DATA }: HeroProps) {
  // Always has data, either from CMS or fallback
}
```

### 3. Loading States
Skeleton loaders provide smooth user experience while data loads:
```typescript
<Suspense fallback={<HeroSkeleton />}>
  <HomePageContent />
</Suspense>
```

## Testing the Integration

### 1. Development Testing
1. Start the development server: `bun run dev`
2. Check the homepage loads with fallback data
3. Create a HomePage entry in the CMS at `/admin`
4. Verify the homepage updates with CMS data
5. Check error handling by temporarily breaking the API

### 2. CMS Admin Testing
1. Go to `/admin/collections/home-page`
2. Create or edit the HomePage entry
3. Fill in the tabbed sections (Hero, Showroom, etc.)
4. Upload media for background video and images
5. Save and verify changes appear on the homepage

### 3. API Testing
Test the API endpoints directly:
```bash
# Test main endpoint
curl http://localhost:3000/api/home-page

# Test singleton endpoint
curl http://localhost:3000/api/home-page/singleton
```

## Media Integration with R2

The integration properly handles media fields from the HomePage collection:

### 1. Background Video
```typescript
// In Hero component
{data.backgroundVideo ? (
  <MediaRenderer
    media={data.backgroundVideo}
    preset="hero"
    priority
    className="absolute inset-0 object-cover"
  />
) : (
  // Fallback to static video
)}
```

### 2. Category Images
```typescript
// In PianoGallery component (to be implemented)
{data.pianoCategories.map(category => (
  <MediaRenderer
    media={category.image}
    preset="gallery"
    className="aspect-video object-cover"
  />
))}
```

## Performance Considerations

### 1. Caching Strategy
- 5-minute server-side cache for HomePage data
- Next.js automatic static optimization for unchanged pages
- Media optimization through R2/Cloudflare integration

### 2. Loading Optimization
- Server Components for initial data fetching
- Suspense boundaries for progressive loading
- Skeleton screens for better perceived performance

### 3. Bundle Size
- Type-only imports where possible
- Tree-shaking of unused default data constants
- Lazy loading of heavy components where appropriate

## Deployment Checklist

Before deploying the HomePage CMS integration:

### Environment Variables
Ensure these are set in production:
- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Payload CMS secret key
- `NEXT_PUBLIC_SITE_URL` - Full site URL for API calls
- `NEXT_PUBLIC_S3_PUBLIC_URL` - R2 public URL for media
- `S3_ACCESS_KEY_ID` - R2 access key
- `S3_SECRET_ACCESS_KEY` - R2 secret key
- `S3_ENDPOINT` - R2 endpoint URL
- `S3_BUCKET` - R2 bucket name

### Build Process
1. Run `bun run build` to ensure TypeScript compilation
2. Verify no type errors in the HomePage integration
3. Test API routes in production environment
4. Verify media uploads and R2 integration

### CMS Setup
1. Create initial HomePage entry in production CMS
2. Upload and configure media assets
3. Test all tabbed sections in the admin panel
4. Verify frontend displays CMS data correctly

## Next Steps for Full Implementation

### Immediate (Required for Complete Functionality)
1. **Update remaining components** using the provided pattern:
   - PianoCollection component
   - PianoGallery component  
   - NewsCarousel component
   - ContactForm component

2. **Test comprehensive media integration**:
   - Upload background video for Hero section
   - Add category images to Piano Gallery
   - Test news item images in carousel

3. **SEO Integration**:
   - Use `homePageData.seo` for page metadata
   - Add Open Graph image support
   - Implement structured data

### Future Enhancements (Optional)
1. **Live Preview Integration**:
   - Add `RefreshRouteOnSave` component for live editing
   - Enable preview mode for draft content

2. **Advanced Caching**:
   - Implement ISR (Incremental Static Regeneration)
   - Add cache invalidation on CMS updates

3. **Performance Monitoring**:
   - Add loading performance metrics
   - Monitor CMS data fetch times
   - Track fallback usage statistics

## Summary

The HomePage CMS integration provides a robust, scalable solution that:

✅ **Follows established patterns** from PianosPage implementation  
✅ **Maintains backward compatibility** with comprehensive fallbacks  
✅ **Integrates with existing media system** (R2/Cloudflare optimization)  
✅ **Provides type safety** with comprehensive TypeScript interfaces  
✅ **Implements proper error handling** and loading states  
✅ **Uses server-side rendering** for optimal performance  
✅ **Includes caching strategy** for production scalability  

The remaining components can be updated using the exact same pattern demonstrated with the Hero and ShowroomLocation components. All necessary infrastructure, types, and data fetching functions are in place.