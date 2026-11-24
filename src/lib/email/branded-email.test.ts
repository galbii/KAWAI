import { describe, expect, it } from 'bun:test'
import {
  BRAND,
  KAWAI_LOGO,
  kawaiLogoUrl,
  renderBrandedEmail,
  storeContactFromStorefront,
  telHref,
} from './branded-email'

const STOREFRONT = {
  locationName: 'Dallas',
  showroomInfo: {
    name: 'Dallas',
    address: '601 W Plano Pkwy, Ste 153, Plano, TX 75075',
    phone: '(972) 379-2200',
    email: 'dallas-showroom@example.invalid',
  },
  hours: [
    { day: 'Tuesday', time: '10:00 am–6:30 pm' },
    { day: '', time: 'dropped' },
    { day: 'Sunday', time: '1:00 pm–5:00 pm' },
  ],
}

describe('storeContactFromStorefront', () => {
  it('reads name, address, phone, email and hours off the storefront record', () => {
    const c = storeContactFromStorefront(STOREFRONT, { displayName: 'Dallas', pageUrl: 'https://kawaius.com/store/dallas' })
    expect(c).toEqual({
      name: 'Kawai Dallas',
      address: '601 W Plano Pkwy, Ste 153, Plano, TX 75075',
      phone: '(972) 379-2200',
      email: 'dallas-showroom@example.invalid',
      hours: [
        { day: 'Tuesday', time: '10:00 am–6:30 pm' },
        { day: 'Sunday', time: '1:00 pm–5:00 pm' },
      ],
      directionsUrl:
        'https://www.google.com/maps/dir/?api=1&destination=601%20W%20Plano%20Pkwy%2C%20Ste%20153%2C%20Plano%2C%20TX%2075075',
      pageUrl: 'https://kawaius.com/store/dallas',
    })
  })

  it('still names the store when the lookup failed', () => {
    expect(storeContactFromStorefront(null, { displayName: 'St. Louis' })).toEqual({ name: 'Kawai St. Louis', hours: [] })
  })

  it('does not double the Kawai prefix', () => {
    expect(storeContactFromStorefront({ locationName: 'Kawai Houston' }, { displayName: 'Houston' }).name).toBe('Kawai Houston')
  })

  it('makes a dialable tel: link', () => {
    expect(telHref('(972) 379-2200')).toBe('tel:9723792200')
  })
})

describe('renderBrandedEmail', () => {
  const contact = storeContactFromStorefront(STOREFRONT, { displayName: 'Dallas', pageUrl: 'https://kawaius.com/store/dallas' })
  const email = renderBrandedEmail({
    subject: 'Subject <here>',
    preheader: 'Preview line',
    eyebrow: 'Kawai Dallas',
    title: 'Holiday Sale Event',
    contentHtml: '<p>Body</p>',
    contentText: 'Body',
    store: contact,
    finePrint: 'Why you got this.',
  })

  it('carries the logo as an absolute https image with alt text and fixed size', () => {
    expect(kawaiLogoUrl()).toBe('https://kawaius.com/images/logos/kawai-logo-red-3x.png')
    expect(email.html).toContain(`src="${kawaiLogoUrl()}"`)
    expect(email.html).toContain(`width="${KAWAI_LOGO.width}" height="${KAWAI_LOGO.height}" alt="KAWAI"`)
  })

  it('uses the brand colours and type', () => {
    for (const v of [BRAND.ink, BRAND.red, BRAND.pearl]) expect(email.html).toContain(v)
    expect(email.html).toContain("'Crimson Text',Georgia")
    expect(email.html).toContain('Inter,-apple-system')
  })

  it('is responsive: viewport meta, 600px max card, phone media query', () => {
    expect(email.html).toContain('name="viewport"')
    expect(email.html).toContain('max-width:600px')
    expect(email.html).toContain('@media only screen and (max-width:620px)')
  })

  it('signs the footer with the store record in HTML and text', () => {
    for (const out of [email.html, email.text]) {
      expect(out).toContain('Kawai Dallas')
      expect(out).toContain('601 W Plano Pkwy, Ste 153, Plano, TX 75075')
      expect(out).toContain('(972) 379-2200')
      expect(out).toContain('dallas-showroom@example.invalid')
      expect(out).toContain('Tuesday')
      expect(out).toContain('1:00 pm–5:00 pm')
    }
    expect(email.html).toContain('href="tel:9723792200"')
    expect(email.html).toContain('href="mailto:dallas-showroom@example.invalid"')
  })

  it('escapes the subject and has a plain-text twin with no markup', () => {
    expect(email.html).toContain('<title>Subject &lt;here&gt;</title>')
    expect(email.text).not.toMatch(/<[a-z/][^>]*>/i)
    expect(email.text).toContain('Holiday Sale Event')
    expect(email.text).toContain('Body')
    expect(email.text).toContain('Why you got this.')
  })

  it('leaves out missing contact rows instead of rendering blanks', () => {
    const bare = renderBrandedEmail({
      subject: 's',
      eyebrow: 'e',
      title: 't',
      contentHtml: '',
      contentText: '',
      store: { name: 'Kawai Denver', hours: [] },
    })
    expect(bare.html).not.toContain('tel:')
    expect(bare.html).not.toContain('mailto:')
    expect(bare.html).not.toContain('Showroom hours')
    expect(bare.text).not.toContain('Phone:')
  })
})
