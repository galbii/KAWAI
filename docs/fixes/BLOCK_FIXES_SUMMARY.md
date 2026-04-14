# Block Data Source Fixes - Summary

## 🐛 Critical Bugs Fixed

### 1. **Nullish Coalescing (`??`) vs Logical OR (`||`)**

**Problem:**
Using `||` operator treated empty strings as falsy, causing custom block values to be overwritten with default values.

```typescript
// ❌ WRONG - Empty strings get replaced with defaults
const title = props.collectionTitle || 'Default Title'
// If props.collectionTitle = "", result is "Default Title"

// ✅ CORRECT - Only null/undefined get replaced
const title = props.collectionTitle ?? 'Default Title'
// If props.collectionTitle = "", result is ""
```

**Impact:**
- Piano Collection block in "Custom" mode couldn't save empty strings
- News Carousel block couldn't override with empty values
- Piano Gallery block had same issue

**Fixed in:**
- `PianoCollectionRenderer.tsx`
- `NewsCarouselRenderer.tsx`
- `PianoGalleryRenderer.tsx`

---

### 2. **News Carousel Array Validation**

**Problem:**
Combined mode wasn't properly validating if `additionalNewsItems` was an array with items before appending.

```typescript
// ❌ WRONG - Doesn't validate array properly
if (props.additionalNewsItems) {
  newsItems = [...newsItems, ...additionalItems]
}

// ✅ CORRECT - Validates array and checks length
if (props.additionalNewsItems && Array.isArray(props.additionalNewsItems) && props.additionalNewsItems.length > 0) {
  newsItems = [...newsItems, ...additionalItems]
}
```

**Impact:**
- Combined mode might not append block items correctly
- Could cause runtime errors if additionalNewsItems was unexpected type

**Fixed in:**
- `NewsCarouselRenderer.tsx`

---

## ✨ Feature Additions

### 3. **Piano Gallery Block - Data Source Pattern**

Added the same data source pattern used by Piano Collection and News Carousel blocks.

**New Structure:**
```typescript
{
  dataSource: 'homepage' | 'custom',

  // Conditional fields (only show in custom mode):
  galleryTitle?: string,
  galleryDescription?: string,
  pianoCategories?: Array<{...}>
}
```

**Modes:**
1. **Homepage Tab** (default) - Pulls from HomePage > Piano Gallery tab
2. **Custom** - Use block-specific categories

**Benefits:**
- Consistent with other marketing blocks
- Single source of truth in HomePage tabs
- Can override per-page if needed

---

## 📊 Before vs After Comparison

### Piano Collection Block

| Aspect | Before | After |
|--------|--------|-------|
| Empty string handling | Replaced with defaults | Preserved as-is |
| Default values | Hardcoded in block | Removed (pull from HomePage) |
| Data source | Block only | Homepage / Featured / Custom |
| Null handling | Used `||` operator | Uses `??` operator |

### News Carousel Block

| Aspect | Before | After |
|--------|--------|-------|
| Array validation | Basic truthiness check | Explicit array + length check |
| Appending logic | Simple concat | Validated concat with proper checks |
| Empty string handling | Replaced with defaults | Preserved as-is |
| Default values | Hardcoded 3 news items | Removed (pull from HomePage) |
| Data source | Block only | Homepage / Combined / Custom |
| Null handling | Used `||` operator | Uses `??` operator |

### Piano Gallery Block

| Aspect | Before | After |
|--------|--------|-------|
| Data source | Block only (hardcoded) | Homepage / Custom |
| Default values | 4 hardcoded categories | Removed (pull from HomePage) |
| Renderer type | Sync function | Async function (fetches data) |
| Null handling | Used `||` operator | Uses `??` operator |

---

## 🔧 Technical Changes

### All Renderers

**Changed:**
```typescript
// Before
export function BlockRenderer(props) { ... }

// After
export async function BlockRenderer(props) { ... }
```

**Reason:** Need to fetch HomePage data server-side

### Operator Changes

**Throughout all renderers:**
```typescript
// Before
props.field || 'fallback'
props.field ? props.field : 'fallback'

// After
props.field ?? 'fallback'
```

**Why `??` is better:**
- Only treats `null` and `undefined` as missing
- Preserves empty strings `""`
- Preserves `0` and `false` values
- More predictable behavior

---

## 🎯 Data Flow Summary

### Piano Collection

```
┌─────────────────────────────────────────────┐
│ dataSource = 'homepage'                     │
│   → Fetch HomePage.collectionSectionHeader  │
│   → Use HomePage.collectionTitle            │
│   → Use HomePage.featuredVideo              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ dataSource = 'featured'                     │
│   → Use block.featuredPianos relationship   │
│   → Display selected products               │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ dataSource = 'custom'                       │
│   → Use block.collectionTitle (even if "")  │
│   → Use block.collectionDescription         │
│   → Use block.featuredVideo                 │
└─────────────────────────────────────────────┘
```

### News Carousel

```
┌─────────────────────────────────────────────┐
│ dataSource = 'homepage'                     │
│   → newsItems = HomePage.newsItems          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ dataSource = 'combined'                     │
│   → newsItems = HomePage.newsItems          │
│   → APPEND block.additionalNewsItems        │
│   → Validate array before appending         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ dataSource = 'custom'                       │
│   → newsItems = block.additionalNewsItems   │
│   → Homepage items ignored                  │
└─────────────────────────────────────────────┘
```

### Piano Gallery

```
┌─────────────────────────────────────────────┐
│ dataSource = 'homepage'                     │
│   → Fetch HomePage.galleryTitle             │
│   → Use HomePage.pianoCategories            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ dataSource = 'custom'                       │
│   → Use block.galleryTitle (even if "")     │
│   → Use block.pianoCategories               │
└─────────────────────────────────────────────┘
```

---

## ✅ Testing Checklist

**Piano Collection Block:**
- [ ] Homepage mode pulls from HomePage tab
- [ ] Custom mode preserves empty strings
- [ ] Custom mode uses block values when set
- [ ] Featured mode shows relationship selector

**News Carousel Block:**
- [ ] Homepage mode shows HomePage news
- [ ] Combined mode shows HomePage + block news (appended)
- [ ] Custom mode shows only block news
- [ ] Empty additionalNewsItems doesn't cause errors

**Piano Gallery Block:**
- [ ] Homepage mode pulls from HomePage tab
- [ ] Custom mode preserves empty strings
- [ ] Custom mode uses block categories when set
- [ ] Categories render with proper images

---

## 📝 Files Changed

```
✅ src/blocks/marketing/PianoCollection.ts
✅ src/blocks/marketing/NewsCarousel.ts
✅ src/blocks/marketing/PianoGallery.ts
✅ src/components/blocks/marketing/PianoCollectionRenderer.tsx
✅ src/components/blocks/marketing/NewsCarouselRenderer.tsx
✅ src/components/blocks/marketing/PianoGalleryRenderer.tsx
✅ src/collections/Products.ts (added 'featured' field)
✅ src/collections/HomePage.ts (removed I2L tab)
✅ src/payload-types.ts (regenerated)
✅ docs/BLOCK_DATA_SOURCE_UPDATE.md (updated)
✅ docs/BLOCK_FIXES_SUMMARY.md (this file)
```

---

## 🚀 Migration Notes

**No breaking changes** - Existing blocks will work with these fixes.

**Default behavior:**
- All blocks default to `dataSource: 'homepage'`
- Existing block instances keep their data
- HomePage tabs are now the primary content source

**Recommended workflow:**
1. Fill in HomePage tabs with default content
2. Create blocks using "Homepage" mode
3. Override per-page only when needed (use "Custom" mode)
