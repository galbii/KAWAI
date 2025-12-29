#!/usr/bin/env bun
/**
 * Shopify Integration Demo
 *
 * Comprehensive demonstration of the Shopify integration library
 * Shows real-world usage patterns for the KAWAI Piano website
 */

import {
  getProducts,
  getProductByHandle,
  getProductsByType,
  searchProducts,
  sortProductsByPrice,
  filterAvailableProducts,
  groupProductsByType,
  isProductOnSale,
  getDiscountPercentage,
  formatProductPrice,
  getProductTypeLabel,
} from '../src/lib/shopify'

console.log('🎹 KAWAI Piano Website - Shopify Integration Demo')
console.log('=' .repeat(80))

async function demoBasicFetching() {
  console.log('\n📦 1. BASIC PRODUCT FETCHING')
  console.log('-'.repeat(80))

  const products = await getProducts({ first: 5 })
  console.log(`✅ Fetched ${products.length} products`)

  products.forEach((product, index) => {
    console.log(`\n   ${index + 1}. ${product.title}`)
    console.log(`      Type: ${getProductTypeLabel(product.type)}`)
    console.log(`      Price: ${formatProductPrice(product)}`)
    console.log(`      Available: ${product.available ? '✅' : '❌'}`)
    console.log(`      Handle: /${product.handle}`)
  })
}

async function demoFiltering() {
  console.log('\n\n🔍 2. FILTERING & CATEGORIZATION')
  console.log('-'.repeat(80))

  const allProducts = await getProducts({ first: 10 })

  // Group by type
  const grouped = groupProductsByType(allProducts)
  console.log('\n   Products by category:')
  Object.entries(grouped).forEach(([type, products]) => {
    console.log(`   - ${type}: ${products.length} products`)
  })

  // Filter available only
  const available = filterAvailableProducts(allProducts)
  console.log(`\n   Available products: ${available.length}/${allProducts.length}`)

  // Find products on sale
  const onSale = allProducts.filter(isProductOnSale)
  if (onSale.length > 0) {
    console.log(`\n   Products on sale:`)
    onSale.forEach(product => {
      const discount = getDiscountPercentage(product)
      console.log(`   - ${product.title}: ${discount}% off`)
    })
  }
}

async function demoSorting() {
  console.log('\n\n📊 3. SORTING')
  console.log('-'.repeat(80))

  const products = await getProducts({ first: 10 })

  // Sort by price (ascending)
  const byPrice = sortProductsByPrice(products, 'asc')
  console.log('\n   Sorted by price (low to high):')
  byPrice.slice(0, 3).forEach(p => {
    console.log(`   - ${p.title}: ${p.price.display}`)
  })

  // Sort by price (descending)
  const byPriceDesc = sortProductsByPrice(products, 'desc')
  console.log('\n   Most expensive:')
  console.log(`   - ${byPriceDesc[0]?.title}: ${byPriceDesc[0]?.price.display}`)
}

async function demoSearch() {
  console.log('\n\n🔎 4. SEARCH')
  console.log('-'.repeat(80))

  const queries = ['grand piano', 'digital', 'kawai']

  for (const query of queries) {
    const results = await searchProducts(query, { first: 5 })
    console.log(`\n   Search: "${query}" → ${results.length} results`)
    if (results.length > 0 && results[0]) {
      console.log(`   - ${results[0].title}`)
    }
  }
}

async function demoSingleProduct() {
  console.log('\n\n📝 5. SINGLE PRODUCT DETAILS')
  console.log('-'.repeat(80))

  // Get first product
  const products = await getProducts({ first: 1 })
  if (products.length === 0 || !products[0]) return

  const handle = products[0].handle
  const product = await getProductByHandle(handle)

  if (!product) return

  console.log(`\n   Product: ${product.title}`)
  console.log(`   Type: ${product.type}`)
  console.log(`   Vendor: ${product.vendor}`)
  console.log(`   Price: ${product.price.display}`)
  console.log(`   Available: ${product.available}`)
  console.log(`   Description: ${product.description.substring(0, 100)}...`)
  console.log(`\n   Images: ${product.images.length}`)
  if (product.images.length > 0 && product.images[0]) {
    console.log(`   - Main image: ${product.images[0].width}x${product.images[0].height}`)
  }
  console.log(`\n   Variants: ${product.variants.length}`)
  product.variants.forEach((variant, i) => {
    console.log(`   ${i + 1}. ${variant.title} - $${variant.price}`)
  })
  console.log(`\n   Tags: ${product.tags.slice(0, 5).join(', ')}`)
  console.log(`   Metadata keys: ${Object.keys(product.metadata || {}).join(', ') || 'none'}`)
}

async function demoTypeFiltering() {
  console.log('\n\n🎼 6. PRODUCT TYPE FILTERING')
  console.log('-'.repeat(80))

  const types = ['Grand Piano', 'Digital Piano', 'Upright']

  for (const type of types) {
    const products = await getProductsByType(type, { first: 10 })
    console.log(`\n   ${type}: ${products.length} products found`)
    if (products.length > 0 && products[0]) {
      console.log(`   Example: ${products[0].title}`)
    }
  }
}

async function demoStatistics() {
  console.log('\n\n📈 7. CATALOG STATISTICS')
  console.log('-'.repeat(80))

  const products = await getProducts({ first: 50 })

  // Calculate statistics
  const available = products.filter(p => p.available).length
  const unavailable = products.length - available
  const onSale = products.filter(isProductOnSale).length

  const prices = products.filter(p => p.price.min > 0).map(p => p.price.min)
  const avgPrice = prices.length > 0
    ? prices.reduce((a, b) => a + b, 0) / prices.length
    : 0

  const types = [...new Set(products.map(p => p.type))]
  const vendors = [...new Set(products.map(p => p.vendor))]

  console.log(`\n   Total products: ${products.length}`)
  console.log(`   Available: ${available} (${Math.round((available / products.length) * 100)}%)`)
  console.log(`   Unavailable: ${unavailable}`)
  console.log(`   On sale: ${onSale}`)
  console.log(`\n   Price range: $${Math.min(...prices).toFixed(0)} - $${Math.max(...prices).toFixed(0)}`)
  console.log(`   Average price: $${avgPrice.toFixed(0)}`)
  console.log(`\n   Product types: ${types.length}`)
  types.forEach(type => console.log(`   - ${type}`))
  console.log(`\n   Vendors: ${vendors.join(', ')}`)

  // Image statistics
  const totalImages = products.reduce((sum, p) => sum + p.images.length, 0)
  const avgImages = totalImages / products.length
  console.log(`\n   Total images: ${totalImages}`)
  console.log(`   Average images per product: ${avgImages.toFixed(1)}`)
}

async function main() {
  try {
    await demoBasicFetching()
    await demoFiltering()
    await demoSorting()
    await demoSearch()
    await demoSingleProduct()
    await demoTypeFiltering()
    await demoStatistics()

    console.log('\n\n' + '=' .repeat(80))
    console.log('✨ Demo complete! All Shopify integration features working correctly.')
    console.log('\n📚 For more examples, see: src/lib/shopify/examples.ts')
    console.log('📖 For type definitions, see: src/lib/shopify/types.ts')
    console.log('🔧 For utilities, see: src/lib/shopify/products.ts')
    console.log('=' .repeat(80))

  } catch (error) {
    console.error('\n❌ Demo failed:', error)
    process.exit(1)
  }
}

main()
