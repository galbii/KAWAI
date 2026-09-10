'use client'

import { useState } from 'react'
import type { ShigeruModel } from '../../_data/models'
import {
  EDITORIAL_GRID,
  GOLD,
  OSWALD,
  SANS,
  SERIF,
  ink,
  labelStyle,
} from '@/lib/shigeru/tokens'

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

/** One line of the appendix: label, leader, figure, and the figure's unit. */
function Row({ row }: { row: SpecRow }) {
  return (
    <div
      className="flex items-baseline justify-between gap-6 py-5"
      style={{ borderBottom: `1px solid ${ink(0.12)}` }}
    >
      <dt className="w-28 flex-shrink-0 uppercase sm:w-48" style={labelStyle(0.72)}>
        {row.label}
      </dt>
      <span
        aria-hidden="true"
        className="mb-1.5 hidden flex-1 sm:block"
        style={{ borderBottom: `1px dotted ${ink(0.2)}` }}
      />
      {/* min-w-0 and no flex-shrink-0: a long value like "Millennium III
          ABS-Carbon" must wrap on a phone rather than push the page wider than
          the viewport. */}
      <dd className="min-w-0 max-w-sm text-right">
        <span
          className="leading-tight"
          style={{
            fontFamily: OSWALD,
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
            color: ink(0.92),
          }}
        >
          {row.value}
        </span>
        {row.note && (
          <span
            className="mt-1 block"
            style={{ fontFamily: SANS, fontSize: '0.78rem', color: ink(0.72) }}
          >
            {row.note}
          </span>
        )}
      </dd>
    </div>
  )
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
    <section className="bg-kawai-pearl">
      <div
        className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28"
        style={{ borderTop: `1px solid ${ink(0.12)}` }}
      >
        <div className={EDITORIAL_GRID}>
          {/* ── Heading column ─────────────────────────────────────────── */}
          <div>
            <h2
              className="uppercase leading-[1.05]"
              style={{
                fontFamily: OSWALD,
                fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: ink(0.95),
              }}
            >
              Technical Specifications
            </h2>
            <span aria-hidden="true" className="my-6 block h-px w-12" style={{ background: GOLD }} />
            <p className="italic" style={{ fontFamily: SERIF, fontSize: '1.15rem', color: ink(0.72) }}>
              {model.name}
            </p>
            <p
              className="mt-10 hidden lg:block"
              style={{ fontFamily: SANS, fontSize: '0.8rem', lineHeight: 1.6, color: ink(0.72) }}
            >
              Specifications subject to change without notice.
            </p>
          </div>

          {/* ── Table column ───────────────────────────────────────────── */}
          <div>
            <dl>
              {previewRows.map((row) => (
                <Row key={row.label} row={row} />
              ))}
            </dl>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5"
              style={{ borderBottom: `1px solid ${ink(0.12)}` }}
            >
              <span
                className="uppercase transition-colors duration-200 group-hover:!text-kawai-black"
                style={{ ...labelStyle(0.72, '0.72rem'), letterSpacing: '0.2em' }}
              >
                {open ? 'Show fewer' : `Show all ${remainingCount + 5} specifications`}
              </span>
              <span
                aria-hidden="true"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 group-hover:!border-kawai-black"
                style={{ border: `1px solid ${ink(0.28)}`, color: ink(0.75) }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform duration-300"
                  style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </span>
            </button>

            <div
              style={{
                display: 'grid',
                gridTemplateRows: open ? '1fr' : '0fr',
                transition: 'grid-template-rows 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div className="overflow-hidden">
                <div className="space-y-12 pt-10">
                  {expandedGroups.map((group) => (
                    <div key={group.title}>
                      <div className="mb-1 flex items-center gap-5">
                        <p className="flex-shrink-0 uppercase" style={labelStyle(0.72)}>
                          {group.title}
                        </p>
                        <span
                          aria-hidden="true"
                          className="block h-px flex-1"
                          style={{ background: GOLD, opacity: 0.5 }}
                        />
                      </div>
                      <dl>
                        {group.rows.map((row) => (
                          <Row key={row.label} row={row} />
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p
              className="mt-10 lg:hidden"
              style={{ fontFamily: SANS, fontSize: '0.8rem', lineHeight: 1.6, color: ink(0.72) }}
            >
              Specifications subject to change without notice.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
