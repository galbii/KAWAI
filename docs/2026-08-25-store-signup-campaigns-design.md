# Store Signup Campaigns — Design

**Date:** 2026-08-25
**Status:** Approved, ready for implementation planning
**Route:** `/store/[storeslug]/signup/[[...campaign]]`

---

## 1. Problem

Every store campaign on the site today is hardcoded by a developer:

| Campaign | Location | Size |
|---|---|---|
| `the-gift-of-music` | `store/[storeslug]/the-gift-of-music/page.tsx` | 1,100 lines + 11 components |
| `grand-spring-sale` | `store/[storeslug]/grand-spring-sale/page.tsx` | 143 lines + 7 components |
| `signature`, `signature2`, `university`, `trade`, `sk-experience` | `store/[storeslug]/*` | each bespoke |

A new promo therefore requires a developer, a branch, and a deploy. Marketing cannot change a headline, swap a background, add a question, or redirect a lead without engineering time. Campaign content is also unarchivable — the gift-of-music page will be edited in place for the next holiday, and this year's copy is simply lost.

**Goal:** marketing authors a promo signup page end to end in the admin panel — copy, background, form questions, notification recipients, Shopify tags — with no deploy.

### Non-goals

- Replacing the existing hardcoded campaigns. They keep working untouched. This is the path for *new* promos; migration is a later, separate decision.
- A general-purpose page builder. This is specifically a signup/lead-capture page type.
- Payment collection. Signup only; no deposits or ticketing.

---

## 2. Existing infrastructure this builds on

Most of the backend already exists and is reused as-is rather than rebuilt.

| Capability | Existing implementation | Reuse |
|---|---|---|
| Resend transport | `@payloadcms/email-resend` wired in `payload.config.ts:187` | as-is |
| Lead email w/ idempotency, replyTo, held-back flags | `src/lib/rsm/lead-email.ts`, `src/lib/actions/notify-rsm-of-lead.ts` | pattern + helpers |
| ZIP → nearest dealer → RSM routing | `notify-rsm-of-lead.ts` | optional toggle |
| Shopify tagged customer upsert (merges tags on existing) | `src/lib/shopify/customers.ts` → `upsertCustomer()` | as-is |
| US/CA tag scoping | `src/lib/shopify/site-tags.ts` → `siteTags()` | as-is |
| Storefront lookup | `getStorefrontBySlugDirect()` in `src/lib/payload/queries.ts` | as-is |
| Music school lookup | `getMusicSchoolByStorefrontSlug()` | as-is |
| Modal / FormField / FormAlert primitives | `src/components/ui/`, `useModal` in `src/hooks` | as-is |
| Brand asset | `public/images/kms/KMS Logo.png` (1430×128) | as-is |

**The only genuinely new work is the CMS layer**: two collections, three blocks, one route, one Server Action, and the client form components.

### Rejected approaches

**`@payloadcms/plugin-form-builder`** (not installed; evaluated). Provides dynamic fields, a submissions collection, and multi-recipient templated email for free. Rejected because (a) its field model is fully dynamic with no notion of a guaranteed core, so nothing prevents a campaign shipping without an email field and the Shopify mapping becomes convention rather than type; and (b) it splits one campaign across two documents — a Form and a Campaign that must be built and linked separately — which increases admin surface for marketing when the goal is to reduce it. Shopify tagging would be custom work under either choice.

**Extending the `Pages` collection.** Cheapest option, but `Pages` routes through the root catch-all `[...slug]`, not under `/store/`, so store-scoped URLs need special-casing regardless. `Pages` has no concept of a form, a recipient, or a lead, and would grow a large conditional tail applying to a single variant.

### Cleanup folded into this work

- Drop the orphaned `landing-pages` MongoDB collection (1 junk document, `slug: "slugger"`, fields for `campaignType`/`utmParameters`/`conversionGoals`). It is an abandoned earlier attempt at this exact feature with no code backing it.
- Delete `src/collections/SitePages.ts.disabled` and `src/collections/Sites.ts.disabled`.

Leaving these means three parallel concepts for one job.

---

## 3. URL model

One route file serves both forms:

