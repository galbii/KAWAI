'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ── Design tokens ─────────────────────────────────────────────────────────────
const t = {
  bg:      '#0D0D14',
  surface: '#141420',
  card:    '#191926',
  cardHov: '#1E1E2C',
  line:    '#1C1C2C',
  lineStr: '#252535',
  high:    '#ECECF2',
  mid:     '#8484A0',
  lo:      '#4C4C68',
  violet:  '#6366F1',
  jade:    '#2EC4A0',
  gold:    '#E8A84E',
  red:     '#C41E3A',
}

export { t }

// ── ModalShell ────────────────────────────────────────────────────────────────

interface ModalShellProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  width?: number
}

export function ModalShell({ isOpen, onClose, title, subtitle, children, width }: ModalShellProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  if (!mounted || !isOpen) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100000,
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#0E0E14',
          border: `1px solid ${t.lineStr}`,
          borderRadius: 16,
          width: `min(${width ?? 560}px, 94vw)`,
          maxHeight: '90vh',
          overflow: 'hidden',
          zIndex: 100001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 96px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '22px 28px 20px',
            borderBottom: `1px solid ${t.line}`,
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.high, lineHeight: 1.3 }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 12, color: t.mid, marginTop: 4 }}>
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: t.mid,
              cursor: 'pointer',
              fontSize: 20,
              lineHeight: 1,
              padding: '2px 4px',
              marginLeft: 16,
              flexShrink: 0,
              fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div
          style={{
            overflowY: 'auto',
            padding: 28,
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  )
}

// ── FormSection ───────────────────────────────────────────────────────────────

interface FormSectionProps {
  title?: string
  children: React.ReactNode
  collapsible?: boolean
}

export function FormSection({ title, children, collapsible }: FormSectionProps) {
  const [open, setOpen] = useState(true)

  if (!title) {
    return <div style={{ marginBottom: 20 }}>{children}</div>
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: open ? 16 : 0,
          paddingBottom: open ? 0 : 0,
        }}
      >
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen(p => !p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: t.lo,
              fontFamily: 'inherit',
            }}
          >
            <div style={{ flex: 1, height: 1, background: t.line, width: 20 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.lo }}>
              {title}
            </span>
            <div style={{ flex: 1, height: 1, background: t.line, minWidth: 40 }} />
            <span style={{ fontSize: 10, color: t.lo, userSelect: 'none' }}>{open ? '▲' : '▼'}</span>
          </button>
        ) : (
          <>
            <div style={{ height: 1, background: t.line, width: 12, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.lo, whiteSpace: 'nowrap' }}>
              {title}
            </span>
            <div style={{ flex: 1, height: 1, background: t.line }} />
          </>
        )}
      </div>
      {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>}
    </div>
  )
}

// ── Field ─────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: t.mid,
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: t.red, marginLeft: 4 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <div style={{ fontSize: 11, color: t.lo, marginTop: 4 }}>{hint}</div>
      )}
      {error && (
        <div style={{ fontSize: 11, color: t.red, marginTop: 4 }}>{error}</div>
      )}
    </div>
  )
}

// ── TextInput ─────────────────────────────────────────────────────────────────

interface TextInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  maxLength?: number
  autoFocus?: boolean
  type?: string
}

export function TextInput({ value, onChange, placeholder, required, maxLength, autoFocus, type = 'text' }: TextInputProps) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      autoFocus={autoFocus}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: 'block',
        width: '100%',
        height: 40,
        background: t.surface,
        border: `1px solid ${focused ? t.violet : t.lineStr}`,
        borderRadius: 8,
        color: t.high,
        fontSize: 14,
        padding: '0 12px',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        transition: 'border-color 0.12s',
      }}
    />
  )
}

// ── TextareaInput ─────────────────────────────────────────────────────────────

interface TextareaInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  monospace?: boolean
}

export function TextareaInput({ value, onChange, placeholder, rows = 4, maxLength, monospace }: TextareaInputProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: 'block',
          width: '100%',
          background: t.surface,
          border: `1px solid ${focused ? t.violet : t.lineStr}`,
          borderRadius: 8,
          color: t.high,
          fontSize: 14,
          padding: '10px 12px',
          outline: 'none',
          fontFamily: monospace ? 'ui-monospace, monospace' : 'inherit',
          boxSizing: 'border-box',
          resize: 'vertical',
          lineHeight: 1.5,
          transition: 'border-color 0.12s',
        }}
      />
      {maxLength !== undefined && (
        <div
          style={{
            textAlign: 'right',
            fontSize: 11,
            color: t.lo,
            marginTop: 3,
          }}
        >
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  )
}

// ── SelectInput ───────────────────────────────────────────────────────────────

interface SelectOption {
  label: string
  value: string
}

interface SelectInputProps {
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
  placeholder?: string
}

export function SelectInput({ value, onChange, options, placeholder }: SelectInputProps) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: 'block',
        width: '100%',
        height: 40,
        background: t.surface,
        border: `1px solid ${focused ? t.violet : t.lineStr}`,
        borderRadius: 8,
        color: value ? t.high : t.mid,
        fontSize: 14,
        padding: '0 12px',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'border-color 0.12s',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 8L10 13L15 8' stroke='%238484A0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: 36,
      }}
    >
      {placeholder && (
        <option value="" style={{ background: t.card, color: t.mid }}>
          {placeholder}
        </option>
      )}
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: t.card, color: t.high }}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

// ── MultiCheckbox ─────────────────────────────────────────────────────────────

