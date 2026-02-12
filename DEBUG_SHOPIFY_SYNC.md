# Shopify Sync Debug Guide

## Overview

Comprehensive debug logging has been added to the Shopify bulk sync process to help diagnose issues with custom metafields (`custom.blueprint` and `custom.specifications`).

## What Was Added

### 1. Enhanced GraphQL Queries

**File**: `src/lib/shopify/fetch-all-products.ts`

The bulk sync query now includes:
- `metafield_model` - Product model identifier
- `metafield_blueprint` - Blueprint image file reference
- `metafield_specifications` - Specifications metaobject list

```graphql
metafield_blueprint: metafield(namespace: "custom", key: "blueprint") {
  reference {
    ... on MediaImage {
      image {
        url
        altText
        width
        height
      }
    }
  }
}

metafield_specifications: metafield(namespace: "custom", key: "specifications") {
  references(first: 50) {
    edges {
      node {
        ... on Metaobject {
          id
          type
          fields {
            key
            value
          }
        }
      }
    }
  }
}
```

### 2. Debug Logging at Multiple Levels

#### Level 1: Bulk Sync Page-Level Logging
```
[Shopify Fetch All] Transforming product 1/50: Product Name
[Shopify Fetch All] - Model: CA99
[Shopify Fetch All] - Blueprint metafield exists: true
[Shopify Fetch All] - Specifications metafield exists: true
[Shopify Fetch All] - Blueprint details: {...}
[Shopify Fetch All] - Specifications details: {...}
```

#### Level 2: Transform-Level Logging
```
[Transform] Blueprint metafield raw for Product Name: {...}
[Transform] ✅ Blueprint image found for Product Name: https://...
[Transform] Specifications metafield raw for Product Name: {...}
[Transform] ✅ Processed 5 specifications for Product Name
```

#### Level 3: Individual Specification Logging
```
[Transform] Processing specification metaobject for Product Name: {
  id: "gid://shopify/Metaobject/123",
  fields: [
    { key: "spec", value: "Keyboard" },
    { key: "type", value: "Grand Feel III" },
    { key: "details", value: "88-key wooden-key keyboard..." }
  ]
}
```

## Running the Debug Sync

### 1. Via Payload Admin UI

1. Start dev server: `bun run dev`
2. Go to http://localhost:3000/admin
3. Navigate to Products collection
4. Click "Bulk Sync from Shopify" button
5. Open browser console and terminal to see debug output

### 2. Via API

```bash
# Start dev server
bun run dev

# In another terminal, trigger bulk sync
curl -X POST http://localhost:3000/api/products/bulk-sync-from-shopify \
  -H "Content-Type: application/json" \
  -H "Cookie: payload-token=YOUR_TOKEN"

# Watch terminal for debug output
```

## Interpreting Debug Output

### Blueprint Metafield

**Case 1: No Blueprint Set in Shopify**
```
[Transform] No blueprint metafield found for Product Name
```
✅ **Expected**: Product doesn't have blueprint uploaded in Shopify

**Case 2: Blueprint Metafield Exists But Empty**
```
[Transform] Blueprint metafield exists but no reference for Product Name: { key: "blueprint", value: null, type: "file_reference" }
```
⚠️ **Issue**: Metafield defined but no file uploaded
**Fix**: Upload blueprint image in Shopify Admin

**Case 3: Blueprint Reference But No Image**
```
[Transform] Blueprint reference exists but no image for Product Name: { id: "gid://shopify/MediaImage/123" }
```
⚠️ **Issue**: Media reference broken or image processing failed
**Fix**: Re-upload blueprint image in Shopify

**Case 4: Blueprint Found Successfully**
```
[Transform] ✅ Blueprint image found for Product Name: https://cdn.shopify.com/.../blueprint.png
```
✅ **Success**: Blueprint will sync to Payload

### Specifications Metafield

**Case 1: No Specifications Set**
```
[Transform] No specifications metafield found for Product Name
```
✅ **Expected**: Product doesn't have specifications metaobjects

**Case 2: Metafield Defined But No Metaobjects Linked**
```
[Transform] Specifications metafield exists but no references for Product Name: { key: "specifications", value: "[]", type: "list.metaobject_reference" }
```
⚠️ **Issue**: Metafield exists but no metaobjects assigned
**Fix**: Create specification metaobjects and link to product

