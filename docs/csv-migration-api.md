# CSV Product Migration API Documentation

## Overview

The `/api/migrate-products` endpoint provides automated migration of product data from a WooCommerce CSV export to the Payload CMS Products collection. This endpoint handles the complex transformation of WooCommerce's product structure into our unified piano retail system.

## Endpoint Details

- **URL**: `/api/migrate-products`
- **Method**: `GET` 
- **Returns**: HTML interface (browser) or JSON (API clients)
- **Access**: Browser-accessible for easy migration execution

## CSV File Requirements

### File Location
The CSV file must be placed at the project root as `update_productDB.csv`.

### Expected CSV Structure (WooCommerce Export)
The migration expects a WooCommerce product export with these key columns:

#### Core Product Fields
- `ID` - Product ID (used for parent-variation relationships)
- `Type` - Product type: `variable`, `variation`, `simple`
- `Name` - Product name
- `Published` - Publication status (`1` = published, `0` = draft)
- `Short description` - Brief product description
- `Description` - Full product description
- `Regular price` - MSRP pricing
- `Sale price` - Sale pricing (if different)
- `Categories` - Product categories (pipe-separated)
- `Tags` - Product tags
- `Images` - Product image URLs
- `Parent` - Parent product ID (for variations, format: `id:####`)

#### Technical Specifications (Attributes 1-5)
- `Attribute X name` - Specification name
- `Attribute X value(s)` - Specification values
- Physical dimensions: `Length (cm)`, `Width (cm)`, `Height (cm)`, `Weight`

#### SEO & Metadata
- `Meta: rank_math_title` / `Meta: _yoast_wpseo_title` - SEO title
- `Meta: rank_math_description` / `Meta: _yoast_wpseo_metadesc` - Meta description
- `Meta: rank_math_focus_keyword` / `Meta: _yoast_wpseo_focuskw` - Keywords
- `Meta: _product_tab_content` - Additional product features

## Data Transformation Process

### 1. Product Type Detection & Filtering

The migration processes three types of CSV rows:
- **Variable Products** (`Type: variable`) - Parent products with variations
- **Product Variations** (`Type: variation`) - Individual finish/configuration options
- **Simple Products** (`Type: simple`) - Standalone products

**Filtering Rules:**
- ✅ **Included**: Piano models and legitimate musical instruments
- 🚫 **Excluded**: Accessories (stands, pedals, phones, headphones, MIDI devices)
- 🚫 **Excluded**: Discontinued models (extensive predefined list)

### 2. Product Line Extraction & Creation

The system intelligently extracts product line information from:
- **Categories** (e.g., "Grand Pianos > GL Series")  
- **Product Names** (e.g., "Kawai GL-40" → "GL Series")

**Supported Product Lines:**
```
Digital Pianos: CA, CN, ES, MP, KDP, CP, CS, VPC, CE, CL, KCP, KLCS, DG, X, Z, MAV Series
Grand Pianos: GL, GX, Shigeru (SK), RX, GM, GE, Crystal Grand, Concert Series
Upright Pianos: K, UST, Console, ST Series  
Hybrid Pianos: NOVUS, AURES, ATX Series
```

**Product Line Creation:**
```typescript
{
  name: "GL Series",           // Extracted series name
  slug: "gl-series",          // Auto-generated slug
  category: "grand",          // Mapped category
  description: "Auto-generated description...",
  featured: false,
  sortOrder: 0
}
```

### 3. WooCommerce → Products Collection Mapping

#### Core Product Fields
```typescript
// WooCommerce → Products Collection
{
  type: "piano",                    // Fixed for piano products
  name: csvRow.Name,               // Direct mapping
  slug: generateSlug(csvRow.Name), // Auto-generated URL slug
  category: mapCategory(csvRow.Categories), // "digital"|"grand"|"hybrid"|"upright"
  status: csvRow.Published === '1' ? 'active' : 'draft',
  description: cleanDescription(csvRow.Description),
  shortDescription: cleanDescription(csvRow['Short description']),
  imageUrl: csvRow.Images,         // Direct image URL fallback
  productline: productlineId,      // Linked product line relationship
  series: productLineName,         // Auto-populated from product line
  model: extractedModelNumber,     // Extracted from product name
  brand: "Kawai"                   // Fixed brand
}
```

