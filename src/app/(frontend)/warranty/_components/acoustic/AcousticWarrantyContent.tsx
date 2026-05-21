'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, X, ArrowRight, Award, Repeat, ShieldCheck } from 'lucide-react'
import { ServiceAndClaims } from '../ServiceAndClaims'
import { RegisterCTA } from '../RegisterCTA'
import { WarrantyFromBanner } from '../WarrantyFromBanner'

const covered = [
  'Manufacturing defects in materials and workmanship for ten (10) years from original date of purchase',
  'Coverage on all Kawai grand pianos — including the SK and GX series',
  'Coverage on all Kawai upright pianos — including the K and ND series',
  'Coverage on Shigeru Kawai pianos, hand-crafted by Master Piano Artisans',
  'Repair by Kawai or its authorized representative at no charge',
  'Transferable to subsequent owners for the duration of the ten-year term',
]

const notCovered = [
  { title: 'Accidental damage', detail: 'Damage resulting from accident or impact.' },
  { title: 'Abuse, modification, or negligence', detail: 'Damage caused by misuse, unauthorized modification, or negligent care.' },
  { title: 'Altered or removed serial number', detail: 'Factory serial number removed, altered, or defaced.' },
  { title: 'Improper repair or service', detail: 'Repair by anyone other than Kawai or an authorized representative.' },
  { title: 'Environmental extremes', detail: 'Damage from extremes of temperature or humidity.' },
  { title: 'Routine maintenance', detail: 'Tuning, regulation, voicing, and normal wear and tear.' },
]

export function AcousticWarrantyContent() {
  const searchParams = useSearchParams()
  const fromModel = searchParams.get('from') ?? undefined

  return (
    <div className="container mx-auto px-6 max-w-2xl pt-10 pb-20 space-y-12">
      {fromModel && <WarrantyFromBanner model={fromModel} />}

      {/* Hero callout — full-bleed dark slab */}
      <div className="bg-kawai-charcoal text-white rounded-2xl p-8 md:p-10 -mx-2">
        <div className="flex items-start gap-4 mb-5">
          <Award className="w-9 h-9 text-kawai-red shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-red mb-1">
              Full Warranty
            </p>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
              Full Ten (10) Year Transferable Warranty
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/10">
          <div>
            <ShieldCheck className="w-4 h-4 text-kawai-red mb-1.5" />
            <p className="text-[13px] font-semibold leading-tight">10 Years</p>
            <p className="text-[11px] text-gray-400 leading-tight mt-0.5">From purchase date</p>
          </div>
          <div>
            <Repeat className="w-4 h-4 text-kawai-red mb-1.5" />
            <p className="text-[13px] font-semibold leading-tight">Transferable</p>
            <p className="text-[11px] text-gray-400 leading-tight mt-0.5">To future owners</p>
          </div>
          <div>
            <Award className="w-4 h-4 text-kawai-red mb-1.5" />
            <p className="text-[13px] font-semibold leading-tight">Full coverage</p>
            <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Parts &amp; labor</p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="space-y-3 text-[15px] text-kawai-charcoal/80 leading-relaxed">
        <p>
          Kawai warrants your new piano to be free from defects in workmanship and materials for
          a period of ten (10) years from the original date of purchase from an authorized Kawai
          dealer.
        </p>
        <p className="text-kawai-charcoal/65">
          This warranty applies to acoustic grand and upright pianos — including the Shigeru
          Kawai series — purchased and located in the United States and Canada.
        </p>
      </div>

      {/* What's covered */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-4">
          What&apos;s covered
        </p>
        <ul className="space-y-2.5">
          {covered.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[14px] text-kawai-charcoal/80 leading-relaxed">
              <Check className="w-4 h-4 text-kawai-charcoal/60 shrink-0 mt-0.5" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* What's not covered */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-4">
          What&apos;s not covered
        </p>
        <ul className="space-y-4">
          {notCovered.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <X className="w-4 h-4 text-kawai-charcoal/30 shrink-0 mt-1" strokeWidth={2.5} />
              <div>
                <p className="text-[14px] font-semibold text-kawai-charcoal/80">{item.title}</p>
                <p className="text-[13px] text-kawai-charcoal/55 leading-relaxed">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[12px] text-kawai-charcoal/45 leading-relaxed">
          Returned warranty cards will be recorded by Kawai for reference in the event that
          warranty service is required.
        </p>
      </div>

      {/* Remedy & Liability — collapsed by default */}
      <details className="group border-t border-kawai-neutral">
        <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4">
          <span className="text-[14px] font-semibold text-kawai-charcoal">Remedy &amp; liability</span>
          <svg
            className="w-4 h-4 text-kawai-charcoal/40 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="pb-5 space-y-3 text-[13px] text-kawai-charcoal/65 leading-relaxed">
          <p>
            Upon discovery of a problem, contact your Kawai dealer. If Kawai determines the
            problem is a direct result of defective workmanship or materials, Kawai — through its
            authorized representative — will repair the defect within a reasonable period of time
            without charge. <strong>Authorization by Kawai is required prior to any remedy.</strong>
          </p>
          <p>
            In the event that your piano shall prove defective, your remedy shall be the repair
            as stated. Under no circumstances shall Kawai be liable for any loss or damage —
            direct, incidental, or consequential — arising from the use of, or inability to use
            this piano unless provided otherwise by state law.
          </p>
          <p>
            This warranty is in lieu of all other warranties (whether express or implied) and
            applies only to pianos located in and purchased from an authorized Kawai dealer in
            the United States and Canada.
          </p>
        </div>
      </details>

      {/* Magnuson-Moss — collapsed */}
      <details className="group border-t border-kawai-neutral">
        <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4">
          <span className="text-[14px] font-semibold text-kawai-charcoal">Magnuson-Moss disclosure</span>
          <svg
            className="w-4 h-4 text-kawai-charcoal/40 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="pb-5 space-y-3 text-[13px] text-kawai-charcoal/65 leading-relaxed">
          <p>
            The Magnuson-Moss Consumer Warranty Act requires any warranty that cannot qualify as
            a &ldquo;Full Warranty&rdquo; be prominently labeled &ldquo;Limited Warranty.&rdquo;
          </p>
          <p className="font-semibold text-kawai-charcoal">
            Your Kawai piano carries a FULL TEN YEAR TRANSFERABLE WARRANTY.
          </p>
        </div>
      </details>

      {/* Service + Register */}
      <div className="space-y-10 pt-6 border-t border-kawai-neutral">
        <ServiceAndClaims />
        <RegisterCTA />
      </div>

      {/* Cross-link */}
      <div className="pt-6 border-t border-kawai-neutral flex items-center justify-between gap-4 flex-wrap">
        <p className="text-[14px] text-kawai-charcoal/65">
          Have a digital piano?{' '}
          <span className="text-kawai-charcoal/45">3- or 5-year limited coverage by series.</span>
        </p>
        <Link
          href="/warranty/digital"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-kawai-red hover:underline"
        >
          Digital warranty
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <p className="text-[12px] text-kawai-charcoal/40 leading-relaxed">
        Applies only to acoustic pianos located in and purchased from an authorized Kawai dealer
        in the United States and Canada.{' '}
        <Link href="/pianos/grand" className="text-kawai-red hover:underline">Browse grands</Link>
        {' · '}
        <Link href="/pianos/upright" className="text-kawai-red hover:underline">Browse uprights</Link>
        {' · '}
        <Link href="/find-a-dealer" className="text-kawai-red hover:underline">Find a dealer</Link>
      </p>
    </div>
  )
}
