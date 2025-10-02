# Cross-Domain Tracking Setup Guide
## Meta Ads → kawaipianogallery.com → kawaius.com

This guide explains how to properly track conversions across domains when running Meta (Facebook) ads campaigns.

---

## 🎯 **Tracking Flow Overview**

```
User clicks Meta Ad
    ↓
Lands on kawaipianogallery.com/es60 (with fbclid parameter)
    ↓
Meta Pixel tracks PageView + parameters
    ↓
User clicks "Get Your ES60 Today" butzton
    ↓
Meta Pixel fires InitiateCheckout event
    ↓
Redirects to kawaius.com/product/kawai-es60/ (with preserved tracking)
    ↓
Meta Pixel on kawaius.com tracks conversion
```

---

## 📋 **Prerequisites**

### 1. **Same Meta Pixel ID on Both Domains**
Both `kawaipianogallery.com` and `kawaius.com` MUST use the **same Meta Pixel ID**.

**On kawaipianogallery.com:**
- Already configured in `.env.local` as `NEXT_PUBLIC_META_PIXEL_ID`
- Implemented via `/src/components/MetaPixel.tsx`

**On kawaius.com:**
- Install the Meta Pixel with the **same Pixel ID**
- Ensure it's placed in the `<head>` section of all pages
- Verify installation using Meta Pixel Helper browser extension

### 2. **Verify Both Pixels Are Active**
1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome extension
2. Visit `kawaipianogallery.com/es60` - should show your Pixel ID firing
3. Visit `kawaius.com/product/kawai-es60/` - should show the **same** Pixel ID firing

---

## ⚙️ **Implementation Details**

### **What We Built**

#### 1. **Cross-Domain Tracking Utility** (`/src/lib/tracking/cross-domain.ts`)
Automatically preserves:
- ✅ `fbclid` - Facebook Click ID (CRITICAL for attribution)
- ✅ `fbp` - Facebook Browser ID cookie
- ✅ `fbc` - Facebook Click ID cookie
- ✅ UTM parameters (utm_source, utm_medium, utm_campaign, etc.)
- ✅ Google Ads parameters (gclid, if applicable)

#### 2. **Button Click Event Tracking**
When user clicks "Get Your ES60 Today":
- Fires `InitiateCheckout` event to Meta Pixel
- Includes product details (name, category, value, currency)
- Waits 100ms to ensure event fires before redirect
- Redirects with all tracking parameters preserved

Example event data sent to Meta:
```javascript
{
  content_name: 'ES60 Digital Piano',
  content_category: 'Digital Pianos',
  content_ids: ['es60'],
  currency: 'USD',
  value: 499,
  source_page: 'es60_landing_page',
  destination_url: 'https://kawaius.com/product/kawai-es60/',
  source_url: 'https://kawaipianogallery.com/es60'
}
```

---

## 🚀 **Meta Ads Campaign Setup**

### **Step 1: Create Your Campaign**
1. Go to Meta Ads Manager
2. Create new campaign → Choose objective: **Sales** or **Traffic**
3. Name: `ES60 Digital Piano - Landing Page Campaign`

### **Step 2: Ad Set Configuration**

**Audience:**
- Age: 18-65
- Interests: Piano, Music Education, Beginner Musicians, Adult Learning
- Geographic: United States (or your target market)

**Placements:**
- Recommended: Advantage+ placements
- Or manually select: Facebook Feed, Instagram Feed, Stories

**Budget:**
- Start with $20-50/day for testing
- Increase based on performance

### **Step 3: Ad Creative**
**Destination URL:**
```
https://kawaipianogallery.com/es60
```

**Important:** Meta will automatically append `fbclid` parameter:
```
https://kawaipianogallery.com/es60?fbclid=IwAR0Xh8j...
```

**Ad Copy Examples:**
- "Concert Grand Sound for Just $499 - Perfect for Beginners"
- "Professional Piano Quality at a Student-Friendly Price"
- "88 Weighted Keys • Studio Quality • Ultra Portable"

### **Step 4: Conversion Tracking Setup**

1. **In Meta Events Manager:**
   - Go to Events Manager → Your Pixel
   - Navigate to **Settings** → **Domains**
   - Add both domains:
     - `kawaipianogallery.com`
     - `kawaius.com`

2. **Configure Aggregated Event Measurement:**
   - Prioritize these events:
     1. Purchase (highest priority)
     2. InitiateCheckout
     3. Lead
     4. PageView

3. **Set Up Custom Conversions:**
   - Event Name: `ES60 Purchase from Landing Page`
   - Rule: URL contains `kawaius.com/product/kawai-es60/`
   - AND Event: `Purchase` or `AddToCart`
   - Value: Use event value ($499)

