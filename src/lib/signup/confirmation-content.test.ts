import { describe, expect, it } from 'bun:test'
import { extractConfirmationDetails, extractConfirmationLocation } from './confirmation-content'

// Shaped like the stored Dallas campaign and storefront.
const BLOCKS = [
  { blockType: 'content-rich-text', richText: {} },
  {
    blockType: 'signup-details',
    heading: "What's included",
    items: [
      { icon: 'note', label: 'Trial lesson', value: 'Free — no obligation' },
      { icon: 'price', label: 'Enrollment fee', value: 'Waived — $0 to start' },
    ],
  },
  { blockType: 'signup-location', heading: 'Getting here', showHours: true },
]

const STOREFRONT = {
  locationName: 'Dallas',
  showroomInfo: {
    name: 'Dallas',
    address: '601 W Plano Pkwy, Ste 153, Plano, TX 75075',
    phone: '(972) 379-2200',
  },
  hours: [
    { day: 'Tuesday', time: '10:00 am–6:30 pm' },
    { day: 'Sunday', time: '1:00 pm–5:00 pm' },
  ],
}

describe('extractConfirmationDetails', () => {
  it('reads the value props off the Event Details block', () => {
    expect(extractConfirmationDetails(BLOCKS)).toEqual({
      heading: "What's included",
      items: [
        { label: 'Trial lesson', value: 'Free — no obligation' },
        { label: 'Enrollment fee', value: 'Waived — $0 to start' },
      ],
    })
  })

  it('falls back to a heading rather than rendering a blank one', () => {
    const blocks = [{ blockType: 'signup-details', heading: '', items: [{ label: 'A', value: 'B' }] }]
    expect(extractConfirmationDetails(blocks)?.heading).toBe('What to expect')
  })

  it('drops half-filled rows so no label dangles without its value', () => {
    const blocks = [
      {
        blockType: 'signup-details',
        items: [{ label: 'Kept', value: 'Yes' }, { label: 'Orphan', value: '' }],
      },
    ]
    expect(extractConfirmationDetails(blocks)?.items).toEqual([{ label: 'Kept', value: 'Yes' }])
  })

  it('returns null when there is nothing to show', () => {
    expect(extractConfirmationDetails([{ blockType: 'signup-details', items: [] }])).toBeNull()
    expect(extractConfirmationDetails([{ blockType: 'content-image' }])).toBeNull()
    expect(extractConfirmationDetails(undefined)).toBeNull()
    expect(extractConfirmationDetails(null)).toBeNull()
  })
})

describe('extractConfirmationLocation', () => {
  it('reads the address, phone and hours', () => {
    const loc = extractConfirmationLocation(STOREFRONT, BLOCKS)
    expect(loc?.storeName).toBe('Dallas')
    expect(loc?.address).toBe('601 W Plano Pkwy, Ste 153, Plano, TX 75075')
    expect(loc?.phone).toBe('(972) 379-2200')
    expect(loc?.hours).toHaveLength(2)
  })

  it('points the directions link at the same pin the page uses', () => {
    expect(extractConfirmationLocation(STOREFRONT, BLOCKS)?.directionsUrl).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=601%20W%20Plano%20Pkwy%2C%20Ste%20153%2C%20Plano%2C%20TX%2075075',
    )
  })

  // The address is the point of the section, so it must not depend on a block
  // the marketer may never have added.
  it('still returns the address when the campaign has no Location block', () => {
    expect(extractConfirmationLocation(STOREFRONT, [])?.address).toBe(
      '601 W Plano Pkwy, Ste 153, Plano, TX 75075',
    )
  })

  it('honours the block hiding hours so the email matches the page', () => {
    const blocks = [{ blockType: 'signup-location', showHours: false }]
    expect(extractConfirmationLocation(STOREFRONT, blocks)?.hours).toEqual([])
  })

  it('returns null when the storefront has no address to send anyone to', () => {
    expect(extractConfirmationLocation({ locationName: 'Nowhere' }, BLOCKS)).toBeNull()
    expect(extractConfirmationLocation(null, BLOCKS)).toBeNull()
  })
})
