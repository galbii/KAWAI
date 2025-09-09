# KAWAI Piano Website - Header System Documentation

> **Last Updated**: September 2025  
> **Version**: 2.0 - Context-Aware Navigation System

## 🎯 Overview

The KAWAI Piano Website features an intelligent, context-aware header system that adapts its display and navigation behavior based on whether users are on the main corporate site or location-specific dealer pages. This system provides a seamless user experience while maintaining brand consistency across different site contexts.

## 🏗️ Architecture Overview

### System Components

```
Frontend Layout (Server Component)
  ├── NavigationContextProvider (Client Component)
  │   └── HeaderDynamic (Server Component)
  │       └── Header (Client Component)
  │           ├── KawaiLogo (Client Component)
  │           ├── Navigation Menu
  │           └── CTA Buttons (Conditional)
```

### Data Flow

```
URL Request → Middleware → Layout → HeaderDynamic → Header → KawaiLogo
     ↓            ↓         ↓          ↓         ↓         ↓
 x-pathname   Origin   DealerData  Navigation  Context  Display
 Detection   Parsing   Fetching    Generation  Aware    Logic
```

## 📁 File Structure

### Core Files

| File | Purpose | Type | Key Responsibilities |
|------|---------|------|----------------------|
| `src/middleware.ts` | Request Processing | Server | Adds `x-pathname` header for server components |
| `src/app/(frontend)/layout.tsx` | Layout Root | Server | Origin detection, NavigationContextProvider setup |
| `src/components/layout/header-dynamic.tsx` | Data Layer | Server | Fetches dealer data, generates navigation |
| `src/components/layout/header.tsx` | UI Layer | Client | Renders header UI, handles interactions |
| `src/components/ui/kawai-logo.tsx` | Logo Component | Client | Context-aware logo display and navigation |
| `src/lib/navigation-utils.ts` | Utilities | Server | Origin parsing and navigation helpers |
| `src/contexts/NavigationContext.tsx` | State Management | Client | Navigation context provider and hooks |

### Supporting Files

| File | Purpose |
|------|---------|
| `src/collections/DealerLocations.ts` | CMS collection definition |
| `src/lib/payload.ts` | Data fetching utilities |
| `src/lib/types/homepage.ts` | TypeScript type definitions |

## 🎨 Display Logic

### Main Page (/) Behavior

**Logo Display:**
```
[Kawai Logo] PIANO GALLERY
             Instrumental to Life
```

**Navigation:**
- Full navigation menu visible
- No "Visit Showroom" button
- Logo links to `/` (main homepage)

**Context:**
- `origin.isDealerLocation = false`
- `origin.basePath = "/"`
- `locationData = null`

### Dealer Location Pages (/st-louis, /dallas, etc.) Behavior

**Logo Display:**
```
[Kawai Logo] ST. LOUIS
             PIANO GALLERY
```

**Navigation:**
- Full navigation menu visible
- "Visit Showroom" button present → links to `/st-louis/contact`
- Logo links to `/st-louis` (dealer location page)

**Context:**
- `origin.isDealerLocation = true`
- `origin.basePath = "/st-louis"`
- `locationData = DealerLocationData`

## 🔧 Technical Implementation

### 1. Server-Side Origin Detection

**File**: `src/app/(frontend)/layout.tsx`

```typescript
export default async function FrontendLayout(props: { children: React.ReactNode }) {
  // Get initial navigation origin from server request
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const initialOrigin = parseNavigationOrigin(pathname)

  return (
    <NavigationContextProvider initialOrigin={initialOrigin}>
      <div className="flex min-h-screen flex-col">
        <HeaderDynamic />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NavigationContextProvider>
  )
}
```

### 2. Middleware for Pathname Detection

