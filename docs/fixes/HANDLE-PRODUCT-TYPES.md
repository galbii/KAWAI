# Handle Different Product Types

## Overview

Extended search to handle all product types, not just pianos. Now supports:
- **Pianos** (grouped by category: digital, grand, upright, hybrid)
- **Accessories** (their own category)
- **Software** (their own category)

## Product Type Structure

### Products Collection Schema

**Type Field:**
```typescript
{
  name: 'type',
  type: 'select',
  options: [
    { label: 'Piano', value: 'piano' },
    { label: 'Accessory', value: 'accessory' },
    { label: 'Software', value: 'software' }
  ]
}
```

**Category Field (Pianos Only):**
```typescript
{
  name: 'category',
  type: 'select',
  options: [
    { label: 'Digital Piano', value: 'digital' },
    { label: 'Grand Piano', value: 'grand' },
    { label: 'Hybrid Piano', value: 'hybrid' },
    { label: 'Upright Piano', value: 'upright' }
  ]
}
```

## Grouping Logic

### For Pianos (type='piano')
Group by **category**:
- Digital Pianos
- Grand Pianos
- Upright Pianos
- Hybrid Pianos

### For Accessories (type='accessory')
Group as **one category**:
- Accessories

### For Software (type='software')
Group as **one category**:
- Software

## Implementation

### 1. Denormalized Fields Updated

**payload.config.ts - beforeSync:**
```typescript
{
  productModel: originalDoc.model,
  productImageUrl: originalDoc.imageUrl,
  productType: originalDoc.type,        // ← NEW: piano, accessory, software
  productCategory: originalDoc.category, // digital, grand, etc. (pianos only)
  productSlug: originalDoc.slug,
}
```

### 2. Search Collection Schema

Added new field:
```typescript
{
  name: 'productType',
  type: 'text',
  admin: {
    position: 'sidebar',
    description: 'Product type: piano, accessory, software',
    readOnly: true,
  },
}
```

### 3. Grouping Logic

**src/components/search/SearchBar.tsx:**
```typescript
const productsByCategory = productResults.reduce((acc, result) => {
  const productType = result.productType || 'piano'

  // For pianos, group by category (digital, grand, etc.)
  if (productType === 'piano') {
    const category = result.productCategory || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(result)
  } else {
    // For accessories and software, group by type
    if (!acc[productType]) acc[productType] = []
    acc[productType].push(result)
  }

  return acc
}, {})
```

### 4. Category Order

Updated priority order:
```typescript
const categoryOrder = [
  'digital',    // Digital Pianos
  'grand',      // Grand Pianos
  'upright',    // Upright Pianos
  'hybrid',     // Hybrid Pianos
  'accessory',  // Accessories
  'software',   // Software
]

const categoryLabels = {
  digital: 'Digital Pianos',
  grand: 'Grand Pianos',
  upright: 'Upright Pianos',
  hybrid: 'Hybrid Pianos',
  accessory: 'Accessories',
  software: 'Software',
}
```

### 5. Badge Display

Updated to show correct label:
```typescript
// For pianos: show category (digital, grand, etc.)
// For accessories/software: show type (accessory, software)
const badgeLabel = productType === 'piano'
  ? category
  : productType
```

## Visual Examples

### Search: "kawai"

**Results with mixed types:**
```
[Digital Pianos (5)] [Accessories (3)] [Software (1)]
        ↑ Active

Digital Pianos:
├─ CA-99      (badge: "digital")
├─ ES520      (badge: "digital")
└─ MP9500     (badge: "digital")
```

**Switching to Accessories:**
```
[Digital Pianos (5)] [Accessories (3)] [Software (1)]
                          ↑ Active

Accessories:
├─ Piano Bench    (badge: "accessory")
├─ Music Stand    (badge: "accessory")
└─ Dust Cover     (badge: "accessory")
```

### Search: "bench"

**Results: Only accessories:**
```
[Accessories (4)]

Accessories:
├─ Piano Bench Deluxe
├─ Piano Bench Standard
├─ Adjustable Bench
└─ Storage Bench
```

### Search: "software"

**Results: Only software:**
```
[Software (2)]

Software:
├─ Piano Learning App
└─ Virtual Soundboard
```

## Badge Colors & Styling

All product types use the same badge styling:
```css
bg-kawai-red/90 backdrop-blur-sm
text-xs font-bold text-white uppercase
```

**Badge displays:**
- Pianos: `digital`, `grand`, `upright`, `hybrid`
- Accessories: `accessory`
- Software: `software`

## Data Flow

### When Product is Created/Updated

1. **Product document** has:
   - `type`: 'piano' | 'accessory' | 'software'
   - `category`: 'digital' | 'grand' | ... (if piano)

2. **Search plugin beforeSync** fires:
   - Copies `type` to `productType`
   - Copies `category` to `productCategory`

3. **Search document** stores:
   - `productType`: for grouping non-pianos
   - `productCategory`: for grouping pianos

