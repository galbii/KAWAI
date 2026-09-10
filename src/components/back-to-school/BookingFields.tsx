'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { OSWALD } from './campaign'
import { CAMPAIGN_YEAR, CAMPAIGN_MONTH } from './campaign'
import { isBookableDate, formatLongDate, type HoursEntry } from './schedule'

/**
 * The drawn parts of the booking form, shared by the two-step modal on
 * /back-to-school and the one-screen form on /back-to-school2.
 *
 * Everything here is square, flat and on white — the same panel language the
 * rebate ledger and the showroom card are drawn in, so a form dropped into the
 * middle of the page reads as another sheet on the ruled ground rather than a
 * widget sitting on top of it.
 */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-5 h-px bg-kawai-red" aria-hidden />
      <span
        className="text-kawai-red uppercase"
        style={{ fontFamily: OSWALD, fontSize: '0.62rem', letterSpacing: '0.24em' }}
      >
        {children}
      </span>
    </div>
  )
}

export function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  error?: string | undefined
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label
        htmlFor={htmlFor}
        className="text-kawai-charcoal/60 uppercase select-none"
        style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.2em' }}
      >
        {label}
        {required && <span className="text-kawai-red ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-kawai-red text-xs">{error}</p>}
    </div>
  )
}

export function Input({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        // Square, flat, and on white — the same panel language the ledger and
        // the showroom card are drawn in. 16px on mobile so iOS doesn't zoom.
        'w-full px-4 py-3.5 text-[16px] sm:text-sm text-kawai-black bg-white border outline-none transition-colors duration-200',
        'placeholder:text-kawai-charcoal/35',
        error
          ? 'border-kawai-red ring-2 ring-kawai-red/15'
          : 'border-kawai-black/15 hover:border-kawai-black/35 focus:border-kawai-red focus:ring-2 focus:ring-kawai-red/15',
      )}
    />
  )
}

export const primaryButton =
  'group w-full inline-flex items-center justify-center gap-3 px-6 py-5 bg-kawai-red hover:bg-kawai-red-600 disabled:opacity-50 disabled:hover:bg-kawai-red text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black'

export const secondaryButton =
  'px-6 py-5 border border-kawai-black/25 hover:bg-kawai-black hover:text-kawai-pearl text-kawai-black text-sm tracking-[0.14em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black'

// ─── Calendar ─────────────────────────────────────────────────────────────────

const WEEKDAY_HEADER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

export function SeptemberPicker({
  hours,
  selected,
  onSelect,
}: {
  hours: HoursEntry[] | null | undefined
  selected: Date | null
  onSelect: (d: Date) => void
}) {
  // `now` is fixed per mount so the grid doesn't shift mid-interaction.
  const now = useMemo(() => new Date(), [])
  const firstWeekday = new Date(CAMPAIGN_YEAR, CAMPAIGN_MONTH - 1, 1).getDay()
  const daysInMonth = 30

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span
          className="text-kawai-black uppercase"
          style={{ fontFamily: OSWALD, fontSize: '1.35rem', fontWeight: 600, letterSpacing: '0.01em' }}
        >
          September 2026
        </span>
        <span
          className="text-kawai-red uppercase"
          style={{ fontFamily: OSWALD, fontSize: '0.64rem', letterSpacing: '0.18em' }}
        >
          Sept 7 – 30
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1" aria-hidden>
        {WEEKDAY_HEADER.map((d, i) => (
          <span
            key={i}
            className="text-center text-kawai-charcoal/45 py-1.5"
            style={{ fontFamily: OSWALD, fontSize: '0.66rem', letterSpacing: '0.12em' }}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const date = new Date(CAMPAIGN_YEAR, CAMPAIGN_MONTH - 1, day)
          const bookable = isBookableDate(hours, date, now)
          const isSelected = selected?.getDate() === day
          return (
            <button
              key={day}
              type="button"
              disabled={!bookable}
              onClick={() => onSelect(date)}
              aria-label={`${formatLongDate(date)}${bookable ? '' : ' — unavailable'}`}
              aria-pressed={isSelected}
              // Square cells on white: the calendar reads as a grid on the
              // page's paper rather than a row of pills.
              style={{ fontFamily: OSWALD, fontSize: '0.95rem' }}
              className={cn(
                'aspect-square flex items-center justify-center border transition-colors',
                bookable
                  ? isSelected
                    ? 'bg-kawai-red border-kawai-red text-white font-semibold'
                    : 'bg-white border-kawai-black/12 text-kawai-black hover:border-kawai-red hover:text-kawai-red'
                  : 'border-transparent text-kawai-charcoal/25 cursor-default',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** The time-slot grid under the calendar, once a day is chosen. */
export function SlotGrid({
  slots,
  selected,
  onSelect,
}: {
  slots: string[]
  selected: string | null
  onSelect: (slot: string) => void
}) {
  if (slots.length === 0) {
    return (
      <p className="text-kawai-charcoal/55 text-sm">The showroom is closed that day — pick another.</p>
    )
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSelect(slot)}
          aria-pressed={selected === slot}
          style={{ fontFamily: OSWALD, letterSpacing: '0.06em' }}
          className={cn(
            'py-3 text-[0.8rem] border transition-colors',
            selected === slot
              ? 'bg-kawai-red border-kawai-red text-white font-semibold'
              : 'bg-white border-kawai-black/15 text-kawai-black hover:border-kawai-red hover:text-kawai-red',
          )}
        >
          {slot}
        </button>
      ))}
    </div>
  )
}
