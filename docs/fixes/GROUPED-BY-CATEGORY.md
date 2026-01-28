# Search Results Grouped by Category

## Changes Made

### 1. Removed Image Hover Effect

**Before:**
```tsx
<Image className="group-hover:scale-110 transition-transform duration-500" />
```

**After:**
```tsx
<Image className="w-full h-full object-cover" />
```

**Why:** Cleaner UX - card still scales on hover, but image stays stable.

### 2. Group Products by Category

**Before:**
```
Products (12)
├─ CA-99 (digital)
├─ GX-7 (grand)
├─ ES520 (digital)
├─ SK-EX (grand)
└─ ...
```

**After:**
```
Digital Pianos (4)
├─ CA-99
├─ ES520
├─ MP9500
└─ ...

Grand Pianos (3)
├─ GX-7
├─ SK-EX
└─ ...

Upright Pianos (2)
├─ K-300
└─ ...

Hybrid Pianos (1)
└─ Novus NV10S
```

### 3. Implementation Details

**Grouping Logic:**
```typescript
// Group products by category
const productsByCategory = productResults.reduce((acc, result) => {
  const category = result.productCategory || result.category || 'other'
  if (!acc[category]) {
    acc[category] = []
  }
  acc[category].push(result)
  return acc
}, {} as Record<string, SearchResult[]>)

// Define category order
const categoryOrder = ['digital', 'grand', 'upright', 'hybrid']

// Map category keys to display labels
const categoryLabels: Record<string, string> = {
  digital: 'Digital Pianos',
  grand: 'Grand Pianos',
  upright: 'Upright Pianos',
  hybrid: 'Hybrid Pianos',
}
```

**Rendering:**
- Loop through `categoryOrder` to maintain consistent order
- Only show sections that have products
- Each section has its own heading with result count
- Products within each section use grid layout (2-4 columns)

### 4. Category Data Flow

**When Product is Saved/Updated:**

1. Product document has `category` field (e.g., "digital")
2. Search plugin `beforeSync` hook fires
3. Hook copies `originalDoc.category` to `productCategory`
4. Search document stores denormalized `productCategory`
5. Search API returns `productCategory` in results
6. Frontend groups by `productCategory`

**Code in `payload.config.ts`:**
```typescript
beforeSync: ({ originalDoc, searchDoc }) => {
  if (collectionSlug === 'products') {
    return {
      ...searchDoc,
      productCategory: originalDoc.category, // ← Denormalized!
      productModel: originalDoc.model,
      productImageUrl: originalDoc.imageUrl,
      productSlug: originalDoc.slug,
    }
  }
}
```

### 5. Category Field in Products Collection

**Schema Location:** `src/collections/Products.ts`

```typescript
{
  name: 'category',
  type: 'select',
  options: [
    { label: 'Digital Piano', value: 'digital' },
    { label: 'Grand Piano', value: 'grand' },
    { label: 'Hybrid Piano', value: 'hybrid' },
    { label: 'Upright Piano', value: 'upright' }
  ],
}
```

**Values:** `digital`, `grand`, `hybrid`, `upright`

### 6. Enhanced Debug Logging

**API logs denormalized fields:**
```typescript
console.log(`Product result [${doc.id}]:`, {
  title: doc.title,
  'productModel (denormalized)': doc.productModel,
  'productImageUrl (denormalized)': doc.productImageUrl,
  'productCategory (denormalized)': doc.productCategory, // ← Check this!
  'productSlug (denormalized)': doc.productSlug,
})
```

**What to look for:**
- `productCategory` should be `digital`, `grand`, `upright`, or `hybrid`
- If `undefined`, product hasn't been reindexed yet
- If wrong value, check product's category field in admin

## Visual Design

### Section Headings

Each category section has:
- Red accent bar (left side)
- Bold category label (e.g., "Digital Pianos")
- Result count in parentheses
- Consistent spacing

```
┌─ Digital Pianos (4) ────────────────┐
│                                     │
│  [Product Cards Grid]               │
└─────────────────────────────────────┘

┌─ Grand Pianos (3) ──────────────────┐
│                                     │
│  [Product Cards Grid]               │
└─────────────────────────────────────┘
```

### Card Design

**Unchanged:**
- Aspect-square image container
- Category badge (top-right)
- Model name (bottom section)
- Hover scale effect on card
- Transparent glass styling

