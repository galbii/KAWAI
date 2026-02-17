import type { Dealer } from '@/payload-types'

interface DealerInfoProps {
  dealer: Dealer
}

const SERVICE_LABELS: Record<string, string> = {
  'authorized-dealer': 'Authorized Dealer',
  'full-service': 'Full Service',
  'grand-specialist': 'Grand Specialist',
  'digital-specialist': 'Digital Specialist',
  'tuning': 'Piano Tuning',
  'repair': 'Repair',
  'restoration': 'Restoration',
  'moving': 'Piano Moving',
  'rentals': 'Rentals',
  'financing': 'Financing',
  'trade-ins': 'Trade-Ins',
  'virtual-consult': 'Virtual Consult',
  'education': 'Education',
  'performance': 'Performance',
}

const DEALER_TYPE_LABELS: Record<string, string> = {
  'professional-products': 'Professional Products',
  'acoustic-digital': 'Acoustic & Digital',
}

export function DealerInfo({ dealer }: DealerInfoProps) {
  const location = [dealer.address?.city, dealer.address?.state].filter(Boolean).join(', ')

  const description =
    dealer.description?.trim() ||
    `${dealer.dealerName} is an authorized Kawai piano dealer located in ${location || 'your area'}. We offer expert consultation, a wide selection of acoustic and digital pianos, and dedicated professional service.`

  const hasDealerTypes = (dealer.dealerType?.length ?? 0) > 0
  const hasSpecialties = Boolean(dealer.specialties?.trim())
  const hasTags = (dealer.tags?.length ?? 0) > 0

  const yearsInBusiness =
    dealer.yearEstablished && dealer.yearEstablished > 0
      ? new Date().getFullYear() - dealer.yearEstablished
      : null

  return (
    <div className="space-y-10">
      {/* About */}
      <div>
        <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6">
          About This Dealer
        </div>
        <div className="space-y-4 text-lg text-kawai-black/80 leading-relaxed">
          <p>{description}</p>
          {hasSpecialties && dealer.specialties && (
            <p>{dealer.specialties}</p>
          )}
        </div>
      </div>

      {/* Dealer Types */}
      {hasDealerTypes && dealer.dealerType && (
        <div>
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Specializes In
          </div>
          <div className="flex flex-wrap gap-2">
            {dealer.dealerType.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full"
              >
                {DEALER_TYPE_LABELS[type] ?? type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Service Tags */}
      {hasTags && dealer.tags && (
        <div>
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Services
          </div>
          <div className="flex flex-wrap gap-2">
            {dealer.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full"
              >
                {SERVICE_LABELS[tag] ?? tag.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Divider + year footnote */}
      {dealer.yearEstablished && (
        <div className="pt-6 border-t border-kawai-pearl">
          <p className="text-xs sm:text-sm text-kawai-black/60 uppercase tracking-wider">
            Proudly serving since {dealer.yearEstablished}
            {yearsInBusiness !== null && yearsInBusiness > 0
              ? ` — ${yearsInBusiness} years`
              : ''}
          </p>
        </div>
      )}
    </div>
  )
}
