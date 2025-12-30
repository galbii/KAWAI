# Shopify Webhook Integration for Real-Time Navigation Updates

> Complete guide for implementing Shopify webhooks to automatically update the KAWAI website when products change

## Overview

This document provides step-by-step instructions for setting up Shopify webhooks to trigger on-demand revalidation of the product navigation menu when products are created, updated, or deleted in your Shopify store.

### Why Webhooks Are Needed

**Problem**: The current implementation fetches product navigation data only once when the header component mounts. Even with 5-minute ISR caching, changes to Shopify products don't appear in the mega menu until:
1. The user refreshes the page AND
2. The ISR cache has expired AND
3. A new request triggers regeneration

**Solution**: Shopify webhooks notify the Next.js app immediately when products change, allowing instant revalidation of cached data.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Shopify Product Changes (Create/Update/Delete)                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Shopify Webhook Delivery                                       │
│  POST https://your-domain.com/api/shopify/webhooks              │
│  Headers:                                                       │
│    - X-Shopify-Topic: products/update                          │
│    - X-Shopify-Hmac-Sha256: [signature]                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Webhook Handler (api/shopify/webhooks/route.ts)               │
│  1. Verify HMAC signature                                      │
│  2. Parse webhook payload                                      │
│  3. Call revalidation API                                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Revalidation API (api/revalidate/route.ts)                    │
│  revalidatePath('/') - Clears Next.js ISR cache                │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Next Request to Site                                           │
│  - Fetches fresh product data from Shopify                     │
│  - Regenerates navigation with updated products                │
│  - User sees changes immediately                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Guide

### Part 1: Create Webhook Handler

#### Step 1: Create Webhook Endpoint

Create a new file: `src/app/api/shopify/webhooks/route.ts`

