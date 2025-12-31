# Shopify Admin API Integration

> OAuth-based customer management system using Client Credentials Grant for server-to-server authentication

## Overview

The KAWAI website integrates with Shopify Admin API to automatically create and tag customers when they submit contact forms. This enables sophisticated customer segmentation and targeted marketing based on location, inquiry type, and customer interests.

### Why Admin API?

| Feature | Storefront API | Admin API |
|---------|----------------|-----------|
| **Access Level** | Public (client-safe) | Private (server-only) |
| **Authentication** | Static token | OAuth 2.0 (dynamic tokens) |
| **Use Cases** | Products, cart, checkout | Customers, orders, analytics |
| **Rate Limits** | 1000 req/min | 40 req/sec (REST), 1000 points/sec (GraphQL) |
| **Credentials** | `NEXT_PUBLIC_*` prefix | NO `NEXT_PUBLIC_` prefix |

### Authentication Method

We use **OAuth 2.0 Client Credentials Grant** for authentication:

```
Client ID + Client Secret → OAuth Token (24hr) → Admin API Access
```

**Benefits:**
- ✅ Automatic token refresh (24-hour validity)
- ✅ No manual token management
- ✅ Industry-standard OAuth 2.0
- ✅ Secure server-to-server authentication

---

## Architecture

### System Flow

```
Contact Form Submission
    ↓
Server Action (contact-form.ts)
    ↓
OAuth Client (auth.ts) → Get/Refresh Access Token
    ↓
Admin API Client (admin-client.ts) → GraphQL Mutation
    ↓
Shopify Admin API → Customer Created/Updated with Tags
```

### File Structure

```
src/lib/shopify/
├── auth.ts                  # OAuth token management (NEW)
├── admin-client.ts          # GraphQL client with token injection
├── admin-queries.ts         # Customer mutations and queries
├── customers.ts             # High-level customer functions
└── types.ts                 # TypeScript definitions

src/lib/actions/
└── contact-form.ts          # Server action with Shopify integration

docs/
└── shopify-admin-api-integration.md  # This file
```

---

## Setup Guide

### 1. Create Shopify App in Dev Dashboard

**Important:** Use the modern **Dev Dashboard** (not legacy custom apps).

