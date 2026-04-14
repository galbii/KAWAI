# Bottom Left Popup Block

## Overview

The **Bottom Left Popup Block** is a sophisticated notification component inspired by Japanese minimalist design principles. It combines refined glassmorphism with elegant animations to create gentle, non-intrusive announcements.

## Design Philosophy

**Concept**: "Quiet Announcement" - Inspired by Japanese 行灯 (andon) paper lanterns and the principle of 間 (ma - meaningful space).

**Visual Language**:
- **Wabi-sabi refinement**: Imperfect perfection through subtle grain textures
- **Controlled glassmorphism**: Frosted layers with depth and inner glow
- **Haptic motion**: Physics-based spring animations that feel tangible
- **Typographic hierarchy**: Noto Serif JP paired with refined sans-serif

## Features

### Responsive Design
- **Desktop**: Bottom-corner notification (left or right)
- **Mobile**: Centered dialog with backdrop overlay for better UX
- **Adaptive Sizing**: Responsive widths on mobile, fixed widths on desktop
- **Smart Animations**: Scale/fade on mobile, position-aware animations on desktop

### Content Customization
- **Icon/Image**: Optional 48x48px - 64x64px icon or brand mark
- **Title**: Concise headline with Noto Serif JP typography
- **Message**: Supporting text with comfortable line height
- **CTA Button**: Optional call-to-action with customizable link and text

### Visual Themes
1. **Light (Frosted Pearl)**: White glassmorphism with subtle shadows
2. **Dark (Charcoal Glass)**: Dark mode with high contrast
3. **Red Accent**: Kawai brand red gradient background
4. **Gold Accent**: Luxury gold gradient for premium announcements

### Positioning & Sizing
- **Position**: Bottom-left or bottom-right corner
- **Sizes**:
  - Compact: 280px width
  - Medium: 360px width (default)
  - Large: 420px width

### Animation Styles
1. **Slide**: Smooth slide-in from side (default)
2. **Fade**: Subtle opacity transition
3. **Bounce**: Playful spring physics (`cubic-bezier(0.68, -0.55, 0.265, 1.55)`)
4. **Scale**: Elegant scale-in effect

### Behavior Options
- **Auto-show delay**: 0-30 seconds (configurable)
- **Auto-dismiss delay**: 0-60 seconds (0 = manual dismiss only)
- **Show once per session**: Uses `sessionStorage` to prevent repeat views
- **Dismissible**: Users can close via X button or Escape key
- **Custom storage key**: Track multiple popup campaigns independently
- **Z-index control**: Customize stacking order (default: 9000)

### Accessibility
- Full keyboard support (Escape to dismiss)
- ARIA labels and live regions
- Focus management for screen readers
- Reduced motion support
- Mobile backdrop dismissal (tap outside to close)
- Touch-friendly larger tap targets on mobile

## Usage Examples

### Basic Announcement

```typescript
{
  blockType: 'layout-bottom-left-popup',
  enabled: true,
  title: 'New Collection Available',
  message: 'Explore our latest innovations in digital piano technology.',
  ctaText: 'Learn More',
  ctaLink: '/pianos/digital',
  theme: 'light',
  position: 'bottom-left',
  size: 'medium',
  autoShowDelay: 3000,
  showOncePerSession: true,
}
```

### Promotional Campaign

```typescript
{
  blockType: 'layout-bottom-left-popup',
  enabled: true,
  icon: { /* media object */ },
  title: 'Holiday Sale - 20% Off',
  message: 'Limited time offer on select Kawai piano models. Visit our showroom this weekend.',
  ctaText: 'Shop Now',
  ctaLink: '/pianos',
  ctaOpenInNewTab: false,
  theme: 'red',
  position: 'bottom-right',
  size: 'large',
  autoShowDelay: 5000,
  autoDismissDelay: 15000,
  animationStyle: 'bounce',
  showOncePerSession: true,
  customStorageKey: 'holiday-sale-2026',
}
```

### Newsletter Signup

