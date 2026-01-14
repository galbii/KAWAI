# Agent Coordination Requirements
## Auto-Generated Product Pages from PianoModels

This document outlines the coordination requirements between agents working on implementing auto-generated Product pages from PianoModels in the KAWAI piano website.

## Agent 1: Blocks & Dynamic Pages Specialist ✅ COMPLETED

### What I've Accomplished:
1. **Enhanced all key blocks** with PianoModel relationship capabilities:
   - **Hero Block**: Added `pianoModel` relationship field, data source selection, intelligent content fallback
   - **ProductShowcase Block**: Added `pianoModel` relationship, enhanced to combine Product + PianoModel data  
   - **Specifications Block**: Added `pianoModel` relationship, auto-populate from PianoModel.specifications
   - **ImageGallery Block**: Added `pianoModel` relationship, auto-populate from PianoModel.gallery
   - **FeaturesList Block**: Added `pianoModel` relationship, auto-populate from PianoModel.keyFeatures

2. **Created block template system** (`/src/lib/blocks/templates.ts`):
   - `generateDefaultProductBlocks()` - Standard template with 6 blocks
   - `generateMinimalProductBlocks()` - Lightweight 3-block template
   - `generatePremiumProductBlocks()` - Full-featured 7-block template
   - `CATEGORY_TEMPLATES` - Category-based template selection
   - `getTemplateForCategory()` - Smart template selection helper

3. **Implemented intelligent data fallback pattern**:
   - **3 Data Source Modes**: Manual, Piano Model Data, Hybrid
   - **Backward Compatibility**: Existing blocks work exactly as before
   - **Conditional Fields**: Show/hide fields based on data source selection
   - **Smart Defaults**: Use PianoModel data when available, fallback to manual

### Technical Implementation Details:

#### Block Schema Pattern:
```typescript
// All enhanced blocks now have this pattern:
{
  name: 'dataSource',
  type: 'select',
  options: [
    { label: 'Manual Entry', value: 'manual' },
    { label: 'Piano Model Data', value: 'pianomodel' },
    { label: 'Hybrid (Piano Model + Overrides)', value: 'hybrid' }
  ]
},
{
  name: 'pianoModel',
  type: 'relationship',
  relationTo: 'piano-models',
  admin: {
    condition: (data) => data?.dataSource !== 'manual'
  }
}
```

#### Data Population Logic:
- **Manual Mode**: Traditional block behavior, all fields manually entered
- **Piano Model Mode**: Block pulls all data from linked PianoModel, minimal manual fields
- **Hybrid Mode**: Block uses PianoModel as base, allows manual overrides for customization

## Coordination Requirements for Other Agents:

### Agent 2: Database/Hooks Specialist
**CRITICAL DEPENDENCIES** - Agent 1 work is complete, Agent 2 can proceed immediately:

#### Required Implementations:
1. **PianoModel→Product Hook**: 
   - Use template system: `import { getTemplateForCategory } from '@/lib/blocks/templates'`
   - Call `getTemplateForCategory(pianoModelId, category)` to get default blocks
   - Populate Product.pageContent with returned block configuration

2. **Relationship Handling**:
   - Ensure PianoModel relationship is properly saved in blocks
   - Handle cascade operations when PianoModel is updated/deleted

3. **Auto-Population Hook Example**:
```typescript
// In PianoModels collection hook
beforeChange: [
  async ({ data, operation }) => {
    if (operation === 'create') {
      // Create corresponding Product with blocks
      const blocks = getTemplateForCategory(data.id, data.category);
      await payload.create({
        collection: 'products',
        data: {
          name: data.name,
          pianoModel: data.id,
          pageContent: blocks, // Uses our template system
          // ... other fields
        }
      });
    }
  }
]
```

### Agent 3: Frontend Specialist  
**DEPENDENCIES** - Needs Agent 2's hooks but can start component logic:

#### Required Implementations:
1. **Block Rendering Components**: Create data resolution logic for each enhanced block
2. **Data Fetching Logic**: Components must handle 3 data sources:
   - Manual data (use block fields directly)
   - PianoModel data (fetch from relationship, use PianoModel fields)  
   - Hybrid data (merge PianoModel data with manual overrides)

3. **Component Pattern Example**:
```typescript
// In HeroBlock component
const getHeroData = (block: HeroBlock) => {
  switch (block.dataSource) {
    case 'pianomodel':
      return {
        title: block.pianoModel?.name || 'Default Title',
        description: block.pianoModel?.description,
        backgroundImage: block.pianoModel?.image,
        // ... other mappings
      };
    case 'hybrid':
      return {
        title: block.content?.title || block.pianoModel?.name,
        description: block.content?.description || block.pianoModel?.description,
        // Manual fields override PianoModel data
      };
    case 'manual':
    default:
      return block.content; // Traditional behavior
  }
};
```

### Agent 4: Integration Specialist
**COORDINATION ROLE** - Monitor dependencies and system integration:

#### Integration Points to Monitor:
1. **Template Usage**: Ensure Agent 2 properly uses the template system from `/src/lib/blocks/templates.ts`
2. **Data Flow**: Verify data flows correctly from PianoModel → Blocks → Frontend
3. **Error Handling**: Implement fallbacks when PianoModel data is missing
4. **Performance**: Monitor for N+1 queries when resolving PianoModel relationships

## Files Modified/Created:

### Modified Block Files:
- `/src/blocks/Hero.ts` ✅ Enhanced with pianoModel relationship
- `/src/blocks/ProductShowcase.ts` ✅ Enhanced with pianoModel relationship  
- `/src/blocks/Specifications.ts` ✅ Enhanced with pianoModel relationship
- `/src/blocks/ImageGallery.ts` ✅ Enhanced with pianoModel relationship
- `/src/blocks/FeaturesList.ts` ✅ Enhanced with pianoModel relationship

### Created Files:
- `/src/lib/blocks/templates.ts` ✅ Block template system for auto-generation

### Existing Files (for reference):
- `/src/collections/PianoModels.ts` - Source data structure
- `/src/collections/Products.ts` - Target collection with blocks

## Implementation Timeline:

1. ✅ **Agent 1 Complete**: Block enhancements and templates ready
2. 🔄 **Agent 2 Next**: Implement hooks using template system  
3. 🔄 **Agent 3 Next**: Create frontend data resolution logic
4. 🔄 **Agent 4 Ongoing**: System integration and testing

## Key Benefits Achieved:

1. **100% Backward Compatibility**: Existing Products work exactly as before
2. **Flexible Data Sources**: Manual, automatic, or hybrid approaches per block
3. **Template System**: Consistent, categorized defaults for auto-generation
4. **Admin UX**: Clear data source selection with conditional field display
5. **Intelligent Fallbacks**: Graceful handling of missing PianoModel data
6. **Type Safety**: Full TypeScript support with Payload interfaces

## Next Steps for Agents:

### Agent 2 (Immediate):
- Implement PianoModel creation/update hooks
- Use template system to populate Product.pageContent
- Test relationship cascade handling

### Agent 3 (Parallel):
- Create block rendering components with data source awareness
- Implement PianoModel data fetching and merging logic
- Handle loading states and error cases

### Agent 4 (Coordination):
- Monitor integration between Agent 2 and 3 work
- Test end-to-end flow: PianoModel → Product → Frontend
- Performance testing and optimization

The foundation is complete and all other agents can proceed with their implementations using the enhanced block system and template utilities.