**Changed:**
- ✅ Image no longer zooms on hover
- ✅ Removed selection indicators
- ✅ Cleaner, more stable hover state

## Reindexing for Categories

### Why Reindex?

Existing search documents may not have `productCategory` populated. They were created before we added the denormalized field.

### How to Reindex

**Option 1: Edit Products in Admin**
1. Go to `/admin/collections/products`
2. Open each product
3. Verify `category` field has a value
4. Click Save
5. Search index updates automatically

**Option 2: Bulk Update Script**

Create `scripts/resync-categories.ts`:
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

async function resyncCategories() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  console.log(`Reindexing ${products.totalDocs} products...`)

  for (const product of products.docs) {
    if (!product.category) {
      console.warn(`⚠️  Product ${product.model} has no category - skipping`)
      continue
    }

    // Update triggers beforeSync hook
    await payload.update({
      collection: 'products',
      id: product.id,
      data: { category: product.category }, // Keep same category
    })

    console.log(`✓ ${product.model} → ${product.category}`)
  }

  console.log('✅ Reindex complete!')
}

resyncCategories()
```

Run:
```bash
bun run tsx scripts/resync-categories.ts
```

**Option 3: Database Query (Advanced)**

Direct MongoDB update if needed - be careful!

## Testing Checklist

### Before Reindexing
- [ ] Search for "piano"
- [ ] Check server logs for `productCategory` values
- [ ] Verify some products show `productCategory: undefined`

### After Reindexing
- [ ] Search for "piano"
- [ ] Verify products grouped by category
- [ ] Check section headings: "Digital Pianos", "Grand Pianos", etc.
- [ ] Verify each section shows correct products
- [ ] Confirm category badges match section headings
- [ ] Test clicking products → correct URLs
- [ ] Verify images don't zoom on hover (card scales only)

### Console Output Example

**After reindex:**
```
Product result [abc123]: {
  title: 'Kawai CA-99',
  productModel: 'CA-99',
  productImageUrl: 'https://...',
  productCategory: 'digital',  ← Should have value!
  productSlug: 'ca-99'
}

Product result [def456]: {
  title: 'Kawai GX-7',
  productModel: 'GX-7',
  productImageUrl: 'https://...',
  productCategory: 'grand',  ← Should have value!
  productSlug: 'gx-7'
}
```

## Category Order

Products display in this order:
1. **Digital Pianos** (digital)
2. **Grand Pianos** (grand)
3. **Upright Pianos** (upright)
4. **Hybrid Pianos** (hybrid)

If a product has an unknown category or no category, it won't appear in any section.

## Benefits

1. **Better Organization** - Users can scan by piano type
2. **Clearer Hierarchy** - Each category is distinct
3. **Better UX** - Find specific piano type faster
4. **Consistent Grouping** - Same structure every search
5. **Scalable** - Easy to add new categories
6. **Clean Design** - No distracting animations

## Files Modified

- `src/components/search/SearchBar.tsx`:
  - Added category grouping logic
  - Removed image hover scale effect
  - Updated rendering to loop through categories
  - Changed section headings from "Products" to category names

- `src/app/api/search/route.ts`:
  - Updated debug logging to show denormalized fields
  - Verifies `productCategory` is populated

- `src/payload.config.ts`:
  - Already had `productCategory: originalDoc.category` (no changes needed)
  - beforeSync hook properly copies category

## Troubleshooting

### Products Not Showing in Any Category

**Problem:** Product has no category or invalid category value

**Solution:**
1. Check product in admin: `/admin/collections/products/{id}`
2. Verify `category` field has one of: `digital`, `grand`, `upright`, `hybrid`
3. Update if needed
4. Save to trigger reindex

### Products in Wrong Section

**Problem:** Product appears in wrong category section

**Solution:**
1. Check `productCategory` in search doc
2. Compare to `category` in product doc
3. Update product and save
4. Search index will update automatically

### Section Shows Zero Products

**Problem:** Category heading appears but no products

**Solution:**
- This shouldn't happen - we only show sections with products
- Check the filtering logic in SearchBar.tsx
- Verify `productsByCategory[categoryKey]` has items

## Next Steps

1. Reindex products (using one of the methods above)
2. Test search with "piano"
3. Verify categorization works
4. Remove debug console.logs if everything works
5. Consider adding more categories if needed (accessories, software, etc.)