```typescript
/**
 * Shopify Webhook Handler
 *
 * Receives webhook notifications from Shopify when products change
 * Triggers on-demand revalidation of product navigation
 *
 * Security: Verifies HMAC-SHA256 signature from Shopify
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Verify Shopify webhook HMAC signature
 *
 * Shopify signs each webhook with HMAC-SHA256 using your webhook secret
 * This ensures the webhook genuinely comes from Shopify
 *
 * @param body - Raw request body as string
 * @param hmacHeader - X-Shopify-Hmac-Sha256 header value
 * @returns true if signature is valid
 */
function verifyShopifyWebhook(body: string, hmacHeader: string | null): boolean {
  if (!hmacHeader) {
    console.error('[Shopify Webhook] Missing HMAC header')
    return false
  }

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) {
    console.error('[Shopify Webhook] SHOPIFY_WEBHOOK_SECRET not configured')
    return false
  }

  // Generate HMAC from body using webhook secret
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64')

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hmacHeader)
  )
}

/**
 * POST /api/shopify/webhooks
 *
 * Handles incoming webhooks from Shopify
 * Must respond within 5 seconds or Shopify will retry
 */
export async function POST(request: NextRequest) {
  try {
    // IMPORTANT: Get raw body as text for HMAC verification
    // Parsing to JSON first will invalidate the signature
    const body = await request.text()

    // Verify webhook authenticity
    const hmac = request.headers.get('X-Shopify-Hmac-Sha256')

    if (!verifyShopifyWebhook(body, hmac)) {
      console.error('[Shopify Webhook] Invalid HMAC signature - possible forgery attempt')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Extract webhook metadata from headers
    const topic = request.headers.get('X-Shopify-Topic')
    const shop = request.headers.get('X-Shopify-Shop-Domain')
    const eventId = request.headers.get('X-Shopify-Event-Id')
    const triggeredAt = request.headers.get('X-Shopify-Triggered-At')
    const apiVersion = request.headers.get('X-Shopify-API-Version')

    console.log(`[Shopify Webhook] Received webhook:`, {
      topic,
      shop,
      eventId,
      triggeredAt,
      apiVersion
    })

    // Parse webhook payload
    const data = JSON.parse(body)

    // Handle product-related webhooks
    if (topic?.startsWith('products/')) {
      const productHandle = data.handle
      const productId = data.id

      console.log(`[Shopify Webhook] Product ${topic.split('/')[1]}: ${productHandle} (ID: ${productId})`)

      // Define paths to revalidate
      const pathsToRevalidate = [
        '/',                              // Homepage (navigation menu)
        '/products',                      // Products listing page
      ]

      // Add specific product page if it exists
      if (productHandle) {
        pathsToRevalidate.push(`/products/${productHandle}`)
      }

      // Trigger revalidation for each path
      const revalidationResults = await Promise.allSettled(
        pathsToRevalidate.map(async (path) => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret: process.env.REVALIDATION_SECRET,
              path: path,
            }),
            // Don't wait too long - Shopify expects response within 5 seconds
            signal: AbortSignal.timeout(4000)
          })

          if (!response.ok) {
            throw new Error(`Revalidation failed: ${response.status}`)
          }

          return path
        })
      )

      // Log results
      revalidationResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`[Shopify Webhook] ✓ Revalidated: ${result.value}`)
        } else {
          console.error(`[Shopify Webhook] ✗ Failed to revalidate ${pathsToRevalidate[index]}:`, result.reason)
        }
      })
    }

    // Shopify requires a 200 response within 5 seconds
    return NextResponse.json({
      received: true,
      topic,
      eventId,
      processedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Shopify Webhook] Error processing webhook:', error)

    // Still return 200 to prevent Shopify from retrying
    // Log the error for manual investigation
    return NextResponse.json(
      {
        received: true,
        error: 'Webhook processing failed - logged for investigation'
      },
      { status: 200 } // 200 to prevent retries
    )
  }
}

/**
 * GET /api/shopify/webhooks
 *
 * Health check endpoint (optional)
 * Not used by Shopify - for your own monitoring
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/shopify/webhooks',
    supportedTopics: [
      'products/create',
      'products/update',
      'products/delete'
    ],
    configured: !!process.env.SHOPIFY_WEBHOOK_SECRET
  })
}
```

#### Step 2: Add Environment Variables

Add to `.env.local`:

```bash
# Shopify Webhook Secret
# This will be generated when you create the webhook in Shopify Admin
# Keep this secret - it's used to verify webhook authenticity
SHOPIFY_WEBHOOK_SECRET=your-shopify-webhook-secret-here

# Already exists - ensure these are set correctly
REVALIDATION_SECRET=your-revalidation-secret
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com  # or http://localhost:3000 for dev
```

**⚠️ Important**:
- `SHOPIFY_WEBHOOK_SECRET` is different from your Shopify API tokens
- You'll get this secret from Shopify when creating the webhook
- Never commit this to version control

---

### Part 2: Configure Webhooks in Shopify Admin

#### Method A: Via Shopify Admin Interface (Recommended)

1. **Navigate to Webhooks**
   - Log in to Shopify Admin
   - Go to **Settings** → **Notifications**
   - Scroll to bottom, click **Webhooks** section

2. **Create Webhook for Products Created**
   - Click **Create webhook**
   - **Event**: Select `Product creation`
   - **Format**: Select `JSON`
   - **URL**: Enter `https://your-domain.com/api/shopify/webhooks`
   - **API version**: Latest (2024-01 or newer)
   - Click **Save**

3. **Create Webhook for Products Updated**
   - Click **Create webhook** again
   - **Event**: Select `Product update`
   - **Format**: Select `JSON`
   - **URL**: Enter `https://your-domain.com/api/shopify/webhooks`
   - Click **Save**

4. **Create Webhook for Products Deleted**
   - Click **Create webhook** again
   - **Event**: Select `Product deletion`
   - **Format**: Select `JSON`
   - **URL**: Enter `https://your-domain.com/api/shopify/webhooks`
   - Click **Save**