4. **API response** includes both fields

5. **Frontend groups**:
   - Pianos by `productCategory`
   - Others by `productType`

## Reindexing Required

To populate `productType` in existing search documents:

### Method 1: Bulk Update Script

```typescript
// scripts/resync-product-types.ts
import { getPayload } from 'payload'
import config from '@payload-config'

async function resyncProductTypes() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  console.log(`Reindexing ${products.totalDocs} products...`)

  for (const product of products.docs) {
    await payload.update({
      collection: 'products',
      id: product.id,
      data: { type: product.type || 'piano' }, // Keep same type
    })

    console.log(`✓ ${product.model} (${product.type})`)
  }

  console.log('✅ Reindex complete!')
}

resyncProductTypes()
```

Run:
```bash
bun run tsx scripts/resync-product-types.ts
```

### Method 2: Manual Update

For each product:
1. Go to `/admin/collections/products`
2. Open the product
3. Verify `type` field has a value
4. Click Save
5. Search index updates automatically

## Testing Checklist

### Type Generation
- [ ] Run `bun run payload generate:types`
- [ ] Verify `productType` in Search interface

### Reindex Products
- [ ] Run reindex script or update products manually
- [ ] Verify products have `productType` populated

### Search Testing

**Pianos:**
- [ ] Search for "CA-99" shows Digital Pianos category
- [ ] Search for "GX-7" shows Grand Pianos category
- [ ] Piano badges show category (digital, grand, etc.)

**Accessories:**
- [ ] Search for "bench" shows Accessories category
- [ ] Accessory badges show "accessory"
- [ ] Accessories grouped together

**Software:**
- [ ] Search for "app" shows Software category
- [ ] Software badges show "software"
- [ ] Software grouped together

**Mixed Results:**
- [ ] Search for "kawai" shows all types
- [ ] Categories appear in correct order
- [ ] Can switch between categories
- [ ] Badge labels correct for each type

### Console Logs
- [ ] Server logs show `productType` for each result
- [ ] Types are correct (piano, accessory, software)
- [ ] Categories correct for pianos

## Edge Cases

### Product with No Type
**Fallback:** Treated as `piano` by default
```typescript
const productType = result.productType || 'piano'
```

### Piano with No Category
**Result:** Won't show in any piano category
**Fix:** Set category field in product

### Accessory/Software with Category Field
**Result:** Ignored - uses `productType` for grouping
**Behavior:** Category field only applies to pianos

## Benefits

1. **Comprehensive Search** - All products searchable
2. **Proper Grouping** - Each type organized appropriately
3. **Flexible** - Easy to add new product types
4. **Consistent UX** - Same interface for all types
5. **Accurate Labels** - Badges show correct information

## Category Order Rationale

**Priority:**
1. **Digital Pianos** - Most popular, highest volume
2. **Grand Pianos** - Premium segment
3. **Upright Pianos** - Traditional choice
4. **Hybrid Pianos** - Modern tech
5. **Accessories** - Complementary products
6. **Software** - Digital products

This order reflects:
- Sales volume
- Customer interest
- Product hierarchy
- Natural browsing flow

## Files Modified

- `src/payload.config.ts`:
  - Added `productType` to beforeSync
  - Added `productType` field to search collection

- `src/components/search/SearchBar.tsx`:
  - Updated grouping logic to handle types
  - Added accessories and software to category order
  - Updated badge display logic
  - Added `productType` to interface

- `src/app/api/search/route.ts`:
  - Added `productType` to API response
  - Updated debug logging

## Future Enhancements

### Possible Additions:
- **Product Type Icons** - Different icons for each type
- **Type-Specific Sorting** - Different sort orders per type
- **Sub-Categories** - Accessories could have sub-types
- **Filters** - Filter within each type
- **Color Coding** - Different badge colors per type

### Example: Color-Coded Badges
```typescript
const badgeColor = {
  piano: 'bg-kawai-red/90',      // Pianos - Kawai red
  accessory: 'bg-blue-600/90',   // Accessories - Blue
  software: 'bg-green-600/90',   // Software - Green
}[productType] || 'bg-gray-600/90'
```

## Troubleshooting

### Accessories Not Showing
**Check:**
1. Product `type` field = 'accessory'
2. Product saved after code update
3. Search reindexed with new `productType` field

### Wrong Category Label
**Check:**
1. For pianos: `productCategory` should be set
2. For accessories/software: `productType` should be set
3. Badge uses correct logic (type vs category)

### Products Not Grouped Correctly
**Check:**
1. Grouping logic in SearchBar.tsx
2. Console logs showing correct types
3. Category order includes all types

## Documentation

Complete documentation in:
- `/docs/fixes/HANDLE-PRODUCT-TYPES.md` (this file)
- `/docs/fixes/SINGLE-CATEGORY-VIEW.md` (category switcher)
- `/docs/fixes/SOLUTION-search-denormalized-fields.md` (denormalization)
