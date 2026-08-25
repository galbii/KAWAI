import { describe, expect, it } from 'bun:test'
import { resolveCampaign, type ResolvableCampaign } from './resolve'

const NOW = new Date('2026-10-01T12:00:00Z')

const fall: ResolvableCampaign = {
  slug: 'fall-open-house',
  isActive: true,
  isDefault: true,
  startDate: '2026-09-01T00:00:00Z',
  endDate: '2026-10-31T00:00:00Z',
}

// Started before NOW, open-ended — so a named lookup at NOW is genuinely active.
const holiday: ResolvableCampaign = {
  slug: 'holiday-recital',
  isActive: true,
  isDefault: false,
  startDate: '2026-09-15T00:00:00Z',
  endDate: null,
}

const expired: ResolvableCampaign = {
  slug: 'spring-sale',
  isActive: true,
  isDefault: false,
  startDate: '2026-03-01T00:00:00Z',
  endDate: '2026-04-30T00:00:00Z',
}

// Its own fixture so the start-boundary case is tested on both sides.
const future: ResolvableCampaign = {
  slug: 'winter-preview',
  isActive: true,
  isDefault: false,
  startDate: '2026-12-01T00:00:00Z',
  endDate: null,
}

describe('resolveCampaign — named URL', () => {
  it('returns the named campaign', () => {
    const r = resolveCampaign([fall, holiday], { slug: 'holiday-recital', now: NOW })
    expect(r.status).toBe('active')
    expect(r.campaign?.slug).toBe('holiday-recital')
  })

  it('reports an expired campaign as ended, never as missing', () => {
    // These URLs live on printed flyers that outlive the promo. A 404 throws
    // away the traffic; the ended panel keeps it.
    const r = resolveCampaign([expired], { slug: 'spring-sale', now: NOW })
    expect(r.status).toBe('ended')
    expect(r.campaign?.slug).toBe('spring-sale')
  })

  it('reports an unknown slug as missing', () => {
    expect(resolveCampaign([fall], { slug: 'nope', now: NOW }).status).toBe('missing')
  })

  it('reports an inactive campaign as missing even when named directly', () => {
    const r = resolveCampaign([{ ...fall, isActive: false }], {
      slug: 'fall-open-house',
      now: NOW,
    })
    expect(r.status).toBe('missing')
  })

  it('reports a not-yet-started campaign as missing, and active once it starts', () => {
    expect(resolveCampaign([future], { slug: 'winter-preview', now: NOW }).status).toBe('missing')
    expect(
      resolveCampaign([future], {
        slug: 'winter-preview',
        now: new Date('2026-12-15T00:00:00Z'),
      }).status,
    ).toBe('active')
  })
})

describe('resolveCampaign — bare URL', () => {
  it('resolves the default campaign when no slug is given', () => {
    const r = resolveCampaign([fall, holiday], { slug: null, now: NOW })
    expect(r.campaign?.slug).toBe('fall-open-house')
  })

  it('is missing when no campaign is marked default', () => {
    const r = resolveCampaign([{ ...fall, isDefault: false }], { slug: null, now: NOW })
    expect(r.status).toBe('missing')
  })

  it('ignores a default that is outside its date window', () => {
    const r = resolveCampaign([{ ...expired, isDefault: true }], { slug: null, now: NOW })
    expect(r.status).toBe('missing')
  })

  it('picks the most recently started default when several qualify', () => {
    const older: ResolvableCampaign = { ...fall, slug: 'older', startDate: '2026-01-01T00:00:00Z' }
    const r = resolveCampaign([older, fall], { slug: null, now: NOW })
    expect(r.campaign?.slug).toBe('fall-open-house')
  })

  it('treats an absent start or end date as open-ended', () => {
    const always: ResolvableCampaign = {
      slug: 'evergreen',
      isActive: true,
      isDefault: true,
      startDate: null,
      endDate: null,
    }
    expect(resolveCampaign([always], { slug: null, now: NOW }).status).toBe('active')
  })
})