```
/store/houston/signup                      → the storefront's default active campaign
/store/houston/signup/fall-open-house      → that campaign specifically
/store/dallas/signup/fall-open-house       → same campaign, different store,
                                             own recipients and own copy overrides
```

Implemented as an optional catch-all: `src/app/(frontend)/store/[storeslug]/signup/[[...campaign]]/page.tsx`.

**Resolution order:**

1. Campaign segment present → find campaign where `slug` matches **and** `stores` contains this storefront.
2. Segment absent → find campaign where `stores` contains this storefront, `isDefault` is true, `isActive` is true, and today falls within `[startDate, endDate]`.
3. No match → `notFound()`.
4. Match but `endDate` has passed → render the **ended state** (see §7), not a 404.

Rationale: named URLs are UTM-able and archivable; the bare URL is short enough for print and QR codes and never needs reprinting between promos.

---

## 4. Data model

### 4.1 `signup-campaigns`

`admin.group: 'Content'`, `useAsTitle: 'title'`, `defaultColumns: ['title', 'slug', 'isActive', 'updatedAt']`.
Access: `create/update: authenticated`, `read: anyone`, `delete: adminOnly`.

**Tab: Campaign**

| Field | Type | Notes |
|---|---|---|
| `title` | text | required |
| `slug` | text | required, `unique`, `index` |
| `stores` | relationship → `storefronts` | `hasMany`, required |
| `isActive` | checkbox | `index`, default `false` |
| `isDefault` | checkbox | resolves the bare `/signup` URL |
| `startDate` / `endDate` | date | optional; empty `endDate` means open-ended |

`isDefault` uniqueness is enforced per-storefront in a `beforeValidate` hook — setting a new default unsets the previous one for the overlapping stores rather than erroring, which is the behavior a marketer expects.

**Tab: Content**

| Field | Type | Notes |
|---|---|---|
| `hero.kicker` | text | e.g. "Fall Open House · October 18" |
| `hero.heading` | text | required — becomes the page `<h1>` |
| `hero.subheading` | textarea | |
| `hero.background` | `mediaField('background')` | image or video, via the factory |
| `hero.scrim` | select | `light` / `medium` / `heavy`, default `medium` |
| `blocks` | blocks | `blockReferences`, see §5 |

**Tab: Form**

| Field | Type | Notes |
|---|---|---|
| `form.title` / `form.subtitle` | text | card header |
| `form.submitLabel` | text | default "Save My Spot" |
| `form.finePrint` | textarea | under the button |
| `form.collectPhone` / `form.requirePhone` | checkbox | core-field toggles |
| `form.collectZip` / `form.requireZip` | checkbox | ZIP is required when RSM auto-routing is on (see §6.3) |
| `form.questions` | array | see below |
| `form.successMode` | select | `message` \| `redirect` |
| `form.successMessage` | richText | when `message` |
| `form.redirectUrl` | text | when `redirect` |

`form.questions[]` rows:

| Field | Type | Notes |
|---|---|---|
| `type` | select | `text` \| `textarea` \| `select` \| `radio` \| `checkbox` \| `date` |
| `label` | text | required — rendered as a real `<label>` |
| `name` | text | auto-slugged from label, editable, unique within the campaign |
| `required` | checkbox | |
| `options` | array of `{ label, value }` | conditional on `type` ∈ select/radio |
| `helpText` | text | |
| `width` | select | `full` \| `half` |

**Tab: Notifications**

| Field | Type | Notes |
|---|---|---|
| `notify.recipients` | array of email | explicit To list |
| `notify.includeStorefrontEmail` | checkbox | adds the storefront's public email |
| `notify.includeSchoolEmail` | checkbox | adds the linked music school's email |
| `notify.autoRouteToRSM` | checkbox | reuses the ZIP→dealer→RSM pipeline |
| `notify.cc` | array of email | defaults to `LEAD_NOTIFY_CC_EMAIL` |
| `notify.subjectTemplate` | text | supports `{{campaign}}`, `{{store}}`, `{{firstName}}` |
| `notify.liveSendEnabled` | checkbox | **default `false`** — see §6.4 |
| `notify.sendConfirmationToLead` | checkbox | **default `true`** |
| `notify.confirmationSubject` | text | |
| `notify.confirmationBody` | richText | |

