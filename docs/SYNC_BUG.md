# Shopify Sync Bug Analysis — Products Collection

**Date**: 2026-02-17
**Status**: Identified, fix pending
**Files affected**: `src/collections/Products.ts`, `src/lib/shopify/sync-to-payload.ts`

---

## Overview

When a Shopify sync runs (bulk sync or auto-sync on save), two bugs cause custom CMS data to be overwritten or cleared. Fields that should only be managed by editors are being reset to defaults or emptied.

---

## Bug 1 — `pageContent` Overwritten With Defaults on Every Sync

### What happens

The `beforeChange` hook in `Products.ts` adds default page blocks when `data.pageContent` is empty/undefined:

```ts
// Products.ts ~line 1087
if (!data.pageContent || data.pageContent.length === 0) {
  data.pageContent = defaultBlocks
}
```

During any sync (`transformShopifyToPayload` → `payload.update()`), `pageContent` is **never included** in the update payload. So `data.pageContent` is `undefined` in the hook — making the condition `true`. The hook writes default blocks to `data.pageContent`, which gets saved to the database, **overwriting any existing custom page content** the editor built.

This affects:
- All custom blocks editors have added
- Any media or images placed inside `pageContent` blocks
- Product hero overrides, feature slides, collection showcase links, etc.

### Why it happens

The hook was written to populate defaults for newly created products, but it has no guard to distinguish between a `create` and an `update` operation.

### Fix

Add `operation === 'create'` guard:

```ts
// BEFORE
if (!data.pageContent || data.pageContent.length === 0) {

// AFTER
if (operation === 'create' && (!data.pageContent || data.pageContent.length === 0)) {
```

---

## Bug 2 — `variations[].image` (and other custom variation fields) Cleared on Sync

### What happens

Both sync paths build a fresh `variations` array from Shopify data:

**`transformShopifyToPayload`** (Products.ts) and **`syncShopifyDataToProduct`** (sync-to-payload.ts) map Shopify variants to:

```ts
{
  name, shopifyVariantId, price, compareAtPrice,
  sku, barcode, available, inventoryQuantity,
  imageUrl, options
}
```

The following fields defined in the Products schema are **not included** in the synced data:

| Field | Type | Purpose |
|-------|------|---------|
| `image` | upload (Media) | Manual image override per variation |
| `weight` | group (value + unit) | Shipping weight |
| `inventoryPolicy` | select | Oversell behavior (DENY/CONTINUE) |

Because Payload **replaces the entire array** when an array field is updated, and the synced variation items don't include these fields, any manually set values are wiped on every sync.

### Why it happens

Payload's Local API update sends a MongoDB `$set` containing the full `variations` array. Since each item in the new array is missing `image`, `weight`, and `inventoryPolicy`, those sub-fields are not written — effectively clearing them.

### Fix

In the `beforeChange` hook, after receiving the partial update data, merge incoming `variations` with the existing variation data from `originalDoc`, preserving custom fields by matching on `shopifyVariantId`:

```ts
// Add `originalDoc` to hook destructuring
async ({ data, req, operation, context, originalDoc }) => {

// After the pageContent block:
if (operation === 'update' && Array.isArray(data.variations) && originalDoc?.variations) {
  const existingByVariantId = new Map<string, any>(
    (originalDoc.variations as any[])
      .filter((v) => v.shopifyVariantId)
      .map((v) => [v.shopifyVariantId as string, v])
  )

  data.variations = (data.variations as any[]).map((variant) => {
    if (!variant.shopifyVariantId) return variant
    const existing = existingByVariantId.get(variant.shopifyVariantId)
    if (!existing) return variant

    return {
      ...variant,
      // Preserve manual override fields not synced from Shopify
      image: existing.image,
      weight: existing.weight,
      inventoryPolicy: existing.inventoryPolicy,
    }
  })
}
```

---

## About `customMedia` — Should Be Safe

The `customMedia` array (editor-curated images and YouTube videos) is **never included** in the sync update payload. Payload v3 uses partial/delta updates — only fields present in `data` are written via MongoDB `$set`. Fields absent from `data` are preserved in the database.

From Payload docs:
> *"On update operations, data contains only the fields being changed and may omit the id and any unchanged fields."*

So `customMedia` should not be reset by syncs. If it appears to be clearing, check:
1. Whether the admin UI is submitting `customMedia: []` on a manual save after sync
2. Whether there's a race condition between the auto-sync hook and a manual save

### Caveat — Fields With `defaultValue`

Payload applies `defaultValue` during both create **and** update operations when a field is missing or undefined in the incoming data. Watch these fields in the sync payload:

| Field | Default | In sync payload? |
|-------|---------|-----------------|
| `status` | `'draft'` | ✅ Yes (bulk sync) |
| `price.currency` | `'USD'` | ✅ Yes |
| `variations[].available` | `true` | ✅ Yes |
| `variations[].inventoryPolicy` | `'DENY'` | ❌ No (preserved by Fix 2) |
| `visibility.showInCatalog` | `true` | ❌ No — may reset |
| `visibility.allowReviews` | `true` | ❌ No — may reset |

---

## Affected Sync Paths

| Sync Path | Trigger | Bug 1? | Bug 2? |
|-----------|---------|--------|--------|
| Bulk sync (admin button) | `POST /bulk-sync-from-shopify` | ✅ Yes | ✅ Yes |
| Auto-sync (afterChange hook) | Product save with `autoSync: true` | ✅ Yes | ✅ Yes |
| Manual sync (server action) | `syncProductWithShopify()` | ✅ Yes | ✅ Yes |

All three paths call `payload.update()` without `pageContent` or the custom variation fields, so both bugs affect all sync paths.

---

## Implementation Checklist

- [ ] Add `operation === 'create'` guard to `pageContent` default blocks logic
- [ ] Add `originalDoc` to `beforeChange` hook destructuring
- [ ] Add variation merge logic in `beforeChange` hook
- [ ] Run `bun run build` to confirm no TypeScript errors
- [ ] Test: create a new product via bulk sync → verify default blocks added
- [ ] Test: re-sync existing product → verify `pageContent` preserved
- [ ] Test: set a variation image, re-sync → verify image preserved
- [ ] Test: add items to `customMedia`, re-sync → verify items preserved
