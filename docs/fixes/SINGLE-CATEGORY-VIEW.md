# Single Category View - Decluttered Search UI

## Overview

Updated search results to show **one category at a time** instead of all categories simultaneously. This prevents cluttered results and provides a cleaner, more focused user experience.

## Key Changes

### 1. **Auto-Select Category with Most Results**

When search results load:
- Analyzes all product categories
- Finds which category has the most products
- Automatically selects and displays that category
- Updates automatically when search query changes

**Example:**
```
Search: "piano"
Results:
- Digital: 8 products ← Auto-selected (most results)
- Grand: 3 products
- Upright: 2 products
```

### 2. **Category Switcher Tabs**

Visual tabs allow switching between categories:
- Only shows categories that have products
- Displays count for each category
- Active tab highlighted in Kawai red
- Inactive tabs with transparent glass styling
- Horizontal scrollable on mobile

**Visual Design:**
```
[Digital Pianos (8)] [Grand Pianos (3)] [Upright Pianos (2)]
      ↑ Active
```

### 3. **Single Category Display**

Only products from the selected category are shown:
- No scrolling through multiple sections
- Grid layout (2-4 columns responsive)
- Clean, focused view
- Less overwhelming for users

### 4. **Smooth Transitions**

When switching categories:
- Products fade/update smoothly
- Keyboard selection resets to first item
- Grid layout maintained
- No jarring layout shifts

## Implementation Details

### State Management

```typescript
// Track selected product category
const [selectedProductCategory, setSelectedProductCategory] = useState<string>('')

// Group products by category
const productsByCategory = productResults.reduce((acc, result) => {
  const category = result.productCategory || result.category || 'other'
  if (!acc[category]) acc[category] = []
  acc[category].push(result)
  return acc
}, {})

// Get available categories (only those with products)
const availableCategories = categoryOrder.filter(
  cat => productsByCategory[cat]?.length > 0
)

// Auto-select category with most products
useEffect(() => {
  const categoryWithMostProducts = availableCategories.reduce((max, cat) => {
    const currentCount = productsByCategory[cat]?.length || 0
    const maxCount = productsByCategory[max]?.length || 0
    return currentCount > maxCount ? cat : max
  }, availableCategories[0])

  setSelectedProductCategory(categoryWithMostProducts)
  setSelectedIndex(0) // Reset keyboard selection
}, [results, categoryFilter])
```

### Display Logic

```typescript
// Get products for selected category only
const displayedProducts = selectedProductCategory
  ? productsByCategory[selectedProductCategory] || []
  : []
```

### Category Order

Categories display in this priority order:
1. **Digital Pianos** - Most popular
2. **Grand Pianos** - Premium segment
3. **Upright Pianos** - Traditional
4. **Hybrid Pianos** - Modern tech

## User Experience Flow

### Initial Search

1. User types "piano"
2. API returns 13 products:
   - 8 digital
   - 3 grand
   - 2 upright
3. UI automatically selects "Digital Pianos" (most results)
4. Shows 8 digital pianos in grid
5. Tabs show: [Digital (8)] [Grand (3)] [Upright (2)]

### Switching Categories

1. User clicks "Grand Pianos (3)" tab
2. Grid smoothly updates to show 3 grand pianos
3. Tab highlights change
4. Keyboard selection resets to first item

### Mixed Results

**Search: "CA-99"**
- Results: 1 digital piano
- Only shows "Digital Pianos (1)" tab
- No other tabs visible (no products in other categories)

**Search: "kawai"**
- Results: Products across all categories
- All category tabs visible
- Auto-selects category with most results

## Visual Design

### Category Tabs

**Active Tab:**
```css
bg-kawai-red text-white shadow-md
```

**Inactive Tab:**
```css
bg-white/60 text-gray-700
border border-white/30
hover:bg-white/80
```

### Layout Structure

```
┌────────────────────────────────────────────┐
│ [Category Tabs]                            │
│ [Digital (8)] [Grand (3)] [Upright (2)]   │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │  │
│  │CA-99 │  │ES520 │  │MP9500│  │CN201│  │
│  └──────┘  └──────┘  └──────┘  └──────┘  │
│                                            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │  │
│  └──────┘  └──────┘  └──────┘  └──────┘  │
│                                            │
├────────────────────────────────────────────┤
│ Pages (2)                                  │
│ • About Us                                 │
│ • Contact                                  │
└────────────────────────────────────────────┘
```

### Separator

Visual divider between products and pages:
```tsx
<div className="border-t border-white/20 dark:border-white/10 my-6" />
```

## Keyboard Navigation