**File**: `src/middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

### 3. Dynamic Data Fetching

**File**: `src/components/layout/header-dynamic.tsx`

```typescript
export async function HeaderDynamic() {
  // Detect current path and extract dealer info
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const origin = parseNavigationOrigin(pathname)
  
  let locationData: DealerLocationData | null = null
  
  // If on dealer location page, fetch dealer data
  if (origin.isDealerLocation && origin.dealerSlug) {
    try {
      locationData = await getCachedDealerLocation(origin.dealerSlug)
    } catch (error) {
      console.error('Error fetching dealer location data:', error)
    }
  }

  // Generate navigation menu
  const dynamicNavigation = await generatePianoCategoriesNavigationServer()

  return <Header navigation={dynamicNavigation} locationData={locationData} />
}
```

### 4. Context-Aware Logo Component

**File**: `src/components/ui/kawai-logo.tsx`

```typescript
export function KawaiLogo({ dealerName, homeUrl, ...props }: KawaiLogoProps) {
  const { origin, isInitialized } = useNavigationContext()
  const contextAwareHomeUrl = homeUrl || (isInitialized ? origin.basePath : '/')
  
  // Parse dealer name into location and suffix based on navigation context
  const parseLocationText = (dealerName?: string) => {
    // If we're on the main site (not a dealer location), show just PIANO GALLERY
    if (!origin.isDealerLocation) {
      return { location: '', suffix: 'PIANO GALLERY' }
    }
    
    // For dealer locations, show the dealer name
    if (!dealerName) {
      return { location: 'ST. LOUIS', suffix: 'PIANO GALLERY' }
    }
    
    // Handle different dealer name formats
    if (dealerName.toUpperCase().includes('PIANO GALLERY')) {
      const location = dealerName.replace(/PIANO GALLERY/i, '').trim().toUpperCase()
      return { location: location || 'KAWAI', suffix: 'PIANO GALLERY' }
    } else {
      return { location: dealerName.toUpperCase(), suffix: 'PIANO GALLERY' }
    }
  }

  const { location, suffix } = parseLocationText(dealerName)

  return (
    <Link href={contextAwareHomeUrl}>
      {/* Logo rendering logic */}
      {location ? (
        <>
          <div>{location}</div>
          <div>{suffix}</div>
        </>
      ) : (
        <>
          <div>{suffix}</div>
          <div>Instrumental to Life</div>
        </>
      )}
    </Link>
  )
}
```

### 5. Conditional CTA Buttons

**File**: `src/components/layout/header.tsx`

```typescript
export function Header({ navigation, locationData }: HeaderProps) {
  return (
    <header>
      {/* Logo */}
      <KawaiLogo dealerName={locationData?.locationName} />
      
      {/* Navigation */}
      <Navigation items={navigation} />
      
      {/* CTA Buttons - Only show Visit Showroom on dealer location pages */}
      {locationData && (
        <motion.div>
          <Button asChild>
            <Link href={`/${locationData.slug}/contact`}>
              Visit Showroom
            </Link>
          </Button>
        </motion.div>
      )}
    </header>
  )
}
```

## 🧭 Navigation Context System

### Context Provider

**File**: `src/contexts/NavigationContext.tsx`

```typescript
export interface NavigationOrigin {
  basePath: string          // '/' or '/st-louis'
  isDealerLocation: boolean // false or true
  dealerSlug?: string      // undefined or 'st-louis'
  locationName?: string    // undefined or 'St. Louis Showroom'
}

