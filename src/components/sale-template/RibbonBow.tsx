/**
 * The flyer's red satin ribbon: a band across the foot of the hero photograph
 * with a bow tied at its centre. Decorative SVG, Kawai red with a satin sheen.
 */
export function RibbonBow({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      {/* The band */}
      <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-gradient-to-b from-kawai-red-400 via-kawai-red to-kawai-red-800 shadow-[0_2px_6px_color-mix(in_srgb,var(--color-kawai-red-900)_35%,transparent)] sm:h-4" />
      {/* The bow */}
      <svg
        viewBox="0 0 160 110"
        className="relative mx-auto h-20 w-auto drop-shadow-[0_6px_10px_color-mix(in_srgb,var(--color-kawai-red-900)_35%,transparent)] sm:h-24"
      >
        <defs>
          <linearGradient id="sale-satin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--color-kawai-red-400)' }} />
            <stop offset="0.45" style={{ stopColor: 'var(--color-kawai-red)' }} />
            <stop offset="1" style={{ stopColor: 'var(--color-kawai-red-900)' }} />
          </linearGradient>
          <linearGradient id="sale-satin-tail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--color-kawai-red)' }} />
            <stop offset="1" style={{ stopColor: 'var(--color-kawai-red-800)' }} />
          </linearGradient>
        </defs>
        {/* Tails */}
        <path d="M74 52 L52 104 L62 98 L68 108 L80 58 Z" fill="url(#sale-satin-tail)" />
        <path d="M86 52 L108 104 L98 98 L92 108 L80 58 Z" fill="url(#sale-satin-tail)" />
        {/* Loops */}
        <path d="M80 50 C60 18 14 14 10 38 C6 62 52 66 80 54 Z" fill="url(#sale-satin)" />
        <path d="M80 50 C100 18 146 14 150 38 C154 62 108 66 80 54 Z" fill="url(#sale-satin)" />
        {/* Loop highlights */}
        <path d="M24 34 C34 26 54 28 68 44" stroke="var(--color-kawai-red-200)" strokeOpacity="0.55" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M136 34 C126 26 106 28 92 44" stroke="var(--color-kawai-red-200)" strokeOpacity="0.4" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Knot */}
        <rect x="70" y="40" width="20" height="22" rx="7" fill="var(--color-kawai-red-700)" />
        <rect x="73" y="43" width="7" height="16" rx="3" fill="var(--color-kawai-red-400)" fillOpacity="0.45" />
      </svg>
    </div>
  )
}
