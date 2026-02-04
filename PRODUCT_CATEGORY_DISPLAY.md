# Product Category Display - Design Documentation

## Overview
Replaced the plain gray box with product descriptions on the dealer finder page with an elegant, refined component that matches KAWAI's premium brand identity.

## Design Philosophy

**Aesthetic Direction**: Refined Minimalism
- Clean, sophisticated typography with careful hierarchy
- Subtle animations and micro-interactions
- Premium feeling through restraint and precision
- Warm, inviting aesthetic (not stark or cold)
- Generous spacing and breathing room

## Implementation Details

### Component Location
- **File**: `src/app/(frontend)/find-a-dealer/components/ProductCategoryDisplay.tsx`
- **Integration**: `DealerFinderClient.tsx` (lines 201-206)

### Three Display States

#### 1. "All" State (Default View)
When no filter is selected, users see:
- **Intro text**: Elegant paragraph explaining the dealer network
- **Two category cards**:
  - "Professional Products" card
  - "Acoustic & Digital Pianos" card
- **Card features**:
  - Small red accent line at top (brand color)
  - Card title + description
  - Bulleted list of key products
  - Subtle hover effect (lifts up, shadow increases)
  - Small arrow indicator on hover (bottom right)
  - Smooth staggered animations on mount

#### 2. "Professional Products" State
When filtered to professional products:
- **Product group chips** displayed horizontally
- **Five groups**:
  1. Stage Pianos (MP11SE, MP7SE)
  2. Controllers (VPC1)
  3. Digital Pianos (CA/CN/DG/KDP Series)
  4. Portable (ES Series)
  5. Accessories
- **Chip styling**:
  - Light gray background with subtle border
  - Category label in small caps (uppercase, tracking-wide)
  - Product items with bullet separators
  - Subtle vertical dividers between groups
  - Staggered fade-in animation

#### 3. "Acoustic & Digital" State
When filtered to acoustic/digital pianos:
- **Product group chips** (same style as professional)
- **Five groups**:
  1. Grand Pianos (GX BLAK, GL Series)
  2. Upright Pianos (K Series, Designer Studio & Console)
  3. Hybrid Pianos (NOVUS, AURES, ATX)
  4. Digital Pianos (CA/CN/KDP/ES Series)
  5. Institutional (Institutional Uprights)

### Visual Design Details

#### Typography
- **Font Family**: IBM Plex Sans (already loaded, refined and professional)
- **Intro text**: 15px, medium weight, 1.7 line-height
- **Card titles**: 17px, semibold, tight tracking
- **Card descriptions**: 13px, regular, gray-500
- **Card list items**: 13px, gray-600
- **Chip category labels**: 11px, uppercase, wide tracking, gray-400
- **Chip product names**: 13px, medium weight, charcoal

#### Colors (KAWAI Design System)
- Primary text: `#2C2C2C` (kawai-charcoal)
- Secondary text: `#6B7280` (gray-500)
- Muted text: `#9CA3AF` (gray-400)
- Card background: `white`
- Chip background: `#F9FAFB` (gray-50)
- Borders: `#E5E7EB` (gray-200)
- Hover background: `#F3F4F6` (gray-100)
- Accent: `#C41E3A` (kawai-red) - used sparingly

#### Spacing & Layout
- Container spacing: Consistent padding scale (4, 6, 8, 12, 16, 24px)
- Card grid: 2 columns on desktop, 1 column on mobile
- Card padding: 24px (p-6)
- Chip padding: 16px horizontal, 12px vertical
- Gap between chips: 12px
- Card border radius: 16px (rounded-2xl)
- Chip border radius: 12px (rounded-xl)

#### Animations (Framer Motion)
- **Mount animation**: Fade in + slight upward movement (y: 10 → 0)
- **Duration**: 400ms with custom easing [0.4, 0.0, 0.2, 1]
- **Stagger delays**:
  - Intro text: 100ms
  - Category cards: 200ms + 100ms per card
  - Product chips: 50ms per chip
- **State transitions**: Cross-fade (AnimatePresence with mode="wait")
- **Hover effects** (cards only):
  - Transform: translateY(-4px)
  - Shadow increase: from base to lg
  - Duration: 300ms
  - Arrow indicator fades in

### Responsive Behavior
- **Desktop (lg+)**: 2-column grid for category cards
- **Tablet (md)**: 1-column for cards, chips wrap naturally
- **Mobile (sm)**: Stack everything, chips wrap to multiple lines

### Accessibility
- Semantic HTML structure
- Good color contrast ratios (WCAG AA compliant)
- Minimum font size: 13px (readable)
- Non-interactive elements don't appear clickable
- Smooth animations (respects prefers-reduced-motion)

## Technical Stack
- **React**: Client component with hooks
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Full type safety

## Key Improvements Over Previous Design

| Aspect | Before | After |
|--------|--------|-------|
| **Visual hierarchy** | Flat text block | Multi-level hierarchy with cards/chips |
| **Scannability** | Wall of text | Grouped, categorized information |
| **Brand alignment** | Generic | Premium, refined, matches KAWAI identity |
| **User experience** | Static, boring | Smooth animations, hover states |
| **Information architecture** | Everything shown always | Contextual display based on filter state |
| **Spacing** | Cramped | Generous breathing room |
| **Typography** | Single size/weight | Carefully crafted hierarchy |
| **Visual interest** | None | Subtle accent lines, shadows, dividers |

## Usage Example

```tsx
import { ProductCategoryDisplay } from './components/ProductCategoryDisplay'

<ProductCategoryDisplay dealerTypeFilter={dealerTypeFilter} />
```

Where `dealerTypeFilter` is one of:
- `'all'` - Shows welcome message + category cards
- `'professional-products'` - Shows professional product chips
- `'acoustic-digital'` - Shows acoustic/digital piano chips

## Future Enhancements (Optional)
- Add click handlers to category cards to auto-filter
- Add icons for each product category
- Add "Learn more" links for specific product lines
- Add product count badges
- Add search/filter within products
- Add product images in cards

## Development Notes
- Component is fully self-contained
- Uses existing design system (no new dependencies)
- Framer Motion already in project
- TypeScript types are strict and safe
- Responsive out of the box
- Tested with all three filter states