export function NavigationContextProvider({ 
  children, 
  initialOrigin 
}: NavigationContextProviderProps) {
  const [origin, setOrigin] = useState<NavigationOrigin>(
    initialOrigin || { basePath: '/', isDealerLocation: false }
  )
  const [isInitialized, setIsInitialized] = useState(false)

  // Client-side updates based on URL changes
  useEffect(() => {
    const newOrigin = parseNavigationOrigin(pathname, searchParams)
    setOrigin(newOrigin)
    setIsInitialized(true)
  }, [pathname, searchParams])

  return (
    <NavigationContext.Provider value={{ origin, isInitialized, updateOrigin }}>
      {children}
    </NavigationContext.Provider>
  )
}
```

### Navigation Utilities

**File**: `src/lib/navigation-utils.ts`

```typescript
export function parseNavigationOrigin(
  pathname: string, 
  searchParams?: URLSearchParams
): NavigationOrigin {
  // Check for explicit origin in search params first
  const originParam = searchParams?.get('origin')
  if (originParam) {
    const isDealerLocation = originParam !== '/' && originParam.startsWith('/')
    return {
      basePath: originParam,
      isDealerLocation,
      dealerSlug: isDealerLocation ? originParam.slice(1) : undefined
    }
  }

  // Parse from pathname
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // If no segments, we're at root
  if (pathSegments.length === 0) {
    return { basePath: '/', isDealerLocation: false }
  }

  const firstSegment = pathSegments[0]
  
  // Check if first segment looks like a dealer location
  const knownRoutes = [
    'pianos', 'admin', 'api', 'sitemap.xml', 'robots.txt', 
    'products', 'innovation', 'heritage', 'resources', 
    'experience', 'contact'
  ]
  
  if (!knownRoutes.includes(firstSegment)) {
    // Likely a dealer location
    return {
      basePath: `/${firstSegment}`,
      isDealerLocation: true,
      dealerSlug: firstSegment
    }
  }

  // Default to main site
  return { basePath: '/', isDealerLocation: false }
}
```

## 📊 Data Integration

### DealerLocations Collection

**File**: `src/collections/DealerLocations.ts`

The header system integrates with the CMS `DealerLocations` collection:

```typescript
{
  slug: string,              // "st-louis", "chicago"
  locationName: string,      // "St. Louis Showroom"  
  isActive: boolean,         // Controls visibility
  locationText: string,      // "St. Louis's Premier Kawai Piano Dealer"
  showroomInfo: {
    name: string,            // "Kawai Piano Gallery St. Louis"
    address: string,
    phone: string,
    serviceArea: string
  },
  // ... other CMS fields
}
```

### API Endpoints

| Endpoint | Purpose | Returns |
|----------|---------|---------|
| `/api/dealer-locations/active-slugs` | Get all active dealer slugs | `{ slugs: string[], count: number }` |
| `/api/dealer-locations/by-slug/[slug]` | Get specific dealer data | `DealerLocationData` |

## 🎯 User Experience Flow

### Scenario 1: User Visits Main Site

1. **URL**: `https://kawai.com/`
2. **Detection**: `parseNavigationOrigin('/')` → `{ basePath: '/', isDealerLocation: false }`
3. **Header Display**: "PIANO GALLERY" + "Instrumental to Life"
4. **Navigation**: No "Visit Showroom" button
5. **Logo Click**: Returns to `/`

### Scenario 2: User Visits Dealer Location

1. **URL**: `https://kawai.com/st-louis`
2. **Detection**: `parseNavigationOrigin('/st-louis')` → `{ basePath: '/st-louis', isDealerLocation: true, dealerSlug: 'st-louis' }`
3. **Data Fetch**: Retrieves St. Louis dealer information
4. **Header Display**: "ST. LOUIS" + "PIANO GALLERY"
5. **Navigation**: "Visit Showroom" button → `/st-louis/contact`
6. **Logo Click**: Returns to `/st-louis`

### Scenario 3: User Navigates from Dealer to Products

1. **Starting Point**: `/st-louis` (dealer location)
2. **User Action**: Clicks "Digital Pianos" → `/pianos/digital?origin=/st-louis`
3. **Context Preservation**: Origin parameter maintains context
4. **Logo Behavior**: Still links back to `/st-louis`
5. **User Experience**: Can return to original dealer location

## 🔍 Debugging & Troubleshooting

### Common Issues

#### 1. Header Shows Wrong Location
**Symptoms**: Header displays "ST. LOUIS" on main page or wrong location name  
**Causes**:
- `parseNavigationOrigin()` incorrectly detecting dealer location
- NavigationContext not initialized properly
- Middleware not setting `x-pathname` header

