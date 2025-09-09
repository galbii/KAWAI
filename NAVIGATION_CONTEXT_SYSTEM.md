# Navigation Context System

> **Intelligent navigation that remembers where users came from**

## Overview

The Navigation Context System allows the KAWAI Piano website header to remember whether users entered from the main homepage (/) or a dealer location site (/st-louis, /dallas, etc.), ensuring users can navigate back to their original context when browsing products or other pages.

## The Problem It Solves

**Before:** 
- User visits `/st-louis` (dealer location site)
- User clicks on products link → goes to `/products/some-piano`  
- User clicks logo/home → always goes to `/` (main site) ❌

**After:**
- User visits `/st-louis` (dealer location site)
- User clicks on products link → goes to `/products/some-piano?origin=/st-louis`
- User clicks logo/home → goes back to `/st-louis` (their original context) ✅

## Architecture

The system uses a **hybrid approach** combining React Context with URL-based state management:

```
URL Params (Source of Truth) → React Context → Components
     ↓                              ↓           ↓
?origin=/st-louis            useNavigationContext   KawaiLogo
```

### Core Components

1. **Navigation Utilities** (`src/lib/navigation-utils.ts`)
   - Pure functions for parsing origins and generating URLs
   - No React dependencies, fully testable

2. **NavigationContext** (`src/contexts/NavigationContext.tsx`)
   - React Context provider and hooks
   - Automatic origin detection and session persistence

3. **Context-Aware Components**
   - `KawaiLogo` - Smart logo with origin-aware navigation
   - `ContextAwareLink` - Link wrapper that preserves context

## Key Features

### ✅ **SSR Compatible**
- Uses URL parameters as source of truth
- No hydration mismatches
- Works with Next.js 15 App Router

### ✅ **Persistent Across Refreshes**
- Session storage maintains context
- Graceful fallbacks if storage fails

### ✅ **Accessible**
- Dynamic aria-labels based on context
- Screen reader friendly
- Keyboard navigation support

### ✅ **Performance Optimized**
- Minimal re-renders
- Efficient origin parsing
- Session-based caching

## Usage Guide

### Basic Implementation

The system is automatically active once installed. The `NavigationContextProvider` wraps the frontend layout and provides context throughout the app.

#### 1. Using Context-Aware Navigation

```tsx
import { useNavigationContext } from '@/contexts/NavigationContext'

function MyComponent() {
  const { origin } = useNavigationContext()
  const homeUrl = origin.basePath // '/' or '/st-louis'
  
  return (
    <Link href={homeUrl}>Go Home</Link>
  )
}
```

#### 2. Using Context-Aware Links

```tsx
import { ContextAwareLink } from '@/components/ui/ContextAwareLink'

function Navigation() {
  return (
    <nav>
      {/* Automatically preserves origin */}
      <ContextAwareLink href="/pianos">Pianos</ContextAwareLink>
      
      {/* Explicitly ignore context */}
      <ContextAwareLink href="/contact" preserveOrigin={false}>
        Contact Main Site
      </ContextAwareLink>
    </nav>
  )
}
```

#### 3. Using Navigation Hooks

```tsx
import { useContextAwareNavigation } from '@/contexts/NavigationContext'

function SmartNavigation() {
  const { getHomeUrl, getContextAwareUrl } = useContextAwareNavigation()
  
  const homeUrl = getHomeUrl() // Context-aware home
  const pianoUrl = getContextAwareUrl('/pianos') // With context
  const aboutUrl = getContextAwareUrl('/about', false) // Without context
  
  return (
    <nav>
      <Link href={homeUrl}>Home</Link>
      <Link href={pianoUrl}>Pianos</Link>
      <Link href={aboutUrl}>About</Link>
    </nav>
  )
}
```

### Advanced Usage

#### Server-Side Origin Detection

```tsx
// In a Server Component or API route
import { createInitialNavigationOrigin } from '@/contexts/NavigationContext'

export default function ServerPage({ searchParams }) {
  const origin = createInitialNavigationOrigin(
    '/st-louis/products', 
    searchParams
  )
  
  // origin.isDealerLocation = true
  // origin.basePath = '/st-louis'
}
```

#### Conditional Rendering Based on Context

```tsx
function Header() {
  return (
    <ContextAwareLink href="/contact">
      {({ origin }) => 
        origin.isDealerLocation 
          ? `Contact ${origin.dealerSlug} Location`
          : 'Contact Us'
      }
    </ContextAwareLink>
  )
}
```

## File Structure

```
src/
├── lib/
│   └── navigation-utils.ts          # Pure utility functions
├── contexts/
│   └── NavigationContext.tsx       # React Context & hooks
├── components/
│   ├── ui/
│   │   ├── kawai-logo.tsx          # Updated with context awareness
│   │   └── ContextAwareLink.tsx    # Context-preserving Link wrapper
│   └── examples/
│       └── NavigationContextExample.tsx # Testing/demo component
├── app/
│   └── (frontend)/
│       └── layout.tsx              # NavigationContextProvider wrapper
└── middleware.ts                   # Sets x-pathname header
```

