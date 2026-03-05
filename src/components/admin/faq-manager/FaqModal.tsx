'use client'

import React, { useState, useEffect } from 'react'
import {
  ModalShell,
  FormSection,
  Field,
  TextInput,
  TextareaInput,
  SelectInput,
  MultiCheckbox,
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
}

interface FaqCategory {
  id: string
  name: string
  slug: string
  color?: string | null
}

interface FaqDoc {
  id: string
  question: string
  slug: string
  status: 'draft' | 'published'
  excerpt?: string | null
  answer?: unknown  // Lexical JSON
  group?: SupportGroup | string | null
  categories?: Array<FaqCategory | string>
}

interface FaqModalProps {
  isOpen: boolean
  onClose: () => void
  faq?: FaqDoc | null
  hubs: SupportGroup[]
  categories: FaqCategory[]
  defaultHubId?: string
  defaultCategoryIds?: string[]
  onSaved: (faq: FaqDoc) => void
}

// ── Lexical helpers ───────────────────────────────────────────────────────────

interface LexicalTextNode {
  type: 'text'
  text?: string
  detail?: number
  format?: number
  mode?: string
  style?: string
  version?: number
}

interface LexicalParagraphNode {
  type: 'paragraph'
  children?: Array<LexicalTextNode | Record<string, unknown>>
  direction?: string | null
  format?: string
  indent?: number
  textFormat?: number
  version?: number
}

interface LexicalRoot {
  type: 'root'
  direction?: string
  format?: string
  indent?: number
  version?: number
  children?: LexicalParagraphNode[]
}

interface LexicalJSON {
  root: LexicalRoot
}

function textToLexical(text: string): LexicalJSON {
  const paras = text.trim() ? text.trim().split(/\n\n+/) : ['']
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: paras.map(p => ({
        type: 'paragraph',
        direction: p.trim() ? 'ltr' : null,
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
        children: p.trim()
          ? [{
              type: 'text' as const,
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: p.trim(),
              version: 1,
            }]
          : [],
      })),
    },
  }
}

function lexicalToText(lexical: unknown): string {
  if (!lexical || typeof lexical !== 'object') return ''
  const root = (lexical as Record<string, unknown>).root as LexicalRoot | undefined
  if (!root?.children) return ''
  return root.children
    .map(node =>
      (node.children ?? [])
        .filter((c): c is LexicalTextNode => (c as Record<string, unknown>).type === 'text')
        .map(c => c.text ?? '')
        .join('')
    )
    .filter(Boolean)
    .join('\n\n')
}

// ── Slug preview ──────────────────────────────────────────────────────────────

