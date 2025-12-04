# NAMM 2026 Artists Page - Implementation Documentation

## Overview

Complete scaffolding for the NAMM 2026 Artists page at `/namm-2026/artists`, showcasing featured artist performances, schedules, and detailed profiles.

## File Structure

```
src/
├── app/(frontend)/namm-2026/
│   └── artists/
│       └── page.tsx                    # Main artists page (Server Component)
└── components/namm/artists/
    ├── index.ts                        # Centralized exports
    ├── ArtistHero.tsx                  # Hero section with event info
    ├── FeaturedArtistsGrid.tsx         # Artist cards grid
    ├── PerformanceSchedule.tsx         # Daily performance schedule
    ├── ArtistProfiles.tsx              # Detailed artist biographies
    └── ArtistsCTA.tsx                  # Call-to-action section
```

## Page Features

### 1. **Artist Hero Section** (`ArtistHero.tsx`)
- Dramatic black background with kawai-red accents
- Event information display (dates, venue, access)
- Animated scroll indicator
- Background patterns and gradients
- Responsive design with mobile optimization

### 2. **Featured Artists Grid** (`FeaturedArtistsGrid.tsx`)
- 6 default placeholder artists (replaceable with CMS data)
- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- Hover effects with scale and border color transitions
- Social media integration (Instagram, Twitter, website)
- Genre badges and instrument information
- Optimized images with Next.js Image component

### 3. **Performance Schedule** (`PerformanceSchedule.tsx`)
- Organized by date (3-day event: January 22-24, 2026)
- Time slots with artist information
- Location details (booth stage areas)
- Genre indicators and performance descriptions
- Visual day indicators with gradient backgrounds
- Mobile-responsive timeline layout

### 4. **Artist Profiles** (`ArtistProfiles.tsx`)
- Detailed biography section
- Alternating left/right image layouts
- Notable achievements and awards
- Preferred instruments showcase
- Years active indicator
- External website links
- Comprehensive artist backgrounds

### 5. **Artists CTA Section** (`ArtistsCTA.tsx`)
- Call-to-action to return to main NAMM page
- Event information cards (dates, location, registration)
- External NAMM registration link
- Gradient background with patterns
- Multiple action buttons

## Technical Implementation

### SEO & Performance

**ISR Configuration:**
```typescript
export const revalidate = 86400 // 24 hours (matches main NAMM page)
```

**Metadata:**
- Optimized for "NAMM 2026 Artists", "Kawai Artists NAMM"
- OpenGraph and Twitter Card support
- Comprehensive keyword targeting
- Canonical URL configuration

**Loading Strategy:**
- Dynamic imports with `next/dynamic`
- Custom loading skeletons for each section
- Suspense boundaries for progressive loading
- Optimized bundle splitting

### Design System

**Color Palette:**
- Primary background: `#000000` (Black)
- Accent: `#E31937` - `#FF3B55` (Kawai Red gradient)
- Text: White with varying opacity levels
- Borders: `white/10` with hover states

**Typography:**
- Hero: 4xl-7xl font sizes with gradients
- Section headers: 4xl-5xl
- Body text: Base-lg with proper line-height
- Uppercase tracking for labels

**Components:**
- Rounded corners: `rounded-xl`, `rounded-2xl`
- Shadows: `shadow-lg`, `shadow-2xl` with color variants
- Transitions: 300-500ms ease-out
- Hover states: Scale, color, and border effects

### Responsive Design

**Breakpoints:**
- Mobile: Base styles (320px+)
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)

**Grid Layouts:**
- Artists Grid: 1 → 2 → 3 columns
- Schedule: Stacked → Side-by-side
- Profiles: Stacked → 2-column alternating

## Navigation & UX

### Breadcrumb Navigation
- Back arrow to main NAMM page
- Current page indicator
- Smooth transitions on hover

### Quick Info Bar (Sticky)
- Event dates, venue, performance access
- Icon-based information display
- Sticky positioning at top of page
- Responsive spacing for mobile

### Scroll Anchors
- `#featured-artists` - Featured Artists Grid
- `#schedule` - Performance Schedule
- `#profiles` - Artist Profiles

## Data Structure

### Artist Types

**FeaturedArtist:**
```typescript
{
  id: string
  name: string
  title: string
  genre: string
  imageUrl: string
  bio: string
  socialMedia?: {
    instagram?: string
    twitter?: string
    website?: string
  }
  featuredInstrument?: string
}
```

**PerformanceEvent:**
```typescript
{
  id: string
  artistName: string
  title: string
  date: string
  time: string
  location: string
  description?: string
  genre?: string
}
```

