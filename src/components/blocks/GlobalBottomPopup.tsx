import { getHomePageDataDirect } from '@/lib/payload/queries'
import { BottomLeftPopupBlock } from './BottomLeftPopupBlock'

/**
 * Site-wide mount for the Bottom Popup block.
 *
 * The popup is authored as a `layout-bottom-left-popup` block on the homepage.
 * When its "Show on all pages" toggle is on, this component (rendered once in the
 * frontend layout) surfaces it across the whole site. Data comes from the already
 * cached `getHomePageDataDirect()` — no extra DB query or cache tag.
 *
 * The homepage inline instance (via RenderBlocks) defers to this one when
 * showOnAllPages is set, so exactly one popup ever renders.
 */
export async function GlobalBottomPopup() {
  const data = await getHomePageDataDirect()
  const content = (data?.content ?? []) as Array<Record<string, unknown>>
  const block = content.find((b) => b?.blockType === 'layout-bottom-left-popup')

  if (!block || block.showOnAllPages !== true) return null

  return <BottomLeftPopupBlock {...(block as Record<string, unknown>)} isGlobalMount />
}
