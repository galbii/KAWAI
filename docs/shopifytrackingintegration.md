# Shopify Tracking Integration Guide

Setup guide for connecting Shopify checkout to GA4, Meta Pixel, and cross-domain tracking.

**Complete these in order** — cross-domain tracking must be set up before everything else or purchase attribution will be wrong.

---

## 1. GA4 Cross-Domain Measurement

**Why:** When a user moves from your site to Shopify's checkout domain, GA4 starts a new session and attributes the purchase to `kawai.com` (self-referral) instead of the original traffic source (Google, Facebook, etc.). Cross-domain measurement stitches the session together.

**Steps:**
1. Go to **GA4 Admin** → Data Streams → select your web stream
2. Click **Configure tag settings**
3. Under **Settings**, click **Configure your domains**
4. Click **Add condition** and add your Shopify checkout domain
   - If using Shopify's default: `shop.app` and `checkout.shopify.com`
   - If using a custom checkout domain: add that domain instead
5. Save

**Verify:** After setup, visit a product page, click Buy Now, and check GA4 DebugView. You should see a continuous session from your site through checkout with no session break.

---

## 2. Connect Shopify to Google Analytics 4

**Why:** Shopify controls the order confirmation page. The only way to get `purchase` events into GA4 is via Shopify's native Google integration.

**Steps:**
1. Go to **Shopify Admin** → Sales Channels → click **+** to add a channel
2. Search for and install **Google & YouTube**
3. In the Google & YouTube channel → click **Connect Google account**
4. Under **Google Analytics**, click **Connect** and select your GA4 property
5. Enable **Enhanced ecommerce** — this fires `view_item`, `add_to_cart`, `begin_checkout`, and `purchase` events natively from Shopify's checkout pages

**Note:** Shopify will fire its own `begin_checkout` and `purchase` events. Our code also fires `begin_checkout` from the product page — this means you'll see two `begin_checkout` events per session (one from us, one from Shopify). That's expected and correct; they measure different points in the funnel.

---

## 3. Connect Shopify to Meta Pixel

**Why:** Same reason as GA4 — Shopify controls the order confirmation page, so Meta's `Purchase` event must be fired by Shopify.

**Steps:**
1. Go to **Shopify Admin** → Sales Channels → click **+** to add a channel
2. Search for and install **Facebook & Instagram**
3. Connect your Facebook Business account
4. Under **Meta Pixel**, select your existing Pixel ID — this must match `NEXT_PUBLIC_META_PIXEL_ID` in your `.env`
5. Enable **Conversions API** (CAPI) if available — this server-side fallback improves tracking accuracy by ~20-30% when browsers block client-side pixels

**Important:** Do NOT create a new pixel — use the same Pixel ID that's already on the website. Using two different IDs will split your audience data and break ad optimization.

---

## 4. Verify Meta Pixel Domain

**Why:** Meta requires your checkout domain to be authorized before it will accept pixel events from it.

**Steps:**
1. Go to **Meta Business Manager** → Events Manager → select your Pixel
2. Click **Settings** → scroll to **Verify domains**
3. Add and verify:
   - Your main domain (e.g. `kawai.com`)
   - Your Shopify checkout domain (e.g. `checkout.shopify.com` or custom domain)
4. Follow Meta's verification instructions (usually a DNS TXT record or HTML file upload)

---

## 5. Shopify Customer Events (Optional — Custom Pixel)

Use this if you need custom event data at checkout that Shopify's native integration doesn't provide (e.g. storefront slug, custom properties).

**Steps:**
1. Go to **Shopify Admin** → Settings → **Customer events**
2. Click **Add custom pixel**
3. Name it (e.g. "KAWAI Custom Tracking")
4. Paste your pixel code — example for firing custom PostHog events:

```javascript
// Available Shopify checkout events:
// checkout_started, checkout_completed, payment_info_submitted,
// checkout_address_info_submitted, cart_viewed, product_viewed

analytics.subscribe('checkout_completed', (event) => {
  const order = event.data.checkout
  // PostHog
  if (window.posthog) {
    posthog.capture('purchase', {
      order_id: order.order.id,
      value: order.totalPrice.amount,
      currency: order.currencyCode,
      items: order.lineItems.map(item => ({
        product_id: item.variant.product.id,
        product_name: item.title,
        variant: item.variant.title,
        price: item.variant.price.amount,
        quantity: item.quantity,
      }))
    })
  }
})
```

5. Click **Save** and **Connect**

---

## How Our Code Hands Off to Shopify

For reference — here's what our Next.js code does before redirecting to Shopify checkout:

| Path | Analytics fired | UTMs on URL |
|------|----------------|-------------|
| "Buy Now" (`ProductHeroBlock`) | `add_to_cart` + `begin_checkout` → GA4/Meta/PostHog | ✅ Appended |
| Cart → "Proceed to Checkout" (`CartSummary`) | `begin_checkout` → GA4/Meta/PostHog | ✅ Appended |

UTMs are appended to the Shopify checkout URL so that GA4 and Meta on Shopify's side receive the original traffic source attribution.

---

## Verification Checklist

After completing setup, test the full funnel:

- [ ] Add a product to cart on the website
- [ ] Click "Proceed to Checkout" — verify GA4 DebugView shows `begin_checkout`
- [ ] Complete a test purchase on Shopify
- [ ] Verify GA4 DebugView shows `purchase` event from Shopify's integration
- [ ] Verify Meta Pixel Helper Chrome extension shows `Purchase` event on order confirmation
- [ ] In GA4 → Reports → Acquisition, confirm the purchase is attributed to the correct source (not `kawai.com`)
- [ ] Check Shopify Admin → Analytics → confirm order shows UTM attribution

---

## Environment Variables Required

```bash
NEXT_PUBLIC_GA_ID=G-xxxxxxxxxx          # Google Analytics 4 Measurement ID
NEXT_PUBLIC_META_PIXEL_ID=xxxxxxxxxx    # Meta Pixel ID (must match Shopify connection)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxx        # PostHog project API key
```
