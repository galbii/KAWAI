# Pages Collection - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         KAWAI Pages Collection                          │
│                     Content Management System (CMS)                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           1. CONTENT CREATION                           │
└─────────────────────────────────────────────────────────────────────────┘

    Admin User
       ↓
    http://localhost:3000/admin
       ↓
    Collections → Pages → Create New
       ↓
┌──────────────────────────┐
│   Page Creation Form     │
│                          │
│  • Title: [text]         │
│  • Slug: [text]          │
│  • Category: [select]    │
│  • Tags: [multi-select]  │
│                          │
│  ┌────────────────────┐  │
│  │   Hero Section     │  │
│  │  • Type: Low/Med/  │  │
│  │    High Impact     │  │
│  │  • Rich Text       │  │
│  │  • Media           │  │
│  │  • CTA Links       │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │   Layout Blocks    │  │
│  │                    │  │
│  │  + Add Block ▼     │  │
│  │    • content-text  │  │
│  │    • content-image │  │
│  │    • marketing-hero│  │
│  │    • layout-columns│  │
│  │    • ... (17 total)│  │
│  │                    │  │
│  │  [Block 1]         │  │
│  │  [Block 2]         │  │
│  │  [Block 3]         │  │
│  └────────────────────┘  │
│                          │
│  [Save] [Publish]        │
└──────────────────────────┘
       ↓
    MongoDB Atlas
    (Database)

┌─────────────────────────────────────────────────────────────────────────┐
│                          2. DATA STRUCTURE                              │
└─────────────────────────────────────────────────────────────────────────┘

MongoDB Document:
{
  "_id": "...",
  "title": "Block System Test Page",
  "slug": "test-blocks",
  "category": "general",
  "tags": ["getting-started", "digital-pianos"],
  "_status": "published",

  "hero": {
    "type": "mediumImpact",
    "richText": { /* Lexical JSON */ },
    "links": [ { "link": { "type": "custom", "url": "/pianos" } } ],
    "media": "media_id_123"  // Relationship to Media collection
  },

  "layout": [
    {
      "blockType": "content-text",
      "content": { /* Lexical JSON */ },
      "alignment": "left",
      "id": "block_1"
    },
    {
      "blockType": "content-image",
      "image": "media_id_456",  // Relationship
      "caption": "CA901 Digital Piano",
      "size": "medium",
      "id": "block_2"
    },
    {
      "blockType": "marketing-hero",
      "content": { "title": "...", "subtitle": "..." },
      "media": { "backgroundImage": "media_id_789" },
      "layout": { "height": "medium" },
      "id": "block_3"
    }
    // ... more blocks
  ],

  "publishedAt": "2026-01-28T12:00:00Z",
  "createdAt": "2026-01-27T10:00:00Z",
  "updatedAt": "2026-01-28T12:00:00Z"
}

┌─────────────────────────────────────────────────────────────────────────┐
│                         3. FRONTEND REQUEST                             │
└─────────────────────────────────────────────────────────────────────────┘

User Browser
   ↓
http://localhost:3000/pages/test-blocks
   ↓
Next.js App Router
   ↓
src/app/(frontend)/pages/[slug]/page.tsx
   ↓
┌────────────────────────────────────┐
│   async function getPageBySlug()   │
│                                    │
│   const payload = await getPayload()│
│   const pages = await payload.find({│
│     collection: 'pages',           │
│     where: { slug: 'test-blocks' },│
│     depth: 2  // Populate relations│
│   })                               │
│                                    │
│   return pages.docs[0]             │
└────────────────────────────────────┘
   ↓
Page Data (with populated relationships)
   ↓
┌────────────────────────────────────┐
│   PageDetail Component (RSC)       │
│                                    │
│   return (                         │
│     <div>                          │
│       <RenderHero {...page.hero} />│
│       <RenderBlocks blocks={page.  │
│         layout} />                 │
│     </div>                         │
│   )                                │
└────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                       4. BLOCK RENDERING FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

RenderBlocks Component
   ↓
console.log('🎨 [RenderBlocks] Starting render...')
console.log('🎨 [RenderBlocks] Blocks received:', blocks.length)
   ↓
