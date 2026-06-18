/**
 * Shopify Admin API GraphQL Queries and Mutations
 *
 * Type-safe GraphQL operations for Shopify Admin API
 * Used for customer management, inventory, and other privileged operations
 *
 * @see https://shopify.dev/docs/api/admin-graphql
 */

// ============================================================================
// Customer Queries
// ============================================================================

/**
 * Get customer by ID
 *
 * @example
 * ```typescript
 * const data = await shopifyAdminClient.query(GET_CUSTOMER, {
 *   id: 'gid://shopify/Customer/123456'
 * })
 * ```
 */
export const GET_CUSTOMER = `
  query getCustomer($id: ID!) {
    customer(id: $id) {
      id
      email
      firstName
      lastName
      phone
      tags
      displayName
      emailMarketingConsent {
        marketingState
        marketingOptInLevel
      }
      taxExempt
      note
      verifiedEmail
      state
      createdAt
      updatedAt
      addresses {
        id
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        lastName
        phone
        province
        provinceCode
        zip
      }
      defaultAddress {
        id
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        lastName
        phone
        province
        provinceCode
        zip
      }
    }
  }
`

/**
 * Search for customer by email
 *
 * @example
 * ```typescript
 * const data = await shopifyAdminClient.query(SEARCH_CUSTOMER_BY_EMAIL, {
 *   query: 'email:customer@example.com'
 * })
 * ```
 */
export const SEARCH_CUSTOMER_BY_EMAIL = `
  query searchCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      edges {
        node {
          id
          email
          firstName
          lastName
          phone
          tags
          displayName
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
          }
          taxExempt
          note
          verifiedEmail
          state
          createdAt
          updatedAt
        }
      }
    }
  }
`

// ============================================================================
// Customer Mutations
// ============================================================================

/**
 * Create a new customer with tags
 *
 * IMPORTANT: Requires `write_customers` scope
 *
 * @example
 * ```typescript
 * const data = await shopifyAdminClient.mutate(CUSTOMER_CREATE, {
 *   input: {
 *     email: 'customer@example.com',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     phone: '+14155555555',
 *     tags: ['location-stlouis', 'inquiry-piano'],
 *     acceptsMarketing: true
 *   }
 * })
 * ```
 */
export const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
        tags
        displayName
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
        }
        taxExempt
        note
        verifiedEmail
        state
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`

/**
 * Update an existing customer (including tags)
 *
 * IMPORTANT: Requires `write_customers` scope
 *
 * Note: When updating tags, the tags array will REPLACE existing tags.
 * To add tags while preserving existing ones, fetch current tags first
 * and merge them with new tags.
 *
 * @example
 * ```typescript
 * // Fetch existing customer
 * const existing = await shopifyAdminClient.query(GET_CUSTOMER, {
 *   id: 'gid://shopify/Customer/123456'
 * })
 *
 * // Merge tags
 * const existingTags = existing.customer.tags
 * const newTags = ['location-chicago']
 * const mergedTags = [...new Set([...existingTags, ...newTags])]
 *
 * // Update with merged tags
 * const data = await shopifyAdminClient.mutate(CUSTOMER_UPDATE, {
 *   input: {
 *     id: 'gid://shopify/Customer/123456',
 *     tags: mergedTags
 *   }
 * })
 * ```
 */
export const CUSTOMER_UPDATE = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
        tags
        displayName
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
        }
        taxExempt
        note
        verifiedEmail
        state
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`

/**
 * Update a customer's email marketing consent.
 *
 * Shopify does NOT allow setting emailMarketingConsent via customerUpdate on an
 * EXISTING customer — it returns:
 *   "To update emailMarketingConsent, please use the
 *    customerEmailMarketingConsentUpdate Mutation instead"
 * (It is only accepted inline in customerCreate.) Use this mutation to apply
 * consent to customers that already exist.
 */
