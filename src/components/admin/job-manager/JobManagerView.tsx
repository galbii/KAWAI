'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ── Design tokens (matching CustomNav exactly) ────────────────────────────────
const t = {
  navBg:   '#0A0A0E',
  bg:      '#0D0D14',
  surface: '#141420',
  card:    '#191926',
  cardHov: '#1E1E2C',
  line:    '#1C1C2C',
  lineStr: '#252535',
  loFaint: '#2A2A40',
  high:    '#ECECF2',
  mid:     '#8484A0',
  lo:      '#4C4C68',
  violet:  '#6366F1',
  jade:    '#2EC4A0',
  gold:    '#E8A84E',
  red:     '#C41E3A',
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Job {
  id: string
  title: string
  department?: string | null
  location?: string | null
  type?: string | null
  status?: string | null
  postedAt?: string | null
  updatedAt: string
}

interface JobApplication {
  id: string
  applicantName: string
  email: string
  status?: string | null
  submittedAt?: string | null
  job?: { id: string; title: string } | string | null
}

// ── Wizard state ──────────────────────────────────────────────────────────────

interface WizardState {
  step: 1 | 2 | 3
  title: string
  department: string
  location: string
  type: string
  description: any   // ← was string, now TipTap JSON object
  publish: boolean
}

const INITIAL_WIZARD: WizardState = {
  step: 1,
  title: '',
  department: '',
  location: '',
  type: 'full-time',
  description: null,  // ← was ''
  publish: true,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function emptyLexical() {
  return { root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: [] } }
}

// Convert ProseMirror/TipTap JSON → Payload Lexical JSON
function tiptapToLexical(json: any): any {
  if (!json) return emptyLexical()

  function marks(arr: any[] = []): number {
    return arr.reduce((f, m) => {
      if (m.type === 'bold') return f | 1
      if (m.type === 'italic') return f | 2
      if (m.type === 'underline') return f | 8
      return f
    }, 0)
  }

  function inlines(nodes: any[] = []): any[] {
    return nodes.map(n => ({
      type: 'text', version: 1,
      text: n.text || '',
      detail: 0, mode: 'normal', style: '',
      format: marks(n.marks || []),
    }))
  }

  function convert(node: any): any | null {
    switch (node.type) {
      case 'paragraph':
        return { type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, children: inlines(node.content) }
      case 'heading':
        return { type: 'heading', version: 1, direction: 'ltr', format: '', indent: 0, tag: `h${node.attrs?.level ?? 2}`, children: inlines(node.content) }
      case 'bulletList':
        return {
          type: 'list', version: 1, direction: 'ltr', format: '', indent: 0,
          listType: 'bullet', tag: 'ul', start: 1,
          children: (node.content || []).map((item: any, i: number) => ({
            type: 'listitem', version: 1, direction: 'ltr', format: '', indent: 0,
            value: i + 1, children: inlines(item.content?.[0]?.content),
          })),
        }
      case 'orderedList':
        return {
          type: 'list', version: 1, direction: 'ltr', format: '', indent: 0,
          listType: 'number', tag: 'ol', start: 1,
          children: (node.content || []).map((item: any, i: number) => ({
            type: 'listitem', version: 1, direction: 'ltr', format: '', indent: 0,
            value: i + 1, children: inlines(item.content?.[0]?.content),
          })),
        }
      default: return null
    }
  }

  const children = (json.content || []).map(convert).filter(Boolean)
  return {
    root: {
      type: 'root', version: 1, direction: 'ltr', format: '', indent: 0,
      children: children.length ? children : [{ type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [] }],
    },
  }
}

function extractPreviewText(json: any): string {
  if (!json) return ''
  const parts: string[] = []
  function walk(n: any) {
    if (n.type === 'text' && n.text) parts.push(n.text)
    if (n.content) (n.content as any[]).forEach(walk)
  }
  walk(json)
  return parts.join(' ')
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status, type }: { status: string | null | undefined; type: 'job' | 'app' }) {
  let color = t.mid
  if (type === 'job') {
    color = status === 'open' ? t.jade : t.mid
  } else {
    switch (status) {
      case 'new': color = t.violet; break
      case 'reviewing': color = t.gold; break
      case 'interviewing': color = t.jade; break
      case 'offer': color = t.jade; break
      case 'rejected': color = t.red; break
    }
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 8, fontSize: 11, fontWeight: 500,
      background: color + '1A', color, border: `1px solid ${color}40`,
      textTransform: 'capitalize',
    }}>
      {status ?? 'unknown'}
    </span>
  )
}