blocks.map((block, index) => {
   ↓
   Extract blockType
   ↓
   ┌─────────────────────────────────────┐
   │   blockComponents Mapping           │
   │                                     │
   │   const blockComponents = {         │
   │     'content-text': TextBlock,      │
   │     'content-image': ImageBlock,    │
   │     'content-video': VideoBlock,    │
   │     'content-code': CodeBlock,      │
   │     'content-banner': BannerBlock,  │
   │     'layout-columns': ColumnsBlock, │
   │     'layout-spacer': SpacerBlock,   │
   │     'layout-divider': DividerBlock, │
   │     'marketing-hero': HeroBlock,    │
   │     'marketing-cta': CallToActionBlock,│
   │     'marketing-testimonials': TestimonialsBlock,│
   │     'product-showcase': ProductShowcaseBlock,│
   │     'product-hero': ProductHeroBlock,│
   │     'product-gallery': ImageGalleryBlock,│
   │     'product-features': FeaturesListBlock,│
   │     'product-specs': SpecificationsBlock│
   │   }                                 │
   └─────────────────────────────────────┘
   ↓
   Get Component: const Block = blockComponents[blockType]
   ↓
   console.log(`✅ Rendering ${blockType} with ${Block.name}`)
   ↓
   return <Block {...block} />
})

┌─────────────────────────────────────────────────────────────────────────┐
│                      5. INDIVIDUAL BLOCK RENDER                         │
└─────────────────────────────────────────────────────────────────────────┘

Example: content-text block
   ↓
┌──────────────────────────────────────┐
│   TextBlock Component                │
│                                      │
│   export function TextBlock({        │
│     content,  // Lexical JSON        │
│     alignment = 'left'               │
│   }) {                               │
│     return (                         │
│       <div className={cn(            │
│         'prose',                     │
│         alignmentClasses[alignment]  │
│       )}>                            │
│         <LexicalSerializer           │
│           content={content} />       │
│       </div>                         │
│     )                                │
│   }                                  │
└──────────────────────────────────────┘
   ↓
LexicalSerializer
   ↓
Converts Lexical JSON → HTML
   ↓
<div class="prose text-left">
  <p>KAWAI has been a leading manufacturer...</p>
</div>

┌─────────────────────────────────────────────────────────────────────────┐
│                       6. HTML OUTPUT (FINAL)                            │
└─────────────────────────────────────────────────────────────────────────┘

<html>
  <head>
    <title>Block System Test Page</title>
    <meta name="description" content="..." />
  </head>
  <body>
    <!-- Hero Section -->
    <section class="hero-medium-impact">
      <div class="hero-background">
        <img src="https://r2.kawai.com/media/hero.jpg" />
      </div>
      <div class="hero-content">
        <h1>Block System Test Page</h1>
        <p>This page demonstrates all available blocks</p>
        <a href="#blocks">View All Blocks</a>
      </div>
    </section>

    <!-- Page Content -->
    <div class="max-w-7xl mx-auto px-6 py-16">

      <!-- Block 1: Text -->
      <div class="block-container">
        <div class="prose text-left">
          <h2>Content Blocks Section</h2>
          <p>KAWAI has been a leading manufacturer...</p>
        </div>
      </div>

      <!-- Block 2: Image -->
      <div class="block-container">
        <figure>
          <img src="https://r2.kawai.com/media/ca901.jpg"
               alt="CA901 Digital Piano" />
          <figcaption>The CA901 features wooden keys</figcaption>
        </figure>
      </div>

      <!-- Block 3: Columns -->
      <div class="block-container">
        <div class="grid grid-cols-2 gap-6">
          <div class="column">
            <!-- Nested blocks render here -->
          </div>
          <div class="column">
            <!-- Nested blocks render here -->
          </div>
        </div>
      </div>

      <!-- ... more blocks -->

    </div>
  </body>
</html>

┌─────────────────────────────────────────────────────────────────────────┐
│                     7. REVALIDATION FLOW (ISR)                          │
└─────────────────────────────────────────────────────────────────────────┘

Content Update in Admin
   ↓
Save Button Clicked
   ↓
afterChange Hook Triggered
   ↓
┌────────────────────────────────────┐
│   revalidatePage Hook              │
│                                    │
│   if (context.skipRevalidation)    │
│     return doc                     │
│                                    │
│   const url = `${baseURL}/api/     │
│     revalidate`                    │
│                                    │
│   fetch(url, {                     │
│     method: 'POST',                │
│     body: JSON.stringify({         │
│       secret: REVALIDATION_SECRET, │
│       slug: doc.slug,              │
│       type: 'pages'                │
│     })                             │
│   })                               │
│   .catch(err => console.error(err))│
└────────────────────────────────────┘
   ↓
