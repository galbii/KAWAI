'use client'

import { useEffect } from 'react'
import { useAdminBar } from '@/contexts/AdminBarContext'

type Props = {
  collection: string
  id: string
  collectionLabels?: { singular: string; plural: string }
}

/**
 * Zero-output client component that registers the current CMS document
 * with the AdminBar context. Render this in any Server Component page
 * that has a backing CMS document to enable the admin bar Edit button.
 */
export function AdminBarDoc({ collection, id, collectionLabels }: Props) {
  const { setDoc } = useAdminBar()

  useEffect(() => {
    setDoc({
      collection,
      id,
      ...(collectionLabels ? { collectionLabels } : {}),
    })
    return () => setDoc(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, id])

  return null
}
