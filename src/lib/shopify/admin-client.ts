/**
 * Shopify Admin API Client
 *
 * Type-safe client for interacting with Shopify Admin API (GraphQL)
 * Used for privileged operations like customer management, inventory updates, etc.
 *
 * IMPORTANT: This client uses the Admin API which requires server-side only credentials.
 * Never expose SHOPIFY_ADMIN_ACCESS_TOKEN to the client.
 *
 * @example
 * ```typescript
 * import { shopifyAdminClient } from '@/lib/shopify/admin-client'
 * import { CUSTOMER_CREATE } from '@/lib/shopify/admin-queries'
 *
 * const response = await shopifyAdminClient.mutate(CUSTOMER_CREATE, {
 *   input: { email: 'customer@example.com', tags: ['location-stlouis'] }
 * })
 * ```
 */

import type {
  ShopifyAdminConfig,
  ShopifyRequestOptions,
  GraphQLResponse,
  ShopifyError,
} from './types'
import { getAdminAccessToken } from './auth'

// ============================================================================
// Configuration
// ============================================================================

/**
 * Default API version for Admin API
 * Update this when migrating to newer API versions
 */
const DEFAULT_ADMIN_API_VERSION = '2025-01'

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
}

/**
 * Environment-based configuration for Admin API
 *
 * SECURITY: These credentials should NEVER use NEXT_PUBLIC_ prefix
 * Admin API is for server-side operations only
 *
 * Note: We no longer store adminAccessToken in config since we use OAuth.
 * Tokens are fetched dynamically via getAdminAccessToken() from auth.ts
 */
function getShopifyAdminConfig(): ShopifyAdminConfig {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || ''

  // Note: We don't throw here during module load (for TypeScript compilation)
  // Validation happens when the client is actually used in execute()

  return {
    storeDomain,
    adminAccessToken: '', // Placeholder - actual tokens fetched via OAuth
    apiVersion: process.env.SHOPIFY_API_VERSION || DEFAULT_ADMIN_API_VERSION,
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate exponential backoff delay
 */
function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Network errors are retryable
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return true
    }
  }

  // HTTP 5xx errors are retryable
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const statusCode = (error as { statusCode: number }).statusCode
    return statusCode >= 500 && statusCode < 600
  }

  // Rate limit errors (429) are retryable with THROTTLED error code
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const statusCode = (error as { statusCode: number }).statusCode
    return statusCode === 429
  }

  return false
}

/**
 * Create a Shopify error from response
 */
function createShopifyError(
  message: string,
  statusCode?: number,
  errors?: GraphQLResponse<unknown>['errors']
): ShopifyError {
  const error = new Error(message) as ShopifyError
  error.name = 'ShopifyAdminError'
  error.statusCode = statusCode
  error.errors = errors

  return error
}

// ============================================================================
// Shopify Admin Client Class
// ============================================================================

/**
 * Shopify Admin API Client
 *
 * Provides type-safe GraphQL query/mutation execution with:
 * - Automatic retries with exponential backoff
 * - GraphQL error handling (including userErrors)
 * - Rate limit handling (THROTTLED error code)
 * - Request timeout handling
 * - Server-side only security
 */
export class ShopifyAdminClient {
  private config: ShopifyAdminConfig
  private endpoint: string

  constructor(config?: Partial<ShopifyAdminConfig>) {
    const defaultConfig = getShopifyAdminConfig()
    this.config = { ...defaultConfig, ...config }

    // Build Admin API endpoint
    this.endpoint = `https://${this.config.storeDomain}/admin/api/${this.config.apiVersion}/graphql.json`
  }

  /**
   * Execute a GraphQL query
   *
   * @param query - GraphQL query string
   * @param variables - Query variables
   * @param options - Request options
   * @returns Query response data
   * @throws {ShopifyError} If the request fails or returns errors
   */
  async query<TData = unknown, TVariables = Record<string, unknown>>(
    query: string,
    variables?: TVariables,
    options: ShopifyRequestOptions = {}
  ): Promise<TData> {
    return this.execute<TData, TVariables>(query, variables, options)
  }

