// CMS-specific types for Payload CMS integration
// These types enhance and extend the auto-generated Payload types

import type { Media } from '@/payload-types'

// Enhanced Media types with additional functionality
export interface MediaWithOptimization extends Media {
  optimizedUrl?: string
  placeholder?: string
  blurDataUrl?: string
  dominantColor?: string
}

// Media preset types for consistent sizing
export type MediaPreset = 'hero' | 'gallery' | 'thumbnail' | 'card'

// Content block base interface
export interface ContentBlock {
  blockType: string
  id?: string
  blockName?: string
}

// Block renderer props
export interface BlockRendererProps<T extends ContentBlock = ContentBlock> {
  block: T
  className?: string
  priority?: boolean
}

// Page metadata structure
export interface PageMeta {
  title?: string
  description?: string
  keywords?: string[]
  openGraph?: {
    title?: string
    description?: string
    image?: Media | string
    type?: 'website' | 'article'
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image'
    title?: string
    description?: string
    image?: Media | string
  }
  canonical?: string
  noIndex?: boolean
  noFollow?: boolean
}

// Collection access control
export interface CollectionAccess {
  read?: boolean
  create?: boolean
  update?: boolean
  delete?: boolean
}

// User roles and permissions
export type UserRole = 'admin' | 'editor' | 'user'

export interface UserWithPermissions {
  id: string
  email: string
  roles: UserRole[]
  permissions: Record<string, CollectionAccess>
  lastLogin?: Date
}

// Draft and publishing states
export type PublishStatus = 'draft' | 'published' | 'scheduled' | 'archived'

export interface PublishableDocument {
  _status?: PublishStatus
  publishedDate?: Date | string
  scheduledDate?: Date | string
  lastModified?: Date | string
  version?: number
}

// Localization support
export interface LocalizedContent {
  locale: string
  fallbackLocale?: string
}

// Rich text content structure
export interface RichTextContent {
  root: {
    type: string
    children: RichTextNode[]
  }
}

export interface RichTextNode {
  type: string
  version?: number
  [key: string]: unknown
}

// Upload relationship with additional metadata
export interface UploadRelationship {
  relationTo: 'media'
  value: Media | string
  displayName?: string
  description?: string
}

// Array field structure
export interface ArrayField<T = unknown> {
  id?: string
  value?: T
}

// Conditional field based on other field values
export interface ConditionalField<T = unknown> {
  condition?: (data: Record<string, unknown>) => boolean
  value?: T
}

// Hooks for CMS operations
export interface CMSHooks {
  beforeValidate?: (operation: CMSOperation) => Promise<void> | void
  beforeChange?: (operation: CMSOperation) => Promise<void> | void
  afterChange?: (operation: CMSOperation) => Promise<void> | void
  beforeDelete?: (operation: CMSOperation) => Promise<void> | void
  afterDelete?: (operation: CMSOperation) => Promise<void> | void
  beforeLogin?: (operation: CMSOperation) => Promise<void> | void
  afterLogin?: (operation: CMSOperation) => Promise<void> | void
}

export interface CMSOperation {
  operation: 'create' | 'read' | 'update' | 'delete'
  collection?: string
  global?: string
  data?: unknown
  originalDoc?: unknown
  req?: unknown
  result?: unknown
}

// Collection configuration
export interface CollectionConfig {
  slug: string
  labels?: {
    singular?: string
    plural?: string
  }
  admin?: {
    useAsTitle?: string
    group?: string
    hidden?: boolean
    defaultColumns?: string[]
    preview?: (doc: unknown) => string
  }
  access?: CollectionAccess
  hooks?: CMSHooks
  timestamps?: boolean
  versions?: boolean | {
    maxPerDoc?: number
    retainDeleted?: boolean
  }
}