import type { SVGProps } from 'react'

/**
 * Icons for the Event Details block.
 *
 * The block's `icon` select has shipped six options since the collection was
 * written, but the renderer never drew any of them — every campaign that picked
 * "Calendar" got nothing. These are that missing half.
 *
 * All are 20×20 on a 24 grid, 1.5 stroke, currentColor, so they inherit the
 * disc's text colour and stay optically consistent with each other.
 */
type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="h-5 w-5"
      {...props}
    >
      {children}
    </svg>
  )
}

const Calendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
)

const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Svg>
)

const Price = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.8" cy="7.8" r="1.4" />
  </Svg>
)

const People = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.25" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.5a3.25 3.25 0 0 1 0 6M17.5 14.6A6 6 0 0 1 21 20" />
  </Svg>
)

const Pin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
)

const Note = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 18V5.5l10-2V16" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="16.5" cy="16" r="2.5" />
  </Svg>
)

export const DETAIL_ICONS = {
  calendar: Calendar,
  clock: Clock,
  price: Price,
  people: People,
  pin: Pin,
  note: Note,
} as const

export type DetailIcon = keyof typeof DETAIL_ICONS

/** Arrow-out-of-box, for the directions link that leaves the site. */
export const ExternalIcon = (p: IconProps) => (
  <Svg {...p} className="h-4 w-4">
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
  </Svg>
)