## Configuration

### Environment Variables

No additional environment variables required. The system uses existing Next.js routing.

### Middleware Setup

The system requires the existing middleware to set the `x-pathname` header:

```typescript
// src/middleware.ts (already exists)
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  
  return NextResponse.next({
    request: { headers: requestHeaders }
  })
}
```

## Testing the System

### 1. Manual Testing

1. **Visit Main Site:** Go to `http://localhost:3000/`
   - Click logo → should go to `/`
   - Navigate to products → should go to `/products`

2. **Visit Dealer Location:** Go to `http://localhost:3000/st-louis`
   - Click logo → should go to `/st-louis`
   - Navigate to products → should go to `/products?origin=/st-louis`
   - From products page, click logo → should return to `/st-louis`

### 2. Debug Component

Add the debug component to any page for testing:

```tsx
import { NavigationContextExample } from '@/components/examples/NavigationContextExample'

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <NavigationContextExample />
    </div>
  )
}
```

### 3. Browser DevTools

- Check **Session Storage** for `kawai-navigation-origin`
- Check **Network** tab for `?origin=` parameters
- Check **Console** for navigation context logs (in dev mode)

## Accessibility Features

### Screen Reader Support

```tsx
// Logo automatically generates context-aware labels
<KawaiLogo /> 
// aria-label="Kawai Piano - Return to St. Louis"
```

### Keyboard Navigation

All context-aware links maintain proper focus management and keyboard accessibility.

### Color Contrast

Debug components use accessible color combinations with sufficient contrast ratios.

## Performance Considerations

### Bundle Size Impact

- **Navigation Utils:** ~2KB gzipped
- **React Context:** ~1KB gzipped  
- **Total Impact:** ~3KB additional bundle size

### Runtime Performance

- Origin parsing: O(1) complexity
- Context updates: Minimal re-renders
- Session storage: Async, non-blocking

### Server-Side Rendering

- No hydration mismatches
- Fast server-side origin detection
- Graceful client-side fallbacks

## Troubleshooting

### Common Issues

#### 1. Context Not Working

**Symptoms:** Logo always goes to main site
**Solution:** Check that `NavigationContextProvider` wraps your layout

```tsx
// ❌ Wrong
export default function Layout({ children }) {
  return <div>{children}</div>
}

// ✅ Correct  
export default function Layout({ children }) {
  return (
    <NavigationContextProvider>
      {children}
    </NavigationContextProvider>
  )
}
```

#### 2. Origin Not Detected

**Symptoms:** `origin.isDealerLocation` is always false
**Solution:** Check middleware and x-pathname header

```bash
# Check if middleware is running
curl -I http://localhost:3000/st-louis
# Should include x-pathname header
```

#### 3. Session Storage Issues

**Symptoms:** Context resets on page refresh
**Solution:** Check browser privacy settings and console errors

```tsx
// Add error boundary for session storage
try {
  sessionStorage.setItem('test', 'value')
} catch (error) {
  console.warn('Session storage not available')
}
```

### Debug Mode

Enable debug logging in development:

```tsx
// Add to NavigationContext.tsx
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('Navigation origin updated:', origin)
}
```

## Migration Guide

### From Existing Header

If you have existing header components, update them gradually:

#### 1. Update Logo Links

```tsx
// ❌ Before
<Link href="/">
  <KawaiLogo />
</Link>

// ✅ After  
<KawaiLogo /> // Now context-aware internally
```

#### 2. Update Navigation Links

```tsx
// ❌ Before
<Link href="/products">Products</Link>

// ✅ After
<ContextAwareLink href="/products">Products</ContextAwareLink>

// Or use hooks
const { getContextAwareUrl } = useContextAwareNavigation()
<Link href={getContextAwareUrl('/products')}>Products</Link>
```

#### 3. Update Server Components

```tsx
// ❌ Before
export default function Layout({ children }) {
  return <Header />
}

// ✅ After
export default async function Layout({ children }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const initialOrigin = createInitialNavigationOrigin(pathname)
  
  return (
    <NavigationContextProvider initialOrigin={initialOrigin}>
      <Header />
    </NavigationContextProvider>
  )
}
```

## Future Enhancements

### Potential Improvements

1. **Analytics Integration**
   - Track origin-based navigation patterns
   - Measure dealer location engagement

2. **Breadcrumb Integration**
   - Context-aware breadcrumbs
   - Origin-based navigation trails

3. **Multi-Level Origins**
   - Support for nested contexts
   - Category-based origins

4. **URL Cleanup**
   - Remove origin parameters after navigation
   - Clean URLs for SEO

## Support

For questions or issues with the Navigation Context System:

1. Check this documentation
2. Review the example component (`NavigationContextExample.tsx`)
3. Test with the debug component
4. Check browser console for errors

The system is designed to be robust with graceful fallbacks, so it should work even if parts of the context system fail.