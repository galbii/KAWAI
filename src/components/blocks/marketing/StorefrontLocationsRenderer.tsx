import type { MarketingStorefrontLocationsBlock } from '@/payload-types'
import { DealerLocations } from '@/components/homepage/dealer-locations'
import { getActiveStorefrontsDirect } from '@/lib/payload/queries'

export async function StorefrontLocationsRenderer(props: MarketingStorefrontLocationsBlock) {
  // Fetch active storefronts from database
  const locations = await getActiveStorefrontsDirect()

  const dealerData = {
    sectionLabel: props.sectionLabel || 'Our Locations',
    sectionDescription: props.sectionDescription || '',
    ctaSubheading: props.ctaSubheading || "Can't find a location near you?",
    ctaButtonText: props.ctaButtonText,
    ctaButtonLink: props.ctaButtonLink,
  }

  return <DealerLocations locations={locations} data={dealerData} />
}