**Tab: Shopify**

| Field | Type | Notes |
|---|---|---|
| `shopify.enableSync` | checkbox | default `true` |
| `shopify.tags` | array of text | campaign-specific tags |
| `shopify.acceptsMarketing` | checkbox | drives marketing-consent handling |

**Tab: SEO** — standard meta title/description/image, matching other collections.

### 4.2 `signup-leads`

`admin.group: 'Business'`, `useAsTitle: 'email'`.
Access: `create: () => false` (written server-side via Local API only), `read: authenticated`, `update: authenticated`, `delete: adminOnly`.

| Field | Type | Notes |
|---|---|---|
| `campaign` | relationship → `signup-campaigns` | indexed |
| `campaignSlug` | text | denormalized, survives campaign deletion |
| `storefront` | relationship → `storefronts` | indexed |
| `storeslug` | text | denormalized |
| `firstName`, `lastName`, `email`, `phone`, `zip` | text | `email` indexed |
| `answers` | array of `{ name, label, value }` | **denormalized — see below** |
| `utm` | group | source, medium, campaign, term, content |
| `sourceUrl`, `userAgent`, `ipAddress` | text | matches the `kpm-christmas-2k25` precedent |
| `resendStatus` | select | `pending` \| `sent` \| `failed` \| `held` |
| `resendEmailId` | text | |
| `confirmationStatus` / `confirmationEmailId` | select / text | lead-facing email, tracked separately |
| `shopifyStatus` | select | `pending` \| `synced` \| `failed` \| `skipped` |
| `shopifyCustomerId` | text | |
| `submittedAt` | date | |

**Why `answers` is denormalized.** Answers store the question `label` *and* `value` as they were at submission time, rather than storing values keyed against the live campaign schema. Marketers edit campaigns constantly — renaming "Which instrument?" to "Primary instrument", reordering, deleting a question mid-flight. If leads referenced the live schema, every such edit would silently corrupt the historical archive, and a deleted question would orphan its answers entirely. Denormalizing costs a little storage and makes the archive permanently readable.

---

## 5. Blocks

**Reused via `blockReferences`:** `content-rich-text`, `content-image`, `content-video`, `content-banner`, `layout-columns`, `layout-spacer`, `layout-divider`.

**New**, following project conventions (slug `{category}-{name}`, `interfaceName`, barrel export in `src/blocks/signup/index.ts`, registered in the global `blocks` array in `payload.config.ts`):

| Block | Slug | Behavior |
|---|---|---|
| Instructors | `signup-instructors` | Pulls faculty from the linked MusicSchool record. Optional heading; no per-campaign copy needed. |
| Event details | `signup-details` | Labeled facts list — date, time, cost, ages, what to bring. Icon + label + value rows. |
| Location | `signup-location` | Address, hours, map, read from the Storefront record. |

Each new block gets `admin.images.thumbnail` so the block-selection drawer is visual rather than a list of slugs.

---

## 6. Submission pipeline

`src/lib/actions/signup-campaign-submit.ts`, `'use server'`.

### 6.1 Order of operations

1. **Re-fetch the campaign server-side** by `(storeslug, campaignSlug)` and build the Zod schema from that record.
2. **Validate** the payload against the derived schema.
3. **Write the lead** to `signup-leads` via the Local API.
4. **Send the notification** via Resend.
5. **Send the lead confirmation** via Resend, if enabled.
6. **Upsert to Shopify**, if enabled.
7. Return `{ success: true, mode, message | redirectUrl }`.

**Step 1 is a security boundary, not a convenience.** The client must never supply field definitions — if it could, an attacker would POST their own question list and bypass every `required` constraint and every option whitelist. The server derives validation solely from the stored campaign.

**Step 3 precedes every network call deliberately.** The visitor's data is durable on disk before anything that can fail over the network is attempted. Steps 4–6 are independent: each records its own status on the lead, and none can fail the submission or suppress the others.

