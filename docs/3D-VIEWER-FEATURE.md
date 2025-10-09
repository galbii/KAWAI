# 3D Viewer Feature Documentation

> **Interactive 3D model viewing system for KAWAI piano products**
>
> Version: 2.0.0
> Last Updated: 2025-10-09
> Status: ✅ Production Ready (With Server-Side Proxy)

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
✅ **Server-Side Proxy** - Bypasses X-Frame-Options restrictions via Next.js API route
✅ **CORS Asset Proxying** - All 3D assets (GLTF, textures) proxied with proper headers
✅ **URL Rewriting** - Automatic rewriting of asset URLs for seamless loading
✅ **Iframe-Based Integration** - Works with existing kawai-global.com viewer
✅ **Floating Action Button** - Bottom-left positioned with fade-in animation
✅ **URL Parameter Auto-Open** - Share direct links to 3D view (`?mode=3d`)
✅ **GTM Tracking Integration** - Track viewer opens/closes for analytics
✅ **Keyboard Shortcuts** - Press `V` to toggle, `Escape` to close
✅ **Responsive Design** - Works seamlessly on desktop and mobile
✅ **Error Handling** - Graceful fallback UI if viewer fails to load
✅ **Body Scroll Lock** - Prevents background scrolling when modal open
✅ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
✅ **Performance Optimized** - Aggressive caching (15min HTML, 1 year assets)

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
│  │  │ - Proxy URL     │  │  (Full-screen iframe)    │   │  │
│  │  └─────────────────┘  └──────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌─────────────────────────────────────┐
              │  Next.js API Route (Proxy)          │
              │  /api/3d-viewer-proxy?model=ca901   │
              │                                     │
              │  1. Fetch HTML from kawai-global    │
              │  2. Strip X-Frame-Options header    │
              │  3. Rewrite asset URLs              │
              │  4. Add CORS headers                │
              │  5. Return proxied content          │
              └─────────────────────────────────────┘
                            ↓
              ┌─────────────────────────────────────┐
              │  External 3D Viewer Service         │
              │  kawai-global.com/modelviewer       │
              │                                     │
              │  - HTML & JavaScript                │
              │  - GLTF 3D Models                   │
              │  - Textures & Assets                │
              └─────────────────────────────────────┘
```

### File Structure

```
src/
├── app/
│   ├── api/
│   │   └── 3d-viewer-proxy/
│   │       └── route.ts           # 🔥 Server-side proxy API route
│   │
│   └── (frontend)/
│       ├── [slug]/
│       │   └── gl-10-signature/
│       │       └── page.tsx       # Example: GL-10 page integration
│       └── products/[slug]/
│           └── page.tsx           # Product page integration point
│
├── components/ui/3d-viewer/
│   ├── ThreeDViewerModal.tsx      # Full-screen modal component
│   ├── ThreeDViewerButton.tsx     # Floating action button
│   ├── use3DViewer.ts             # State management hook
│   ├── types.ts                   # TypeScript definitions
│   └── index.ts                   # Barrel exports
│
└── collections/
    └── Products.ts                # CMS schema with viewer3D fields
```

### Component Responsibilities

| Component | Type | Responsibility |
|-----------|------|----------------|
| `3d-viewer-proxy/route.ts` | API Route | Server-side proxy, X-Frame-Options bypass, URL rewriting, CORS |
| `use3DViewer` | Hook | State management, URL detection, auto-open logic, proxy URL construction |
| `ThreeDViewerButton` | Client | Floating button UI, GTM tracking, animations |
| `ThreeDViewerModal` | Client | Full-screen modal, iframe rendering, error handling |
| `ProductPageRenderer` | Server | Conditional rendering based on CMS data |

---

## Server-Side Proxy Solution

### Why Do We Need a Proxy?

The external 3D viewer at `kawai-global.com/modelviewer` sends an **X-Frame-Options: SAMEORIGIN** header, which prevents iframe embedding from different domains. This is a security feature that blocks cross-origin iframe usage.

**Problem**: Direct iframe embedding fails with console error:
```
Refused to display 'https://www.kawai-global.com/modelviewer/' in a frame because it set 'X-Frame-Options' to 'SAMEORIGIN'.
```

**Solution**: Server-side proxy that:
1. Fetches content from kawai-global.com on the server
2. Strips the X-Frame-Options header
3. Rewrites asset URLs to proxy through our API
4. Adds CORS headers for all assets
5. Returns proxied content to the iframe

### How the Proxy Works

#### Request Flow

```
User clicks "View in 3D"
    ↓
