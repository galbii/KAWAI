# NAMM 2026 Artists Components Guide

## Component Architecture

All components follow the KAWAI design system with:
- **Black backgrounds** (#000000, zinc-900, zinc-950)
- **Kawai Red accents** (#E31937 → #FF3B55 gradients)
- **White text** with varying opacity (100%, 80%, 70%, 60%, 50%)
- **Smooth animations** (300-500ms transitions)
- **Mobile-first responsive design**

---

## 1. ArtistHero

**Purpose:** Hero section introducing the artists page

**Design Elements:**
- Full-width black background with pattern overlay
- Large gradient text for main heading
- Three information cards (dates, venue, access)
- Animated scroll indicator
- Bottom gradient fade

**Props:**
```typescript
interface ArtistHeroProps {
  className?: string
}
```

**Usage:**
```tsx
import ArtistHero from '@/components/namm/artists/ArtistHero'

<ArtistHero />
```

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│                                          │
│         🎵 NAMM 2026 Artist Lineup      │
│                                          │
│      Experience World-Class              │
│         Piano Artistry                   │
│                                          │
│  Join us for exclusive performances...  │
│                                          │
│  [📅 Dates] [📍 Venue] [🎵 Access]      │
│                                          │
│              ↓ Scroll                    │
│                                          │
└─────────────────────────────────────────┘
```

---

## 2. FeaturedArtistsGrid

**Purpose:** Showcase featured artists in a responsive grid

**Design Elements:**
- Artist photo with gradient overlay
- Genre badge in top-left corner
- Social media icons (Instagram, Twitter, Website) on hover
- Featured instrument information
- Hover effects (scale, border color, shadow)

**Props:**
```typescript
interface FeaturedArtistsGridProps {
  artists?: FeaturedArtist[]
  className?: string
}

interface FeaturedArtist {
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

**Default Data:** 6 placeholder artists

**Usage:**
```tsx
import FeaturedArtistsGrid from '@/components/namm/artists/FeaturedArtistsGrid'

// With default data
<FeaturedArtistsGrid />

// With custom data
<FeaturedArtistsGrid artists={customArtists} />
```

**Visual Layout:**
```
┌───────────────────────────────────────────┐
│        🎵 6 Featured Artists              │
│         Meet Our Artists                  │
│                                           │
│  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │[Photo] │  │[Photo] │  │[Photo] │     │
│  │ Name   │  │ Name   │  │ Name   │     │
│  │ Title  │  │ Title  │  │ Title  │     │
│  │ Bio    │  │ Bio    │  │ Bio    │     │
│  │🎹 Instr│  │🎹 Instr│  │🎹 Instr│     │
│  └────────┘  └────────┘  └────────┘     │
│  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │[Photo] │  │[Photo] │  │[Photo] │     │
│  │ Name   │  │ Name   │  │ Name   │     │
│  └────────┘  └────────┘  └────────┘     │
│                                           │
└───────────────────────────────────────────┘
```

**Responsive Behavior:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

## 3. PerformanceSchedule

**Purpose:** Display daily performance schedule organized by date

**Design Elements:**
- Date headers with gradient badges
- Time slot cards with hover effects
- Location and genre indicators
- Left border accent on hover
- Grouped by date (January 22-24, 2026)

**Props:**
```typescript
interface PerformanceScheduleProps {
  events?: PerformanceEvent[]
  className?: string
}

interface PerformanceEvent {
  id: string
  artistName: string
  title: string
  date: string          // "January 22, 2026"
  time: string          // "2:00 PM - 2:45 PM"
  location: string      // "Kawai Booth - Main Stage"
  description?: string
  genre?: string
}
```

**Default Data:** 8 performance events across 3 days

**Usage:**
```tsx
import PerformanceSchedule from '@/components/namm/artists/PerformanceSchedule'

<PerformanceSchedule />
```

**Visual Layout:**
```
┌────────────────────────────────────────────┐
│     📅 3-Day Event Schedule                │
│      Performance Schedule                  │
│                                            │
│  ┌──┐  📅 Day 1 - January 22, 2026        │
│  │22│     3 performances                  │
│  └──┘                                      │
│       ┌──────────────────────────────┐    │
│       │ 🕐 10:00 AM                  │    │
│       │ Classical Masterworks         │    │
│       │ Sarah Chen                    │    │
│       │ 📍 Kawai Booth - Main Stage  │    │
│       └──────────────────────────────┘    │
│       [More events...]                     │
│                                            │
│  ┌──┐  📅 Day 2 - January 23, 2026        │
│  │23│     3 performances                  │
│  └──┘                                      │
│       [Events for Day 2...]                │
│                                            │
│  ⚠️ Note: Times subject to change         │
│                                            │
└────────────────────────────────────────────┘
```

**Features:**
- Automatic date grouping
- Event count per day
- Visual day badges with gradient
- Responsive timeline layout

---

## 4. ArtistProfiles

**Purpose:** Detailed artist biographies with comprehensive information

**Design Elements:**
- Alternating left/right image layouts
- Large artist photos (3:4 or square aspect ratio)
- Achievement lists with bullet points
- Preferred instruments showcase
- Years active indicator
- External website links

**Props:**
```typescript
interface ArtistProfilesProps {
  profiles?: ArtistProfile[]
  className?: string
}

interface ArtistProfile {
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

**Default Data:** 3 detailed artist profiles

**Usage:**
```tsx
import ArtistProfiles from '@/components/namm/artists/ArtistProfiles'

<ArtistProfiles />
```

**Visual Layout:**
```
┌───────────────────────────────────────────┐
│       🎵 In-Depth Profiles                │
│      Get to Know Our Artists              │
│                                           │
│  ┌─────────┬──────────────────────┐      │
│  │ [Photo] │ Name                 │      │
│  │         │ Title                │      │
│  │         │ 📅 Years Active      │      │
│  │         │                      │      │
│  │         │ Full biography...    │      │
│  │         │                      │      │
│  │         │ 🏆 Achievements:     │      │
│  │         │ • Award 1            │      │
│  │         │ • Award 2            │      │
│  │         │                      │      │
│  │         │ 🎹 Instruments:      │      │
│  │         │ [Shigeru SK-EX]      │      │
│  │         │                      │      │
│  │         │ [Visit Website →]    │      │
│  └─────────┴──────────────────────┘      │
│                                           │
│  [Next profile with image on right...]   │
│                                           │
└───────────────────────────────────────────┘
```

**Layout Pattern:**
- Profile 1: Image left, content right
- Profile 2: Image right, content left
- Profile 3: Image left, content right
- Alternates automatically using index

---

## 5. ArtistsCTA

**Purpose:** Call-to-action section with event information and navigation

**Design Elements:**
- Gradient background (zinc-950 → black)
- Large heading with description
- Two primary action buttons
- Three information cards (dates, location, registration)
- External NAMM registration link

**Props:**
```typescript
interface ArtistsCTAProps {
  className?: string
}
```

**Usage:**
```tsx
import ArtistsCTA from '@/components/namm/artists/ArtistsCTA'

<ArtistsCTA />
```

**Visual Layout:**
```
┌───────────────────────────────────────────┐
│                                           │
│  Ready to Experience These Artists Live?  │
│                                           │
│  Join us at NAMM 2026 for exclusive...   │
│                                           │
│  [← Back to NAMM 2026] [📅 Plan Visit]   │
│                                           │
│  ┌──────────┬──────────┬──────────┐      │
│  │ 📅 Dates │ 📍Location│🔗Register│      │
│  │ Jan22-24 │ Anaheim  │ NAMM.org │      │
│  │ 10-6PM   │ Conv Ctr │ [Link]   │      │
│  └──────────┴──────────┴──────────┘      │
│                                           │
│  ⚠️ All performances subject to change    │
│                                           │
└───────────────────────────────────────────┘
```

**Action Buttons:**
1. **Back to NAMM 2026** - Returns to `/namm-2026`
2. **Plan Your Visit** - Scrolls to `#plan-your-visit` on main page

---

## Shared Design Patterns

### Color System
```typescript
// Backgrounds
bg-black                      // #000000
bg-zinc-900                   // Very dark gray
bg-zinc-950                   // Darker than black

// Accents
from-[#E31937] to-[#FF3B55]  // Kawai Red gradient
text-[#E31937]                // Kawai Red text

// Borders
border-white/5                // 5% white
border-white/10               // 10% white
border-[#E31937]/50          // 50% red

// Text
text-white                    // 100% white
text-white/80                 // 80% opacity
text-white/70                 // 70% opacity
text-white/60                 // 60% opacity
text-white/50                 // 50% opacity
```

### Spacing & Sizing
```typescript
// Section padding
py-24                         // 6rem vertical padding

// Container
container mx-auto px-6        // Centered with horizontal padding
max-w-5xl / max-w-6xl / max-w-7xl  // Max width constraints

// Gaps
gap-4 / gap-6 / gap-8        // Consistent spacing
```

### Animations
```typescript
// Transitions
transition-all duration-300   // Fast transitions
transition-all duration-500   // Medium transitions

// Hover effects
hover:scale-105              // Slight scale up
hover:border-[#E31937]/50    // Border color change
group-hover:opacity-100       // Reveal on group hover
```

### Typography
```typescript
// Headings
text-4xl md:text-5xl         // Responsive heading sizes
font-bold                     // Bold weight

// Body
text-base text-white/70      // Body text with opacity
leading-relaxed              // Comfortable line height

// Labels
text-xs uppercase tracking-wide  // Small labels
```

---

## Import Patterns

### Individual Imports
```tsx
import ArtistHero from '@/components/namm/artists/ArtistHero'
import FeaturedArtistsGrid from '@/components/namm/artists/FeaturedArtistsGrid'
import PerformanceSchedule from '@/components/namm/artists/PerformanceSchedule'
import ArtistProfiles from '@/components/namm/artists/ArtistProfiles'
import ArtistsCTA from '@/components/namm/artists/ArtistsCTA'
```

### Barrel Import (via index.ts)
```tsx
import {
  ArtistHero,
  FeaturedArtistsGrid,
  PerformanceSchedule,
  ArtistProfiles,
  ArtistsCTA,
  // Types
  type FeaturedArtist,
  type PerformanceEvent,
  type ArtistProfile
} from '@/components/namm/artists'
```

---

## Customization Guide

### Replacing Placeholder Data

1. **Update in Component File:**
```tsx
// FeaturedArtistsGrid.tsx (line 21)
const DEFAULT_ARTISTS: FeaturedArtist[] = [
  // Your artist data here
]
```

2. **Pass Custom Data:**
```tsx
<FeaturedArtistsGrid artists={customArtists} />
```

3. **Connect to CMS:**
```tsx
// Fetch from Payload CMS
const payload = await getPayload()
const artists = await payload.find({ collection: 'artists' })

<FeaturedArtistsGrid artists={artists.docs} />
```

### Changing Colors

Find and replace color classes:
- `from-[#E31937] to-[#FF3B55]` → Your gradient
- `text-[#E31937]` → Your accent color
- `border-[#E31937]/50` → Your border color

### Adjusting Layouts

Grid configurations:
```tsx
// Change from 3-column to 4-column
className="grid md:grid-cols-2 lg:grid-cols-3"
// To:
className="grid md:grid-cols-2 lg:grid-cols-4"
```

---

## Accessibility Checklist

✅ Semantic HTML (`<section>`, `<nav>`, `<article>`)
✅ Proper heading hierarchy (h1 → h2 → h3)
✅ Alt text for all images
✅ Focus states for interactive elements
✅ Color contrast (WCAG AA compliant)
✅ Keyboard navigation support
✅ Screen reader friendly

---

## Performance Tips

1. **Images:**
   - Use Next.js Image component
   - Provide proper `sizes` prop
   - Use WebP/AVIF formats

2. **Loading:**
   - Lazy load with Suspense
   - Show loading skeletons
   - Dynamic imports for heavy components

3. **Caching:**
   - ISR with 24-hour revalidation
   - Static generation where possible

---

**Created:** 2025-12-04
**Version:** 1.0.0
**Maintained by:** KAWAI Development Team
