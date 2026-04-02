'use client'

import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WarrantyTab {
  id: string
  label: string
  seriesName: string
  description: string
  warrantyDuration: string
  warrantyNote?: string
  covered: string[]
  notCovered: string[]
  pdfUrl: string
}

export const tabs: WarrantyTab[] = [
  {
    id: 'cn-ca-dg-nv',
    label: 'CN · CA · DG · NV',
    seriesName: 'CN, CA, DG & NV Series — Digital & Hybrid Pianos',
    description:
      "Covers the CN, CA, DG, and NV series — Kawai's flagship digital and hybrid piano instruments.",
    warrantyDuration: '5-Year Limited Warranty — parts and labor from original purchase date.',
    warrantyNote: 'Kawai will first attempt to perform service at the location of the instrument.',
    covered: [
      'Manufacturing defects in materials and workmanship',
      'Electronic components and circuit boards',
      'Action and key mechanism components',
      'Speaker and amplification systems',
      'Cabinet and structural components',
      'Power supply components',
    ],
    notCovered: [
      'Damage from accident, negligence, misuse, or improper installation',
      'Shipping damage (claims must be filed with the carrier)',
      'Repair or attempted repair by unauthorized parties',
      'Units with altered, defaced, or removed serial numbers',
      'Normal wear and tear or periodic maintenance',
      'Deterioration from perspiration, corrosion, extreme temperature, or humidity',
      'Power line surge, lightning damage, or acts of God',
      'RFI/EMI interference from improper grounding or uncertified equipment',
    ],
    pdfUrl:
      'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/WARRANTY%20CARD_CN,%20CA,%20DG,%20NV.pdf',
  },
  {
    id: 'cx-kdp-es',
    label: 'CX · KDP · ES',
    seriesName: 'CX, KDP & ES Series — Digital Pianos',
    description:
      "Covers the CX, KDP, and ES series — Kawai's versatile range of digital pianos from portable instruments to full-console models.",
    warrantyDuration: '3-Year Limited Warranty — parts and labor from original purchase date.',
    covered: [
      'Manufacturing defects in materials and workmanship',
      'Electronic components and circuit boards',
      'Key action and touch response mechanisms',
      'Speaker and audio output systems',
      'Power supply components',
    ],
    notCovered: [
      'Damage from accident, negligence, misuse, or improper installation',
      'Shipping damage (claims must be filed with the carrier)',
      'Repair or attempted repair by unauthorized parties',
      'Units with altered, defaced, or removed serial numbers',
      'Normal wear and tear or periodic maintenance',
      'Deterioration from perspiration, corrosion, extreme temperature, or humidity',
      'Power line surge, lightning damage, or acts of God',
      'RFI/EMI interference from improper grounding or uncertified equipment',
    ],
    pdfUrl:
      'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/WARRANTY%20CARD_CX,%20KDP,%20ES.pdf',
  },
  {
    id: 'mp-vpc',
    label: 'MP · VPC',
    seriesName: 'MP Stage Pianos & VPC',
    description:
      'Covers the MP Stage Piano and VPC Virtual Piano Controller series — purpose-built instruments for professional performance and studio use.',
    warrantyDuration:
      '1-Year Labor / 3-Year Parts Warranty — no charge for labor for 1 year; no charge for parts for 3 years from original purchase date.',
    covered: [
      'Manufacturing defects in materials and workmanship',
      'Electronic components and MIDI/audio circuitry',
      'Hammer action mechanism components',
      'Connectivity ports and interfaces',
      'Power supply components',
    ],
    notCovered: [
      'Damage from accident, negligence, misuse, or improper installation',
      'Shipping damage (claims must be filed with the carrier)',
      'Repair or attempted repair by unauthorized parties',
      'Units with altered, defaced, or removed serial numbers',
      'Normal wear and tear or periodic maintenance',
      'Deterioration from perspiration, corrosion, extreme temperature, or humidity',
      'Power line surge, lightning damage, or acts of God',
      'RFI/EMI interference from improper grounding or uncertified equipment',
    ],
    pdfUrl:
      'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/WARRANTY%20CARD_MP,%20VPC.pdf',
  },
]

// ─── Pills ────────────────────────────────────────────────────────────────────

interface WarrantyTabPillsProps {
  activeTab: string
  onTabChange: (id: string) => void
}

export function WarrantyTabPills({ activeTab, onTabChange }: WarrantyTabPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
            activeTab === tab.id
              ? 'bg-kawai-red text-white shadow-sm'
              : 'border border-kawai-neutral bg-white text-kawai-charcoal hover:border-kawai-red/50',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

interface WarrantyTabPanelProps {
  activeTab: string
}

export function WarrantyTabPanel({ activeTab }: WarrantyTabPanelProps) {
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0]!

  return (
    <div className="bg-white border border-kawai-neutral rounded-xl overflow-hidden">
      {/* Series header */}
      <div className="px-6 pt-6 pb-5 border-b border-kawai-neutral">
        <h3 className="text-xl font-bold text-kawai-black font-[family-name:var(--font-brand-luxury)] mb-1">
          {current.seriesName}
        </h3>
        <p className="text-[15px] text-kawai-charcoal/70 leading-relaxed">{current.description}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Covered / Not Covered grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-kawai-charcoal/50 mb-3">
              What&apos;s Covered
            </p>
            <ul className="space-y-2.5">
              {current.covered.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle
                    className="w-4.5 h-4.5 text-kawai-red shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <span className="text-[15px] text-kawai-charcoal/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-kawai-charcoal/50 mb-3">
              What&apos;s Not Covered
            </p>
            <ul className="space-y-2.5">
              {current.notCovered.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <XCircle
                    className="w-4.5 h-4.5 text-kawai-charcoal/30 shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <span className="text-[15px] text-kawai-charcoal/50 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coverage Duration callout */}
        <div className="border-l-4 border-kawai-red bg-kawai-pearl px-5 py-4 rounded-r-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-kawai-charcoal/50 mb-1">
            Coverage Duration
          </p>
          <p className="text-[15px] text-kawai-charcoal/80 leading-relaxed">
            {current.warrantyDuration}
          </p>
          {current.warrantyNote && (
            <p className="text-[13px] text-kawai-charcoal/60 leading-relaxed mt-1.5">
              {current.warrantyNote}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="not-prose flex flex-col items-center gap-3 pt-2">
          <a
            href={current.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-kawai-red hover:bg-kawai-red-700 !text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 text-sm no-underline"
          >
            <ExternalLink className="w-4 h-4" />
            View Full Warranty Card
          </a>
        </div>
      </div>
    </div>
  )
}
