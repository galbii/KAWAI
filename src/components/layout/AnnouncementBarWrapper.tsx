import { getPayload } from 'payload'
import config from '@payload-config'
import { AnnouncementBar } from './AnnouncementBar'

export async function AnnouncementBarWrapper() {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'home-page',
      limit: 1,
      depth: 0,
    })

    if (!result.docs || result.docs.length === 0) {
      return null
    }

    const homePage = result.docs[0]
    if (!homePage) {
      return null
    }

    const announcementBar = homePage.announcementBar

    // Check if announcement bar is enabled
    if (!announcementBar?.enabled) {
      return null
    }

    // Check if there are messages
    if (!announcementBar.messages || announcementBar.messages.length === 0) {
      return null
    }

    // Extract messages from the array
    const messages = announcementBar.messages
      .map((msg: { text: string }) => msg.text)
      .filter((text: string) => text && text.trim().length > 0)

    if (messages.length === 0) {
      return null
    }

    // Build props object conditionally
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
