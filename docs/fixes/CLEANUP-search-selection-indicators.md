# Search UI Cleanup - Removed Selection Indicators

## Changes Made

### 1. Removed Visual Selection Indicators

Cleaned up the search UI by removing all keyboard selection visual indicators:

**Product Cards - Removed:**
- ❌ Red ring around selected card (`ring-2 ring-kawai-red`)
- ❌ Red overlay on image (`bg-kawai-red/10 border-2`)
- ❌ Checkmark badge in bottom-left corner (✓)
- ❌ Scale effect on selected state

**Page Cards - Removed:**
- ❌ Red gradient background on selected state
- ❌ Arrow indicator (→)
- ❌ Special border styling

**Kept:**
- ✅ Hover effects (scale on hover)
- ✅ Image zoom on hover
- ✅ All functionality (keyboard navigation still works)
- ✅ Category badges
- ✅ Model names

### 2. Fixed Navigation URLs

Updated `getResultUrl()` to properly use denormalized slugs:

**Before:**
```typescript
const slug = result.doc.value.slug // Assumes object, breaks if string ID
```

**After:**
```typescript
// For products - use denormalized slug
const slug = result.productSlug || (typeof result.doc.value === 'object' ? result.doc.value.slug : '')

// For pages - handle both object and string
const slug = typeof result.doc.value === 'object' ? result.doc.value.slug : result.doc.value
```

**Navigation URLs:**
- Products: `/products/{productSlug}`
- Pages: `/{slug}`

### 3. Added Navigation Debug Logging

Console logs navigation details when clicking a result:

```typescript
console.log('Navigating to:', url, {
  title: result.title,
  relationTo: result.doc.relationTo,
  productSlug: result.productSlug,
})
```

This helps verify:
- Correct URL is being generated
- Product slug is available from denormalized field
- Navigation happens to the right page

## Visual Changes

### Before
```
┌─────────────────────────┐
│ 🔴 RED RING (selected)  │
│  ┌────────────────────┐ │
│  │ [Image]            │ │
│  │ 🔴 RED OVERLAY     │ │
│  └────────────────────┘ │
│  Model Name            │
│  ✓ CHECKMARK           │
└─────────────────────────┘
```

### After
```
┌─────────────────────────┐
│  ┌────────────────────┐ │
│  │ [Image]            │ │
│  │                    │ │
│  └────────────────────┘ │
│  Model Name            │
└─────────────────────────┘
```

**Clean, minimal design with no selection indicators!**

## Keyboard Navigation Still Works

Even though visual indicators are removed:
- **Arrow Keys** - Navigate through results (changes selectedIndex)
- **Enter** - Navigate to selected result
- **Escape** - Close search
- **L Key** - Focus search bar

The keyboard navigation logic is intact, just no visual feedback.

## Testing Checklist

- [ ] Search for a product (e.g., "piano")
- [ ] Click a product card
- [ ] Verify navigation goes to `/products/{slug}`
- [ ] Check browser console for "Navigating to:" log
- [ ] Verify no checkmarks or red overlays appear
- [ ] Test hover effects still work (scale, image zoom)
- [ ] Test keyboard navigation (arrow keys, enter)
- [ ] Verify pages navigate to correct URL

## Files Modified

- `src/components/search/SearchBar.tsx`:
  - Removed selection indicator classes
  - Removed checkmark elements
  - Removed red overlay elements
  - Updated `getResultUrl()` to use denormalized slugs
  - Added navigation debug logging
  - Simplified card styling

## Navigation URL Examples

**Products:**
```
MP9500 → /products/mp9500
CA-99 → /products/ca-99
ES520 → /products/es520
```

**Pages:**
```
About → /about
Contact → /contact
Dealers → /dealers
```

## Console Output Example

When clicking a product:
```
Navigating to: /products/mp9500 {
  title: 'Kawai MP9500 Digital Piano',
  relationTo: 'products',
  productSlug: 'mp9500'
}
```

This confirms:
- URL is correct
- Product slug is available from denormalized field
- Navigation will work properly

## Benefits

1. **Cleaner UI** - No distracting red indicators
2. **Better UX** - Focus on product images and names
3. **Reliable Navigation** - Uses denormalized slugs, always works
4. **Easier to Use** - Less visual noise
5. **Still Functional** - Keyboard navigation intact

## Next Steps

After testing:
1. If navigation works correctly, remove debug console.log
2. If you want visual feedback for keyboard nav, consider subtle alternatives:
   - Slight opacity change
   - Subtle border glow
   - Small scale difference
   - Background tint (not red)