Updated to work with single-category view:

**Arrow Keys:**
- Navigate through displayed products only
- Then navigate through pages
- Cycles within current category

**Tab Switching:**
- No keyboard shortcut (intentional - prevents accidents)
- Use mouse/touch to switch categories

**Enter Key:**
- Navigate to selected result
- Works across products and pages

**Reset Behavior:**
- Selection resets to index 0 when switching categories
- Prevents navigating to non-existent items

## Benefits

### 1. **Decluttered Interface**
- No overwhelming list of products
- Focused view on one category at a time
- Easier to scan and compare

### 2. **Better Performance**
- Renders fewer DOM elements at once
- Smoother scrolling
- Faster initial render

### 3. **Improved Discoverability**
- Category counts visible upfront
- Easy to switch between types
- Clear organization

### 4. **Mobile-Friendly**
- Less scrolling required
- Tabs scroll horizontally on small screens
- Larger touch targets

### 5. **Contextual Results**
- Auto-selects most relevant category
- Smart defaults based on results
- Less user decision fatigue

## Edge Cases Handled

### No Products in Any Category
- Category tabs don't show
- Only pages section displays
- No errors or empty states

### Single Category Has Products
- Only that category tab shows
- Auto-selected by default
- Clean, minimal interface

### All Categories Have Same Count
- First in category order (digital) selected
- Consistent behavior
- Predictable UX

### User Switches to Empty Category
- Shouldn't happen (only show categories with products)
- Filtered by `availableCategories`
- Protection in place

## Testing Checklist

### Basic Functionality
- [ ] Search for "piano" shows category with most results
- [ ] Category tabs display correct counts
- [ ] Clicking tab switches displayed products
- [ ] Only selected category products show in grid
- [ ] Pages section shows below products

### Edge Cases
- [ ] Search with only 1 category of products
- [ ] Search with products in all categories
- [ ] Search with no products (pages only)
- [ ] Switch between categories rapidly

### Keyboard Navigation
- [ ] Arrow keys navigate within displayed products
- [ ] Enter key navigates to selected product
- [ ] Selection resets when switching categories
- [ ] Escape closes search

### Visual Design
- [ ] Active tab highlighted in red
- [ ] Inactive tabs have glass styling
- [ ] Separator shows between products and pages
- [ ] Grid layout responsive (2-4 columns)
- [ ] Mobile: tabs scroll horizontally

### Data Accuracy
- [ ] Correct products show for each category
- [ ] Counts match actual number of products
- [ ] Model names display correctly
- [ ] Images load properly
- [ ] Navigation goes to correct URLs

## Files Modified

- `src/components/search/SearchBar.tsx`:
  - Added `selectedProductCategory` state
  - Added auto-selection logic for category with most results
  - Added category switcher tabs UI
  - Updated rendering to show single category
  - Updated keyboard navigation for displayed products only
  - Added visual separator between products/pages
  - Reset selection when category changes

## Future Enhancements

### Possible Additions:
1. **Keyboard shortcuts** - Number keys (1-4) to switch categories
2. **Animation** - Fade transition when switching categories
3. **Swipe gestures** - Mobile swipe to change categories
4. **URL state** - Remember selected category in URL params
5. **"All" option** - Toggle to show all categories at once
6. **Category icons** - Visual icons for each piano type

### Not Recommended:
- Auto-cycling through categories - confusing
- Too many categories - defeats purpose of decluttering
- Nested sub-categories - overcomplicated

## Comparison

### Before (Cluttered)
```
Products (13)
├─ Digital Pianos
│  ├─ Product 1
│  ├─ Product 2
│  ├─ ... (8 products)
├─ Grand Pianos
│  ├─ Product 9
│  ├─ ... (3 products)
└─ Upright Pianos
   └─ ... (2 products)

[Lots of scrolling]
```

### After (Clean)
```
[Digital (8)] [Grand (3)] [Upright (2)]
     ↑ Active

Digital Pianos:
├─ Product 1
├─ Product 2
├─ ... (8 products only)

[No scrolling, focused view]
```

## Success Metrics

This update should result in:
- ✅ Less scrolling required
- ✅ Faster product discovery
- ✅ Clearer categorization
- ✅ Better mobile experience
- ✅ More focused user attention
- ✅ Higher click-through rate on products

## Migration Notes

**No breaking changes:**
- Same data structure
- Same API responses
- Same product URLs
- Only UI presentation changed

**Backward compatible:**
- All existing functionality preserved
- Keyboard navigation still works
- Search logic unchanged
- Reindex not required (uses existing `productCategory`)
