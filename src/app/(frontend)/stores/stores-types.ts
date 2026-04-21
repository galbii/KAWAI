// Shared types for the stores page — safe to import in both server and client components

export interface StorefrontEntry {
  id: string
  slug: string
  locationName: string
  locationText: string
  establishedText?: string
  showroomInfo?: { address?: string; phone?: string }
  features?: Array<{ title: string }>
}

export interface StorePin {
  id: string
  slug: string
  locationName: string
  address: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  }
  phone?: string
  latitude: number
  longitude: number
}
