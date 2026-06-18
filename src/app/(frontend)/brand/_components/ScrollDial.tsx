'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { SCENE_WINDOWS } from './scenes'

type Props = { progress: MotionValue<number> }

const order: { key: keyof typeof SCENE_WINDOWS; label: string }[] = [
  { key: 'hero', label: 'Inspiration' },
  { key: 'manifesto', label: 'Manifesto' },
  { key: 'showrooms', label: 'Showrooms' },
  { key: 'collections', label: 'Collections' },
  { key: 'stats', label: 'By the Numbers' },
  { key: 'heritage', label: 'Heritage' },
  { key: 'timeline', label: 'Legacy of Innovation' },
  { key: 'technology', label: 'Engineered by Science' },
  { key: 'goDeeper', label: 'Go Deeper' },
  { key: 'coda', label: '97 Years' },
]

function Dot({
  progress,
  start,
  end,
  index,
  total,
  onJump,
  label,
}: {
  progress: MotionValue<number>
  start: number
  end: number
  index: number
  total: number
  onJump: (p: number) => void
  label: string
}) {
  const fade = (end - start) * 0.18
  const active = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0],
  )
  const scale = useTransform(active, [0, 1], [1, 1.4])
  const bg = useTransform(active, [0, 1], ['rgba(255,255,255,0.35)', '#d5c78c'])

  return (
    <button
      type="button"
      aria-label={`Scene ${index + 1} of ${total}: ${label}`}
      onClick={() => onJump((start + end) / 2)}
      className="group relative flex items-center gap-3 py-2"
    >
      <motion.span
        aria-hidden
        style={{ scale, backgroundColor: bg }}
        className="block size-1.5 rounded-full transition-colors"
      />
      <span className="pointer-events-none whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-white/0 transition-colors group-hover:text-white/70 group-focus-visible:text-white/70">
        {label}
      </span>
    </button>
  )
}

export default function ScrollDial({ progress }: Props) {
  const handleJump = (p: number) => {
    const total = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: total * p, behavior: 'smooth' })
  }

  return (
    <nav
      aria-label="About page scenes"
      className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 lg:flex"
    >
      {order.map((o, i) => {
        const [start, end] = SCENE_WINDOWS[o.key]
        return (
          <Dot
            key={o.key}
            progress={progress}
            start={start}
            end={end}
            index={i}
            total={order.length}
            label={o.label}
            onJump={handleJump}
          />
        )
      })}
    </nav>
  )
}