5. **Get Webhook Secret**
   - Click on one of your created webhooks
   - Copy the **Webhook ID** or **Secret** (if shown)
   - Add it to your `.env.local` as `SHOPIFY_WEBHOOK_SECRET`

**Note**: If the secret isn't visible in the UI, Shopify may provide it via the API. See Method B below.

#### Method B: Via GraphQL Admin API (Programmatic)

For automated setup or if you prefer using the API:

```graphql
# Create products/create webhook
mutation {
  webhookSubscriptionCreate(
    topic: PRODUCTS_CREATE
    webhookSubscription: {
      format: JSON
      callbackUrl: "https://your-domain.com/api/shopify/webhooks"
    }
  ) {
    webhookSubscription {
      id
      topic
      format
      endpoint {
        __typename
        ... on WebhookHttpEndpoint {
          callbackUrl
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}

# Repeat for PRODUCTS_UPDATE and PRODUCTS_DELETE
```

The response will include the webhook secret you need for your environment variables.

---

### Part 3: Testing the Integration

#### Local Testing with ngrok

Since Shopify needs to reach your webhook endpoint, you'll need to expose your local server:

```bash
# 1. Start your Next.js dev server
bun run dev

# 2. In another terminal, install and run ngrok
npm install -g ngrok
ngrok http 3000

# 3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# 4. Use this URL in Shopify webhook settings:
#    https://abc123.ngrok.io/api/shopify/webhooks
```

#### Test Webhook Delivery

**Method 1: Send Test Notification from Shopify Admin**
1. Go to Settings → Notifications → Webhooks
2. Click on one of your webhooks
3. Click **Send test notification**
4. Check your console logs to verify receipt

**Method 2: Create/Update a Real Product**
1. Create a new product in Shopify Admin
2. Check your Next.js server logs
3. You should see:
   ```
   [Shopify Webhook] Received webhook: {
     topic: 'products/create',
     shop: 'your-store.myshopify.com',
     ...
   }
   [Shopify Webhook] ✓ Revalidated: /
   ```

#### Monitor Webhook Deliveries

In Shopify Admin:
1. Go to Settings → Notifications → Webhooks
2. Click on a webhook
3. View **Recent deliveries** section
4. Check for:
   - **Success** (200 response) = Working correctly
   - **Failed** = Check error message and your logs

---

## Webhook Payload Examples

### products/create

```json
{
  "id": 8692854874407,
  "title": "KAWAI ES920 Digital Piano",
  "handle": "kawai-es920-digital-piano",
  "body_html": "<p>Professional portable digital piano</p>",
  "vendor": "KAWAI",
  "product_type": "Digital Piano",
  "created_at": "2024-01-15T10:30:00-05:00",
  "updated_at": "2024-01-15T10:30:00-05:00",
  "published_at": "2024-01-15T10:30:00-05:00",
  "status": "active",
  "tags": "digital-piano, portable, professional",
  "variants": [...],
  "images": [...],
  "options": [...]
}
```

### products/update

Same structure as `products/create`, with updated fields.

### products/delete

```json
{
  "id": 8692854874407
}
```

**Note**: Product deletion webhooks only include the product ID, not full details.

---

## Webhook Headers

Every webhook request includes these headers:

| Header | Example | Purpose |
|--------|---------|---------|
| `X-Shopify-Topic` | `products/update` | Event type |
| `X-Shopify-Hmac-Sha256` | `base64-encoded-signature` | Security verification |
| `X-Shopify-Shop-Domain` | `your-store.myshopify.com` | Source store |
| `X-Shopify-Event-Id` | `uuid` | Unique event ID (deduplication) |
| `X-Shopify-Triggered-At` | `2024-01-15T10:30:00Z` | Event timestamp (ISO 8601) |
| `X-Shopify-API-Version` | `2024-01` | API version used |

---

