'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { getNearestStorefrontForLead } from '@/lib/actions/nearby-dealers'
import type { NearbyStorefrontOption } from '@/lib/rsm/nearby-storefront'

/**
 * Post-submit promotion for the lead's nearest official Kawai showroom.
 *
 * Rendered in a lead form's confirmation state. It looks the showroom up from
 * the ZIP the visitor just gave, with the same matcher that decides which
 * showroom is sent the lead, so the store a visitor is pointed at is the store
 * that will call them. Renders nothing until it has an answer, and nothing at
 * all when no showroom is in range — most leads are served by independent
 * dealers, and their confirmation must look exactly as it did before.
 *
 * The click pushes `storefront_referral` to the dataLayer so GTM can attribute
 * showroom visits to the campaign that produced them.
 */
export function NearestShowroomCard({ zip, source }: { zip: string | null; source: string }) {
  const [storefront, setStorefront] = useState<NearbyStorefrontOption | null>(null)

  useEffect(() => {
    if (!zip) return
    let cancelled = false
    getNearestStorefrontForLead(zip)
      .then((sf) => {
        if (!cancelled) setStorefront(sf)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [zip])

  if (!storefront) return null

  const track = (action: 'visit' | 'call') => {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({
      event: 'storefront_referral',
      event_category: 'lead',
      event_label: source,
      storefront: storefront.slug,
      action,
    })
  }

  const where = storefront.coveredZip
    ? storefront.location
    : [storefront.location, `${storefront.distance.toFixed(0)} mi away`].filter(Boolean).join(' · ')

  return (
    <div className="w-full max-w-xs border border-kawai-neutral bg-white px-5 py-4 text-left">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-kawai-red">
        Your nearest Kawai showroom
      </p>
      <p className="mt-1.5 text-base font-semibold text-kawai-black">Kawai {storefront.name}</p>
      {where && (
        <p className="mt-0.5 flex items-center gap-1 text-sm text-kawai-charcoal/75">
          <MapPinIcon aria-hidden className="h-4 w-4 flex-shrink-0" />
          {where}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-kawai-charcoal/75">
        Play the full range in person — our team can have your shortlist ready when you visit.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          href={storefront.href}
          onClick={() => track('visit')}
          className="inline-flex items-center bg-kawai-red px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-kawai-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2"
        >
          Visit the showroom
        </Link>
        {storefront.phone && (
          <a
            href={`tel:${storefront.phone.replace(/[^\d+]/g, '')}`}
            onClick={() => track('call')}
            aria-label={`Call Kawai ${storefront.name} at ${storefront.phone}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-kawai-charcoal underline-offset-4 hover:text-kawai-red hover:underline"
          >
            <PhoneIcon aria-hidden className="h-4 w-4" />
            {storefront.phone}
          </a>
        )}
      </div>
    </div>
  )
}
