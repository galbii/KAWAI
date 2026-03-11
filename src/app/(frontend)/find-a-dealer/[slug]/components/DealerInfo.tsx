import type { Dealer } from '@/payload-types'

interface DealerInfoProps {
  dealer: Dealer
}

export function DealerInfo({ dealer }: DealerInfoProps) {
  const location = [dealer.address?.city, dealer.address?.state].filter(Boolean).join(', ')

  const description =
    dealer.description?.trim() ||
    `${dealer.dealerName} is an authorized Kawai piano dealer located in ${location || 'your area'}. We offer expert consultation, a wide selection of acoustic and digital pianos, and dedicated professional service.`

  const hasShigeru = dealer.shigeruKawaiDealer === true
  const hasAcoustic = dealer.acousticPianoDealer === true
  const hasProfessional = dealer.professionalProductDealer === true
  const hasDealerTypes = hasShigeru || hasAcoustic || hasProfessional

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
        </div>
      </div>

      {/* Dealer Specializations */}
      {hasDealerTypes && (
        <div>
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Dealer Specializations
          </div>
          <div className="flex flex-wrap gap-2">
            {hasShigeru && (
              <span className="px-3 py-1 bg-kawai-gold/10 text-kawai-gold text-xs font-medium rounded-full border border-kawai-gold/20">
                Shigeru Kawai Dealer
              </span>
            )}
            {hasAcoustic && (
              <span className="px-3 py-1 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full">
                Acoustic Piano Dealer
              </span>
            )}
            {hasProfessional && (
              <span className="px-3 py-1 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full">
                Professional Product Dealer
              </span>
            )}
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
