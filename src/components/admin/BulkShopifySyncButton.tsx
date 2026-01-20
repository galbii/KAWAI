/**
 * Bulk Shopify Sync Button
 *
 * Admin UI component that appears in the Products collection list view.
 * Allows admins to bulk sync all products from Shopify that have the custom.model metafield.
 *
 * Features:
 * - One-click bulk sync from Shopify
 * - Loading state with progress indication
 * - Toast notifications for results
 * - Positioned next to "Create New" button
 *
 * @module BulkShopifySyncButton
 */

'use client'

import { useState } from 'react'
import { Button, useConfig, toast } from '@payloadcms/ui'

/**
 * Bulk sync result summary
 */
interface SyncResult {
  success: boolean
  summary: {
    total: number
    created: number
    updated: number
    skipped: number
    errors: number
  }
  errors?: Array<{
    model: string
    error: string
  }>
  message?: string
}

/**
 * Bulk Shopify Sync Button Component
 *
 * Displays in the Products collection list view and allows admins to bulk sync
 * all products from Shopify that have the custom.model metafield.
 */
export default function BulkShopifySyncButton() {
  const [loading, setLoading] = useState(false)
  const { config } = useConfig()

  const handleBulkSync = async () => {
    if (
      !confirm(
        'Sync all products from Shopify?\n\nThis will create or update products based on their model number. This may take a few minutes for large catalogs.'
      )
    ) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/products/bulk-sync-from-shopify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data: SyncResult = await response.json()

      if (response.ok && data.success) {
        // Show success toast with summary
        toast.success(
          `✓ Sync Complete: ${data.summary.created} created, ${data.summary.updated} updated${data.summary.errors > 0 ? `, ${data.summary.errors} errors` : ''}`
        )

        // Show error details if any
        if (data.errors && data.errors.length > 0) {
          data.errors.forEach((err) => {
            toast.error(`${err.model}: ${err.error}`)
          })
        }

        // Reload page after 2 seconds to show updated products
        setTimeout(() => window.location.reload(), 2000)
      } else {
        toast.error(data.message || 'Bulk sync failed')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Network error during sync')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 var(--gutter-h)',
        marginBottom: 'calc(var(--base) * -1)',
      }}
    >
      <Button
        onClick={handleBulkSync}
        disabled={loading}
        buttonStyle="secondary"
        size="small"
      >
        {loading ? 'Syncing...' : 'Sync from Shopify'}
      </Button>
    </div>
  )
}
