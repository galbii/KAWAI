import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticAlternates } from '@/lib/site-context'

export const metadata: Metadata = {
  title: 'Shigeru Kawai Technology | 12 Proprietary Innovations',
  description:
    'Discover the 12 proprietary technologies that make Shigeru Kawai grand pianos extraordinary — from Kigarashi naturally-aged soundboards to the Millennium III ABS-Carbon action and hand-wound Temaki bass strings.',
  alternates: getStaticAlternates('/shigeru/technology'),
}

const technologies = [
  {
    id: 'kigarashi',
    name: 'Kigarashi Premium Aged Soundboards',
    shortName: 'Kigarashi Soundboards',
    category: 'sound' as const,
    description:
      "The heart of any piano's tone begins with its soundboard. Kigarashi soundboards undergo a traditional natural aging process — shaped by time and nature alone, never artificial heat or chemical treatment. The result is a soundboard of extraordinary resonance and tonal purity that only deepens with age.",
    detail: 'Aged by time and nature alone',
  },
  {
    id: 'shiko-seion',
    name: 'Shiko Seion Hammers',
    shortName: 'Shiko Seion Hammers',
    category: 'craftsmanship' as const,
    description:
      'Crafted from premium New Zealand and Australian wool, Shiko Seion hammers are shaped entirely without heat or artificial hardeners. Each hammer is individually voiced by a Master Piano Artisan to achieve the "ultimate voicing" — a tone that is honest, transparent, and capable of infinite color.',
    detail: 'No heat, no artificial hardeners',
  },
  {
    id: 'millennium-iii',
    name: 'Millennium III ABS-Carbon Action',
    shortName: 'Millennium III Action',
    category: 'action' as const,
    description:
      'The Millennium III action uses ABS-Carbon composite components for parts that were previously made from wood. Carbon fiber is immune to humidity and temperature changes, ensuring the action remains consistent year-round. The result: faster repetition, more power with less effort, and unmatched control.',
    detail: 'Consistent in any climate',
  },
  {
    id: 'konsei-katagi',
    name: 'Konsei Katagi Rim Construction',
    shortName: 'Konsei Katagi Rim',
    category: 'structure' as const,
    description:
      "The rim is the piano's backbone. Konsei Katagi rim construction uses a carefully selected blend of small-pore and large-pore hardwoods — each chosen for its acoustic properties. This combination creates a rim of exceptional rigidity and resonance transmission.",
    detail: 'Hardwood blend for superior resonance',
  },
  {
    id: 'solid',
    name: 'Stretcher Over-Lap Integrated Design (SOLID)',
    shortName: 'SOLID Design',
    category: 'structure' as const,
    description:
      'The SOLID design integrates the stretcher and case back with an overlapping joint of exceptional strength. This dramatically improves tuning stability — the piano holds its pitch through the most demanding performance conditions.',
    detail: 'Exceptional tuning stability',
  },
  {
    id: 'extended-keysticks',
    name: 'Extended Keysticks',
    shortName: 'Extended Keysticks',
    category: 'action' as const,
    description:
      "Shigeru Kawai keysticks are longer than standard for greater control at the key's far end, and taller for increased stiffness. The result is a touch that feels connected directly to the string — a seamless bridge between finger and tone.",
    detail: 'Greater control, increased stiffness',
  },
  {
    id: 'concert-agraffes',
    name: 'Concert Agraffes',
    shortName: 'Concert Agraffes',
    category: 'structure' as const,
    description:
      "Shigeru Kawai concert agraffes are machined directly from solid billet brass rods — not cast. This manufacturing process produces agraffes of exceptional precision that guide each string at exactly the correct speaking length, contributing to the piano's renowned evenness of tone across the entire keyboard.",
    detail: 'Machined from solid brass rods',
  },
  {
    id: 'temaki',
    name: 'Temaki Hand-Wound Bass Strings',
    shortName: 'Temaki Bass Strings',
    category: 'craftsmanship' as const,
    description:
      'Every Shigeru Kawai bass string is hand-wound by Kawai craftsmen using the Temaki process. Machine-wound strings cannot achieve the consistency and precision of a skilled artisan. Temaki strings produce a bass register of remarkable clarity, bloom, and color — no muddiness, no false tones.',
    detail: 'Hand-wound by Kawai craftsmen',
  },
  {
    id: 'all-spruce-beams',
    name: 'All-Spruce Structural Beams',
    shortName: 'All-Spruce Beams',
    category: 'structure' as const,
    description:
      'Premium Sitka spruce — the same wood used for soundboards — is used for all structural beams. Spruce offers an exceptional strength-to-weight ratio and natural acoustic properties that contribute to the piano\'s overall resonance.',
    detail: 'Premium Sitka spruce throughout',
  },
  {
    id: 'boxwood-bridge',
    name: 'Boxwood Bridge Caps',
    shortName: 'Boxwood Bridge Caps',
    category: 'sound' as const,
    description:
      "Boxwood is prized for its extraordinary density and consistent grain structure. Bridge caps made from boxwood transfer high-frequency vibrations from string to soundboard with exceptional precision — contributing to the piano's renowned clarity and brilliance in the treble register.",
    detail: 'Exceptional high-frequency transfer',
  },
  {
    id: 'dual-pivot',
    name: 'Dual-Pivot Damper Action',
    shortName: 'Dual-Pivot Dampers',
    category: 'action' as const,
    description:
      'The dual-pivot damper mechanism allows for precise, graduated damper movement with extraordinary control over half-pedal nuances. Concert pianists demand damper action that responds to the most subtle pedal gradations — the Shigeru Kawai dual-pivot system delivers this with consistency across the entire keyboard.',
    detail: 'Precise half-pedal management',
  },
  {
    id: 'concert-key-buttons',
    name: 'Concert-Length Key Buttons',
    shortName: 'Concert Key Buttons',
    category: 'action' as const,
    description:
      'Full concert-length key buttons extend further under the keybed, providing greater stability and more consistent touch weight from the front to the rear of each key. This is particularly noticeable in rapid passages where key stability is paramount.',
    detail: 'Full concert-length stability',
  },
] as const

