# Artist Carousel - Enhanced Design & Recent Work Feature

## 🎨 Design Enhancements

### New Japanese-Inspired Heading Design

The Artist Carousel now features a **refined, premium heading section** inspired by Japanese minimalist aesthetics:

#### Visual Elements

1. **Elegant Typography**
   - **Heading Font**: Cormorant Garamond (300 weight) - refined serif with subtle elegance
   - **Subheading Font**: Noto Sans (300 weight) - clean, modern sans-serif
   - Fluid sizing: `clamp(2rem, 5vw, 3.5rem)` for responsive scaling
   - Refined letter-spacing for sophistication

2. **Decorative Ornaments**
   - **Top ornament**: Circular mon-inspired design with animated lines
   - **Bottom ornament**: Refined underline with gradient and center accent dot
   - Subtle glow effect on the accent dot
   - Gold (#D4AF37) accents for luxury feel

3. **Smooth Animations**
   - Staggered entrance animations (heading → subheading → ornaments)
   - Circular pattern reveal with scale and opacity
   - Line growth animations from center outward
   - SVG path animations for the mon circle
   - All using cubic-bezier easing for natural motion

4. **Atmospheric Background**
   - Subtle radial gradient circle (3% opacity)
   - Adapts to theme (light/dark)
   - Creates depth without overwhelming

5. **Gradient Text Effect**
   - Gradient from current color to 80% opacity
   - Subtle background blur accent (8% opacity)
   - Creates dimensional text without being heavy-handed

### Design Philosophy

**Wabi-Sabi Minimalism**:
- Embraces imperfection and subtlety
- Generous negative space (ma - 間)
- Refined details that reward close attention
- Premium without being ostentatious

**Key Characteristics**:
- ✨ Elegant, not flashy
- 🎯 Purposeful, not cluttered
- 🌸 Subtle, not loud
- 💎 Refined, not generic

## 🎹 New Feature: Recent Work

### Overview

Artists can now showcase their **recent performances, recordings, and collaborations** with KAWAI pianos. This creates a subtle but effective CTA that highlights real-world usage and builds credibility.

### Artist Collection Updates

Added `recentWork` array field to Artists collection:

```typescript
{
  name: 'recentWork',
  type: 'array',
  maxRows: 5,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      // e.g., "Carnegie Hall Performance with KAWAI SK-EX"
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      // Brief description of the work
    },
    {
      name: 'date',
      type: 'date',
      // Performance/recording date
    },
    {
      name: 'type',
      type: 'select',
      options: [
        'performance',
        'recording',
        'album',
        'collaboration',
        'masterclass',
        'concert',
        'other'
      ],
    },
    {
      name: 'link',
      type: 'text',
      // Optional YouTube video, article, or recording link
    },
    {
      name: 'featured',
      type: 'checkbox',
      // Feature this work prominently
    }
  ]
}
```

### Carousel Display Options

**Block Configuration**:
- `showRecentWork`: Enable/disable recent work section (default: true)
- `maxRecentWorkItems`: Number of items to display (1-3, default: 2)

**Visual Design**:
- Subtle section below main artist info
- Separated by refined border-top
- "Recent Work" label in small caps
- Cards with gradient backgrounds
- Work type icons (🎹 performance, 🎙️ recording, etc.)
- Hover effects for linked items
- Date display (e.g., "Nov 2025")

### Recent Work Card Variants

**With Link** (Clickable):
- Gradient background: charcoal/5 → red/5
- Hover state: red/10 → red/5
- Border with hover animation
- "View Work →" CTA appears on hover
- Smooth transitions

**Without Link** (Display Only):
- Solid background: charcoal/5
- Static border
- No hover effects
- Clean information display

### Work Type Icons

Each work type has a distinctive emoji icon:
- 🎹 Performance
- 🎙️ Recording
- 💿 Album
- 🤝 Collaboration
- 🎓 Masterclass
- 🎵 Concert
- ✨ Other

### Benefits

1. **Social Proof**: Shows real artists using KAWAI pianos
2. **Credibility**: Links to performances/recordings provide verification
3. **Engagement**: Clickable links drive traffic to videos/articles
4. **Storytelling**: Creates narrative around artist's KAWAI journey
5. **Subtle CTA**: Drives action without being pushy

## 📁 Files Modified

### Collections
- `src/collections/Artists.ts` - Added `recentWork` field

### Blocks
- `src/blocks/marketing/ArtistCarousel.ts` - Added `showRecentWork` and `maxRecentWorkItems` options

### Components
- `src/components/blocks/marketing/ArtistCarouselRenderer.tsx`:
  - Complete heading redesign
  - Recent work section implementation
  - Work type icons mapping
  - Enhanced animations

### Typography
- `src/app/layout.tsx`:
  - Added Cormorant Garamond font
  - Added Noto Sans font
  - Registered CSS variables

- `src/app/globals.css`:
  - Added `--font-family-cormorant` variable
  - Added `--font-family-noto` variable

## 🎯 Usage Examples

### Adding Recent Work in CMS

1. Go to **Artists** collection
2. Select an artist
3. Navigate to **Media** tab
4. Add items to **Recent Work**:

```
Title: "Carnegie Hall Solo Recital"
Description: "A breathtaking performance of Rachmaninoff's Piano Concerto No. 2 on the KAWAI SK-EX"
Date: November 15, 2025
Type: Performance
Link: https://www.youtube.com/watch?v=...
Featured: ✓
```

### Configuring the Carousel

In Payload CMS, when adding Artist Carousel block:

```
Heading: "Featured KAWAI Artists"
Subheading: "Discover the world-class performers who choose KAWAI"

Artists: [Select 3-5 artists]
Display Mode: Card
Show Bio: Short
Show Social Links: ✓
Show Genre: ✓
Show Recent Work: ✓
Max Recent Work Items: 2

Settings:
  Auto Play: ✓
  Auto Play Duration: 8000ms
  Enable Loop: ✓
  Show Navigation Arrows: ✓

Styling:
  Theme: Light
  Layout: Centered
  Spacing: Comfortable
```

## 🎨 Design Tokens

### Colors Used
- `#C41E3A` - KAWAI Red (accents, CTAs)
- `#D4AF37` - KAWAI Gold (ornamental details)
- `#2C2C2C` - KAWAI Charcoal (text, dark theme)
- `#F8F8F8` - KAWAI Pearl (backgrounds, light theme)

### Fonts Used
- **Cormorant Garamond** - Heading (--font-cormorant)
  - Weight: 300 (Light)
  - Character: Elegant, refined, classical

- **Noto Sans** - Subheading (--font-noto)
  - Weight: 300 (Light)
  - Character: Clean, modern, neutral

### Spacing
- Section margin: `mb-16 sm:mb-20 lg:mb-24`
- Top ornament margin: `mb-8`
- Heading margin: `mb-6`
- Bottom ornament margin: `mt-8`
- Recent work border-top margin: `pt-6 mt-6`

### Animations
- **Durations**: 0.6s - 1.5s depending on element
- **Delays**: Staggered 0.1s - 0.9s for sequential reveals
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` - smooth, natural
- **Special**: Spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)` for accent dot

## 🚀 Next Steps

### Content Strategy

1. **Populate Recent Work**
   - Add 2-3 recent works per artist
   - Prioritize works with video/audio links
   - Feature the most impressive performances
   - Keep descriptions concise and compelling

2. **Media Assets**
   - Link to YouTube performances
   - Link to Spotify/Apple Music albums
   - Link to press articles about performances
   - Ensure all links are working and relevant

3. **Featured Artists**
   - Highlight 3-5 top artists on homepage
   - Rotate monthly or quarterly
   - Balance different genres and instrument types
   - Feature both established and emerging artists

### Technical Enhancements

**Future Ideas**:
- [ ] Add video preview hover for linked work
- [ ] Display achievement badges on work cards
- [ ] Filter carousel by work type
- [ ] Add "More Work" link to full artist profile
- [ ] Aggregate recent work across all artists for a "Latest Performances" feed

### Performance Optimization

- Fonts are loaded via Next.js font optimization
- CSS variables prevent repeated font-family declarations
- Animations use CSS transforms (GPU-accelerated)
- Recent work items are limited to 2-3 per artist
- Framer Motion handles animation orchestration efficiently

## 📊 Analytics Tracking

Consider tracking:
- Recent work click-through rate
- Which work types get most engagement
- Artist profile visits from carousel
- Time spent viewing carousel vs static content

## ✅ Validation

- ✅ TypeScript compilation successful
- ✅ Types generated for `recentWork` field
- ✅ Types generated for `showRecentWork` and `maxRecentWorkItems`
- ✅ Fonts loaded via Next.js optimization
- ✅ CSS variables registered
- ✅ Animation performance verified
- ✅ Responsive design tested (mobile, tablet, desktop)

## 🎭 Design Inspiration

The heading design draws from:
- **Japanese mon (家紋)** - Family crest circular patterns
- **Shoji screens** - Clean lines and negative space
- **Wabi-sabi** - Beauty in imperfection and subtlety
- **Ma (間)** - Concept of negative space and pause
- **Kintsugi** - Highlighting value through refined details

This creates a distinctive, memorable design that feels both modern and timeless - perfectly aligned with KAWAI's brand of craftsmanship and excellence.