function PlaceholderRow({ last }: { last: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
      borderBottom: last ? 'none' : `1px solid ${t.line}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ height: 13, width: '60%', background: t.loFaint, borderRadius: 4, marginBottom: 6 }} />
        <div style={{ height: 11, width: '35%', background: t.line, borderRadius: 4 }} />
      </div>
      <div style={{ height: 22, width: 48, background: t.line, borderRadius: 8 }} />
      <div style={{ height: 22, width: 38, background: t.line, borderRadius: 8 }} />
    </div>
  )
}

function WizardStepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Basic Info' },
    { n: 2, label: 'Description' },
    { n: 3, label: 'Review' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {steps.map((s, i) => {
        const done = step > s.n
        const active = step === s.n
        const dotColor = done ? t.jade : active ? t.violet : t.line
        const textColor = done ? t.jade : active ? t.high : t.lo
        return (
          <React.Fragment key={s.n}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done ? t.jade : active ? t.violet : t.loFaint,
                border: `2px solid ${dotColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done || active ? '#fff' : t.lo,
                fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
              }}>
                {done ? '✓' : s.n}
              </div>
              <span style={{ fontSize: 10.5, color: textColor, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 8px', marginBottom: 16,
                background: step > s.n ? t.jade : t.line,
                transition: 'background 0.2s',
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function FocusableInput({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: 'block', width: '100%', height: 40,
        background: t.surface, border: `1px solid ${focused ? t.violet : t.lineStr}`,
        borderRadius: 8, color: t.high, fontSize: 14, padding: '0 12px',
        outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        transition: 'border-color 0.12s',
      }}
    />
  )
}

function FocusableSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
}) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: 'block', width: '100%', height: 40,
        background: t.surface, border: `1px solid ${focused ? t.violet : t.lineStr}`,
        borderRadius: 8, color: t.high, fontSize: 14, padding: '0 12px',
        outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        cursor: 'pointer', transition: 'border-color 0.12s',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 8L10 13L15 8' stroke='%238484A0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: 36,
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: t.card, color: t.high }}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label style={{
      display: 'block', fontSize: 11.5, fontWeight: 600,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: t.mid, marginBottom: 6,
    }}>
      {label}
      {required && <span style={{ color: t.red, marginLeft: 4 }}>*</span>}
    </label>
  )
}

