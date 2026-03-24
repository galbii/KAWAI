import type { Metadata } from 'next'
import Link from 'next/link'
import { SHIGERU_MODELS } from '../_data/models'

export const metadata: Metadata = {
  title: 'Shigeru Kawai Grand Piano Models | SK-2 to SK-EX',
  description:
    "Explore all six Shigeru Kawai grand piano models — from the 5'11\" SK-2 Classic Salon Grand to the 9'1\" SK-EX Concert Grand. Each handcrafted at the Ryuyo factory in Hamamatsu, Japan.",
}

const standardFeatures = [
  'Kawai Millennium III ABS-Carbon action',
  '"Shiko Seion" hammers from New Zealand and Australian wool',
  'Tapered and tuned solid spruce soundboard',
  '"Temaki" Kawai-made hand wound bass strings',
  'Hand notched bridges',
  'Hand planed ribs',
  'Thinned hammer shanks',
  'Rock maple and mahogany rim',
  "Bird's eye maple inside rim",
  'Agraffe duplex scale',
  'Aluminum action rail',
  'Nickel plated tuning pins',
  'Solid brass hardware',
  '10-year transferrable warranty',
  'NEOTEX™ key surfaces',
  'Dual Pivot Damper Action',
  'Stretcher Over-Lap Integrated Design (SOLID)',
  'Final voicing by Master Piano Artisan (MPA)',
]

