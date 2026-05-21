import { Check, X } from 'lucide-react'

interface CoverageAccordionProps {
  category: 'digital' | 'acoustic'
}

const acousticCovered = [
  'Manufacturing defects in materials and workmanship for ten (10) years',
  'Coverage on all Kawai grand, upright, and Shigeru Kawai pianos',
  'Repair by Kawai or authorized representative at no charge',
  'Transferable to subsequent owners',
]

const acousticNotCovered = [
  'Accidental damage',
  'Abuse, modification, or negligence',
  'Altered or removed serial number',
  'Improperly repaired or serviced',
  'Damage from environmental extremes (temperature, humidity)',
  'Routine maintenance: tuning, regulation, voicing',
]

const digitalCovered = [
  'Manufacturing defects in materials and workmanship',
  'Electronic components and circuit boards',
  'Key action and touch response mechanisms',
  'Speaker and amplification systems',
  'Cabinet and structural components',
]

const digitalNotCovered = [
  'Accident, negligence, misuse, or improper installation',
  'Shipping damage (file claims with the carrier)',
  'Unauthorized repair attempts',
  'Altered or removed serial numbers',
  'Normal wear and tear',
  'Damage from environmental extremes',
  'Power surge, lightning, acts of God',
]

export function CoverageAccordion({ category }: CoverageAccordionProps) {
  const covered = category === 'acoustic' ? acousticCovered : digitalCovered
  const notCovered = category === 'acoustic' ? acousticNotCovered : digitalNotCovered

  return (
    <div className="space-y-2 not-prose">
      <details className="group border-t border-kawai-neutral">
        <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4">
          <span className="text-[14px] font-semibold text-kawai-charcoal">What&apos;s covered</span>
          <svg
            className="w-4 h-4 text-kawai-charcoal/40 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <ul className="pb-5 space-y-2.5">
          {covered.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[14px] text-kawai-charcoal/75 leading-relaxed">
              <Check className="w-4 h-4 text-kawai-charcoal/60 shrink-0 mt-0.5" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </details>
      <details className="group border-t border-kawai-neutral">
        <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4">
          <span className="text-[14px] font-semibold text-kawai-charcoal">What&apos;s not covered</span>
          <svg
            className="w-4 h-4 text-kawai-charcoal/40 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <ul className="pb-5 space-y-2.5">
          {notCovered.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[14px] text-kawai-charcoal/60 leading-relaxed">
              <X className="w-4 h-4 text-kawai-charcoal/30 shrink-0 mt-0.5" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
