# Video Background Block

A sophisticated full-screen video background block with Japanese-inspired glassmorphism sidebar for the KAWAI CMS. Perfect for impactful hero sections and immersive brand storytelling.

## Overview

**Block Type:** `layout-video-background`
**Slug:** `layout-video-background`
**Category:** Layout Blocks
**Collections:** Pages

## Design Philosophy

The Video Background block embodies Japanese minimalist elegance inspired by the concept of **Ma (間)** - the beauty of negative space and restraint. The design features:

- **Refined Glassmorphism**: Subtle blur with delicate borders, not overdone
- **Purposeful Motion**: Slow, staggered fade-ins - nothing rushed
- **Japanese Aesthetics**: Elegant typography pairing Cormorant Garamond (serif headings) with Inter (refined body text)
- **Kawai Brand Integration**: Uses Kawai red (#C41E3A) as precise accent, gold (#D4AF37) for subtle highlights

## Features

### Core Functionality
- ✅ Full-screen HTML5 video background (auto-play, loop, muted)
- ✅ Glassmorphism content sidebar with backdrop blur
- ✅ Customizable sidebar positioning (left or right)
- ✅ Adjustable overlay opacity (0-1) for video brightness control
- ✅ Responsive design with mobile-optimized layout

### Content Fields
- **Video Source** (required): Choose between YouTube or Direct Video File (MP4)
- **YouTube URL** (required if YouTube): Full YouTube video URL (supports multiple formats: `youtube.com/watch?v=...`, `youtu.be/...`, or embed URLs)
- **Video URL** (required if Direct): Direct MP4 video URL (recommended: 1920x1080, H.264, <10MB)
- **Sidebar Position**: Left or Right
- **Sidebar Height**: Centered Content (default) or Full Height
  - **Centered**: Content vertically centered in sidebar (best for concise content)
  - **Full Height**: Sidebar panel spans full screen height (best for longer content or dramatic effect)
- **Overlay Opacity**: 0 (transparent) to 1 (fully dark), default 0.4
- **Subheading**: Small uppercase label (e.g., "Crafted in Japan")
- **Heading** (required): Main headline with large serif typography
- **Description**: Supporting paragraph (2-3 sentences recommended)
- **Primary CTA**: Main call-to-action button (filled red style)
  - Text: Button text (default: "Learn More")
  - Link: Button destination URL
  - Open in New Tab: Opens link in a new browser tab (default: false)
- **Secondary CTA** (optional): Alternative action button (outline style)
  - Enabled: Checkbox to show/hide secondary button
  - Text: Secondary button text
  - Link: Secondary button destination URL
  - Open in New Tab: Opens link in a new browser tab (default: false)

### Visual Effects
- Staggered reveal animations (200-700ms delays)
- Decorative border accent (Kawai red to gold gradient)
- Subtle glow effect behind glassmorphism panel
- Grain texture overlay for refined aesthetic
- Scroll indicator with bounce animation
- Hover shine effect on primary CTA button
- Dual CTA support: Primary (filled red) + Secondary (outline white)

### Responsive Behavior
- Full-screen on desktop (h-screen)
- Mobile gradient overlay for improved text readability
- Sidebar scales: 600px (md), 700px (lg)
- Accessible with reduced motion support

## File Structure

```
src/
├── blocks/layout/
│   ├── VideoBackground.ts           # Payload block definition
│   └── index.ts                     # Updated barrel export
├── components/blocks/
│   ├── VideoBackgroundBlock.tsx     # React component renderer
│   └── index.ts                     # Updated barrel export
├── collections/Pages/
│   └── index.ts                     # Added to blockReferences
├── app/globals.css                  # Animation keyframes
├── payload.config.ts                # Global block registration
└── components/RenderBlocks.tsx      # Block mapping
```

## Usage in CMS

### Adding to a Page

1. Navigate to **Pages** collection in Payload admin
2. Create or edit a page
3. Go to the **Content** tab
4. Click **Add Block**
5. Select **🎬 Video Background**
6. Fill in the required fields:
   - **Video Source**: Select YouTube or Direct Video File
   - **YouTube URL** (if YouTube): Paste full YouTube video URL
   - **Video URL** (if Direct): Use a CDN/R2 hosted MP4 file
   - **Heading**: Your main message
   - Configure other fields as needed

### YouTube Video Guidelines

**Supported URL formats:**
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

**Best practices:**
- Use high-quality videos (1080p or higher)
- Choose videos with ambient motion (no fast cuts)
- Prefer videos without text overlays
- Consider copyright/licensing (use your own videos or licensed content)
- Videos will auto-play muted with looping

### Direct Video File Specs (MP4)

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD)
- **File Size**: Under 10MB for performance
- **Duration**: 10-30 seconds (loops automatically)
- **Aspect Ratio**: 16:9
- **Frame Rate**: 30fps
- **Optimization**: Use a tool like Handbrake to compress

