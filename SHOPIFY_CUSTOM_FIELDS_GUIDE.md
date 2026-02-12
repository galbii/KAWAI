# Shopify Custom Fields Integration Guide

## Overview

This guide documents the implementation of Shopify custom fields (`custom.blueprint` and `custom.specifications`) in the KAWAI Payload CMS product sync system.

## Prerequisites

### Required Shopify App Scopes

**CRITICAL**: Your Shopify app MUST have the following OAuth scopes configured to fetch metafields and metaobjects:

#### Required Scopes:
- `read_products` - Required to fetch product data
- `read_metaobjects` - **Required to resolve metaobject references** (specifications)

Without `read_metaobjects` scope, the specifications metafield will have:
- ✅ `value` field populated with metaobject IDs: `["gid://shopify/Metaobject/123"]`
- ❌ `references` field returns `null` instead of metaobject data

### How to Add Required Scopes

#### Option 1: Via Shopify Partner Dashboard (Custom Apps)

1. Go to [Shopify Partners Dashboard](https://partners.shopify.com/)
2. Navigate to **Apps** → Select your app
3. Click **Configuration** → **Scopes**
4. Check these boxes:
   - ✅ `read_products`
   - ✅ `read_metaobjects`
5. Click **Save**
6. **Reinstall the app** on your store to apply new scopes

#### Option 2: Via Shopify Admin (Admin API Access Tokens)

1. Go to Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **Develop apps** → Select your app
3. Go to **Configuration** tab
4. Under **Admin API access scopes**, enable:
   - ✅ `read_products`
   - ✅ `read_metaobjects`
5. Click **Save**
6. Go to **API credentials** tab
7. Click **Install app** (or **Reinstall** if already installed)

#### Option 3: Via App Configuration File (toml)

If using Shopify CLI apps with `shopify.app.toml`:

```toml
scopes = "read_products,read_metaobjects"
```

Then redeploy:
```bash
shopify app deploy
```

### Verifying Scopes

Test that scopes are working with this GraphQL query in Shopify Admin API GraphiQL:

```graphql
query TestMetaobjectAccess {
  product(id: "gid://shopify/Product/YOUR_PRODUCT_ID") {
    title
    specifications: metafield(namespace: "custom", key: "specifications") {
      value
      references(first: 5) {
        edges {
          node {
            ... on Metaobject {
              id
              fields {
                key
                value
              }
            }
          }
        }
      }
    }
  }
}
```

**Expected Result**:
- If `read_metaobjects` scope is active: `references.edges` contains metaobject data
- If missing scope: `references` is `null`

## Custom Fields Added

### 1. Blueprint Image (`custom.blueprint`)

**Shopify Metafield Type**: `file_reference` (image)

**Purpose**: Store product blueprint/technical drawing images

**Payload CMS Structure**:
```typescript
blueprint: {
  url: string
  alt: string | null
  width: number | null
  height: number | null
}
```

**Usage Example**:
```tsx
// In a component
import type { Product } from '@/payload-types'

export function ProductBlueprint({ product }: { product: Product }) {
  if (!product.blueprint?.url) return null

  return (
    <div className="blueprint-viewer">
      <img
        src={product.blueprint.url}
        alt={product.blueprint.alt || `${product.name} blueprint`}
        width={product.blueprint.width || undefined}
        height={product.blueprint.height || undefined}
      />
    </div>
  )
}
```

### 2. Specifications (`custom.specifications`)

**Shopify Metafield Type**: `list.metaobject_reference`

**Metaobject Definition** (must be created in Shopify):
- **Type**: `specification_object` (or your chosen type name)
- **Fields**:
  - `spec` (single_line_text_field) - Specification name
  - `type` (multi_line_text_field) - Specification type/category
  - `details` (multi_line_text_field) - Detailed specification information

**Payload CMS Structure**:
```typescript
specifications: Array<{
  id: string
  spec: string
  type: string
  details: string
}>
```

**Usage Example**:
```tsx
// In a component
import type { Product } from '@/payload-types'

export function ProductSpecifications({ product }: { product: Product }) {
  if (!product.specifications || product.specifications.length === 0) {
    return null
  }

  return (
    <div className="specifications">
      <h3>Technical Specifications</h3>
      {product.specifications.map((spec, index) => (
        <div key={spec.id || index} className="specification-item">
          <h4>{spec.spec}</h4>
          <p className="type">{spec.type}</p>
          <p className="details">{spec.details}</p>
        </div>
      ))}
    </div>
  )
}
```

## Shopify Setup Instructions

### Step 1: Create Specification Metaobject Definition

Run this GraphQL mutation in Shopify Admin API GraphiQL explorer:

```graphql
mutation CreateSpecificationMetaobject {
  metaobjectDefinitionCreate(definition: {
    type: "specification_object",
    name: "Product Specification",
    description: "Technical specifications for products",
    access: {
      admin: MERCHANT_READ_WRITE,
      storefront: PUBLIC_READ,
    },
    fieldDefinitions: [
      {
        key: "spec",
        name: "Specification Name",
        type: "single_line_text_field",
        required: true
      },
      {
        key: "type",
        name: "Specification Type",
        type: "multi_line_text_field",
        required: false
      },
      {
        key: "details",
        name: "Specification Details",
        type: "multi_line_text_field",
        required: false
      }
    ]
  }) {
    metaobjectDefinition {
      id
      type
      name
      fieldDefinitions {
        key
        name
        type {
          name
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

**Save the returned `metaobjectDefinition.id` - you'll need it for the next step!**

### Step 2: Create Blueprint Metafield Definition

```graphql
mutation CreateBlueprintMetafield {
  metafieldDefinitionCreate(definition: {
    name: "Product Blueprint",
    key: "blueprint",
    namespace: "custom",
    description: "Product blueprint or technical drawing image",
    type: "file_reference",
    ownerType: PRODUCT,
    access: {
      storefront: PUBLIC_READ
    },
    validations: [
      {
        name: "file_type_options",
        value: "[\"Image\"]"
      }
    ]
  }) {
    createdDefinition {
      id
      namespace
      key
      name
      type {
        name
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

### Step 3: Create Specifications Metafield Definition

**Replace `gid://shopify/MetaobjectDefinition/YOUR_ID_HERE` with the ID from Step 1!**

```graphql
mutation CreateSpecificationsMetafield {
  metafieldDefinitionCreate(definition: {
    name: "Product Specifications",
    key: "specifications",
    namespace: "custom",
    description: "List of technical specifications for this product",
    type: "list.metaobject_reference",
    ownerType: PRODUCT,
    access: {
      storefront: PUBLIC_READ
    },
    validations: [
      {
        name: "metaobject_definition_id",
        value: "gid://shopify/MetaobjectDefinition/YOUR_ID_HERE"
      }
    ]
  }) {
    createdDefinition {
      id
      namespace
      key
      name
      type {
        name
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

### Step 4: Add Data to Products in Shopify

#### Option A: Via Shopify Admin UI

1. Go to Products → Select a product
2. Scroll to **Metafields** section
3. **Product Blueprint**: Upload an image file
4. **Product Specifications**:
   - Click "Add specification"
   - Fill in spec, type, and details fields
   - Repeat for each specification

#### Option B: Via GraphQL API

```graphql
mutation AddProductMetafields($productId: ID!) {
  productUpdate(input: {
    id: $productId,
    metafields: [
      # Blueprint (file reference)
      {
        namespace: "custom",
        key: "blueprint",
        type: "file_reference",
        value: "gid://shopify/MediaImage/YOUR_IMAGE_ID"
      }
    ]
  }) {
    product {
      id
      metafield_blueprint: metafield(namespace: "custom", key: "blueprint") {
        value
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

For specifications, first create metaobjects, then reference them:

```graphql
# 1. Create a specification metaobject
mutation CreateSpecification {
  metaobjectCreate(metaobject: {
    type: "specification_object",
    fields: [
      { key: "spec", value: "Keyboard" },
      { key: "type", value: "Grand Feel III Action" },
      { key: "details", value: "88-key wooden-key keyboard with let-off simulation and Ivory Touch key surfaces" }
    ]
  }) {
    metaobject {
      id
      fields {
        key
        value
      }
    }
    userErrors {
      field
      message
    }
  }
}

# 2. Add specification to product
mutation AddSpecificationToProduct($productId: ID!, $specificationIds: [String!]!) {
  productUpdate(input: {
    id: $productId,
    metafields: [
      {
        namespace: "custom",
        key: "specifications",
        type: "list.metaobject_reference",
        value: "[\"gid://shopify/Metaobject/123\", \"gid://shopify/Metaobject/456\"]"
      }
    ]
  }) {
    product {
      id
      metafield_specs: metafield(namespace: "custom", key: "specifications") {
        references(first: 10) {
          edges {
            node {
              ... on Metaobject {
                id
                fields {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## How the Sync Works

### Automatic Sync Flow

```
1. Product saved/updated in Payload CMS
   ↓
2. Products.ts afterChange hook triggers
   ↓
3. syncShopifyDataToProduct() called
   ↓
4. fetchShopifyProduct() fetches data from Shopify Admin API
   ↓
5. GraphQL query includes custom.blueprint and custom.specifications
   ↓
6. transformShopifyToPayload() maps Shopify data to Payload format
   ↓
7. Product updated in Payload with new blueprint & specifications
```

### Bulk Sync

To sync all products with the new fields:

1. Go to Payload Admin → Products
2. Click "Bulk Sync from Shopify" button
3. All products will be re-synced with blueprint and specifications

**Or via API**:
```bash
curl -X POST http://localhost:3000/api/products/bulk-sync-from-shopify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Code Changes Summary

### Files Modified

1. **`src/lib/shopify/fetch-product.ts`**:
   - Added `ShopifySpecification` interface
   - Updated `ShopifyProductData.metafields` to include `blueprint` and `specifications`
   - Added metafield queries to all GraphQL fragments
   - Updated `transformShopifyProduct()` to parse blueprint and specifications

2. **`src/collections/Products.ts`**:
   - Added `blueprint` group field (url, alt, width, height)
   - Added `specifications` array field (id, spec, type, details)
   - Updated `transformShopifyToPayload()` to map these fields

### GraphQL Queries Updated

All product fetch queries now include:

```graphql
metafield_blueprint: metafield(namespace: "custom", key: "blueprint") {
  reference {
    ... on MediaImage {
      image {
        url
        altText
        width
        height
      }
    }
  }
}

metafield_specifications: metafield(namespace: "custom", key: "specifications") {
  references(first: 50) {
    edges {
      node {
        ... on Metaobject {
          id
          fields {
            key
            value
          }
        }
      }
    }
  }
}
```

## Testing the Integration

### 1. Verify Shopify Setup

```graphql
# Test query to verify metafields are set up correctly
query TestProductMetafields($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title

    blueprint: metafield(namespace: "custom", key: "blueprint") {
      value
      reference {
        ... on MediaImage {
          image {
            url
          }
        }
      }
    }

    specifications: metafield(namespace: "custom", key: "specifications") {
      references(first: 10) {
        edges {
          node {
            ... on Metaobject {
              id
              fields {
                key
                value
              }
            }
          }
        }
      }
    }
  }
}
```

### 2. Test Product Sync

```typescript
// Test in Payload admin or via script
import { fetchShopifyProduct } from '@/lib/shopify/fetch-product'

const product = await fetchShopifyProduct('your-product-handle')

console.log('Blueprint:', product?.metafields?.blueprint)
console.log('Specifications:', product?.metafields?.specifications)
```

### 3. Verify Payload Storage

1. Go to Payload Admin → Products
2. Select a product that has blueprint/specifications in Shopify
3. Trigger sync (save the product with auto-sync enabled)
4. Check that `blueprint` and `specifications` fields are populated

## Troubleshooting

### Specifications `references` field returns null

**Symptoms**:
```
[Transform] Specifications metafield exists but references is null
{
  key: 'specifications',
  value: '["gid://shopify/Metaobject/148539637915"]',
  type: 'list.metaobject_reference',
  references: null
}
```

**Cause**: Missing `read_metaobjects` access scope in Shopify app configuration.

**Why this happens**:
- The metafield `value` contains metaobject IDs (stored in Shopify)
- The GraphQL `references` field requires `read_metaobjects` scope to resolve those IDs into full metaobject data
- Without the scope, Shopify returns `references: null` even though the IDs exist

**Fix**:

1. **Add the scope** to your Shopify app (see Prerequisites section above)
2. **Reinstall the app** on your store to apply the new scope
3. **Verify scope is active** using the test query in Prerequisites
4. **Re-run bulk sync** to fetch specifications with resolved references

**Verification**:
```bash
# After adding scope, run bulk sync
bun run dev

# In another terminal
curl -X POST http://localhost:3000/api/products/bulk-sync-from-shopify

# Check terminal output - should see:
# [Transform] ✅ Processed X specifications for [Product]
```

**Alternative causes** (if scope is confirmed active):
- Metaobjects are in draft state (not published) - publish them in Shopify Admin
- Metaobjects were deleted - recreate them
- Metaobject IDs in `value` field don't match existing metaobjects - verify IDs

### Error: "Cannot read properties of null (reading 'url')"

**Cause**: This happens when a product doesn't have a blueprint metafield in Shopify, and the sync tries to set `blueprint` to `null`.

**Fix**: Already implemented! The code now:
- Only includes `blueprint` field if it has a valid URL
- Makes all blueprint sub-fields optional
- Hides the blueprint field in admin UI if no blueprint exists

**Note**: Products without blueprints will simply not have the `blueprint` field populated - this is expected behavior.

### Blueprint not syncing

**Check**:
- ✅ Metafield definition exists in Shopify
- ✅ Product has blueprint image uploaded
- ✅ Metafield namespace is `custom` and key is `blueprint`
- ✅ File is an image type

**Debug**:
```typescript
// Check GraphQL response
const product = await fetchShopifyProduct('product-handle')
console.log('Blueprint raw:', product?.metafields?.blueprint)
```

### Specifications not syncing

**Most Common Cause**: Missing `read_metaobjects` scope (see "Specifications `references` field returns null" above)

**Other Checks**:
- ✅ Shopify app has `read_metaobjects` OAuth scope enabled
- ✅ App has been reinstalled after adding scope
- ✅ Metaobject definition exists with correct type `specification_object`
- ✅ Metafield definition references correct metaobject definition ID
- ✅ Metaobjects have been created and assigned to product
- ✅ Metaobjects are published (not in draft state)
- ✅ Metaobject fields are named `spec`, `type`, `details` (case-sensitive)

**Debug**:
```typescript
const product = await fetchShopifyProduct('product-handle')
console.log('Specifications raw:', product?.metafields?.specifications)

// Expected if working correctly:
// {
//   specifications: [
//     {
//       id: "gid://shopify/Metaobject/123",
//       spec: "Keyboard",
//       type: "Grand Feel III",
//       details: "88-key wooden-key keyboard..."
//     }
//   ]
// }

// If scope is missing:
// { specifications: [] }  // Empty array
```

### Sync errors in Payload

**Check**:
1. Go to product in Payload Admin
2. Look at sidebar → Shopify → Sync Errors
3. Review error messages

**Common issues**:
- Invalid Shopify GID format
- Missing metafield permissions
- GraphQL query errors (check Shopify Admin API logs)

## Next Steps

### Optional Enhancements

1. **Add validation in Payload**:
   ```typescript
   {
     name: 'specifications',
     type: 'array',
     validate: (value) => {
       if (!value) return true
       if (value.length > 50) return 'Maximum 50 specifications allowed'
       return true
     }
   }
   ```

2. **Add custom admin UI for specifications**:
   - Create custom component to display specs in table format
   - Add filtering/sorting capabilities

3. **Create reusable components**:
   - `<ProductBlueprint />` component with zoom/pan
   - `<SpecificationsTable />` with search/filter

4. **Add to product blocks**:
   - Create `product-specifications` block for page builder
   - Create `product-blueprint-viewer` block with interactive features

## Support

For questions or issues:
1. Check Shopify Admin API documentation
2. Review GraphQL query responses in Shopify GraphiQL
3. Check Payload CMS sync error logs
4. Verify metafield definitions match exactly

## References

- [Shopify Metafields Guide](https://shopify.dev/docs/apps/build/custom-data/metafields)
- [Shopify Metaobjects Guide](https://shopify.dev/docs/apps/build/custom-data/metaobjects)
- [GraphQL Admin API Reference](https://shopify.dev/docs/api/admin-graphql)
- [File References in Metafields](https://shopify.dev/docs/apps/build/custom-data/metafields/definitions/types#file-references)
