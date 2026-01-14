# KAWAI Media Rendering Architecture

## Overview

The KAWAI Media Rendering System is a comprehensive solution for displaying piano imagery and videos with optimal performance, accessibility, and user experience. Built specifically for the KAWAI piano website, it integrates seamlessly with Cloudflare R2 storage and Payload CMS.

## Architecture Components

### 1. Core Utilities (`/src/lib/media/`)

#### R2 Utils (`r2-utils.ts`)
- **Purpose**: Cloudflare R2 CDN integration and URL optimization
- **Key Functions**:
  - `generateR2ImageUrl()` - Creates optimized image URLs with transformations
  - `generateResponsiveSrcSet()` - Builds responsive srcSet attributes
  - `getOptimizedImageProps()` - Returns complete image props for React components
  - `getVideoProps()` - Optimizes video properties for R2-hosted content
  - `preloadImage()` - Preloads critical images for performance

#### Hooks (`hooks.ts`)
- **Purpose**: Reusable React hooks for media state management
- **Available Hooks**:
  - `useResponsiveImage()` - Manages responsive image loading and optimization
  - `useVideoPlayer()` - Controls video playback state and interactions
  - `useMediaGallery()` - Handles gallery navigation and lightbox functionality
  - `useIntersectionObserver()` - Lazy loading with intersection observer
  - `useProgressiveLoading()` - LQIP (Low Quality Image Placeholder) loading
  - `useMediaPerformance()` - Performance monitoring and metrics
  - `useMediaPreloader()` - Batch media preloading strategies
  - `useMediaAccessibility()` - Accessibility features and announcements

#### Types (`types.ts`)
- **Purpose**: Comprehensive TypeScript definitions
- **Key Interfaces**:
  - Component props for all media components
  - State management interfaces
  - Configuration and option types
  - Error handling types
  - Touch gesture and accessibility types

### 2. UI Components (`/src/components/ui/media/`)

#### MediaRenderer (`MediaRenderer.tsx`)
- **Purpose**: Universal media component that auto-detects content type
- **Features**:
  - Automatic image/video/audio detection
  - Consistent API across media types
  - Caption support
  - Accessibility integration

```tsx
<MediaRenderer 
  media={pianoImage} 
  preset="hero" 
  priority 
  className="rounded-lg" 
/>
```

#### ResponsiveImage (`ResponsiveImage.tsx`)
- **Purpose**: High-performance responsive image component
- **Features**:
  - Lazy loading with intersection observer
  - Progressive enhancement with LQIP
  - WebP/AVIF format optimization
  - Error handling with retry logic
  - Touch-friendly interactions
  - Accessibility compliant

```tsx
<ResponsiveImage
  media={pianoImage}
  preset="gallery"
  aspectRatio={4/3}
  placeholder
  onLoad={() => console.log('Image loaded')}
/>
```

#### VideoPlayer (`VideoPlayer.tsx`)
- **Purpose**: Advanced video player with custom controls
- **Features**:
  - Custom UI controls with KAWAI branding
  - Thumbnail preview support
  - Keyboard navigation (Space, arrows, M, F)
  - Touch gestures for mobile
  - Fullscreen support
  - Progress tracking and volume control
  - Error recovery

```tsx
<VideoPlayer
  media={pianoVideo}
  customControls
  showProgressBar
  poster
  onPlay={() => analytics.track('video_play')}
/>
```

#### MediaGallery (`MediaGallery.tsx`)
- **Purpose**: Flexible gallery component with multiple layout options
- **Features**:
  - Grid, masonry, and carousel layouts
  - Responsive column configuration
  - Lightbox integration
  - Caption support
  - Lazy loading optimization
  - Keyboard navigation

```tsx
<MediaGallery
  media={pianoImages}
  variant="grid"
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  enableLightbox
  showCaptions
/>
```

#### MediaLightbox (`MediaLightbox.tsx`)
- **Purpose**: Full-screen media viewing experience
- **Features**:
  - Zoom and pan for detailed piano inspection
  - Touch gestures (pinch-to-zoom, swipe navigation)
  - Thumbnail strip navigation
  - Keyboard shortcuts
  - Video playback in lightbox
  - Accessibility support

