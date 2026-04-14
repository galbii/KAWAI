# KAWAI Cookie & Marketing Integration Strategy

## Cookie Inventory

| Cookie | Lifespan | Purpose | Consent Required |
|---|---|---|---|
| `kawai-dealer-slug` | Session | Which dealer market the user is associated with | No — functional |
| `kawai-utm-first` | 30 days | First-touch campaign attribution (channel that found them) | Analytics |
| `kawai-utm-last` | 30 days | Last-touch attribution (channel active before conversion) | Analytics |
| `kawai-utm` | 30 days | Legacy — being phased out, read as fallback | Analytics |
| `_ga`, `_ga_*`, `_gid` | 2yr / 24hr | Google Analytics session and user IDs | Analytics |
| `_ph_*`, `ph_*` | Session | PostHog behavioral analytics | Analytics |
| `_fbp` | 90 days | Meta Pixel first-party user ID | Marketing |
| `_fbc` | 90 days | Meta Pixel click ID (from ad clicks) | Marketing |
| `payload-token` | Session | Payload CMS admin auth | No — necessary |
| `cc_cookie` | 6 months | User's consent preferences | No — necessary |

---

## Data Flow: From Cookie to Ad Platform

```
User visits /store/st-louis?utm_source=google&utm_medium=cpc
        │
        ├─→ Middleware sets kawai-dealer-slug=st-louis (session cookie)
        │
        ├─→ UTMCapture (client) checks analytics consent
        │     └─→ If accepted:
        │           captureUTMParams() →  kawai-utm-first (first touch, never overwrites)
        │                              →  kawai-utm-last  (last touch, always overwrites)
        │
        ├─→ DealerDimensionTracker (client) reads kawai-dealer-slug
        │     ├─→ Analytics consent: gtag('set', 'user_properties', { dealer_slug: 'st-louis' })
        │     ├─→ Analytics consent: posthog.setPersonProperties({ dealer_slug: 'st-louis' })
        │     └─→ Marketing consent: fbq('trackCustom', 'DealerMarket', { dealer_slug: 'st-louis' })
        │
        └─→ User submits contact form
              ├─→ Server action builds Shopify tags:
              │     st-louis, inquiry-piano-consultation, source-contact-form,
              │     2026-03, utm-source-google, utm-medium-cpc,
              │     utm-last-source-email (if last touch differs)
              │
              ├─→ upsertCustomer() → Shopify CRM
              │
              └─→ sendMetaCAPIEvents() → Meta CAPI (server-side, bypasses iOS)
                    event: Lead
                    user_data: { em: sha256(email), ph: sha256(phone) }
                    custom_data: { dealer_slug: 'st-louis', inquiry_type: 'piano-consultation' }
```

---

## Attribution Model

### First-Touch vs Last-Touch

Every Shopify customer record gets both attribution tags:

```
utm-source-google          ← first touch (who found them)
utm-medium-cpc             ← first touch medium
utm-last-source-email      ← last touch (who converted them)
utm-last-medium-newsletter ← last touch medium
```

**How to use this in Shopify**:
- Filter `tags CONTAINS "utm-source-google"` → customers Google ads found
- Filter `tags CONTAINS "utm-last-source-email"` → customers email converted
- Cross-filter both → customers Google found but email closed → invest more in email nurture

### Reading UTM Data in Client Components

```typescript
import { useUTMTracking } from '@/lib/shopify/utm-tracking'

export function ContactForm() {
  const { tags, firstTouchTags, hasUTMs, lastTouchParams } = useUTMTracking()
  // tags = getAllUTMTags() — both first and last touch, for form submission
  // firstTouchTags = first-touch only tags
  // lastTouchParams = raw UTM object for the most recent campaign
}
```

### Passing UTM Tags on Form Submission

```typescript
// In any contact form client component:
import { getAllUTMTags } from '@/lib/shopify/utm-tracking'

const utmTags = getAllUTMTags()
formData.set('utmTags', JSON.stringify(utmTags))
// Server action reads utmTags from formData and merges into Shopify customer tags
```

---

## Meta CAPI (Server-Side Conversions)

### Why It Exists

iOS 14+ and ad blockers prevent the browser pixel from firing on ~30-40% of conversions. The Conversions API sends the same event server-to-server, bypassing those restrictions. Meta deduplicates using `event_id`.

### Required Environment Variables

```bash
FACEBOOK_CAPI_ACCESS_TOKEN=   # Meta Events Manager → Settings → Generate Access Token
NEXT_PUBLIC_META_PIXEL_ID=    # Same pixel ID used by the browser pixel (already set)
FACEBOOK_CAPI_TEST_CODE=      # Optional — set in dev to verify in Meta Test Events
```

### How to Fire CAPI from a Server Action