## Best Practices

### Security
- ✅ Always verify HMAC signature before processing
- ✅ Use `crypto.timingSafeEqual()` to prevent timing attacks
- ✅ Never expose `SHOPIFY_WEBHOOK_SECRET` in client-side code
- ✅ Return 200 status even on processing errors (to prevent infinite retries)

### Performance
- ✅ Respond to Shopify within 5 seconds or the webhook will retry
- ✅ Process revalidation asynchronously (use `Promise.allSettled()`)
- ✅ Set timeouts on revalidation requests (4 seconds max)
- ✅ Log errors but don't throw - investigate manually later

### Reliability
- ✅ Use `X-Shopify-Event-Id` to detect duplicate events
- ✅ Use timestamps to order events (delivery order not guaranteed)
- ✅ Handle the case where `products/update` arrives before `products/create`
- ✅ Monitor webhook delivery status in Shopify Admin

### Debugging
- ✅ Add comprehensive logging for all webhook events
- ✅ Include event metadata (topic, shop, eventId) in logs
- ✅ Test both with Shopify's "Send test notification" and real product changes
- ✅ Use ngrok for local development testing

---

## Troubleshooting

### Webhook Not Received

**Check:**
1. Webhook URL is correct and publicly accessible
2. Firewall/security groups allow Shopify's IP ranges
3. SSL certificate is valid (Shopify requires HTTPS in production)
4. Check Shopify Admin → Webhooks → Recent deliveries for errors

### HMAC Verification Fails

**Check:**
1. `SHOPIFY_WEBHOOK_SECRET` matches the secret in Shopify
2. You're reading the raw request body (not parsed JSON)
3. Character encoding is UTF-8
4. Using `timingSafeEqual` for comparison

### Revalidation Not Working

**Check:**
1. `REVALIDATION_SECRET` is set correctly
2. `NEXT_PUBLIC_SITE_URL` points to correct domain
3. `/api/revalidate` endpoint is working (test separately)
4. Check Next.js server logs for revalidation errors
5. ISR cache may take one additional request to regenerate

### Webhook Times Out

**Check:**
1. Revalidation requests have timeout set (max 4 seconds)
2. Not waiting for all promises with `await Promise.all()` - use `Promise.allSettled()`
3. Total processing time under 5 seconds
4. Return 200 response quickly, log errors for later

---

## Migration Path

### Current State (Before Webhooks)
- ❌ Changes appear after 5+ minutes
- ❌ Requires page refresh
- ❌ Depends on ISR cache expiration

### With Webhooks (After Implementation)
- ✅ Changes appear within seconds
- ✅ Automatic cache invalidation
- ✅ No user action required
- ✅ Instant synchronization with Shopify

### Implementation Order
1. ✅ Create webhook handler (`/api/shopify/webhooks/route.ts`)
2. ✅ Add environment variables
3. ✅ Deploy to production
4. ✅ Configure webhooks in Shopify Admin
5. ✅ Test webhook delivery
6. ✅ Monitor in production

---

## Additional Resources

- [Shopify Webhooks Documentation](https://shopify.dev/docs/api/webhooks)
- [Next.js On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation)
- [KAWAI Shopify Integration Guide](/docs/shopify-integration.md)

---

## Support & Maintenance

**Monitoring Webhook Health:**
- Check Shopify Admin → Settings → Notifications → Webhooks weekly
- Monitor success rate (should be >99%)
- Review failed deliveries and investigate errors

**When to Reconfigure:**
- Domain changes (update webhook URLs)
- API version upgrades (test compatibility first)
- Security incidents (rotate webhook secret)

**Future Enhancements:**
- Add webhook event deduplication using `X-Shopify-Event-Id`
- Implement webhook event queue for high-traffic scenarios
- Add retry logic with exponential backoff
- Set up monitoring/alerting for webhook failures

---

*Last Updated: 2024*
*Status: Ready for Implementation*