### 6.2 Resend details

- `replyTo` = the lead's own address, so replying reaches the visitor directly.
- `idempotencyKey` = `signup-lead/{leadId}` — Resend keys expire after 24h and follow the `<event-type>/<entity-id>` convention, so a double-fired submit cannot double-notify.
- `tags` = `[{ name: 'campaign', value: slug }, { name: 'store', value: storeslug }]` for dashboard filtering. Resend tag values accept ASCII letters, numbers, underscores and dashes only — slugs are sanitized before use.
- Notification body renders the contact core as a definition list and `answers[]` as a table.

### 6.3 Recipient resolution

```
To  = notify.recipients
    + storefront.contactInfo.email        (if includeStorefrontEmail)
    + musicSchool.contactInfo.schoolEmail (if includeSchoolEmail)
    + nearest RSM by ZIP                  (if autoRouteToRSM)
Cc  = notify.cc  (default LEAD_NOTIFY_CC_EMAIL)
```

Deduplicated case-insensitively. If the resolved To list is empty, fall back to `LEAD_NOTIFY_FALLBACK_EMAIL` so a lead is never silently dropped.

`autoRouteToRSM` requires a ZIP to geocode against. Enabling it forces `collectZip` and `requireZip` on via a `beforeValidate` hook on the campaign, so the combination cannot be misconfigured in the admin.

**`rsmEmail` is access-restricted and must never reach the browser.** All recipient resolution happens server-side inside the Server Action; the client receives only `{ success }`.

### 6.4 The held-back safety valve

`notify.liveSendEnabled` defaults to `false`. While held, the pipeline runs end to end and logs the exact To/Cc a live send would have used, and marks the lead `resendStatus: 'held'` — routing is fully verifiable before a single real email leaves. This mirrors the pattern already proven in `notify-rsm-of-lead.ts`.

### 6.5 Shopify

```typescript
tags = [
  ...campaign.shopify.tags,
  `signup-${campaignSlug}`,
  `store-${storeslug}`,
  ...(await siteTags()),
]
```

Via the existing `upsertCustomer()`, which merges tags onto existing customers rather than overwriting them.

### 6.6 Spam handling

A honeypot field plus a submit-timing check (reject submissions faster than ~2s). No captcha, no third-party script, and therefore no CSP change.

---

## 7. Rendering

### 7.1 Page

`export const revalidate = 3600`. `generateStaticParams` over active campaign × store pairs. Cache tags `signup-campaign-{slug}` and `signup-campaigns`.

Campaign fetched at **`depth: 1`**, with the storefront pulled separately via `getStorefrontBySlugDirect()`. `depth: 2` on a block-heavy document fires wasted MongoDB round-trips inspecting Media docs that have no relationships — the gotcha already documented in `CLAUDE.md`.

`generateMetadata` wires `getSiteAlternates('/store/{storeslug}/signup/{campaign}')` so `en-US` / `en-CA` alternates stay correct.

### 7.2 The ended state

When `endDate` has passed, the page renders a branded "this promo has ended" panel with a link to the store, at HTTP 200 — not `notFound()`. These URLs live on printed flyers and QR codes that outlive the promo; a 404 discards that traffic and the accumulated link equity.

### 7.3 Layout

Layout C — content column scrolls, form pinned in a right rail; on mobile, content then form with a sticky bottom CTA bar.

**Header lockup A:** `KMS Logo.png` │ hairline rule │ storefront name, on a light header. The logo is 11:1, so on mobile it scales to ~20px tall and the rule + city wrap beneath. The red PNG is used as-is; no white asset is required for this treatment. If a future block places the lockup on a dark background, a proper white/mono SVG is needed — CSS `invert()` on the red PNG fringes on the curves and is not shippable.

### 7.4 Components

| Component | Kind | Responsibility |
|---|---|---|
| `SignupHero` | server | Background + scrim; owns the page's single `<h1>` |
| `SignupRail` | client | Sticky positioning, cap logic |
| `SignupForm` | client | `react-hook-form` + `zodResolver`, same stack as gift-of-music |
| `SignupQuestionField` | client | Renders one `questions[]` row by `type` |
| `SignupMobileBar` | client | Sticky bottom CTA, scroll-to-form |
| `SignupEndedPanel` | server | The ended state |