#### Pricing Transformation
```typescript
// WooCommerce pricing → Products price object
price: {
  currency: "USD",
  msrp: parseFloat(csvRow['Regular price']),
  salePrice: parseFloat(csvRow['Sale price']) || null,
  showPrice: regularPrice > 0,
  contactForPricing: regularPrice === 0
}
```

#### Variations → Finishes Array
WooCommerce product variations become finish options:
```typescript
// Each variation becomes a finish object
finishes: [
  {
    name: "Polished Ebony",          // From variation name or attribute
    imageUrl: variationImageUrl,     // From variation Images field
    priceModifier: priceDifference,  // Calculated from base price
    available: variationPublished,   // From variation Published status
    description: cleanedDescription  // From variation description
  }
]
```

#### Attributes → Specifications
```typescript
specifications: {
  // Piano Technical Specs
  keys: parseInt(attributeValue),
  pedals: parseInt(attributeValue), 
  voices: parseInt(attributeValue),
  polyphony: parseInt(attributeValue),
  actionType: attributeValue,
  soundEngine: attributeValue,
  
  // Physical Dimensions
  dimensions: {
    width: csvRow['Length (cm)'] + "cm",
    depth: csvRow['Width (cm)'] + "cm", 
    height: csvRow['Height (cm)'] + "cm"
  },
  weight: csvRow.Weight,
  
  // Product Metadata
  sku: attributeValue,
  warranty: attributeValue,
  origin: attributeValue
}
```

#### Content → Key Features
Multiple sources combine into key features:
```typescript
keyFeatures: [
  // From Attributes 1-5 (excluding spec fields)
  { feature: "Millennium III Action with ABS-Carbon" },
  
  // From Meta: _product_tab_content (HTML list items)
  { feature: "Extended Length Keysticks" },
  { feature: "Concert-Length Key Buttons" }
]
```

#### SEO Data Migration
```typescript
seo: {
  metaTitle: csvRow['Meta: rank_math_title'] || csvRow.Name,
  metaDescription: (csvRow['Meta: rank_math_description'] || cleanedDescription).substring(0, 160),
  keywords: csvRow['Meta: rank_math_focus_keyword'] || csvRow.Tags
}
```

## Data Cleaning & Processing

### HTML Content Cleaning
The `cleanDescription()` function removes:
- HTML tags (`<div>`, `<p>`, `<h3>`, etc.)
- HTML entities (`&nbsp;`, `&quot;`, etc.)
- WordPress shortcodes (`[caption]`, `[table]`, etc.)
- Formatting artifacts (`\n.\n`, multiple spaces)

### Product Tab Content Processing
Extracts structured features from HTML lists:
```html
<!-- Input: WordPress product tab content -->
<ul>
  <li>Kawai's Exclusive Millennium III Action</li>
  <li>Extended Length Keysticks</li>
  <li>Steel-Reinforced Keybed</li>
</ul>

<!-- Output: Key features array -->
[
  { feature: "Kawai's Exclusive Millennium III Action" },
  { feature: "Extended Length Keysticks" },
  { feature: "Steel-Reinforced Keybed" }
]
```

### Slug Generation
Creates URL-friendly slugs:
```javascript
"Kawai GL-40 Grand Piano" → "kawai-gl-40-grand-piano"
"K-300 Professional Upright" → "k-300-professional-upright"
```

## Migration Process Flow

### 1. **Initialization**
- Parse CSV file using `csv-parse/sync`
- Initialize Payload CMS connection
- Separate parent products from variations

### 2. **Product Line Creation**
- Extract unique product line names from all piano products
- Check for existing product lines in database
- Create missing product lines with proper categorization