Modal opens with iframe src="/api/3d-viewer-proxy?model=ca901"
    ↓
Next.js API Route receives request
    ↓
Server fetches HTML from kawai-global.com
    ↓
Server rewrites URLs in HTML:
    src="models/file.gltf" → src="/api/3d-viewer-proxy?asset=models/file.gltf"
    ↓
Server strips X-Frame-Options and adds CORS headers
    ↓
HTML returned to iframe
    ↓
Browser loads rewritten HTML
    ↓
Asset requests go to /api/3d-viewer-proxy?asset=...
    ↓
Proxy fetches assets from kawai-global.com with CORS headers
    ↓
3D model loads successfully ✅
```

### Proxy Implementation Details

**Location**: `/src/app/api/3d-viewer-proxy/route.ts`

**Key Features**:
- **Dual-mode operation**: Handles both HTML and asset requests
- **URL rewriting**: Rewrites both absolute (`/models/file.gltf`) and relative (`models/file.gltf`) paths
- **Path normalization**: Ensures asset paths include `/modelviewer/` prefix
- **CORS headers**: Adds `Access-Control-Allow-Origin: *` to all responses
- **Caching strategy**: 15 minutes for HTML, 1 year for immutable assets
- **Timeout handling**: 10s for HTML, 30s for large assets
- **Error handling**: Graceful fallback with detailed error messages

**Example URLs**:
```typescript
// HTML request
GET /api/3d-viewer-proxy?model=ca901
→ Fetches https://www.kawai-global.com/modelviewer/index.php?model=ca901