  /**
   * Execute a GraphQL mutation
   *
   * @param mutation - GraphQL mutation string
   * @param variables - Mutation variables
   * @param options - Request options
   * @returns Mutation response data
   * @throws {ShopifyError} If the request fails or returns errors
   */
  async mutate<TData = unknown, TVariables = Record<string, unknown>>(
    mutation: string,
    variables?: TVariables,
    options: ShopifyRequestOptions = {}
  ): Promise<TData> {
    return this.execute<TData, TVariables>(mutation, variables, options)
  }

  /**
   * Internal method to execute GraphQL operations
   */
  private async execute<TData = unknown, TVariables = Record<string, unknown>>(
    operation: string,
    variables?: TVariables,
    options: ShopifyRequestOptions = {}
  ): Promise<TData> {
    // Validate configuration before executing (lazy validation)
    if (!this.config.storeDomain) {
      throw new Error(
        'Shopify Admin API is not configured. Please set SHOPIFY_STORE_DOMAIN environment variable.'
      )
    }

    const {
      timeout = 10000,
      retries = DEFAULT_RETRY_CONFIG.maxRetries,
      headers = {},
      cache = 'no-store', // Admin API should not cache by default
      revalidate = false, // No ISR for admin operations
    } = options

    let lastError: Error | null = null
    let attempt = 0

    while (attempt <= retries) {
      try {
        // Get fresh access token (will use cached if still valid)
        const accessToken = await getAdminAccessToken()

        // Create abort controller for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        // Build fetch options
        // IMPORTANT: cache: 'no-store' and next.revalidate are mutually exclusive in Next.js.
        // When revalidate is set, omit the cache directive so Next.js data cache applies.
        const fetchOptions: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
            ...headers,
          },
          body: JSON.stringify({
            query: operation,
            variables: variables || {},
          }),
          signal: controller.signal,
          ...(revalidate !== false
            ? { next: { revalidate } }          // ISR read — no cache: 'no-store'
            : { cache }                          // Default: 'no-store' for mutations/admin ops
          ),
        }

        // Execute request
        const response = await fetch(this.endpoint, fetchOptions)
        clearTimeout(timeoutId)

        // Handle HTTP errors
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unable to read error response')

          // Check for 403 Access Denied (missing scopes)
          if (response.status === 403) {
            throw createShopifyError(
              'Access denied. Please check that your Shopify Admin API token has the required scopes (e.g., write_customers, read_customers).',
              response.status
            )
          }

          throw createShopifyError(
            `Shopify Admin API request failed: ${response.status} ${response.statusText}\n${errorText}`,
            response.status
          )
        }

        // Parse response
        const json: GraphQLResponse<TData> = await response.json()

        // Handle GraphQL errors
        if (json.errors && json.errors.length > 0) {
          // Check for THROTTLED error (rate limiting)
          const throttledError = json.errors.find(e =>
            e.extensions?.code === 'THROTTLED' ||
            e.extensions?.code === 'MAX_COST_EXCEEDED'
          )

          if (throttledError && attempt < retries) {
            console.warn('[Shopify Admin API] Rate limited, retrying...', throttledError.message)
            const delay = calculateBackoff(attempt, 2000, 10000) // Longer delays for rate limits
            await sleep(delay)
            attempt++
            continue
          }

          throw createShopifyError(
            `GraphQL errors: ${json.errors.map(e => e.message).join(', ')}`,
            undefined,
            json.errors
          )
        }

        // Return data
        if (!json.data) {
          throw createShopifyError('No data returned from Shopify Admin API')
        }

        return json.data
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry if it's not a retryable error
        if (!isRetryableError(error)) {
          throw lastError
        }

        // Don't retry if we've exhausted attempts
        if (attempt >= retries) {
          break
        }

