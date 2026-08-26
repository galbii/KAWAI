import { describe, expect, it } from 'bun:test'
import { buildSignupDataLayerEvent, SIGNUP_FORM_SUBMITTED } from './analytics'

const base = {
  campaignSlug: 'back-to-school',
  storeslug: 'dallas',
  email: 'dana@example.com',
}

describe('buildSignupDataLayerEvent', () => {
  // The Tag Manager trigger matches on this exact string. If this test fails,
  // campaign leads have stopped reaching Meta.
  it('uses the event name the Tag Manager trigger listens for', () => {
    expect(buildSignupDataLayerEvent(base).event).toBe('signup_form_submitted')
    expect(SIGNUP_FORM_SUBMITTED).toBe('signup_form_submitted')
  })

  it('matches the /signup2 payload shape', () => {
    expect(buildSignupDataLayerEvent({ ...base, phone: '2145550199', zip: '75075' })).toEqual({
      event: 'signup_form_submitted',
      event_category: 'signup',
      event_label: 'back-to-school',
      signup_store: 'dallas',
      user_data: {
        email: 'dana@example.com',
        phone_number: '2145550199',
        address: { postal_code: '75075' },
      },
    })
  })

  // An empty string hashes to a real value that matches nobody, so blanks are
  // omitted rather than sent.
  it('omits fields the campaign did not collect', () => {
    const event = buildSignupDataLayerEvent(base)
    expect(event.user_data).toEqual({ email: 'dana@example.com' })
  })

  it('omits the address entirely when there is no ZIP', () => {
    const event = buildSignupDataLayerEvent({ ...base, phone: '2145550199' })
    expect(event.user_data).toEqual({ email: 'dana@example.com', phone_number: '2145550199' })
  })

  it('segments by campaign and store', () => {
    const event = buildSignupDataLayerEvent({ ...base, campaignSlug: 'fall-open-house', storeslug: 'houston' })
    expect(event.event_label).toBe('fall-open-house')
    expect(event.signup_store).toBe('houston')
  })
})
