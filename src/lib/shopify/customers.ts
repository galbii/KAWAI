/**
 * Shopify Customer Management (Admin API)
 *
 * High-level functions for managing customers in Shopify
 * Includes customer creation, updating, and tagging functionality
 *
 * IMPORTANT: All functions require Shopify Admin API credentials with `write_customers` scope
 *
 * @example
 * ```typescript
 * import { createCustomerWithTags } from '@/lib/shopify/customers'
 *
 * const customer = await createCustomerWithTags({
 *   email: 'customer@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   tags: ['location-stlouis', 'inquiry-piano']
 * })
 * ```
 */

import { shopifyAdminClient } from './admin-client'
import {
  CUSTOMER_CREATE,
  CUSTOMER_UPDATE,
  CUSTOMER_SET,
  GET_CUSTOMER,
  SEARCH_CUSTOMER_BY_EMAIL,
} from './admin-queries'
import type {
  Customer,
  CustomerInput,
  CustomerCreateResponse,
  CustomerUpdateResponse,
  CustomerSetResponse,
  CustomerQueryResponse,
  CustomerUserError,
} from './types'

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Customer operation error
 */
export class CustomerError extends Error {
  constructor(
    message: string,
    public userErrors?: CustomerUserError[]
  ) {
    super(message)
    this.name = 'CustomerError'
  }
}

// ============================================================================
// Optimized Customer Upsert (RECOMMENDED)
// ============================================================================

/**
 * Create or update a customer (upsert operation)
 *
 * This function handles both creating new customers and updating existing ones.
 * It uses the backwards-compatible approach with customerCreate/customerUpdate
 * which works with API version 2025-01.
 *
 * Features:
 * - ✅ Automatic create-or-update based on email
 * - ✅ Updates ONLY provided fields (preserves existing data)
 * - ✅ Appends new tags to existing tags (doesn't replace)
 * - ✅ Compatible with API version 2025-01
 *
 * @param input - Customer information including email and tags
 * @returns Customer object (created or updated)
 * @throws {CustomerError} If operation fails
 *
 * @example
 * ```typescript
 * // From contact form - this handles both new and existing customers
 * const customer = await upsertCustomer({
 *   email: 'customer@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '+14155551234',
 *   tags: ['st-louis'],  // Appends to existing tags
 *   emailMarketingConsent: {
 *     marketingState: 'SUBSCRIBED',
 *     marketingOptInLevel: 'SINGLE_OPT_IN'
 *   },
 *   note: 'Contact form inquiry'
 * })
 * ```
 */
