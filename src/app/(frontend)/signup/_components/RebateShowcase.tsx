'use client'

import { useState } from 'react'
import CategoryBackdrop from './CategoryBackdrop'
import RebateBrowser from './RebateBrowser'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import type { PianoCategorySlug } from '@/lib/data/categories'

/**
 * Composes the category backdrop (full-bleed, swaps with the selected category)
 * with the floating rebate carousel. Used by both the cinematic scene and the
 * reduced-motion fallback so the backdrop-swap behaves identically in each.
 */
export default function RebateShowcase({
  data,
  reduce,
}: {
  data: RebateCategory[]
  reduce: boolean
}) {
  const [slug, setSlug] = useState<PianoCategorySlug>(data[0]?.slug ?? 'grand')

  return (
    <>
      <CategoryBackdrop slug={slug} reduce={reduce} />
      <div className="relative z-10 w-full px-6">
        <RebateBrowser data={data} reduce={reduce} onCategoryChange={setSlug} />
      </div>
    </>
  )
}
