import { describe, expect, it } from 'bun:test'
import {
  buildNotificationSubject,
  buildNotificationHtml,
  buildConfirmationHtml,
  sanitizeTag,
  lexicalToPlainText,
} from './notify-format'
import type { SignupAnswer } from './types'

const answers: SignupAnswer[] = [
  { name: 'instrument', label: 'Which would you like to study?', value: 'Piano' },
]

const notification = {
  campaignTitle: 'Back to School, Back to Music!',
  storeName: 'Dallas',
  firstName: 'Dana',
  lastName: 'Okafor',
  email: 'dana@example.com',
  phone: '(972) 555-0199',
  zip: '75075',
  answers,
  sourceUrl: 'https://kawaius.com/store/dallas/signup/back-to-school',
}

// The branding pass was explicitly scoped to presentation. These lock the
// wording so a future restyle cannot quietly reword a lead email.
describe('copy is preserved through the branded shell', () => {
  const html = buildNotificationHtml(notification)

  it('keeps the notification heading sentence intact', () => {
    expect(html).toContain('New signup — Back to School, Back to Music!')
  })

  it('keeps every field label', () => {
    for (const label of ['Name', 'Email', 'Phone', 'ZIP', 'Responses']) {
      expect(html).toContain(label)
    }
  })

  it('keeps the lead values and the source line', () => {
    expect(html).toContain('Dana Okafor')
    expect(html).toContain('dana@example.com')
    expect(html).toContain('Which would you like to study?')
    expect(html).toContain('Submitted from https://kawaius.com/store/dallas/signup/back-to-school')
  })

  it('keeps the confirmation greeting, body and sign-off', () => {
    const conf = buildConfirmationHtml({
      firstName: 'Dana',
      campaignTitle: 'Back to School, Back to Music!',
      storeName: 'Dallas',
      body: 'See you at the bench.',
    })
    expect(conf).toContain('Hi Dana,')
    expect(conf).toContain('See you at the bench.')
    expect(conf).toContain('Dallas')
  })

  it('keeps the default confirmation body when the marketer left it empty', () => {
    expect(
      buildConfirmationHtml({
        firstName: 'Dana',
        campaignTitle: 'Fall Open House',
        storeName: 'Houston',
        body: '',
      }),
      // Apostrophes arrive as &#39; because the body is escaped before it is
      // interpolated. Pre-existing, and renders correctly in a mail client.
    ).toContain(
      'We&#39;ve received your signup for Fall Open House at Houston. We&#39;ll be in touch shortly with the details.',
    )
  })

  it('leaves subject lines alone', () => {
    expect(buildNotificationSubject('', { campaign: 'Fall', store: 'Dallas', firstName: 'Dana' }))
      .toBe('New signup — Fall (Dallas)')
    expect(
      buildNotificationSubject('{{firstName}} signed up for {{campaign}} at {{store}}', {
        campaign: 'Fall',
        store: 'Dallas',
        firstName: 'Dana',
      }),
    ).toBe('Dana signed up for Fall at Dallas')
  })
})

describe('branded shell', () => {
  const html = buildNotificationHtml(notification)

  it('uses the same shell as the RSM lead emails', () => {
    expect(html).toStartWith('<!DOCTYPE html>')
    expect(html).toContain('background:#FAF8F5')   // pearl page
    expect(html).toContain('background:#1E1B16')   // black header band
    expect(html).toContain('color:#E11922')        // red eyebrow
    expect(html).toContain('max-width:520px')      // card width
  })

  // A lead's own name reaches a human inbox, and answer labels are authored in
  // the CMS — both are attacker-influenced surfaces in an HTML document.
  it('escapes lead values and marketer-authored labels', () => {
    const nasty = buildNotificationHtml({
      ...notification,
      firstName: '<script>alert(1)</script>',
      storeName: 'Dallas & Plano',
      answers: [{ name: 'q', label: '<img onerror=x>', value: '"quoted"' }],
    })
    expect(nasty).not.toContain('<script>')
    expect(nasty).not.toContain('<img onerror')
    expect(nasty).toContain('Dallas &amp; Plano')
  })
})

describe('untouched helpers', () => {
  it('sanitizeTag still strips non-ASCII', () => {
    expect(sanitizeTag('back-to-school — Dallas')).toBe('back-to-school---Dallas')
  })

  it('lexicalToPlainText still flattens', () => {
    expect(lexicalToPlainText({ root: { children: [{ children: [{ text: 'Hello' }] }] } })).toBe('Hello')
  })
})
