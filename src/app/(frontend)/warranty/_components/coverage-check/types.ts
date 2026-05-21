export interface ProductHit {
  id: string
  title: string
  productModel?: string
  productImageUrl?: string
  productType?: string
  productSlug?: string
  doc?: { relationTo?: string }
}

export type CoverageStep =
  | { kind: 'empty' }
  | { kind: 'date'; product: ProductHit }
  | { kind: 'status'; product: ProductHit; purchaseDate: Date }
