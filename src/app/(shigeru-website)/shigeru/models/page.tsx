import type { Metadata } from 'next'
import Link from 'next/link'
import { SHIGERU_MODELS } from '../_data/models'
import { getShigeruPageData } from '../_data/shopify'
import { HeroAnimated } from './_components/HeroAnimated'
import { ModelCard } from './_components/ModelCard'
import { ModelProgressIndicator } from './_components/ModelProgressIndicator'

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

export default async function ModelsPage() {
  const productData = await getShigeruPageData()

  return (
    <div className="bg-white">

      {/* ── FIXED PROGRESS INDICATOR ──────────────────────────── */}
      <ModelProgressIndicator />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 pt-40 pb-36 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(213,199,140,0.07) 0%, transparent 70%)',
          }}
        />
        <HeroAnimated />
      </section>

      {/* ── ALTERNATING MODEL CARDS ───────────────────────────── */}
      <section>
        {SHIGERU_MODELS.map((model, i) => {
          const shopifyKey = model.slug.replace(/-/g, '')
          const shopifyData = productData[shopifyKey] ?? null
          return (
            <ModelCard
              key={model.slug}
              model={model}
              index={i}
              imageUrl={shopifyData?.imageUrl ?? null}
              shopifyFinishes={shopifyData?.finishes ?? null}
            />
          )
        })}
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────── */}
      <section className="bg-white px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-gold text-[13px] tracking-[0.45em] uppercase text-center mb-8"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            At a Glance
          </p>
          <h2
            className="text-kawai-black font-bold text-center mb-20 leading-tight uppercase"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)',
              letterSpacing: '0.06em',
            }}
          >
            Model Specifications
          </h2>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-kawai-gold/20">
                  {['Model', 'Type', 'Length', 'Width', 'Weight', 'Finishes'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-5 pr-8 last:pr-0 text-kawai-gold text-[11px] tracking-[0.4em] uppercase font-normal"
                      style={{ fontFamily: 'var(--font-oswald)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHIGERU_MODELS.map((model, i) => (
                  <tr
                    key={model.slug}
                    className={`border-b ${i === SHIGERU_MODELS.length - 1 ? 'border-transparent' : 'border-kawai-black/[0.08]'} group`}
                  >
                    <td className="py-6 pr-8">
                      <Link
                        href={`/shigeru/models/${model.slug}`}
                        className="text-kawai-black group-hover:text-kawai-charcoal transition-colors duration-200"
                        style={{
                          fontFamily: 'var(--font-oswald)',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {model.name}
                      </Link>
                    </td>
                    <td className="py-6 pr-8">
                      <span
                        className="text-kawai-charcoal/60 text-sm"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.type}
                      </span>
                    </td>
                    <td className="py-6 pr-8">
                      <span
                        className="text-kawai-black text-base"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.feet}
                        <span className="text-kawai-charcoal/40 text-sm ml-2">{model.cm}</span>
                      </span>
                    </td>
                    <td className="py-6 pr-8">
                      <span
                        className="text-kawai-black text-base"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.width}
                        <span className="text-kawai-charcoal/40 text-sm ml-2">{model.widthCm}</span>
                      </span>
                    </td>
                    <td className="py-6 pr-8">
                      <span
                        className="text-kawai-black text-base"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.weight}
                        <span className="text-kawai-charcoal/40 text-sm ml-2">{model.weightKg}</span>
                      </span>
                    </td>
                    <td className="py-6">
                      <span
                        className="text-kawai-charcoal/55 text-sm leading-relaxed"
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

      {/* ── STANDARD FEATURES ─────────────────────────────────── */}
      <section className="bg-white px-6 py-32">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-kawai-gold text-[13px] tracking-[0.45em] uppercase text-center mb-8"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            Standard Across All Models
          </p>
          <h2
            className="text-kawai-black font-bold text-center mb-6 leading-tight uppercase"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)',
              letterSpacing: '0.06em',
            }}
          >
            Built Into Every Instrument
          </h2>
          <p
            className="text-kawai-charcoal/50 text-base text-center mb-20 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Every Shigeru Kawai grand piano — from SK-2 to SK-EX — includes these features as
            standard. No options. No tiers. Only the finest.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-7">
            {standardFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-4">
                <span className="mt-[9px] flex-shrink-0 block w-1 h-1 rounded-full bg-kawai-gold opacity-60" />
                <p
                  className="text-kawai-charcoal/65 text-base leading-snug"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-kawai-charcoal/35 text-sm text-center mt-16 italic"
            style={{ fontFamily: 'var(--font-brand-luxury)' }}
          >
            All models include a 10-year transferrable warranty and Master Piano Artisan
            in-home service.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-white border-t border-kawai-black/[0.07] px-6 py-32">
        <div className="max-w-xl mx-auto text-center">
          <span className="block h-px w-12 bg-kawai-gold opacity-40 mx-auto mb-16" />

          <p
            className="text-kawai-gold text-[13px] tracking-[0.45em] uppercase mb-8"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            Experience Shigeru Kawai
          </p>
          <h2
            className="text-kawai-black font-bold leading-tight mb-8 uppercase"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              letterSpacing: '0.05em',
            }}
          >
            Hear One in Person
          </h2>
          <p
            className="text-kawai-charcoal/60 text-base leading-relaxed mb-16 max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            No description can replace the experience of sitting before a Shigeru Kawai grand.
            Find an authorized dealer and arrange a private appointment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shigeru/dealers"
              className="inline-flex items-center gap-3 border-2 border-kawai-gold/50 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/[0.08] px-11 py-5 transition-all duration-300"
              style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}
            >
              Find a Dealer
            </Link>
            <Link
              href="/shigeru/contact"
              className="inline-flex items-center gap-3 border-2 border-kawai-black/15 hover:border-kawai-black/30 text-kawai-charcoal/50 hover:text-kawai-charcoal/80 px-11 py-5 transition-all duration-300"
              style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}
            >
              Contact Us
            </Link>
          </div>

          <span className="block h-px w-12 bg-kawai-gold opacity-40 mx-auto mt-16" />
        </div>
      </section>

    </div>
  )
}
