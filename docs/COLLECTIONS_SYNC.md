# Collections Sync

## Overview

The Collections feature automatically syncs Shopify collections to Payload CMS when products are synced. This ensures that your product collections are always up-to-date without manual intervention.

## How It Works

### Automatic Collection Creation

When a product is synced from Shopify:

1. **Product Hook Triggers** - After a product is synced, the Products `afterChange` hook checks for `shopifyCollections` data
2. **Collections Are Upserted** - For each collection referenced in the product, the system either:
   - **Creates** a new collection document if it doesn't exist
   - **Updates** the existing collection if it already exists
3. **Product Count Updated** - After upserting collections, the system counts active products in each collection

### Automatic Collection Cleanup

When a collection has no products left:

1. **Hook Detects Empty Collection** - The Collections `afterChange` hook monitors `productCount`
2. **Cleanup Delay** - Waits 2 seconds to allow product operations to complete
3. **Verification** - Double-checks that no active products reference the collection
4. **Deletion** - Removes the empty collection from the database

## Collection Structure

```typescript
{
  shopifyCollectionId: "gid://shopify/Collection/123456",
  title: "Summer Collection",
  handle: "summer-collection",
  description: "A curated selection...",
  imageUrl: "https://cdn.shopify.com/...",
  productCount: 12, // Auto-calculated
  shopify: {
    syncStatus: "synced",
    lastSyncedAt: "2024-01-15T10:30:00Z",
    collectionType: "custom" // or "smart"
  }
}
```

## Workflow Examples

### Example 1: New Product with New Collection

```
1. Product synced from Shopify with collections: ["New Arrivals", "Digital Pianos"]
2. Collections Hook runs → Creates 2 new collection documents
3. Product counts updated → Both collections show productCount: 1
```

### Example 2: Product Removed from Collection

```
1. Product updated in Shopify → Removed from "Summer Sale" collection
2. Product synced to Payload → shopifyCollections no longer includes "Summer Sale"
3. Collection product count updated → "Summer Sale" productCount decrements
4. If productCount reaches 0 → Collection deleted after 2 seconds
```

### Example 3: Bulk Product Sync

```
1. Bulk sync runs for 50 products
2. Collections Hook processes each product's collections
3. Upserts happen for all unique collections (creates new, updates existing)
4. Product counts recalculated for all affected collections
5. Any collections with productCount: 0 are cleaned up
```

## Key Functions

### `upsertCollectionsFromProduct(shopifyCollections, payload)`

**Purpose**: Creates or updates collection documents from product data

**When Called**: Automatically after products are synced

**Example**:
```typescript
await upsertCollectionsFromProduct(
  doc.shopifyCollections, // From product
  payload
)
```

### `updateCollectionProductCounts(collectionIds, payload)`

**Purpose**: Recalculates product counts for specific collections

**When Called**: After upserting collections

**Example**:
```typescript
await updateCollectionProductCounts(
  ['gid://shopify/Collection/123', 'gid://shopify/Collection/456'],
  payload
)
```

### `recalculateAllCollectionCounts(payload)`

**Purpose**: Recalculates product counts for ALL collections (maintenance)

**When to Use**: Run manually if counts get out of sync

**Example**:
```typescript
// In a script or admin endpoint
const { getPayload } = await import('payload')
const config = await import('@payload-config')
const payload = await getPayload({ config })

await recalculateAllCollectionCounts(payload)
```

## Context Flags

To prevent infinite loops and control sync behavior:

- `skipCollectionSync: true` - Skips collection sync in Products hook
- `skipCollectionCleanup: true` - Prevents collection deletion in Collections hook

## Data Flow Diagram

```
┌─────────────────┐
│ Product Synced  │
│ from Shopify    │
└────────┬────────┘
         │
         v
┌─────────────────────────────┐
│ Products afterChange Hook   │
│ (Hook 3: Collection Sync)   │
└────────┬────────────────────┘
         │
         v
┌──────────────────────────────────┐
│ upsertCollectionsFromProduct()   │
│ - Creates new collections        │
│ - Updates existing collections   │
└────────┬─────────────────────────┘
         │
         v
┌──────────────────────────────────┐
│ updateCollectionProductCounts()  │
│ - Counts active products         │
│ - Updates productCount field     │
└────────┬─────────────────────────┘
         │
         v
┌──────────────────────────────────┐
│ Collections afterChange Hook     │
│ - Detects productCount: 0        │
│ - Waits 2 seconds                │
│ - Verifies no products           │
│ - Deletes empty collection       │
└──────────────────────────────────┘
```

## Admin UI

Collections appear in the Payload Admin under **Commerce** > **Collections**:

- **Read-only fields**: shopifyCollectionId, handle, productCount, sync metadata
- **Status indicators**: 🟢 Synced, 🔴 Error
- **Default columns**: title, handle, productCount, updatedAt

## Best Practices

1. **Don't manually create collections** - Let the product sync handle it
2. **Don't manually delete collections** - They'll auto-cleanup when empty
3. **Monitor sync status** - Check the Shopify sidebar in collection documents
4. **Run recalculation** - If counts seem wrong, use `recalculateAllCollectionCounts()`

## Troubleshooting

### Collections not appearing

- Check that products have `shopifyCollections` data
- Ensure products are `status: 'active'`
- Verify the Products hook is running (check logs)

### Product counts incorrect

Run the recalculation utility:

```typescript
import { recalculateAllCollectionCounts } from '@/lib/shopify'

// In an admin endpoint or script
await recalculateAllCollectionCounts(payload)
```

### Collections not deleting

- Check that `productCount: 0`
- Verify no active products reference the collection
- Look for `skipCollectionCleanup: true` in context (would prevent deletion)