```typescript
{
  blockType: 'layout-bottom-left-popup',
  enabled: true,
  title: 'Stay In Touch',
  message: 'Get exclusive updates on new products, artist events, and piano care tips.',
  ctaText: 'Subscribe',
  ctaLink: '/newsletter',
  theme: 'gold',
  position: 'bottom-left',
  size: 'medium',
  autoShowDelay: 10000,
  animationStyle: 'scale',
  showOncePerSession: true,
  dismissible: true,
}
```

## Implementation Details

### File Structure

```
src/
├── blocks/layout/
│   ├── BottomLeftPopup.ts              # Payload CMS block definition
│   └── index.ts                         # Barrel export
├── components/blocks/
│   ├── BottomLeftPopupBlock.tsx         # React client component
│   └── layout/
│       └── LayoutBottomLeftPopupRenderer.tsx  # Renderer wrapper
└── payload.config.ts                    # Global block registration
```

### Block Definition (`BottomLeftPopup.ts`)

The block is defined with comprehensive field validation and admin UI configuration:

- **Content fields**: icon, title, message, CTA
- **Appearance fields**: theme, position, size
- **Behavior fields**: timing, session persistence, animation style
- **Advanced fields**: custom storage key, z-index

All fields include:
- Clear admin descriptions
- Appropriate default values
- Conditional visibility logic
- Validation constraints

### React Component (`BottomLeftPopupBlock.tsx`)

**Client Component** (`'use client'`) with sophisticated state management:

#### State Machine
```typescript
type PopupState = 'hidden' | 'entering' | 'visible' | 'exiting' | 'dismissed'
```

1. **hidden**: Initial state, opacity 0, off-screen transform
2. **entering**: Transitioning in, animation begins
3. **visible**: Fully displayed, interactive
4. **exiting**: Transitioning out, fade/slide away
5. **dismissed**: Removed from DOM, marked in storage

#### Key Features

**Session Persistence**:
```typescript
sessionStorage.setItem(storageKey, 'true')
```

