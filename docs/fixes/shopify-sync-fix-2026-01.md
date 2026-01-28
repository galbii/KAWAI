# Shopify Sync & Search Plugin Fixes - January 2026

## Issues Identified

### Issue 1: Search Plugin Tags Validation Error

**Error Message:**
```
ValidationError: The following field is invalid: Tags
"This field has an invalid selection."
```

**Root Cause:**
The search plugin's `beforeSync` hook was passing dynamic values (brand, model) as tags, but the search collection's `tags` field is configured as a `select` field with predefined options:

```typescript
// Valid options only
options: [
  { label: 'Piano', value: 'piano' },
  { label: 'Digital', value: 'digital' },
  { label: 'Grand', value: 'grand' },
  // ...etc
]
```

**Previous Code (BROKEN):**
```typescript
tags: [
  originalDoc.type,       // Could be 'piano' ✅
  originalDoc.category,   // Could be 'digital' ✅
  originalDoc.brand,      // Could be 'Kawai' ❌ NOT IN OPTIONS
  originalDoc.model,      // Could be 'GL40' ❌ NOT IN OPTIONS
].filter(Boolean),
```

**Fix:**
Filter tags to only include values that exist in the predefined options list.

```typescript
// Valid tag options from the search collection schema
const validTags = ['piano', 'digital', 'grand', 'hybrid', 'upright', 'accessory', 'software', 'page', 'faq', 'support']

// Filter tags to only include valid options
const productTags = [
  originalDoc.type,
  originalDoc.category,
].filter((tag): tag is string => Boolean(tag) && validTags.includes(tag))
```

---

### Issue 2: AfterChange Hook Transaction Context Error

**Error Message:**
```
NotFound: Not Found
    at async eval (src/collections/Products.ts:889:12)
```

**Root Cause:**
The `afterChange` hook was using a fire-and-forget pattern with `req.payload.update()` in an async callback. The problem is that `req` contains a **transaction context** that gets closed after the hook returns. When the async callback runs later, the transaction is already closed, causing a NotFound error.

**Previous Code (BROKEN):**
```typescript
afterChange: [
  async ({ doc, req, context }) => {
    // Fire-and-forget pattern
    syncShopifyDataToProduct(doc)
      .then(async (syncedData) => {
        // ❌ PROBLEM: req transaction is CLOSED by the time this runs
        await req.payload.update({
          collection: 'products',
          id: doc.id,
          data: syncedData,
          context: { skipShopifySync: true },
          req, // ⚠️ Transaction context is stale!
        })
      })

    return doc // Hook returns immediately, closing transaction
  }
]
```

**Why This Happens:**

1. Hook executes and starts async operation
2. Hook returns `doc` immediately (fire-and-forget)
3. Payload commits transaction and closes `req` context
4. Async callback tries to use closed `req` → NotFound error

**Fix:**
Use `getPayload()` to create a **fresh payload instance** without transaction context for background updates.

```typescript
afterChange: [
  async ({ doc, req, context }) => {
    // Fire-and-forget pattern using getPayload for background update
    syncShopifyDataToProduct(doc)
      .then(async (syncedData) => {
        // ✅ SOLUTION: Create fresh payload instance without transaction context
        const { getPayload } = await import('payload')
        const config = await import('@payload-config').then(m => m.default)
        const payload = await getPayload({ config })

        // Use fresh payload instance (no req, no transaction)
        await payload.update({
          collection: 'products',
          id: doc.id,
          data: syncedData,
          context: { skipShopifySync: true },
          // Note: No `req` - this is a background operation
        })
      })

    return doc
  }
]
```

---

## Key Learnings

### 1. Search Plugin Field Validation

When using `@payloadcms/plugin-search` with custom fields:

- **Select fields** require values to match predefined options
- **beforeSync hook** must filter/transform data to match schema
- **Type guards** ensure runtime type safety

### 2. Payload Transaction Context

When using hooks with async operations:

- `req` contains a **transaction context** that's tied to the current operation
- **Transaction closes** when the hook returns (even with fire-and-forget)
- **Using `req` in async callbacks** after hook return = stale context
- **Solution**: Use `getPayload()` for background operations outside transaction scope

### 3. Fire-and-Forget Pattern in Payload

**Correct Pattern:**
```typescript
afterChange: [
  async ({ doc, req, context }) => {
    // Start async work
    doAsyncWork()
      .then(async (result) => {
        // Use fresh payload instance
        const payload = await getPayload({ config })
        await payload.update({ ... }) // No `req`
      })
      .catch(error => {
        // Log but don't throw - don't block saves
        console.error(error)
      })

    // Return immediately - don't await async work
    return doc
  }
]
```

**Why This Works:**
- Hook returns immediately (doesn't block CMS save)
- Async work continues in background
- Fresh payload instance has its own transaction context
- Errors are logged but don't affect original operation

---

## Testing

### Test Case 1: Create Product with Shopify Sync

```bash
# 1. Create product in Payload admin with model "GL40"
# 2. Check console logs for sync status
# 3. Verify search document is created without validation errors
# 4. Verify product is updated with Shopify data
```

**Expected Result:**
- ✅ Product created successfully
- ✅ Search document synced with valid tags only
- ✅ Shopify data synced in background
- ✅ No NotFound or ValidationError

### Test Case 2: Search Plugin Tags

```bash
# Query search collection
curl http://localhost:3000/api/search?where[tags][contains]=piano

# Expected: Returns products with 'piano' tag
# Should NOT have brand/model in tags field
```

---

## Files Modified

1. **src/payload.config.ts** (lines 240-257)
   - Added `validTags` constant
   - Added `.filter()` to validate tags against predefined options

2. **src/collections/Products.ts** (lines 858-933)
   - Changed from `req.payload.update()` to `getPayload()` pattern
   - Added dynamic imports to avoid circular dependencies
   - Updated error handling to use fresh payload instance

---

## References

- **Payload CMS Hooks**: https://payloadcms.com/docs/hooks/overview
- **Transaction Safety**: CLAUDE.md "Transaction Safety in Hooks"
- **Search Plugin**: https://payloadcms.com/docs/plugins/search
- **Shopify Integration**: docs/integrations/shopify/shopify-integration-v2.md