### Field Configuration Examples

**Example 1: YouTube - Craftsmanship Story (with Secondary CTA)**
```
Video Source: YouTube
YouTube URL: https://youtube.com/watch?v=dQw4w9WgXcQ
Sidebar Position: Left
Overlay Opacity: 0.5
Subheading: Crafted in Japan
Heading: Experience the Art of Piano Craftsmanship
Description: Discover how Japanese precision and musical passion unite to create instruments that inspire generations of pianists.

Primary CTA:
  Text: Explore Our Heritage
  Link: /about

Secondary CTA:
  Enabled: Yes
  Text: Watch Video
  Link: /videos/craftsmanship
```

**Example 2: YouTube - Product Showcase (Primary CTA Only)**
```
Video Source: YouTube
YouTube URL: https://youtu.be/EXAMPLE_VIDEO_ID
Sidebar Position: Right
Overlay Opacity: 0.4
Subheading: Introducing
Heading: The New GX Series
Description: Experience the pinnacle of grand piano innovation with our latest masterpiece.

Primary CTA:
  Text: Discover GX Series
  Link: /pianos/grand/gx

Secondary CTA:
  Enabled: No
```

**Example 3: Direct MP4 - High Performance**
```
Video Source: Direct Video File (MP4)
Video URL: https://cdn.kawai.com/videos/piano-crafting.mp4
Sidebar Position: Left
Overlay Opacity: 0.3
Subheading: Premium Quality
Heading: Shigeru Kawai Grand Pianos
Description: Handcrafted by master artisans in our Ryuyo Grand Piano Facility.
CTA Text: Explore Collection
CTA Link: /pianos/shigeru-kawai
```

## Technical Details

### TypeScript Types

The block automatically generates TypeScript types on build:

```typescript
interface LayoutVideoBackgroundBlock {
  blockType: 'layout-video-background'
  videoUrl: string
  sidebarPosition?: 'left' | 'right'
  overlayOpacity?: number
  subheading?: string
  heading: string
  description?: string
  ctaText?: string
  ctaLink?: string
}
```

### Component Props

```typescript
interface VideoBackgroundBlockProps {
  block: LayoutVideoBackgroundBlock
}
```

### Tailwind Classes Used

- **Glassmorphism**: `backdrop-blur-xl`, `bg-gradient-to-br`, `from-white/5`
- **Brand Colors**: `bg-kawai-red`, `text-kawai-gold`, `border-kawai-red`
- **Animations**: Custom `animate-scroll-bounce` keyframe
- **Typography**: `font-serif` (Cormorant Garamond), `font-sans` (Inter)

## Animation Timeline

All animations respect user's motion preferences via `prefers-reduced-motion`.

1. **Video Fade-In**: 1000ms (when loaded)
2. **Sidebar Translate**: 1000ms (from side)
3. **Border Accent**: 700ms delay, fade-in
4. **Subheading**: 700ms delay, translate-y + fade
5. **Heading**: 700ms delay, translate-y + fade
6. **Description**: 700ms delay, translate-y + fade
7. **CTA Button**: 700ms delay, translate-y + fade
8. **Scroll Indicator**: 1000ms delay, fade-in

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile (Android)

Video autoplay requires:
- Muted audio (implemented)
- `playsInline` attribute (implemented)

## Accessibility

- ✅ Reduced motion support via `prefers-reduced-motion`
- ✅ Keyboard navigable CTA button
- ✅ Focus states with visible ring
- ✅ Semantic HTML structure
- ✅ ARIA labels on scroll indicator

## Performance Considerations

