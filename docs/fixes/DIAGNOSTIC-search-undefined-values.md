# Diagnostic: Search Undefined Values

## Issue
Search API returns `undefined` for `model`, `imageUrl`, and `category` fields from products.

## Root Cause Analysis

The issue is likely one of:

1. **Depth not populating polymorphic relationships** - Even with `depth: 2`, the search plugin's polymorphic `doc` field may not populate the related Product document
2. **No products in database** - Products collection is empty
3. **Search index not synced** - Search collection hasn't indexed the products yet
4. **Field access issue** - We're accessing fields incorrectly

## Diagnostic Steps

### Step 1: Check if Products Exist

Visit: `http://localhost:3000/api/test-products`

This will return:
```json
{
  "productsCount": 10,
  "searchDocsCount": 5,
  "firstProduct": {
    "model": "CA-99",
    "imageUrl": "https://...",
    "category": "digital"
  },
  "firstSearchDoc": {
    "title": "CA-99",
    "valueType": "string" or "object",
    "isPopulated": true or false
  }
}
```

**Check server console** for detailed logs.

### Step 2: Interpret Results

#### If `productsCount: 0`
**Problem**: No products in database

**Solution**:
1. Go to `/admin/collections/products`
2. Check if products exist
3. If not, sync from Shopify or create test products

#### If `valueType: "string"` and `isPopulated: false`
**Problem**: Depth not populating the relationship

**Solutions**:
1. Polymorphic relationships may not support depth properly
2. Need to fetch product separately
3. Or store denormalized data in search collection

#### If `valueType: "object"` and `isPopulated: true`
**Problem**: Data exists but not being accessed correctly in SearchBar

**Solution**: Check the field access in SearchBar component

### Step 3: Search for a Product

1. Go to `http://localhost:3000`
2. Press `L` to focus search
3. Type a product name (e.g., "CA" or "piano")
4. Check **server console** (terminal) for debug logs

Look for:
```
=== SEARCH API DEBUG ===
First result structure: {
  'doc.value type': 'string' or 'object'
  'doc.value is string': true or false
}

Product result [abc123]: {
  'is populated': true or false
  model: 'CA-99' or 'NOT POPULATED - just ID'
}
```

## Known Issue: Polymorphic Relationship Depth

From Payload docs:
> When using polymorphic relationships (relationTo array), the `value` field contains either an ID (string) or the full document (object) when populated.

**However**: The search plugin may not properly populate polymorphic relationships even with `depth: 2`.

## Solutions

### Option 1: Denormalize Data in Search Collection

Store `model`, `imageUrl`, `category` directly in the search document during `beforeSync`:

```typescript
beforeSync: ({ originalDoc, searchDoc }) => {
  if (originalDoc.model) { // It's a product
    return {
      ...searchDoc,
      // Store denormalized data
      productModel: originalDoc.model,
      productImageUrl: originalDoc.imageUrl,
      productCategory: originalDoc.category,
    }
  }
  return searchDoc
}
```

### Option 2: Fetch Product Separately

In the search API, when we detect unpopulated IDs, fetch the products:

```typescript
const productIds = results.docs
  .filter(doc => doc.doc.relationTo === 'products' && typeof doc.doc.value === 'string')
  .map(doc => doc.doc.value as string)

if (productIds.length > 0) {
  const products = await payload.find({
    collection: 'products',
    where: { id: { in: productIds } },
  })

  // Map products to results
  // ...
}
```

### Option 3: Use Search Index with Algolia/Meilisearch

Replace Payload's search plugin with a dedicated search service that stores all searchable fields directly.

## Next Steps

1. Run the test endpoint: `/api/test-products`
2. Search for a product and check console logs
3. Report findings
4. Implement appropriate solution based on diagnostic results