```typescript
import { sendMetaCAPIEvents, buildLeadEvent } from '@/lib/integrations/meta-capi'
import { headers } from 'next/headers'

// After successful customer creation:
const headersList = await headers()
const sourceUrl = headersList.get('referer')

sendMetaCAPIEvents([
  buildLeadEvent({
    email: contactData.email,
    phone: contactData.phone,
    ...(sourceUrl && { sourceUrl }),
    dealerSlug: storefrontSlug,
    inquiryType: contactData.inquiryType,
  }),
]).catch((err) => console.error('[CAPI]', err))
// Fire-and-forget — never await, never block the response
```

### Adding Custom Events

```typescript
import { sendMetaCAPIEvents } from '@/lib/integrations/meta-capi'

// Example: Calendly booking confirmation
sendMetaCAPIEvents([{
  event_name: 'Schedule',
  user_data: { em: [sha256(email)] },
  custom_data: { dealer_slug: dealerSlug, content_name: 'Piano Consultation' },
}]).catch(console.error)
```

---

## GA4 Dealer Dimension

The `DealerDimensionTracker` component automatically sets `dealer_slug` as a GA4 user property whenever the dealer cookie is present. No per-page code needed.

**To use this in GA4**:
1. GA4 → Admin → Custom Definitions → Create user-scoped custom dimension
2. Name: `Dealer Market`, Parameter name: `dealer_slug`
3. Now available in all GA4 reports, audiences, and explorations

**Audience examples** (GA4 → Audiences):
```
Grand Piano Researchers in St. Louis:
  user_property dealer_slug = 'st-louis'
  AND event = page_view where page_location CONTAINS '/products/'
  AND session_duration > 120

High-Intent Visitors:
  event = form_start (no form_submit)
  OR page_view count > 5 in 30 days
```

---

## Consent Tiers and What Each Unlocks

| User Choice | What Fires | Data Collected |
|---|---|---|
| Necessary only | `kawai-dealer-slug` (functional) | Dealer market only (no analytics) |
| + Analytics | GA4, PostHog, `kawai-utm-*` cookies, dealer GA4 dimension | Full behavioral + attribution data |
| + Marketing | Meta Pixel init, `DealerMarket` custom event, CAPI (always fires server-side) | Full ad platform attribution |

> **Note**: Meta CAPI fires from the server regardless of consent tier because it sends
> hashed PII (email/phone) which the user explicitly provided in the contact form.
> This is legally distinct from passive browser tracking.

---

## Shopify Audience Segments to Build Now

Create these in Shopify → Customers → Segments, then sync to Meta Custom Audiences:

```
1. Piano Consultation Leads
   tags CONTAINS 'inquiry-piano-consultation'
   → Meta Lookalike: best prospecting audience you have

2. Google Paid Search Converters
   tags CONTAINS 'utm-source-google' AND tags CONTAINS 'utm-medium-cpc'
   → Google Customer Match + Meta Lookalike

3. Email-Converted Leads
   tags CONTAINS 'utm-last-source-email'
   → Proof that email closes deals; build lookalike for nurture campaigns

4. St. Louis Market (per dealer)
   tags CONTAINS 'st-louis'
   → Local geo retargeting, exclude from national awareness spend

5. All Leads (email remarketing)
   tags CONTAINS 'source-contact-form'
   → Suppress from top-of-funnel ads; target with consultation follow-up
```

---

## Testing Checklist

### UTM Attribution
- [ ] Visit `/store/st-louis?utm_source=google&utm_medium=cpc`, accept analytics
- [ ] Check `kawai-utm-first` cookie is set
- [ ] Navigate away and return via a different UTM — `kawai-utm-last` updates, `kawai-utm-first` stays
- [ ] Submit contact form — Shopify customer should have both `utm-source-google` and `utm-last-source-*` tags

### Meta CAPI
- [ ] Set `FACEBOOK_CAPI_TEST_CODE` in `.env.local`
- [ ] Submit a contact form
- [ ] Open Meta Events Manager → Test Events — Lead event should appear with ~2s delay
- [ ] Verify `dealer_slug` and `inquiry_type` appear in custom data

### Dealer Dimension
- [ ] Visit `/store/st-louis`, accept analytics
- [ ] Open GA4 DebugView — look for `user_properties` with `dealer_slug: st-louis`
- [ ] Check PostHog — person should have `dealer_slug` property

### Consent Gating
- [ ] Accept "Necessary only" — confirm no GA/PostHog/Meta events fire, no UTM cookies set
- [ ] Accept "Analytics only" — confirm GA4 + PostHog fire, Meta pixel does NOT load
- [ ] Accept "Marketing" — confirm Meta pixel loads and `DealerMarket` event fires