---

## 🔍 **Testing the Setup**

### **Test 1: Parameter Preservation**
1. Add `?fbclid=test123` to your ES60 landing page URL:
   ```
   http://localhost:3000/es60?fbclid=test123
   ```

2. Click "Get Your ES60 Today" button

3. Verify the redirect URL includes `fbclid=test123`:
   ```
   https://kawaius.com/product/kawai-es60/?fbclid=test123&fbp=...&utm_source=...
   ```

### **Test 2: Event Tracking**
1. Open browser DevTools → Console
2. Visit `/es60` page
3. Click "Get Your ES60 Today"
4. Look for console message:
   ```
   🎯 Meta Pixel event tracked: InitiateCheckout
   ```

### **Test 3: Meta Pixel Helper**
1. Install Meta Pixel Helper extension
2. Visit `/es60` page
3. Extension should show:
   - ✅ PageView event
   - ✅ Your Pixel ID
4. Click button, should show:
   - ✅ InitiateCheckout event
   - ✅ Event parameters

### **Test 4: Meta Events Manager**
1. Go to Meta Events Manager
2. Select your Pixel
3. View **Test Events** tab
4. Perform actions on your site
5. Events should appear in real-time

---

## 📊 **Monitoring & Optimization**

### **Key Metrics to Track:**
1. **Click-Through Rate (CTR)** on ads → Landing page
2. **Button Click Rate** on landing page
3. **InitiateCheckout events** fired
4. **Purchase events** on kawaius.com
5. **Cost Per Purchase**
6. **Return on Ad Spend (ROAS)**

### **In Meta Ads Manager:**
- Columns → Customize Columns
- Add these metrics:
  - PageView
  - InitiateCheckout
  - Purchases
  - Cost Per Result
  - ROAS

### **Advanced: Conversion API (Optional but Recommended)**
For even better tracking reliability, implement Conversions API:
- Sends events server-side (bypasses ad blockers)
- Works alongside Meta Pixel for redundancy
- Improves iOS 14.5+ tracking

**Implementation location:** `/src/app/api/meta-conversion/route.ts`

---

## 🛠️ **Troubleshooting**

### **Issue: Events Not Showing in Meta**
**Solutions:**
1. Clear browser cache and cookies
2. Disable ad blockers
3. Verify Pixel ID is the same on both sites
4. Check browser console for errors
5. Use Meta Pixel Helper to debug

### **Issue: Attribution Lost Between Domains**
**Solutions:**
1. Verify `fbclid` is in the redirect URL
2. Check that cross-domain tracking script is loaded
3. Ensure no URL redirects strip parameters
4. Disable any URL cleaning plugins/extensions

### **Issue: Purchase Events Not Attributed to Ads**
**Solutions:**
1. Verify kawaius.com has the **same** Pixel ID
2. Check Attribution Window settings in Ads Manager
3. Ensure user clicks through within 7 days
4. Consider implementing Conversions API for server-side tracking

---

## 📞 **Support Resources**

- **Meta Business Help Center:** https://business.facebook.com/help
- **Meta Pixel Setup Guide:** https://developers.facebook.com/docs/meta-pixel
- **Meta Pixel Helper:** https://chrome.google.com/webstore/detail/meta-pixel-helper/
- **Test Your Pixel:** https://www.facebook.com/business/help/742478679120153

---

## 🎓 **Best Practices**

1. ✅ **Always test in incognito/private browsing** before launching ads
2. ✅ **Use UTM parameters** in your ad URLs for additional tracking:
   ```
   https://kawaipianogallery.com/es60?utm_source=facebook&utm_medium=paid&utm_campaign=es60_launch
   ```
3. ✅ **Set up A/B tests** with different ad creatives
4. ✅ **Monitor daily** for the first week of the campaign
5. ✅ **Document your learnings** - what works and what doesn't
6. ✅ **Consider retargeting** users who clicked but didn't purchase

---

## ✅ **Pre-Launch Checklist**

- [ ] Meta Pixel installed on kawaipianogallery.com
- [ ] Meta Pixel installed on kawaius.com with **same ID**
- [ ] Both domains verified in Meta Events Manager
- [ ] Cross-domain tracking tested (fbclid preserved)
- [ ] Button click tracking verified (InitiateCheckout event fires)
- [ ] Meta Pixel Helper shows events correctly
- [ ] Custom Conversions configured in Events Manager
- [ ] Ad campaign created with correct destination URL
- [ ] UTM parameters added to ad URLs
- [ ] Test purchase completed end-to-end

---

**Last Updated:** January 2025
**Implementation Status:** ✅ Ready for Production
