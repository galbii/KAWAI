// API-related types for KAWAI Piano Website
// Standardized API response and request patterns

// Generic API Response Structure (following Payload CMS patterns)
export interface ApiResponse<T = any> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number
  nextPage?: number
}

// Single document response
export interface ApiDocumentResponse<T = any> {
  doc: T
}

// Error response structure
export interface ApiError {
  message: string
  name: string
  data?: unknown[]
  stack?: string
}

// API request parameters
export interface ApiRequestParams {
  where?: Record<string, unknown>
  limit?: number
  page?: number
  sort?: string
  depth?: number
  locale?: string
  fallbackLocale?: string
  draft?: boolean
}

// Search parameters
export interface SearchParams {
  query?: string
  category?: string[]
  type?: string[]
  featured?: boolean
  limit?: number
  page?: number
}

// Filter criteria for various endpoints
export interface FilterCriteria {
  category?: string[]
  type?: string[]
  priceMin?: number
  priceMax?: number
  features?: string[]
  status?: string[]
  isPreOwned?: boolean
  availability?: string[]
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// API Endpoint Configuration
export interface ApiEndpoint {
  method: HttpMethod
  path: string
  params?: Record<string, string | number | boolean>
  body?: unknown
}

// Request/Response utilities
export type RequestInit = globalThis.RequestInit
export type Response = globalThis.Response

// Analytics and tracking
export interface AnalyticsEvent {
  event: string
  category?: string
  action?: string
  label?: string
  value?: number
  [key: string]: unknown
}

// Form submission types
export interface FormSubmission<T = Record<string, unknown>> {
  data: T
  timestamp: Date
  userAgent?: string
  ipAddress?: string
}

// Upload and file handling
export interface FileUpload {
  file: File
  fieldname: string
  destination?: string
  public?: boolean
}

// Cache control
export interface CacheConfig {
  ttl?: number
  revalidate?: number
  tags?: string[]
  strategy?: 'swr' | 'cache-first' | 'network-first'
}

// API client configuration
export interface ApiClientConfig {
  baseUrl: string
  timeout?: number
  retries?: number
  headers?: Record<string, string>
  cache?: CacheConfig
}