function toSlugPreview(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

// ── Success state after CREATE ────────────────────────────────────────────────

interface CreateSuccessProps {
  newId: string
  question: string
  onCreateAnother: () => void
  onDone: () => void
}

function CreateSuccess({ newId, question, onCreateAnother, onDone }: CreateSuccessProps) {
  const [doneHov, setDoneHov] = useState(false)
  const [anotherHov, setAnotherHov] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Success header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 16,
        padding: '20px 22px',
        background: `${t.jade}12`,
        border: `1px solid ${t.jade}35`,
        borderRadius: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: `${t.jade}20`,
          border: `1px solid ${t.jade}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8L6.5 11.5L13 4.5" stroke={t.jade} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.high, marginBottom: 4 }}>
            FAQ created!
          </div>
          <div style={{
            fontSize: 13, color: t.mid, lineHeight: 1.5,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            &ldquo;{question}&rdquo;
          </div>
        </div>
      </div>

      {/* Tip banner */}
      <div style={{
        padding: '12px 16px',
        background: `${t.violet}10`,
        border: `1px solid ${t.violet}25`,
        borderRadius: 10,
        fontSize: 13,
        color: t.mid,
        lineHeight: 1.5,
      }}>
        <strong style={{ color: t.high }}>Tip:</strong> The answer was saved as plain text.
        Use the full editor to add rich formatting — headings, images, ordered lists, and more.
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Open full editor — primary */}
        <a
          href={`/admin/collections/faqs/${newId}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '13px 18px',
            background: t.surface,
            border: `1px solid ${t.lineStr}`,
            borderRadius: 11,
            color: t.high,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            transition: 'border-color 0.12s, background 0.12s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = `${t.violet}60`
            el.style.background = t.cardHov
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = t.lineStr
            el.style.background = t.surface
          }}
        >
          <span>Open full editor</span>
          <span style={{ fontSize: 16, color: t.violet }}>→</span>
        </a>

        {/* Secondary row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onCreateAnother}
            onMouseEnter={() => setAnotherHov(true)}
            onMouseLeave={() => setAnotherHov(false)}
            style={{
              flex: 1, height: 40, borderRadius: 10,
              background: 'transparent',
              border: `1px solid ${anotherHov ? t.lineStr : t.line}`,
              color: anotherHov ? t.high : t.mid,
              cursor: 'pointer', fontSize: 14,
              fontFamily: 'inherit', fontWeight: 500,
              transition: 'all 0.12s',
            }}
          >
            Create another
          </button>
          <button
            type="button"
            onClick={onDone}
            onMouseEnter={() => setDoneHov(true)}
            onMouseLeave={() => setDoneHov(false)}
            style={{
              flex: 1, height: 40, borderRadius: 10,
              background: doneHov ? `${t.jade}25` : `${t.jade}18`,
              border: `1px solid ${doneHov ? `${t.jade}55` : `${t.jade}35`}`,
              color: t.jade,
              cursor: 'pointer', fontSize: 14,
              fontFamily: 'inherit', fontWeight: 600,
              transition: 'all 0.12s',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status toggle ─────────────────────────────────────────────────────────────

interface StatusToggleProps {
  value: 'draft' | 'published'
  onChange: (v: 'draft' | 'published') => void
}

function StatusToggle({ value, onChange }: StatusToggleProps) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {/* Draft */}
      <button
        type="button"
        onClick={() => onChange('draft')}
        style={{
          flex: 1,
          height: 40,
          borderRadius: 10,
          background: value === 'draft' ? `${t.gold}18` : 'transparent',
          border: `1px solid ${value === 'draft' ? `${t.gold}55` : t.lineStr}`,
          color: value === 'draft' ? t.gold : t.mid,
          cursor: 'pointer',
          fontSize: 13.5,
          fontWeight: value === 'draft' ? 600 : 400,
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          transition: 'all 0.12s',
        }}
      >
        {value === 'draft' && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5L4 7L8 3" stroke={t.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        Draft
      </button>

      {/* Published */}
      <button
        type="button"
        onClick={() => onChange('published')}
        style={{
          flex: 1,
          height: 40,
          borderRadius: 10,
          background: value === 'published' ? `${t.jade}20` : 'transparent',
          border: `1px solid ${value === 'published' ? t.jade : t.lineStr}`,
          color: value === 'published' ? t.jade : t.mid,
          cursor: 'pointer',
          fontSize: 13.5,
          fontWeight: value === 'published' ? 600 : 400,
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          transition: 'all 0.12s',
        }}
      >
        {value === 'published' && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5L4 7L8 3" stroke={t.jade} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        Published
      </button>
    </div>
  )
}

// ── Form state helpers ────────────────────────────────────────────────────────

interface FormData {
  question: string
  answer: string
  excerpt: string
  groupId: string
  categoryIds: string[]
  status: 'draft' | 'published'
}

function resolveGroupId(faq: FaqDoc | null | undefined): string {
  if (!faq?.group) return ''
  if (typeof faq.group === 'string') return faq.group
  return faq.group.id
}

function resolveCategoryIds(faq: FaqDoc | null | undefined): string[] {
  if (!faq?.categories) return []
  return faq.categories
    .map(c => (typeof c === 'string' ? c : c.id))
    .filter(Boolean)
}