Next.js Revalidation API
   ↓
/api/revalidate Route Handler
   ↓
revalidatePath(`/pages/${slug}`)
   ↓
Next.js ISR Cache Invalidated
   ↓
Next Request → Fresh Data Fetched from DB
   ↓
Page Re-rendered with Updated Content

┌─────────────────────────────────────────────────────────────────────────┐
│                       8. COMPONENT HIERARCHY                            │
└─────────────────────────────────────────────────────────────────────────┘

PageDetail (Server Component)
  │
  ├─ RenderHero (Server Component)
  │   ├─ MediaRenderer (Client Component)
  │   ├─ LexicalSerializer (Server Component)
  │   └─ Button + Link (Client Component)
  │
  └─ RenderBlocks (Server Component)
      │
      ├─ TextBlock (Client Component)
      │   └─ LexicalSerializer
      │
      ├─ ImageBlock (Client Component)
      │   └─ MediaRenderer
      │
      ├─ VideoBlock (Client Component)
      │   └─ ResponsiveIframe
      │
      ├─ CodeBlock (Client Component)
      │   └─ SyntaxHighlighter
      │
      ├─ BannerBlock (Client Component)
      │   └─ AlertIcon
      │
      ├─ ColumnsBlock (Client Component)
      │   └─ RenderBlocks (Recursive!)
      │       ├─ TextBlock
      │       ├─ ImageBlock
      │       └─ ... (nested blocks)
      │
      ├─ SpacerBlock (Client Component)
      │
      ├─ DividerBlock (Client Component)
      │
      ├─ HeroBlock (Client Component)
      │   ├─ MediaRenderer
      │   └─ Button
      │
      ├─ CallToActionBlock (Client Component)
      │   └─ Button
      │
      └─ TestimonialsBlock (Client Component)
          └─ TestimonialCard[]
              └─ MediaRenderer

┌─────────────────────────────────────────────────────────────────────────┐
│                        9. DATA RELATIONSHIPS                            │
└─────────────────────────────────────────────────────────────────────────┘

Pages Collection
  ├─ hero.media → Media Collection (Image/Video)
  ├─ layout[].image → Media Collection
  ├─ layout[].backgroundImage → Media Collection
  ├─ layout[].pianoModel → Products Collection
  └─ layout[].columns[].content[] → Nested Blocks (Recursive)

Products Collection
  ├─ mainImage → Media Collection
  └─ gallery[] → Media Collection

Media Collection (Cloudflare R2)
  ├─ url: "https://pub-xxx.r2.dev/media/filename.jpg"
  ├─ width: 1920
  ├─ height: 1080
  ├─ mimeType: "image/jpeg"
  └─ optimized versions (WebP, AVIF)

┌─────────────────────────────────────────────────────────────────────────┐
│                      10. PERFORMANCE FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

First Request (Build Time)
   ↓
generateStaticParams()
   ↓
Pre-render all published pages
   ↓
Static HTML files generated
   ↓
Stored in .next/server/app/pages/[slug]
   ↓
CDN (Vercel Edge Network)
   ↓
User Request → Instant HTML delivery
   ↓
< 200ms TTFB (Time to First Byte)

Subsequent Requests (After 5 min)
   ↓
User Request → CDN Cache Miss
   ↓
Next.js ISR: Check if revalidation needed
   ↓
Fresh fetch from MongoDB
   ↓
Re-render HTML
   ↓
Update CDN cache
   ↓
Serve to user
   ↓
~ 300-500ms TTFB

On-Demand Revalidation (Content Update)
   ↓
Admin saves page
   ↓
Webhook → /api/revalidate
   ↓
Invalidate specific path
   ↓
Next request → Fresh data
   ↓
No wait time for users

┌─────────────────────────────────────────────────────────────────────────┐
│                       11. ERROR HANDLING                                │
└─────────────────────────────────────────────────────────────────────────┘

Block Not Found
   ↓
RenderBlocks checks blockComponents mapping
   ↓
if (!isValidBlockType(blockType))
   ↓
console.warn('Unmapped block type:', blockType)
   ↓
return null (skip block)
   ↓
Page renders with remaining blocks