export const CUSTOMER_EMAIL_MARKETING_CONSENT_UPDATE = `
  mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        email
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

/**
 * Create or update a customer in a single mutation
 *
 * ⚠️ WARNING: This mutation is ONLY available in API version 2025-07+
 * For API version 2025-01, use customerCreate/customerUpdate separately
 *
 * IMPORTANT: Requires `write_customers` scope
 * API VERSION: 2025-07+ ONLY (Not available in 2025-01)
 *
 * Features:
 * - Creates new customer if email doesn't exist
 * - Updates existing customer if email matches
 * - Updates only provided fields (preserves existing data)
 * - All in ONE API call (no search needed)
 *
 * NOTE: This mutation is currently NOT USED in our codebase because
 * we use API version 2025-01. The upsertCustomer() function uses
 * customerCreate/customerUpdate instead for backwards compatibility.
 *
 * @example
 * ```typescript
 * // Only works with API version 2025-07+
 * const data = await shopifyAdminClient.mutate(CUSTOMER_SET, {
 *   identifier: { email: 'customer@example.com' },
 *   input: {
 *     email: 'customer@example.com',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     phone: '+14155555555',
 *     tags: ['st-louis']
 *   }
 * })
 * ```
 */
export const CUSTOMER_SET = `
  mutation customerSet($identifier: CustomerSetIdentifiers, $input: CustomerSetInput!) {
    customerSet(identifier: $identifier, input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
        tags
        displayName
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
        }
        taxExempt
        note
        verifiedEmail
        state
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`

/**
 * Delete a customer
 *
 * IMPORTANT: Requires `write_customers` scope
 * WARNING: This is a destructive operation and cannot be undone
 *
 * @example
 * ```typescript
 * const data = await shopifyAdminClient.mutate(CUSTOMER_DELETE, {
 *   input: {
 *     id: 'gid://shopify/Customer/123456'
 *   }
 * })
 * ```
 */
export const CUSTOMER_DELETE = `
  mutation customerDelete($input: CustomerDeleteInput!) {
    customerDelete(input: $input) {
      deletedCustomerId
      userErrors {
        field
        message
      }
    }
  }
`

// ============================================================================
// Customer Metafields
// ============================================================================

/**
 * Get customer metafields
 *
 * Retrieves all metafields for a customer, filtered by namespace/key if specified.
 *
 * @example
 * ```typescript
 * const data = await shopifyAdminClient.query(GET_CUSTOMER_METAFIELDS, {
 *   id: 'gid://shopify/Customer/123456',
 *   namespace: 'custom',
 *   key: 'location'
 * })
 * ```
 */
export const GET_CUSTOMER_METAFIELDS = `
  query getCustomerMetafields($id: ID!, $namespace: String, $key: String) {
    customer(id: $id) {
      id
      metafields(namespace: $namespace, key: $key, first: 20) {
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
`

/**
 * Set customer metafields
 *
 * Creates or updates metafields on a customer. Supports up to 25 metafields per request.
 * This operation is atomic - all metafields are set or none are.
 *
 * IMPORTANT: Requires `write_customers` scope
 *
 * @example
 * ```typescript
 * const data = await shopifyAdminClient.mutate(SET_CUSTOMER_METAFIELDS, {
 *   metafields: [
 *     {
 *       key: 'location',
 *       namespace: 'custom',
 *       value: '["dallas", "chicago"]',
 *       type: 'list.single_line_text_field',
 *       ownerId: 'gid://shopify/Customer/123456'
 *     }
 *   ]
 * })
 * ```
 */
export const SET_CUSTOMER_METAFIELDS = `
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
`

// ============================================================================
// Shop Query (for testing Admin API connection)
// ============================================================================

/**
 * Get shop information
 *
 * Useful for testing Admin API connection and permissions
 *
 * @example
 * ```typescript
 * const data = await shopifyAdminClient.query(GET_SHOP)
 * console.log(`Connected to: ${data.shop.name}`)
 * ```
 */
export const GET_SHOP = `
  query getShop {
    shop {
      id
      name
      email
      myshopifyDomain
      primaryDomain {
        url
        host
      }
      currencyCode
      ianaTimezone
      createdAt
    }
  }
`