function WizardBtn({
  label, onClick, disabled, color, outline,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  color?: string
  outline?: boolean
}) {
  const [hov, setHov] = useState(false)
  const bg = outline
    ? hov ? t.cardHov : 'transparent'
    : disabled
      ? (color ?? t.violet) + '55'
      : hov
        ? (color ?? t.violet) + 'dd'
        : (color ?? t.violet)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 40, padding: '0 20px', borderRadius: 9,
        background: bg,
        border: `1px solid ${outline ? t.lineStr : (color ?? t.violet) + (disabled ? '33' : '88')}`,
        color: outline ? (hov ? t.high : t.mid) : '#fff',
        fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.12s',
      }}
    >
      {label}
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function JobManagerView() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [apps, setApps] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [wizard, setWizard] = useState<WizardState>(INITIAL_WIZARD)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdId, setCreatedId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [jobsRes, appsRes] = await Promise.all([
        fetch('/api/jobs?limit=50&sort=-postedAt&depth=0', { credentials: 'include' }),
        fetch('/api/job-applications?limit=5&sort=-submittedAt&depth=1', { credentials: 'include' }),
      ])
      if (!jobsRes.ok) throw new Error(`Jobs fetch failed (${jobsRes.status})`)
      if (!appsRes.ok) throw new Error(`Applications fetch failed (${appsRes.status})`)
      const jobsData = await jobsRes.json() as { docs: Job[] }
      const appsData = await appsRes.json() as { docs: JobApplication[]; totalDocs?: number }
      setJobs(jobsData.docs)
      setApps(appsData.docs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadData() }, [loadData])

  // ── Wizard helpers ────────────────────────────────────────────────────────

  const setWizardField = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setWizard(prev => ({ ...prev, [key]: value }))
  }

  const resetWizard = () => {
    setWizard(INITIAL_WIZARD)
    setSubmitError(null)
    setCreatedId(null)
  }

  const handleSubmit = async () => {
    if (!wizard.title.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: wizard.title.trim(),
          department: wizard.department.trim() || undefined,
          location: wizard.location.trim() || undefined,
          type: wizard.type || 'full-time',
          description: wizard.description ? tiptapToLexical(wizard.description) : emptyLexical(),
          status: wizard.publish ? 'open' : 'closed',
        }),
      })
      const json = await res.json() as { doc?: { id: string }; errors?: { message: string }[] }
      if (!res.ok || json.errors?.length) {
        const msg = json.errors?.[0]?.message ?? `Server error (${res.status})`
        setSubmitError(msg)
        return
      }
      if (json.doc?.id) {
        setCreatedId(json.doc.id)
        void loadData()
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render wizard step content ────────────────────────────────────────────

  const renderWizardBody = () => {
    // Success state
    if (createdId) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: t.jade + '20', border: `2px solid ${t.jade}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: t.jade,
          }}>
            ✓
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.high, marginBottom: 6 }}>Job Created!</div>
            <div style={{ fontSize: 13, color: t.mid }}>
              {wizard.publish ? 'Your listing is now live.' : 'Saved as a draft.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <a
              href={`/admin/collections/jobs/${createdId}`}
              style={{
                display: 'inline-flex', alignItems: 'center', height: 40, padding: '0 18px',
                borderRadius: 9, background: t.violet, border: 'none',
                color: '#fff', fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Edit in Payload →
            </a>
            <button
              onClick={resetWizard}
              style={{
                height: 40, padding: '0 18px', borderRadius: 9,
                background: 'transparent', border: `1px solid ${t.lineStr}`,
                color: t.mid, fontSize: 13.5, fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              Create Another
            </button>
          </div>
        </div>
      )
    }

    if (wizard.step === 1) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <FieldLabel label="Job Title" required />
            <FocusableInput
              value={wizard.title}
              onChange={v => setWizardField('title', v)}
              placeholder="e.g. Senior Piano Technician"
              autoFocus
            />
          </div>
          <div>
            <FieldLabel label="Department" />
            <FocusableInput
              value={wizard.department}
              onChange={v => setWizardField('department', v)}
              placeholder="e.g. Service, Sales, Technology"
            />
          </div>
          <div>
            <FieldLabel label="Location" />
            <FocusableInput
              value={wizard.location}
              onChange={v => setWizardField('location', v)}
              placeholder="e.g. Los Angeles, CA or Remote"
            />
          </div>
          <div>
            <FieldLabel label="Employment Type" />
            <FocusableSelect
              value={wizard.type}
              onChange={v => setWizardField('type', v)}
              options={[
                { label: 'Full-Time', value: 'full-time' },
                { label: 'Part-Time', value: 'part-time' },
                { label: 'Contract', value: 'contract' },
                { label: 'Internship', value: 'internship' },
              ]}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
            <WizardBtn
              label="Next →"
              onClick={() => setWizardField('step', 2)}
              disabled={!wizard.title.trim()}
            />
          </div>
        </div>
      )
    }

    if (wizard.step === 2) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <FieldLabel label="Job Description" required />
            <div style={{ fontSize: 12, color: t.lo, marginBottom: 8 }}>
              Describe the role, responsibilities, and requirements.
            </div>
            <DescriptionEditor
              value={wizard.description}
              onChange={v => setWizardField('description', v)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
            <WizardBtn label="← Back" onClick={() => setWizardField('step', 1)} outline />
            <WizardBtn
              label="Next →"
              onClick={() => setWizardField('step', 3)}
            />
          </div>
        </div>
      )
    }

    // Step 3 — Review
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Summary card */}
        <div style={{
          background: t.surface, border: `1px solid ${t.lineStr}`,
          borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.high }}>{wizard.title}</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {wizard.department && (
              <span style={{ fontSize: 12, color: t.mid }}>
                <span style={{ color: t.lo }}>Dept: </span>{wizard.department}
              </span>
            )}
            {wizard.location && (
              <span style={{ fontSize: 12, color: t.mid }}>
                <span style={{ color: t.lo }}>Location: </span>{wizard.location}
              </span>
            )}
            <span style={{ fontSize: 12, color: t.mid }}>
              <span style={{ color: t.lo }}>Type: </span>
              <span style={{ textTransform: 'capitalize' }}>{wizard.type.replace('-', ' ')}</span>
            </span>
          </div>
          {wizard.description && (
            <div style={{
              fontSize: 12.5, color: t.mid, lineHeight: 1.5,
              maxHeight: 80, overflow: 'hidden',
              borderTop: `1px solid ${t.line}`, paddingTop: 10, marginTop: 2,
            }}>
              {(() => {
                const text = extractPreviewText(wizard.description)
                return text.length > 300 ? text.slice(0, 300) + '…' : text || '(empty description)'
              })()}
            </div>
          )}
        </div>

        {/* Publish toggle */}
        <div>
          <FieldLabel label="Publication Status" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { value: true, label: 'Publish Now', sub: 'Listing goes live immediately', color: t.jade },
              { value: false, label: 'Save as Draft', sub: 'Hidden from the careers page', color: t.gold },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => setWizardField('publish', opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  background: wizard.publish === opt.value ? opt.color + '15' : 'transparent',
                  border: `1px solid ${wizard.publish === opt.value ? opt.color + '60' : t.lineStr}`,
                  borderRadius: 9, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  transition: 'all 0.12s',
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${wizard.publish === opt.value ? opt.color : t.lo}`,
                  background: wizard.publish === opt.value ? opt.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.12s',
                }}>
                  {wizard.publish === opt.value && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: wizard.publish === opt.value ? t.high : t.mid }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: t.lo, marginTop: 1 }}>{opt.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {submitError && (
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            background: t.red + '18', border: `1px solid ${t.red}40`,
            color: t.red, fontSize: 13,
          }}>
            {submitError}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
          <WizardBtn label="← Back" onClick={() => setWizardField('step', 2)} outline />
          <WizardBtn
            label={submitting ? 'Creating…' : 'Create Job'}
            onClick={handleSubmit}
            disabled={submitting || !wizard.title.trim()}
            color={t.jade}
          />
        </div>
      </div>
    )
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: '100vh',
      background: t.bg,
      color: t.high,
      fontFamily: 'system-ui,-apple-system,sans-serif',
      padding: '36px 44px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: t.high, margin: 0, letterSpacing: '-0.02em' }}>
          Job Manager
        </h1>
        <p style={{ color: t.mid, fontSize: 13.5, margin: '5px 0 0' }}>
          Manage job listings and review applications
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: 28,
        alignItems: 'start',
      }}>

        {/* ── LEFT: Job list + Applications ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Job Listings */}
          <div style={{
            background: t.surface, border: `1px solid ${t.lineStr}`,
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 22px', borderBottom: `1px solid ${t.line}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.high }}>Job Listings</span>
                {!loading && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '2px 9px', borderRadius: 20,
                    background: t.violet + '1A', color: t.violet,
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {jobs.length}
                  </span>
                )}
              </div>
              <a
                href="/admin/collections/jobs"
                style={{ fontSize: 12.5, color: t.violet, textDecoration: 'none', fontWeight: 500 }}
              >
                View All in Payload →
              </a>
            </div>

            {loading && (
              <div>
                {[0, 1, 2].map(i => <PlaceholderRow key={i} last={i === 2} />)}
              </div>
            )}

            {error && (
              <div style={{ padding: '20px 22px', color: t.red, fontSize: 13.5 }}>
                {error}
              </div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div style={{
                padding: '48px 22px', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              }}>
                <svg width="40" height="40" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <rect x="3" y="9" width="20" height="14" rx="2" stroke={t.lo} strokeWidth="1.8"/>
                  <path d="M9 9V7C9 5.343 10.343 4 12 4H14C15.657 4 17 5.343 17 7V9" stroke={t.lo} strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="3" y1="15" x2="23" y2="15" stroke={t.lo} strokeWidth="1.2"/>
                </svg>
                <span style={{ color: t.lo, fontSize: 14 }}>No job listings yet. Use the wizard →</span>
              </div>
            )}

            {!loading && !error && jobs.map((job, i) => (
              <JobRow key={job.id} job={job} last={i === jobs.length - 1} />
            ))}
          </div>

          {/* Recent Applications */}
          <div style={{
            background: t.surface, border: `1px solid ${t.lineStr}`,
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 22px', borderBottom: `1px solid ${t.line}`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.high }}>Recent Applications</span>
              <a
                href="/admin/collections/job-applications"
                style={{ fontSize: 12.5, color: t.violet, textDecoration: 'none', fontWeight: 500 }}
              >
                View All Applications →
              </a>
            </div>

            {loading && (
              <div>
                {[0, 1, 2].map(i => <PlaceholderRow key={i} last={i === 2} />)}
              </div>
            )}

            {!loading && !error && apps.length === 0 && (
              <div style={{ padding: '32px 22px', textAlign: 'center', color: t.lo, fontSize: 13.5 }}>
                No applications yet.
              </div>
            )}

            {!loading && !error && apps.map((app, i) => (
              <AppRow key={app.id} app={app} last={i === apps.length - 1} />
            ))}
          </div>
        </div>

        {/* ── RIGHT: Create Job Wizard ── */}
        <div style={{
          background: t.surface, border: `1px solid ${t.lineStr}`,
          borderRadius: 14, padding: '24px 22px',
          position: 'sticky', top: 24,
        }}>
          <div style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: t.high, margin: '0 0 4px' }}>
              Create Job Listing
            </h2>
            <p style={{ fontSize: 12, color: t.lo, margin: 0 }}>
              Step-by-step wizard
            </p>
          </div>

          {!createdId && <WizardStepIndicator step={wizard.step} />}

          {renderWizardBody()}
        </div>
      </div>
    </div>
  )
}

