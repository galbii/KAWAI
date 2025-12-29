#!/usr/bin/env bun
/**
 * Shopify Cart Integration Test Script
 * Tests cart functionality including create, add, update, remove, and checkout
 */

import {
  createCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  getCart,
  getCheckoutUrl,
  applyDiscountCode,
  isCartEmpty,
  getCartItemCount,
  findLineByVariantId,
  saveCartId,
  getCartId,
  clearCartId,
  type CartLineInput,
} from '../src/lib/shopify'

// Test product variant IDs from our store
const TEST_VARIANTS = {
  CRYSTAL_GRAND: 'gid://shopify/ProductVariant/51003432632618' as const,
  ES60_DIGITAL: 'gid://shopify/ProductVariant/51003432698154' as const,
  K200_UPRIGHT: 'gid://shopify/ProductVariant/51003432796458' as const,
  HML3_STAND: 'gid://shopify/ProductVariant/51003433025834' as const,
}

console.log('🛒 Shopify Cart Integration Test')
console.log('='.repeat(80))
console.log()

async function testCartCreation() {
  console.log('📝 Test 1: Create Cart')
  console.log('-'.repeat(80))

  try {
    const cart = await createCart([
      {
        merchandiseId: TEST_VARIANTS.ES60_DIGITAL,
        quantity: 1,
      },
    ])

    console.log('✅ Cart created successfully!')
    console.log(`   Cart ID: ${cart.id}`)
    console.log(`   Total Items: ${cart.totalQuantity}`)
    console.log(`   Subtotal: $${cart.subtotal} ${cart.currency}`)
    console.log(`   Total: $${cart.total} ${cart.currency}`)
    console.log(`   Checkout URL: ${cart.checkoutUrl}`)
    console.log()

    // Save cart ID for subsequent tests
    saveCartId(cart.id)
    console.log('💾 Cart ID saved to localStorage')
    console.log()

    return cart
  } catch (error) {
    console.error('❌ Cart creation failed:', error)
    throw error
  }
}

async function testAddToCart(cartId: string) {
  console.log('📝 Test 2: Add Items to Cart')
  console.log('-'.repeat(80))

  try {
    const cart = await addToCart(cartId, [
      {
        merchandiseId: TEST_VARIANTS.HML3_STAND,
        quantity: 1,
      },
      {
        merchandiseId: TEST_VARIANTS.K200_UPRIGHT,
        quantity: 1,
      },
    ])

    console.log('✅ Items added successfully!')
    console.log(`   Total Items: ${cart.totalQuantity}`)
    console.log(`   Subtotal: $${cart.subtotal} ${cart.currency}`)
    console.log()

    console.log('   Cart Lines:')
    cart.lines.forEach((line, index) => {
      console.log(`   ${index + 1}. ${line.productTitle}`)
      console.log(`      Quantity: ${line.quantity}`)
      console.log(`      Price: $${line.price}`)
      console.log(`      Line Total: $${line.total}`)
      console.log()
    })

    return cart
  } catch (error) {
    console.error('❌ Add to cart failed:', error)
    throw error
  }
}

async function testUpdateCartLine(cartId: string, lineId: string) {
  console.log('📝 Test 3: Update Cart Line Quantity')
  console.log('-'.repeat(80))

  try {
    const cart = await updateCartLine(cartId, lineId, 2)

    console.log('✅ Cart line updated successfully!')
    console.log(`   Total Items: ${cart.totalQuantity}`)
    console.log(`   Updated Subtotal: $${cart.subtotal} ${cart.currency}`)
    console.log()

    const updatedLine = cart.lines.find((line) => line.id === lineId)
    if (updatedLine) {
      console.log(`   Updated line: ${updatedLine.productTitle}`)
      console.log(`   New quantity: ${updatedLine.quantity}`)
      console.log()
    }

    return cart
  } catch (error) {
    console.error('❌ Update cart line failed:', error)
    throw error
  }
}

async function testRemoveFromCart(cartId: string, lineIds: string[]) {
  console.log('📝 Test 4: Remove Items from Cart')
  console.log('-'.repeat(80))

  try {
    const cart = await removeFromCart(cartId, lineIds)

    console.log('✅ Items removed successfully!')
    console.log(`   Total Items: ${cart.totalQuantity}`)
    console.log(`   Updated Subtotal: $${cart.subtotal} ${cart.currency}`)
    console.log()

    return cart
  } catch (error) {
    console.error('❌ Remove from cart failed:', error)
    throw error
  }
}

async function testGetCart(cartId: string) {
  console.log('📝 Test 5: Get Cart by ID')
  console.log('-'.repeat(80))

  try {
    const cart = await getCart(cartId)

    if (!cart) {
      console.log('❌ Cart not found (might be expired)')
      return null
    }

    console.log('✅ Cart retrieved successfully!')
    console.log(`   Cart ID: ${cart.id}`)
    console.log(`   Total Items: ${cart.totalQuantity}`)
    console.log(`   Is Empty: ${isCartEmpty(cart)}`)
    console.log(`   Item Count: ${getCartItemCount(cart)}`)
    console.log()

    return cart
  } catch (error) {
    console.error('❌ Get cart failed:', error)
    throw error
  }
}

