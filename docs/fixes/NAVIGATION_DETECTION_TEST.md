# Navigation Detection Test - Store Route Update

## What Was Fixed

Updated the navigation detection logic to properly recognize the new `/store/[storeslug]` route structure for storefronts.

### Files Changed:
1. `src/lib/navigation-utils.ts` - Updated `parseNavigationOrigin()` function

## How Navigation Detection Works Now

### URL Structure Detection

The `parseNavigationOrigin()` function now handles:

1. **New Store Routes** (Primary):
   - `/store/st-louis` → Detected as storefront "st-louis"
   - `/store/st-louis/contact` → Detected as storefront "st-louis"
   - `/store/houston/signature` → Detected as storefront "houston"

2. **Legacy Routes** (Fallback - will be redirected by middleware):
   - `/st-louis` → Still detected as storefront, then redirected to `/store/st-louis`
   - `/st-louis/contact` → Detected, then redirected to `/store/st-louis/contact`

3. **Non-Storefront Routes**:
   - `/pianos` → Main site
   - `/products/some-piano` → Main site
   - `/about` → Main site

## Testing the Fix

### Manual Testing Steps

1. **Start the development server:**
   ```bash
   bun run dev
   ```

2. **Test New Store URLs:**
   - Visit: `http://localhost:3000/store/st-louis`
   - **Expected**: Header shows "St. Louis" location, "Visit Showroom" button appears
   - **Expected**: Footer shows St. Louis contact information

3. **Test Store Sub-Routes:**
   - Visit: `http://localhost:3000/store/st-louis/contact`
   - **Expected**: Header still shows "St. Louis" context
   - **Expected**: Footer maintains location data

4. **Test Legacy URLs (Should Redirect):**
   - Visit: `http://localhost:3000/st-louis`
   - **Expected**: Redirects to `/store/st-louis`
   - **Expected**: After redirect, header/footer show location context

5. **Test Main Site Pages:**
   - Visit: `http://localhost:3000/pianos`
   - **Expected**: Header shows NO storefront location
   - **Expected**: "Visit Showroom" button is hidden
   - **Expected**: Footer shows generic contact info

### Programmatic Testing

You can test the detection logic directly in the browser console:

```javascript
// Import the utility (if in a component with the hook)
const { origin } = useNavigationContext();

// Check the detected values
console.log('Is Dealer Location:', origin.isDealerLocation);
console.log('Dealer Slug:', origin.dealerSlug);
console.log('Base Path:', origin.basePath);
```

### Expected Results by URL

| URL | isDealerLocation | dealerSlug | basePath |
|-----|------------------|------------|----------|
| `/` | false | undefined | `/` |
| `/pianos` | false | undefined | `/` |
| `/products/some-piano` | false | undefined | `/` |
| `/store/st-louis` | true | `st-louis` | `/store/st-louis` |
| `/store/st-louis/contact` | true | `st-louis` | `/store/st-louis` |
| `/store/houston/signature` | true | `houston` | `/store/houston` |
| `/st-louis` (legacy) | true | `st-louis` | `/st-louis` |

## What This Enables

### Header Behavior
- **Storefront Context**: Shows location name, displays "Visit Showroom" button with correct link
- **Main Site**: Shows no location, no visit button

### Footer Behavior
- **Storefront Context**: Shows location-specific contact info (phone, address, hours)
- **Main Site**: Shows generic company contact information

### Logo Behavior
- Clicking the logo returns users to their context:
  - On storefront pages: Returns to `/store/{slug}`
  - On main site: Returns to `/`

### Navigation Links
- Links preserve user context via `?origin=/store/st-louis` query parameter
- Users stay within their storefront context when browsing products

## Implementation Details

### Key Change in `parseNavigationOrigin()`

```typescript
// NEW: Check if this is a /store/[storeslug] route
if (firstSegment === 'store' && secondSegment) {
  return {
    basePath: `/store/${secondSegment}`,
    isDealerLocation: true,
    dealerSlug: secondSegment
  }
}
```

This ensures:
1. Routes starting with `/store/` are recognized
2. The second segment is extracted as the dealer slug
3. The full path `/store/{slug}` is set as the base path

### Components That Use This

All these components automatically get the updated detection:

1. **Header** (`src/components/layout/header.tsx`)
   - Shows current location name
   - Conditionally displays "Visit Showroom" button
   - Fetches storefront data for display

2. **Footer** (`src/components/layout/footer-dynamic.tsx`)
   - Shows location-specific contact information
   - Displays hours and address

3. **NavigationContext** (`src/contexts/NavigationContext.tsx`)
   - Provides context to all child components
   - Persists selection in session storage

4. **ContextAwareLink** (`src/components/ui/ContextAwareLink.tsx`)
   - Preserves storefront context across navigation

## Troubleshooting

### Header not showing location?
1. Check browser console for `[NavigationContext]` logs
2. Verify URL matches `/store/{slug}` pattern
3. Check that storefront exists and is active in CMS

### Footer not showing location contact?
1. Verify the slug exists in Storefronts collection
2. Check CMS for contact information (showroomInfo fields)
3. Look for console errors in `FooterDynamic`

### Redirects not working?
1. Check middleware is running (look for `[Middleware]` logs)
2. Verify `/api/storefronts/active-slugs` returns your storefront
3. Clear browser cache and try again

## Success Criteria

✅ Header detects storefront on `/store/*` URLs
✅ Footer shows location data on `/store/*` URLs
✅ Main site pages show no storefront context
✅ Legacy URLs redirect and maintain context
✅ Sub-routes maintain parent storefront context
✅ Navigation links preserve user context

---

**Test Date**: Run tests after deploying to verify production behavior.
