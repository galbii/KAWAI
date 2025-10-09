# 3D Viewer Feature Documentation

> **Interactive 3D model viewing system for KAWAI piano products**
>
> Version: 1.0.0
> Last Updated: 2025-01-09
> Status: ✅ Production Ready (Phase 1 & 2 Complete)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [CMS Configuration](#cms-configuration)
4. [Component API Reference](#component-api-reference)
5. [Integration Guide](#integration-guide)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance & Updates](#maintenance--updates)
9. [Future Enhancements](#future-enhancements)

---

## Overview

### What is the 3D Viewer Feature?

The 3D Viewer feature allows customers to interactively view KAWAI piano products in 3D directly from product pages. It provides an immersive experience that helps customers better understand piano dimensions, finishes, and design details before visiting a showroom.

### Key Features

✅ **Full-Screen Modal Viewer** - Immersive 3D experience with smooth animations
✅ **Iframe-Based Integration** - Works with existing kawai-global.com viewer
✅ **Floating Action Button** - Bottom-left positioned with fade-in animation
✅ **URL Parameter Auto-Open** - Share direct links to 3D view (`?mode=3d`)
✅ **GTM Tracking Integration** - Track viewer opens/closes for analytics
✅ **Keyboard Shortcuts** - Press `V` to toggle, `Escape` to close
✅ **Responsive Design** - Works seamlessly on desktop and mobile
✅ **Error Handling** - Graceful fallback UI if viewer fails to load
✅ **Body Scroll Lock** - Prevents background scrolling when modal open
✅ **Accessibility** - ARIA labels, keyboard navigation, screen reader support

### Technology Stack

- **Framework**: React 19 + Next.js 15
- **Animations**: Framer Motion 12
- **Styling**: Tailwind CSS 4.1
- **CMS**: Payload CMS 3.52+
- **TypeScript**: Strict mode with full type safety

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Product Page (SSR)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Server Component: ProductPageRenderer                │  │
│  │  - Fetches product data from Payload CMS             │  │
│  │  - Checks if viewer3D.enabled === true                │  │
│  │  - Conditionally renders 3D viewer components         │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Client Components: 3D Viewer System                  │  │
│  │                                                         │  │
│  │  ┌─────────────────┐  ┌──────────────────────────┐   │  │
│  │  │ use3DViewer()   │  │  ThreeDViewerButton      │   │  │
│  │  │ Custom Hook     │→ │  (Floating Button)       │   │  │
│  │  │                 │  └──────────────────────────┘   │  │
│  │  │ - State mgmt    │           ↓ onClick              │  │
│  │  │ - URL detection │  ┌──────────────────────────┐   │  │
│  │  │ - Auto-open     │  │  ThreeDViewerModal       │   │  │
│  │  │ - Preloading    │  │  (Full-screen iframe)    │   │  │
│  │  └─────────────────┘  └──────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌─────────────────────────────┐
              │  External 3D Viewer (iframe) │
              │  kawai-global.com/modelviewer│
              └─────────────────────────────┘
```

### File Structure

```
src/
├── components/ui/3d-viewer/
│   ├── ThreeDViewerModal.tsx      # Full-screen modal component
│   ├── ThreeDViewerButton.tsx     # Floating action button
│   ├── use3DViewer.ts             # State management hook
│   ├── types.ts                   # TypeScript definitions
│   └── index.ts                   # Barrel exports
│
├── collections/
│   └── Products.ts                # CMS schema with viewer3D fields
│
└── app/(frontend)/products/[slug]/
    └── page.tsx                   # Product page integration point
```

### Component Responsibilities

| Component | Type | Responsibility |
|-----------|------|----------------|
| `use3DViewer` | Hook | State management, URL detection, auto-open logic |
| `ThreeDViewerButton` | Client | Floating button UI, GTM tracking, animations |
| `ThreeDViewerModal` | Client | Full-screen modal, iframe rendering, error handling |
| `ProductPageRenderer` | Server | Conditional rendering based on CMS data |

---

## CMS Configuration

### Adding 3D Viewer to Products

The 3D viewer fields are automatically available in the **Product Details** tab for piano products.

#### Field Structure

```typescript
viewer3D: {
  enabled: boolean           // Master toggle for 3D viewer
  viewerUrl?: string        // Full URL to viewer (e.g., "https://...")
  modelParams?: string      // Query parameters (e.g., "?model=gl-10&color=ebony")
  autoOpen?: boolean        // Allow ?mode=3d URL parameter
  buttonText?: string       // Custom button text (default: "View in 3D")
}
```

#### Configuration Steps

1. **Navigate to Products** in Payload CMS admin
2. **Open or create a piano product**
3. **Scroll to 3D Viewer Configuration** section
4. **Enable the viewer** by checking "Enable 3D model viewer"
5. **Enter the viewer URL**:
   ```
   https://www.kawai-global.com/modelviewer/index.php
   ```
6. **Add model parameters** (if needed):
   ```
   ?model=gl-10&color=ebony
   ```
7. **Customize button text** (optional):
   ```
   View the GL-10 in 3D
   ```
8. **Enable auto-open** (optional) - allows `?mode=3d` URL param
9. **Save the product**

#### Example Configuration

**Product**: GL-10 Grand Piano
**Viewer URL**: `https://www.kawai-global.com/modelviewer/index.php`
**Model Params**: `?model=gl-10&color=polished-ebony`
**Button Text**: `View the GL-10 in 3D`
**Auto Open**: ✅ Enabled

**Result URL**: `https://www.kawai-global.com/modelviewer/index.php?model=gl-10&color=polished-ebony`

---

## Component API Reference

### `use3DViewer(options)`

Custom hook for managing 3D viewer state and behavior.

#### Parameters

```typescript
interface Use3DViewerOptions {
  config: Viewer3DConfig | null | undefined
  productName: string
  searchParams?: URLSearchParams | null
}
```

#### Returns

```typescript
interface Use3DViewerReturn {
  isOpen: boolean              // Current modal state
  open: () => void            // Open modal
  close: () => void           // Close modal
  toggle: () => void          // Toggle modal
  fullViewerUrl: string       // Complete URL (base + params)
  shouldAutoOpen: boolean     // Auto-open detection result
}
```

#### Example

```tsx
const viewer = use3DViewer({
  config: product.viewer3D,
  productName: product.name,
  searchParams: new URLSearchParams(window.location.search)
})
```

---

### `<ThreeDViewerButton />`

Floating action button to open the 3D viewer.

#### Props

```typescript
interface ThreeDViewerButtonProps {
  onClick: () => void         // Click handler
  text?: string              // Button text (default: "View in 3D")
  productName: string        // For GTM tracking
  className?: string         // Custom CSS classes
  visible?: boolean          // Show/hide button (default: true)
}
```

#### Example

```tsx
<ThreeDViewerButton
  onClick={viewer.open}
  text="View the GL-10 in 3D"
  productName="GL-10 Grand Piano"
/>
```

#### Styling

The button is positioned **fixed bottom-left** (`bottom-5 left-5`) with:
- Blue background (`bg-blue-600`)
- Shadow effects on hover
- 3D rotation icon (SVG)
- Fade-in animation on mount

---

### `<ThreeDViewerModal />`

Full-screen modal with iframe-based 3D viewer.

#### Props

```typescript
interface ThreeDViewerModalProps {
  isOpen: boolean            // Modal open state
  onClose: () => void       // Close callback
  viewerUrl: string         // Full viewer URL
  productName: string       // For GTM tracking + accessibility
  className?: string        // Custom CSS classes
}
```

#### Example

```tsx
<ThreeDViewerModal
  isOpen={viewer.isOpen}
  onClose={viewer.close}
  viewerUrl={viewer.fullViewerUrl}
  productName="GL-10 Grand Piano"
/>
```

#### Features

- **Full-screen overlay** with black backdrop (`bg-black/95`)
- **Close button** (top-right, large ×)
- **Click-outside to close**
- **Escape key to close**
- **Body scroll lock** when open
- **Error fallback** if iframe fails to load
- **Framer Motion animations** (fade + scale)

---

## Integration Guide

### Phase 3: Product Page Integration (Next Step)

To integrate the 3D viewer into product pages, follow these steps:

#### 1. Update `ProductPageRenderer.tsx`

```tsx
// src/components/products/ProductPageRenderer.tsx
import { ThreeDViewerButton, ThreeDViewerModal, use3DViewer } from '@/components/ui/3d-viewer'

export function ProductPageRenderer({ product }: ProductPageRendererProps) {
  // Initialize 3D viewer hook
  const viewer = use3DViewer({
    config: product.viewer3D,
    productName: product.name
  })

  return (
    <div className="min-h-screen">
      {/* Existing page content */}
      <BlocksList blocks={product.pageContent} product={product} />

      {/* 3D Viewer components - only render if enabled */}
      {product.viewer3D?.enabled && (
        <>
          <ThreeDViewerButton
            onClick={viewer.open}
            text={product.viewer3D.buttonText || `View the ${product.name} in 3D`}
            productName={product.name}
          />
          <ThreeDViewerModal
            isOpen={viewer.isOpen}
            onClose={viewer.close}
            viewerUrl={viewer.fullViewerUrl}
            productName={product.name}
          />
        </>
      )}
    </div>
  )
}
```

#### 2. Update Product Page to Pass SearchParams

```tsx
// src/app/(frontend)/products/[slug]/page.tsx
export default async function ProductPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  // Convert searchParams to URLSearchParams for the hook
  const search = await searchParams
  const urlSearchParams = new URLSearchParams(
    Object.entries(search).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : (value || '')
    ])
  )

  if (!product) notFound()

  return (
    <div className="min-h-screen">
      <ErrorBoundary fallback={ProductErrorFallback}>
        <ProductPageRenderer
          product={product}
          searchParams={urlSearchParams}
        />
      </ErrorBoundary>
    </div>
  )
}
```

#### 3. Test the Integration

1. **Navigate to a product page** with 3D viewer enabled
2. **Verify button appears** in bottom-left corner
3. **Click button** to open modal
4. **Test close methods**:
   - Click × button
   - Press Escape key
   - Click outside modal
5. **Test URL parameter**: Add `?mode=3d` to URL and verify auto-open
6. **Check GTM events** in browser console or GTM debugger

---

## Usage Examples

### Example 1: Basic Integration

```tsx
'use client'

import { use3DViewer, ThreeDViewerButton, ThreeDViewerModal } from '@/components/ui/3d-viewer'
import { Product } from '@/payload-types'

export function ProductView({ product }: { product: Product }) {
  const viewer = use3DViewer({
    config: product.viewer3D,
    productName: product.name
  })

  if (!product.viewer3D?.enabled) return null

  return (
    <>
      <ThreeDViewerButton
        onClick={viewer.open}
        productName={product.name}
      />
      <ThreeDViewerModal
        isOpen={viewer.isOpen}
        onClose={viewer.close}
        viewerUrl={viewer.fullViewerUrl}
        productName={product.name}
      />
    </>
  )
}
```

### Example 2: Custom Button Styling

```tsx
<ThreeDViewerButton
  onClick={viewer.open}
  text="Experience in 3D"
  productName={product.name}
  className="bg-kawai-red hover:bg-kawai-red/90 bottom-10 left-10"
/>
```

### Example 3: Programmatic Control

```tsx
export function ProductActions({ viewer }) {
  return (
    <div className="flex gap-4">
      <button onClick={viewer.open}>View 3D Model</button>
      <button onClick={viewer.toggle}>Toggle Viewer</button>
      {viewer.isOpen && (
        <button onClick={viewer.close}>Close Viewer</button>
      )}
    </div>
  )
}
```

### Example 4: Auto-Open Detection

```tsx
// URL: /products/gl-10?mode=3d
// The viewer will automatically open on page load if:
// 1. viewer3D.enabled === true
// 2. viewer3D.autoOpen === true
// 3. URL contains ?mode=3d

const viewer = use3DViewer({
  config: product.viewer3D,
  productName: product.name,
  searchParams: new URLSearchParams(window.location.search)
})

// viewer.shouldAutoOpen === true
// viewer.isOpen === true (after mount)
```

---

## Troubleshooting

### Common Issues

#### 1. Button Not Appearing

**Symptoms**: 3D viewer button doesn't show on product page

**Checklist**:
- ✅ Is `viewer3D.enabled` set to `true` in CMS?
- ✅ Is the product type set to `piano`?
- ✅ Is the component correctly imported and rendered?
- ✅ Check browser console for React errors

**Solution**:
```tsx
// Debug check
console.log('3D Viewer Config:', product.viewer3D)
console.log('Is Enabled:', product.viewer3D?.enabled)
```

#### 2. Iframe Not Loading

**Symptoms**: Modal opens but shows error message

**Possible Causes**:
- Invalid `viewerUrl` in CMS
- External viewer service is down
- CORS issues with iframe
- Network connectivity problems

**Solution**:
1. **Verify URL** in CMS is correct and accessible
2. **Test URL directly** in browser
3. **Check browser console** for CORS errors
4. **Contact external viewer** service provider

#### 3. Auto-Open Not Working

**Symptoms**: `?mode=3d` URL parameter doesn't auto-open viewer

**Checklist**:
- ✅ Is `viewer3D.autoOpen` set to `true`?
- ✅ Are `searchParams` being passed to the hook?
- ✅ Is the URL parameter exactly `?mode=3d` (case-insensitive)?

**Solution**:
```tsx
// Ensure searchParams are passed
const viewer = use3DViewer({
  config: product.viewer3D,
  productName: product.name,
  searchParams: new URLSearchParams(window.location.search) // ← Must be provided
})
```

#### 4. GTM Events Not Firing

**Symptoms**: No events in GTM debugger

**Checklist**:
- ✅ Is GTM script loaded on the page?
- ✅ Is `window.gtag` defined?
- ✅ Are GTM container IDs correctly configured?

**Solution**:
```tsx
// Debug GTM
console.log('GTM Available:', typeof window.gtag !== 'undefined')
```

#### 5. Modal Animation Issues

**Symptoms**: Janky animations or modal doesn't close smoothly

**Possible Causes**:
- Framer Motion not installed
- CSS conflicts
- Performance issues

**Solution**:
```bash
# Verify Framer Motion is installed
bun list framer-motion

# Should show: framer-motion@12.23.12
```

---

## Maintenance & Updates

### Updating Viewer URL

If the external viewer service changes URLs:

1. **Update CMS records**:
   ```bash
   # Connect to MongoDB
   # Update all products with old URL
   db.products.updateMany(
     { "viewer3D.viewerUrl": "https://old-url.com/viewer" },
     { $set: { "viewer3D.viewerUrl": "https://new-url.com/viewer" } }
   )
   ```

2. **Or update individually** via Payload admin UI

### Adding New Model Parameters

To add new query parameters:

1. **Update CMS** - modify `viewer3D.modelParams` field
2. **No code changes needed** - system handles dynamic parameters

### Performance Optimization

The system includes built-in optimizations:

- **Preloading**: Viewer content is prefetched when `viewer3D.enabled`
- **Lazy Loading**: Components only render when needed
- **Code Splitting**: 3D viewer code is automatically split by Next.js
- **Animation Performance**: Framer Motion uses GPU-accelerated transforms

### Monitoring

Track these metrics for health monitoring:

| Metric | What to Track | Target |
|--------|---------------|--------|
| **Viewer Opens** | GTM event `3d_viewer_opened` | Increase over time |
| **Error Rate** | Iframe load failures | < 1% |
| **Load Time** | Time from click to iframe ready | < 2 seconds |
| **Auto-Open Rate** | % of `?mode=3d` visits | Track for marketing |

---

## Future Enhancements

### Tier 2: Google Model-Viewer Integration

**Timeline**: 2-3 weeks
**Complexity**: Medium

**Benefits**:
- Native 3D rendering (no external dependency)
- AR (Augmented Reality) support for mobile
- Better performance and customization
- Full control over viewer UI/UX

**Requirements**:
- GLTF/GLB 3D model files
- Install `@google/model-viewer` package
- Create TypeScript declarations
- Build custom viewer component

**Migration Path**:
```tsx
// Replace iframe with native model-viewer
<model-viewer
  src="/models/gl-10.glb"
  camera-controls
  auto-rotate
  ar
  ar-modes="webxr scene-viewer quick-look"
>
</model-viewer>
```

### Tier 3: React Three Fiber

**Timeline**: 4-6 weeks
**Complexity**: High

**Benefits**:
- Complete control over 3D scene
- Advanced interactions (piano key press, lid open/close)
- Real-time lighting and material changes
- Maximum performance optimization

**Requirements**:
- Install `@react-three/fiber` and `@react-three/drei`
- 3D modeling expertise
- Custom shaders and materials
- Advanced React knowledge

### Additional Features (Quick Wins)

#### 1. Full-Screen Mode
Add native fullscreen API support:
```tsx
const enterFullscreen = () => {
  document.documentElement.requestFullscreen()
}
```

#### 2. Loading Spinner
Show loading state while iframe loads:
```tsx
const [isLoading, setIsLoading] = useState(true)

<iframe
  onLoad={() => setIsLoading(false)}
  // ...
/>
{isLoading && <Spinner />}
```

#### 3. Social Sharing
Add "Share 3D View" button:
```tsx
const shareUrl = `${window.location.href}?mode=3d`
navigator.share({ url: shareUrl })
```

#### 4. Analytics Enhancement
Track additional metrics:
- Time spent in viewer
- Viewer interactions (if supported by external viewer)
- Conversion correlation (viewers who became leads)

#### 5. Mobile Optimization
- Detect mobile devices
- Show different button text ("View in AR" on mobile)
- Optimize iframe size for mobile viewports

---

## Support & Contact

### Questions?

- **Developer**: Check `src/components/ui/3d-viewer/` code comments
- **CMS Issues**: Review Payload admin logs
- **Integration Help**: See [Integration Guide](#integration-guide)

### Reporting Issues

1. **Check troubleshooting** section first
2. **Gather debug info**:
   - Browser console errors
   - Product CMS configuration
   - Steps to reproduce
3. **Create detailed issue** with screenshots

---

## Changelog

### Version 1.0.0 (2025-01-09)

**Initial Release**

✅ CMS fields added to Products collection
✅ Core components built and tested
✅ TypeScript types defined
✅ Documentation completed
⏳ Product page integration (pending Phase 3)

**Components Delivered**:
- `ThreeDViewerModal` - Full-screen modal with iframe
- `ThreeDViewerButton` - Floating action button
- `use3DViewer` - State management hook
- Complete TypeScript definitions
- Comprehensive documentation

**Next Steps**:
- Phase 3: Integrate into ProductPageRenderer
- Test with real product data
- Deploy to production

---

## Appendix

### Type Definitions Reference

```typescript
// Complete type definitions
interface Viewer3DConfig {
  enabled: boolean
  viewerUrl?: string
  modelParams?: string
  autoOpen?: boolean
  buttonText?: string
}

interface Use3DViewerReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  fullViewerUrl: string
  shouldAutoOpen: boolean
}

interface ViewerGTMEvent {
  event: '3d_viewer_opened' | '3d_viewer_closed'
  product_name: string
  viewer_url: string
  auto_opened?: boolean
}
```

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| iframe | ✅ All | ✅ All | ✅ All | ✅ All |
| Framer Motion | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| URLSearchParams | ✅ 49+ | ✅ 44+ | ✅ 10.1+ | ✅ 17+ |

### Dependencies

```json
{
  "framer-motion": "^12.23.12",
  "react": "19.1.0",
  "next": "15.4.6",
  "tailwindcss": "^4.1.0"
}
```

---

**Documentation maintained by**: Development Team
**Last reviewed**: 2025-01-09
**Next review**: 2025-04-09