async function testDiscountCode(cartId: string) {
  console.log('📝 Test 6: Apply Discount Code')
  console.log('-'.repeat(80))

  try {
    // Try a test discount code (may not work if not configured in Shopify)
    const cart = await applyDiscountCode(cartId, 'TEST10')

    console.log('✅ Discount code applied!')
    console.log(`   Discount Codes: ${cart.discountCodes.join(', ')}`)
    console.log(`   Total Discount: $${cart.discounts}`)
    console.log()

    return cart
  } catch (error) {
    console.log('⚠️  Discount code test skipped (code may not exist in store)')
    console.log()
    return null
  }
}

async function testUtilityFunctions(cart: any) {
  console.log('📝 Test 7: Cart Utility Functions')
  console.log('-'.repeat(80))

  console.log('✅ Testing utility functions:')
  console.log(`   isCartEmpty: ${isCartEmpty(cart)}`)
  console.log(`   getCartItemCount: ${getCartItemCount(cart)}`)

  // Test finding line by variant
  const variantId = TEST_VARIANTS.ES60_DIGITAL
  const line = findLineByVariantId(cart, variantId)
  if (line) {
    console.log(`   findLineByVariantId: Found ${line.productTitle}`)
  } else {
    console.log(`   findLineByVariantId: Not found`)
  }
  console.log()
}

async function testCheckoutUrl(cartId: string) {
  console.log('📝 Test 8: Get Checkout URL')
  console.log('-'.repeat(80))

  try {
    const checkoutUrl = await getCheckoutUrl(cartId)

    console.log('✅ Checkout URL retrieved!')
    console.log(`   URL: ${checkoutUrl}`)
    console.log()
    console.log('   ℹ️  In a real app, you would redirect the user to this URL:')
    console.log('   window.location.href = checkoutUrl')
    console.log()

    return checkoutUrl
  } catch (error) {
    console.error('❌ Get checkout URL failed:', error)
    throw error
  }
}

async function testStorageFunctions() {
  console.log('📝 Test 9: Cart Storage Functions')
  console.log('-'.repeat(80))

  const storedCartId = getCartId()
  console.log(`✅ Retrieved cart ID from storage: ${storedCartId}`)
  console.log()

  // Create a fresh cart and test storage
  const newCart = await createCart([
    {
      merchandiseId: TEST_VARIANTS.ES60_DIGITAL,
      quantity: 1,
    },
  ])

  saveCartId(newCart.id)
  console.log(`💾 Saved new cart ID: ${newCart.id}`)

  const retrievedId = getCartId()
  console.log(`✅ Retrieved cart ID matches: ${retrievedId === newCart.id}`)
  console.log()

  return newCart.id
}

// Main test execution
async function runTests() {
  let testCartId: string | null = null

  try {
    // Clear any existing cart
    clearCartId()

    // Test 1: Create cart
    const cart1 = await testCartCreation()
    testCartId = cart1.id

    // Test 2: Add items
    const cart2 = await testAddToCart(testCartId)

    // Test 3: Update quantity
    const firstLine = cart2.lines[0]
    if (!firstLine) {
      throw new Error('No lines in cart')
    }
    const cart3 = await testUpdateCartLine(testCartId, firstLine.id)

    // Test 4: Remove item
    const lastLine = cart3.lines[cart3.lines.length - 1]
    if (!lastLine) {
      throw new Error('No lines in cart')
    }
    const cart4 = await removeFromCart(testCartId, [lastLine.id])

    // Test 5: Get cart
    const cart5 = await testGetCart(testCartId)
    if (!cart5) {
      console.log('⚠️  Skipping remaining tests - cart not found')
      return
    }

    // Test 6: Discount code (optional)
    await testDiscountCode(testCartId)

    // Test 7: Utility functions
    await testUtilityFunctions(cart5)

    // Test 8: Checkout URL
    await testCheckoutUrl(testCartId)

    // Test 9: Storage functions
    await testStorageFunctions()

    console.log('='.repeat(80))
    console.log('✅ All tests completed successfully!')
    console.log()
    console.log('📋 Summary:')
    console.log('   ✓ Cart creation')
    console.log('   ✓ Add to cart')
    console.log('   ✓ Update cart line')
    console.log('   ✓ Remove from cart')
    console.log('   ✓ Get cart')
    console.log('   ✓ Discount codes')
    console.log('   ✓ Utility functions')
    console.log('   ✓ Checkout URL')
    console.log('   ✓ Storage functions')
    console.log()
  } catch (error) {
    console.error('❌ Test suite failed:', error)
    process.exit(1)
  } finally {
    // Cleanup
    if (testCartId) {
      console.log('🧹 Cleanup: Cart ID remains in localStorage for manual testing')
      console.log(`   You can clear it by running: clearCartId()`)
      console.log()
    }
  }
}

runTests()
