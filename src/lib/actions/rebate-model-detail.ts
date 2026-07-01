'use server'

import { getPayloadClient, getCollectionByHandle } from '@/lib/payload/queries'
import type { RebateModelDetail, RebateMediaItem } from '@/lib/payload/rebate-types'

/** Extract an 11-char YouTube id from a watch/embed/short URL (or a bare id). */
function youTubeId(url: unknown): string | null {
  if (typeof url !== 'string' || !url) return null
  const m = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]{11})/.exec(url)
  return m?.[1] ?? (/^[a-zA-Z0-9_-]{11}$/.test(url) ? url : null)
}

/** Coerce a loosely-typed Payload/Shopify metafield into a clean string list. */
function toStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return []
  return val.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
}

/** Pull a usable URL off a populated Media relation (or null). */
function mediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media) {
    const u = (media as { url?: unknown }).url
    return typeof u === 'string' ? u : null
  }
  return null
}

/**
 * Lazily fetch the cinematic detail for one rebated model — the Touch & Action /
 * Sound & Tone / Connectivity & Features descriptors (Shopify metafields synced
 * onto the Payload product) plus a collection "film" to play behind the modal.
 *
 * Additive and on-demand: this never runs during the rebate showcase query, so
 * how rebates are fetched is unchanged.
 */
export async function getRebateModelDetail(slug: string): Promise<RebateModelDetail> {
  const empty: RebateModelDetail = {
    action: [],
    tone: [],
    features: [],
    film: null,
    productImageUrl: null,
    media: [],
  }

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      select: {
        name: true,
        action: true,
        tone: true,
        features: true,
        imageUrl: true,
        shopifyMedia: true,
        customMedia: true,
        shopifyCollections: true,
      },
      depth: 1, // populate customMedia upload relations
      limit: 1,
      pagination: false,
    })

    const doc = res.docs[0]
    if (!doc) return empty

    // Gallery — watchable YouTube embeds (editor custom-media videos + the
    // collection film, prepended below) first, then Shopify IMAGE media (display
    // order) + editor custom-media images, all de-duped. Falls back to the
    // primary product image when there's nothing else.
    const alt = (typeof doc.name === 'string' && doc.name) || 'Product image'
    const seenImg = new Set<string>()
    const seenVid = new Set<string>()
    const images: RebateMediaItem[] = []
    const videos: RebateMediaItem[] = []
    const addImage = (url: string | null | undefined, a: string) => {
      if (typeof url === 'string' && url && !seenImg.has(url)) {
        seenImg.add(url)
        images.push({ type: 'image', url, alt: a })
      }
    }
    const addVideo = (url: unknown, a: string, prepend = false) => {
      const id = youTubeId(url)
      if (!id || seenVid.has(id)) return
      seenVid.add(id)
      const item: RebateMediaItem = { type: 'video', youtubeId: id, alt: a }
      if (prepend) videos.unshift(item)
      else videos.push(item)
    }

    if (Array.isArray(doc.shopifyMedia)) {
      for (const m of [...doc.shopifyMedia].sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))) {
        if (m?.mediaType === 'IMAGE') addImage(m?.imageUrl, (m?.alt as string) || alt)
      }
    }

    if (Array.isArray(doc.customMedia)) {
      for (const item of doc.customMedia) {
        if (item?.mediaType === 'youtube') {
          addVideo(item?.youtubeUrl, (item?.alt as string) || `${alt} — video`)
          continue
        }
        const img = item?.image
        const url =
          typeof img === 'string'
            ? img.startsWith('http')
              ? img
              : null
            : img && typeof img === 'object' && typeof (img as { url?: unknown }).url === 'string'
              ? ((img as { url: string }).url)
              : null
        addImage(url, (item?.alt as string) || alt)
      }
    }

    if (images.length === 0 && videos.length === 0) addImage(doc.imageUrl, alt)

    // Resolve a collection film (video preferred, image fallback) from the
    // product's collections — first one that actually has media wins.
    let film: RebateModelDetail['film'] = null
    const handles = (doc.shopifyCollections ?? [])
      .map((c) => c?.handle)
      .filter((h): h is string => typeof h === 'string' && h.length > 0)
      .slice(0, 5)

    for (const handle of handles) {
      const col = await getCollectionByHandle(handle)
      if (!col) continue
      const youtubeUrl = typeof col.youtubeUrl === 'string' && col.youtubeUrl ? col.youtubeUrl : null
      const imageUrl =
        mediaUrl(col.media) ?? (typeof col.imageUrl === 'string' ? col.imageUrl : null)
      if (youtubeUrl || imageUrl) {
        film = {
          youtubeUrl,
          imageUrl,
          heading: typeof col.heading === 'string' ? col.heading : null,
        }
        break
      }
    }

    // Lead the gallery with the collection film so it's the first thing to watch.
    if (film?.youtubeUrl) {
      const filmAlt = film.heading ? `${film.heading} — film` : `${alt} — collection film`
      addVideo(film.youtubeUrl, filmAlt, true)
    }

    return {
      action: toStringArray(doc.action),
      tone: toStringArray(doc.tone),
      features: toStringArray(doc.features),
      film,
      productImageUrl: typeof doc.imageUrl === 'string' ? doc.imageUrl : null,
      media: [...videos, ...images],
    }
  } catch (err) {
    console.error('[getRebateModelDetail] failed for', slug, err)
    return empty
  }
}
