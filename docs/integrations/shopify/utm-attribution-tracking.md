# UTM Attribution Tracking for Shopify CRM

> Complete guide to implementing UTM parameter tracking for marketing attribution in your Shopify customer records

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Quick Start](#quick-start)
4. [Implementation Guide](#implementation-guide)
5. [Tag Naming Conventions](#tag-naming-conventions)
6. [Attribution Models](#attribution-models)
7. [Analytics & Reporting](#analytics--reporting)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What is UTM Tracking?

UTM (Urchin Tracking Module) parameters are URL query strings that track the effectiveness of marketing campaigns. When users click links with UTM parameters, we capture and store these values to attribute conversions to specific marketing sources.

**Example URL with UTM parameters:**
```
https://kawaipiano.com/pianos?utm_source=google&utm_medium=cpc&utm_campaign=spring-sale-2025&utm_content=hero-banner&utm_term=digital-piano
```

### Why Track UTMs in Shopify?

✅ **Marketing Attribution** - Know which campaigns drive actual leads
✅ **ROI Analysis** - Calculate return on ad spend per channel
✅ **Customer Segmentation** - Tag customers by acquisition source
✅ **Multi-Touch Attribution** - See customer journey across channels
✅ **CRM Integration** - Use Shopify as unified customer database

### What This Implementation Provides

- **Automatic UTM Capture** - Extracts UTMs from URLs on page load
- **Session Persistence** - Stores UTMs in sessionStorage throughout visit
- **Customer Tagging** - Converts UTMs to Shopify customer tags
- **Tag Merging** - Preserves all historical UTMs (multi-touch attribution)
- **Clean Sanitization** - Formats UTM values for consistent tagging
- **SSR-Safe** - Works with Next.js server-side rendering
- **First-Touch Attribution** - Captures initial UTMs, doesn't overwrite

---

## How It Works

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User Clicks Marketing Link                                  │
│     https://example.com/pianos?utm_source=google&utm_medium=cpc │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. UTMCapture Component (Client-Side)                          │
│     - Extracts UTM parameters from URL                          │
│     - Sanitizes values (lowercase, kebab-case)                  │
│     - Stores in sessionStorage                                  │
│     - First-touch: doesn't overwrite existing UTMs              │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. User Browses Site                                           │
│     - UTMs persist in sessionStorage across navigation          │
│     - No UTMs in URL after initial landing                      │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. User Submits Contact Form                                   │
│     - Form retrieves UTMs from sessionStorage                   │
│     - Converts to tag array: ['utm-source-google', ...]         │
│     - Adds to form data                                         │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. Server Action Processes Form                                │
│     - Merges UTM tags with other tags                           │
│     - Calls upsertCustomer() with all tags                      │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. Shopify Customer Created/Updated                            │
│     - Tags: ['utm-source-google', 'utm-medium-cpc',             │
│              'location-stlouis', 'inquiry-consultation']        │
│     - Existing tags preserved (multi-touch attribution)         │
└─────────────────────────────────────────────────────────────────┘
```

### Storage Strategy

**Why sessionStorage?**
- ✅ Persists across page navigation within same session
- ✅ Clears when browser tab closes (accurate attribution window)
- ✅ Per-tab isolation (correct for concurrent sessions)
- ✅ No server overhead
- ✅ 5-10MB storage limit (plenty for UTM data)

**Why NOT localStorage or cookies?**
- ❌ localStorage persists forever (stale attribution)
- ❌ Cookies add overhead to every request
- ❌ Can attribute old campaigns incorrectly

### Tag Format

UTM parameters are converted to Shopify tags with this format:

```
utm-{parameter}-{sanitized-value}
```

**Examples:**
```
utm_source=google         → utm-source-google
utm_medium=cpc            → utm-medium-cpc
utm_campaign=Spring Sale  → utm-campaign-spring-sale
utm_content=Hero Banner   → utm-content-hero-banner
utm_term=digital piano    → utm-term-digital-piano
```

**Sanitization Rules:**
1. Convert to lowercase
2. Replace spaces/underscores with hyphens
3. Remove special characters
4. Remove consecutive hyphens
5. Truncate to 50 characters max

---

## Quick Start

### Step 1: Add UTM Capture to Root Layout

Add the `<UTMCapture />` component to your root layout:

```typescript
// src/app/layout.tsx
import { UTMCapture } from '@/components/analytics/UTMCapture'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UTMCapture />
        {children}
      </body>
    </html>
  )
}
```

### Step 2: Use in Contact Forms

Update your contact form to include UTM tags:

```typescript
// src/app/contact/page.tsx
'use client'
import { getUTMTags } from '@/lib/shopify'
import { submitContactForm } from '@/lib/actions/contact-form'

export function ContactForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Get UTM tags from sessionStorage
    const utmTags = getUTMTags()

    // Add to form data
    formData.set('utmTags', JSON.stringify(utmTags))

    // Submit
    const result = await submitContactForm(formData)
    // Handle result...
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
    </form>
  )
}
```

### Step 3: Update Server Action

Process UTM tags in your server action:

```typescript
// src/lib/actions/contact-form.ts
'use server'
import { upsertCustomer } from '@/lib/shopify'

export async function submitContactForm(formData: FormData) {
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const storefront = formData.get('storefront') as string

  // Parse UTM tags from form data
  const utmTagsJson = formData.get('utmTags') as string
  const utmTags: string[] = utmTagsJson ? JSON.parse(utmTagsJson) : []

  // Create customer with UTM tags
  await upsertCustomer({
    email,
    firstName,
    tags: [
      ...utmTags,                   // UTM attribution
      `location-${storefront}`,     // Location
      'source-contact-form',        // Source
      new Date().toISOString().slice(0, 7) // Date
    ]
  })

  return { success: true }
}
```

That's it! UTMs are now being tracked automatically.

---

## Implementation Guide

### Complete Example: Contact Form with UTM Tracking

See the complete implementation in these files:

**1. UTM Tracking Library**
- `src/lib/shopify/utm-tracking.ts` - Core UTM functions
- `src/lib/shopify/index.ts` - Barrel exports

**2. UTM Capture Component**
- `src/components/analytics/UTMCapture.tsx` - Auto-capture on page load

**3. Form Integration**
- `src/components/forms/ContactFormWithUTM.tsx` - Complete form example
- `src/lib/actions/contact-form-with-utm.ts` - Server action example

### Integration Checklist

- [ ] Add `<UTMCapture />` to root layout
- [ ] Import `getUTMTags()` in form components
- [ ] Add UTM tags to form submission
- [ ] Parse UTM tags in server actions
- [ ] Merge UTM tags with other tags
- [ ] Pass all tags to `upsertCustomer()`
- [ ] Test with example UTM URLs
- [ ] Verify tags in Shopify admin
- [ ] Set up analytics reporting

### Testing Your Implementation

#### Test 1: Basic UTM Capture

1. Visit: `http://localhost:3000/?utm_source=test&utm_medium=manual`
2. Open browser console
3. Check for: `[UTM Tracking] UTM parameters captured`
4. Verify sessionStorage: `sessionStorage.getItem('kawai_utm_params')`

#### Test 2: Tag Generation

```typescript
// In browser console
import { getUTMTags } from '@/lib/shopify'
const tags = getUTMTags()
console.log(tags)
// Expected: ['utm-source-test', 'utm-medium-manual']
```

#### Test 3: Form Submission

1. Visit with UTMs: `http://localhost:3000/contact?utm_source=google&utm_medium=cpc&utm_campaign=spring2025`
2. Fill out contact form
3. Submit form
4. Check Shopify Admin → Customers → Latest customer
5. Verify tags include: `utm-source-google`, `utm-medium-cpc`, `utm-campaign-spring2025`

#### Test 4: Multi-Session Attribution

**Session 1:**
1. Visit: `?utm_source=google&utm_medium=cpc`
2. Submit form
3. Customer tagged with `utm-source-google`

**Session 2 (new tab or after browser close):**
1. Visit: `?utm_source=facebook&utm_medium=social`
2. Submit form with same email
3. Customer now has BOTH tags: `utm-source-google` AND `utm-source-facebook`
4. Demonstrates multi-touch attribution

---

## Tag Naming Conventions

### Standard UTM Parameters

| Parameter | Description | Tag Format | Example |
|-----------|-------------|------------|---------|
| `utm_source` | Traffic source | `utm-source-{value}` | `utm-source-google` |
| `utm_medium` | Marketing medium | `utm-medium-{value}` | `utm-medium-cpc` |
| `utm_campaign` | Campaign name | `utm-campaign-{value}` | `utm-campaign-spring-sale-2025` |
| `utm_content` | Ad content | `utm-content-{value}` | `utm-content-hero-banner` |
| `utm_term` | Search keywords | `utm-term-{value}` | `utm-term-digital-piano` |

### Recommended Tag Values

#### Sources (`utm_source`)
```
google          - Google Ads / Google Organic
facebook        - Facebook Ads
instagram       - Instagram Ads
linkedin        - LinkedIn
twitter         - Twitter/X
newsletter      - Email newsletter
referral        - Referral partner
affiliate       - Affiliate links
direct          - Direct traffic (no UTM)
```

#### Mediums (`utm_medium`)
```
cpc             - Cost-per-click ads (paid search)
display         - Display/banner ads
social          - Organic social media
email           - Email marketing
referral        - Referral links
organic         - Organic search/social
affiliate       - Affiliate marketing
```

#### Campaign Naming
```
{season}-{year}                    - spring-2025
{product}-{action}                 - ca99-launch
{event}-{date}                     - namm-2025-01
{promo}-{discount}                 - holiday-sale-20off
{audience}-{offer}                 - first-time-buyer-discount
```

### Complete Tag Examples

**Google Ads Campaign:**
```
URL: ?utm_source=google&utm_medium=cpc&utm_campaign=spring-sale-2025&utm_content=headline-a&utm_term=kawai-piano

Tags:
- utm-source-google
- utm-medium-cpc
- utm-campaign-spring-sale-2025
- utm-content-headline-a
- utm-term-kawai-piano
```

**Facebook Ad Campaign:**
```
URL: ?utm_source=facebook&utm_medium=social&utm_campaign=product-launch-ca99&utm_content=video-ad

Tags:
- utm-source-facebook
- utm-medium-social
- utm-campaign-product-launch-ca99
- utm-content-video-ad
```

**Email Newsletter:**
```
URL: ?utm_source=newsletter&utm_medium=email&utm_campaign=monthly-digest-2025-01

Tags:
- utm-source-newsletter
- utm-medium-email
- utm-campaign-monthly-digest-2025-01
```

---

## Attribution Models

### First-Touch Attribution (Default)

The first UTM parameters captured in a session are stored and persist throughout the session. Subsequent page visits with different UTMs don't override the original attribution.

**Example:**
```
1. User clicks Google ad → UTMs captured
2. User clicks Facebook ad in same tab → UTMs NOT updated (first-touch wins)
3. User submits form → Tagged with original Google UTMs
```

**When to use:** Best for understanding initial acquisition channels.

### Multi-Touch Attribution

Because `upsertCustomer()` merges tags, customers accumulate UTM tags across multiple sessions, enabling multi-touch attribution analysis.

**Example:**
```
Session 1: User clicks Google ad → Customer tagged 'utm-source-google'
Session 2: User clicks Facebook ad → Customer tagged 'utm-source-facebook'
Session 3: User clicks email link → Customer tagged 'utm-source-newsletter'

Final tags: ['utm-source-google', 'utm-source-facebook', 'utm-source-newsletter', ...]
```

**Analysis:** This customer was influenced by 3 touchpoints before converting.

### Attribution Window

**Session-based (recommended):**
- UTMs captured when user first lands with parameters
- Persist throughout browser session
- Clear when browser tab closes
- Attribution window = single session (minutes to hours)

**Alternative: Extended attribution window:**
If you need longer attribution windows (e.g., 30-day), modify storage strategy:

```typescript
// In utm-tracking.ts, change to localStorage with expiration
const UTM_EXPIRATION_DAYS = 30
const expirationTime = Date.now() + (UTM_EXPIRATION_DAYS * 24 * 60 * 60 * 1000)

localStorage.setItem('kawai_utm_params', JSON.stringify({
  params: utmParams,
  expiresAt: expirationTime
}))
```

**Trade-off:** Longer windows may attribute conversions to old campaigns.

---

## Analytics & Reporting

### Shopify Customer Segments

Create customer segments in Shopify based on UTM tags:

**Google Ads Customers:**
```
Tag: utm-source-google
Filter: Customer tags contains "utm-source-google"
```

**Spring 2025 Campaign Conversions:**
```
Tag: utm-campaign-spring-sale-2025
Filter: Customer tags contains "utm-campaign-spring-sale-2025"
```

**Paid Search vs. Organic:**
```
Paid: Customer tags contains "utm-medium-cpc"
Organic: Customer tags does not contain "utm-medium"
```

### Export for Analysis

**Method 1: Shopify Admin**
1. Customers → Export customers → CSV
2. Filter by tags
3. Analyze in Excel/Google Sheets

**Method 2: Shopify API**
```typescript
// Fetch customers with specific UTM tag
const customers = await shopifyAdminClient.query({
  customers(first: 100, query: "tag:utm-source-google") {
    edges {
      node {
        id
        email
        tags
        createdAt
      }
    }
  }
})
```

### Key Metrics to Track

**By Source:**
- Leads per source (count customers by `utm-source-*`)
- Conversion rate (leads → customers)
- Customer lifetime value by source

**By Campaign:**
- Campaign ROI (ad spend ÷ conversions)
- Cost per lead
- Lead quality scores

**By Medium:**
- Paid vs. organic performance
- Channel effectiveness
- Budget allocation optimization

### Sample Analytics Query

```sql
-- Count customers by UTM source (if using database exports)
SELECT
  SUBSTRING_INDEX(SUBSTRING_INDEX(tag, '-', -1), ',', 1) as source,
  COUNT(DISTINCT customer_id) as customer_count
FROM customer_tags
WHERE tag LIKE 'utm-source-%'
GROUP BY source
ORDER BY customer_count DESC
```

---

## Best Practices

### 1. Consistent URL Building

✅ **Use a URL builder tool:**
- Google Campaign URL Builder: https://ga-dev-tools.google/campaign-url-builder/
- Create consistent naming conventions
- Document campaign naming rules

✅ **Always include source and medium:**
```
Minimum: ?utm_source=google&utm_medium=cpc
Better:  ?utm_source=google&utm_medium=cpc&utm_campaign=spring-2025
Best:    ?utm_source=google&utm_medium=cpc&utm_campaign=spring-2025&utm_content=headline-a&utm_term=digital-piano
```

❌ **Don't use UTMs for internal links:**
```
// Bad - inflates metrics
<Link href="/contact?utm_source=nav">Contact</Link>

// Good - no UTMs for internal navigation
<Link href="/contact">Contact</Link>
```

### 2. Tag Management

✅ **Review tags regularly:**
- Check Shopify Admin → Customers → Tags
- Clean up misspellings or duplicates
- Merge similar tags

✅ **Set tag limits:**
- Maximum 50 chars per tag value (enforced by sanitization)
- Reasonable tag count per customer (~20-30 max)

✅ **Archive old campaign tags:**
- After campaign ends, document results
- Remove from active use

### 3. Privacy Compliance

✅ **Respect user privacy:**
- Don't include PII in UTM parameters
- Follow GDPR/CCPA regulations
- Provide opt-out mechanisms

❌ **Never put sensitive data in UTMs:**
```
// Bad - PII in URL
?utm_content=user-john.doe@email.com

// Good - anonymous identifier
?utm_content=ad-variant-a
```

### 4. Testing & Validation

✅ **Test all campaign URLs before launch:**
```bash
# Test script
curl "https://example.com/contact?utm_source=test&utm_medium=script" -I
```

✅ **Monitor UTM capture rates:**
- Track how many sessions have UTMs
- Identify broken tracking

✅ **Validate tag format in Shopify:**
- Check actual tags match expected format
- Verify sanitization works correctly

### 5. Documentation

✅ **Document campaign codes:**
```markdown
# Active Campaigns 2025

## Spring Sale
- Source: google, facebook, instagram
- Medium: cpc, social
- Campaign: spring-sale-2025
- Launch: 2025-03-01
- End: 2025-04-30
```

✅ **Share naming conventions:**
- Create team wiki or shared doc
- Train marketing team on proper usage
- Review periodically

---

## Troubleshooting

### Issue: UTMs Not Being Captured

**Symptoms:**
- No console logs showing UTM capture
- sessionStorage empty
- Forms submitted without UTM tags

**Diagnosis:**
```typescript
// In browser console
console.log('sessionStorage available?', typeof window !== 'undefined' && !!window.sessionStorage)
console.log('UTM params in URL?', new URL(window.location.href).searchParams.toString())
```

**Solutions:**

1. **Check if `<UTMCapture />` is in layout:**
```typescript
// src/app/layout.tsx
import { UTMCapture } from '@/components/analytics/UTMCapture'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <UTMCapture /> {/* Must be here */}
        {children}
      </body>
    </html>
  )
}
```

2. **Verify sessionStorage is enabled:**
- Check browser settings (private browsing may disable)
- Check for browser extensions blocking storage

3. **Check URL actually has UTM parameters:**
```
✅ Correct: https://example.com/?utm_source=google
❌ Wrong:   https://example.com/ (no UTMs)
```

### Issue: Tags Not Appearing in Shopify

**Symptoms:**
- Form submission succeeds
- Customer created in Shopify
- But no UTM tags on customer record

**Diagnosis:**
```typescript
// Add logging to server action
console.log('UTM tags:', utmTags)
console.log('All tags:', tags)
console.log('Customer response:', customer.tags)
```

**Solutions:**

1. **Verify form is passing UTM tags:**
```typescript
// Client component
const utmTags = getUTMTags()
console.log('Sending UTM tags:', utmTags) // Should show array
formData.set('utmTags', JSON.stringify(utmTags))
```

2. **Verify server action is parsing tags:**
```typescript
// Server action
const utmTagsJson = formData.get('utmTags') as string
console.log('Received UTM JSON:', utmTagsJson)

const utmTags = utmTagsJson ? JSON.parse(utmTagsJson) : []
console.log('Parsed UTM tags:', utmTags)
```

3. **Check Shopify Admin API scopes:**
- Requires `write_customers` scope
- Check app permissions in Shopify admin

### Issue: Duplicate or Malformed Tags

**Symptoms:**
- Tags like `utm-source-google-ads` instead of `utm-source-google`
- Multiple similar tags for same campaign

**Diagnosis:**
```typescript
// Test sanitization
import { sanitizeUTMValue } from '@/lib/shopify/utm-tracking'
console.log(sanitizeUTMValue('Google Ads 2025!'))
// Should output: 'google-ads-2025'
```

**Solutions:**

1. **Standardize UTM values before campaign launch:**
```
✅ Good:  utm_source=google (becomes utm-source-google)
❌ Bad:   utm_source=Google Ads (becomes utm-source-google-ads)
```

2. **Clean up existing tags in Shopify:**
- Export customers with problematic tags
- Bulk update via API or CSV import
- Use consistent values going forward

### Issue: First-Touch Attribution Not Working

**Symptoms:**
- UTMs being overwritten in same session
- Different UTMs for each page visit

**Diagnosis:**
```typescript
// Check if existing UTMs are stored
import { hasStoredUTMs, getStoredUTMParams } from '@/lib/shopify/utm-tracking'
console.log('Has stored UTMs?', hasStoredUTMs())
console.log('Stored UTMs:', getStoredUTMParams())
```

**Solutions:**

1. **Verify storage logic:**
```typescript
// In utm-tracking.ts, captureUTMParams()
const existing = window.sessionStorage.getItem(UTM_STORAGE_KEY)
if (existing) {
  console.log('UTMs already captured, skipping')
  return null // Don't overwrite
}
```

2. **Check for storage clearing:**
- Ensure no code is calling `clearUTMParams()` unintentionally
- Check for `sessionStorage.clear()` calls

### Issue: UTMs Not Persisting Across Pages

**Symptoms:**
- UTMs captured on landing page
- Lost when navigating to other pages
- Form submission has no UTM tags

**Diagnosis:**
```typescript
// On landing page
console.log('Page 1:', getStoredUTMParams())

// Navigate to another page, then:
console.log('Page 2:', getStoredUTMParams())
// Should be same as Page 1
```

**Solutions:**

1. **Verify using sessionStorage (not in-memory):**
```typescript
// Should be sessionStorage, NOT a variable
window.sessionStorage.setItem(UTM_STORAGE_KEY, ...)
// NOT: let utmCache = ...
```

2. **Check navigation method:**
- Next.js Link component: ✅ Preserves sessionStorage
- window.location.href: ✅ Preserves sessionStorage
- Form submit with page reload: ❌ May clear storage
- Target="_blank": ❌ New tab = new sessionStorage

### Issue: sessionStorage Size Limit Exceeded

**Symptoms:**
- Error: "QuotaExceededError"
- UTMs not being stored

**Diagnosis:**
```typescript
// Check storage usage
let total = 0
for (let key in sessionStorage) {
  total += sessionStorage[key].length
}
console.log('sessionStorage usage:', total, 'bytes')
```

**Solutions:**

1. **Clear old storage:**
```typescript
// Clean up other data in sessionStorage
sessionStorage.removeItem('other-large-data')
```

2. **UTM data should be tiny:**
```typescript
// Typical size: < 500 bytes
// If UTM data is huge, something is wrong
const utmData = sessionStorage.getItem('kawai_utm_params')
console.log('UTM data size:', utmData?.length, 'bytes')
```

---

## Advanced Usage

### Custom Attribution Logic

Override default first-touch behavior:

```typescript
// Custom: Last-touch attribution
export function captureUTMParamsLastTouch(searchParams: URLSearchParams) {
  // Always capture, even if UTMs already exist
  const utmParams = extractUTMParams(searchParams)
  if (utmParams) {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams))
  }
}
```

### UTM Parameter Aliases

Support custom parameter names:

```typescript
// Support both 'utm_source' and 'source'
const source = searchParams.get('utm_source') || searchParams.get('source')
```

### Integration with Analytics Platforms

**Google Analytics 4:**
```typescript
// Send UTM data to GA4
import { getStoredUTMParams } from '@/lib/shopify/utm-tracking'

const utmParams = getStoredUTMParams()
if (utmParams) {
  gtag('event', 'form_submission', {
    source: utmParams.utm_source,
    medium: utmParams.utm_medium,
    campaign: utmParams.utm_campaign
  })
}
```

**Facebook Pixel:**
```typescript
// Send to Facebook
fbq('track', 'Lead', {
  source: utmParams.utm_source,
  campaign: utmParams.utm_campaign
})
```

---

## Summary

### Quick Reference

**Key Functions:**
- `captureUTMParams(searchParams)` - Capture UTMs from URL
- `getUTMTags()` - Get formatted tag array
- `getStoredUTMParams()` - Get raw UTM object
- `clearUTMParams()` - Clear stored UTMs
- `sanitizeUTMValue(value)` - Clean UTM values

**Tag Format:**
```
utm-{param}-{sanitized-value}
```

**Implementation Steps:**
1. Add `<UTMCapture />` to layout
2. Call `getUTMTags()` in forms
3. Pass tags to server actions
4. Merge with other tags
5. Pass to `upsertCustomer()`

**Attribution Model:**
- First-touch within session
- Multi-touch across sessions
- Session-based attribution window

### Additional Resources

- [Google UTM Parameters Guide](https://support.google.com/analytics/answer/1033863)
- [Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/)
- [Shopify Customer Tagging API](https://shopify.dev/docs/api/admin-graphql/latest/mutations/customerUpdate)

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Tested With:** Next.js 15, Shopify Admin API 2025-01
