# Solution: Search with Denormalized Product Fields

## Problem Confirmed

From your diagnostic logs:
```
'doc.value type': 'string',
'doc.value is string': true,
'doc.value (preview)': '69700852b45b0f0c7510509b'  ← Just an ID!
```

**Root Cause**: Payload's search plugin uses a polymorphic relationship that does NOT populate even with `depth: 2`. The `doc.value` field contains just the product ID string, not the full Product object.

## Solution: Denormalized Fields

Instead of relying on relationship population, we now store product data directly in the search document during the `beforeSync` hook.

### Changes Made

#### 1. Updated `payload.config.ts`

**beforeSync Hook** - Stores denormalized data:
```typescript
if (collectionSlug === 'products') {
  return {
    ...searchDoc,
    title: originalDoc.name || originalDoc.model,
    excerpt: originalDoc.description?.substring(0, 200),
    category: originalDoc.category || originalDoc.type,
    tags: productTags,
    // Denormalized fields stored directly in search doc
    productModel: originalDoc.model,
    productImageUrl: originalDoc.imageUrl,
    productCategory: originalDoc.category,
    productSlug: originalDoc.slug,
  }
}
```

**searchOverrides** - Added new fields:
- `productModel` (text)
- `productImageUrl` (text)
- `productCategory` (text)
- `productSlug` (text)

#### 2. Updated `src/app/api/search/route.ts`

Returns denormalized fields in API response:
```typescript
return {
  id: doc.id,
  title: doc.title,
  doc: doc.doc,
  // ... other fields
  productModel: doc.productModel,
  productImageUrl: doc.productImageUrl,
  productCategory: doc.productCategory,
  productSlug: doc.productSlug,
}
```

#### 3. Updated `src/components/search/SearchBar.tsx`

Uses denormalized fields instead of `doc.value`:
```typescript
const model = result.productModel || result.title
const imageUrl = result.productImageUrl
const category = result.productCategory || result.category
const slug = result.productSlug
```

## Required Steps to Apply Fix

### Step 1: Generate TypeScript Types

```bash
bun run payload generate:types
```

This updates `src/payload-types.ts` with the new search collection fields.

### Step 2: Resync Search Index

You need to trigger the search plugin to resync all products. There are two ways:

#### Option A: Via Admin UI (if available)

1. Go to `/admin/collections/search`
2. Look for a "Resync" or "Reindex" button
3. Click to resync all documents

#### Option B: Via Product Updates

Edit any product in `/admin/collections/products`:
1. Open a product
2. Make a small change (or just save without changes)
3. Save
4. The `beforeSync` hook will fire and populate the denormalized fields
5. Repeat for all products (or just the ones you want searchable)

#### Option C: Programmatic Resync (Recommended)

Create a script to resync all products:

```typescript
// scripts/resync-search.ts
import { getPayload } from 'payload'
import config from '@payload-config'

async function resyncSearch() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    limit: 100,
  })

  console.log(`Found ${products.totalDocs} products to resync`)

  for (const product of products.docs) {
    // Updating the product triggers beforeSync hook
    await payload.update({
      collection: 'products',
      id: product.id,
      data: product, // Save with same data to trigger sync
    })
    console.log(`Resynced: ${product.model}`)
  }

  console.log('Search index resync complete!')
}

resyncSearch()
```

Run with:
```bash
bun run tsx scripts/resync-search.ts
```

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
bun run dev
```

### Step 4: Test Search

1. Press `L` to focus search
2. Type a product name (e.g., "MP9500")
3. Check server console for logs
4. Verify you see:
```
Product result [xxx]: {
  model: 'MP9500',  ← Should have value!
  imageUrl: 'https://...',  ← Should have URL!
  category: 'digital'  ← Should have category!
}
```

## Why This Solution Works

### Before (Broken)
```
Search Doc → Polymorphic Relationship → Product ID (string)
                 ↓ depth: 2 doesn't work
           [NOT POPULATED]
```

### After (Fixed)
```
Search Doc → Direct Fields
           - productModel: "MP9500"
           - productImageUrl: "https://..."
           - productCategory: "digital"
           [ALWAYS AVAILABLE]
```

## Benefits

1. **No Relationship Issues**: Data is stored directly, no depth population needed
2. **Faster**: No additional queries or relationship resolution
3. **Reliable**: Always works, no undefined values
4. **Search-Optimized**: Denormalization is standard for search indexes

## Tradeoffs

1. **Data Duplication**: Product data stored in two places (Products + Search collections)
2. **Manual Sync**: If you update a product, search auto-updates via hooks
3. **Slightly Larger DB**: Search collection stores more fields

## Verification Checklist

- [ ] Types generated: `bun run payload generate:types`
- [ ] Search index resynced (via one of the methods above)
- [ ] Dev server restarted
- [ ] Search tested and working
- [ ] Product images rendering in search results
- [ ] Model names displaying correctly
- [ ] Category badges showing

## Next Steps

After completing the steps above:
1. Search for "piano" or "MP9500"
2. Verify images and model names appear
3. Check that clicking navigates to correct product page
4. Test keyboard navigation (Arrow keys, Enter, L key)

## Troubleshooting

If images still don't show after resyncing:

1. **Check if productImageUrl is populated**:
   - Visit `/api/test-products`
   - Look for `firstSearchDoc.productImageUrl`

2. **Check if products have imageUrl**:
   - Go to `/admin/collections/products`
   - Open a product
   - Verify `imageUrl` field has a value
   - If empty, sync from Shopify

3. **Check console logs**:
   - Search for a product
   - Check server console for denormalized field values

4. **Manually test one product**:
   - Edit one product in admin
   - Save it (triggers beforeSync)
   - Search for that product
   - Verify it works before resyncing all