export async function upsertCustomer(
  input: CustomerInput
): Promise<Customer> {
  try {
    if (!input.email) {
      throw new CustomerError('Email is required for upsert operation')
    }

    // Search for existing customer first
    const existingCustomer = await getCustomerByEmail(input.email)

    if (existingCustomer) {
      // Customer exists - update with merged tags
      console.log('[Shopify Admin] Existing customer found, updating:', {
        email: input.email,
        existingTags: existingCustomer.tags,
        newTags: input.tags,
      })

      // Merge tags (preserve existing + add new)
      const existingTags = existingCustomer.tags || []
      const newTags = input.tags || []
      const mergedTags = [...new Set([...existingTags, ...newTags])]

      // Update customer with merged data
      const response = await shopifyAdminClient.mutate<CustomerUpdateResponse>(
        CUSTOMER_UPDATE,
        {
          input: {
            id: existingCustomer.id,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            tags: mergedTags,
            emailMarketingConsent: input.emailMarketingConsent,
            note: input.note,
            taxExempt: input.taxExempt,
            addresses: input.addresses
          }
        }
      )

      checkUserErrors(response.customerUpdate.userErrors, 'Customer update')

      if (!response.customerUpdate.customer) {
        throw new CustomerError('Customer update failed: No customer data returned')
      }

      console.log('[Shopify Admin] Customer updated:', {
        id: response.customerUpdate.customer.id,
        email: response.customerUpdate.customer.email,
        tags: response.customerUpdate.customer.tags,
      })

      return response.customerUpdate.customer
    } else {
      // Customer doesn't exist - create new
      console.log('[Shopify Admin] Customer not found, creating new:', {
        email: input.email,
        tags: input.tags,
      })

      const response = await shopifyAdminClient.mutate<CustomerCreateResponse>(
        CUSTOMER_CREATE,
        { input }
      )

      checkUserErrors(response.customerCreate.userErrors, 'Customer creation')

      if (!response.customerCreate.customer) {
        throw new CustomerError('Customer creation failed: No customer data returned')
      }

      console.log('[Shopify Admin] Customer created:', {
        id: response.customerCreate.customer.id,
        email: response.customerCreate.customer.email,
        tags: response.customerCreate.customer.tags,
      })

      return response.customerCreate.customer
    }
  } catch (error) {
    if (error instanceof CustomerError) {
      throw error
    }

    console.error('[Shopify Admin] Customer upsert error:', error)
    throw new CustomerError(
      `Failed to upsert customer: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// ============================================================================

/**
 * Check for user errors in mutation response
 */
function checkUserErrors(userErrors: CustomerUserError[], operation: string): void {
  if (userErrors && userErrors.length > 0) {
    const errorMessages = userErrors.map(e => `${e.field?.join('.')}: ${e.message}`).join(', ')
    throw new CustomerError(
      `${operation} failed: ${errorMessages}`,
      userErrors
    )
  }
}

// ============================================================================
// Customer Creation
// ============================================================================

/**
 * Create a new customer in Shopify with tags
 *
 * @param input - Customer information including tags
 * @returns Created customer object
 * @throws {CustomerError} If customer creation fails
 *
 * @example
 * ```typescript
 * const customer = await createCustomerWithTags({
 *   email: 'customer@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '+14155555555',
 *   tags: ['location-stlouis', 'inquiry-piano-consultation'],
 *   acceptsMarketing: true
 * })
 * ```
 */
export async function createCustomerWithTags(
  input: CustomerInput
): Promise<Customer> {
  try {
    const response = await shopifyAdminClient.mutate<CustomerCreateResponse>(
      CUSTOMER_CREATE,
      { input }
    )

    // Check for user errors
    checkUserErrors(response.customerCreate.userErrors, 'Customer creation')

    // Verify customer was created
    if (!response.customerCreate.customer) {
      throw new CustomerError('Customer creation failed: No customer data returned')
    }

    console.log('[Shopify Admin] Customer created:', {
      id: response.customerCreate.customer.id,
      email: response.customerCreate.customer.email,
      tags: response.customerCreate.customer.tags,
    })

    return response.customerCreate.customer
  } catch (error) {
    if (error instanceof CustomerError) {
      throw error
    }

    console.error('[Shopify Admin] Customer creation error:', error)
    throw new CustomerError(
      `Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// ============================================================================
// Customer Updates
// ============================================================================

/**
 * Update an existing customer's tags (preserves existing tags)
 *
 * This function fetches the customer's current tags and merges them with new tags.
 *
 * @param customerId - Shopify customer ID (gid://shopify/Customer/...)
 * @param newTags - Tags to add to the customer
 * @returns Updated customer object
 * @throws {CustomerError} If customer update fails
 *
 * @example
 * ```typescript
 * const customer = await addTagsToCustomer(
 *   'gid://shopify/Customer/123456',
 *   ['location-chicago', 'inquiry-service']
 * )
 * ```
 */
export async function addTagsToCustomer(
  customerId: string,
  newTags: string[]
): Promise<Customer> {
  try {
    // Fetch existing customer to get current tags
    const existingCustomer = await getCustomerById(customerId)

    // Merge tags (remove duplicates)
    const existingTags = existingCustomer.tags || []
    const mergedTags = [...new Set([...existingTags, ...newTags])]

    // Update customer with merged tags
    const response = await shopifyAdminClient.mutate<CustomerUpdateResponse>(
      CUSTOMER_UPDATE,
      {
        input: {
          id: customerId,
          tags: mergedTags,
        },
      }
    )

    // Check for user errors
    checkUserErrors(response.customerUpdate.userErrors, 'Customer tag update')

    // Verify customer was updated
    if (!response.customerUpdate.customer) {
      throw new CustomerError('Customer update failed: No customer data returned')
    }

    console.log('[Shopify Admin] Customer tags updated:', {
      id: response.customerUpdate.customer.id,
      email: response.customerUpdate.customer.email,
      tags: response.customerUpdate.customer.tags,
      addedTags: newTags,
    })

    return response.customerUpdate.customer
  } catch (error) {
    if (error instanceof CustomerError) {
      throw error
    }

    console.error('[Shopify Admin] Customer tag update error:', error)
    throw new CustomerError(
      `Failed to update customer tags: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Replace all tags on a customer
 *
 * WARNING: This will remove all existing tags and replace them with the provided tags.
 * Use `addTagsToCustomer` if you want to preserve existing tags.
 *
 * @param customerId - Shopify customer ID
 * @param tags - New tags to set (replaces all existing tags)
 * @returns Updated customer object
 * @throws {CustomerError} If customer update fails
 */
export async function replaceCustomerTags(
  customerId: string,
  tags: string[]
): Promise<Customer> {
  try {
    const response = await shopifyAdminClient.mutate<CustomerUpdateResponse>(
      CUSTOMER_UPDATE,
      {
        input: {
          id: customerId,
          tags,
        },
      }
    )

    checkUserErrors(response.customerUpdate.userErrors, 'Customer tag replacement')

    if (!response.customerUpdate.customer) {
      throw new CustomerError('Customer update failed: No customer data returned')
    }

    console.log('[Shopify Admin] Customer tags replaced:', {
      id: response.customerUpdate.customer.id,
      email: response.customerUpdate.customer.email,
      tags: response.customerUpdate.customer.tags,
    })

    return response.customerUpdate.customer
  } catch (error) {
    if (error instanceof CustomerError) {
      throw error
    }

    console.error('[Shopify Admin] Customer tag replacement error:', error)
    throw new CustomerError(
      `Failed to replace customer tags: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// ============================================================================
// Customer Queries
// ============================================================================

/**
 * Get customer by Shopify ID
 *
 * @param customerId - Shopify customer ID (gid://shopify/Customer/...)
 * @returns Customer object
 * @throws {CustomerError} If customer not found
 */
export async function getCustomerById(customerId: string): Promise<Customer> {
  try {
    const response = await shopifyAdminClient.query<CustomerQueryResponse>(
      GET_CUSTOMER,
      { id: customerId }
    )

    if (!response.customer) {
      throw new CustomerError(`Customer not found: ${customerId}`)
    }

    return response.customer
  } catch (error) {
    if (error instanceof CustomerError) {
      throw error
    }

    console.error('[Shopify Admin] Customer query error:', error)
    throw new CustomerError(
      `Failed to fetch customer: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Search for customer by email
 *
 * @param email - Customer email address
 * @returns Customer object or null if not found
 */
export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const response = await shopifyAdminClient.query<{
      customers: {
        edges: Array<{ node: Customer }>
      }
    }>(SEARCH_CUSTOMER_BY_EMAIL, {
      query: `email:${email}`,
    })

    if (!response.customers.edges || response.customers.edges.length === 0) {
      return null
    }

    const firstEdge = response.customers.edges[0]
    if (!firstEdge) {
      return null
    }

    return firstEdge.node
  } catch (error) {
    console.error('[Shopify Admin] Customer search error:', error)
    return null
  }
}

// ============================================================================
// Combined Operations
// ============================================================================

/**
 * Create or update a customer with tags
 *
 * This function will:
 * 1. Search for an existing customer by email
 * 2. If found, add new tags to existing tags
 * 3. If not found, create a new customer with tags
 *
 * Perfect for contact form submissions where you want to tag customers
 * by their location or inquiry type.
 *
 * @param input - Customer information including tags
 * @returns Customer object (created or updated)
 * @throws {CustomerError} If operation fails
 *
 * @example
 * ```typescript
 * // From contact form submission
 * const customer = await createOrUpdateCustomerWithTags({
 *   email: formData.email,
 *   firstName: formData.firstName,
 *   lastName: formData.lastName,
 *   phone: formData.phone,
 *   tags: [
 *     `location-${storefrontSlug}`,
 *     `inquiry-${inquiryType}`,
 *     `source-contact-form`
 *   ],
 *   acceptsMarketing: formData.subscribeToUpdates
 * })
 * ```
 */
export async function createOrUpdateCustomerWithTags(
  input: CustomerInput
): Promise<Customer> {
  try {
    if (!input.email) {
      throw new CustomerError('Email is required to create or update customer')
    }

    // Search for existing customer
    const existingCustomer = await getCustomerByEmail(input.email)

    if (existingCustomer) {
      // Customer exists - add new tags
      console.log('[Shopify Admin] Existing customer found, adding tags:', {
        email: input.email,
        existingTags: existingCustomer.tags,
        newTags: input.tags,
      })

      return await addTagsToCustomer(existingCustomer.id, input.tags || [])
    } else {
      // Customer doesn't exist - create new
      console.log('[Shopify Admin] Customer not found, creating new:', {
        email: input.email,
        tags: input.tags,
      })

      return await createCustomerWithTags(input)
    }
  } catch (error) {
    if (error instanceof CustomerError) {
      throw error
    }

    console.error('[Shopify Admin] Create or update customer error:', error)
    throw new CustomerError(
      `Failed to create or update customer: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Tag customer by location slug from Payload CMS
 *
 * ⚠️ DEPRECATED: Use `addCustomerLocation()` instead to track locations via metafields
 *
 * Convenience function for tagging customers based on the storefront they visited.
 *
 * @param email - Customer email
 * @param locationSlug - Storefront slug from Payload (e.g., "st-louis", "chicago")
 * @param additionalTags - Additional tags to add
 * @returns Customer object
 *
 * @example
 * ```typescript
 * const customer = await tagCustomerByLocation(
 *   'customer@example.com',
 *   'st-louis',
 *   ['inquiry-piano-consultation', 'source-contact-form']
 * )
 * ```
 */
export async function tagCustomerByLocation(
  email: string,
  locationSlug: string,
  additionalTags: string[] = []
): Promise<Customer> {
  const tags = [`location-${locationSlug}`, ...additionalTags]

  const customer = await getCustomerByEmail(email)

  if (customer) {
    return await addTagsToCustomer(customer.id, tags)
  } else {
    return await createCustomerWithTags({
      email,
      tags,
    })
  }
}

// ============================================================================
// Customer Metafields - Location Tracking
// ============================================================================

/**
 * Get customer's dealer locations from metafield
 *
 * Retrieves the list of dealer location slugs stored in the customer's metafield.
 *
 * @param customerId - Shopify customer ID (gid://shopify/Customer/...)
 * @returns Array of location slugs, empty array if no locations set
 *
 * @example
 * ```typescript
 * const locations = await getCustomerLocations('gid://shopify/Customer/123456')
 * // Returns: ['dallas', 'chicago', 'nashville']
 * ```
 */
export async function getCustomerLocations(customerId: string): Promise<string[]> {
  try {
    const response = await shopifyAdminClient.query<{
      customer: {
        id: string
        metafields: {
          edges: Array<{
            node: {
              id: string
              namespace: string
              key: string
              value: string
              type: string
            }
          }>
        }
      }
    }>(
      `
      query getCustomerMetafields($id: ID!) {
        customer(id: $id) {
          id
          metafields(namespace: "custom", key: "location", first: 1) {
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
      `,
      { id: customerId }
    )

    if (!response.customer) {
      return []
    }

    const metafieldEdges = response.customer.metafields.edges
    if (metafieldEdges.length === 0) {
      return []
    }

    const metafield = metafieldEdges[0]?.node
    if (!metafield) {
      return []
    }

    // Parse JSON array from metafield value
    try {
      const locations = JSON.parse(metafield.value)
      return Array.isArray(locations) ? locations : []
    } catch {
      return []
    }
  } catch (error) {
    console.error('[Shopify Admin] Error fetching customer locations:', error)
    return []
  }
}

/**
 * Add dealer location to customer metafield
 *
 * Adds a new dealer location to the customer's location metafield.
 * If the location already exists, it won't be duplicated.
 * If the customer has no location metafield yet, it will be created.
 *
 * @param customerId - Shopify customer ID (gid://shopify/Customer/...)
 * @param locationSlug - Dealer location slug (e.g., "dallas", "chicago")
 * @returns Updated list of locations
 * @throws {CustomerError} If metafield update fails
 *
 * @example
 * ```typescript
 * // First visit from Dallas
 * await addCustomerLocation('gid://shopify/Customer/123456', 'dallas')
 * // Returns: ['dallas']
 *
 * // Later visit from Chicago
 * await addCustomerLocation('gid://shopify/Customer/123456', 'chicago')
 * // Returns: ['dallas', 'chicago']
 *
 * // Duplicate location (no-op)
 * await addCustomerLocation('gid://shopify/Customer/123456', 'dallas')
 * // Returns: ['dallas', 'chicago'] (unchanged)
 * ```
 */
export async function addCustomerLocation(
  customerId: string,
  locationSlug: string
): Promise<string[]> {
  try {
    // Get existing locations
    const existingLocations = await getCustomerLocations(customerId)

    // Check if location already exists
    if (existingLocations.includes(locationSlug)) {
      console.log('[Shopify Admin] Location already exists for customer:', {
        customerId,
        location: locationSlug,
        existingLocations,
      })
      return existingLocations
    }

    // Add new location
    const updatedLocations = [...existingLocations, locationSlug]

    // Update metafield
    const response = await shopifyAdminClient.mutate<{
      metafieldsSet: {
        metafields: Array<{
          id: string
          namespace: string
          key: string
          value: string
          type: string
        }>
        userErrors: Array<{
          field: string[]
          message: string
        }>
      }
    }>(
      `
      mutation setCustomerMetafields($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
          }
        }
      }
      `,
      {
        metafields: [
          {
            key: 'location',
            namespace: 'custom',
            value: JSON.stringify(updatedLocations),
            type: 'list.single_line_text_field',
            ownerId: customerId,
          },
        ],
      }
    )

    // Check for errors
    if (response.metafieldsSet.userErrors && response.metafieldsSet.userErrors.length > 0) {
      const errorMessages = response.metafieldsSet.userErrors
        .map((e) => `${e.field?.join('.')}: ${e.message}`)
        .join(', ')
      throw new CustomerError(`Failed to set location metafield: ${errorMessages}`)
    }

    console.log('[Shopify Admin] Location added to customer:', {
      customerId,
      newLocation: locationSlug,
      allLocations: updatedLocations,
    })

    return updatedLocations
  } catch (error) {
    if (error instanceof CustomerError) {
      throw error
    }

    console.error('[Shopify Admin] Error adding customer location:', error)
    throw new CustomerError(
      `Failed to add customer location: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