// Asset request
GET /api/3d-viewer-proxy?asset=models/_CA901EP_74_WRBEPA20250530.gltf
→ Fetches https://www.kawai-global.com/modelviewer/models/_CA901EP_74_WRBEPA20250530.gltf
```

### URL Rewriting Strategy

The proxy uses two regex patterns to catch all asset references:

```typescript
// Pattern 1: Absolute paths starting with /
/(src|href)=(["'])\/([^"']*\.(?:gltf|glb|bin|png|jpg|jpeg|webp|js|css))/gi
// Matches: src="/models/file.gltf"
// Becomes: src="/api/3d-viewer-proxy?asset=/models/file.gltf"

// Pattern 2: Relative paths without leading /
/(src|href)=(["'])(?!http|\/\/|\/api|data:)([^"']*\.(?:gltf|glb|bin|png|jpg|jpeg|webp|js|css))/gi
// Matches: src="models/file.gltf"
// Becomes: src="/api/3d-viewer-proxy?asset=models/file.gltf"
```

### Performance Optimization

**Caching Headers**:
```typescript
// HTML (15 minutes, stale-while-revalidate)
'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800'

// Assets (1 year, immutable)
'Cache-Control': 'public, max-age=31536000, immutable'
```

**Why These Values**:
- **HTML**: Relatively short cache (15min) allows updates while maintaining performance
- **Assets**: Aggressive cache (1yr) since 3D models rarely change
- **Stale-while-revalidate**: Serves cached content immediately while fetching fresh content in background

### Security Considerations

**What We Do**:
- ✅ Strip X-Frame-Options to allow embedding
- ✅ Add CORS headers for cross-origin asset loading
- ✅ Validate model parameter to prevent injection
- ✅ Timeout requests to prevent hanging
- ✅ Set proper Content-Type headers

**What We Don't Do**:
- ❌ We don't modify the actual 3D viewer code
- ❌ We don't store or cache sensitive data
- ❌ We don't expose internal APIs
- ❌ We don't bypass authentication (viewer is public)

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

**Product**: CA901 Digital Piano
**Viewer URL**: `https://www.kawai-global.com/modelviewer/index.php`
**Model Params**: `?model=ca901`
**Button Text**: `View the GL-10 in 3D`
**Auto Open**: ✅ Enabled

**How It Works**:
1. System extracts `model=ca901` from modelParams
2. Hook constructs proxy URL: `/api/3d-viewer-proxy?model=ca901`
3. Proxy fetches: `https://www.kawai-global.com/modelviewer/index.php?model=ca901`
4. Assets are automatically proxied with CORS headers

**Important**: The viewerUrl field is currently used for reference only. The actual URL construction happens in the `use3DViewer` hook, which always uses the proxy route.

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

### Real-World Example: GL-10 Signature Page

Here's the actual implementation from the GL-10 signature page (`src/app/(frontend)/[slug]/gl-10-signature/page.tsx`):

#### Complete Implementation

```tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { ThreeDViewerButton, ThreeDViewerModal, use3DViewer } from '@/components/ui/3d-viewer'

function GL10SignaturePageContent() {
  const searchParams = useSearchParams()

  // Initialize 3D Viewer with configuration
  const viewer3D = use3DViewer({
    config: {
      enabled: true,
      viewerUrl: 'https://www.kawai-global.com/modelviewer/index.php',
      modelParams: '?model=ca901',
      autoOpen: true,
      buttonText: 'View the GL-10 in 3D'
    },
    productName: 'GL-10 Grand Piano',
    searchParams
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Page Content */}
      {/* ... hero, sections, etc ... */}

      {/* 3D Viewer - Floating Button */}
      <ThreeDViewerButton
        onClick={viewer3D.open}
        text="View the GL-10 in 3D"
        productName="GL-10 Grand Piano"
      />

      {/* 3D Viewer - Modal with iframe */}
      <ThreeDViewerModal
        isOpen={viewer3D.isOpen}
        onClose={viewer3D.close}
        viewerUrl={viewer3D.fullViewerUrl}
        productName="GL-10 Grand Piano"
      />
    </div>
  )
}

export default function GL10SignaturePage() {
  return <GL10SignaturePageContent />
}
```

### Product Page Integration (With CMS Data)

For dynamic product pages that fetch config from Payload CMS:

```tsx
// src/app/(frontend)/products/[slug]/page.tsx
'use client'

import { ThreeDViewerButton, ThreeDViewerModal, use3DViewer } from '@/components/ui/3d-viewer'
import type { Product } from '@/payload-types'

interface ProductPageProps {
  product: Product
  searchParams?: URLSearchParams
}

export function ProductPageRenderer({ product, searchParams }: ProductPageProps) {
  // Initialize 3D viewer hook with CMS data
  const viewer = use3DViewer({
    config: product.viewer3D,
    productName: product.name,
    searchParams
  })

  return (
    <div className="min-h-screen">
      {/* Existing page content */}
      <BlocksList blocks={product.pageContent} product={product} />

      {/* 3D Viewer components - only render if enabled in CMS */}
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

#### 2. Iframe Not Loading / Black Screen

**Symptoms**: Modal opens but iframe is black or shows error message

**Possible Causes**:
- Proxy route not compiling correctly
- Model parameter missing or incorrect
- External viewer service is down
- Asset loading failures (404 errors)
- Browser caching old HTML

**Solution**:
1. **Check dev server logs** for proxy errors:
   ```bash
   # Should see:
   [3D Viewer Proxy] Fetching HTML: https://www.kawai-global.com/...
   [3D Viewer Proxy] Rewritten model-viewer src: /api/3d-viewer-proxy?asset=...
   [3D Viewer Proxy] Successfully proxied content for model: ca901
   ```

2. **Verify model parameter** is correct:
   ```typescript
   // Check that modelParams extracts correctly
   const modelMatch = config.modelParams.match(/model=([^&]+)/)
   console.log('Model ID:', modelMatch[1]) // Should log: "ca901"
   ```

3. **Test proxy directly** in browser:
   ```
   http://localhost:3000/api/3d-viewer-proxy?model=ca901
   ```
   Should show HTML (not error page)

4. **Hard refresh browser** to clear cache:
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`

5. **Check for asset 404 errors** in Network tab:
   - All asset requests should go to `/api/3d-viewer-proxy?asset=...`
   - If you see `/api/models/...` then URL rewriting failed

6. **Verify external service** is accessible:
   ```bash
   curl -I "https://www.kawai-global.com/modelviewer/index.php?model=ca901"
   ```

#### 3. CORS Errors on 3D Assets

**Symptoms**: Console shows CORS errors like:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading
the remote resource at https://www.kawai-global.com/modelviewer/models/...
```

**Root Cause**: Asset URLs are not being rewritten to go through the proxy

**Solution**:
1. **Verify URL rewriting is working**:
   ```bash
   # Test the proxy HTML output
   curl -s "http://localhost:3000/api/3d-viewer-proxy?model=ca901" | grep "model-viewer"

   # Should show:
   # <model-viewer src="/api/3d-viewer-proxy?asset=models/..."
   # NOT:
   # <model-viewer src="models/..." (without proxy)
   ```

2. **Check regex patterns** in `route.ts`:
   - Pattern 1 catches absolute paths: `src="/models/file.gltf"`
   - Pattern 2 catches relative paths: `src="models/file.gltf"`

3. **Restart dev server** after proxy changes:
   ```bash
   # Kill all processes
   pkill -f "bun.*dev"

   # Start fresh
   bun run dev
   ```

4. **Clear browser cache completely** (not just hard refresh):
   - Open DevTools → Application → Clear Storage → Clear site data

#### 4. Auto-Open Not Working

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

#### 5. GTM Events Not Firing

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

#### 6. Modal Animation Issues

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

### Version 2.0.0 (2025-10-09)

**Server-Side Proxy Implementation**

🔥 **Breaking Changes**:
- Hook now constructs proxy URLs instead of external URLs
- `viewerUrl` field is now reference-only (not used in URL construction)

✅ **New Features**:
- Server-side proxy route at `/api/3d-viewer-proxy`
- X-Frame-Options header stripping for iframe embedding
- Automatic URL rewriting for all assets (GLTF, textures, JS, CSS)
- CORS header injection for cross-origin asset loading
- Dual-mode proxy (HTML + assets)
- Path normalization for relative URLs
- Aggressive caching (15min HTML, 1yr assets)

✅ **Implementation**:
- Production deployment on GL-10 Signature page
- Tested with CA901 3D model
- Full asset proxying working
- Performance optimized with proper cache headers

🐛 **Fixes**:
- Resolved X-Frame-Options blocking issue
- Fixed CORS errors on 3D model assets
- Fixed relative URL rewriting (both `/models/...` and `models/...`)
- Added browser cache handling instructions

📚 **Documentation**:
- Complete proxy architecture documentation
- Updated troubleshooting guide
- Added real-world integration examples
- Security considerations documented

### Version 1.0.0 (2025-01-09)

**Initial Release**

✅ CMS fields added to Products collection
✅ Core components built and tested
✅ TypeScript types defined
✅ Documentation completed

**Components Delivered**:
- `ThreeDViewerModal` - Full-screen modal with iframe
- `ThreeDViewerButton` - Floating action button
- `use3DViewer` - State management hook
- Complete TypeScript definitions
- Comprehensive documentation

**Known Issues** (Resolved in v2.0):
- Direct iframe embedding blocked by X-Frame-Options
- CORS errors on external assets

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
**Last reviewed**: 2025-10-09
**Next review**: 2026-01-09

## Quick Reference

### Testing the 3D Viewer

1. **Start dev server**: `bun run dev`
2. **Navigate to**: `http://localhost:3000/houston/gl-10-signature`
3. **Click**: "View the GL-10 in 3D" button (bottom-left)
4. **Verify**: 3D model loads without errors
5. **Check logs**: Should see proxy requests in terminal
6. **Test URL**: Try adding `?mode=3d` to auto-open

### Common Commands

```bash
# Test proxy HTML
curl -s "http://localhost:3000/api/3d-viewer-proxy?model=ca901" | head -50

# Test proxy asset
curl -I "http://localhost:3000/api/3d-viewer-proxy?asset=models/test.gltf"

# Check external service
curl -I "https://www.kawai-global.com/modelviewer/index.php?model=ca901"

# Restart dev server
pkill -f "bun.*dev" && bun run dev
```

### Key Files to Remember

- **Proxy Route**: `/src/app/api/3d-viewer-proxy/route.ts`
- **Hook**: `/src/components/ui/3d-viewer/use3DViewer.ts`
- **Modal**: `/src/components/ui/3d-viewer/ThreeDViewerModal.tsx`
- **Button**: `/src/components/ui/3d-viewer/ThreeDViewerButton.tsx`
- **Example**: `/src/app/(frontend)/[slug]/gl-10-signature/page.tsx`