Page Not Found
   ↓
getPageBySlug returns null
   ↓
notFound() function called
   ↓
Next.js 404 page shown

Media Not Loaded
   ↓
MediaRenderer receives null/undefined
   ↓
Fallback placeholder shown
   ↓
Page continues rendering

Database Connection Error
   ↓
try/catch in getPageBySlug
   ↓
console.error('Error fetching page:', error)
   ↓
return null → 404 page

┌─────────────────────────────────────────────────────────────────────────┐
│                      12. SECURITY FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

Admin Access
   ↓
User Login Required
   ↓
Payload JWT Authentication
   ↓
access: { create: authenticated }
   ↓
Only logged-in users can create pages

Frontend Access
   ↓
Public (No Auth Required)
   ↓
access: { read: authenticatedOrPublished }
   ↓
_status: 'published' → Public
_status: 'draft' → Admin Only

Draft Mode (Preview)
   ↓
/api/draft?slug=test-blocks&secret=xxx
   ↓
Verify secret
   ↓
draftMode().enable()
   ↓
Fetch with draft: true
   ↓
Show unpublished content to admin

Input Sanitization
   ↓
Lexical Editor (Rich Text)
   ↓
HTML sanitization
   ↓
No <script> tags allowed
   ↓
XSS protection built-in

Media Upload
   ↓
File type validation
   ↓
Size limits enforced
   ↓
SVG sanitization
   ↓
Upload to Cloudflare R2 (isolated)

┌─────────────────────────────────────────────────────────────────────────┐
│                        13. DEPLOYMENT FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

Local Development
   ↓
bun run dev
   ↓
http://localhost:3000/pages/[slug]
   ↓
Hot reload on save

Staging/Production Build
   ↓
bun run build
   ↓
TypeScript compilation
   ↓
Type generation (payload-types.ts)
   ↓
Static page pre-rendering (generateStaticParams)
   ↓
Bundle optimization
   ↓
.next/ output directory

Deployment (Vercel)
   ↓
git push
   ↓
Vercel CI/CD triggered
   ↓
Build command: bun run build
   ↓
Deploy to Edge Network
   ↓
CDN invalidation
   ↓
Live at https://kawaipianos.com/pages/[slug]

Environment Variables (Required)
   ↓
DATABASE_URI → MongoDB connection
PAYLOAD_SECRET → CMS encryption
REVALIDATION_SECRET → ISR security
S3_* → Cloudflare R2 media
NEXT_PUBLIC_SITE_URL → Base URL

┌─────────────────────────────────────────────────────────────────────────┐
│                     14. MONITORING & ANALYTICS                          │
└─────────────────────────────────────────────────────────────────────────┘

Page View
   ↓
PostHog tracking (if enabled)
   ↓
Event: 'page_view'
Properties: { slug, category, tags }
   ↓
Analytics dashboard

Block Interaction
   ↓
CTA Click → Event: 'cta_click'
Video Play → Event: 'video_play'
Image View → Event: 'image_view'
   ↓
Conversion tracking

Performance Monitoring
   ↓
Core Web Vitals
   ├─ LCP (Largest Contentful Paint)
   ├─ FID (First Input Delay)
   └─ CLS (Cumulative Layout Shift)
   ↓
Vercel Analytics Dashboard

Error Tracking
   ↓
Server Errors → Payload logs
Client Errors → Browser console
Database Errors → MongoDB logs
   ↓
Alert system (if configured)
```

---

## Key Takeaways

### Data Flow
1. **Admin** creates page with blocks
2. **MongoDB** stores page document
3. **Frontend** fetches page by slug
4. **RenderBlocks** maps blocks to components
5. **Block Components** render individual blocks
6. **HTML** delivered to user

### Performance Strategy
- **Static Generation** at build time
- **ISR** for fresh content (5 min revalidation)
- **On-Demand Revalidation** on content updates
- **CDN Caching** for instant delivery

### Extensibility
- **Add new blocks**: Define in `src/blocks/`, register globally
- **Customize rendering**: Edit block components in `src/components/blocks/`
- **Enhance data**: Add fields to collection definition

### Best Practices
- Keep blocks focused (single responsibility)
- Use relationships for media (depth: 2)
- Implement error boundaries
- Monitor performance metrics
- Test on all devices

---

**For implementation details, see**: `docs/PAGES_TESTING_GUIDE.md`
