# PianoModel Collection Cleanup Script

## Overview
This script outlines the steps to safely remove the PianoModel collection and all its references after the consolidation is complete and tested.

## Phase 1: Remove PianoModel Collection Definition

1. **Update payload.config.ts**
```typescript
// Remove PianoModels import
// import { PianoModels } from './src/collections/PianoModels'

// Remove from collections array
collections: [
  Users,
  Media,
  Products, // Keep this
  Productlines,
  // PianoModels, // Remove this line
  PianosPage,
  HomePage
]
```

2. **Delete PianoModel collection file**
```bash
rm src/collections/PianoModels.ts
```

## Phase 2: Remove Hook Files

1. **Delete product generation hooks**
```bash
rm src/lib/hooks/product-generation.ts
```

2. **Clean up remaining hook references**
Search for any remaining imports of product-generation hooks:
```bash
grep -r "product-generation" src/
```

## Phase 3: Update Type Definitions

1. **Remove PianoModel interface references**
```bash
# Search for PianoModel type usage
grep -r "PianoModel" src/ --include="*.ts" --include="*.tsx"
```

2. **Update payload-types.ts** (if auto-generated)
- Regenerate types after removing PianoModel collection
- Run: `payload generate:types`

## Phase 4: Clean Up API Routes

1. **Remove old transformation functions** (from `src/lib/payload.ts`)
```typescript
// Keep transformProductToComponent for new consolidated approach
// Remove these legacy functions:
// - transformPianoModelToComponent (legacy version)
// - transformProductlineToSeries (if it uses PianoModel)
// - getProductlinesWithPianoModels (replace with getProductsByCategory)
```

2. **Update piano category page API calls**
Replace old pattern:
```typescript
// OLD
const seriesWithPianos = await getProductlinesWithPianoModels('digital')

// NEW
const seriesWithPianos = await getProductsByCategory('digital')
```

## Phase 5: Frontend Component Final Updates

1. **Remove unused imports**
```bash
# Search for PianoModel imports in components
grep -r "import.*PianoModel" src/components/
```

2. **Update series browser components**
Ensure all series browser components use the new data structure without `pianoModelId` lookups.

## Phase 6: Database Cleanup (Optional)

1. **Backup database before cleanup**
```bash
# Create backup of your database
mongodump --db your_database_name --out backup_before_cleanup
```

2. **Remove PianoModel documents** (after migration complete)
```javascript
// Connect to MongoDB and run:
db.pianomodels.drop()

// Also clean up any references in other collections if needed
// This should be safe after migration since Products now contain all data
```

## Phase 7: Verification Steps

1. **Build verification**
```bash
bun run build
```

2. **Type checking**
```bash
bun run lint
```

3. **Runtime testing**
- Test piano category pages load correctly
- Test UnifiedPianoSeries component renders properly
- Test ProductHeroBlock displays piano data correctly
- Test admin interface works with consolidated Products

## Phase 8: Performance Verification

1. **API Response Testing**
```bash
# Test category API endpoints
curl "http://localhost:3000/api/products?where[type][equals]=piano&where[category][equals]=digital"

# Verify response contains all necessary data for components
```

2. **Component Loading Testing**
- Verify no more loading spinners for product slug resolution
- Confirm series browser loads instantly
- Check that all piano links work immediately

## Final Checklist

- [ ] PianoModel collection removed from payload.config.ts
- [ ] PianoModels.ts file deleted
- [ ] product-generation.ts hooks file deleted
- [ ] All PianoModel type references updated
- [ ] Legacy transformation functions removed
- [ ] All components use new consolidated data structure
- [ ] Build passes without errors
- [ ] All piano category pages work
- [ ] Admin interface functions correctly
- [ ] Performance improvements verified (no API lookup delays)
- [ ] Database cleanup completed (optional)

## Benefits Achieved

After cleanup completion:

✅ **Reduced codebase complexity**
- Removed ~800 lines of synchronization logic
- Eliminated complex hook system
- Single source of truth for piano data

✅ **Improved performance** 
- No more API lookups for product slugs
- Single database query instead of multiple joins
- Eliminated loading states for links

✅ **Better maintainability**
- Direct field access instead of nested relationships
- Consolidated admin interface
- Simplified data flow

✅ **Enhanced type safety**
- Single Product interface instead of complex unions
- Better TypeScript support
- Clearer data contracts

## Rollback Strategy (Emergency)

If issues are discovered:

1. **Restore PianoModel collection**
```bash
git checkout HEAD~1 -- src/collections/PianoModels.ts
git checkout HEAD~1 -- src/lib/hooks/product-generation.ts
```

2. **Re-add to payload.config.ts**
3. **Restore database from backup if needed**
4. **Investigate and fix issues before retry**