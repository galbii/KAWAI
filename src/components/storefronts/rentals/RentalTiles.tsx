'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * Monthly rental options as photo tiles — the same visual language as the
 * homepage Featured Collections grid (gradient scrim, white tag, bold white
 * title, slow zoom on hover). Each tile links to the inquiry form with that
 * piano preselected.
 */

export interface RentalTile {
  label: string
  tag: string
  price: number
  unit: string
  description?: string | null
  imageUrl: string | null
  href: string
}

function Tile({ tile, index }: { tile: RentalTile; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={tile.href}
        className="group relative block overflow-hidden rounded-lg bg-kawai-black aspect-[4/5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red"
      >
        {tile.imageUrl && (
          <Image
            src={tile.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute left-0 top-0 p-4">
          <span className="inline-flex items-center bg-white px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-kawai-black shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
            {tile.tag}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3
            className="text-white leading-[1.05]"
            style={{
              fontFamily: 'var(--font-brand-sans)',
              fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 16px rgba(0,0,0,0.55)',
            }}
          >
            {tile.label}
          </h3>
          <p className="mt-2 text-white/85">
            From <span className="font-semibold text-white">${tile.price.toLocaleString()}</span>/{tile.unit}
          </p>
          {tile.description && (
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70 line-clamp-2">{tile.description}</p>
          )}
          <span className="mt-5 inline-flex border-b border-white/40 pb-px text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 group-hover:border-white">
            Ask about this piano
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export function RentalTiles({ tiles }: { tiles: RentalTile[] }) {
  return (
    <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((tile, i) => (
        <Tile key={tile.label} tile={tile} index={i} />
      ))}
    </div>
  )
}
