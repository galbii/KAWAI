# Mobile Dealer Finder - Design Specification

## Visual Design

### Design Philosophy
**Premium Mobile-First with Musical Sophistication**

The mobile dealer finder embodies KAWAI's refined aesthetic through:
- **Clean hierarchy** - Clear visual organization without clutter
- **Musical rhythm** - Purposeful spacing that creates breathing room
- **Tactile feedback** - Every interaction feels responsive and premium
- **Effortless navigation** - One-handed operation with logical flow

### Color Palette

```
Primary Actions:    #C41E3A  (kawai-red)      - CTAs, active states, distance badges
Dark Elements:      #2C2C2C  (kawai-charcoal) - Selected states, primary text
Accent Gold:        #D4AF37  (kawai-gold)     - Featured badges, premium touches
Gray Scale:         #F9F9F9 → #2C2C2C         - Backgrounds, borders, secondary text
White:              #FFFFFF                   - Cards, sheets, clean surfaces
```

### Typography

**Font Family:** IBM Plex Sans
- Regular (400): Body text, labels
- Medium (500): Card titles, buttons
- Semibold (600): Section headers, emphasized text
- Bold (700): Primary headings, strong emphasis

**Size Scale (Mobile-Optimized):**
- Text XS: 10px - Small labels, counts
- Text SM: 12px - Secondary info, descriptions
- Text Base: 14px - Body text, card content
- Text LG: 16px - Card titles, important text
- Text XL: 18px - Section headers
- Text 2XL: 20px+ - Page titles (rare on mobile)

## Layout Structure

### 1. Fixed Header (Sticky)
```
┌─────────────────────────────────────┐
│ [Search Bar with Location Icon]    │ ← 16px padding
│ [Use My Location Button]           │
│                                     │
│ [○ All][○ Acoustic][○ Pro]        │ ← Horizontal scroll
│                                     │
│ 24 dealers  [Filters ●]           │ ← Count + Filter btn
└─────────────────────────────────────┘
```

**Specifications:**
- Background: White with subtle border
- Search bar: Rounded-xl (12px radius), 2px border
- Pills: Rounded-full, 2px border, horizontal scroll
- Filters button: Active count badge overlay
- Total height: ~200px (varies with content)

### 2. Main Content Area (Scrollable)
```
┌─────────────────────────────────────┐
│                                     │
│    [Map View OR List View]         │ ← Slide transitions
│                                     │
│    Content fills remaining height  │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Map View:**
- Full-screen MapLibre GL JS map
- Custom markers for dealers
- Search radius circle (if location set)
- Interactive popups on marker click

**List View:**
- Scrollable dealer cards
- 16px padding around cards
- 12px gap between cards
- Empty state with reset button

### 3. Floating Bottom Navigation
```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │ [Map Icon] Map │ [List] List │  │ ← Rounded container
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Specifications:**
- Floating 16px from edges
- Rounded-2xl (16px radius)
- White background with shadow
- Split 50/50 buttons
- Active state: kawai-charcoal background
- Safe area inset support (iOS)

## Component Details

### Mobile Dealer Card

```
┌───────────────────────────────────────┐
│ Dealer Name                 [Featured]│ ← Bold, 16px
│ 📍 City, State                        │ ← Gray, 12px
│                                       │
│ [Piano] Acoustic  [Case] Pro         │ ← Type badges
│                                       │
│ ● 12.5 miles away                    │ ← Distance badge
└───────────────────────────────────────┘
```

**Card Specifications:**
- Rounded-2xl (16px radius)
- 20px padding
- 2px border (gray-200 default, charcoal selected)
- Active scale: 0.98 (tactile feedback)
- Shadow on selected state
- Min height: 120px
- Full width with touch target

**States:**
- Default: White background, gray border
- Selected: Charcoal border, shadow
- Active (tap): Scale down 2%

### Dealer Type Pills

```
[○ All 42] [○ Acoustic & Digital 38] [○ Professional 16]
```

**Pill Specifications:**
- Rounded-full
- 2px border
- 16px horizontal padding
- 10px vertical padding
- Icon + text + count badge
- Horizontal scroll container
- Active scale: 0.95