        // Log retry attempt
        console.warn(
          `[Shopify Admin API] Request failed (attempt ${attempt + 1}/${retries + 1}), retrying...`,
          lastError.message
        )

        // Wait before retrying with exponential backoff
        const delay = calculateBackoff(
          attempt,
          DEFAULT_RETRY_CONFIG.baseDelay,
          DEFAULT_RETRY_CONFIG.maxDelay
        )
        await sleep(delay)

        attempt++
      }
    }

    // All retries exhausted
    throw createShopifyError(
      `Shopify Admin API request failed after ${retries + 1} attempts: ${lastError?.message || 'Unknown error'}`,
      lastError && 'statusCode' in lastError ? (lastError as { statusCode: number }).statusCode : undefined
    )
  }

  /**
   * Get the Shopify store domain
   */
  getStoreDomain(): string {
    return this.config.storeDomain
  }

  /**
   * Get the API endpoint URL
   */
  getEndpoint(): string {
    return this.endpoint
  }

  /**
   * Create a new client with custom configuration
   */
  withConfig(config: Partial<ShopifyAdminConfig>): ShopifyAdminClient {
    return new ShopifyAdminClient({ ...this.config, ...config })
  }
}

// ============================================================================
// Default Export
// ============================================================================

/**
 * Default Shopify Admin API client instance
 *
 * Use this for most admin operations. Create a new instance with `new ShopifyAdminClient()`
 * only if you need custom configuration.
 *
 * SECURITY: This client should only be used in server-side code (Server Components, Server Actions, API Routes)
 *
 * @example
 * ```typescript
 * import { shopifyAdminClient } from '@/lib/shopify/admin-client'
 * import { CUSTOMER_CREATE } from '@/lib/shopify/admin-queries'
 *
 * const data = await shopifyAdminClient.mutate(CUSTOMER_CREATE, {
 *   input: { email: 'customer@example.com' }
 * })
 * ```
 */
export const shopifyAdminClient = new ShopifyAdminClient()

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Execute a Shopify Admin API GraphQL query (convenience wrapper)
 *
 * @example
 * ```typescript
 * import { queryShopifyAdmin } from '@/lib/shopify/admin-client'
 * import { GET_CUSTOMER } from '@/lib/shopify/admin-queries'
 *
 * const data = await queryShopifyAdmin(GET_CUSTOMER, { id: 'gid://shopify/Customer/123' })
 * ```
 */
export async function queryShopifyAdmin<TData = unknown, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  options?: ShopifyRequestOptions
): Promise<TData> {
  return shopifyAdminClient.query<TData, TVariables>(query, variables, options)
}

/**
 * Execute a Shopify Admin API GraphQL mutation (convenience wrapper)
 *
 * @example
 * ```typescript
 * import { mutateShopifyAdmin } from '@/lib/shopify/admin-client'
 * import { CUSTOMER_CREATE } from '@/lib/shopify/admin-queries'
 *
 * const data = await mutateShopifyAdmin(CUSTOMER_CREATE, {
 *   input: { email: 'customer@example.com', tags: ['vip'] }
 * })
 * ```
 */
export async function mutateShopifyAdmin<TData = unknown, TVariables = Record<string, unknown>>(
  mutation: string,
  variables?: TVariables,
  options?: ShopifyRequestOptions
): Promise<TData> {
  return shopifyAdminClient.mutate<TData, TVariables>(mutation, variables, options)
}

/**
 * Create a custom Shopify Admin API client
 *
 * @example
 * ```typescript
 * import { createShopifyAdminClient } from '@/lib/shopify/admin-client'
 *
 * const client = createShopifyAdminClient({
 *   apiVersion: '2025-04'
 * })
 * ```
 */
export function createShopifyAdminClient(config?: Partial<ShopifyAdminConfig>): ShopifyAdminClient {
  return new ShopifyAdminClient(config)
}