```tsx
<MediaLightbox
  media={galleryMedia}
  currentIndex={selectedIndex}
  isOpen={lightboxOpen}
  enableZoom
  showThumbnails
/>
```

## Performance Optimizations

### 1. Image Optimization
- **Cloudflare R2 Integration**: Automatic image transformations at CDN level
- **Responsive Breakpoints**: Piano-specific presets for different screen sizes
- **Format Selection**: WebP/AVIF with JPEG fallbacks
- **Progressive Loading**: LQIP for perceived performance improvement

### 2. Lazy Loading Strategy
- **Intersection Observer**: Loads images only when entering viewport
- **Priority Loading**: Hero images load immediately
- **Batch Preloading**: Prefetches upcoming gallery images
- **Adaptive Loading**: Adjusts quality based on network conditions

### 3. Performance Budgets
```typescript
const PERFORMANCE_BUDGETS = {
  images: {
    hero: 500, // KB
    gallery: 300, // KB
    thumbnail: 50, // KB
  },
  videos: {
    preview: 2000, // KB
    demo: 10000, // KB
  }
}
```

## Responsive Presets

### Piano-Optimized Breakpoints
```typescript
const PIANO_RESPONSIVE_PRESETS = {
  hero: [
    { breakpoint: 320, width: 320, quality: 75 },
    { breakpoint: 768, width: 768, quality: 80 },
    { breakpoint: 1024, width: 1024, quality: 85 },
    { breakpoint: 1440, width: 1440, quality: 90 },
    { breakpoint: 1920, width: 1920, quality: 90 }
  ],
  gallery: [...],
  thumbnail: [...],
  card: [...]
}
```

## Usage Examples

### Basic Implementation
```tsx
import { MediaRenderer } from '@/components/ui/media'

export function PianoProduct({ piano }) {
  return (
    <div className="piano-showcase">
      <MediaRenderer
        media={piano.featuredImage}
        preset="hero"
        priority
        className="rounded-lg shadow-lg"
      />
    </div>
  )
}
```

### Advanced Gallery with Hooks
```tsx
import { MediaGallery } from '@/components/ui/media'
import { useMediaGallery } from '@/lib/media'

export function PianoGallery({ images }) {
  const { currentIndex, actions } = useMediaGallery(images, {
    enableLightbox: true,
    onMediaSelect: (media, index) => {
      analytics.track('gallery_image_view', { piano: media.alt, position: index })
    }
  })

  return (
    <MediaGallery
      media={images}
      variant="masonry"
      enableLightbox
      enableZoom
      showCaptions
      onMediaSelect={actions.selectMedia}
    />
  )
}
```

### Video Integration
```tsx
import { VideoPlayer } from '@/components/ui/media'
import { useVideoPlayer } from '@/lib/media'

export function PianoDemo({ demoVideo }) {
  const { state, actions } = useVideoPlayer(demoVideo, {
    onPlay: () => analytics.track('demo_play'),
    onEnded: () => showRelatedContent()
  })

  return (
    <div className="demo-section">
      <VideoPlayer
        media={demoVideo}
        customControls
        poster
        className="rounded-lg"
      />
      <div className="demo-controls">
        <button onClick={actions.play}>Play Demo</button>
        <span>Progress: {Math.round((state.currentTime / state.duration) * 100)}%</span>
      </div>
    </div>
  )
}
```

## Integration with Payload CMS

### Media Collection Schema
The system integrates seamlessly with the enhanced Media collection:

```typescript
// From /src/collections/Media.ts
export interface Media {
  id: string
  alt: string
  caption?: string
  mediaType: 'image' | 'video' | 'audio'
  usage: Array<'hero' | 'product' | 'gallery' | 'background'>
  variants?: {
    mobile?: Media
    tablet?: Media
    desktop?: Media
    largeDesktop?: Media
  }
  videoMeta?: {
    duration?: number
    thumbnail?: Media
    autoplay?: boolean
    muted?: boolean
  }
  // ... additional fields
}
```

