import { Reveal } from './Choreography'

/**
 * The practice-paper ground shared by every section on this page: horizontal
 * rules on a 34px rhythm plus the red margin rule down the left.
 *
 * The margin rule is positioned inside a mirror of the content container rather
 * than against the viewport. Pinned to the viewport it lands at a fixed offset
 * while the content sits in a centered max-width column, so on narrow screens
 * the rule crosses through the text instead of sitting in the gutter beside it.
 *
 * In the bolder pass the margin rule is 2px and inks itself in as the section
 * arrives — the page's one repeated gesture, at section scale.
 */

/**
 * The single content column every section on this page uses. Exported so the
 * ruled ground and the sections can never drift out of alignment.
 */
export const BTS_CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16'

interface RuledGroundProps {
  /** 'light' rules dark-on-pearl; 'dark' rules pearl-on-black. */
  tone?: 'light' | 'dark'
  /** Set false for sections that shouldn't carry the red margin rule. */
  marginRule?: boolean
  /** Draw the margin rule on scroll instead of having it already there. */
  animate?: boolean
}

export function RuledGround({ tone = 'light', marginRule = true, animate = false }: RuledGroundProps) {
  const line = tone === 'dark' ? 'rgba(250,248,245,0.05)' : 'rgba(30,27,22,0.06)'
  const rule = `absolute inset-y-0 left-1 sm:left-4 lg:left-7 w-[2px] ${
    tone === 'dark' ? 'bg-kawai-red/55' : 'bg-kawai-red/35'
  }`

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 33px, ${line} 33px, ${line} 34px)`,
        }}
      />
      {marginRule && (
        <div className={`relative h-full ${BTS_CONTAINER}`}>
          {animate ? <Reveal variant="ruleY" className={rule} /> : <div className={rule} />}
        </div>
      )}
    </div>
  )
}