**Debug Steps**:
```typescript
// Add to KawaiLogo component for debugging
console.log('Navigation Debug:', {
  pathname: usePathname(),
  origin,
  isInitialized,
  locationData: dealerName
})
```

#### 2. "Visit Showroom" Button Shows on Main Page
**Symptoms**: CTA button appears when it shouldn't  
**Causes**:
- `locationData` is not null when it should be
- Conditional rendering logic error

**Debug Steps**:
```typescript
// Add to Header component
console.log('Header Debug:', {
  hasLocationData: !!locationData,
  locationSlug: locationData?.slug,
  shouldShowButton: !!locationData
})
```

#### 3. Logo Links to Wrong URL
**Symptoms**: Logo doesn't return to expected page  
**Causes**:
- `contextAwareHomeUrl` calculation error
- NavigationContext providing wrong `basePath`

**Debug Steps**:
```typescript
// Add to KawaiLogo component
console.log('Logo Navigation Debug:', {
  contextAwareHomeUrl,
  homeUrl,
  originBasePath: origin.basePath,
  isInitialized
})
```

### Environment Variables

```bash
# Required for proper server-side data fetching
NEXT_PUBLIC_SITE_URL=http://localhost:3001  # Match development server port
DATABASE_URI=mongodb+srv://...              # CMS database connection
```

### Performance Monitoring

```typescript
// Add to HeaderDynamic for performance tracking
const startTime = performance.now()
const locationData = await getCachedDealerLocation(origin.dealerSlug)
console.log(`Header data fetch: ${performance.now() - startTime}ms`)
```

## 🚀 Deployment Considerations

### Build Requirements

1. **Static Generation**: Dealer location pages are pre-rendered at build time
2. **Middleware**: Must be deployed with Vercel/Next.js compatible hosting
3. **Environment Variables**: All production URLs must be correctly configured

### Cache Strategy

- **Dealer Data**: 5-minute cache via `next: { revalidate: 300 }`
- **Navigation Menu**: Generated server-side with product data caching
- **Static Assets**: Logo images pre-loaded with Next.js Image optimization

## 🔄 Future Enhancements

### Planned Features

1. **Multi-Language Support**: Localized header text based on dealer location
2. **Geolocation**: Automatic dealer detection based on user location  
3. **A/B Testing**: Different header layouts for conversion optimization
4. **Analytics Integration**: Track navigation patterns between main/dealer sites

### Extension Points

1. **Custom Dealer Branding**: Support for dealer-specific colors/logos
2. **Dynamic CTAs**: Context-aware button text and destinations
3. **Search Integration**: Location-aware search results
4. **Mobile Optimization**: Dealer-specific mobile navigation menus

## 📝 Maintenance Checklist

### Regular Tasks

- [ ] Verify all active dealer locations render properly
- [ ] Test navigation context preservation across page transitions
- [ ] Validate CTA buttons appear/hide correctly
- [ ] Check logo navigation URLs for all contexts
- [ ] Monitor header rendering performance
- [ ] Update documentation for new dealer locations

### When Adding New Dealers

1. Add dealer data to `DealerLocations` collection in CMS
2. Verify slug follows URL-friendly format (`kebab-case`)
3. Test header display with new dealer data
4. Confirm contact page routing (`/[slug]/contact`)
5. Update navigation context if needed

### When Modifying Header

1. Test both main site and dealer location contexts
2. Verify server-side rendering works correctly
3. Check mobile responsive behavior
4. Validate accessibility (ARIA labels, keyboard navigation)
5. Update TypeScript types if interface changes

---

## 📚 References

- **Next.js 15 App Router**: [Documentation](https://nextjs.org/docs/app)
- **Payload CMS**: [Collection Documentation](https://payloadcms.com/docs/configuration/collections)
- **Navigation Context Pattern**: Based on React Context + URL state management
- **Middleware Usage**: [Next.js Middleware Guide](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**Document Maintained By**: Development Team  
**Last Review**: September 2025  
**Next Review**: December 2025