### Video Source Choice
- **YouTube**: Easiest to use, leverages YouTube's CDN, no hosting required
- **Direct MP4**: Better control, no third-party dependencies, faster initial load
- **Trade-off**: YouTube adds ~500KB iframe overhead, but videos are cached by YouTube

### Video Optimization
- **YouTube**: Already optimized by YouTube, choose high-quality original videos
- **Direct MP4**: Host on CDN (Cloudflare R2 recommended), use H.264 encoding, keep under 10MB
- Consider lazy loading for below-fold usage

### Animation Performance
- All animations use CSS transforms (GPU accelerated)
- No JavaScript-based animations
- Uses `will-change` hints where appropriate
- Respects `prefers-reduced-motion`

### Bundle Size
- Component is code-split with Next.js
- No external dependencies required
- Inline SVG for icons

## Customization

### Changing Fonts

Edit the component to use different fonts:

```tsx
// In VideoBackgroundBlock.tsx
style={{ fontFamily: "'Your Font', serif" }}
```

### Adjusting Animation Speed

Modify duration values in className:

```tsx
// Current
'transition-all duration-700 delay-300'

// Faster
'transition-all duration-500 delay-200'
```

### Custom Overlay Gradient

Update the overlay gradient in the component:

```tsx
<div
  className="absolute inset-0 bg-gradient-to-br from-kawai-charcoal via-kawai-charcoal/60 to-transparent"
  style={{ opacity: overlayOpacity }}
/>
```

## Troubleshooting

### YouTube Video Not Playing

**Problem**: YouTube video doesn't appear or play
**Solutions**:
- Verify the YouTube URL is correct and video is publicly accessible
- Check if video allows embedding (some videos have embed restrictions)
- Try the video URL in a private/incognito browser window
- Check browser console for iframe errors
- Ensure video isn't age-restricted or region-locked

**Common YouTube URL issues:**
```
✅ https://youtube.com/watch?v=dQw4w9WgXcQ
✅ https://youtu.be/dQw4w9WgXcQ
❌ https://youtube.com/shorts/VIDEO_ID (Shorts not supported)
❌ Private or unlisted videos may not work
```

### Direct Video Not Playing

**Problem**: MP4 video doesn't autoplay
**Solutions**:
- Ensure video URL is accessible (check CORS)
- Verify MP4 format is used (H.264 codec)
- Check browser console for errors
- Test video URL directly in browser

### Glassmorphism Not Visible

**Problem**: Blur effect not showing
**Solutions**:
- Check browser supports `backdrop-filter`
- Verify overlay opacity isn't too high (try 0.3-0.5)
- Ensure video has sufficient contrast

### Text Not Readable

**Problem**: Content hard to read over video
**Solutions**:
- Increase overlay opacity (0.5-0.7)
- Use darker video or one with less motion
- Position sidebar on side with less video activity
- Add stronger gradient behind text

### Performance Issues

**Problem**: Slow loading or janky animations
**Solutions**:
- Reduce video file size (compress more)
- Use CDN for video hosting
- Disable animations on low-end devices
- Consider fallback image for mobile

## Related Blocks

- **Hero Carousel** (`layout-hero-carousel`): Multi-slide carousel hero
- **Marketing Hero** (`marketing-hero`): Static hero with CTA
- **Product Hero** (`product-hero`): Product-specific hero

## Next Steps

1. ✅ Block created and registered
2. ✅ Component implemented with animations
3. ✅ Added to Pages collection
4. ✅ Documentation updated (BLOCKS.md)
5. ⏳ **Run build to regenerate types**: `bun run build`
6. ⏳ Test in Payload admin
7. ⏳ Add sample video to R2/CDN
8. ⏳ Create example page using the block

## Example Video Sources

For testing, use these royalty-free video sources:

- **Pexels Videos**: https://www.pexels.com/videos/
- **Pixabay Videos**: https://pixabay.com/videos/
- **Coverr**: https://coverr.co/

Recommended search terms: "piano hands", "music performance", "craftsmanship", "workshop", "elegant motion"

## Credits

**Design System**: Japanese Ma (間) minimalist philosophy
**Typography**: Cormorant Garamond + Inter
**Glassmorphism**: Refined blur with delicate transparency
**Animations**: Staggered reveal with purposeful timing
**Brand Integration**: Kawai red (#C41E3A) and gold (#D4AF37)
