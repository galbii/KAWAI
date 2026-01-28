# Search Bar Blank Results Fix

## Issue
Search results showing "3 results" at the bottom but displaying a completely blank middle section.

## Root Cause
Products without a `productCategory` field were being grouped under the fallback category `'other'`, but `'other'` was not included in the `categoryOrder` array used to determine which categories to display. This caused:

1. Products to be grouped under `'other'`
2. `availableCategories` to be empty (since it filters `categoryOrder` by categories with products)
3. The entire products section to not render (due to condition `availableCategories.length > 0`)
4. Blank screen despite having search results

## Files Changed
- `/Users/chancenoonan/dev/code/KAWAI/src/components/search/SearchBar.tsx`

## Changes Made

### 1. Added 'other' to categoryOrder array (Line 135)
```typescript
// Before
const categoryOrder = ['digital', 'grand', 'upright', 'hybrid', 'accessory', 'software'] as const

// After
const categoryOrder = ['digital', 'grand', 'upright', 'hybrid', 'accessory', 'software', 'other'] as const
```

### 2. Added 'other' to categoryLabels (Line 136-143)
```typescript
const categoryLabels: Record<string, string> = {
  digital: 'Digital Pianos',
  grand: 'Grand Pianos',
  upright: 'Upright Pianos',
  hybrid: 'Hybrid Pianos',
  accessory: 'Accessories',
  software: 'Software',
  other: 'Other Products', // Added
}
```

### 3. Improved displayedProducts fallback (Line 215-218)
```typescript
// Before
const displayedProducts = useMemo(() => {
  return selectedProductCategory ? productsByCategory[selectedProductCategory] || [] : []
}, [selectedProductCategory, productsByCategory])

// After
const displayedProducts = useMemo(() => {
  // If no category is selected but we have available categories, show the first one's products
  const categoryToShow = selectedProductCategory || availableCategories[0]
  return categoryToShow ? productsByCategory[categoryToShow] || [] : []
}, [selectedProductCategory, productsByCategory, availableCategories])
```

### 4. Added debug logging (Line 180-184)
```typescript
const availableCategories = useMemo(() => {
  const available = categoryOrder.filter(cat => (productsByCategory[cat]?.length ?? 0) > 0)
  console.log('Available categories:', available)
  console.log('Products by category:', Object.keys(productsByCategory).map(key => `${key}: ${productsByCategory[key].length}`))
  return available
}, [productsByCategory])
```

## Expected Behavior After Fix
1. Products without a `productCategory` will be grouped under "Other Products" tab
2. All search results will be visible and categorized
3. The search overlay will show category tabs for all product types found
4. No more blank results screen

## Testing
1. Search for "mp" - should show products under appropriate category tabs
2. Search for products without a category - should show under "Other Products" tab
3. Verify all 3 results are visible in the UI
4. Check browser console for debug logs showing category groupings

## Related Code Context

### Product Grouping Logic (Line 146-176)
Products are grouped by:
- **Pianos**: By `productCategory` field (digital, grand, upright, hybrid)
- **Accessories/Software**: By `productType` field
- **Uncategorized**: Fallback to 'other' category

### Search Plugin Configuration (payload.config.ts)
The search plugin denormalizes product data into search documents:
```typescript
productModel: originalDoc.model,
productImageUrl: originalDoc.imageUrl,
productType: originalDoc.type, // piano, accessory, software
productCategory: originalDoc.category, // digital, grand, upright, hybrid
productSlug: originalDoc.slug,
```

## Prevention
To prevent similar issues in the future:
1. Always include fallback/default categories in filter arrays
2. Add comprehensive logging for grouping/filtering operations
3. Test with edge cases (missing fields, null values)
4. Document expected data shapes and fallback behavior
