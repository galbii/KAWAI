/**
 * Shopify Storefront API Client
 *
 * Type-safe client for interacting with Shopify Storefront API
 * Includes retry logic, error handling, and ISR-friendly caching
 *
 * @example
 * ```typescript
 * import { shopifyClient } from '@/lib/shopify'
 * import { GET_PRODUCTS } from '@/lib/shopify/queries'
 *
 * const response = await shopifyClient.query(GET_PRODUCTS, { first: 10 })
 * ```
 */

import type {
  ShopifyConfig,
  ShopifyRequestOptions,
  GraphQLResponse,
  ShopifyError,
} from './types'

// ============================================================================
// Configuration
// ============================================================================

/**
 * Default API version
 * Update this when migrating to newer API versions
 */
const DEFAULT_API_VERSION = '2024-01'

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
}

/**
 * Environment-based configuration
 *
 * Note: Uses NEXT_PUBLIC_ prefix for client-side access
 * The Storefront API is designed to be safely exposed to the client
 */
function getShopifyConfig(): ShopifyConfig {
  // Try NEXT_PUBLIC_ prefixed vars first (for client components)
  // Fall back to non-prefixed vars (for server components)
  const storeDomain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN

  const storefrontAccessToken =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!storeDomain || !storefrontAccessToken) {
    throw new Error(
      'Missing Shopify configuration. Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.'
    )
  }

  return {
    storeDomain,
    storefrontAccessToken,
    apiVersion: DEFAULT_API_VERSION,
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

  // Rate limit errors (429) are retryable
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
  error.name = 'ShopifyError'
  error.statusCode = statusCode
  error.errors = errors

  return error
}

// ============================================================================
// Shopify Client Class
// ============================================================================

/**
 * Shopify Storefront API Client
 *
 * Provides type-safe GraphQL query execution with:
 * - Automatic retries with exponential backoff
 * - GraphQL error handling
 * - ISR-friendly caching configuration
 * - Request timeout handling
 */
export class ShopifyClient {
  private config: ShopifyConfig
  private endpoint: string

  constructor(config?: Partial<ShopifyConfig>) {
    // Only call getShopifyConfig() when no explicit domain is provided.
    // This allows CA/secondary store clients to be instantiated at module load
    // without requiring the US env vars (and vice-versa).
    const defaultConfig =
      config?.storeDomain && config?.storefrontAccessToken
        ? { apiVersion: DEFAULT_API_VERSION, ...config }
        : getShopifyConfig()
    this.config = { ...defaultConfig, ...config } as ShopifyConfig

    // Build Storefront API endpoint
    this.endpoint = `https://${this.config.storeDomain}/api/${this.config.apiVersion}/graphql.json`
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
    const {
      timeout = 10000,
      retries = DEFAULT_RETRY_CONFIG.maxRetries,
      headers = {},
      cache = 'force-cache',
      revalidate = 300, // 5 minutes default ISR
    } = options

    let lastError: Error | null = null
    let attempt = 0

    while (attempt <= retries) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        // Build fetch options
        const fetchOptions: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': this.config.storefrontAccessToken,
            ...headers,
          },
          body: JSON.stringify({
            query,
            variables: variables || {},
          }),
          signal: controller.signal,
          cache,
          next: revalidate !== false ? { revalidate } : undefined,
        }

        // Execute request
        const response = await fetch(this.endpoint, fetchOptions)
        clearTimeout(timeoutId)

        // Handle HTTP errors
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unable to read error response')
          throw createShopifyError(
            `Shopify API request failed: ${response.status} ${response.statusText}`,
            response.status
          )
        }

        // Parse response
        const json: GraphQLResponse<TData> = await response.json()

        // Handle GraphQL errors
        if (json.errors && json.errors.length > 0) {
          throw createShopifyError(
            `GraphQL errors: ${json.errors.map(e => e.message).join(', ')}`,
            undefined,
            json.errors
          )
        }

        // Return data
        if (!json.data) {
          throw createShopifyError('No data returned from Shopify API')
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
          `[Shopify] Request failed (attempt ${attempt + 1}/${retries + 1}), retrying...`,
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
      `Shopify request failed after ${retries + 1} attempts: ${lastError?.message || 'Unknown error'}`,
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
  withConfig(config: Partial<ShopifyConfig>): ShopifyClient {
    return new ShopifyClient({ ...this.config, ...config })
  }
}

// ============================================================================
// Default Export
// ============================================================================

/**
 * Default Shopify client instance
 *
 * Use this for most operations. Create a new instance with `new ShopifyClient()`
 * only if you need custom configuration.
 *
 * @example
 * ```typescript
 * import { shopifyClient } from '@/lib/shopify/client'
 * import { GET_PRODUCTS } from '@/lib/shopify/queries'
 *
 * const data = await shopifyClient.query(GET_PRODUCTS, { first: 10 })
 * ```
 */
export const shopifyClient = new ShopifyClient()

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Execute a Shopify GraphQL query (convenience wrapper)
 *
 * @example
 * ```typescript
 * import { queryShopify } from '@/lib/shopify/client'
 * import { GET_PRODUCTS } from '@/lib/shopify/queries'
 *
 * const data = await queryShopify(GET_PRODUCTS, { first: 10 })
 * ```
 */
export async function queryShopify<TData = unknown, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  options?: ShopifyRequestOptions
): Promise<TData> {
  return shopifyClient.query<TData, TVariables>(query, variables, options)
}

/**
 * Create a custom Shopify client
 *
 * @example
 * ```typescript
 * import { createShopifyClient } from '@/lib/shopify/client'
 *
 * const client = createShopifyClient({
 *   apiVersion: '2024-04'
 * })
 * ```
 */
export function createShopifyClient(config?: Partial<ShopifyConfig>): ShopifyClient {
  return new ShopifyClient(config)
}

// ============================================================================
// Canada Store Storefront Client
// ============================================================================

/**
 * Shopify Storefront API client for the Canada store (ca.kawaius.com).
 * Uses NEXT_PUBLIC_SHOPIFY_CA_* env vars — safe to use in client components.
 * Throws at query time (not module load) if CA env vars are not configured.
 */
export const shopifyClientCA = new ShopifyClient({
  storeDomain:
    process.env.NEXT_PUBLIC_SHOPIFY_CA_STORE_DOMAIN ||
    process.env.SHOPIFY_CA_STORE_DOMAIN ||
    '',
  storefrontAccessToken:
    process.env.NEXT_PUBLIC_SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN ||
    process.env.SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN ||
    '',
  apiVersion: DEFAULT_API_VERSION,
})
