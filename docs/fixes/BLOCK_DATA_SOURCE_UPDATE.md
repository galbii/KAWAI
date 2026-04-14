# Block Data Source Update - Piano Collection & News Carousel

## Overview

Updated the Piano Collection and News Carousel blocks to pull data from the HomePage collection tabs by default, with options to override or extend the data.

**Also removed:** The "Instrumental To Life" tab from HomePage collection (the I2L block is still available in the Page Builder, just not as a dedicated tab).

## Key Fixes Applied

### Critical Bug Fixes

**1. Nullish Coalescing (`??`) vs Logical OR (`||`)**

**Problem:** Using `||` operator treated empty strings as falsy, causing block values to be overwritten with defaults.

```typescript
// ❌ WRONG - Empty strings get replaced
props.collectionTitle || 'Default Title'  // "" becomes "Default Title"

// ✅ CORRECT - Only null/undefined get replaced
props.collectionTitle ?? 'Default Title'  // "" stays ""
```

**Applied to:**
- Piano Collection Renderer
- News Carousel Renderer
- Piano Gallery Renderer

**2. Array Checking for News Carousel**

**Problem:** Combined mode wasn't properly checking if `additionalNewsItems` was an array with items.

```typescript
// ❌ WRONG - Doesn't check if array has items
if (props.additionalNewsItems) { ... }

// ✅ CORRECT - Validates array and length
if (props.additionalNewsItems && Array.isArray(props.additionalNewsItems) && props.additionalNewsItems.length > 0) { ... }
```

---

## Changes Made

### 1. Piano Collection Block (`src/blocks/marketing/PianoCollection.ts`)

**Before:**
- Had hardcoded default values for all fields
- No connection to Products collection
- No connection to HomePage "Piano Collection" tab

**After:**
- **Empty by default** - No hardcoded default values
- Three data source modes:
  1. **Use Homepage Piano Collection Tab** (default)
  2. **Use Featured Products from Collection**
  3. **Custom Content (Override)**

**New Fields:**
- `dataSource` (radio) - Choose data source mode
- `featuredPianos` (relationship) - Select specific products when using "Featured Products" mode
- All content fields (title, description, CTA, video) now conditional based on `dataSource`

**Usage:**
- **Homepage Tab Mode**: Pulls all content from HomePage > Piano Collection tab
- **Featured Products Mode**: Shows relationship selector to pick specific pianos from Products collection
- **Custom Mode**: Shows all fields for manual override

---

### 2. News Carousel Block (`src/blocks/marketing/NewsCarousel.ts`)

**Before:**
- Had hardcoded default newsItems array with 3 items
- No connection to HomePage "News Carousel" tab

**After:**
- **Empty by default** - No hardcoded news items
- Three data source modes:
  1. **Use Homepage News Carousel Tab Only** (default)
  2. **Combine Homepage + Additional News Items**
  3. **Custom News Items Only**

**New Fields:**
- `dataSource` (radio) - Choose data source mode
- `additionalNewsItems` (array) - Replaces `newsItems`, shown conditionally
- `autoPlayDuration` now optional (inherits from Homepage if not set)

**Usage:**
- **Homepage Only**: Displays all news from HomePage > News Carousel tab
- **Combined Mode**: Shows Homepage news PLUS additional items from block
- **Custom Mode**: Only shows items added directly to block

---

### 3. Piano Collection Renderer (`src/components/blocks/marketing/PianoCollectionRenderer.tsx`)

**Changes:**
- Now an `async` function (fetches data server-side)
- Fetches data from HomePage collection when `dataSource === 'homepage'`
- Uses block-specific values when `dataSource === 'custom'`
- Supports featured products mode (ready for future enhancement)

**Data Flow:**
```
dataSource = 'homepage' → Fetch from HomePage.collectionSectionHeader, etc.
dataSource = 'featured' → Use featuredPianos relationship (future: display products)
dataSource = 'custom' → Use block.collectionTitle, etc.
```

---

### 4. News Carousel Renderer (`src/components/blocks/marketing/NewsCarouselRenderer.tsx`)

**Changes:**
- Now uses `??` (nullish coalescing) instead of `||` for proper null handling
- Added explicit array validation: `Array.isArray()` and `.length > 0` checks
- Properly checks if `autoPlayDuration` is null/undefined (not falsy)
- Ensures combined mode correctly appends block items to homepage items

