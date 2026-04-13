import { getSite } from '@/lib/site-context'
import { ProductHeroBlock } from './ProductHeroBlock'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<typeof ProductHeroBlock>, 'isCanada'>

/**
 * Server wrapper for ProductHeroBlock.
 * Reads the current site (US vs CA) and passes it down as a prop,
 * allowing the client component to conditionally hide price and cart buttons.
 */
export async function ProductHeroBlockWrapper(props: Props) {
  const site = await getSite()
  return <ProductHeroBlock {...props} isCanada={site === 'cad'} />
}
