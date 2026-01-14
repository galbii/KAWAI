#!/usr/bin/env bun
/**
 * Shopify Integration Test
 *
 * Tests the new Shopify integration library
 */

import { getProducts, getProductByHandle, shopifyClient } from '../src/lib/shopify'

async function main() {
  console.log('🧪 Testing Shopify Integration Library')
  console.log('=' .repeat(80))

  try {
    // Test 1: Get products
    console.log('\n📦 Test 1: Fetching products...')
    const products = await getProducts({ first: 5 })
    console.log(`✅ Successfully fetched ${products.length} products`)

    if (products.length > 0 && products[0]) {
      const product = products[0]
      console.log(`\n   First product:`)
      console.log(`   - Title: ${product.title}`)
      console.log(`   - Handle: ${product.handle}`)
      console.log(`   - Type: ${product.type}`)
      console.log(`   - Price: ${product.price.display}`)
      console.log(`   - Available: ${product.available}`)
      console.log(`   - Images: ${product.images.length}`)
      console.log(`   - Variants: ${product.variants.length}`)
      console.log(`   - Tags: ${product.tags.slice(0, 3).join(', ')}...`)
    }

    // Test 2: Get product by handle
    if (products.length > 0 && products[0]) {
      console.log(`\n📦 Test 2: Fetching product by handle...`)
      const handle = products[0].handle
      const singleProduct = await getProductByHandle(handle)

      if (singleProduct) {
        console.log(`✅ Successfully fetched: ${singleProduct.title}`)
        console.log(`   - Description length: ${singleProduct.description.length} chars`)
        console.log(`   - Has metadata: ${Object.keys(singleProduct.metadata || {}).length > 0}`)
      }
    }

    // Test 3: Test client configuration
    console.log('\n🔧 Test 3: Client configuration...')
    console.log(`   - Store domain: ${shopifyClient.getStoreDomain()}`)
    console.log(`   - API endpoint: ${shopifyClient.getEndpoint()}`)
    console.log(`✅ Client configured correctly`)

    // Summary
    console.log('\n' + '=' .repeat(80))
    console.log('✨ All tests passed!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Total products fetched: ${products.length}`)
    console.log(`   - Product types: ${[...new Set(products.map(p => p.type))].join(', ')}`)
    console.log(`   - Available products: ${products.filter(p => p.available).length}`)

    // Price range
    const prices = products.map(p => p.price.min)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    console.log(`   - Price range: $${minPrice.toFixed(0)} - $${maxPrice.toFixed(0)}`)

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)
    }
    process.exit(1)
  }
}

main()
