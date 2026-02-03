# Image Gallery Lightbox Implementation

## Overview

Implemented a museum-quality fullscreen image gallery for the Product Hero Block that allows users to view all product images from Shopify in an elegant, immersive lightbox experience.

## Components

### 1. ImageGalleryLightbox Component
**Location**: `src/components/ui/image-gallery-lightbox.tsx`

**Features**:
- ✅ Fullscreen overlay with cinematic black backdrop + vignette effect
- ✅ Large centered image display with fade-in transitions
- ✅ Previous/Next arrow navigation with hover effects
- ✅ Keyboard support (Arrow keys for navigation, Escape to close)
- ✅ Image counter with serif numerals (e.g., "02 / 05")
- ✅ Thumbnail strip at bottom for quick navigation
- ✅ Smooth transitions between images (fade + scale effect)
- ✅ Editorial-style close button (top-left corner)
- ✅ Mobile-friendly with touch swipe support
- ✅ Loading indicators while images load
- ✅ Accessibility support (ARIA labels, keyboard navigation)

**Design Philosophy**:
- "The Atelier" concept - luxury gallery experience
- Inspired by high-end showrooms and Swiss design precision
- Floating UI elements with glassmorphism effects
- Generous negative space around images
- Subtle animations that feel premium, not gimmicky

**Props**:
```typescript
interface ImageGalleryLightboxProps {
  images: GalleryImage[]       // Array of images to display
  initialIndex?: number         // Starting image index
  isOpen: boolean              // Control visibility
  onClose: () => void          // Close callback
}

interface GalleryImage {
  url: string                  // Image URL
  alt?: string                 // Alt text
  width?: number               // Optional dimensions
  height?: number
}
```

### 2. ProductHeroBlock Integration
**Location**: `src/components/blocks/ProductHeroBlock.tsx`

**Changes Made**:
1. **Gallery Images Extraction** (after line 173):
   - Filters `product.shopifyMedia` for `mediaType === 'IMAGE'`
   - Sorts by `position` field (0 = first)
   - Maps to `GalleryImage` format with url, alt, dimensions

2. **Current Image Index Detection**:
   - Finds which image in the gallery matches the displayed hero image
   - Handles both string URLs and Media objects
   - Defaults to index 0 if not found

3. **Clickable Hero Image** (lines 511-565):
   - Added cursor pointer and group hover effects
   - Added "View Gallery (X)" overlay hint on hover
   - Added keyboard support (Enter/Space to open)
   - Added subtle zoom effect on hover (scale-105)
   - Only clickable if gallery has images

4. **Lightbox Component** (end of component):
   - Renders `ImageGalleryLightbox` with gallery images
   - Passes current image index to start at correct position
   - Controlled by `isGalleryOpen` state

## Data Flow

```
Product Document (Payload CMS)
  └─> shopifyMedia: Array<ShopifyMedia>
      └─> Filtered for mediaType === 'IMAGE'
          └─> Sorted by position
              └─> Mapped to GalleryImage[]
                  └─> Passed to ImageGalleryLightbox
```

### Shopify Media Structure
From `src/collections/Products.ts` and `src/lib/payload/fields/shopify-media-field.ts`:

```typescript
shopifyMedia: Array<{
  mediaType: 'IMAGE' | 'VIDEO' | 'MODEL_3D' | 'EXTERNAL_VIDEO'
  shopifyMediaId: string
  status: 'READY' | 'PROCESSING' | 'UPLOADED' | 'FAILED'
  position: number              // Sort order (0 = first)
  alt: string                   // Accessibility text

  // For mediaType === 'IMAGE':
  imageUrl: string              // Shopify CDN URL
  imageWidth: number            // Dimensions
  imageHeight: number
  mimeType: string              // e.g., 'image/jpeg'

  // Other fields for videos, 3D models, etc.
}>
```

## User Experience

### Desktop
1. User hovers over product hero image
2. Image scales slightly (1.05x) with smooth transition
3. "View Gallery (X)" hint appears in center
4. User clicks image
5. Lightbox opens with cinematic fade-in
6. Current image displayed fullscreen with fade + scale reveal
7. Navigation via:
   - Arrow buttons (left/right with hover glow effects)
   - Keyboard arrows
   - Thumbnail clicks
8. Close via:
   - X button (top-left)
   - Escape key
   - Backdrop click

### Mobile
1. User taps product hero image
2. Lightbox opens fullscreen
3. Swipe left/right to navigate
4. Tap thumbnails for quick navigation
5. Close with X button or backdrop tap

## Styling & Animations

### Key Visual Elements
- **Backdrop**: `bg-black/95` with radial gradient vignette
- **Buttons**: Glassmorphism with `backdrop-blur-sm`, subtle borders
- **Hover Effects**: Colored glow halos using blur filters
- **Image Transitions**: Combined opacity + scale (0.95 → 1.0)
- **Thumbnails**: Active state with KAWAI red border + glow

### Brand Colors Used
- `kawai-red` (#C41E3A): Active thumbnails, button accents
- White/Black: Primary UI elements
- Opacity variants: `/90`, `/60`, `/40`, `/20` for depth

### Performance Optimizations
- Next.js Image component for automatic optimization
- Loading indicators during image fetch
- CSS-only animations (no JS animation libraries)
- Prevent body scroll when open
- Touch event handlers for mobile swipe

## Accessibility

- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation (arrows, escape, enter/space)
- ✅ Focus management
- ✅ Alt text for all images
- ✅ Semantic HTML (buttons, not divs)
- ✅ Screen reader friendly counter ("02 / 05")

## Browser Compatibility

- Modern browsers with CSS backdrop-filter support
- Graceful degradation for older browsers
- Touch events for mobile devices
- Keyboard events for desktop

## Future Enhancements (Optional)

- [ ] Pinch-to-zoom on mobile
- [ ] Image preloading for faster transitions
- [ ] Video support in gallery (currently images only)
- [ ] 3D model viewer integration
- [ ] Social sharing buttons
- [ ] Download image option
- [ ] Fullscreen API for true fullscreen mode
- [ ] Image comparison slider (before/after)

## Testing Checklist

- [ ] Gallery opens on image click
- [ ] Correct starting image displayed
- [ ] Arrow navigation works (both buttons and keyboard)
- [ ] Thumbnail navigation works
- [ ] Close button works
- [ ] Escape key closes gallery
- [ ] Backdrop click closes gallery
- [ ] Mobile swipe navigation works
- [ ] Image counter displays correctly
- [ ] Loading indicators show during image load
- [ ] Body scroll locked when gallery open
- [ ] Hover effects work on desktop
- [ ] Responsive on all screen sizes
- [ ] Works with single image (no errors)
- [ ] Works with no images (no errors)
- [ ] Keyboard focus management works

## Files Modified

1. **New File**: `src/components/ui/image-gallery-lightbox.tsx` (327 lines)
2. **Modified**: `src/components/ui/index.ts` (added export)
3. **Modified**: `src/components/blocks/ProductHeroBlock.tsx` (integrated gallery)
4. **New Doc**: `docs/IMAGE-GALLERY-IMPLEMENTATION.md` (this file)

## Related Documentation

- [BLOCKS.md](./BLOCKS.md) - Block system overview
- [Product Media Sync Guide](./integrations/shopify/product-media-sync-guide.md)
- [Product Media Guide](./integrations/shopify/product-media-guide.md)
