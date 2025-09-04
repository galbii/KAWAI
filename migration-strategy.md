# PianoModel to Product Collection Consolidation Migration Strategy

## Overview
This document outlines the strategy for migrating data from the PianoModel collection to the consolidated Product collection, eliminating the need for two separate collections.

## Migration Steps

### Phase 1: Data Migration Script

```typescript
// migration-script.ts
import payload from 'payload'

async function migratePianoModelsToProducts() {
  console.log('🚀 Starting PianoModel to Product migration...')
  
  // 1. Fetch all existing PianoModels
  const { docs: pianoModels } = await payload.find({
    collection: 'piano-models',
    limit: 1000,
    depth: 2 // Include relationships
  })
  
  console.log(`📊 Found ${pianoModels.length} piano models to migrate`)
  
  for (const pianoModel of pianoModels) {
    try {
      // 2. Check if Product already exists (from auto-generation)
      let existingProduct = null
      if (pianoModel.product) {
        const productId = typeof pianoModel.product === 'object' ? pianoModel.product.id : pianoModel.product
        existingProduct = await payload.findByID({
          collection: 'products',
          id: productId
        })
      }
      
      // 3. Transform PianoModel data to consolidated Product format
      const productData = {
        // Basic Product Fields
        type: 'piano',
        name: pianoModel.name,
        slug: pianoModel.slug,
        category: getCategoryFromProductline(pianoModel.productline),
        status: pianoModel.status,
        mainImage: pianoModel.image,
        description: pianoModel.description,
        shortDescription: pianoModel.shortDescription,
        
        // Enhanced Pricing (renamed fields)
        price: {
          currency: pianoModel.pricing?.currency || 'USD',
          msrp: pianoModel.pricing?.msrp,
          salePrice: pianoModel.pricing?.salePrice,
          priceRange: pianoModel.pricing?.priceRange,
          priceText: pianoModel.pricing?.priceText,
          contactForPricing: pianoModel.pricing?.contactForPricing,
          showPrice: pianoModel.pricing?.showPrice
        },
        
        // Enhanced Finishes (with description)
        finishes: pianoModel.availableFinishes?.map(finish => ({
          name: finish.name,
          image: finish.image,
          priceModifier: finish.priceModifier,
          available: finish.available,
          description: finish.description // New field from PianoModel
        })),
        
        // Piano-Specific Data (consolidated)
        productline: pianoModel.productline,
        keyFeatures: pianoModel.keyFeatures,
        pianoSpecs: {
          keys: pianoModel.specifications?.keys,
          pedals: pianoModel.specifications?.pedals,
          voices: pianoModel.specifications?.voices,
          polyphony: pianoModel.specifications?.polyphony,
          actionType: pianoModel.specifications?.actionType,
          soundEngine: pianoModel.specifications?.soundEngine
        },
        
        // Component Compatibility Data (defaults for now)
        componentData: {
          rating: 4.5, // Default rating
          reviews: 0, // Default reviews count
          badge: pianoModel.featured ? 'Featured' : null,
          highlight: pianoModel.status === 'limited-edition' ? 'Limited Edition' : null
        },
        
        // Enhanced Product Data
        productData: {
          model: pianoModel.model,
          brand: 'Kawai',
          series: typeof pianoModel.productline === 'object' ? pianoModel.productline.name : null,
          dimensions: {
            width: pianoModel.specifications?.dimensions?.width,
            depth: pianoModel.specifications?.dimensions?.depth,
            height: pianoModel.specifications?.dimensions?.height
          },
          weight: pianoModel.specifications?.weight
        },
        
        // Visibility Settings
        visibility: {
          featured: pianoModel.featured,
          showInCatalog: true,
          allowReviews: true,
          sortOrder: pianoModel.sortOrder
        },
        
        // Preserve existing page content if Product already exists
        pageContent: existingProduct?.pageContent || []
      }
      
      // 4. Create or Update Product
      if (existingProduct) {
        console.log(`📝 Updating existing product: ${pianoModel.name}`)
        await payload.update({
          collection: 'products',
          id: existingProduct.id,
          data: productData
        })
      } else {
        console.log(`➕ Creating new product: ${pianoModel.name}`)
        await payload.create({
          collection: 'products',
          data: productData
        })
      }
      
    } catch (error) {
      console.error(`❌ Error migrating ${pianoModel.name}:`, error)
    }
  }
  
  console.log('✅ Migration completed!')
}

function getCategoryFromProductline(productline: any): string {
  if (typeof productline === 'object' && productline.category) {
    return productline.category
  }
  // Default mapping based on common productline names
  const name = typeof productline === 'object' ? productline.name?.toLowerCase() : ''
  if (name.includes('digital')) return 'digital'
  if (name.includes('grand')) return 'grand'
  if (name.includes('upright')) return 'upright'
  if (name.includes('hybrid')) return 'hybrid'
  return 'digital' // Default fallback
}

// Run migration
migratePianoModelsToProducts().catch(console.error)
```