export default function ModelsPage() {
  return (
    <div className="bg-[#0a0a0a]">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 pt-24 pb-24 overflow-hidden">
        {/* Atmospheric glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(213,199,140,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            The Collection
          </p>

          <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mb-10" />

          <h1
            className="text-white font-light italic leading-[0.9] mb-10"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            }}
          >
            Six Grand Pianos
          </h1>

          <p
            className="text-white/35 text-sm leading-relaxed max-w-lg mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Each Shigeru Kawai model is handcrafted at the Ryuyo Grand Piano Factory in
            Hamamatsu, Japan — taking three to five times longer to complete than a standard
            instrument. From the intimate salon grand to the full concert instrument, one
            collection. Six expressions of the same commitment to excellence.
          </p>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase text-center mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            At a Glance
          </p>
          <h2
            className="text-kawai-black font-light italic text-center mb-16 leading-tight"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            }}
          >
            Model Specifications
          </h2>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-kawai-gold/20">
                  <th
                    className="text-left py-4 pr-8 text-kawai-gold text-[9px] tracking-[0.4em] uppercase font-normal"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Model
                  </th>
                  <th
                    className="text-left py-4 pr-8 text-kawai-gold text-[9px] tracking-[0.4em] uppercase font-normal"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Type
                  </th>
                  <th
                    className="text-left py-4 pr-8 text-kawai-gold text-[9px] tracking-[0.4em] uppercase font-normal"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Length
                  </th>
                  <th
                    className="text-left py-4 pr-8 text-kawai-gold text-[9px] tracking-[0.4em] uppercase font-normal"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Width
                  </th>
                  <th
                    className="text-left py-4 pr-8 text-kawai-gold text-[9px] tracking-[0.4em] uppercase font-normal"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Weight
                  </th>
                  <th
                    className="text-left py-4 text-kawai-gold text-[9px] tracking-[0.4em] uppercase font-normal"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Finishes
                  </th>
                </tr>
              </thead>
              <tbody>
                {SHIGERU_MODELS.map((model, i) => (
                  <tr
                    key={model.slug}
                    className={`border-b ${i === SHIGERU_MODELS.length - 1 ? 'border-transparent' : 'border-kawai-black/8'} group`}
                  >
                    <td className="py-5 pr-8">
                      <Link
                        href={`/shigeru/models/${model.slug}`}
                        className="text-kawai-black group-hover:text-kawai-charcoal transition-colors duration-200"
                        style={{
                          fontFamily: 'var(--font-brand-luxury)',
                          fontSize: '1.25rem',
                          fontStyle: 'italic',
                          fontWeight: 300,
                        }}
                      >
                        {model.name}
                      </Link>
                    </td>
                    <td className="py-5 pr-8">
                      <span
                        className="text-kawai-charcoal/60 text-xs"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.type}
                      </span>
                    </td>
                    <td className="py-5 pr-8">
                      <span
                        className="text-kawai-black text-sm"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.feet}
                        <span className="text-kawai-charcoal/40 text-xs ml-1.5">
                          {model.cm}
                        </span>
                      </span>
                    </td>
                    <td className="py-5 pr-8">
                      <span
                        className="text-kawai-black text-sm"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.width}
                        <span className="text-kawai-charcoal/40 text-xs ml-1.5">
                          {model.widthCm}
                        </span>
                      </span>
                    </td>
                    <td className="py-5 pr-8">
                      <span
                        className="text-kawai-black text-sm"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.weight}
                        <span className="text-kawai-charcoal/40 text-xs ml-1.5">
                          {model.weightKg}
                        </span>
                      </span>
                    </td>
                    <td className="py-5">
                      <span
                        className="text-kawai-charcoal/55 text-xs leading-relaxed"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.finishes.join(' · ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MODELS GRID ───────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-8 mb-20">
            <div>
              <p
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Explore Each Model
              </p>
              <h2
                className="text-white font-light italic leading-none"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                }}
              >
                The Complete Range
              </h2>
            </div>
            <span className="hidden md:block flex-1 h-px bg-white/[0.05] mb-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {SHIGERU_MODELS.map((model) => (
              <article
                key={model.slug}
                className="group bg-[#0a0a0a] hover:bg-[#0f0d09] p-10 flex flex-col transition-colors duration-500"
              >
                {/* Model name */}
                <span
                  className="text-white group-hover:text-kawai-gold font-light italic leading-none transition-colors duration-500 mb-5"
                  style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '3.5rem' }}
                >
                  {model.name}
                </span>

                {/* Type in small-caps gold */}
                <p
                  className="text-kawai-gold text-[9px] tracking-[0.35em] uppercase mb-4"
                  style={{
                    fontFamily: 'var(--font-brand-sans)',
                    fontVariant: 'small-caps',
                    letterSpacing: '0.2em',
                  }}
                >
                  {model.type}
                </p>

                <span className="block w-full h-px bg-white/[0.06] mb-5" />

                {/* Dimensions */}
                <p
                  className="text-white/25 text-xs tracking-wide mb-6"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {model.feet}&ensp;/&ensp;{model.cm}
                </p>

                {/* Tagline */}
                <p
                  className="text-white/40 text-sm font-light italic leading-relaxed mb-8 mt-auto"
                  style={{ fontFamily: 'var(--font-brand-luxury)' }}
                >
                  {model.tagline}
                </p>

                {/* CTA */}
                <Link
                  href={`/shigeru/models/${model.slug}`}
                  className="self-start text-kawai-gold/60 group-hover:text-kawai-gold border border-kawai-gold/20 group-hover:border-kawai-gold/50 px-5 py-2.5 text-[9px] tracking-[0.3em] uppercase transition-all duration-300"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  Explore →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── STANDARD FEATURES ─────────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-28">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-kawai-charcoal/40 text-[10px] tracking-[0.45em] uppercase text-center mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Standard Across All Models
          </p>
          <h2
            className="text-kawai-black font-light italic text-center mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            }}
          >
            Built Into Every Instrument
          </h2>
          <p
            className="text-kawai-charcoal/50 text-sm text-center mb-16 max-w-lg mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Every Shigeru Kawai grand piano — from SK-2 to SK-EX — includes these features as
            standard. No options. No tiers. Only the finest.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-5">
            {standardFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-4">
                <span className="mt-2 flex-shrink-0 block w-1 h-1 rounded-full bg-kawai-gold opacity-60" />
                <p
                  className="text-kawai-charcoal/70 text-sm leading-snug"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-kawai-charcoal/30 text-xs text-center mt-14 italic"
            style={{ fontFamily: 'var(--font-brand-luxury)' }}
          >
            All models include a 10-year transferrable warranty and Master Piano Artisan
            in-home service.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-28">
        <div className="max-w-xl mx-auto text-center">
          <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mb-14" />

          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Experience Shigeru Kawai
          </p>
          <h2
            className="text-white font-light italic leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            }}
          >
            Hear One in Person
          </h2>
          <p
            className="text-white/35 text-sm leading-relaxed mb-14 max-w-sm mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            No description can replace the experience of sitting before a Shigeru Kawai grand.
            Find an authorized dealer and arrange a private appointment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shigeru/dealers"
              className="inline-flex items-center gap-3 border border-kawai-gold/35 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Find a Dealer
            </Link>
            <Link
              href="/shigeru/contact"
              className="inline-flex items-center gap-3 border border-white/10 hover:border-white/25 text-white/35 hover:text-white/60 px-9 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Contact Us
            </Link>
          </div>

          <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mt-14" />
        </div>
      </section>

    </div>
  )
}
