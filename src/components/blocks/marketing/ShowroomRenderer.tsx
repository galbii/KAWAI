import type { MarketingShowroomBlock } from '@/payload-types'
import { ShowroomLocation } from '@/components/homepage/showroom-location'
import type { ShowroomSectionData } from '@/lib/types/homepage'

export function ShowroomRenderer(props: MarketingShowroomBlock) {
  const showroomData: ShowroomSectionData = {
    sectionHeader: props.sectionHeader,
    showroomTitle: props.showroomTitle,
    showroomDescription: props.showroomDescription,
    showroomInfo: {
      name: props.showroomInfo.name,
      address: props.showroomInfo.address,
      phone: props.showroomInfo.phone,
      serviceArea: props.showroomInfo.serviceArea,
    },
    hours: props.hours.map((h) => ({
      day: h.day,
      time: h.time,
    })),
    features: props.features.map((f) => ({
      icon: f.icon,
      title: f.title,
      description: f.description,
    })),
    showroomCtas: {
      directionsText: props.showroomCtas?.directionsText || 'Get Directions',
      directionsLink: props.showroomCtas?.directionsLink || 'https://maps.google.com',
      scheduleText: props.showroomCtas?.scheduleText || 'Schedule Visit',
      scheduleLink: props.showroomCtas?.scheduleLink || '/contact',
    },
  }

  return <ShowroomLocation data={showroomData} />
}