### Phase 2: Frontend Component Updates

#### 2.1 Update UnifiedPianoSeries Component
```typescript
// BEFORE: Complex API fetching pattern
interface Piano {
  pianoModelId?: string; // Used for API lookups
  productSlug?: string;  // Fetched via API
}

// AFTER: Direct data access
interface Piano {
  slug: string;          // Direct product slug
  // All other data directly available
}
```

#### 2.2 Update ProductHeroBlock Component
```typescript
// BEFORE: Complex nested extraction
const getKeyFeatures = () => {
  if (typeof product.pianoModel === 'object' && product.pianoModel?.keyFeatures) {
    return product.pianoModel.keyFeatures.slice(0, 3).map(feature => feature.feature);
  }
  return fallbackFeatures;
};

// AFTER: Direct field access
const keyFeatures = product.keyFeatures?.slice(0, 3).map(kf => kf.feature) || fallbackFeatures;
```

#### 2.3 Update API Transformation Functions
```typescript
// BEFORE: Complex multi-collection transformation
const transformPianoModelToComponent = (pianoModel) => {
  // 50+ lines of transformation logic
}

// AFTER: Direct Product access
const transformProductToComponent = (product) => ({
  slug: product.slug,
  name: product.name,
  series: product.productData?.series,
  rating: product.componentData?.rating || 4.5,
  reviews: product.componentData?.reviews || 0,
  image: product.mainImage,
  keyFeatures: product.keyFeatures?.map(kf => kf.feature) || [],
  // Direct access - no complex transformation needed
})
```

### Phase 3: API Route Updates

#### 3.1 Update Piano Category Pages
```typescript
// BEFORE: Multi-collection query
const getProductlinesWithPianoModels = async (category: string) => {
  const productlines = await payload.find({
    collection: 'productlines',
    where: { category: { equals: category } }
  })
  
  // Additional queries for piano models...
}

// AFTER: Single Product query
const getProductsByCategory = async (category: string) => {
  return await payload.find({
    collection: 'products',
    where: {
      and: [
        { type: { equals: 'piano' } },
        { category: { equals: category } }
      ]
    },
    depth: 2 // Include productline and media
  })
}
```

### Phase 4: Cleanup and Verification

#### 4.1 Remove PianoModel Collection
```typescript
// Remove from payload.config.ts collections array
collections: [
  // Remove: PianoModels,
  Products,
  Media,
  // ... other collections
]
```

#### 4.2 Remove Hook Files
- Delete `src/lib/hooks/product-generation.ts` (~800 lines)
- Remove imports from Product collection

#### 4.3 Update Type Definitions
```typescript
// Remove PianoModel interface, enhance Product interface
interface Product {
  // All consolidated fields
  keyFeatures?: Array<{ feature: string }>
  pianoSpecs?: {
    keys?: number
    pedals?: number
    voices?: number
    polyphony?: number
    actionType?: string
    soundEngine?: string
  }
  componentData?: {
    rating?: number
    reviews?: number
    badge?: string
    highlight?: string
  }
  // ... other fields
}
```

## Verification Steps

1. **Data Integrity Check**: Verify all PianoModel data migrated correctly
2. **Component Functionality**: Test UnifiedPianoSeries and other components work with new data structure
3. **API Response Validation**: Ensure all API routes return expected data format
4. **Performance Testing**: Verify elimination of multiple API calls improves performance
5. **Admin Panel Testing**: Confirm CMS interface works with consolidated collection

## Rollback Strategy

1. **Backup**: Create database backup before migration
2. **Rollback Script**: Maintain script to restore PianoModel collection if needed
3. **Feature Flags**: Use feature flags to switch between old/new data access patterns during testing

## Benefits Post-Migration

- **Reduced Complexity**: Eliminate ~800 lines of synchronization logic
- **Better Performance**: Single database query instead of multiple collection joins
- **Simplified Components**: Direct field access instead of complex relationship traversal
- **Enhanced Admin UX**: Single interface for all product management
- **Improved Caching**: Unified data structure improves Next.js caching efficiency

## Timeline

- **Phase 1 (Data Migration)**: 1-2 hours
- **Phase 2 (Component Updates)**: 4-6 hours  
- **Phase 3 (API Updates)**: 2-3 hours
- **Phase 4 (Cleanup)**: 1 hour
- **Testing & Verification**: 3-4 hours

**Total Estimated Time**: 11-16 hours