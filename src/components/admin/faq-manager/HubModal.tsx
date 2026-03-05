'use client'

import React, { useState, useEffect } from 'react'
import {
  ModalShell,
  FormSection,
  Field,
  TextInput,
  TextareaInput,
  Toggle,
  FormActions,
  apiPost,
  apiPatch,
  t,
} from './ModalShell'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SupportGroup {
  id: string
  name: string
  slug: string
  heading?: string
  description?: string
  isActive: boolean
  displayOrder: number
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface HubModalProps {
  isOpen: boolean
  onClose: () => void
  hub?: SupportGroup | null
  onSaved: (hub: SupportGroup) => void
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

// ── HubModal ──────────────────────────────────────────────────────────────────

export function HubModal({ isOpen, onClose, hub, onSaved }: HubModalProps) {
  const isEdit = Boolean(hub)

  // Form state
  const [name, setName]               = useState('')
  const [heading, setHeading]         = useState('')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState('0')
  const [isActive, setIsActive]       = useState(true)
  const [metaTitle, setMetaTitle]     = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // Populate fields when editing
  useEffect(() => {
    if (hub) {
      setName(hub.name)
      setHeading(hub.heading ?? '')
      setDescription(hub.description ?? '')
      setDisplayOrder(String(hub.displayOrder ?? 0))
      setIsActive(hub.isActive)
      setMetaTitle(hub.seo?.metaTitle ?? '')
      setMetaDescription(hub.seo?.metaDescription ?? '')
    } else {
      setName('')
      setHeading('')
      setDescription('')
      setDisplayOrder('0')
      setIsActive(true)
      setMetaTitle('')
      setMetaDescription('')
    }
    setError(null)
  }, [hub, isOpen])

  const slugPreview = toSlug(name)

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
      heading: heading.trim() || undefined,
      description: description.trim() || undefined,
      displayOrder: parseInt(displayOrder, 10) || 0,
      isActive,
      seo: {
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
      },
    }

    try {
      const result = isEdit && hub
        ? await apiPatch('/api/support-groups', hub.id, payload)
        : await apiPost('/api/support-groups', payload)

      if (result.errors && result.errors.length > 0) {
        setError('Save failed. Please check your inputs and try again.')
        return
      }

      if (!result.doc) {
        setError('Unexpected response from server.')
        return
      }

      onSaved(result.doc as unknown as SupportGroup)
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
      title={isEdit ? 'Edit Hub' : 'New Support Hub'}
      subtitle={isEdit ? `Editing: ${hub?.name}` : 'Create a new support hub for the technical support division'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Name */}
        <Field label="Name" required>
          <TextInput
            value={name}
            onChange={setName}
            placeholder="Owners Hub"
            required
            autoFocus
          />
          {slugPreview && (
            <div style={{ fontSize: 11, color: t.lo, marginTop: 5 }}>
              Slug: <span style={{ fontFamily: 'ui-monospace, monospace', color: t.lo }}>{slugPreview}</span>
            </div>
          )}
        </Field>

        {/* Heading */}
        <Field label="Heading" hint='Displayed as the hub title on the page. E.g. "I Own a Kawai Piano"'>
          <TextInput
            value={heading}
            onChange={setHeading}
            placeholder="I Own a Kawai Piano"
          />
        </Field>

        {/* Description */}
        <Field label="Description" hint="Short description shown on the hub page">
          <TextareaInput
            value={description}
            onChange={setDescription}
            placeholder="Short description shown on the hub page"
            rows={3}
          />
        </Field>

        {/* Display Order */}
        <Field label="Display Order" hint="Lower numbers appear first on the landing page">
          <TextInput
            value={displayOrder}
            onChange={setDisplayOrder}
            type="number"
          />
        </Field>

        {/* Is Active */}
        <Field label="Visibility">
          <Toggle
            checked={isActive}
            onChange={setIsActive}
            label="Visible on /technical-support-division"
          />
        </Field>

        {/* SEO Section */}
        <FormSection title="SEO" collapsible>
          <Field label="Meta Title">
            <TextInput
              value={metaTitle}
              onChange={setMetaTitle}
              placeholder="Page title for search engines"
            />
          </Field>
          <Field label="Meta Description">
            <TextareaInput
              value={metaDescription}
              onChange={setMetaDescription}
              placeholder="Brief description for search engines (recommended: under 160 characters)"
              maxLength={160}
              rows={2}
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
        submitLabel={isEdit ? 'Save Changes' : 'Create Hub'}
        secondaryAction={
          isEdit && hub
            ? { label: 'Open in admin →', href: `/admin/collections/support-groups/${hub.id}` }
            : undefined
        }
      />
    </ModalShell>
  )
}
