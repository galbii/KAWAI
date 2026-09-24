import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'
import { getSoftwareReleases } from '@/lib/software/queries'
import { CATEGORY_LABELS, filterModels } from '@/lib/software/grouping'
import { matchesSoftwareIntent, SOFTWARE_DESTINATION, stripSoftwareTerms } from '@/lib/software/intent'

/** Firmware rows are a shortcut to an anchor on /software, not their own pages. */
interface FirmwareHit {
  slug: string
  model: string
  series: string
  categoryLabel: string
  /** "System v1.12 · LCD v1.03" — what the row shows instead of an excerpt. */
  versions: string
}

/**
 * Firmware matches reuse the cached `/software` list and the same alias-aware
 * matcher the directory's own search box uses, so "nv 12", "NV-12" and "nv12" all
 * resolve identically in both places — and it costs no extra database roundtrip.
 */
async function findFirmware(q: string): Promise<FirmwareHit[]> {
  try {
    const models = await getSoftwareReleases()

    // "ES920 firmware" matches no model as a literal string, so retry on the model
    // portion alone. Guarded on a non-empty remainder — filterModels('') returns
    // every model, which would dump the whole register into a search for "firmware".
    let hits = filterModels(models, q)
    if (hits.length === 0) {
      const remainder = stripSoftwareTerms(q)
      if (remainder) hits = filterModels(models, remainder)
    }

    return hits
      .slice(0, 5)
      .map((m) => ({
        slug: m.slug,
        model: m.model,
        series: m.series,
        categoryLabel: CATEGORY_LABELS[m.category],
        versions: m.downloads
          .map((d) => (d.version ? `${d.label} ${d.version}` : d.label))
          .join(' · '),
      }))
  } catch (err) {
    // A firmware failure must not take the FAQ results down with it.
    console.error('[FAQ Search / firmware]', err)
    return []
  }
}

async function findFaqs(q: string) {
  try {
    const payload = await getPayloadClient()
    const direct = await queryFaqs(payload, q)
    if (direct.length > 0) return direct

    // Same rescue as firmware: "ES920 firmware" matches no FAQ title verbatim, but
    // "ES920" matches several. Only runs when the literal query came back empty.
    const remainder = stripSoftwareTerms(q)
    if (remainder && remainder !== q.toLowerCase()) return queryFaqs(payload, remainder)
    return []
  } catch (err) {
    console.error('[FAQ Search]', err)
    return []
  }
}

async function queryFaqs(payload: Awaited<ReturnType<typeof getPayloadClient>>, q: string) {
  try {
    const result = await payload.find({
      collection: 'faqs',
      where: {
        status: { equals: 'published' },
        or: [
          { question: { contains: q } },
          { excerpt: { contains: q } },
        ],
      },
      select: {
        question: true,
        slug: true,
        excerpt: true,
        supportHub: true,
        categories: true,
      },
      depth: 1,
      limit: 8,
    })
    return result.docs
  } catch (err) {
    console.error('[FAQ Search]', err)
    return []
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ docs: [], firmware: [], destination: null })

  const [docs, firmware] = await Promise.all([findFaqs(q), findFirmware(q)])

  // "firmware" and "software" name no model, so they match nothing above — they are
  // asking for the register itself. Offer the page rather than an empty section.
  const destination = matchesSoftwareIntent(q) ? SOFTWARE_DESTINATION : null

  return NextResponse.json({ docs, firmware, destination })
}