**The rail cap.** Contact core plus up to **4** questions render inline in the rail. Beyond that, the rail shows contact fields with a "Continue" button opening the remainder in the existing `Modal` primitive from `@/components/ui` via `useModal`. Without this cap, a form taller than the viewport has nowhere to stick and silently scrolls with the page — "sticky" quietly stops meaning anything, and the layout's entire rationale disappears.

Mobile has no rail at all; the sticky bottom bar is the whole mobile conversion path and is built first, not last.

### 7.5 Accessibility

Held to WCAG 2.1 AA, per the project's ADA obligations:

- Every control gets a real `<label>` or `aria-label`. Placeholders are not accessible names.
- Exactly one `<h1>` per page — `SignupHero` owns it; block headings render `h2`.
- Hero scrim must guarantee 4.5:1 for text over any background image or video. Not machine-verifiable; checked visually.
- `kawai-red-400`, not `kawai-red`, for red text on dark (brand red is ~3.6:1 on `kawai-black`).
- Question `label`/`radio`/`checkbox` groups use `<fieldset>` + `<legend>`.
- Validation errors are associated via `aria-describedby` and announced in a live region.

---

## 8. Revalidation

`afterChange` on `signup-campaigns` fires the canonical fire-and-forget POST to `/api/revalidate` with tag `signup-campaign-{doc.slug}`, guarded by `context.skipHook`, passing `req` to any nested operation, always returning `doc`.

---

## 9. Error handling

| Failure | Behavior |
|---|---|
| Campaign not found | `notFound()` |
| Campaign ended | Ended panel, HTTP 200 |
| Validation fails | Field-level errors via `FormAlert` / `FormField`; nothing written |
| Lead write fails | Submission fails; visitor sees a retry message. The only genuinely fatal step. |
| Resend fails | Lead saved; `resendStatus: 'failed'`; visitor still sees success |
| Shopify fails | Lead saved; `shopifyStatus: 'failed'`; visitor still sees success |
| Duplicate submit | Resend idempotency key suppresses the duplicate notification |
| Shopify unconfigured | `shopifyStatus: 'skipped'`, logged, no throw |

Admin surfaces `resendStatus` / `shopifyStatus` as `signup-leads` list columns, so a stuck integration is visible without reading logs.

---

## 10. Testing

| Area | Test |
|---|---|
| Zod builder | `questions[]` → schema, across the required/optional and every field type |
| Zod builder | Client-supplied field definitions are ignored; server schema wins |
| Denormalization | Lead answers stay readable after the campaign's questions are renamed and deleted |
| Recipients | Resolution across every toggle combination, including dedup and empty-list fallback |
| Held-back send | `liveSendEnabled: false` sends nothing and still logs the intended recipients |
| Resolution | Bare `/signup` resolves the default; expired campaign yields the ended panel |
| `isDefault` | Setting a new default unsets the prior one for overlapping stores |
| Pipeline | Resend failure and Shopify failure each leave the lead saved and the submission successful |

---

## 11. Build order

1. **Collections + admin** — `signup-campaigns`, `signup-leads`, hooks. Marketing can author before anything renders.
2. **Route + hero + blocks** — the page renders; no form yet.
3. **Form + Server Action + leads** — conversion works end to end, storing only.
4. **Resend** — notification and confirmation, shipped held back.
5. **Shopify** — tagged upsert.
6. **Mobile bar, polish, accessibility pass.**
7. **Cleanup** — drop `landing-pages`, delete the two `.disabled` files.

Each stage is independently shippable and leaves the system working.

---

## 12. Environment

No new variables. Reuses `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFY_CC_EMAIL`, `LEAD_NOTIFY_FALLBACK_EMAIL`, `SHOPIFY_APP_API_KEY`, `SHOPIFY_APP_CLIENT_SECRET`, `SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATION_SECRET`.

Per-campaign `liveSendEnabled` replaces what would otherwise be a global env toggle, so one campaign can go live while another stays held.