**Keyboard Support**:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && state === 'visible') {
      handleDismiss()
    }
  }
  // ...
}, [state, handleDismiss])
```

**Auto-dismiss Timer**:
```typescript
if (state === 'visible' && autoDismissDelay && autoDismissDelay > 0) {
  const dismissTimer = setTimeout(() => {
    handleDismiss()
  }, autoDismissDelay)
  // ...
}
```

**Progress Bar Animation**:
CSS keyframe animation synchronized with auto-dismiss timer:
```css
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
```

#### Visual Refinements

**Grain Texture**:
SVG noise filter with subtle animation for wabi-sabi aesthetic:
```typescript
.grain-texture::before {
  background-image: url("data:image/svg+xml,...");
  animation: grain 8s steps(10) infinite;
  opacity: 0.35;
}
```

**Inner Glow**:
```typescript
<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
```

**Glassmorphism**:
```typescript
backdrop-blur-xl
bg-white/80
border-neutral-200/40
shadow-xl shadow-neutral-900/10
```

## Best Practices

### Content Guidelines

**DO**:
- ✅ Keep titles under 40 characters
- ✅ Keep messages under 120 characters
- ✅ Use clear, action-oriented CTAs
- ✅ Test with different screen sizes
- ✅ Provide meaningful icons

**DON'T**:
- ❌ Overuse auto-dismiss (give users time to read)
- ❌ Use aggressive colors for every popup
- ❌ Stack multiple popups on the same page
- ❌ Show popups immediately on page load (use delay)
- ❌ Skip the `showOncePerSession` option (avoid annoying users)

### Timing Recommendations

| Use Case | Auto-show Delay | Auto-dismiss Delay |
|----------|----------------|-------------------|
| **Important Announcement** | 2-3 seconds | 0 (manual dismiss) |
| **Promotional Offer** | 5-8 seconds | 12-15 seconds |
| **Newsletter Signup** | 10-15 seconds | 0 (manual dismiss) |
| **Quick Tip** | 3-5 seconds | 8-10 seconds |
| **Exit Intent** | 0 seconds | 20-30 seconds |

### Theme Selection

| Theme | Best For | Visibility | Brand Alignment |
|-------|----------|-----------|-----------------|
| **Light** | General announcements, daytime users | Medium | Neutral |
| **Dark** | Night mode, dark page backgrounds | High | Modern |
| **Red** | Sales, urgent announcements, CTAs | Very High | Kawai brand |
| **Gold** | Premium products, luxury events | High | Premium positioning |

### Animation Selection

| Style | Feel | Use Case | Performance |
|-------|------|----------|-------------|
| **Slide** | Professional, smooth | Default, most use cases | Excellent |
| **Fade** | Subtle, elegant | Minimalist pages | Excellent |
| **Bounce** | Playful, attention-grabbing | Sales, events | Good |
| **Scale** | Refined, sophisticated | Premium announcements | Excellent |

## Technical Specifications

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS backdrop-filter support (96%+ global coverage)
- Graceful degradation: fallback to solid backgrounds

### Performance
- Client-side only (uses browser APIs)
- Lightweight: ~8KB gzipped (includes animations)
- No external dependencies (uses Lucide React for icons)
- CSS animations (GPU-accelerated)

### Dependencies
```json
{
  "lucide-react": "^0.x.x",
  "next/image": "15.x.x"
}
```

### TypeScript Types
Auto-generated from Payload CMS schema:
```typescript
interface LayoutBottomLeftPopupBlock {
  enabled?: boolean | null
  icon?: string | Media | null
  title?: string | null
  message?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  ctaOpenInNewTab?: boolean | null
  theme?: 'light' | 'dark' | 'red' | 'gold' | null
  position?: 'bottom-left' | 'bottom-right' | null
  size?: 'compact' | 'medium' | 'large' | null
  autoShowDelay?: number | null
  autoDismissDelay?: number | null
  showOncePerSession?: boolean | null
  dismissible?: boolean | null
  animationStyle?: 'slide' | 'fade' | 'bounce' | 'scale' | null
  customStorageKey?: string | null
  zIndex?: number | null
}
```

## Testing Checklist

- [ ] Popup appears after configured delay
- [ ] Auto-dismiss works (if configured)
- [ ] Session persistence prevents re-showing
- [ ] Escape key dismisses popup
- [ ] Close button works
- [ ] CTA link navigates correctly
- [ ] Responsive on mobile (320px+)
- [ ] Readable on all theme backgrounds
- [ ] Animation smooth (60fps)
- [ ] No layout shift on appearance
- [ ] Progress bar syncs with auto-dismiss
- [ ] Icon displays correctly
- [ ] Multiple popups have unique storage keys

## Accessibility Notes

The block follows WCAG 2.1 AA guidelines:

- **ARIA Labels**: `role="dialog"`, `aria-labelledby`, `aria-describedby`, `aria-live="polite"`
- **Keyboard Navigation**: Escape key support, focusable elements
- **Color Contrast**: All themes meet 4.5:1 minimum ratio
- **Motion Sensitivity**: Respects `prefers-reduced-motion` media query
- **Screen Readers**: Announces popup appearance via `aria-live`

## Future Enhancements

Potential improvements for future versions:

- [ ] Multiple CTA buttons (primary + secondary)
- [ ] Form integration (email capture within popup)
- [ ] Image background support
- [ ] Countdown timer display
- [ ] A/B testing integration
- [ ] Analytics event tracking
- [ ] Custom animation curves editor
- [ ] Voice-over preview mode

## Support

For issues or questions:
- **Documentation**: `/docs/BLOCKS.md`
- **GitHub**: Create an issue with `[BottomLeftPopup]` prefix
- **Examples**: Check `/src/app/(frontend)/*/page.tsx` for live usage

---

**Version**: 1.0.0
**Last Updated**: 2026-01-30
**Author**: KAWAI Development Team
