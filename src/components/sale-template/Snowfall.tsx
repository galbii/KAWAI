/**
 * Gentle snowfall and a few twinkles for the hero — pure CSS, no particle lib.
 *
 * Flakes are laid out from a fixed formula rather than Math.random(), so the
 * server and client render identical markup (no hydration mismatch). Every
 * flake animates transform/opacity only, so it composites without layout.
 * Under prefers-reduced-motion the whole layer is removed, not frozen.
 */

const FLAKES = Array.from({ length: 26 }, (_, i) => {
  // Golden-ratio spacing spreads flakes evenly without visible columns.
  const left = ((i * 61.8) % 100).toFixed(2)
  const size = 4 + ((i * 7) % 9) // 4–12px
  const duration = 11 + ((i * 5) % 9) // 11–19s
  const delay = -((i * 3.7) % 18) // negative: already mid-fall on load
  const drift = ((i % 2 === 0 ? 1 : -1) * (1 + (i % 4))).toFixed(1)
  const opacity = (0.45 + ((i * 13) % 50) / 100).toFixed(2)
  return { left, size, duration, delay, drift, opacity }
})

const TWINKLES = [
  { top: '14%', left: '12%', delay: '0s' },
  { top: '22%', left: '78%', delay: '1.2s' },
  { top: '9%', left: '52%', delay: '2.1s' },
  { top: '34%', left: '30%', delay: '0.6s' },
  { top: '28%', left: '90%', delay: '1.8s' },
]

export function Snowfall() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 block rounded-full bg-white will-change-transform"
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              filter: f.size > 9 ? 'blur(1px)' : undefined,
              boxShadow: '0 0 6px color-mix(in srgb, white 70%, transparent)',
              animation: `sale-snow-fall ${f.duration}s linear ${f.delay}s infinite`,
              '--flake-drift': `${f.drift}rem`,
              '--flake-opacity': f.opacity,
            } as React.CSSProperties
          }
        />
      ))}
      {TWINKLES.map((t, i) => (
        <svg
          key={`t${i}`}
          viewBox="0 0 24 24"
          className="absolute h-4 w-4 text-kawai-gold"
          style={{ top: t.top, left: t.left, animation: `sale-twinkle 3.2s ease-in-out ${t.delay} infinite` }}
        >
          <path
            fill="currentColor"
            d="M12 0c.6 5.6 2.4 7.4 8 8-5.6.6-7.4 2.4-8 8-.6-5.6-2.4-7.4-8-8 5.6-.6 7.4-2.4 8-8z"
            transform="translate(0 4)"
          />
        </svg>
      ))}
    </div>
  )
}