**Case 3: Specifications Found Successfully**
```
[Transform] Processing specification metaobject for Product Name: {
  id: "gid://shopify/Metaobject/456",
  fields: [
    { key: "spec", value: "Polyphony" },
    { key: "type", value: "256 notes" },
    { key: "details", value: "Maximum simultaneous notes" }
  ]
}
[Transform] ✅ Processed 5 specifications for Product Name
```
✅ **Success**: Specifications will sync to Payload

## Common Issues & Solutions

### Issue 0: Specifications `references` Returns Null (MOST COMMON)

**Symptoms:**
```
[Transform] Specifications metafield exists but references is null for Kawai ES520
{
  key: 'specifications',
  value: '["gid://shopify/Metaobject/148539637915"]',
  type: 'list.metaobject_reference',
  references: null
}
[Transform] ⚠️ This usually means:
[Transform]   1. Missing 'read_metaobjects' access scope in Shopify app
[Transform]   2. Metaobjects are in draft state (not published)
[Transform]   3. Metaobjects were deleted
```

**Root Cause:**
Your Shopify app is missing the `read_metaobjects` OAuth scope. Without this scope, Shopify GraphQL API cannot resolve metaobject references and returns `references: null`.

**Solution:**

**Step 1: Add `read_metaobjects` scope to your Shopify app**

Choose the method that matches your app setup:

**Option A: Custom App (Shopify Admin)**
1. Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" → Select your app
3. Configuration tab → Admin API access scopes
4. Enable: ✅ `read_metaobjects`
5. Save → API credentials tab → Click "Reinstall app"

**Option B: Partner Dashboard App**
1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Apps → Select your app → Configuration
3. Scopes → Check ✅ `read_metaobjects`
4. Save → Reinstall app on your store

**Option C: Shopify CLI App (`shopify.app.toml`)**
```toml
scopes = "read_products,read_metaobjects"
```
Then run: `shopify app deploy`

**Step 2: Verify scope is active**

Run this test query in Shopify Admin API GraphiQL:

```graphql
query TestScopes {
  product(id: "gid://shopify/Product/YOUR_PRODUCT_ID") {
    title
    specs: metafield(namespace: "custom", key: "specifications") {
      value
      references(first: 1) {
        edges {
          node {
            ... on Metaobject {
              id
            }
          }
        }
      }
    }
  }
}
```

**Expected Results:**
- ✅ With scope: `references.edges` contains data
- ❌ Without scope: `references` is `null`

**Step 3: Re-run bulk sync**

```bash
bun run dev

# In another terminal
curl -X POST http://localhost:3000/api/products/bulk-sync-from-shopify
```

**Expected Terminal Output:**
```
[Transform] ✅ Processed 5 specifications for Kawai ES520 Digital Piano
```

**If still failing after adding scope:**
1. Verify metaobjects are published (not draft) in Shopify Admin → Content → Metaobjects
2. Verify metaobject IDs in `value` field actually exist
3. Check Shopify Admin API logs for permission errors

### Issue 1: Metafields Not Showing in Debug Output

**Symptoms:**
```
[Shopify Fetch All] - Blueprint metafield exists: false
[Shopify Fetch All] - Specifications metafield exists: false
```

**Possible Causes:**
1. Metafield definitions not created in Shopify
2. Metafields created but not in `custom` namespace
3. Metafield keys don't match exactly (`blueprint`, `specifications`)

**Solution:**
Run the setup queries from `SHOPIFY_CUSTOM_FIELDS_GUIDE.md`:
```bash
# Check if metafield definitions exist
query {
  metafieldDefinitions(ownerType: PRODUCT, first: 50) {
    edges {
      node {
        namespace
        key
        type {
          name
        }
      }
    }
  }
}
```

### Issue 2: Blueprint Metafield Returns Null Reference

**Symptoms:**
```
[Transform] Blueprint metafield exists but no reference: { key: "blueprint", value: null, ... }
```

**Cause:** File not uploaded in Shopify Admin

**Solution:**
1. Go to Shopify Admin → Products → Select product
2. Scroll to Metafields section
3. Find "Product Blueprint" field
4. Upload an image file
5. Save product
6. Re-run sync

