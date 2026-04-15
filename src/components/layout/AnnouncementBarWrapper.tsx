import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
// AnnouncementBar is a 'use client' component — Server Components can import Client
// Components statically. It's wrapped in <Suspense fallback={null}> in the layout,
// so the static import adds no blocking overhead on the critical path.
import { AnnouncementBar } from './AnnouncementBar'

// Cached fetch — avoids a raw uncached MongoDB hit on every render.
// Same home-page tag as all other header queries so a CMS save invalidates together.
const getAnnouncementBarConfig = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'home-page',
        limit: 1,
        depth: 0,
        select: { announcementBar: true } as never,
      })
      return (result.docs[0] as any)?.announcementBar ?? null
    } catch (err) {
      console.error('[getAnnouncementBarConfig]', err)
      return null
    }
  },
  ['announcement-bar-config'],
  { tags: ['home-page'], revalidate: 600 }
)

export async function AnnouncementBarWrapper() {
  try {
    const announcementBar = await getAnnouncementBarConfig()

    if (!announcementBar?.enabled) return null
    if (!announcementBar.messages || announcementBar.messages.length === 0) return null

    const messages = announcementBar.messages
      .map((msg: { text: string }) => msg.text)
      .filter((text: string) => text && text.trim().length > 0)

    if (messages.length === 0) return null

    const barProps = {
      messages,
      style: announcementBar.style || ('gradient' as const),
      size: announcementBar.size || ('medium' as const),
      speed: announcementBar.speed || 40,
      divider: announcementBar.divider || ('bullet' as const),
      ...(announcementBar.link ? { link: announcementBar.link } : {}),
    }

    return <AnnouncementBar {...barProps} />
  } catch (error) {
    console.error('Failed to fetch announcement bar:', error)
    return null
  }
}
