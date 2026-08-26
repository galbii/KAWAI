/**
 * The confirmation state, shared by the rail and the popup.
 *
 * This is the one moment in the form worth animating: the badge scales in and
 * the tick draws behind it, so submitting reads as something that completed
 * rather than text that swapped. Everything else in the form stays still.
 *
 * The tick is decorative — `role="status"` on the wrapper announces the words,
 * and the SVG is hidden — so a screen reader gets the message once, not a
 * description of a drawing.
 */
export function SignupSuccessMessage({ message }: { message: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 px-2 py-8 text-center">
      <span className="animate-signup-badge-in flex h-14 w-14 items-center justify-center rounded-full bg-kawai-red/10 text-kawai-red">
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          {/* The path is ~26.6 units long; 28 covers it with room to spare so
              the stroke is fully hidden before the draw starts. */}
          <path
            d="M7 16.5 13.5 23 25 10"
            className="animate-signup-check-draw"
            style={{ strokeDasharray: 28, strokeDashoffset: 28 }}
          />
        </svg>
      </span>
      <p className="max-w-[34ch] text-sm leading-relaxed text-kawai-black">{message}</p>
    </div>
  )
}
