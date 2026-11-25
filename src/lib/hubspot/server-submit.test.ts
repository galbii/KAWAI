import { describe, expect, it } from 'bun:test'

/**
 * Server-side HubSpot submit with the `rsm` hidden field (kawai-lead-rsm-holiday v2).
 * Fake fetch and fake owner resolver: nothing reaches HubSpot or Payload.
 */

const { submitLeadServerSide, RSM_FIELD } = await import('./server-submit')
const { routedHubSpotSubmit } = await import('./routed-submit')

const FORM = { portalId: '21987263', formGuid: '6a40df6b-d339-413c-8f62-d6e8324f3959' }
const FIELDS = [
  { name: 'firstname', value: 'Ada' },
  { name: 'email', value: 'ada@example.invalid' },
  { name: 'zip', value: '75201' },
  { name: 'phone', value: '' },
]
const INPUT = { form: FORM, fields: FIELDS, pageName: 'fall_financing_enquiry', pageUri: 'https://kawaius.com/x?utm_source=a', hutk: 'utk1' }

type Call = { url: string; body: { fields: Array<{ name: string; value: string }>; context: Record<string, string> } }
const fakeFetch = (responses: Array<Response | Error>) => {
  const calls: Call[] = []
  const fn = (async (url: string, init: { body: string }) => {
    calls.push({ url, body: JSON.parse(init.body) })
    const next = responses.shift() ?? new Response('{}', { status: 200 })
    if (next instanceof Error) throw next
    return next
  }) as unknown as typeof fetch
  return { calls, fn }
}
const owner = (label: string | null, seen: Array<{ zip: string; storeSlug?: string | undefined }> = []) =>
  async (zip: string, o: { storeSlug?: string | undefined }) => {
    seen.push({ zip, ...o })
    return label
  }

describe('submitLeadServerSide', () => {
  it('posts the visitor fields + rsm + context (hutk, pageUri, pageName, ipAddress) to the same endpoint', async () => {
    const f = fakeFetch([])
    const seen: Array<{ zip: string }> = []
    const res = await submitLeadServerSide(INPUT, { fetch: f.fn, resolveOwnerLabel: owner('Robin Rooke', seen), ipAddress: '203.0.113.9' })
    expect(res).toEqual({ ok: true })
    expect(seen[0]!.zip).toBe('75201')
    expect(f.calls).toHaveLength(1)
    expect(f.calls[0]!.url).toBe(
      'https://api.hsforms.com/submissions/v3/integration/submit/21987263/6a40df6b-d339-413c-8f62-d6e8324f3959',
    )
    expect(f.calls[0]!.body.fields).toEqual([
      { name: 'firstname', value: 'Ada' },
      { name: 'email', value: 'ada@example.invalid' },
      { name: 'zip', value: '75201' },
      { name: RSM_FIELD, value: 'Robin Rooke' },
    ])
    expect(f.calls[0]!.body.context).toEqual({
      hutk: 'utk1',
      pageUri: 'https://kawaius.com/x?utm_source=a',
      pageName: 'fall_financing_enquiry',
      ipAddress: '203.0.113.9',
    })
  })

  it('ignores an rsm the browser sends; passes storeSlug to the resolver', async () => {
    const f = fakeFetch([])
    const seen: Array<{ zip: string; storeSlug?: string | undefined }> = []
    await submitLeadServerSide(
      { ...INPUT, fields: [...FIELDS, { name: 'rsm', value: 'spoofed' }], storeSlug: 'dallas' },
      { fetch: f.fn, resolveOwnerLabel: owner('Kawai Dallas', seen) },
    )
    expect(seen[0]).toEqual({ zip: '75201', storeSlug: 'dallas' })
    const rsm = f.calls[0]!.body.fields.filter((x) => x.name === 'rsm')
    expect(rsm).toEqual([{ name: 'rsm', value: 'Kawai Dallas' }])
  })

  it('a slow or failing owner lookup submits without rsm', async () => {
    const slow = fakeFetch([])
    await submitLeadServerSide(INPUT, {
      fetch: slow.fn,
      resolveOwnerLabel: () => new Promise((r) => setTimeout(() => r('Late'), 200)),
      budgetMs: 10,
    })
    expect(slow.calls[0]!.body.fields.some((x) => x.name === 'rsm')).toBe(false)
    const failing = fakeFetch([])
    const res = await submitLeadServerSide(INPUT, {
      fetch: failing.fn,
      resolveOwnerLabel: async () => {
        throw new Error('payload down')
      },
    })
    expect(res).toEqual({ ok: true })
    expect(failing.calls[0]!.body.fields.some((x) => x.name === 'rsm')).toBe(false)
  })

  it('HubSpot rejecting rsm → retries once without it', async () => {
    const f = fakeFetch([
      new Response(JSON.stringify({ status: 'error', errors: [{ message: "Error in 'fields.rsm'. Field not in form" }] }), { status: 400 }),
    ])
    const res = await submitLeadServerSide(INPUT, { fetch: f.fn, resolveOwnerLabel: owner('Robin Rooke') })
    expect(res).toEqual({ ok: true })
    expect(f.calls).toHaveLength(2)
    expect(f.calls[1]!.body.fields.some((x) => x.name === 'rsm')).toBe(false)
  })

  it('a real validation error is returned for the visitor to fix (no browser retry)', async () => {
    const f = fakeFetch([
      new Response(JSON.stringify({ errors: [{ message: "Required field 'piano_type' is missing" }] }), { status: 400 }),
    ])
    const res = await submitLeadServerSide(INPUT, { fetch: f.fn, resolveOwnerLabel: owner('Robin Rooke') })
    expect(res).toEqual({ ok: false, retryInBrowser: false, error: "Required field 'piano_type' is missing" })
    expect(f.calls).toHaveLength(1)
  })

  it('network error, timeout, 429 and 5xx → retryInBrowser', async () => {
    for (const r of [new Error('ECONNRESET'), new Response('', { status: 503 }), new Response('', { status: 429 })]) {
      const f = fakeFetch([r])
      expect(await submitLeadServerSide(INPUT, { fetch: f.fn, resolveOwnerLabel: owner(null) })).toEqual({
        ok: false,
        retryInBrowser: true,
      })
    }
  })

  it('only allow-listed forms and well-formed input are submitted here', async () => {
    const f = fakeFetch([])
    expect(
      await submitLeadServerSide({ ...INPUT, form: { portalId: '21987263', formGuid: '00000000-0000-0000-0000-000000000000' } }, { fetch: f.fn, resolveOwnerLabel: owner('x') }),
    ).toEqual({ ok: false, retryInBrowser: true })
    expect(await submitLeadServerSide({ nonsense: true }, { fetch: f.fn, resolveOwnerLabel: owner('x') })).toEqual({
      ok: false,
      retryInBrowser: true,
    })
    expect(f.calls).toHaveLength(0)
  })

  it('returns no owner data', async () => {
    const f = fakeFetch([])
    const res = await submitLeadServerSide(INPUT, { fetch: f.fn, resolveOwnerLabel: owner('secret.rsm@kawaius.com') })
    expect(JSON.stringify(res)).not.toContain('secret')
  })
})