### R2 CDN Integration
```typescript
// Automatic R2 URL generation
const R2_PUBLIC_URL = 'https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev'

// Images stored in R2 are automatically optimized
const optimizedUrl = generateR2ImageUrl('kawai-gx7-hero.webp', {
  width: 1200,
  quality: 85,
  format: 'webp'
})
```

## Accessibility Features

### WCAG 2.1 Compliance
- **Alt Text**: Required alt attributes for all images
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: ARIA labels and live regions
- **Focus Management**: Proper focus handling in lightbox and galleries
- **High Contrast**: Respects user color preferences

### Piano-Specific Accessibility
- **Audio Descriptions**: Support for piano audio sample descriptions
- **Touch Targets**: Minimum 44px touch targets for mobile piano browsing
- **Reduced Motion**: Respects prefers-reduced-motion for animations

## Error Handling

### Graceful Degradation
- **Image Load Failures**: Automatic retry with exponential backoff
- **Format Fallbacks**: WebP → JPEG → PNG fallback chain
- **Network Issues**: Offline-first caching strategy
- **Browser Compatibility**: Polyfills for intersection observer

### Error Recovery
```typescript
// Automatic error recovery with user feedback
const handleImageError = (error: MediaLoadError) => {
  if (retryCount < maxRetries) {
    setTimeout(() => retryLoad(), 1000 * retryCount)
  } else {
    showFallbackImage()
    notifyUser('Image temporarily unavailable')
  }
}
```

## Performance Monitoring

### Built-in Analytics
- **Load Time Tracking**: Measures image and video load performance
- **User Interaction**: Tracks gallery navigation and video engagement
- **Error Monitoring**: Logs media failures for optimization
- **Bandwidth Usage**: Monitors data consumption patterns

### Performance Metrics
```typescript
const performanceMetrics = {
  imageLoadTime: 'Average image load time',
  videoStartTime: 'Time to first video frame',
  interactionLatency: 'UI response time',
  errorRate: 'Media load failure rate'
}
```

## Future Enhancements

### Planned Features
1. **AI-Powered Optimization**: Automatic quality adjustment based on user behavior
2. **Advanced Caching**: Service worker integration for offline piano browsing
3. **360° Piano Views**: Interactive piano inspection with pan/zoom
4. **Audio Waveforms**: Visual audio sample representation
5. **AR Integration**: Augmented reality piano placement

### Scalability Considerations
- **CDN Edge Computing**: Move transformations closer to users
- **Adaptive Bitrate**: Dynamic quality adjustment for video content
- **Machine Learning**: Predictive preloading based on user patterns

## Files Created

### Core Architecture
- `/src/lib/media/r2-utils.ts` - R2 CDN utilities and optimizations
- `/src/lib/media/types.ts` - Comprehensive TypeScript definitions
- `/src/lib/media/hooks.ts` - React hooks for media management
- `/src/lib/media/index.ts` - Barrel exports

### UI Components
- `/src/components/ui/media/MediaRenderer.tsx` - Universal media component
- `/src/components/ui/media/ResponsiveImage.tsx` - Optimized image component
- `/src/components/ui/media/VideoPlayer.tsx` - Advanced video player
- `/src/components/ui/media/MediaGallery.tsx` - Flexible gallery layouts
- `/src/components/ui/media/MediaLightbox.tsx` - Full-screen viewing experience
- `/src/components/ui/media/index.ts` - Component exports

### Documentation & Examples
- `/src/components/examples/MediaUsageExamples.tsx` - Comprehensive usage examples
- `/docs/MEDIA_RENDERING_ARCHITECTURE.md` - This documentation

### Enhanced Existing Files
- `/src/lib/media.ts` - Updated with R2 CDN support and backward compatibility

## Getting Started

1. **Import Components**:
```tsx
import { MediaRenderer, MediaGallery } from '@/components/ui/media'
import { useMediaGallery } from '@/lib/media'
```

2. **Basic Usage**:
```tsx
<MediaRenderer media={pianoImage} preset="hero" priority />
```

3. **Advanced Features**:
```tsx
const gallery = useMediaGallery(images, { enableLightbox: true })
<MediaGallery {...gallery} variant="masonry" />
```

This architecture provides a solid foundation for displaying piano media content with exceptional performance, accessibility, and user experience while maintaining scalability for future enhancements.