interface CheckboxOption {
  label: string
  value: string
  color?: string
}

interface MultiCheckboxProps {
  value: string[]
  onChange: (v: string[]) => void
  options: CheckboxOption[]
}

export function MultiCheckbox({ value, onChange, options }: MultiCheckboxProps) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter(x => x !== v))
    } else {
      onChange([...value, v])
    }
  }

  return (
    <div
      style={{
        maxHeight: 180,
        overflowY: 'auto',
        background: t.surface,
        border: `1px solid ${t.lineStr}`,
        borderRadius: 8,
      }}
    >
      {options.map((opt, i) => {
        const checked = value.includes(opt.value)
        const accent = opt.color ?? t.violet
        return (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              cursor: 'pointer',
              borderBottom: i < options.length - 1 ? `1px solid ${t.line}` : 'none',
              background: checked ? `${accent}10` : 'transparent',
              transition: 'background 0.1s',
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(opt.value)}
              style={{ accentColor: accent, width: 14, height: 14, flexShrink: 0, cursor: 'pointer' }}
            />
            {opt.color && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: opt.color,
                  flexShrink: 0,
                }}
              />
            )}
            <span style={{ fontSize: 13.5, color: checked ? t.high : t.mid, transition: 'color 0.1s' }}>
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? t.jade : t.lineStr,
          flexShrink: 0,
          transition: 'background 0.18s',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.18s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}
        />
      </div>
      <span style={{ fontSize: 14, color: checked ? t.high : t.mid, transition: 'color 0.18s' }}>
        {label}
      </span>
    </label>
  )
}

// ── ColorSwatches ─────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  '#6366F1',
  '#2EC4A0',
  '#E8A84E',
  '#EC4899',
  '#22C55E',
  '#F97316',
  '#06B6D4',
  '#EF4444',
]

interface ColorSwatchesProps {
  value: string
  onChange: (v: string) => void
}

export function ColorSwatches({ value, onChange }: ColorSwatchesProps) {
  const [customInput, setCustomInput] = useState(() =>
    PRESET_COLORS.includes(value) ? '' : value,
  )

  const handlePreset = (color: string) => {
    setCustomInput('')
    onChange(color)
  }

  const handleCustom = (raw: string) => {
    setCustomInput(raw)
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) {
      onChange(raw)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {PRESET_COLORS.map(color => {
          const selected = value === color
          return (
            <button
              key={color}
              type="button"
              onClick={() => handlePreset(color)}
              title={color}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: color,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                outline: selected ? `2px solid #fff` : 'none',
                outlineOffset: 2,
                boxShadow: selected ? `0 0 0 4px ${color}40` : 'none',
                transition: 'outline 0.1s, box-shadow 0.1s',
                flexShrink: 0,
              }}
            />
          )
        })}
      </div>
      <TextInput
        value={customInput}
        onChange={handleCustom}
        placeholder="#hex color (e.g. #A855F7)"
      />
    </div>
  )
}

// ── FormActions ───────────────────────────────────────────────────────────────

interface SecondaryAction {
  label: string
  href: string
}

interface FormActionsProps {
  onCancel: () => void
  onSubmit: () => void
  loading: boolean
  submitLabel?: string | undefined
  secondaryAction?: SecondaryAction | undefined
}

export function FormActions({ onCancel, onSubmit, loading, submitLabel = 'Save', secondaryAction }: FormActionsProps) {
  const [cancelHov, setCancelHov] = useState(false)
  const [submitHov, setSubmitHov] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 28px',
        borderTop: `1px solid ${t.lineStr}`,
        flexShrink: 0,
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          onClick={onCancel}
          onMouseEnter={() => setCancelHov(true)}
          onMouseLeave={() => setCancelHov(false)}
          style={{
            height: 38,
            padding: '0 18px',
            borderRadius: 9,
            background: 'transparent',
            border: `1px solid ${cancelHov ? t.lineStr : t.line}`,
            color: cancelHov ? t.high : t.mid,
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: 'inherit',
            transition: 'all 0.12s',
          }}
        >
          Cancel
        </button>
        {secondaryAction && (
          <a
            href={secondaryAction.href}
            style={{
              fontSize: 13,
              color: t.mid,
              textDecoration: 'none',
            }}
          >
            {secondaryAction.label}
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        onMouseEnter={() => setSubmitHov(true)}
        onMouseLeave={() => setSubmitHov(false)}
        style={{
          height: 38,
          padding: '0 22px',
          borderRadius: 9,
          background: loading ? `${t.violet}88` : submitHov ? '#5558E0' : t.violet,
          border: 'none',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: loading ? 0.7 : 1,
          transition: 'background 0.12s, opacity 0.12s',
        }}
      >
        {loading && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: 'spin 0.8s linear infinite' }}
          >
            <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
            <path d="M12 3C7.03 3 3 7.03 3 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </svg>
        )}
        {loading ? 'Saving…' : submitLabel}
      </button>
    </div>
  )
}

// ── API helpers ───────────────────────────────────────────────────────────────

export async function apiPost(
  path: string,
  data: unknown,
): Promise<{ doc?: { id: string }; errors?: unknown[] }> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return res.json() as Promise<{ doc?: { id: string }; errors?: unknown[] }>
}

export async function apiPatch(
  path: string,
  id: string,
  data: unknown,
): Promise<{ doc?: { id: string }; errors?: unknown[] }> {
  const res = await fetch(`${path}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return res.json() as Promise<{ doc?: { id: string }; errors?: unknown[] }>
}
