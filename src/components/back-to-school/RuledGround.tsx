/**
 * The practice-paper ground shared by every section on this page: horizontal
 * rules on a 34px rhythm plus a single red margin rule down the left.
 *
 * The margin rule is positioned inside a mirror of the content container rather
 * than against the viewport. Pinned to the viewport it lands at a fixed offset
 * while the content sits in a centered max-width column, so on narrow screens
 * the rule crosses through the text instead of sitting in the gutter beside it.
 */

interface RuledGroundProps {
  /** 'light' rules dark-on-pearl; 'dark' rules pearl-on-black. */
  tone?: 'light' | 'dark'
  /** Set false for sections that shouldn't carry the red margin rule. */
  marginRule?: boolean
}

export function RuledGround({ tone = 'light', marginRule = true }: RuledGroundProps) {
  const line = tone === 'dark' ? 'rgba(250,248,245,0.045)' : 'rgba(30,27,22,0.055)'

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 33px, ${line} 33px, ${line} 34px)`,
        }}
      />
      {marginRule && (
        <div className="relative h-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <div
            className={`absolute inset-y-0 left-2 sm:left-6 lg:left-8 w-px ${
              tone === 'dark' ? 'bg-kawai-red/40' : 'bg-kawai-red/25'
            }`}
          />
        </div>
      )}
    </div>
  )
}
