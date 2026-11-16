/**
 * The flyer's red satin ribbon, drawn as a wrapped gift: a band (horizontal
 * by default, vertical with `vertical`) and a bow tied where it sits.
 * Decorative only — Kawai red with a satin sheen, no text.
 */

export function SatinBand({ vertical = false, className = '' }: { vertical?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block ${
        vertical
          ? 'bg-gradient-to-r from-kawai-red-800 via-kawai-red to-kawai-red-800'
          : 'bg-gradient-to-b from-kawai-red-400 via-kawai-red to-kawai-red-800'
      } shadow-[0_2px_10px_color-mix(in_srgb,var(--color-kawai-red-900)_45%,transparent)] ${className}`}
    >
      {/* Satin highlight running along the band */}
      <span
        className={`absolute bg-white/25 ${vertical ? 'inset-y-0 left-[30%] w-px' : 'inset-x-0 top-[30%] h-px'}`}
      />
    </span>
  )
}

export function Bow({ className = '', idSuffix = 'a' }: { className?: string; idSuffix?: string }) {
  const satin = `sale-satin-${idSuffix}`
  const tail = `sale-satin-tail-${idSuffix}`
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 110"
      className={`drop-shadow-[0_8px_14px_color-mix(in_srgb,var(--color-kawai-red-900)_45%,transparent)] ${className}`}
    >
      <defs>
        <linearGradient id={satin} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--color-kawai-red-400)' }} />
          <stop offset="0.45" style={{ stopColor: 'var(--color-kawai-red)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-kawai-red-900)' }} />
        </linearGradient>
        <linearGradient id={tail} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--color-kawai-red)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-kawai-red-800)' }} />
        </linearGradient>
      </defs>
      {/* Tails */}
      <path d="M74 52 L52 104 L62 98 L68 108 L80 58 Z" fill={`url(#${tail})`} />
      <path d="M86 52 L108 104 L98 98 L92 108 L80 58 Z" fill={`url(#${tail})`} />
      {/* Loops */}
      <path d="M80 50 C60 18 14 14 10 38 C6 62 52 66 80 54 Z" fill={`url(#${satin})`} />
      <path d="M80 50 C100 18 146 14 150 38 C154 62 108 66 80 54 Z" fill={`url(#${satin})`} />
      {/* Loop highlights */}
      <path d="M24 34 C34 26 54 28 68 44" stroke="var(--color-kawai-red-200)" strokeOpacity="0.55" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M136 34 C126 26 106 28 92 44" stroke="var(--color-kawai-red-200)" strokeOpacity="0.4" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Knot */}
      <rect x="70" y="40" width="20" height="22" rx="7" fill="var(--color-kawai-red-700)" />
      <rect x="73" y="43" width="7" height="16" rx="3" fill="var(--color-kawai-red-400)" fillOpacity="0.45" />
    </svg>
  )
}
