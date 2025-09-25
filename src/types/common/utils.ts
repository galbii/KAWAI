// Advanced TypeScript utility types and patterns
// Modern type utilities for enhanced type safety and developer experience

import type { MediaPreset } from './cms'

// Brand types for enhanced type safety
export type Brand<T, B> = T & { readonly __brand: B }

// Common branded types for the piano business
export type ProductId = Brand<string, 'ProductId'>
export type DealerSlug = Brand<string, 'DealerSlug'>
export type UserId = Brand<string, 'UserId'>
export type MediaId = Brand<string, 'MediaId'>
export type PriceValue = Brand<number, 'PriceValue'>

// Template literal types for type-safe string combinations
export type MediaSize = 'sm' | 'md' | 'lg' | 'xl'
export type MediaFormat = 'webp' | 'avif' | 'jpeg' | 'png'

// Template literal combinations
export type MediaPresetSize = `${MediaPreset}-${MediaSize}`
export type MediaFileExtension = `.${MediaFormat}`
export type MediaUrl = `https://${string}.r2.dev/media/${string}${MediaFileExtension}`

// Piano-specific template literals
export type PianoCategory = 'digital' | 'grand' | 'hybrid' | 'upright'
export type PianoSeries = 'ca' | 'mp' | 'es' | 'cn' | 'sk' | 'gl' | 'gx'
export type PianoModel = `${Uppercase<PianoSeries>}${number}`

// Conditional types for flexible component APIs
export type ConditionalProps<T extends Record<string, any>, K extends keyof T> =
  T[K] extends true
    ? Required<Pick<T, K>> & Partial<Omit<T, K>>
    : Partial<T>

// Utility type for making specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Utility type for making specific properties optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Deep partial type for nested objects
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Deep required type for nested objects
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// Extract union member by discriminant
export type ExtractByType<T, U> = T extends { type: U } ? T : never

// Omit by type discrimination
export type OmitByType<T, U> = T extends { type: U } ? never : T

// Advanced pick and omit utilities
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>
export type OmitByValue<T, V> = Omit<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>

// Function parameter and return type utilities
export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

// Array element type extraction
export type ArrayElement<T> = T extends readonly (infer E)[] ? E : never

// Promise resolution type
export type Awaited<T> = T extends Promise<infer U> ? U : T

// Type-safe object key iteration
export type KeysOfUnion<T> = T extends T ? keyof T : never

// Strict exclude that requires the excluded type to exist
export type StrictExclude<T, U extends T> = Exclude<T, U>

// Intersection type creator
export type Intersect<T, U> = T & U

// Union type creator with constraints
export type UnionWithConstraint<T, U> = T | (U & { [K in keyof T]?: never })

// Recursive type for nested structures
export type Nested<T, K extends string = 'children'> = T & {
  [P in K]?: Nested<T, K>[]
}

// Event handler type extraction
export type EventHandler<E extends Event = Event> = (event: E) => void
export type ChangeHandler<T = string> = (value: T) => void
export type AsyncHandler<T = void, R = void> = (value: T) => Promise<R>

// Form field value type based on input type
export type FieldValue<T extends string> =
  T extends 'number' ? number :
  T extends 'email' | 'password' | 'text' | 'url' | 'tel' ? string :
  T extends 'checkbox' ? boolean :
  T extends 'file' ? File | FileList :
  unknown

// API response type transformers
export type ApiResponseData<T> = T extends { docs: infer D } ? D : T
export type SingleDocResponse<T> = T extends any[] ? T[0] : T

// Component ref type extraction
export type ComponentRef<T> = T extends React.ForwardRefExoticComponent<infer P>
  ? P extends React.RefAttributes<infer R>
    ? R
    : never
  : never

// Props type extraction from component
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never

// Environment variable type safety
export type EnvironmentVariable = `${string}_${'URL' | 'KEY' | 'SECRET' | 'ID' | 'TOKEN'}`
export type RequiredEnvVar<T extends string> = Record<T, string>

// Type-safe local storage keys
export type LocalStorageKey =
  | `kawai_${string}`
  | 'user_preferences'
  | 'piano_comparison'
  | 'consultation_data'

// Cookie names with type safety
export type CookieName =
  | 'analytics_consent'
  | 'marketing_consent'
  | 'session_id'
  | 'user_locale'

// URL parameter types
export type URLSearchParams = Record<string, string | string[] | undefined>
export type RouteParams<T extends string> = Record<T, string>

// Database entity timestamps
export interface Timestamps {
  createdAt: Date | string
  updatedAt: Date | string
}

export interface SoftDelete {
  deletedAt?: Date | string | null
}

export interface Versioned {
  version: number
  lastModified: Date | string
}

// Pagination helpers
export type PaginationResult<T> = {
  items: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Validation result type
export type ValidationResult<T = any> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> }

// Type-safe error handling
export interface TypedError<T extends string = string> {
  type: T
  message: string
  details?: Record<string, unknown>
  stack?: string
}

// Configuration types with environment-specific overrides
export type Config<T> = T & {
  development?: Partial<T>
  production?: Partial<T>
  test?: Partial<T>
}

// Type assertion helpers
export type Assert<T, U> = T extends U ? T : never
export type Is<T, U> = T extends U ? true : false

// Advanced mapped type transformations
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P]
}

// Type-safe builder pattern
export type Builder<T> = {
  [K in keyof T]: (value: T[K]) => Builder<T>
} & {
  build(): T
}

// Advanced function composition types
export type Compose<F extends (...args: any[]) => any, G extends (...args: any[]) => any> =
  G extends (...args: infer A) => infer B
    ? F extends (arg: B) => infer C
      ? (...args: A) => C
      : never
    : never

// Type-safe object path access
export type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Path<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

export type PathValue<T, P extends Path<T>> =
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? Rest extends Path<T[K]>
        ? PathValue<T[K], Rest>
        : never
      : never
    : P extends keyof T
      ? T[P]
      : never