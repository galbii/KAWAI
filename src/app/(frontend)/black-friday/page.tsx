import type { Metadata } from 'next'
import { SalePage, saleMetadata } from './_components/SalePage'

export const revalidate = 3600

export function generateMetadata(): Promise<Metadata> {
  return saleMetadata('main')
}

/** /black-friday: the fall-financing offers, framed as a sale through Nov 30. */
export default function BlackFridayPage() {
  return <SalePage variant="main" />
}
