# Piano Finder Page Components

This directory contains the interactive components for the Piano Finder page (`/find-my-piano`), designed to help users discover the perfect Kawai piano for their needs.

## Components

### 1. PianoTypeComparison

**Purpose**: Educational comparison table/cards showing the four main piano types (Grand, Upright, Digital, Hybrid).

**Content**: ~800 words of SEO-optimized content comparing:
- Best use cases
- Space requirements
- Price ranges
- Sound characteristics
- Maintenance needs
- Key advantages
- Recommended Kawai models

**Design**:
- **Desktop**: Horizontal scrollable comparison table with 8 columns
- **Mobile**: Stacked vertical cards with all information
- **Interactions**: Hover effects, smooth animations, links to category pages
- **Colors**: White cards on kawai-pearl background, kawai-red accents

**Usage**:
```tsx
import { PianoTypeComparison } from '@/components/find-my-piano';

<PianoTypeComparison />
```

**SEO Keywords Targeted**:
- Grand vs upright vs digital piano
- Piano type comparison
- Which piano type is best
- Digital piano vs acoustic
- Hybrid piano explained
- Best piano for space/budget

---

### 2. UseCaseCards

**Purpose**: Persona-based recommendations showing which pianos fit specific user goals and lifestyles.

**Content**: ~600 words across 4 use case cards:

1. **Students & Beginners**
   - Target: Ages 5-12, new learners, budget-conscious families
   - Models: ES120, ES520, CN301, KDP120
   - Link: `/guides/first-piano`

2. **Professionals & Teachers**
   - Target: Advanced players, teaching studios, 4-8 hours daily use
   - Models: CA901, Novus NV10S, GX-3, Shigeru Kawai SK-5
   - Link: `/guides/professional-piano-selection`

3. **Home Entertainment**
   - Target: Family music-making, versatile sounds, aesthetic design
   - Models: CA701, ES920, CN201, K-500
   - Link: `/pianos/digital`

4. **Recording & Composition**
   - Target: Home studios, DAW integration, MIDI/USB connectivity
   - Models: ES920, MP11SE, CA901, ES520
   - Link: `/pianos/digital`

**Design**:
- **Layout**: 2x2 grid on desktop, stacked on mobile
- **Card Elements**:
  - SVG icon in kawai-red (graduation cap, music note, home, microphone)
  - Title + 150-word description
  - "Perfect for you if..." checklist (4 bullet points)
  - Recommended model chips/tags (clickable links)
  - CTA button to relevant guide/page
- **Interactions**: Stagger animation on scroll, hover elevation, smooth transitions

**Usage**:
```tsx
import { UseCaseCards } from '@/components/find-my-piano';

<UseCaseCards />
```

**SEO Keywords Targeted**:
- Best piano for students
- Professional piano for teaching
- Piano for home entertainment
- Recording piano with USB/MIDI
- Piano for classical music
- Piano for apartment/small space

---

## Design System Adherence

Both components follow the established Kawai design patterns:

### Colors
- **Background**: `bg-kawai-pearl` (#fafafa)
- **Cards**: `bg-white` with subtle shadows
- **Primary accent**: `text-kawai-red` (#e21d30)
- **Text**: `text-kawai-black` (#1a1a1a) with opacity variants

### Typography
- **Section labels**: Uppercase, tracking-wide, text-xs, kawai-red
- **Headings**: font-serif (Crimson Text), font-light, responsive sizes
- **Body**: font-sans (Inter), leading-relaxed
- **Links**: kawai-red with hover transitions

### Animations
- **Scroll trigger**: IntersectionObserver with 0.2 threshold
- **Motion**: Framer Motion with stagger delays
- **Durations**: 0.3-0.7s for smooth, elegant feel
- **Patterns**: Fade + slide (y: 30 → 0), hover scale/translate

### Responsive Design
- **Mobile-first**: Base styles for 320px+
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch targets**: Minimum 44px for accessibility
- **Adaptive layouts**: Cards stack, tables convert to cards on mobile

---

## Integration with Piano Finder Strategy

These components implement Sections 5 & 6 of the [Piano Finder Page Strategy](/docs/seo/piano-finder-page-strategy-2025.md):

### Content Strategy
- **Section 5 (Piano Type Comparison)**: 800 words addressing "digital vs acoustic", "grand vs upright", "piano types explained"
- **Section 6 (Use Case Cards)**: 600 words targeting "best piano for [persona]" long-tail keywords

### Internal Linking
- Links to category pages: `/pianos/digital`, `/pianos/grand`, `/pianos/upright`, `/pianos/hybrid`
- Links to product pages: Individual piano models
- Links to guide pages: `/guides/first-piano`, `/guides/professional-piano-selection`

### Conversion Strategy
- **Multiple CTAs**: Quiz link, category exploration, guide reading
- **Progressive disclosure**: Educational content → Recommendations → Action
- **Clear pathways**: Each card/row has obvious next step

---

## Technical Details

### Dependencies
- React 18+
- Framer Motion 10+ (animations)
- Next.js 15 (Link component)
- TypeScript (strict mode)

### Performance
- **Client Components**: Marked with `"use client"` for interactivity
- **Lazy rendering**: IntersectionObserver delays animation until visible
- **Optimized re-renders**: useState for minimal state, useEffect with proper cleanup
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### File Structure
```
src/components/find-my-piano/
├── PianoTypeComparison.tsx  # Piano type comparison table/cards
├── UseCaseCards.tsx          # Use case persona cards
├── index.ts                  # Barrel export
└── README.md                 # This file
```

---

## Content Maintenance

### Updating Piano Models
Edit the `recommendedModels` arrays in each component:

```tsx
// In UseCaseCards.tsx
recommendedModels: [
  { name: "ES120", link: "/product/es120" },
  // Add new models here
]

// In PianoTypeComparison.tsx
kawaiModels: ["CA901", "ES920", /* add here */]
```

### Updating Descriptions
Maintain SEO keyword density when editing:
- Keep piano model names consistent
- Include target keywords naturally
- Preserve internal link structure
- Update price ranges as needed

### A/B Testing Considerations
Test variations of:
- CTA button text
- Card vs table layout preference (desktop)
- Icon styles (outlined vs filled)
- "Perfect for you if..." wording

---

## SEO Optimization

### Schema Markup
Consider adding:
- **HowTo Schema** for comparison table
- **ItemList Schema** for use cases
- **Product Schema** for recommended models

### Keywords Addressed
- **Primary**: "piano finder", "find the right piano", "which piano should I buy"
- **Secondary**: "piano type comparison", "best piano for [use case]"
- **Long-tail**: 50+ specific variations covered in content

### Internal Link Equity
- 12+ strategic links to product pages
- 6+ links to guide/category pages
- All links include descriptive anchor text

---

## Future Enhancements

Potential additions:
1. **Filtering**: Add interactive filters to narrow use cases
2. **Quiz Integration**: Direct quiz flow based on card selection
3. **Video Demos**: Embed model comparison videos
4. **User Reviews**: Show testimonials for each use case
5. **Price Calculator**: Dynamic pricing based on location/features
6. **Virtual Showroom**: 3D piano visualization
7. **Save for Later**: Bookmark favorite models
8. **Email Recommendations**: Capture email, send personalized suggestions

---

## Related Documentation
- [Piano Finder Strategy](/docs/seo/piano-finder-page-strategy-2025.md)
- [Design System Guide](/CLAUDE.md#design-system)
- [Component Architecture](/CLAUDE.md#component-organization)