### Issue 3: Specifications Metafield Returns Empty Array

**Symptoms:**
```
[Transform] Specifications metafield exists but no references: { ..., references: { edges: [] } }
```

**Cause:** Metaobjects not created or not linked to product

**Solution:**

**Step 1**: Create specification metaobjects
```graphql
mutation {
  metaobjectCreate(metaobject: {
    type: "specification_object",
    fields: [
      { key: "spec", value: "Keyboard" },
      { key: "type", value: "Grand Feel III Action" },
      { key: "details", value: "88-key wooden-key keyboard with let-off simulation" }
    ]
  }) {
    metaobject {
      id
    }
  }
}
```

**Step 2**: Link to product
```graphql
mutation {
  productUpdate(input: {
    id: "gid://shopify/Product/YOUR_PRODUCT_ID",
    metafields: [
      {
        namespace: "custom",
        key: "specifications",
        type: "list.metaobject_reference",
        value: "[\"gid://shopify/Metaobject/123\"]"
      }
    ]
  }) {
    product {
      id
    }
  }
}
```

### Issue 4: Field Names Don't Match in Metaobject

**Symptoms:**
```
[Transform] Processing specification metaobject: {
  fields: [
    { key: "specification_name", value: "Keyboard" },  // ❌ Wrong key
    { key: "specification_type", value: "..." }         // ❌ Wrong key
  ]
}
```

**Cause:** Metaobject fields created with different names than expected

**Expected Field Names:**
- `spec` (single_line_text_field)
- `type` (multi_line_text_field)
- `details` (multi_line_text_field)

**Solution:** Recreate metaobject definition with correct field names (see `SHOPIFY_CUSTOM_FIELDS_GUIDE.md`)

## Verifying Successful Sync

After running bulk sync, check:

### 1. Terminal Output
Look for:
```
[Transform] ✅ Blueprint image found for [Product]: https://...
[Transform] ✅ Processed X specifications for [Product]
```

### 2. Payload Admin
1. Go to Products → Select synced product
2. Check "Product Details" tab
3. Verify:
   - **Blueprint** section shows URL (if product has blueprint)
   - **Specifications** array populated (if product has specs)

### 3. Database
```bash
# Check MongoDB directly
mongosh
use kawai-piano

db.products.findOne(
  { model: "CA99" },
  { blueprint: 1, specifications: 1 }
)
```

Expected output:
```json
{
  "blueprint": {
    "url": "https://cdn.shopify.com/.../blueprint.png",
    "alt": "CA99 Blueprint",
    "width": 1920,
    "height": 1080
  },
  "specifications": [
    {
      "id": "gid://shopify/Metaobject/123",
      "spec": "Keyboard",
      "type": "Grand Feel III Action",
      "details": "88-key wooden-key keyboard..."
    }
  ]
}
```

## Next Steps

1. **Run bulk sync** and review terminal output
2. **Identify which products** have blueprint/specifications in Shopify
3. **Fix metafield setup** in Shopify if metafields aren't appearing
4. **Upload files** and **create metaobjects** for products that need them
5. **Re-run sync** to verify fixes

## Removing Debug Logging (Production)

Once you've diagnosed the issue, you can reduce logging verbosity by:

1. Commenting out detailed `console.log` statements in:
   - `src/lib/shopify/fetch-all-products.ts` (transform function)
   - `src/lib/shopify/fetch-product.ts` (transform function)

2. Keep only essential logs:
   - ✅ Keep: Error logs, success summaries, page counts
   - ❌ Remove: Per-product transformation logs, raw metafield dumps

## Support

If issues persist:
1. Copy full terminal output from sync
2. Copy a sample product's metafield structure from Shopify GraphiQL:
```graphql
query {
  product(id: "gid://shopify/Product/YOUR_ID") {
    metafield_blueprint: metafield(namespace: "custom", key: "blueprint") {
      type
      value
      reference {
        __typename
      }
    }
    metafield_specifications: metafield(namespace: "custom", key: "specifications") {
      type
      value
      references(first: 5) {
        edges {
          node {
            __typename
          }
        }
      }
    }
  }
}
```
3. Check Shopify Admin API version matches `src/lib/shopify/admin-client.ts`
