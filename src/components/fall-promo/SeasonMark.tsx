/**
 * The Season Mark — Variation A's identifying device.
 *
 * A circle with one quarter filled in Ember, for the last stretch of the year.
 *
 * Two brand rules are enforced by this component's shape rather than left to
 * the caller. It renders as a block, so it can only ever sit ABOVE a headline
 * and never beside one; and it carries its own bottom margin equal to its own
 * height, which is the clear space the guidelines specify on every side. A
 * caller that needs it tighter is a caller that is breaking the guideline.
 *
 * Decorative: the headline underneath says everything the mark says, so it is
 * hidden from assistive technology rather than given an invented label.
 */
export function SeasonMark({ size = 40 }: { size?: number }) {
  return (
    <div style={{ marginBottom: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        focusable="false"
        style={{ display: 'block' }}
      >
        {/* The ring takes the surrounding text colour so the mark works on
            Ivory and on a Parchment mat without a second variant. */}
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
        {/* One quarter, filled. Top-right, per the guideline lockup. */}
        <path d="M16 1 A15 15 0 0 1 31 16 L16 16 Z" fill="var(--ember)" />
      </svg>
    </div>
  )
}