**Data Flow:**
```
dataSource = 'homepage' → Use HomePage.newsItems
dataSource = 'combined' → Merge HomePage.newsItems + block.additionalNewsItems (with validation)
dataSource = 'custom' → Use block.additionalNewsItems only
```

---

### 5. Piano Gallery Renderer (`src/components/blocks/marketing/PianoGalleryRenderer.tsx`)

**Changes:**
- Now an `async` function (fetches data server-side)
- Fetches data from HomePage collection when `dataSource === 'homepage'`
- Uses block-specific values when `dataSource === 'custom'`
- Uses `??` (nullish coalescing) for proper null handling

**Data Flow:**
```
dataSource = 'homepage' → Fetch from HomePage.galleryTitle, galleryDescription, pianoCategories
dataSource = 'custom' → Use block.galleryTitle, block.galleryDescription, block.pianoCategories
```

---

### 6. Piano Gallery Block (`src/blocks/marketing/PianoGallery.ts`)

**Before:**
- Had hardcoded default values for all fields
- No connection to HomePage "Piano Gallery" tab

**After:**
- **Empty by default** - No hardcoded default values
- Two data source modes:
  1. **Use Homepage Piano Gallery Tab** (default)
  2. **Custom Categories (Override)**

**New Fields:**
- `dataSource` (radio) - Choose data source mode
- All content fields (title, description, categories) now conditional based on `dataSource`

**Usage:**
- **Homepage Tab Mode**: Pulls all content from HomePage > Piano Gallery tab
- **Custom Mode**: Shows all fields for manual override

---

### 7. Products Collection (`src/collections/Products.ts`)

**Added:**
- `featured` (checkbox) - Mark products as featured for homepage display
- Position: Sidebar
- Default: `false`

**Purpose:**
- Allows filtering products for homepage piano collection block
- Future enhancement: Auto-populate featured pianos based on this flag

---

## How to Use

### For Editors:

#### Piano Collection Block:
1. Add the "🎹 Piano Collection" block to your page
2. Choose data source:
   - **Homepage Tab** (recommended): Automatically uses content from HomePage > Piano Collection tab
   - **Featured Products**: Select specific pianos to showcase
   - **Custom Content**: Override with block-specific content

#### News Carousel Block:
1. Add the "📰 News Carousel" block to your page
2. Choose data source:
   - **Homepage Only**: Shows news from HomePage > News Carousel tab
   - **Combined**: Homepage news + additional items you add
   - **Custom Only**: Only shows items you add to this block

### For Developers:

#### Making a Product Featured:
```typescript
// In Payload admin:
1. Go to Products collection
2. Edit a product
3. Check "featured" checkbox in sidebar
4. Save
```

#### Accessing Featured Products:
```typescript
const featuredProducts = await payload.find({
  collection: 'products',
  where: {
    featured: { equals: true },
    status: { equals: 'active' },
    type: { equals: 'Piano' }
  }
})
```

---

## Benefits

✅ **No duplicate content** - Single source of truth in HomePage tabs
✅ **Empty by default** - Blocks don't have hardcoded values
✅ **Flexible** - Can override or extend as needed
✅ **Editor-friendly** - Clear options with conditional fields
✅ **Maintainable** - Update Homepage tab once, reflects everywhere

---

## Migration Notes

### Existing Sites:
- Existing blocks will default to `dataSource: 'homepage'`
- Content will pull from HomePage tabs automatically
- No manual migration needed

### New Sites:
- HomePage tabs are the primary content source
- Blocks are empty by default
- Fill in HomePage > Piano Collection and News Carousel tabs first
- Add blocks to pages using "Use Homepage Tab" mode

---

## Next Steps (Future Enhancements)

1. **Auto-featured products**: Filter products with `featured: true` in Piano Collection block
2. **Product grid rendering**: Display featured pianos as cards instead of video
3. **News from Posts collection**: Pull blog posts into News Carousel
4. **Category-based filtering**: Filter pianos by category (Grand, Digital, etc.)

---

## Files Changed

```
src/blocks/marketing/PianoCollection.ts
src/blocks/marketing/NewsCarousel.ts
src/components/blocks/marketing/PianoCollectionRenderer.tsx
src/components/blocks/marketing/NewsCarouselRenderer.tsx
src/collections/Products.ts
src/payload-types.ts (auto-generated)
```
