'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { ShigeruModel } from '../../_data/models'
import { GOLD, OSWALD, PEARL, SANS, SERIF, ink, labelStyle, lengthRatio } from '@/lib/shigeru/tokens'
import { useReveal } from '@/lib/shigeru/use-reveal'

type Props = {
  model: ShigeruModel
  imageUrl: string | null
  /** Position in the range — decides which side the instrument stands on. */
  index: number
  /** First entry carries the LCP image. */
  priority?: boolean
}

/**
 * Text column: each line arrives just behind the one above it. Positions are
 * passed explicitly rather than counted by a shared cursor — React may render
 * these six entries in any interleaving, and a module-level counter would
 * scramble the stagger.
 */
const step = (position: number): CSSProperties =>
  ({ '--sk-delay': `${0.12 + position * 0.07}s` }) as CSSProperties

/**
 * One instrument in the catalogue.
 *
 * Entries alternate sides down the page, and each instrument is drawn to its
 * true scale against the SK-EX — so the range visibly grows as you read, which
 * is the whole point of the line. Each piano is anchored to the outer edge of
 * its column with the floor line running past it, so the growth stays legible
 * across the flip.
 *
 * The image wrapper paints an opaque pearl background because it animates:
 * a transform/opacity animation isolates the blend group, and without
 * something for mix-blend-multiply to land on, the white-background SK-EX
 * shot renders as a box. Pearl-on-pearl is invisible and fixes it.
 */
export function CollectionEntry({ model, imageUrl, index, priority = false }: Props) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.2)
  const ratio = lengthRatio(model.cm)
  const flipped = index % 2 === 1

  return (
    <article
      id={`model-${model.slug}`}
      className="scroll-mt-24"
      style={{ borderTop: `1px solid ${ink(0.12)}` }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        <div
          ref={ref}
          className={`grid items-center gap-10 lg:gap-16 ${shown ? 'is-shown' : ''} ${
            flipped
              ? 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'
              : 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]'
          }`}
        >
          {/* ── The instrument, at its own scale ─────────────────────── */}
          <div
            className={`sk-reveal relative w-full ${
              flipped ? 'sk-reveal-right lg:order-2' : 'sk-reveal-left'
            }`}
            style={{ height: `${ratio * 30}rem`, background: PEARL }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Shigeru Kawai ${model.name} ${model.type.toLowerCase()} — ${model.feet}`}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 690px, 92vw"
                className={`object-contain mix-blend-multiply ${
                  flipped ? 'object-right-bottom' : 'object-left-bottom'
                }`}
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px"
              style={{ background: ink(0.18) }}
            />
          </div>

          {/* ── The entry ────────────────────────────────────────────── */}
          <div className={`min-w-0 ${flipped ? 'lg:order-1' : ''}`}>
            <h2
              className="sk-reveal sk-reveal-up uppercase leading-[0.88]"
              style={{
                ...step(0),
                fontFamily: OSWALD,
                fontSize: 'clamp(3rem, 6vw, 4.75rem)',
                fontWeight: 700,
                letterSpacing: '0.03em',
                color: ink(0.95),
              }}
            >
              <Link href={`/shigeru/models/${model.slug}`} className="hover:!text-kawai-charcoal">
                {model.name}
                <span className="sr-only"> — Shigeru Kawai {model.type}</span>
              </Link>
            </h2>

            <p
              className="sk-reveal sk-reveal-up mt-4 italic"
              style={{ ...step(1), fontFamily: SERIF, fontSize: '1.15rem', color: ink(0.72) }}
            >
              {model.type}
            </p>

            <span
              aria-hidden="true"
              className="sk-reveal sk-reveal-up my-6 block h-px w-12"
              style={{ ...step(2), background: GOLD }}
            />

            <p className="sk-reveal sk-reveal-up uppercase" style={{ ...step(3), ...labelStyle(0.72) }}>
              {model.feet}&ensp;·&ensp;{model.cm}
              {model.slug === 'sk-ex' && <>&ensp;·&ensp;Fewer than 20 per year</>}
            </p>

            <p
              className="sk-reveal sk-reveal-up mt-6 italic leading-snug"
              style={{
                ...step(4),
                fontFamily: SERIF,
                fontSize: 'clamp(1.2rem, 1.9vw, 1.55rem)',
                color: ink(0.82),
                maxWidth: '32ch',
              }}
            >
              {model.tagline}
            </p>

            <ul className="mt-8">
              {model.sellingPoints.slice(0, 2).map((point, i) => (
                <li
                  key={point}
                  className="sk-reveal sk-reveal-up py-4 first:pt-0"
                  style={{ ...step(5 + i), borderBottom: `1px solid ${ink(0.12)}` }}
                >
                  <p style={{ fontFamily: SANS, fontSize: '0.98rem', lineHeight: 1.65, color: ink(0.78) }}>
                    {point}
                  </p>
                </li>
              ))}
            </ul>

            <p
              className="sk-reveal sk-reveal-up mt-5"
              style={{ ...step(7), fontFamily: SANS, fontSize: '0.85rem', letterSpacing: '0.05em', color: ink(0.72) }}
            >
              {model.finishes.join('  ·  ')}
            </p>

            <div className="sk-reveal sk-reveal-up mt-9" style={step(8)}>
              <Link
                href={`/shigeru/models/${model.slug}`}
                className="group inline-flex items-center gap-3 px-10 py-4 transition-colors duration-300 hover:!bg-kawai-charcoal"
                style={{
                  fontFamily: OSWALD,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  background: ink(1),
                  color: '#fff',
                }}
              >
                Explore {model.name}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path
                      d="M1 5.5H15M11 1.5L15 5.5L11 9.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
