import type { CSSProperties } from 'react'
import { DISPLAY, SCRIPT } from './tokens'
import type { SaleLockup } from './types'

/**
 * The holiday headline lockup from the comps: black heavy display serif for
 * the setup words and one large Kawai red script word.
 *
 * Every size is in `em` off one wrapper `fontSize`, so a lockup scales as a
 * unit and the overlaps (the script's flourishes running under the next
 * line, the script's capital crossing into "gets") hold at every width.
 *
 * Words render as text nodes joined by spaces inside one heading, so the
 * accessible name is the plain sentence ("Make the first note a Holiday
 * memory"). The script sits beneath the serif words in paint order, as in the
 * comp, where "memory" is laid over the Holiday flourishes.
 */

type Size = 'display' | 'hero' | 'xl' | 'lg' | 'md'

/** Base size per use. Lines are fractions of it. */
const BASE: Record<Size, string> = {
  // The cinematic close (kawai-holiday-close-redesign v1): the page's largest type.
  display: 'clamp(3.6rem, 11vw, 7.6rem)',
  hero: 'clamp(3.1rem, 7.4vw, 6.6rem)',
  xl: 'clamp(2.6rem, 5.6vw, 5rem)',
  lg: 'clamp(2.3rem, 4.6vw, 4.1rem)',
  md: 'clamp(2rem, 3.6vw, 3.2rem)',
}

const serif: CSSProperties = { fontFamily: DISPLAY, fontWeight: 900, letterSpacing: '-0.012em' }
const script: CSSProperties = { fontFamily: SCRIPT, fontWeight: 400 }

/**
 * `light` (default): black serif + Kawai red script, for the white field.
 * `dark`: white serif + `kawai-red-400` script, for type set over a scrimmed
 * photograph (brand red is only ~3.6:1 on kawai-black; red-400 clears 3:1
 * for large text on the scrim). The default output is unchanged.
 */
type Tone = 'light' | 'dark'
const INK: Record<Tone, string> = { light: 'text-kawai-black', dark: 'text-white' }
const RED: Record<Tone, string> = { light: 'text-kawai-red', dark: 'text-kawai-red-400' }

export function Lockup({
  lockup,
  as: Tag = 'h2',
  id,
  size = 'md',
  align = 'center',
  tone = 'light',
  className = '',
}: {
  lockup: SaleLockup
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  size?: Size
  align?: 'center' | 'start'
  tone?: Tone
  className?: string
}) {
  const ink = INK[tone]
  const red = RED[tone]
  const centred = align === 'center'
  const { kicker, lead, script: word, tail, layout } = lockup

  const kickerEl = kicker ? (
    <span
      className={`relative z-10 block ${ink}`}
      style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '0.3em', lineHeight: 1.2, letterSpacing: '-0.005em' }}
    >
      {kicker}
    </span>
  ) : null

  if (layout === 'inline') {
    return (
      <Tag
        id={id}
        className={`${ink} ${centred ? 'text-center' : 'text-left'} ${className}`}
        style={{ fontSize: BASE[size], lineHeight: 1 }}
      >
        {kickerEl}
        {kicker ? ' ' : null}
        <span className={`flex flex-wrap items-baseline ${centred ? 'justify-center' : ''}`}>
          {lead ? (
            <>
              <span className="relative z-10" style={{ ...serif, fontSize: '0.62em', lineHeight: 1.05 }}>
                {lead}
              </span>{' '}
            </>
          ) : null}
          <span
            className={`relative z-0 -ml-[0.18em] inline-block translate-y-[0.16em] whitespace-nowrap pr-[0.12em] ${red}`}
            style={{ ...script, fontSize: '1.32em', lineHeight: 0.8 }}
          >
            {word}
          </span>
        </span>
      </Tag>
    )
  }

  // stack
  return (
    <Tag
      id={id}
      className={`flex flex-col ${ink} ${centred ? 'items-center text-center' : 'items-start text-left'} ${className}`}
      style={{ fontSize: BASE[size], lineHeight: 1 }}
    >
      {kickerEl}
      {kicker ? ' ' : null}
      {lead ? (
        <>
          <span className="relative z-10 block" style={{ ...serif, fontSize: '0.48em', lineHeight: 1.1 }}>
            {lead}
          </span>{' '}
        </>
      ) : null}
      <span
        className={`relative z-0 block whitespace-nowrap px-[0.12em] ${red}`}
        style={{
          ...script,
          fontSize: '1.42em',
          lineHeight: 0.92,
          // Pull the flourishes up under the lead and down under the tail.
          marginTop: lead ? '0.05em' : kicker ? '0.12em' : 0,
          marginBottom: tail ? '-0.2em' : 0,
        }}
      >
        {word}
      </span>
      {tail ? (
        <>
          {' '}
          <span className="relative z-10 block" style={{ ...serif, fontSize: '0.6em', lineHeight: 1 }}>
            {tail}
          </span>
        </>
      ) : null}
    </Tag>
  )
}

/** The lockup as one plain sentence, for titles and alt-free contexts. */
export function lockupText(lockup: SaleLockup): string {
  return [lockup.kicker, lockup.lead, lockup.script, lockup.tail].filter(Boolean).join(' ')
}