// ── Job Row ───────────────────────────────────────────────────────────────────

function JobRow({ job, last }: { job: Job; last: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px',
        borderBottom: last ? 'none' : `1px solid ${t.line}`,
        background: hov ? t.cardHov : 'transparent', transition: 'background 0.1s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: t.high, fontWeight: 500, lineHeight: 1.3 }}>
          {job.title}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
          {job.department && (
            <span style={{ fontSize: 11.5, color: t.lo }}>{job.department}</span>
          )}
          {job.location && (
            <span style={{ fontSize: 11.5, color: t.lo }}>· {job.location}</span>
          )}
          {job.type && (
            <span style={{ fontSize: 11.5, color: t.lo, textTransform: 'capitalize' }}>
              · {job.type.replace('-', ' ')}
            </span>
          )}
          <span style={{ fontSize: 11.5, color: t.lo }}>· Posted {formatDate(job.postedAt)}</span>
        </div>
      </div>
      <StatusBadge status={job.status} type="job" />
      <a
        href={`/admin/collections/jobs/${job.id}`}
        style={{
          padding: '5px 12px', borderRadius: 7,
          background: hov ? t.card : 'transparent',
          border: `1px solid ${hov ? t.lineStr : 'transparent'}`,
          color: hov ? t.high : t.mid,
          fontSize: 12, fontWeight: 500, textDecoration: 'none',
          transition: 'all 0.1s', flexShrink: 0,
        }}
      >
        Edit
      </a>
      <a
        href="/admin/collections/job-applications"
        style={{
          padding: '5px 12px', borderRadius: 7,
          background: hov ? t.card : 'transparent',
          border: `1px solid ${hov ? t.lineStr : 'transparent'}`,
          color: hov ? t.jade : t.lo,
          fontSize: 12, fontWeight: 500, textDecoration: 'none',
          transition: 'all 0.1s', flexShrink: 0,
        }}
        title="View applications"
      >
        Applications
      </a>
    </div>
  )
}

