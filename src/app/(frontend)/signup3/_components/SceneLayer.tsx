'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'

type SceneLayerProps = {
  progress: MotionValue<number>
  window: readonly [number, number]
  startVisible?: boolean
  endVisible?: boolean
  /** Portion of the window used to fade in (default 0.12 — fast). */
  fadeIn?: number
  /** Portion of the window used to fade out (default 0.18). */
  fadeOut?: number
  yOffset?: number
  className?: string
  children: ReactNode
}

/**
 * A full-viewport absolute layer pinned over the soundboard canvas.
 *
 * The fade is asymmetric on purpose: a quick in (so copy "lands"),
 * a long hold (so you can read it), then a relaxed out (so the next
 * scene's copy slides under it cleanly).
 */
export default function SceneLayer({
  progress,
  window: w,
  startVisible = false,
  endVisible = false,
  fadeIn = 0.12,
  fadeOut = 0.18,
  yOffset = 0,
  className = '',
  children,
}: SceneLayerProps) {
  const [start, end] = w
  const span = end - start
  const inEnd = start + span * fadeIn
  const outStart = end - span * fadeOut

  const input: number[] = [start, inEnd, outStart, end]
  const output: number[] = [startVisible ? 1 : 0, 1, 1, endVisible ? 1 : 0]
  const opacity = useTransform(progress, input, output)
  const y = useTransform(progress, input, [yOffset, 0, 0, -yOffset / 2])

  const ref = useRef<HTMLDivElement>(null)
  useMotionValueEvent(opacity, 'change', (v) => {
    const el = ref.current
    if (!el) return
    const visible = v > 0.05
    if (visible && el.hasAttribute('inert')) el.removeAttribute('inert')
    if (!visible && !el.hasAttribute('inert')) el.setAttribute('inert', '')
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (opacity.get() <= 0.05) el.setAttribute('inert', '')
  }, [opacity])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, willChange: 'opacity, transform' }}
      className={`pointer-events-auto absolute inset-0 flex ${className}`}
    >
      {children}
    </motion.div>
  )
}
