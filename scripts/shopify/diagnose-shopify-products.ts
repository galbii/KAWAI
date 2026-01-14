#!/usr/bin/env bun
/**
 * Shopify Product Publication Diagnostic Script
 * Checks product publication status and sales channels
 */

const ADMIN_PUBLICATIONS_QUERY = `
  query GetProductsWithPublications($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          status
          publishedOnCurrentPublication
          publishedOnPublication(publicationId: null)
          resourcePublications(first: 10) {
            edges {
              node {
                publication {
                  id
                  name
                }
                publishDate
                isPublished
              }
            }
          }
        }
      }
    }
  }
`

const CHANNELS_QUERY = `
  query GetPublications {
    publications(first: 10) {
      edges {
        node {
          id
          name
          supportsFuturePublishing
        }
      }
    }
  }
`

async function checkPublications() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

  if (!storeDomain || !adminToken) {
    console.error('❌ Missing Shopify Admin credentials')
    return
  }

  console.log('\n🔍 Checking Sales Channels & Publications...\n')

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
          query: CHANNELS_QUERY,
        }),
      }
    )

    const data = await response.json()

    if (data.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(data.errors, null, 2))
      console.log('\n⚠️  You need to fix the Admin API permissions first.')
      console.log('   Follow the instructions to add read_products and read_publications scopes.\n')
      return
    }

    if (data.data?.publications) {
      console.log('✅ Available Sales Channels:')
      data.data.publications.edges.forEach((edge: any) => {
        console.log(`   - ${edge.node.name} (ID: ${edge.node.id})`)
      })
    }

    // Now check products
    console.log('\n🔍 Checking Product Publication Status...\n')

    const productsResponse = await fetch(
      `https://${storeDomain}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({
          query: ADMIN_PUBLICATIONS_QUERY,
          variables: { first: 10 },
        }),
      }
    )

    const productsData = await productsResponse.json()

    if (productsData.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(productsData.errors, null, 2))
      return
    }

    if (productsData.data?.products?.edges?.length === 0) {
      console.log('❌ No products found in store')
      console.log('   Add products in Shopify admin first.\n')
      return
    }

    console.log(`Found ${productsData.data.products.edges.length} products:\n`)

    productsData.data.products.edges.forEach((edge: any, index: number) => {
      const product = edge.node
      console.log(`${index + 1}. ${product.title}`)
      console.log(`   Status: ${product.status}`)
      console.log(`   Handle: ${product.handle}`)

      if (product.resourcePublications?.edges?.length > 0) {
        console.log(`   Published to:`)
        product.resourcePublications.edges.forEach((pub: any) => {
          console.log(`     - ${pub.node.publication.name}: ${pub.node.isPublished ? '✅' : '❌'}`)
        })
      } else {
        console.log(`   ⚠️  Not published to any channels!`)
      }
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

console.log('🧪 Shopify Product Publication Diagnostic')
console.log('=========================================\n')

checkPublications()