describe('routedHubSpotSubmit (browser side)', () => {
  const browser = () => {
    const calls: unknown[] = []
    return { calls, fn: async (...args: unknown[]) => void calls.push(args) }
  }

  it('server ok → no browser submit; sends pageName, storeSlug and the browser context', async () => {
    const b = browser()
    const sent: Record<string, unknown>[] = []
    const submit = routedHubSpotSubmit({ storeSlug: 'dallas' }, {
      serverSubmit: async (input) => {
        sent.push(input as Record<string, unknown>)
        return { ok: true }
      },
      browserSubmit: b.fn,
    })
    await submit(FORM, FIELDS, { pageName: 'p' })
    expect(b.calls).toHaveLength(0)
    expect(sent[0]).toMatchObject({ form: FORM, fields: FIELDS, pageName: 'p', storeSlug: 'dallas' })
  })

  it('server unavailable or retryInBrowser → the browser submits exactly as before', async () => {
    for (const serverSubmit of [
      async () => {
        throw new Error('network')
      },
      async () => ({ ok: false as const, retryInBrowser: true as const }),
    ]) {
      const b = browser()
      await routedHubSpotSubmit({}, { serverSubmit, browserSubmit: b.fn })(FORM, FIELDS, { pageName: 'p' })
      expect(b.calls).toEqual([[FORM, FIELDS, { pageName: 'p' }]])
    }
  })

  it('a validation error throws its message (shown to the visitor), no browser retry', async () => {
    const b = browser()
    const submit = routedHubSpotSubmit({}, {
      serverSubmit: async () => ({ ok: false as const, retryInBrowser: false as const, error: 'Bad email' }),
      browserSubmit: b.fn,
    })
    await expect(submit(FORM, FIELDS, {})).rejects.toThrow('Bad email')
    expect(b.calls).toHaveLength(0)
  })
})
