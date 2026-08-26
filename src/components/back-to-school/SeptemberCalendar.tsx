'use client'

import { useEffect, useState } from 'react'
import {
  CAMPAIGN_MONTH,
  CAMPAIGN_YEAR,
  DEADLINE_SHORT,
  WINDOW_END_DAY,
  WINDOW_START_DAY,
  daysUntilDeadline,
} from './campaign'

/**
 * The campaign's signature element: September 2026 as an actual calendar, with
 * the sale window inked red and the rebate deadline circled by hand.
 *
 * The grid is static (September 2026 never changes), so it renders identically
 * on the server and the client. Only the "today" ring and the days-remaining
 * count depend on the current date — both are gated behind a `mounted` flag so
 * the ISR'd HTML and the first client render agree. See the hydration note in
 * CLAUDE.md.
 */

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

/** September 1, 2026 is a Tuesday — two blank cells lead the Sunday-first grid. */
const LEADING_BLANKS = 2
const DAYS_IN_MONTH = 30

/** Sunday-first grid cells: nulls pad the first and last weeks. */
const CELLS: Array<number | null> = [
  ...Array.from({ length: LEADING_BLANKS }, () => null),
  ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
]
while (CELLS.length % 7 !== 0) CELLS.push(null)

function inWindow(day: number): boolean {
  return day >= WINDOW_START_DAY && day <= WINDOW_END_DAY
}

/**
 * A deliberately imperfect ellipse — drawn as a cubic path rather than <ellipse>
 * so it reads as pen on paper, and overshoots itself at the end the way a hand
 * does. Strokes itself on once via dashoffset.
 */
function HandCircle() {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      className="bts-circle absolute -inset-[7px] w-[calc(100%+14px)] h-[calc(100%+14px)] pointer-events-none overflow-visible"
      aria-hidden
    >
      <path
        d="M42 11C33 6 18 7 12 16c-6 9-4 26 5 33 9 7 26 6 33-3 6-8 6-24-3-31-5-4-13-6-19-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  )
}

export function SeptemberCalendar() {
  const [mounted, setMounted] = useState(false)
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [today, setToday] = useState<number | null>(null)

  useEffect(() => {
    const now = new Date()
    setDaysLeft(daysUntilDeadline(now))
    if (now.getFullYear() === CAMPAIGN_YEAR && now.getMonth() + 1 === CAMPAIGN_MONTH) {
      setToday(now.getDate())
    }
    setMounted(true)
  }, [])

  return (
    <>
      <style>{`
        @keyframes bts-cell-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bts-draw {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        .bts-cell { animation: bts-cell-in 0.4s cubic-bezier(0.22,0.61,0.36,1) both; }
        .bts-circle path {
          stroke-dasharray: 1;
          animation: bts-draw 0.9s cubic-bezier(0.5,0,0.3,1) 1.5s both;
        }
      `}</style>

      <figure className="w-full max-w-[26rem] bg-kawai-black rounded-sm overflow-hidden shadow-[0_24px_64px_rgba(30,27,22,0.28)]">

        {/* Masthead — month as a schedule-board label */}
        <div className="flex items-baseline justify-between px-6 pt-6 pb-5 border-b border-white/10">
          <span
            className="text-kawai-pearl uppercase leading-none"
            style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.6rem',
              letterSpacing: '0.14em',
            }}
          >
            September
          </span>
          <span
            className="text-white/30 leading-none"
            style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '1.6rem', letterSpacing: '0.08em' }}
          >
            {CAMPAIGN_YEAR}
          </span>
        </div>

        {/* Grid */}
        <div className="px-5 pt-5 pb-4">
          <div className="grid grid-cols-7 gap-y-1 mb-2">
            {WEEKDAYS.map((d, i) => (
              <span
                key={i}
                className="text-center text-white/25 text-[0.6rem] tracking-[0.2em] uppercase font-semibold"
                aria-hidden
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {CELLS.map((day, i) => {
              if (day === null) return <span key={i} aria-hidden />

              const active = inWindow(day)
              const isDeadline = day === WINDOW_END_DAY
              const isToday = mounted && today === day

              return (
                <span
                  key={i}
                  className="bts-cell relative flex items-center justify-center aspect-square"
                  style={{ animationDelay: `${0.5 + i * 0.012}s` }}
                >
                  {/* Sale-window ink. The deadline gets the same tint as the rest of
                      the window — a solid red cell under a red pen stroke reads as one
                      blob, and the circle is the thing doing the work here. */}
                  {active && (
                    <span className="absolute inset-x-0.5 inset-y-1 rounded-[2px] bg-kawai-red/15" aria-hidden />
                  )}
                  {/* Today ring — only ever drawn after mount */}
                  {isToday && !isDeadline && (
                    <span className="absolute inset-x-0.5 inset-y-1 rounded-[2px] border border-kawai-pearl/50" aria-hidden />
                  )}

                  <span
                    className={
                      active ? 'relative text-kawai-pearl' : 'relative text-white/20'
                    }
                    style={{
                      fontFamily: 'var(--font-oswald), sans-serif',
                      fontSize: '0.95rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {day}
                  </span>

                  {isDeadline && (
                    <span className="text-kawai-red">
                      <HandCircle />
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </div>

        {/* Legend / countdown strip */}
        <figcaption className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-white/[0.03]">
          <span className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-kawai-red flex-shrink-0" aria-hidden />
            <span className="text-white/45 text-[0.7rem] tracking-[0.12em] uppercase truncate">
              Rebates end {DEADLINE_SHORT}
            </span>
          </span>

          {/* Reserves its own width before mount so the strip doesn't reflow. */}
          <span className="text-right flex-shrink-0" aria-live="polite">
            {mounted && daysLeft !== null && daysLeft > 0 ? (
              <>
                <span
                  className="text-kawai-pearl"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '1.1rem' }}
                >
                  {daysLeft}
                </span>
                <span className="text-white/35 text-[0.7rem] tracking-[0.12em] uppercase ml-1.5">
                  {daysLeft === 1 ? 'day left' : 'days left'}
                </span>
              </>
            ) : (
              <span className="text-white/35 text-[0.7rem] tracking-[0.12em] uppercase">
                Sept 7 – 30
              </span>
            )}
          </span>
        </figcaption>
      </figure>
    </>
  )
}
