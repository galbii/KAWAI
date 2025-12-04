# NAMM 2026 Artists Page

## Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      NAMMHeader (from layout)                │
├─────────────────────────────────────────────────────────────┤
│                     Breadcrumb Navigation                    │
│              ← NAMM 2026 / Artists                          │
├─────────────────────────────────────────────────────────────┤
│                    Quick Info Bar (Sticky)                   │
│         📅 Jan 22-24 | 📍 Anaheim | 🎵 Free Performances    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                        Artist Hero                           │
│                 Experience World-Class                       │
│                     Piano Artistry                           │
│                                                              │
│            [Event Details: Dates, Venue, Access]             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                  Featured Artists Grid                       │
│                    (6 Artist Cards)                          │
│                                                              │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Sarah    │  │ Marcus   │  │ Elena    │               │
│    │ Chen     │  │ Williams │  │ Rodriguez│               │
│    └──────────┘  └──────────┘  └──────────┘               │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ David    │  │ Yuki     │  │ Andre    │               │
│    │ Thompson │  │ Tanaka   │  │ Dubois   │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                  Performance Schedule                        │
│                  (Organized by Date)                         │
│                                                              │
│    📅 Day 1 - January 22, 2026                              │
│       🕐 10:00 AM - Sarah Chen: Classical Masterworks       │
│       🕐 1:00 PM  - Marcus Williams: Jazz Explorations      │
│       🕐 3:30 PM  - Elena Rodriguez: Cinematic Soundscapes  │
│                                                              │
│    📅 Day 2 - January 23, 2026                              │
│       🕐 11:00 AM - David Thompson: Broadway & Beyond       │
│       🕐 2:00 PM  - Yuki Tanaka: Modern Classical           │
│       🕐 4:30 PM  - Andre Dubois: Soul Sessions             │
│                                                              │
│    📅 Day 3 - January 24, 2026                              │
│       🕐 10:30 AM - Sarah Chen: Romantic Era Favorites      │
│       🕐 1:30 PM  - Marcus Williams: Jazz Fusion Finale     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                     Artist Profiles                          │
│              (Detailed Biographies)                          │
│                                                              │
│    ┌────────────┬─────────────────────────────┐            │
│    │   Photo    │  Sarah Chen                 │            │
│    │            │  International Concert      │            │
│    │            │  Pianist                    │            │
│    │            │                             │            │
│    │            │  Full biography...          │            │
│    │            │  Awards & Achievements      │            │
│    └────────────┴─────────────────────────────┘            │
│                                                              │
│    [Additional profiles with alternating layouts]           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                      Artists CTA                             │
│         Ready to Experience These Artists Live?              │
│                                                              │
│      [← Back to NAMM 2026]  [📅 Plan Your Visit]           │
│                                                              │
│    ┌───────────┬───────────┬───────────┐                   │
│    │ 📅 Dates  │ 📍Location│ 🔗 Register│                   │
│    │ Jan 22-24 │ Anaheim   │ NAMM.org   │                   │
│    └───────────┴───────────┴───────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Files

### Page Component
- **File:** `page.tsx`
- **Type:** Server Component (default)
- **Features:**
  - ISR with 24-hour revalidation
  - Comprehensive SEO metadata
  - Dynamic imports with loading skeletons
  - Breadcrumb navigation
  - Sticky quick info bar

### Component Library
All components located in `/src/components/namm/artists/`:

1. **ArtistHero.tsx**
   - Hero section with gradient text
   - Event information display
   - Animated scroll indicator

2. **FeaturedArtistsGrid.tsx**
   - Responsive grid of artist cards
   - Hover effects and animations
   - Social media integration
   - Genre and instrument info

3. **PerformanceSchedule.tsx**
   - Daily schedule organization
   - Time slot displays
   - Location and genre indicators
   - Grouped by date visualization

4. **ArtistProfiles.tsx**
   - Detailed artist biographies
   - Alternating left/right layouts
   - Achievement lists
   - External links

5. **ArtistsCTA.tsx**
   - Call-to-action section
   - Navigation links
   - Event information cards
   - NAMM registration link

## Key Features

✅ **SEO Optimized** - Meta tags, keywords, OpenGraph, Twitter Cards
✅ **Performance** - ISR caching, dynamic imports, loading skeletons
✅ **Responsive** - Mobile-first design with tablet/desktop breakpoints
✅ **Accessible** - Semantic HTML, proper heading hierarchy, ARIA labels
✅ **Modern Design** - Black theme with kawai-red accents, gradients, animations
✅ **Type Safe** - Full TypeScript with strict types
✅ **CMS Ready** - Placeholder data easily replaceable with Payload CMS

## Development

```bash
# View the page in development
bun run dev

# Navigate to:
http://localhost:3000/namm-2026/artists

# Build for production
bun run build
```

## Next Steps

1. Replace placeholder images in `/public/images/placeholders/`
2. Update artist data with real information
3. Connect to Payload CMS for dynamic content
4. Add actual artist photos (recommended: 600x800px, 3:4 ratio)
5. Test on multiple devices and browsers
6. Run Lighthouse audit for performance optimization
