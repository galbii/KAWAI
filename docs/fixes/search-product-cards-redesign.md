# Search Product Cards Redesign

## Overview
Redesigned product cards in search results with proper Payload data integration, new layout with image on top and model at bottom, and transparent glassmorphism styling.

## Changes Made

### 1. Enhanced Search API Data Fetching

**File**: `src/app/api/search/route.ts`

**Changes**:
- Added server-side logging to debug product data structure
- Logs model, imageUrl, and category for each product result
- Helps diagnose data population issues from Payload

```typescript
// Debug: Log product data structure
if (doc.doc?.relationTo === 'products' && doc.doc?.value) {
  console.log('Product search result:', {
    id: doc.id,
    title: doc.title,
    model: (doc.doc.value as any)?.model,
    imageUrl: (doc.doc.value as any)?.imageUrl,
    category: (doc.doc.value as any)?.category,
  })
}
```

### 2. Redesigned Product Card Layout

**File**: `src/components/search/SearchBar.tsx`

#### New Card Structure

```
┌─────────────────────────┐
│                         │
│      [Product Image]    │ ← Top: Transparent card with backdrop blur
│                         │   Category badge in top-right corner
│                         │
├─────────────────────────┤
│     Model Name          │ ← Bottom: Solid section with model
└─────────────────────────┘
```

#### Key Features

**Image Section (Top)**:
- Aspect-square container for consistent sizing
- Transparent background: `bg-white/40 dark:bg-gray-800/40`
- Backdrop blur for glassmorphism effect
- Image hover zoom: `scale-110` on hover
- Category badge positioned top-right
- Fallback icon (emoji) if no image available
- Selected state overlay: `bg-kawai-red/10 border-2 border-kawai-red`

**Model Section (Bottom)**:
- Semi-opaque background: `bg-white/70 dark:bg-gray-900/70`
- Backdrop blur for consistent glass effect
- Centered, bold model name
- Text truncation for long names

**Selection Indicators**:
- Ring around entire card: `ring-2 ring-kawai-red`
- Scale effect: `scale-[1.05]`
- Red overlay on image area
- Checkmark badge in bottom-left corner

**Data Access**:
```typescript
const productData = result.doc.value
const model = productData?.model || productData?.name || result.title
const imageUrl = productData?.imageUrl
const category = productData?.category || result.category
```

### 3. Updated Section Headings

**Products Section**:
- Red accent bar indicator
- Bold uppercase heading
- Result count display

**Pages Section**:
- Gray accent bar indicator
- Consistent styling with products section

### 4. Keyboard Shortcut Added

**Feature**: Press **L** to focus search bar

**Implementation**:
- Global keyboard listener
- Only activates when not typing in other inputs
- Ignores modifier keys (Cmd, Ctrl, Alt)
- Auto-selects text for quick replacement

```typescript
useEffect(() => {
  const handleGlobalKeyPress = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable

    if (event.key === 'l' && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }

  document.addEventListener('keydown', handleGlobalKeyPress)
  return () => document.removeEventListener('keydown', handleGlobalKeyPress)
}, [])
```

### 5. Header Z-Index Enhancement

**Change**: Search input container set to `z-[10002]`

**Purpose**: Ensures header search bar remains prominent and accessible above the search overlay backdrop (`z-[10000]`) and container (`z-[10001]`)

### 6. Overlay Styling

**Background Overlay**:
- Dark backdrop: `bg-black/40`
- Creates contrast for transparent glass UI

**Glass Container**:
- Transparent gradient: `from-white/10 via-white/5 to-transparent`
- Heavy backdrop blur: `backdrop-blur-2xl`
- Subtle border: `border-white/20`

## Visual Design

### Product Card States

1. **Default State**:
   - Transparent card with backdrop blur
   - White/gray background (40% opacity)
   - Model name in bottom section
   - Category badge visible

2. **Hover State**:
   - Scale up: `scale-105`
   - Image zooms: `scale-110`
   - Smooth 300-500ms transitions

3. **Selected State** (keyboard navigation):
   - Scale up: `scale-[1.05]`
   - Red ring: `ring-2 ring-kawai-red`
   - Red overlay on image
   - Checkmark badge
   - Enhanced shadow

### Color Scheme

- **Primary Accent**: Kawai Red (`#C41E3A`)
- **Glass Effects**: White/black with 10-80% opacity
- **Borders**: White with 10-20% opacity
- **Text**: Gray-900/White for high contrast

## Data Flow

1. **User types query** (minimum 2 characters)
2. **API fetches** from search collection with `depth: 2`
3. **Server logs** product data for debugging
4. **Frontend receives** full product documents in `doc.value`
5. **Component extracts**:
   - `doc.value.model` → Model name
   - `doc.value.imageUrl` → Product image
   - `doc.value.category` → Category badge
   - `doc.value.slug` → Navigation URL
6. **Cards render** with new layout

## Browser Behavior

- **Press L**: Focus search bar
- **Type query**: Debounced search (300ms)
- **Arrow keys**: Navigate results
- **Enter**: Navigate to selected product
- **Escape**: Close overlay
- **Click backdrop**: Close overlay
- **Hover card**: Scale and zoom effects

## Debugging

When searching for products, check the **server console** (not browser) for logs like:

```
Product search result: {
  id: '...',
  title: 'CA-99',
  model: 'CA-99',
  imageUrl: 'https://cdn.shopify.com/...',
  category: 'digital'
}
```

If `imageUrl` or `model` are `undefined`, the issue is with:
1. Payload relationship population (depth: 2)
2. Product data not synced from Shopify
3. Field names not matching schema

## Responsive Design

**Grid Layout**:
- Mobile: `grid-cols-2` (2 columns)
- Tablet (md): `grid-cols-3` (3 columns)
- Desktop (lg): `grid-cols-4` (4 columns)

**Card Sizing**:
- Cards use aspect-square for consistent dimensions
- Images scale to fill container
- Model section height auto-adjusts

## Performance Optimizations

1. **Image Loading**:
   - Next.js Image component with optimization
   - Width/height specified for proper aspect ratio
   - Lazy loading for off-screen images

2. **Animations**:
   - CSS transforms (scale) for GPU acceleration
   - Smooth transitions with ease functions
   - No layout shift during animations

3. **Search Debouncing**:
   - 300ms delay before API call
   - Reduces server load
   - Cancels previous requests

## Accessibility

- **Keyboard Navigation**: Full support with arrow keys
- **Focus States**: Clear visual indicators
- **ARIA Labels**: Proper alt text on images
- **Screen Readers**: Semantic HTML structure
- **Keyboard Shortcut**: L key for quick access

## Next Steps

If product images still don't render:

1. Check server console logs for actual data structure
2. Verify Shopify sync is populating `imageUrl` field
3. Test with a known product that has an image
4. Check if Products collection has data in Payload admin
5. Verify the search plugin is indexing products correctly

## Files Modified

- `src/components/search/SearchBar.tsx` - Product card redesign, layout, keyboard shortcut
- `src/app/api/search/route.ts` - Server-side debug logging
- `docs/fixes/search-product-cards-redesign.md` - This documentation
