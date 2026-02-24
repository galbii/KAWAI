'use client'

export function TagRowLabel({ data }: { data?: { tag?: string } }) {
  return data?.tag || 'New tag'
}
