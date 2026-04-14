# SideNavigation Auto-Generation Implementation ✅

## Summary

The SideNavigation block now automatically generates navigation items from page blocks, eliminating manual configuration.

## Changes Made

### 1. Created PageLayoutContext (`src/lib/contexts/PageLayoutContext.tsx`)
- Provides access to full page layout for any block component
- Enables blocks to understand their context within the page

### 2. Updated SideNavigation Block Definition (`src/blocks/layout/SideNavigation.ts`)
- Added `autoGenerateFromBlocks` checkbox field (default: true)
- Modified `sections` field to only show when auto-generate is disabled
- Changed `minRows` from 1 to 0 to allow empty sections array

### 3. Modified RenderBlocks Component (`src/components/RenderBlocks.tsx`)
- Wrapped content with `PageLayoutContext.Provider`
- Added `id="block-{block.id}"` to each block container for scroll targeting

### 4. Enhanced SideNavigationBlock Component (`src/components/blocks/SideNavigationBlock.tsx`)
- Added `usePageLayout()` hook to access all page blocks
- Implemented auto-generation logic with `useMemo`:
  - Uses manual sections if provided
  - Auto-generates from page blocks if sections array is empty
  - Filters out non-navigable blocks (spacer, divider, side-navigation itself)
- Added helper functions:
  - `extractBlockLabel()` - Intelligently extracts titles from various block types
  - `getBlockIcon()` - Maps block types to appropriate navigation icons
- Changed all references from `sections` to `finalSections`

### 5. Updated LayoutSideNavigationRenderer (`src/components/blocks/layout/LayoutSideNavigationRenderer.tsx`)
- Added `autoGenerateFromBlocks` prop to interface

## How It Works

1. **User adds SideNavigation block** to a page
2. **Auto-generation is enabled by default** via checkbox
3. **Component reads all blocks** on the page via PageLayoutContext
4. **Filters navigable blocks**:
   - Excludes: side-navigation, spacer, divider, bottom-left-popup
   - Includes: hero blocks, product blocks, content blocks, etc.
5. **Extracts labels** from block data (title, heading, label, name, etc.)
6. **Generates navigation items** with appropriate icons
7. **Users can scroll** to any block by clicking navigation items

## Usage

### Automatic Mode (Default)
1. Add SideNavigation block to any page
2. Navigation automatically appears based on page blocks
3. No configuration needed!

### Manual Mode
1. Add SideNavigation block
2. Uncheck "Auto-generate from blocks"
3. Manually configure sections in the array field

## Benefits

✅ **Zero configuration** - Works out of the box
✅ **Always in sync** - Navigation updates when blocks change
✅ **Smart filtering** - Only shows meaningful sections
✅ **Intelligent labeling** - Extracts best available title from each block
✅ **Type-safe** - Uses Payload's generated types
✅ **Flexible** - Can still manually configure if needed
✅ **Non-breaking** - Existing manual configurations still work

## Testing

1. Create a new page in Payload CMS
2. Add several blocks (Hero, Product Showcase, Technical Showcase, etc.)
3. Add SideNavigation block anywhere in the layout
4. View the page on frontend
5. Observe automatic navigation generated from all blocks
6. Click navigation items to scroll to sections

## Block Icon Mapping

The system intelligently assigns icons based on block types:
- Marketing Hero/Grand Hero → ⭐ star
- Product blocks → 🎹 piano
- Technical Showcase → 🎯 target
- Find a Dealer → 📍 pin
- Features → ✨ sparkles
- Specs/Gallery → ■ square
- Default → ● circle
