'use client'

import React, { useState, useEffect } from 'react'
import {
  ModalShell,
  FormSection,
  Field,
  TextInput,
  TextareaInput,
  SelectInput,
  ColorSwatches,
  FormActions,
  apiPost,
  apiPatch,
  t,
} from './ModalShell'

// ── Types ─────────────────────────────────────────────────────────────────────

interface FaqCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  displayOrder?: number
  group?: { id: string; name: string; slug: string } | string | null
}

interface SupportGroup {
  id: string
  name: string
  slug: string
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: FaqCategory | null
  hubs: SupportGroup[]
  defaultHubId?: string
  onSaved: (category: FaqCategory) => void
}

// ── Slug generator ────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Resolve group id from polymorphic relationship ────────────────────────────

function resolveGroupId(group: FaqCategory['group']): string {
  if (!group) return ''
  if (typeof group === 'string') return group
  return group.id
}

// ── CategoryModal ─────────────────────────────────────────────────────────────

export function CategoryModal({
  isOpen,
  onClose,
  category,
  hubs,
  defaultHubId,
  onSaved,
}: CategoryModalProps) {
  const isEdit = Boolean(category)

  // Form state
  const [name, setName]               = useState('')
  const [description, setDescription] = useState('')
  const [hubId, setHubId]             = useState('')
  const [color, setColor]             = useState('#6366F1')
  const [icon, setIcon]               = useState('')
  const [displayOrder, setDisplayOrder] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // Populate fields when editing or opening fresh
  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description ?? '')
      setHubId(resolveGroupId(category.group))
      setColor(category.color ?? '#6366F1')
      setIcon(category.icon ?? '')
      setDisplayOrder(category.displayOrder !== undefined ? String(category.displayOrder) : '')
    } else {
      setName('')
      setDescription('')
      setHubId(defaultHubId ?? '')
      setColor('#6366F1')
      setIcon('')
      setDisplayOrder('')
    }
    setError(null)
  }, [category, defaultHubId, isOpen])

  const slugPreview = toSlug(name)

  // Build hub select options
  const hubOptions: Array<{ label: string; value: string }> = [
    { label: 'No hub (global)', value: '' },
    ...hubs.map(h => ({ label: h.name, value: h.id })),
  ]

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    setError(null)
    setLoading(true)

    const payload = {
      name: name.trim(),
      slug: slugPreview,
      description: description.trim() || undefined,
      group: hubId || null,
      color: color || undefined,
      icon: icon.trim() || undefined,
      displayOrder: displayOrder !== '' ? parseInt(displayOrder, 10) : undefined,
    }

    try {
      const result = isEdit && category
        ? await apiPatch('/api/faq-categories', category.id, payload)
        : await apiPost('/api/faq-categories', payload)

      if (result.errors && result.errors.length > 0) {
        setError('Save failed. Please check your inputs and try again.')
        return
      }

      if (!result.doc) {
        setError('Unexpected response from server.')
        return
      }

      onSaved(result.doc as unknown as FaqCategory)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'New FAQ Category'}
      subtitle={
        isEdit
          ? `Editing: ${category?.name}`
          : 'Create a new category to organize FAQs within a hub'
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Name */}
        <Field label="Name" required>
          <TextInput
            value={name}
            onChange={setName}
            placeholder="Troubleshooting"
            required
            autoFocus
          />
          {slugPreview && (
            <div style={{ fontSize: 11, color: t.lo, marginTop: 5 }}>
              Slug:{' '}
              <span style={{ fontFamily: 'ui-monospace, monospace', color: t.lo }}>
                {slugPreview}
              </span>
            </div>
          )}
        </Field>

        {/* Description */}
        <Field label="Description">
          <TextareaInput
            value={description}
            onChange={setDescription}
            placeholder="Brief description of this category"
            rows={2}
          />
        </Field>

        {/* Support Hub */}
        <Field label="Support Hub" hint="Associate this category with a hub, or leave global">
          <SelectInput
            value={hubId}
            onChange={setHubId}
            options={hubOptions}
            placeholder="No hub (global)"
          />
        </Field>

        {/* Color */}
        <Field label="Color" hint="Used for category badges and accent highlights">
          <ColorSwatches value={color} onChange={setColor} />
        </Field>

        {/* Icon */}
        <FormSection>
          <Field
            label="Icon Identifier"
            hint="Icon name: wrench, shield, book, wifi, cpu, package, home, star"
          >
            <TextInput
              value={icon}
              onChange={setIcon}
              placeholder="wrench"
            />
          </Field>

          {/* Display Order */}
          <Field label="Display Order" hint="Lower numbers appear first within a hub">
            <TextInput
              value={displayOrder}
              onChange={setDisplayOrder}
              type="number"
              placeholder="0"
            />
          </Field>
        </FormSection>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: `${t.red}15`,
              border: `1px solid ${t.red}40`,
              color: t.red,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <FormActions
        onCancel={onClose}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={isEdit ? 'Save Changes' : 'Create Category'}
        secondaryAction={
          isEdit && category
            ? { label: 'Open in admin →', href: `/admin/collections/faq-categories/${category.id}` }
            : undefined
        }
      />
    </ModalShell>
  )
}
