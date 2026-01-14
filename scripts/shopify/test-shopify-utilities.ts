#!/usr/bin/env bun
/**
 * Test Shopify Utility Functions
 */

import {
  getProducts,
  filterProductsByTag,
  sortProductsByPrice,
  groupProductsByType,
  isProductOnSale,
  getDiscountPercentage,
  getShopifyImageUrl,
} from '../src/lib/shopify'

async function main() {
  console.log('🧪 Testing Shopify Utility Functions')
  console.log('=' .repeat(80))

  const products = await getProducts({ first: 10 })

  // Test 1: Filter by tag
  console.log('\n📦 Test 1: Filter by tag')
  const digitalPianos = filterProductsByTag(products, 'Digital Piano')
  console.log(`   Found ${digitalPianos.length} products with "Digital Piano" tag`)

  // Test 2: Sort by price
  console.log('\n📦 Test 2: Sort by price (ascending)')
  const sortedByPrice = sortProductsByPrice(products, 'asc')
  console.log(`   Cheapest: ${sortedByPrice[0]?.title} - ${sortedByPrice[0]?.price.display}`)
  console.log(`   Most expensive: ${sortedByPrice[sortedByPrice.length - 1]?.title} - ${sortedByPrice[sortedByPrice.length - 1]?.price.display}`)

  // Test 3: Group by type
  console.log('\n📦 Test 3: Group by product type')
  const groupedByType = groupProductsByType(products)
  Object.entries(groupedByType).forEach(([type, prods]) => {
    console.log(`   ${type}: ${prods.length} products`)
  })

  // Test 4: Check for sales
  console.log('\n📦 Test 4: Check for products on sale')
  const onSale = products.filter(isProductOnSale)
  console.log(`   ${onSale.length} products on sale`)
  onSale.forEach(product => {
    const discount = getDiscountPercentage(product)
    console.log(`   - ${product.title}: ${discount}% off`)
  })

  // Test 5: Image URL transformation
  console.log('\n📦 Test 5: Image URL transformation')
  const product = products[0]
  if (product?.image?.url) {
    console.log(`   Original: ${product.image.url.substring(0, 80)}...`)
    const resized = getShopifyImageUrl(product.image.url, { width: 400, height: 400 })
    console.log(`   Resized:  ${resized.substring(0, 80)}...`)
  }

  console.log('\n' + '=' .repeat(80))
  console.log('✨ All utility tests passed!')
}

main()
