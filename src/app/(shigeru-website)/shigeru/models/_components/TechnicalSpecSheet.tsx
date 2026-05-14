'use client'

import { useState } from 'react'
import type { ShigeruModel } from '../../_data/models'

type Props = {
  model: Pick<
    ShigeruModel,
    'name' | 'type' | 'feet' | 'cm' | 'width' | 'widthCm' | 'weight' | 'weightKg' | 'beams' | 'finishes'
  >
}

type SpecRow = {
  label: string
  value: string
  note?: string | undefined
}

type SpecGroup = {
  title: string
  rows: SpecRow[]
}

export function TechnicalSpecSheet({ model }: Props) {
  const [open, setOpen] = useState(false)

  const beamLabel =
    model.beams === 5
      ? 'Five — Concert Specification'
      : model.beams === 3
        ? 'Three — Premium Specification'
        : 'Four — Premium Specification'

  const finishValue = model.finishes[0] ?? 'Polished Ebony'
  const finishNote =
    model.finishes.length > 1 ? model.finishes.slice(1).join(' · ') : undefined

  // First 5 rows — always visible
  const previewRows: SpecRow[] = [
    { label: 'Length', value: model.feet, note: model.cm },
    { label: 'Width', value: model.width, note: model.widthCm },
    { label: 'Height', value: "3' 4\"", note: '102 cm' },
    { label: 'Weight', value: model.weight, note: model.weightKg },
    { label: 'Keys', value: '88' },
  ]

  // Remaining rows — revealed on expand, grouped
  const expandedGroups: SpecGroup[] = [
    {
      title: 'Keys & Action',
      rows: [
        { label: 'Action Mechanism', value: 'Millennium III ABS-Carbon' },
        { label: 'Key Surfaces', value: 'NEOTEX™', note: 'White & black keys' },
        { label: 'Pedals', value: 'Three', note: 'Damper · Sostenuto · Soft' },
      ],
    },
    {
      title: 'Acoustics',
      rows: [
        { label: 'Soundboard', value: 'Solid Spruce', note: 'Tapered construction' },
        { label: 'Spruce Beams', value: beamLabel },
        { label: 'Agraffes', value: 'Concert Specification', note: 'Keys 1–54' },
        { label: 'Duplex Scaling', value: 'Front & Aliquot' },
        { label: 'Bass Strings', value: 'Hand-wound Copper' },
      ],
    },
    {
      title: 'Construction',
      rows: [
        { label: 'Integrated Design', value: 'SOLID', note: 'Stretcher Overlap Integrated Design' },
        { label: 'Plate Reinforcement', value: 'V-Pro Plate' },
        { label: 'Resonance System', value: 'CORE System' },
        { label: 'Hardware', value: 'Double Brass Casters' },
        { label: 'Lid Mechanism', value: 'Softfall Closing System' },
        { label: 'Final Voicing', value: 'Master Piano Artisan' },
      ],
    },
    {
      title: 'Ownership',
      rows: [
        { label: 'Available Finishes', value: finishValue, note: finishNote },
        { label: 'Warranty', value: '10 Years', note: 'Fully transferrable' },
        { label: 'MPA In-Home Visit', value: 'Included', note: 'Within first year of ownership' },
        { label: 'Handcrafted In', value: 'Hamamatsu, Japan', note: 'ISO14001 certified factory' },
      ],
    },
  ]

  const remainingCount = expandedGroups.reduce((acc, g) => acc + g.rows.length, 0)

  return (
    <section className="bg-kawai-pearl px-6 py-16">
      <div className="max-w-4xl mx-auto">

        {/* ── Section heading ──────────────────────────────────────── */}
        <div className="flex items-center gap-5 mb-8 border-t border-kawai-black/[0.08] pt-12">
          <h2
            className="flex-shrink-0 text-kawai-black font-bold text-base tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Technical Specifications
          </h2>
          <span className="block h-px flex-1 bg-kawai-black/[0.08]" />
          <span
            className="flex-shrink-0 text-kawai-charcoal/35 text-sm"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {model.name}
          </span>
        </div>

        {/* ── Always-visible first 5 rows ──────────────────────────── */}
        <div>
          {previewRows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-8 py-5 border-b border-kawai-black/[0.07]"
            >
              <p
                className="flex-shrink-0 text-kawai-charcoal/55 text-sm tracking-[0.2em] uppercase w-48"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {row.label}
              </p>
              <span
                className="flex-1 border-b border-dotted border-kawai-black/[0.08] mb-1.5 hidden sm:block"
                aria-hidden="true"
              />
              <div className="text-right flex-shrink-0 max-w-sm">
                <span
                  className="text-kawai-black font-light italic"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
                  }}
                >
                  {row.value}
                </span>
                {row.note && (
                  <span
                    className="block text-kawai-charcoal/40 text-xs mt-0.5"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {row.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Expand toggle ────────────────────────────────────────── */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-8 py-5 border-b border-kawai-black/[0.07] group cursor-pointer"
        >
          <span
            className="text-kawai-charcoal/45 group-hover:text-kawai-charcoal/70 text-sm tracking-wide transition-colors duration-200"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {open ? 'Show fewer' : `Show all ${remainingCount + 5} specifications`}
          </span>
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full border border-kawai-black/15 group-hover:border-kawai-black/35 flex items-center justify-center transition-colors duration-200"
            aria-hidden="true"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-kawai-charcoal/50 transition-transform duration-300"
              style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
            >
              <path
                d="M7 1v12M1 7h12"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>

        {/* ── Expandable remaining rows ─────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: open ? '1fr' : '0fr',
            transition: 'grid-template-rows 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="overflow-hidden">
            <div className="pt-2 pb-10">
              <div className="space-y-10">
                {expandedGroups.map((group) => (
                  <div key={group.title}>
                    <div className="flex items-center gap-5 mb-1">
                      <p
                        className="flex-shrink-0 text-kawai-gold text-[9px] tracking-[0.55em] uppercase"
                        style={{ fontFamily: 'var(--font-brand-sans)', fontVariant: 'small-caps' }}
                      >
                        {group.title}
                      </p>
                      <span className="block h-px flex-1 bg-kawai-gold/25" />
                    </div>
                    <div>
                      {group.rows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-baseline justify-between gap-8 py-5 border-b border-kawai-black/[0.07] last:border-b-0"
                        >
                          <p
                            className="flex-shrink-0 text-kawai-charcoal/55 text-sm tracking-[0.2em] uppercase w-48"
                            style={{ fontFamily: 'var(--font-brand-sans)' }}
                          >
                            {row.label}
                          </p>
                          <span
                            className="flex-1 border-b border-dotted border-kawai-black/[0.08] mb-1.5 hidden sm:block"
                            aria-hidden="true"
                          />
                          <div className="text-right flex-shrink-0 max-w-sm">
                            <span
                              className="text-kawai-black font-light italic"
                              style={{
                                fontFamily: 'var(--font-brand-luxury)',
                                fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
                              }}
                            >
                              {row.value}
                            </span>
                            {row.note && (
                              <span
                                className="block text-kawai-charcoal/40 text-xs mt-0.5"
                                style={{ fontFamily: 'var(--font-brand-sans)' }}
                              >
                                {row.note}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="mt-10">
          <p
            className="text-kawai-charcoal/30 text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Specifications subject to change without notice.
          </p>
        </div>

      </div>
    </section>
  )
}
