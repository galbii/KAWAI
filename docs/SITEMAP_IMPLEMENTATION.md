# KAWAI Piano Website - Sitemap Implementation Guide

> Comprehensive guide for sitemap generation, submission to search engines, and ongoing maintenance

---

## 📋 Overview

The KAWAI website uses Next.js 15's native sitemap generation with dynamic content from Payload CMS. The sitemap automatically includes:

- ✅ **Static pages** (homepage, core content)
- ✅ **Product pages** (dynamically generated from CMS)
- ✅ **Dealer location pages** (active locations only)
- ✅ **Campaign landing pages** (active campaigns only)
- ✅ **Piano category pages** (all main categories)

---

## 🔧 Implementation Files

### **1. `src/app/sitemap.ts`**
Main sitemap generator that queries Payload CMS and builds the complete sitemap.

**Key Features:**
- Queries active products, dealers, and landing pages
- Filters out discontinued products and draft content
- Sets appropriate priority and change frequency
- Includes error handling with fallback
- Logs generation stats for monitoring

### **2. `src/app/robots.ts`**
Robots.txt configuration that tells search engines:
- Where to find the sitemap
- Which routes to exclude (admin, API)
- Crawling permissions

---

## 🌐 Accessing Your Sitemap

Once deployed, your sitemap will be available at:

**Production:** `https://kawaius.com/sitemap.xml`
**Development:** `http://localhost:3000/sitemap.xml`

### Testing Locally

```bash
# Start development server
bun run dev

# Visit sitemap in browser
open http://localhost:3000/sitemap.xml

# View robots.txt
open http://localhost:3000/robots.txt
```

---

## 📤 Submitting to Google Search Console

### **Step 1: Access Google Search Console**

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. If not already added, click **"Add Property"**
   - Choose **"URL prefix"** property type
   - Enter: `https://kawaius.com`
   - Verify ownership (DNS, HTML file, or Google Analytics)

### **Step 2: Submit Your Sitemap**

1. In the left sidebar, click **"Sitemaps"**
2. Under **"Add a new sitemap"**, enter: `sitemap.xml`
3. Click **"Submit"**

**Expected Result:**
- Status: "Success" (may take a few hours to process)
- Discovered URLs: ~100+ pages (will vary based on your content)

### **Step 3: Monitor Sitemap Status**

Google Search Console will show:
- ✅ **Discovered URLs** - Total URLs found in sitemap
- ✅ **Coverage Status** - Successfully indexed pages
- ⚠️ **Errors** - Any issues preventing indexing
- 📊 **Last Read** - When Google last crawled your sitemap

**Typical Timeline:**
- **Initial Processing:** 1-3 hours
- **First Indexing:** 1-3 days
- **Full Indexing:** 1-2 weeks

---

## 🔄 Submitting to Other Search Engines

### **Bing Webmaster Tools**

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in and add your site
3. Navigate to **"Sitemaps"** → **"Submit Sitemap"**
4. Enter: `https://kawaius.com/sitemap.xml`

### **Yandex Webmaster**