const pillars = [
  {
    title: 'Unparalleled Legacy',
    body: 'A covenant made over a century ago: to build the finest piano the world has ever heard. Every technology in a Shigeru Kawai piano honors that covenant.',
  },
  {
    title: 'Unsurpassed Craftsmanship',
    body: 'Each craftsman contributes their seasoned skill and artistry. Like members of a great orchestra, the whole surpasses the sum of its parts.',
  },
  {
    title: 'Unrivaled Advancement',
    body: "Placing one's name upon the work of one's hands is the greatest commitment. Each Shigeru piano is a work of uncompromising devotion to that honor.",
  },
] as const

const groups = [
  {
    label: 'Sound & Tone',
    ids: ['kigarashi', 'shiko-seion', 'boxwood-bridge', 'temaki'],
  },
  {
    label: 'Action & Touch',
    ids: ['millennium-iii', 'extended-keysticks', 'dual-pivot', 'concert-key-buttons'],
  },
  {
    label: 'Structure & Stability',
    ids: ['konsei-katagi', 'solid', 'all-spruce-beams', 'concert-agraffes'],
  },
] as const

export default function TechnologyPage() {
  return (
    <div className="bg-[#0a0a0a]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] px-6 pt-24 pb-36 flex flex-col items-center text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 35%, rgba(213,199,140,0.06) 0%, transparent 68%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Unrivaled Advancement
          </p>

          <h1
            className="text-white font-light italic leading-none mb-10"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            }}
          >
            Twelve Innovations.
            <br />
            One Vision.
          </h1>

          <p
            className="text-white/70 text-sm leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            A noble covenant — to build the finest piano the world has ever heard. These twelve
            proprietary technologies are the embodiment of that unbreakable promise.
          </p>
        </div>
      </section>

      {/* ── THREE PILLARS ────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-muted text-[10px] tracking-[0.45em] uppercase mb-20 text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Foundation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-kawai-neutral/30">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-kawai-pearl px-10 py-12 flex flex-col"
              >
                <h2
                  className="text-kawai-black font-light italic leading-tight mb-6"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.3rem, 2.2vw, 1.75rem)',
                  }}
                >
                  {pillar.title}
                </h2>
                <span className="block w-8 h-px bg-kawai-gold/40 mb-6" />
                <p
                  className="text-kawai-muted text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY SHOWCASE ──────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-36">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-6 text-center"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Twelve Proprietary Technologies
          </p>
          <h2
            className="text-white font-light italic text-center leading-tight mb-28"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            }}
          >
            Built Into Every Instrument
          </h2>

          <div className="flex flex-col gap-28">
            {groups.map((group) => {
              const groupTechs = group.ids.map((id) =>
                technologies.find((t) => t.id === id),
              ).filter(Boolean)

              return (
                <div key={group.label}>
                  {/* Group label */}
                  <div className="flex items-center gap-6 mb-14">
                    <span className="block h-px flex-1 bg-white/[0.06]" />
                    <p
                      className="text-kawai-gold/60 text-[10px] tracking-[0.45em] uppercase flex-shrink-0"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      {group.label}
                    </p>
                    <span className="block h-px flex-1 bg-white/[0.06]" />
                  </div>

                  {/* Technology cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
                    {groupTechs.map((tech, i) => {
                      if (!tech) return null
                      // Global sequential number
                      const globalIndex = technologies.findIndex((t) => t.id === tech.id)
                      const num = String(globalIndex + 1).padStart(2, '0')

                      return (
                        <div
                          key={tech.id}
                          className="bg-[#0a0a0a] hover:bg-[#0f0d09] px-10 py-12 flex flex-col gap-5 transition-colors duration-500 group"
                        >
                          {/* Number + name row */}
                          <div className="flex items-baseline gap-5">
                            <span
                              className="text-kawai-gold/10 font-light leading-none flex-shrink-0 group-hover:text-kawai-gold/18 transition-colors duration-500"
                              style={{
                                fontFamily: 'var(--font-brand-luxury)',
                                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                              }}
                            >
                              {num}
                            </span>
                            <h3
                              className="text-white/85 font-light italic leading-snug"
                              style={{
                                fontFamily: 'var(--font-brand-luxury)',
                                fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                              }}
                            >
                              {tech.name}
                            </h3>
                          </div>

                          {/* Gold dot separator + detail */}
                          <div className="flex items-center gap-3">
                            <span className="block w-1 h-1 rounded-full bg-kawai-gold/50 flex-shrink-0" />
                            <p
                              className="text-kawai-gold/50 text-[11px] tracking-[0.25em] uppercase"
                              style={{ fontFamily: 'var(--font-brand-sans)' }}
                            >
                              {tech.detail}
                            </p>
                          </div>

                          {/* Description */}
                          <p
                            className="text-white/70 text-sm leading-relaxed"
                            style={{ fontFamily: 'var(--font-brand-sans)' }}
                          >
                            {tech.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-36">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-kawai-muted text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Continue the Journey
          </p>
          <h2
            className="text-kawai-black font-light italic leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            }}
          >
            Hear the Difference
          </h2>
          <p
            className="text-kawai-muted text-sm leading-relaxed max-w-md mx-auto mb-16"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            These technologies exist to serve one purpose: the most transcendent musical
            experience the world has ever known.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shigeru/models"
              className="inline-flex items-center gap-3 border border-kawai-charcoal/20 hover:border-kawai-black text-kawai-black hover:bg-kawai-black/5 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Explore the Pianos
            </Link>
            <Link
              href="/shigeru/artisans"
              className="inline-flex items-center gap-3 border border-kawai-charcoal/10 hover:border-kawai-charcoal/30 text-kawai-charcoal/50 hover:text-kawai-charcoal/80 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Meet the Artisans
            </Link>
          </div>
        </div>
      </section>

      {/* ── MICROSITE FOOTER ─────────────────────────────────── */}
      <footer className="bg-[#0a0a0a] border-t border-white/[0.04] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/15 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Shigeru Kawai
          </p>
          <p
            className="text-white/15 text-xs"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            © 2026 Kawai Musical Instruments. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