**States:**
- Default: White bg, gray border
- Selected: Charcoal bg, white text
- Active: Scale 0.95

### Filter Button

```
[≡ Filters ●2]
```

**Button Specifications:**
- Rounded-full
- 2px border
- Badge with active filter count
- Changes to red when filters active
- Scale feedback on tap

**States:**
- No filters: White bg, gray border
- With filters: Red bg, white text, badge

### Bottom Sheet (Selected Dealer)

```
┌─────────────────────────────────────┐
│ Dealer Name                      [×]│ ← Header
├─────────────────────────────────────┤
│ Address                             │
│ 123 Main Street                     │
│ City, ST 12345                      │
│                                     │
│ Contact                             │
│ [Call (555) 123-4567]              │ ← Red button
│ [Get Directions]                   │ ← Charcoal button
│                                     │
│ About                               │
│ Description text...                 │
└─────────────────────────────────────┘
```

**Sheet Specifications:**
- Rounded-t-3xl (24px top corners)
- Max height: 80vh
- Scrollable content
- Backdrop: Black/30% opacity
- Slide-in animation: 300ms ease-out
- Dismiss on backdrop tap or close button

## Animations & Transitions

### View Transitions (Map ↔ List)
```css
duration: 300ms
easing: ease-out
transform: translateX(-100% | 0 | 100%)
```

**Why:** GPU-accelerated, smooth on all devices

### Button Feedback
```css
duration: 200ms
easing: ease-out
transform: scale(0.95 | 0.98)
```

**Why:** Immediate tactile response, feels premium

### Bottom Sheets
```css
duration: 300ms
easing: ease-out
transform: translateY(100% | 0)
backdrop: fade-in 200ms
```

**Why:** Natural mobile gesture feeling

### Filter Badge
```css
duration: 200ms
easing: ease-in-out
transform: scale(1 | 1.1)
color: transition 200ms
```

**Why:** Draws attention to active filters

## Touch Targets & Accessibility

### Minimum Sizes
- Buttons: 44px × 44px (Apple HIG standard)
- Cards: Full width, min 100px height
- Pills: 44px height minimum
- Navigation buttons: 50% width, 56px height

### Touch Feedback
- All tappable elements scale down slightly
- Visual state change < 100ms
- No double-tap delay (touch-action: manipulation)

### Contrast Ratios
- Body text: 4.5:1 (WCAG AA)
- Large text: 3:1 (WCAG AA)
- Icons: 3:1 minimum

### Focus States
- Keyboard navigation supported
- Visible focus rings on all interactive elements
- Tab order follows visual hierarchy

## Responsive Behavior

### Breakpoints
- Mobile: `< 1024px` (component visible)
- Desktop: `≥ 1024px` (component hidden)

### Orientation Support
- Portrait: Default optimized layout
- Landscape: Map fills more vertical space

### Safe Areas (iOS)
- Bottom navigation respects safe area insets
- Bottom sheets respect safe area insets
- No content hidden behind notch or home indicator

## Performance Considerations

### Animation Performance
- Use `transform` and `opacity` only
- Avoid animating `width`, `height`, `top`, `left`
- Enable GPU acceleration with `translateZ(0)` where needed

### Scroll Performance
- Virtual scrolling for 100+ dealers (future)
- Passive scroll listeners
- `will-change` hints for animated elements

### Touch Performance
- Debounced search input (300ms)
- Throttled scroll handlers
- Memoized filter calculations

## Dark Mode Support

Currently not implemented, but prepared for:
```css
@media (prefers-color-scheme: dark) {
  /* Invert backgrounds */
  /* Adjust text colors */
  /* Soften shadows */
}
```

## Design System Integration

### Tailwind Classes Used
```
Layout:       flex, grid, absolute, relative, fixed, inset-0
Spacing:      p-4, px-6, py-3, gap-2, space-y-3
Sizing:       w-full, h-full, min-h-screen, max-h-[80vh]
Colors:       bg-kawai-red, text-kawai-charcoal, border-gray-200
Typography:   text-sm, text-base, font-medium, font-semibold
Borders:      rounded-xl, rounded-2xl, rounded-full, border-2
Shadows:      shadow-md, shadow-lg, shadow-2xl
Transitions:  transition-all, duration-200, duration-300, ease-out
```