1. Go to [Yandex Webmaster](https://webmaster.yandex.com)
2. Add your site and verify ownership
3. Go to **"Indexing"** → **"Sitemap files"**
4. Add: `https://kawaius.com/sitemap.xml`

---

## ⚙️ Sitemap Configuration & Customization

### **Priority Values**

Our sitemap uses the following priority scheme (0.0 - 1.0):

| Page Type | Priority | Reasoning |
|-----------|----------|-----------|
| Homepage | 1.0 | Main entry point |
| Core Pages (Piano Finder) | 0.9 | High-value conversion pages |
| Category Pages | 0.8 | Important navigation hubs |
| Featured Products | 0.9 | Premium, high-converting products |
| Standard Products | 0.7 | Regular product pages |
| Dealer Locations | 0.7 | Local SEO value |
| Landing Pages | 0.6 | Campaign-specific, time-sensitive |

### **Change Frequency**

| Page Type | Frequency | Update Pattern |
|-----------|-----------|----------------|
| Homepage | daily | Featured content changes |
| Product Pages | weekly | Inventory, pricing updates |
| Category Pages | weekly | New products added |
| Dealer Pages | monthly | Hours, info changes |
| Static Pages | monthly | Content updates |

### **Customizing the Sitemap**

To add new routes, edit `src/app/sitemap.ts`:

```typescript
// Add new static route
const staticRoutes: MetadataRoute.Sitemap = [
  // ... existing routes
  {
    url: `${SITE_URL}/your-new-page`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
]
```

---

## 🔍 Troubleshooting

### **Sitemap Not Generating**

**Issue:** 404 error when visiting `/sitemap.xml`

**Solutions:**
1. Ensure `sitemap.ts` is in `src/app` directory
2. Rebuild the application: `bun run build`
3. Check for TypeScript errors: `bun run build`
4. Verify environment variables are set (DATABASE_URI)

### **Missing Products/Pages**

**Issue:** Expected pages not appearing in sitemap

**Solutions:**
1. Check CMS collection filters:
   - Products: Must have `status: 'active'` and `discontinued: false`
   - Dealers: Must have `isActive: true`
   - Landing Pages: Must have `status: 'active'` and `seo.noIndex: false`
2. Verify collection data in Payload admin
3. Check sitemap logs in terminal/console

### **Google Search Console Errors**

**Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Couldn't fetch" | Server/DNS issue | Verify site is accessible, check SSL |
| "Invalid XML" | Malformed sitemap | Check for special characters in URLs |
| "URL not found" | Page returns 404 | Verify route exists, check slug accuracy |
| "Blocked by robots.txt" | Robots blocking | Check `robots.ts` configuration |

---

## 🚀 Performance & Optimization

### **Automatic Regeneration**

The sitemap regenerates:
- ✅ On every build/deployment
- ✅ Via Next.js ISR (Incremental Static Regeneration)
- ✅ When new content is published in CMS

### **Caching**

Next.js automatically caches the sitemap with:
- Default cache: 1 hour
- Revalidation on rebuild
- Edge caching for faster delivery

### **Large Sitemaps (Future)**

If your sitemap grows beyond 50,000 URLs, implement sitemap index:

```typescript
// Future implementation: src/app/sitemap-index.ts
export async function generateSitemaps() {
  return [
    { id: 'products' },
    { id: 'dealers' },
    { id: 'static' }
  ]
}

export default async function sitemap({ id }: { id: string }) {
  // Generate specific sitemap based on id
}
```

---

## 📊 Monitoring & Maintenance

### **Weekly Checks**

- [ ] Review Google Search Console coverage
- [ ] Check for crawl errors
- [ ] Monitor indexed page count
- [ ] Review "Page Indexing" report

### **Monthly Audit**

- [ ] Verify all new products appear in sitemap
- [ ] Check for 404 errors in indexed pages
- [ ] Update priority for seasonal campaigns
- [ ] Review sitemap generation logs

### **Quarterly Review**

- [ ] Analyze search performance by page type
- [ ] Optimize priority/frequency based on traffic
- [ ] Update robots.txt if needed
- [ ] Review and clean up expired landing pages

---

## 🔗 Useful Commands

```bash
# Test sitemap locally
curl http://localhost:3000/sitemap.xml

# Test robots.txt locally
curl http://localhost:3000/robots.txt

# Rebuild with fresh sitemap
bun run build

# Deploy with updated sitemap
git add . && git commit -m "Update sitemap" && git push
```

---

## 📞 Support & Resources

### **Google Resources**
- [Google Search Console](https://search.google.com/search-console)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

### **Next.js Documentation**
- [Next.js Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

### **Internal Documentation**
- See `CLAUDE.md` for overall architecture
- See Payload CMS collections in `src/collections/`

---

## ✅ Success Checklist

- [x] Sitemap file created at `src/app/sitemap.ts`
- [x] Robots.txt configured at `src/app/robots.ts`
- [ ] Site deployed to production
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Submitted to Google Search Console
- [ ] Submitted to Bing Webmaster Tools (optional)
- [ ] Verified sitemap processing (1-3 days)
- [ ] Monitoring set up in Search Console
- [ ] Team trained on sitemap maintenance

---

**Last Updated:** 2025-01-09
**Maintained By:** Development Team
**Questions?** Review this guide or consult Next.js/Payload documentation