// ── App Row ───────────────────────────────────────────────────────────────────

function AppRow({ app, last }: { app: JobApplication; last: boolean }) {
  const [hov, setHov] = useState(false)
  const jobTitle = typeof app.job === 'object' && app.job !== null ? app.job.title : '—'
  return (
    <a
      href={`/admin/collections/job-applications/${app.id}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px',
        borderBottom: last ? 'none' : `1px solid ${t.line}`,
        background: hov ? t.cardHov : 'transparent', transition: 'background 0.1s',
        textDecoration: 'none',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: t.high, fontWeight: 500 }}>
          {app.applicantName}
        </div>
        <div style={{ fontSize: 11.5, color: t.lo, marginTop: 2 }}>
          {jobTitle} · {formatDate(app.submittedAt)}
        </div>
      </div>
      <StatusBadge status={app.status} type="app" />
    </a>
  )
}

// ── Description Editor (TipTap rich text) ─────────────────────────────────────

function DescriptionEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        style: [
          'min-height: 200px',
          'outline: none',
          'padding: 10px 12px',
          'font-size: 13.5px',
          'line-height: 1.7',
          'color: #ECECF2',
          'font-family: inherit',
        ].join(';'),
      },
    },
  })

  const [focused, setFocused] = useState(false)

  const toolbarBtn = (
    label: string,
    active: boolean,
    onClick: () => void,
    title?: string,
  ) => (
    <button
      type="button"
      title={title ?? label}
      onClick={onClick}
      style={{
        height: 28, minWidth: 28, padding: '0 6px',
        background: active ? '#2A2A40' : 'transparent',
        border: active ? '1px solid #6366F1' : '1px solid transparent',
        borderRadius: 5,
        color: active ? '#ECECF2' : '#8484A0',
        fontSize: 12, fontWeight: active ? 700 : 500,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.1s',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </button>
  )

  return (
    <div
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        background: '#141420',
        border: `1px solid ${focused ? '#6366F1' : '#252535'}`,
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'border-color 0.12s',
      }}
    >
      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 3,
        padding: '7px 10px',
        borderBottom: '1px solid #1C1C2C',
        background: '#191926',
      }}>
        {toolbarBtn('B', editor?.isActive('bold') ?? false,
          () => editor?.chain().focus().toggleBold().run(),
          'Bold'
        )}
        {toolbarBtn('I', editor?.isActive('italic') ?? false,
          () => editor?.chain().focus().toggleItalic().run(),
          'Italic'
        )}
        <div style={{ width: 1, background: '#252535', margin: '2px 3px', alignSelf: 'stretch' }} />
        {toolbarBtn('H2', editor?.isActive('heading', { level: 2 }) ?? false,
          () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          'Heading 2'
        )}
        {toolbarBtn('H3', editor?.isActive('heading', { level: 3 }) ?? false,
          () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
          'Heading 3'
        )}
        <div style={{ width: 1, background: '#252535', margin: '2px 3px', alignSelf: 'stretch' }} />
        {toolbarBtn('• List', editor?.isActive('bulletList') ?? false,
          () => editor?.chain().focus().toggleBulletList().run(),
          'Bullet List'
        )}
        {toolbarBtn('1. List', editor?.isActive('orderedList') ?? false,
          () => editor?.chain().focus().toggleOrderedList().run(),
          'Ordered List'
        )}
      </div>

      {/* Editor area */}
      <style>{`
        .kawai-job-editor h2 { font-size: 15px; font-weight: 700; color: #ECECF2; margin: 12px 0 6px; }
        .kawai-job-editor h3 { font-size: 13.5px; font-weight: 600; color: #ECECF2; margin: 10px 0 4px; }
        .kawai-job-editor ul { list-style: disc; padding-left: 18px; margin: 6px 0; }
        .kawai-job-editor ol { list-style: decimal; padding-left: 18px; margin: 6px 0; }
        .kawai-job-editor li { margin: 3px 0; color: #ECECF2; font-size: 13.5px; }
        .kawai-job-editor p { margin: 4px 0; }
        .kawai-job-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #4C4C68; pointer-events: none; float: left; height: 0;
        }
        .kawai-job-editor strong { color: #ECECF2; }
        .kawai-job-editor em { color: #ECECF2; }
      `}</style>
      <div className="kawai-job-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
