# Verify Product Types Are Filled

## Current Configuration

### Products Collection Type Field

The Products collection has a `type` field with these values:
```typescript
type: 'piano' | 'accessory' | 'software'
```

### Search Collection Denormalized Field

The search plugin stores this as `productType`:
```typescript
productType: originalDoc.type  // Copied during beforeSync
```

### Grouping Logic

**SearchBar component groups products:**
- If `productType === 'piano'` → group by `productCategory` (digital, grand, upright, hybrid)
- If `productType === 'accessory'` → group under "Accessories"
- If `productType === 'software'` → group under "Software"

## Category Order

```typescript
const categoryOrder = [
  'digital',      // Piano category
  'grand',        // Piano category
  'upright',      // Piano category
  'hybrid',       // Piano category
  'accessory',    // Product type
  'software',     // Product type
]
```

## How to Verify & Fix

### Step 1: Check Current Products

Go to `/admin/collections/products` and verify each product has:
- **type** field set to: `piano`, `accessory`, or `software`
- **category** field set (if piano): `digital`, `grand`, `upright`, or `hybrid`

### Step 2: Test Search with Logging

1. Search for "piano" or any product
2. Open **browser console** (not server terminal)
3. Look for logs like:
```
Product: Kawai CA-99 {
  productType: 'piano',
  productCategory: 'digital',
  willGroupAs: 'digital'
}

Product: Piano Bench {
  productType: 'accessory',
  productCategory: undefined,
  willGroupAs: 'accessory'
}

Product: Piano Learning App {
  productType: 'software',
  productCategory: undefined,
  willGroupAs: 'software'
}
```

### Step 3: Check Server Logs

Server terminal should show:
```
Product result [abc123]: {
  title: 'Kawai CA-99',
  productType: 'piano',        ← Should be set!
  productCategory: 'digital',   ← For pianos only
  productImageUrl: 'https://...',
  productSlug: 'ca-99'
}
```

### Step 4: Verify Search Tabs

When searching, you should see tabs like:
```
[Digital Pianos (5)] [Accessories (3)] [Software (1)]
```

**Not:**
```
[Digital Pianos (5)] [Other Products (4)]  ← Wrong!
```

## Common Issues

### Issue 1: Products Show in "Other Products"

**Symptom:** Products grouped under "Other" instead of proper categories

**Cause:** `productType` is undefined or null in search documents

**Solution:**
1. Check product's `type` field in admin
2. Update the product (triggers search reindex)
3. Verify `productType` in search collection

### Issue 2: Accessories/Software Not Showing

**Symptom:** Non-piano products don't appear in search

**Cause 1:** Products don't have `type` field set
- Go to product in admin
- Set `type` to 'accessory' or 'software'
- Save

**Cause 2:** Products not reindexed yet
- Edit and save each product
- Or run bulk reindex script

### Issue 3: All Products Showing as "Piano"

**Symptom:** Accessories showing in piano categories

**Cause:** Products have `type='piano'` when they shouldn't

**Solution:**
- Update product's `type` field to correct value
- Save to trigger reindex

## Reindex Script

If you have many products, use this script:

```typescript
// scripts/verify-and-fix-types.ts
import { getPayload } from 'payload'
import config from '@payload-config'

async function verifyAndFixTypes() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  console.log(`\nChecking ${products.totalDocs} products...\n`)

  for (const product of products.docs) {
    // Verify type field
    if (!product.type) {
      console.warn(`⚠️  ${product.model} - Missing type field!`)
      continue
    }

    // Verify category for pianos
    if (product.type === 'piano' && !product.category) {
      console.warn(`⚠️  ${product.model} - Piano missing category!`)
    }

    // Update to trigger reindex
    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        type: product.type,
        category: product.category,
      },
    })

    const typeEmoji = {
      piano: '🎹',
      accessory: '🪑',
      software: '💿',
    }[product.type] || '❓'

    console.log(`${typeEmoji} ${product.model} - ${product.type}${product.category ? ` (${product.category})` : ''}`)
  }

  console.log('\n✅ Verification and reindex complete!')
}

verifyAndFixTypes()
```

Run:
```bash
bun run tsx scripts/verify-and-fix-types.ts
```

## Expected Results

### Proper Grouping

**Search: "kawai"**
```
[Digital Pianos (4)]     ← Pianos with category='digital'
[Grand Pianos (2)]       ← Pianos with category='grand'
[Accessories (3)]        ← Products with type='accessory'
[Software (1)]           ← Products with type='software'
```

### Product Data Structure

Each product in search should have:

**Piano Example:**
```json
{
  "productType": "piano",
  "productCategory": "digital",
  "productModel": "CA-99",
  "productImageUrl": "https://...",
  "productSlug": "ca-99"
}
```

**Accessory Example:**
```json
{
  "productType": "accessory",
  "productCategory": null,
  "productModel": "Bench-DLX",
  "productImageUrl": "https://...",
  "productSlug": "bench-deluxe"
}
```

**Software Example:**
```json
{
  "productType": "software",
  "productCategory": null,
  "productModel": "Piano-App-Pro",
  "productImageUrl": "https://...",
  "productSlug": "piano-app"
}
```

## Testing Checklist

### Data Verification
- [ ] All products have `type` field set
- [ ] All pianos have `category` field set
- [ ] Accessories have `type='accessory'`
- [ ] Software has `type='software'`

### Search Functionality
- [ ] Search shows correct category tabs
- [ ] Pianos grouped by category (digital, grand, etc.)
- [ ] Accessories grouped under "Accessories"
- [ ] Software grouped under "Software"
- [ ] No "Other Products" tab (unless truly needed)

### Console Logs
- [ ] Browser console shows correct productType
- [ ] Server logs show productType populated
- [ ] willGroupAs shows correct category/type

### User Experience
- [ ] Can switch between all product categories
- [ ] Each category shows correct products
- [ ] Product counts accurate
- [ ] Navigation works to all product types

## Troubleshooting Commands

### Check Product Types in DB
```typescript
// In Payload admin GraphQL playground
query {
  Products(limit: 100) {
    docs {
      model
      type
      category
    }
  }
}
```

### Check Search Collection
```typescript
// In Payload admin GraphQL playground
query {
  Search(limit: 100) {
    docs {
      title
      productType
      productCategory
    }
  }
}
```

### Manual Product Update (via API)
```bash
curl -X PATCH http://localhost:3000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"type": "accessory"}'
```

## Summary

The configuration is correct:
✅ Products collection has `type` field
✅ Search plugin copies to `productType`
✅ Grouping logic uses `productType`
✅ Category order includes all types

**What you need to do:**
1. Verify products have `type` field set correctly
2. Reindex products (edit and save each one)
3. Test search to verify grouping
4. Check console logs to confirm data

Once products are reindexed with correct types, search will automatically group them properly!