### 3. **Product Creation**  
- Process each parent product (skip existing products)
- Apply filtering rules (exclude accessories/discontinued)
- Transform WooCommerce data to Products schema
- Group variations as finish options
- Create product with `overrideAccess: true` (bypasses validation)

### 4. **Relationship Handling**
- Link products to appropriate product lines
- Ensure piano products have required product line relationship
- Auto-populate series names from product line data

## Response Format

### Browser Access (HTML)
Returns formatted HTML interface showing:
- Migration statistics (products created, errors, duration)
- Created product lines with categories
- Created products with IDs
- Any errors encountered
- Quick links to admin panel

### API Access (JSON)
```typescript
{
  success: boolean,
  message: string,
  stats: {
    totalProcessed: number,
    productlinesCreated: number, 
    productsCreated: number,
    errors: number,
    duration: string
  },
  errors: string[],
  products: Array<{name: string, id: string, category: string}>,
  productlines: Array<{name: string, id: string, category: string}>
}
```

## Error Handling

### Common Issues & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "CSV file not found" | Missing `update_productDB.csv` in root | Place CSV file in project root directory |
| "Product line validation failed" | Invalid category mapping | Check product line category assignment |
| "Required field missing" | Schema validation | Migration uses `overrideAccess: true` to bypass |
| "Duplicate slug" | Product already exists | Migration skips existing products by slug |

### Built-in Protections
- ✅ **Duplicate Prevention**: Checks existing products by slug
- ✅ **Data Validation**: Cleans and validates all input data
- ✅ **Error Recovery**: Continues processing after individual failures
- ✅ **Comprehensive Logging**: Detailed console output for debugging

## Database Schema Compliance

The migration ensures full compliance with the Products collection schema:

### Required Fields (Piano Products)
- ✅ `name`, `slug`, `category`, `description` - Always populated
- ✅ `productline` - Required for `type: "piano"`, extracted and linked
- ✅ `type: "piano"` - Set for all piano products

### Optional Enhancement Fields  
- ✅ `finishes[]` - From WooCommerce variations
- ✅ `specifications` - From attributes and CSV columns
- ✅ `keyFeatures[]` - From attributes and product tab content
- ✅ `price` - Comprehensive pricing from WooCommerce data
- ✅ `seo` - From WooCommerce SEO plugins

### Page Content Blocks
- ✅ **Default Block**: Creates `productHero` block for new products
- ✅ **Dynamic Pages**: Enables full page building capability

## Usage Examples

### Running Migration (Browser)
1. Navigate to `http://localhost:3000/api/migrate-products`
2. View migration progress and results
3. Use provided links to review created products

### Running Migration (API)
```bash
curl -H "Accept: application/json" http://localhost:3000/api/migrate-products
```

### Checking Migration Results
```bash
# View created products
curl http://localhost:3000/admin/collections/products

# View created product lines  
curl http://localhost:3000/admin/collections/productlines
```

## Performance Considerations

- **Batch Processing**: Processes all products in single request
- **Relationship Caching**: Maps product lines once, reuses for all products
- **Memory Efficient**: Streams CSV parsing, doesn't load entire file
- **Database Optimization**: Uses Payload's local API for fastest access

## Best Practices

### Before Migration
1. ✅ Backup database
2. ✅ Verify CSV file format and location
3. ✅ Test with small dataset first
4. ✅ Review discontinue product list

### After Migration
1. ✅ Review created products in admin panel
2. ✅ Upload actual product images to replace imageUrl fallbacks
3. ✅ Customize page content blocks for key products
4. ✅ Verify product line relationships
5. ✅ Test frontend product pages

### Data Quality
- ✅ Use clean, well-formatted CSV exports
- ✅ Ensure consistent naming conventions
- ✅ Verify image URLs are accessible
- ✅ Review product categorization

This migration system provides a robust, automated solution for transforming WooCommerce product data into our modern piano retail platform while maintaining data integrity and enabling rich, dynamic product pages.