function buildInitialForm(
  faq: FaqDoc | null | undefined,
  defaultHubId: string | undefined,
  defaultCategoryIds: string[] | undefined,
): FormData {
  if (faq) {
    return {
      question: faq.question,
      answer: lexicalToText(faq.answer),
      excerpt: faq.excerpt ?? '',
      groupId: resolveGroupId(faq),
      categoryIds: resolveCategoryIds(faq),
      status: faq.status,
    }
  }
  return {
    question: '',
    answer: '',
    excerpt: '',
    groupId: defaultHubId ?? '',
    categoryIds: defaultCategoryIds ?? [],
    status: 'draft',
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export function FaqModal({
  isOpen,
  onClose,
  faq,
  hubs,
  categories,
  defaultHubId,
  defaultCategoryIds,
  onSaved,
}: FaqModalProps) {
  const isEditing = Boolean(faq)

  const [form, setForm] = useState<FormData>(() =>
    buildInitialForm(faq, defaultHubId, defaultCategoryIds)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdDoc, setCreatedDoc] = useState<FaqDoc | null>(null)

  // Reset form whenever the modal opens or the target faq changes
  useEffect(() => {
    if (isOpen) {
      setForm(buildInitialForm(faq, defaultHubId, defaultCategoryIds))
      setError(null)
      setCreatedDoc(null)
      setLoading(false)
    }
  }, [isOpen, faq, defaultHubId, defaultCategoryIds])

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): string | null {
    if (!form.question.trim()) return 'Question is required.'
    return null
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    setError(null)

    const payload: Record<string, unknown> = {
      question: form.question.trim(),
      answer: textToLexical(form.answer),
      status: form.status,
    }
    if (form.excerpt.trim()) payload.excerpt = form.excerpt.trim()
    if (form.groupId) payload.group = form.groupId
    payload.categories = form.categoryIds

    try {
      if (isEditing && faq) {
        const result = await apiPatch('/api/faqs', faq.id, payload)
        if (result.errors?.length) {
          setError(`Failed to update FAQ. ${JSON.stringify(result.errors[0])}`)
          return
        }
        onSaved(result.doc as FaqDoc)
        onClose()
      } else {
        const result = await apiPost('/api/faqs', payload)
        if (result.errors?.length) {
          setError(`Failed to create FAQ. ${JSON.stringify(result.errors[0])}`)
          return
        }
        setCreatedDoc(result.doc as FaqDoc)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // ── After CREATE: "Create another" resets form ──────────────────────────────

  function handleCreateAnother() {
    setCreatedDoc(null)
    setForm(buildInitialForm(null, defaultHubId, defaultCategoryIds))
    setError(null)
  }

  function handleDone() {
    if (createdDoc) onSaved(createdDoc)
    onClose()
  }

  // ── Modal title / subtitle ──────────────────────────────────────────────────

  const modalTitle = isEditing ? 'Edit FAQ' : 'New FAQ'
  const modalSubtitle = isEditing && faq
    ? faq.question.length > 50
      ? `${faq.question.slice(0, 50)}…`
      : faq.question
    : undefined

  // ── Hub select options ──────────────────────────────────────────────────────

  const hubOptions = [
    { label: 'No hub', value: '' },
    ...hubs.map(h => ({ label: h.name, value: h.id })),
  ]

  // ── Category checkbox options ───────────────────────────────────────────────

  const categoryOptions = categories.map(c => {
    const opt: { label: string; value: string; color?: string } = {
      label: c.name,
      value: c.id,
    }
    if (c.color) opt.color = c.color
    return opt
  })

  // ── Slug preview (create mode only) ────────────────────────────────────────

  const slugPreview = !isEditing && form.question.trim()
    ? toSlugPreview(form.question)
    : null

  // ── Render ──────────────────────────────────────────────────────────────────

  const shellProps = {
    isOpen,
    onClose,
    title: modalTitle,
    width: 680,
    ...(modalSubtitle ? { subtitle: modalSubtitle } : {}),
  }

  return (
    <ModalShell {...shellProps}>
      {/* Success state (create only) */}
      {createdDoc ? (
        <CreateSuccess
          newId={createdDoc.id}
          question={form.question}
          onCreateAnother={handleCreateAnother}
          onDone={handleDone}
        />
      ) : (
        <>
          {/* ── Question ── */}
          <FormSection>
            <Field label="Question" required>
              <TextInput
                value={form.question}
                onChange={v => setField('question', v)}
                placeholder="What would a customer type to find this?"
                autoFocus
                required
              />
              {slugPreview && (
                <div style={{
                  marginTop: 6, fontSize: 12, color: t.lo,
                  fontFamily: 'ui-monospace, monospace',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ color: t.lo, fontSize: 11 }}>Slug preview:</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 5,
                    background: t.surface, border: `1px solid ${t.line}`,
                    color: t.mid, letterSpacing: '0.01em',
                  }}>
                    {slugPreview}
                  </span>
                </div>
              )}
            </Field>
          </FormSection>

          {/* ── Answer ── */}
          <FormSection>
            {/* Instructional banner */}
            <div style={{
              padding: '10px 14px',
              background: `${t.violet}10`,
              border: `1px solid ${t.violet}25`,
              borderRadius: 9,
              fontSize: 12.5,
              color: t.mid,
              lineHeight: 1.55,
            }}>
              Write your answer below. Separate paragraphs with a blank line.
              Use the{' '}
              {faq
                ? <a href={`/admin/collections/faqs/${faq.id}`} style={{ color: t.violet, textDecoration: 'none' }}>full editor</a>
                : <span style={{ color: t.violet }}>full editor</span>
              }{' '}
              for rich formatting (headings, images, lists).
            </div>

            <Field label="Answer">
              <TextareaInput
                value={form.answer}
                onChange={v => setField('answer', v)}
                placeholder="Type your answer here. Separate paragraphs with a blank line."
                rows={8}
              />
            </Field>
          </FormSection>

          {/* ── Excerpt ── */}
          <FormSection>
            <Field
              label="Excerpt"
              hint="Short summary shown in search results and FAQ cards (max 200 chars)"
            >
              <TextareaInput
                value={form.excerpt}
                onChange={v => setField('excerpt', v)}
                placeholder="Short summary shown in search results and FAQ cards (max 200 chars)"
                rows={2}
                maxLength={200}
              />
            </Field>
          </FormSection>

          {/* ── Hub + Status row ── */}
          <FormSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Support Hub">
                <SelectInput
                  value={form.groupId}
                  onChange={v => setField('groupId', v)}
                  options={hubOptions}
                  placeholder="No hub"
                />
              </Field>

              <Field label="Status">
                <StatusToggle
                  value={form.status}
                  onChange={v => setField('status', v)}
                />
              </Field>
            </div>
          </FormSection>

          {/* ── Categories ── */}
          {categories.length > 0 && (
            <FormSection title="Categories">
              <MultiCheckbox
                value={form.categoryIds}
                onChange={v => setField('categoryIds', v)}
                options={categoryOptions}
              />
            </FormSection>
          )}

          {/* ── Actions ── */}
          <div style={{ marginTop: 8 }}>
            <FormActions
              onCancel={onClose}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel={isEditing ? 'Save changes' : 'Create FAQ'}
              secondaryAction={
                isEditing && faq
                  ? { label: 'Open full editor →', href: `/admin/collections/faqs/${faq.id}` }
                  : undefined
              }
            />
            {error && (
              <div style={{
                marginTop: 10, padding: '9px 14px',
                background: `${t.red}12`,
                border: `1px solid ${t.red}30`,
                borderRadius: 9,
                fontSize: 13, color: t.red, lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}
          </div>
        </>
      )}
    </ModalShell>
  )
}
