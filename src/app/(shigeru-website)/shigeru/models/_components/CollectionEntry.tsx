import Image from 'next/image'
import Link from 'next/link'
import type { ShigeruModel } from '../../_data/models'
import { GOLD, OSWALD, SANS, SERIF, ink, labelStyle, lengthRatio } from '@/lib/shigeru/tokens'

type Props = {
  model: ShigeruModel
  imageUrl: string | null
  /** First entry carries the LCP image. */
  priority?: boolean
}

/**
 * One instrument in the catalogue.
 *
 * Every entry keeps the same layout — a catalogue is consistent, not
 * alternating — and the variation comes from the instruments themselves: each
 * is drawn to its true scale against the SK-EX, so the range visibly grows as
 * you read down the page. That progression is the whole point of the line.
 */
export function CollectionEntry({ model, imageUrl, priority = false }: Props) {
  const ratio = lengthRatio(model.cm)

  return (
    <article id={`model-${model.slug}`} style={{ borderTop: `1px solid ${ink(0.12)}` }}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          {/* ── The instrument, at its own scale ─────────────────────── */}
          <div className="relative w-full" style={{ height: `${ratio * 30}rem` }}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Shigeru Kawai ${model.name} ${model.type.toLowerCase()} — ${model.feet}`}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 690px, 92vw"
                className="object-contain object-left-bottom mix-blend-multiply"
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px"
              style={{ background: ink(0.18) }}
            />
          </div>

          {/* ── The entry ────────────────────────────────────────────── */}
          <div className="min-w-0">
            <h2
              className="uppercase leading-[0.88]"
              style={{
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
              className="mt-4 italic"
              style={{ fontFamily: SERIF, fontSize: '1.15rem', color: ink(0.72) }}
            >
              {model.type}
            </p>

            <span aria-hidden="true" className="my-6 block h-px w-12" style={{ background: GOLD }} />

            <p className="uppercase" style={labelStyle(0.72)}>
              {model.feet}&ensp;·&ensp;{model.cm}
              {model.slug === 'sk-ex' && <>&ensp;·&ensp;Fewer than 20 per year</>}
            </p>

            <p
              className="mt-6 italic leading-snug"
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(1.2rem, 1.9vw, 1.55rem)',
                color: ink(0.82),
                maxWidth: '32ch',
              }}
            >
              {model.tagline}
            </p>

            <ul className="mt-8">
              {model.sellingPoints.slice(0, 2).map((point) => (
                <li
                  key={point}
                  className="py-4 first:pt-0"
                  style={{ borderBottom: `1px solid ${ink(0.12)}` }}
                >
                  <p style={{ fontFamily: SANS, fontSize: '0.98rem', lineHeight: 1.65, color: ink(0.78) }}>
                    {point}
                  </p>
                </li>
              ))}
            </ul>

            <p
              className="mt-5"
              style={{ fontFamily: SANS, fontSize: '0.85rem', letterSpacing: '0.05em', color: ink(0.72) }}
            >
              {model.finishes.join('  ·  ')}
            </p>

            <Link
              href={`/shigeru/models/${model.slug}`}
              className="group mt-9 inline-flex items-center gap-3 px-10 py-4 transition-colors duration-300 hover:!bg-kawai-charcoal"
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
    </article>
  )
}