### Custom Utilities
```css
.scrollbar-hide        /* Hide scrollbar on horizontal scroll */
.pb-safe              /* Safe area padding for iOS */
.active:scale-95      /* Touch feedback scaling */
.animate-in           /* Slide-in animations */
.slide-in-from-bottom /* Bottom sheet animation */
```

## Figma-Like Specs

### Header Section
```
Height: ~200px (auto)
Padding: 16px
Background: #FFFFFF
Border-bottom: 1px solid #E5E5E5
```

### Search Bar
```
Height: 48px
Padding: 14px 48px 14px 48px
Border-radius: 12px
Border: 2px solid #E5E5E5
Font: 14px medium
```

### Dealer Type Pills
```
Height: 44px
Padding: 10px 16px
Border-radius: 999px (full)
Border: 2px solid #E5E5E5
Font: 14px medium
Gap: 8px (between pills)
```

### Dealer Card
```
Height: auto (min 120px)
Padding: 20px
Border-radius: 16px
Border: 2px solid #E5E5E5
Gap: 12px (internal)
Shadow (selected): 0 8px 24px rgba(0,0,0,0.12)
```

### Bottom Navigation
```
Height: 56px
Margin: 16px (from edges)
Border-radius: 16px
Background: #FFFFFF
Shadow: 0 8px 32px rgba(0,0,0,0.12)
Split: 50% / 50%
```

### Bottom Sheet
```
Max-height: 80vh
Border-radius: 24px 24px 0 0
Padding: 24px
Background: #FFFFFF
Shadow: 0 -4px 24px rgba(0,0,0,0.16)
```

## Implementation Notes

### Z-Index Hierarchy
```
1. Base content:          z-0
2. Fixed header:          z-30
3. Floating navigation:   z-40
4. Filter panel backdrop: z-50
5. Filter panel:          z-[60]
6. Dealer sheet backdrop: z-50
7. Dealer sheet:          z-[60]
```

### Animation Classes
```tsx
// Slide from bottom
className="animate-in slide-in-from-bottom duration-300"

// Fade in
className="animate-in fade-in duration-200"

// Scale feedback
className="active:scale-95 transition-transform"

// Horizontal translate
className="translate-x-0 transition-transform duration-300 ease-out"
```

### Color Usage Guide
```
Background Primary:    bg-white
Background Secondary:  bg-gray-50
Background Accent:     bg-kawai-red

Text Primary:          text-kawai-charcoal
Text Secondary:        text-gray-600
Text Inverse:          text-white

Border Default:        border-gray-200
Border Active:         border-kawai-charcoal
Border Accent:         border-kawai-red

Button Primary:        bg-kawai-red text-white
Button Secondary:      bg-kawai-charcoal text-white
Button Outline:        bg-white border-gray-200 text-gray-700
```

## User Flow Diagram

```
Landing on Mobile
    ↓
Fixed Header Appears
    ↓
User can:
    ├─→ Enter location in search
    │       ↓
    │   Autocomplete appears
    │       ↓
    │   Select location
    │       ↓
    │   Map updates with radius
    │
    ├─→ Use My Location
    │       ↓
    │   Request permission
    │       ↓
    │   Map centers on user
    │
    ├─→ Select dealer type pill
    │       ↓
    │   List filters immediately
    │       ↓
    │   Count updates
    │
    └─→ Tap More Filters
            ↓
        Bottom sheet opens
            ↓
        Select advanced filters
            ↓
        Apply filters
            ↓
        List updates with badge
```

```
Viewing Dealers
    ↓
Bottom nav shows:
    ├─→ Map View (default)
    │       ↓
    │   See all dealer markers
    │       ↓
    │   Tap marker for popup
    │
    └─→ List View
            ↓
        Scroll through cards
            ↓
        Tap card
            ↓
        Bottom sheet opens
            ↓
        Call or Get Directions
```

This design specification ensures a premium, cohesive mobile experience that matches KAWAI's sophisticated brand while prioritizing usability and performance on mobile devices.
