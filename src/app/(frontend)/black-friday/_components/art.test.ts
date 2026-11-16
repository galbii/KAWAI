import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { acousticRebate, bundle, rebate } from '../../fall-financing/_components/campaign'
import { sceneImages } from '../../fall-financing/_components/cinematic/PinnedCanvas'
import { heroOffersFor, heroOpenerFor } from '../../fall-financing/_components/slides'
import { BF_IMAGES, BF_KEY_ART, bfHeroOffersFor } from './art'

/**
 * Redesign v2: new photographs, same words.
 *
 * The images the d4cefac Black Friday page ran are read from the fall campaign
 * modules it read them from, so this keeps holding if the fall art changes.
 */
const SITES = ['us', 'cad'] as const

const D4CEFAC_IMAGES = new Set<string>([
  ...SITES.flatMap((s) => [heroOpenerFor(s).image, ...heroOffersFor(s).map((o) => o.image)]),
  bundle.stageImage,
  ...Object.values(bundle.seriesArt).filter((s): s is string => Boolean(s)),
  rebate.stageImage,
  acousticRebate.stageImage,
  ...Object.values(sceneImages),
])

describe('Black Friday art', () => {
  it('uses no photograph the page ran before', () => {
    for (const img of BF_IMAGES) expect({ img, reused: D4CEFAC_IMAGES.has(img) }).toEqual({ img, reused: false })
  })

  it('uses no image twice in the hero', () => {
    for (const site of SITES) {
      const frames = [BF_KEY_ART.image, ...bfHeroOffersFor(site).map((o) => o.image)]
      expect(new Set(frames).size).toBe(frames.length)
    }
  })

  it('only uses Kawai images that ship in this repo (served on kawaius.com/images)', () => {
    for (const img of BF_IMAGES) {
      expect(img.startsWith('/images/')).toBe(true)
      expect({ img, exists: existsSync(join(process.cwd(), 'public', img)) }).toEqual({ img, exists: true })
    }
  })

  it('keeps every hero index word exactly as the fall page has it', () => {
    for (const site of SITES) {
      const words = (cells: readonly { offer: string; detail: string; sectionId: string; highlight?: string }[]) =>
        cells.map(({ offer, detail, sectionId, highlight }) => ({ offer, detail, sectionId, highlight }))
      expect(words(bfHeroOffersFor(site))).toEqual(words(heroOffersFor(site)))
    }
  })

  it('keeps the financing cell off ca.kawaius.com', () => {
    expect(bfHeroOffersFor('cad').some((o) => o.offer === 'financing')).toBe(false)
  })
})
