#!/usr/bin/env bun
/**
 * Shopify Product Fetch Test Script
 * Tests both Storefront API and Admin API to see available product data
 */

// Shopify Storefront API GraphQL query
const STOREFRONT_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          productType
          vendor
          tags
          availableForSale
          createdAt
          updatedAt
          onlineStoreUrl
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "specifications" }
            { namespace: "custom", key: "features" }
          ]) {
            key
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

// Shopify Admin API GraphQL query
const ADMIN_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          productType
          vendor
          tags
          status
          createdAt
          updatedAt
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                price
                compareAtPrice
                inventoryQuantity
                image {
                  url
                  altText
                }
              }
            }
          }
          metafields(first: 20) {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

async function testStorefrontAPI() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!storeDomain || !storefrontToken) {
    console.error('❌ Missing Shopify Storefront credentials')
    return null
  }

  console.log('\n🛍️  Testing Shopify Storefront API...')
  console.log(`Store: ${storeDomain}`)

  try {
    const response = await fetch(
      `https://${storeDomain}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
        },
        body: JSON.stringify({
          query: STOREFRONT_PRODUCTS_QUERY,
          variables: { first: 5 },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Storefront API Error: ${response.status} ${response.statusText}`)
      console.error('Response:', errorText)
      return null
    }

    const data = await response.json()

    if (data.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(data.errors, null, 2))
      return null
    }

    console.log('✅ Storefront API Success!')
    console.log(`Found ${data.data.products.edges.length} products`)

    return data.data.products.edges
  } catch (error) {
    console.error('❌ Storefront API Exception:', error)
    return null
  }
}

async function testAdminAPI() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

  if (!storeDomain || !adminToken) {
    console.error('❌ Missing Shopify Admin credentials')
    return null
  }

  console.log('\n🔧 Testing Shopify Admin API...')
  console.log(`Store: ${storeDomain}`)

  try {
    const response = await fetch(
      `https://${storeDomain}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({
          query: ADMIN_PRODUCTS_QUERY,
          variables: { first: 5 },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Admin API Error: ${response.status} ${response.statusText}`)
      console.error('Response:', errorText)
      return null
    }

    const data = await response.json()

    if (data.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(data.errors, null, 2))
      return null
    }

    console.log('✅ Admin API Success!')
    console.log(`Found ${data.data.products.edges.length} products`)

    return data.data.products.edges
  } catch (error) {
    console.error('❌ Admin API Exception:', error)
    return null
  }
}

function displayProductSummary(products: any[], apiType: string) {
  if (!products || products.length === 0) {
    console.log(`\n❌ No products found from ${apiType}`)
    return
  }

  console.log(`\n📦 ${apiType} Product Summary (${products.length} products)`)
  console.log('=' .repeat(80))

  products.forEach((edge, index) => {
    const product = edge.node
    console.log(`\n${index + 1}. ${product.title}`)
    console.log(`   Handle: ${product.handle}`)
    console.log(`   Type: ${product.productType || 'N/A'}`)
    console.log(`   Vendor: ${product.vendor || 'N/A'}`)
    console.log(`   Tags: ${product.tags?.join(', ') || 'None'}`)
    console.log(`   Available: ${product.availableForSale ?? product.status}`)

    // Price info
    const priceRange = product.priceRange || product.priceRangeV2
    if (priceRange) {
      const min = priceRange.minVariantPrice
      const max = priceRange.maxVariantPrice
      if (min.amount === max.amount) {
        console.log(`   Price: $${min.amount} ${min.currencyCode}`)
      } else {
        console.log(`   Price: $${min.amount} - $${max.amount} ${min.currencyCode}`)
      }
    }

    // Images
    const imageCount = product.images?.edges?.length || 0
    console.log(`   Images: ${imageCount}`)
    if (imageCount > 0) {
      console.log(`   First Image: ${product.images.edges[0].node.url}`)
    }

    // Variants
    const variantCount = product.variants?.edges?.length || 0
    console.log(`   Variants: ${variantCount}`)

    // Metafields
    const metafieldCount = product.metafields?.edges?.length || product.metafields?.filter((mf: any) => mf !== null).length || 0
    if (metafieldCount > 0) {
      console.log(`   Metafields: ${metafieldCount}`)
      if (product.metafields?.edges) {
        product.metafields.edges.slice(0, 3).forEach((mf: any) => {
          if (mf?.node) {
            console.log(`     - ${mf.node.namespace}.${mf.node.key}: ${mf.node.type}`)
          }
        })
      } else if (product.metafields) {
        product.metafields.filter((mf: any) => mf !== null).slice(0, 3).forEach((mf: any) => {
          console.log(`     - ${mf.key}: ${mf.type}`)
        })
      }
    }

    // Description preview
    if (product.description) {
      const preview = product.description.substring(0, 100)
      console.log(`   Description: ${preview}${product.description.length > 100 ? '...' : ''}`)
    }
  })
}

// Main execution
async function main() {
  console.log('🧪 Shopify Commerce Test Script')
  console.log('================================\n')

  // Test Storefront API
  const storefrontProducts = await testStorefrontAPI()
  if (storefrontProducts) {
    displayProductSummary(storefrontProducts, 'Storefront API')

    // Save full response for inspection
    const storefrontFile = '/Users/chancenoonan/dev/code/KAWAI/scripts/shopify-storefront-response.json'
    await Bun.write(storefrontFile, JSON.stringify(storefrontProducts, null, 2))
    console.log(`\n💾 Full Storefront API response saved to: ${storefrontFile}`)
  }

  console.log('\n' + '='.repeat(80))

  // Test Admin API
  const adminProducts = await testAdminAPI()
  if (adminProducts) {
    displayProductSummary(adminProducts, 'Admin API')

    // Save full response for inspection
    const adminFile = '/Users/chancenoonan/dev/code/KAWAI/scripts/shopify-admin-response.json'
    await Bun.write(adminFile, JSON.stringify(adminProducts, null, 2))
    console.log(`\n💾 Full Admin API response saved to: ${adminFile}`)
  }

  console.log('\n\n✨ Test complete!')
}

main()