1. Go to [Shopify Partners Dashboard](https://partners.shopify.com/)
2. Click **Apps** → **Create app**
3. Choose **Create app manually**
4. Enter app name (e.g., "KAWAI Website Integration")
5. Select your development store

### 2. Configure API Scopes

Your app needs these scopes for customer tagging:

| Scope | Permission | Required For |
|-------|------------|--------------|
| `write_customers` | Create/update customers | Creating customers and adding tags |
| `read_customers` | Read customer data | Searching for existing customers by email |

**How to configure:**
1. In Dev Dashboard → Your App → **Configuration**
2. Click **Admin API integration** → **Configure**
3. Select scopes: `write_customers`, `read_customers`
4. Click **Save**

### 3. Get App Credentials

After creating your app, you'll receive:

1. **Client ID** (API Key)
   - Format: `your-client-id-here` (alphanumeric, 32 characters)
   - Location: Dev Dashboard → Your App → **API credentials**
   - Used for: OAuth authentication

2. **Client Secret**
   - Format: `shpss_your-client-secret-here` (starts with `shpss_`)
   - Location: Dev Dashboard → Your App → **API credentials** → **Client secret**
   - ⚠️ **Keep this secret!** Never commit to version control
   - Used for: OAuth token exchange

### 4. Install App to Your Store

1. In Dev Dashboard → Your App → **Test your app**
2. Click **Select store** → Choose your store
3. Click **Install app**
4. Review permissions → Click **Install**
5. App is now installed and ready to use!

### 5. Environment Configuration

Add these to `.env.local`:

```bash
# Shopify Admin API Configuration (Server-Side Only)
# Get from: Shopify Dev Dashboard > Your App > API credentials
SHOPIFY_APP_API_KEY=your-client-id-here
SHOPIFY_APP_CLIENT_SECRET=shpss_your-client-secret-here
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_API_VERSION=2025-01
```

**Security Checklist:**
- ✅ Variables in `.env.local` (NOT `.env`)
- ✅ `.env.local` in `.gitignore`
- ❌ NEVER use `NEXT_PUBLIC_` prefix for these credentials
- ❌ NEVER commit credentials to Git
- ✅ Rotate client secret every 90 days

---

## How It Works

### OAuth Token Flow

```typescript
// 1. Contact form submitted
await submitContactForm(formData)

// 2. OAuth client gets/refreshes token
const token = await getAdminAccessToken() // src/lib/shopify/auth.ts
  ↓
// Token cached for 24 hours (auto-refreshes when expired)

// 3. Admin client uses token for GraphQL request
await shopifyAdminClient.mutate(CUSTOMER_CREATE, { input })
  ↓
// Headers: { 'X-Shopify-Access-Token': token }

// 4. Customer created/updated in Shopify
```

### Token Caching

Tokens are cached in-memory for 24 hours:

```typescript
// First request - fetches new token
const token1 = await getAdminAccessToken()
// POST to https://your-store.myshopify.com/admin/oauth/access_token

// Subsequent requests - uses cached token (instant)
const token2 = await getAdminAccessToken() // From cache
const token3 = await getAdminAccessToken() // From cache

// After 24 hours - automatically refreshes
const token4 = await getAdminAccessToken() // Fetches new token
```

### Customer Tagging

When a user submits a contact form:

1. **Extract Data**: Location slug, inquiry type, preferences
2. **Build Tags**:
   ```typescript
   const tags = [
     'location-st-louis',           // Storefront location
     'inquiry-piano-consultation',  // Inquiry type
     'source-contact-form',         // Lead source
     'contact-email',               // Preferred contact method
     'piano-digital-piano'          // Piano interest (optional)
   ]
   ```
3. **Create/Update Customer**:
   - Search by email
   - If exists: Add new tags (preserves existing)
   - If new: Create customer with tags
4. **Result**: Customer segmented in Shopify for targeted marketing

---

## Tag Structure

### Naming Convention

**Format**: `category-value` (lowercase, hyphenated)

```typescript
// ✅ Good
'location-st-louis'
'inquiry-piano-consultation'
'source-contact-form'

// ❌ Bad
'St. Louis'              // Has spaces, capitals
'piano consultation'     // No category prefix
'ContactForm'            // Inconsistent casing
```

### Tag Categories

```typescript
// Location tags (from storefront slug)
'location-st-louis'
'location-chicago'
'location-denver'

// Inquiry type tags
'inquiry-piano-consultation'
'inquiry-service'
'inquiry-financing'
'inquiry-scheduling'
'inquiry-general'

// Source tags
'source-contact-form'
'source-piano-finder'
'source-event-registration'

// Contact preference tags
'contact-email'
'contact-phone'
'contact-text'

// Piano interest tags
'piano-digital-piano'
'piano-grand-piano'
'piano-acoustic-upright'
'piano-hybrid-piano'

// Time preference tags
'call-time-morning'
'call-time-afternoon'
'call-time-evening'
'call-time-anytime'
```

---

## Code Examples

### Basic Customer Creation

```typescript
import { createCustomerWithTags } from '@/lib/shopify/customers'

const customer = await createCustomerWithTags({
  email: 'customer@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+14155551234',
  tags: ['location-st-louis', 'inquiry-piano-consultation'],
  emailMarketingConsent: {
    marketingState: 'SUBSCRIBED',
    marketingOptInLevel: 'SINGLE_OPT_IN'
  },
  note: 'Interested in Shigeru Kawai SK-7'
})

console.log(customer.id) // gid://shopify/Customer/123456
console.log(customer.tags) // ['location-st-louis', 'inquiry-piano-consultation']
```

### Add Tags to Existing Customer

```typescript
import { addTagsToCustomer } from '@/lib/shopify/customers'

// Preserves existing tags, adds new ones
const customer = await addTagsToCustomer(
  'gid://shopify/Customer/123456',
  ['inquiry-service', 'piano-grand-piano']
)
```

### Create or Update (Recommended)

```typescript
import { createOrUpdateCustomerWithTags } from '@/lib/shopify/customers'

// Automatically handles create vs update
const customer = await createOrUpdateCustomerWithTags({
  email: 'customer@example.com',
  firstName: 'John',
  lastName: 'Doe',
  tags: ['location-chicago', 'source-piano-finder'],
  emailMarketingConsent: {
    marketingState: 'UNSUBSCRIBED'
  }
})
```

### Contact Form Integration

```typescript
// In server action (src/lib/actions/contact-form.ts)
import { createOrUpdateCustomerWithTags } from '@/lib/shopify/customers'

export async function submitContactForm(formData: FormData) {
  // Build tags from form data
  const tags = [
    `location-${storefrontSlug}`,
    `inquiry-${contactData.inquiryType}`,
    'source-contact-form',
    `contact-${contactData.preferredContact}`
  ]

  // Add optional tags
  if (contactData.pianoInterest) {
    tags.push(`piano-${contactData.pianoInterest.toLowerCase().replace(/\s+/g, '-')}`)
  }

  if (contactData.bestTimeToCall) {
    tags.push(`call-time-${contactData.bestTimeToCall}`)
  }

  // Create/update customer
  try {
    await createOrUpdateCustomerWithTags({
      email: contactData.email,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      phone: contactData.phone,
      tags,
      emailMarketingConsent: contactData.subscribeToUpdates
        ? {
            marketingState: 'SUBSCRIBED',
            marketingOptInLevel: 'SINGLE_OPT_IN'
          }
        : undefined,
      note: contactData.message || undefined
    })

    console.log('[Contact Form] Customer tagged successfully')
  } catch (error) {
    console.error('[Contact Form] Shopify integration failed:', error)
    // Continue with form submission - don't block user
  }

  return { success: true }
}
```

---

## API Reference

### `getAdminAccessToken()`

Gets a valid OAuth access token (cached for 24 hours).

**File:** `src/lib/shopify/auth.ts`

**Returns:** `Promise<string>` - Valid access token

**Throws:** `Error` if OAuth flow fails

**Example:**
```typescript
import { getAdminAccessToken } from '@/lib/shopify/auth'

const token = await getAdminAccessToken()
// Uses cached token if valid, otherwise fetches new one
```

---

### `createCustomerWithTags(input)`

Creates a new customer with tags.

**File:** `src/lib/shopify/customers.ts`

**Parameters:**
- `input: CustomerInput` - Customer data

**Returns:** `Promise<Customer>`

**Throws:** `CustomerError` if creation fails

**Example:**
```typescript
const customer = await createCustomerWithTags({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  tags: ['location-st-louis']
})
```

---

### `addTagsToCustomer(customerId, tags)`

Adds tags to existing customer (preserves existing tags).

**Parameters:**
- `customerId: string` - Shopify customer ID
- `tags: string[]` - Tags to add

**Returns:** `Promise<Customer>`

**Example:**
```typescript
await addTagsToCustomer(
  'gid://shopify/Customer/123456',
  ['inquiry-service']
)
```

---

### `createOrUpdateCustomerWithTags(input)`

Creates new customer or updates existing one (recommended).

**Parameters:**
- `input: CustomerInput` - Customer data (email required)

**Returns:** `Promise<Customer>`

**Example:**
```typescript
await createOrUpdateCustomerWithTags({
  email: 'john@example.com',
  tags: ['location-chicago']
})
```

---

### `getCustomerByEmail(email)`

Searches for customer by email.

**Parameters:**
- `email: string` - Customer email

**Returns:** `Promise<Customer | null>`

**Example:**
```typescript
const customer = await getCustomerByEmail('john@example.com')
if (customer) {
  console.log(customer.tags)
}
```

---

## Troubleshooting

### "Missing Shopify credentials" Error

**Error Message:**
```
Missing Shopify credentials: SHOPIFY_APP_API_KEY, SHOPIFY_APP_CLIENT_SECRET,
and SHOPIFY_STORE_DOMAIN are required
```

**Cause:** Environment variables not set

**Solution:**
```bash
# Add to .env.local
SHOPIFY_APP_API_KEY=your-client-id-here
SHOPIFY_APP_CLIENT_SECRET=shpss_your-client-secret-here
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

---

### "Failed to obtain access token: 401 Unauthorized"

**Cause:** Invalid client secret or client ID

**Solution:**
1. Go to Dev Dashboard → Your App → **API credentials**
2. Verify **Client ID** matches `SHOPIFY_APP_API_KEY`
3. Regenerate client secret if needed:
   - Click **Rotate client secret**
   - Copy new secret immediately (shown once!)
   - Update `SHOPIFY_APP_CLIENT_SECRET` in `.env.local`
4. Restart dev server: `bun run dev`

---

### "Access denied. Please check scopes"

**Error:** 403 Forbidden

**Cause:** Missing `write_customers` or `read_customers` scope

**Solution:**
1. Dev Dashboard → Your App → **Configuration**
2. **Admin API integration** → **Configure**
3. Enable: `write_customers`, `read_customers`
4. Click **Save**
5. **Reinstall app** to store (required for scope changes)

---

### Token Expired / Not Refreshing

**Symptoms:** Requests work initially, then fail after 24 hours

**Cause:** Token cache not refreshing

**Solution:**
```typescript
// Clear cache manually (for testing)
import { clearTokenCache } from '@/lib/shopify/auth'
clearTokenCache()

// Next request will fetch fresh token
const token = await getAdminAccessToken()
```

**Production:** Tokens auto-refresh. If persistent, check:
- Server logs for OAuth errors
- Client secret is still valid
- App is still installed on store

---

### "Customer creation failed: Email already exists"

**Cause:** Using `createCustomerWithTags()` for existing customer

**Solution:** Use `createOrUpdateCustomerWithTags()`:
```typescript
// ❌ Fails if customer exists
await createCustomerWithTags({ email: '...' })

// ✅ Handles both create and update
await createOrUpdateCustomerWithTags({ email: '...' })
```

---

### Tags Not Appearing in Shopify

**Symptoms:** Customer created but no tags visible

**Solution:**
1. Wait 10-30 seconds and refresh Shopify Admin
2. Check console logs for errors
3. Verify tags were sent:
   ```typescript
   const customer = await getCustomerByEmail('test@example.com')
   console.log('Customer tags:', customer.tags)
   ```
4. Check tag format (lowercase, hyphenated, no spaces)

---

### Rate Limiting: "THROTTLED" Error

**Error:** GraphQL error with `code: 'THROTTLED'`

**Cause:** Exceeded GraphQL cost limit (1000 points/second)

**Solution:**
- Admin client automatically retries with exponential backoff
- If persistent, reduce request frequency
- Check Shopify API status: https://www.shopifystatus.com/

---

## Best Practices

### 1. Always Use Error Handling

```typescript
// ✅ Good - Non-blocking
try {
  await createOrUpdateCustomerWithTags({...})
  console.log('Customer tagged successfully')
} catch (error) {
  console.error('Shopify tagging failed:', error)
  // Don't block form submission
}

// ❌ Bad - Blocks user if Shopify fails
await createOrUpdateCustomerWithTags({...}) // Uncaught errors crash the app
```

### 2. Use createOrUpdateCustomerWithTags()

```typescript
// ✅ Recommended - Handles both scenarios
await createOrUpdateCustomerWithTags({ email: '...' })

// ❌ Error-prone - Requires manual checking
const existing = await getCustomerByEmail('...')
if (existing) {
  await addTagsToCustomer(existing.id, [...])
} else {
  await createCustomerWithTags({...})
}
```

### 3. Consistent Tag Naming

```typescript
// ✅ Good
tags.push(`location-${slug}`)                          // location-st-louis
tags.push(`inquiry-${type}`)                           // inquiry-piano-consultation
tags.push(`piano-${interest.toLowerCase().replace(/\s+/g, '-')}`) // piano-digital-piano

// ❌ Bad
tags.push(slug)                  // st-louis (no category)
tags.push(`Inquiry: ${type}`)    // Inquiry: piano-consultation (inconsistent)
tags.push(interest)              // Digital Piano (spaces, capitals)
```

### 4. Graceful Degradation

Shopify integration should NEVER block form submissions:

```typescript
// ✅ Good - Form succeeds even if Shopify fails
const isShopifyEnabled = process.env.SHOPIFY_APP_API_KEY &&
                        process.env.SHOPIFY_APP_CLIENT_SECRET

if (isShopifyEnabled) {
  try {
    await createOrUpdateCustomerWithTags({...})
  } catch (error) {
    console.error('Shopify integration failed:', error)
    // Continue with form submission
  }
}

// Send email notification, etc.
return { success: true }
```

---

## Testing

### Local Development

```bash
# 1. Configure .env.local with test credentials
SHOPIFY_APP_API_KEY=test-client-id
SHOPIFY_APP_CLIENT_SECRET=shpss_test-secret
SHOPIFY_STORE_DOMAIN=test-store.myshopify.com

# 2. Start dev server
bun run dev

# 3. Navigate to storefront contact page
# Example: http://localhost:3000/st-louis/contact

# 4. Submit form with test data

# 5. Check console logs
# Look for: "[Shopify Auth] Successfully obtained new access token"
#           "[Contact Form] Customer tagged successfully"

# 6. Verify in Shopify Admin
# Shopify Admin → Customers → Search by email
# Check customer tags
```

### Testing Token Refresh

```typescript
// Force token expiration for testing
import { clearTokenCache } from '@/lib/shopify/auth'

// Clear cache
clearTokenCache()

// Next request fetches fresh token
const customer = await createOrUpdateCustomerWithTags({...})
// Check logs for: "[Shopify Auth] Requesting new access token"
```

### Debug Mode

Enable verbose logging in development:

```typescript
// src/lib/shopify/auth.ts - Already includes console.log statements
// Check terminal output for:
// - "[Shopify Auth] Using cached access token"
// - "[Shopify Auth] Requesting new access token via client credentials grant"
// - "[Shopify Auth] Successfully obtained new access token"
```

---

## Security Considerations

### Environment Variables

**Critical:**
- ❌ NEVER use `NEXT_PUBLIC_` prefix for Admin API credentials
- ❌ NEVER commit `.env.local` to version control
- ✅ Admin API credentials are server-side only
- ✅ Rotate client secret every 90 days

### Scopes

**Principle of Least Privilege:**
- Only enable scopes you need
- Currently required: `write_customers`, `read_customers`
- Don't enable `write_products`, `write_orders`, etc. unless needed

### Token Security

**OAuth tokens are:**
- ✅ Cached in-memory (not persisted to disk)
- ✅ Server-side only (never sent to client)
- ✅ Automatically refreshed (24-hour expiry)
- ✅ Short-lived (reduces risk if compromised)

---

## Monitoring & Maintenance

### What to Monitor

1. **Token Refresh Success Rate**
   - Check logs for OAuth errors
   - Alert if > 5% failure rate

2. **Customer Creation Success Rate**
   - Monitor for `CustomerError` exceptions
   - Alert if > 2% failure rate

3. **API Rate Limits**
   - Watch for `THROTTLED` errors
   - Reduce frequency if persistent

### Maintenance Tasks

| Task | Frequency | Action |
|------|-----------|--------|
| Rotate client secret | 90 days | Dev Dashboard → Rotate → Update `.env.local` |
| Review API scopes | 180 days | Remove unused scopes |
| Check Shopify updates | Monthly | Review Admin API changelog |
| Audit customer tags | Quarterly | Clean up unused tags in Shopify |

---

## Migration Notes

### API Version 2025-01 Changes (December 2024)

**Breaking Change**: Shopify Admin API version 2025-01 replaced `acceptsMarketing` with `emailMarketingConsent`.

**Old approach (deprecated):**
```typescript
// ❌ No longer works in API 2025-01
{
  acceptsMarketing: true
}
```

**New approach (current):**
```typescript
// ✅ Use emailMarketingConsent structure
{
  emailMarketingConsent: {
    marketingState: 'SUBSCRIBED',  // or 'UNSUBSCRIBED'
    marketingOptInLevel: 'SINGLE_OPT_IN'  // or 'CONFIRMED_OPT_IN', 'UNKNOWN'
  }
}
```

**GraphQL Response Changes:**
- ❌ Removed: `customer.acceptsMarketing`
- ✅ Added: `customer.emailMarketingConsent.marketingState`
- ❌ Removed: `userErrors.code` field from mutation responses
- ✅ Kept: `userErrors.field` and `userErrors.message`

**Migration steps:**
1. Update all `acceptsMarketing` references to `emailMarketingConsent`
2. Update TypeScript types to use `EmailMarketingConsent` interface
3. Update GraphQL queries to request `emailMarketingConsent` instead of `acceptsMarketing`
4. Remove `code` field from `userErrors` in GraphQL mutations
5. Test contact form submissions in development
6. Verify customer records in Shopify Admin

---

### From Static Token to OAuth (Jan 2025)

**Old approach:**
```bash
# Static token (deprecated)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
```

**New approach:**
```bash
# OAuth credentials (current)
SHOPIFY_APP_API_KEY=client-id
SHOPIFY_APP_CLIENT_SECRET=shpss_xxxxx
```

**What changed:**
- ✅ Automatic token refresh (24-hour validity)
- ✅ No manual token management
- ✅ Industry-standard OAuth 2.0
- ✅ Created `src/lib/shopify/auth.ts` for token management
- ✅ Updated `admin-client.ts` to inject dynamic tokens

**Migration steps:**
1. Get client ID and secret from Dev Dashboard
2. Update `.env.local` with new variables
3. Remove old `SHOPIFY_ADMIN_ACCESS_TOKEN`
4. Restart dev server
5. Test contact form submission

---

## Additional Resources

- **Shopify Admin API Docs**: https://shopify.dev/docs/api/admin-graphql
- **OAuth Client Credentials**: https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant
- **Customer Management**: https://shopify.dev/docs/api/admin-graphql/latest/objects/Customer
- **API Scopes**: https://shopify.dev/docs/api/usage/access-scopes
- **Rate Limits**: https://shopify.dev/docs/api/usage/rate-limits
- **Shopify API Status**: https://www.shopifystatus.com/

---

## Support

**For issues:**

1. Check troubleshooting section above
2. Review console logs for error messages
3. Verify environment variables in `.env.local`
4. Check Shopify API status
5. Test OAuth flow with `clearTokenCache()`

**Common issues:**
- 401 Unauthorized → Invalid client secret
- 403 Forbidden → Missing API scopes
- THROTTLED → Rate limit exceeded (auto-retries)
- Customer exists → Use `createOrUpdateCustomerWithTags()`

---

*Last Updated: December 31, 2024*
*OAuth Client Credentials Grant Implementation*
