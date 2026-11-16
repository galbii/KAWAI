import type { Metadata } from 'next'
import { SalePage, saleMetadata } from '../black-friday/_components/SalePage'

export const revalidate = 3600

export function generateMetadata(): Promise<Metadata> {
  return saleMetadata('ext')
}

/**
 * /black-friday-ext: the standby extension. Same offers and creative as
 * /black-friday, framed as "extended" with no new date; it counts down to the
 * offers' own end. Not linked from anywhere and not a replacement for
 * /black-friday: it waits until Chance decides to extend.
 */
export default function BlackFridayExtPage() {
  return <SalePage variant="ext" />
}