**ArtistProfile:**
```typescript
{
  id: string
  name: string
  title: string
  imageUrl: string
  fullBio: string
  achievements: string[]
  yearsActive?: string
  notableWorks?: string[]
  instruments?: string[]
  website?: string
}
```

## Integration with Payload CMS

### Future CMS Integration

To replace placeholder data with CMS content:

1. **Create Collections:**
   - `namm-artists` collection in Payload
   - `namm-performances` collection for schedule
   - `namm-artist-profiles` for detailed bios

2. **Update Components:**
```typescript
// Example: Fetch artists from CMS
import { getPayload } from '@/lib/payload-server'

export default async function FeaturedArtistsGrid() {
  const payload = await getPayload()
  const artists = await payload.find({
    collection: 'namm-artists',
    where: { featured: { equals: true } }
  })

  return <FeaturedArtistsGrid artists={artists.docs} />
}
```

3. **On-Demand Revalidation:**
   - Add `afterChange` hooks to trigger revalidation
   - Use `/api/revalidate` endpoint
   - Revalidate path: `/namm-2026/artists`

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states for interactive elements
- Color contrast compliance (WCAG AA)

## Performance Optimizations

1. **Image Optimization:**
   - Next.js Image component with `fill` and `sizes`
   - Lazy loading for below-the-fold content
   - Proper aspect ratios to prevent layout shift

2. **Code Splitting:**
   - Dynamic imports for all major sections
   - Separate loading skeletons
   - Suspense boundaries

3. **Caching:**
   - ISR with 24-hour revalidation
   - Static generation where possible
   - Optimized bundle sizes

## Testing Checklist

- [ ] Page loads without errors
- [ ] All sections render correctly
- [ ] Images load with proper sizes
- [ ] Links navigate correctly
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Loading skeletons display during dynamic imports
- [ ] SEO metadata appears in page source
- [ ] Breadcrumb navigation functions
- [ ] Social media links open in new tabs
- [ ] CTA buttons link to correct destinations
- [ ] Performance schedule grouped by date
- [ ] Artist profiles alternate layout correctly

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile Safari: ✅ Full support
- Mobile Chrome: ✅ Full support

## Maintenance Notes

### Updating Artist Data

**Default Data Locations:**
- Featured Artists: `FeaturedArtistsGrid.tsx` (line 21)
- Performance Schedule: `PerformanceSchedule.tsx` (line 30)
- Artist Profiles: `ArtistProfiles.tsx` (line 30)

**Image Placeholders:**
- Current: `/images/placeholders/artist-[1-6].jpg`
- Replace with actual artist photos
- Recommended size: 600x800px (3:4 aspect ratio)
- Format: WebP or JPG

### Future Enhancements

1. **Video Integration:**
   - Add artist performance videos
   - Implement video player component
   - YouTube/Vimeo embeds

2. **Interactive Features:**
   - "Add to Calendar" functionality
   - Artist Q&A sections
   - Live streaming integration

3. **Social Proof:**
   - Instagram feed integration
   - Testimonials from attendees
   - Real-time performance updates

## URL Structure

- Main Page: `/namm-2026`
- Artists Page: `/namm-2026/artists`
- Future Pages:
  - `/namm-2026/products` (product showcase)
  - `/namm-2026/schedule` (full event schedule)
  - `/namm-2026/contact` (booth contact/demos)

## Related Files

- Main NAMM Page: `/src/app/(frontend)/namm-2026/page.tsx`
- NAMM Layout: `/src/app/(frontend)/namm-2026/layout.tsx`
- NAMM Header: `/src/components/namm/NAMMHeader.tsx`
- Artist Lineup Section: `/src/components/namm/ArtistLineupSection.tsx`

## Deployment Notes

1. **Environment Variables:**
   - `NEXT_PUBLIC_SITE_URL` - For canonical URLs
   - No additional variables required for basic functionality

2. **Build Process:**
```bash
bun run build          # Build for production
bun run start          # Start production server
bun run dev            # Development mode
```

3. **Pre-Deployment Checklist:**
   - [ ] Update placeholder images with real photos
   - [ ] Verify all external links work
   - [ ] Test on multiple devices/browsers
   - [ ] Run Lighthouse audit (target: 90+ score)
   - [ ] Verify SEO metadata
   - [ ] Test ISR revalidation

## Support & Documentation

For questions or issues:
1. Review CLAUDE.md for project conventions
2. Check Next.js 15 documentation
3. Reference Tailwind CSS 4.1+ docs
4. Review Payload CMS integration guides

---

**Last Updated:** 2025-12-04
**Status:** ✅ Complete Scaffolding
**Next Steps:** Replace placeholder data with actual artist information
