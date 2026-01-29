# News Carousel - Content Editor Guide

## Overview

The News Carousel is the prominent full-screen rotating section on your homepage. It now supports multiple media types and content sources, giving you maximum flexibility in how you showcase news, events, and announcements.

## Quick Start

Navigate to: **Admin → Collections → Home Page → News Carousel**

## Content Sources

### Option 1: Featured Posts (Recommended)

Pull published blog posts automatically:

1. Click the **"Featured Posts"** relationship field
2. Select one or more published posts from your Posts collection
3. Posts will automatically display with their:
   - Title
   - Excerpt
   - Featured image
   - Category
   - Publish date
   - Link to `/blog/[slug]`

**Benefits:**
- ✅ Single source of truth
- ✅ Auto-updates when posts change
- ✅ Maintains consistency across site

### Option 2: Manual News Items

Create custom carousel slides directly:

1. Click **"Add News Item"**
2. Fill in the fields (see "Field Guide" below)
3. Choose your media type (see "Media Types" below)

**When to use:**
- Custom promotions
- Event announcements
- Landing page links
- Content not suitable for blog posts

### Option 3: Hybrid Approach (Best Practice)

Combine both! The carousel will display:
1. Featured Posts (ordered by publish date)
2. Manual News Items (in the order you arrange them)
3. NAMM Event Slide (always first, if not already included)

---

## Field Guide

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Title** | Main headline | "Visit Kawai at NAMM 2026" |
| **Description** | Full description shown on slide | "Experience exclusive piano innovations, live artist performances, and hands-on demonstrations at our booth in Anaheim Convention Center" |
| **Category** | Badge label | Events, News, Promotions, Artists, Technology |

### Optional Fields

| Field | Description | When to Use |
|-------|-------------|-------------|
| **Excerpt** | Short preview (200 chars max) | For mega menu previews |
| **Date** | Display date | "January 2026" or "Coming Soon" |
| **Featured** | Highlight in mega menu | Check for important announcements |
| **Link** | Destination URL | `/namm-2026` or `/products/new-piano` |

---

## Media Types

The carousel supports 4 different background media types. Choose one per item:

### 1️⃣ Single Image (Traditional)

**Best for:** Standard news items, announcements

**How to use:**
1. Expand **"Single Image"** section
2. Upload or select an image
3. Image displays with subtle Ken Burns zoom effect

**Recommended specs:**
- Resolution: 1920x1080px minimum
- Format: JPG or WebP
- File size: Under 500KB

---

### 2️⃣ Multiple Images Carousel ⭐ NEW

**Best for:** Event galleries, product showcases, multi-angle views

**How to use:**
1. Expand **"Multiple Images Carousel"** section
2. Click **"Add Image"** for each photo
3. Add 2-10 images (recommended: 3-5)
4. Images auto-cycle with smooth crossfades

**Timing:** Each image gets equal time during the slide's 7-second display
- 2 images = 3.5s each
- 3 images = 2.3s each
- 5 images = 1.4s each

**Tips:**
- ✅ Use consistent aspect ratios (all landscape or all portrait)
- ✅ Keep file sizes under 300KB each
- ✅ Order matters – arrange your best image first

---

### 3️⃣ YouTube Video Background ⭐ NEW

**Best for:** Product demos, artist performances, event highlights

**How to use:**
1. Expand **"Video Background"** section
2. Paste YouTube video URL (any format works):
   - `https://youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`
   - `https://www.youtube.com/embed/VIDEO_ID`
3. Select **"YouTube"** as video source
4. Video auto-plays muted in a loop

**Important:**
- ⚠️ YouTube's title/channel overlay will appear briefly (YouTube policy)
- ✅ Video is optimized for minimal UI and smooth playback
- ✅ No user controls visible (clean background experience)

---

### 4️⃣ Direct MP4 Video ⭐ NEW

**Best for:** Complete control, no branding, custom footage

**How to use:**
1. Expand **"Video Background"** section
2. Paste direct MP4 video URL (R2/CDN recommended)
3. Select **"Direct MP4"** as video source
4. Video auto-plays muted in a loop

**Recommended specs:**
- Codec: H.264
- Resolution: 1920x1080px
- File size: Under 10MB
- Duration: 10-30 seconds (loops seamlessly)

**Where to host:**
- Cloudflare R2 (preferred)
- CDN or media server
- ❌ Don't upload large videos directly to CMS

---

## Priority System

If you configure multiple media types for one item, this is the priority order:

```
Video (YouTube/MP4) > Multiple Images > Single Image
```

**Example:** If you add both a YouTube video AND single image, only the video displays.

**Best practice:** Only configure ONE media type per news item to avoid confusion.

---

## Categories

Choose the category that best describes your content:

| Category | Use For | Badge Color |
|----------|---------|-------------|
| **News** | Company updates, announcements | Red |
| **Events** | NAMM, concerts, showroom events | Red |
| **Promotions** | Sales, financing offers, discounts | Red |
| **New Arrivals** | Product launches, new models | Red |
| **Education** | Tutorials, guides, learning resources | Red |
| **Artists** | Artist spotlights, performances | Red |
| **Technology** | Innovation, R&D, technical features | Red |

---

## Best Practices

### Content

✅ **DO:**
- Keep titles under 60 characters (mobile readability)
- Write compelling descriptions (2-3 sentences max)
- Include clear call-to-action in description
- Test links before publishing
- Use high-quality images (sharp, well-composed)

❌ **DON'T:**
- Use all caps in titles
- Write long paragraphs (3-4 lines maximum)
- Link to broken or outdated pages
- Use low-resolution or pixelated images
- Repeat the same content across multiple slides

### Media

✅ **DO:**
- Optimize images before uploading
- Use landscape orientation (16:9 ratio ideal)
- Ensure good contrast for text readability
- Test on mobile devices
- Keep videos short and engaging

❌ **DON'T:**
- Upload RAW images (huge file sizes)
- Use portrait orientation (crops poorly)
- Choose images with text overlays (cluttered)
- Embed hour-long videos (use 30s highlights)
- Rely on small details (hard to see on mobile)

### Carousel Management

✅ **DO:**
- Maintain 3-5 active slides (sweet spot)
- Update regularly (weekly/monthly)
- Feature time-sensitive content
- Arrange slides by priority (important items first)
- Remove outdated promotions promptly

❌ **DON'T:**
- Exceed 8 slides (overwhelming for users)
- Keep stale content (months-old news)
- Bury important announcements at the end
- Use duplicate content

---

## Special: NAMM Event Slide

The NAMM event slide is special and automatically injected as the first slide. It features:

- Scrolling background of multiple NAMM images
- Custom "EVENT" category badge
- Hardcoded date: "January 22–24, 2026"
- Link to `/namm-2026`

**You don't need to create this manually** – it's always included unless you create your own item with category "namm-event".

---

## Troubleshooting

### "My video isn't playing"

- ✅ Check the URL is correct and accessible
- ✅ For YouTube: Make sure video is public, not private
- ✅ For MP4: Test the URL in a browser first
- ✅ Clear browser cache and refresh

### "Images are blurry"

- Resolution too low – use minimum 1920x1080px
- File was over-compressed – use quality 80-90%
- Image was upscaled – use native resolution

### "Text is hard to read"

- Image too busy – choose simpler backgrounds
- Not enough contrast – use the gradient overlays (automatic)
- Colors clash – prefer neutral/darker backgrounds

### "Carousel isn't auto-playing"

- Check Auto Play Duration setting (default: 7000ms)
- Browser may have paused it (click play button in bottom-right)
- Only 1 slide present (need 2+ for auto-play)

---

## Technical Details

### Auto-Play Duration

Default: **7000ms (7 seconds)** per slide

Adjust in: **Admin → Home Page → News Carousel → Auto Play Duration**

**Guidelines:**
- Minimum: 5000ms (5s) – Quick rotation
- Recommended: 7000ms (7s) – Balanced
- Maximum: 10000ms (10s) – Slow, thoughtful

**For multi-image slides:** Duration auto-divides among images

---

## Examples

### Example 1: Product Launch with Gallery

```
Title: "Introducing the New CA Series"
Description: "Experience the next evolution in digital piano technology with enhanced sound, touch, and design"
Excerpt: "Next evolution in digital piano technology"
Category: New Arrivals
Date: "January 2026"
Featured: ✓
Link: /pianos/digital/ca901
Media: Multiple Images Carousel (5 product photos)
```

### Example 2: Event Announcement with Video

```
Title: "Artist Masterclass: Jane Doe Live"
Description: "Join renowned pianist Jane Doe for an exclusive masterclass on classical technique and interpretation"
Excerpt: "Exclusive masterclass with Jane Doe"
Category: Events
Date: "March 15, 2026"
Featured: ✓
Link: /events/masterclass-jane-doe
Media: YouTube Video (performance highlight reel)
```

### Example 3: Promotion with Single Image

```
Title: "Spring Financing Event"
Description: "0% APR financing available on all grand pianos. Limited time offer ending March 31st"
Excerpt: "0% financing on grand pianos"
Category: Promotions
Date: "Ends March 31"
Featured: ✗
Link: /financing
Media: Single Image (promotional banner)
```

---

## Advanced Tips

### Creating Compelling Carousel Content

1. **Start Strong:** First 2-3 words are crucial (visible on mobile)
2. **Show, Don't Tell:** Use action-oriented language
3. **Create Urgency:** "Limited time", "This week only", "Register now"
4. **Be Specific:** "Save $500" beats "Big savings"
5. **Test Mobile:** 60% of users see this on phones

### Seasonal Content Strategy

| Season | Focus | Example Content |
|--------|-------|-----------------|
| **Winter** | Gift-giving, financing | Holiday promotions, gift guides |
| **Spring** | New products, events | NAMM recap, spring sales |
| **Summer** | Education, lessons | Music camps, teacher resources |
| **Fall** | Back to school | Student programs, financing |

---

## Need Help?

**Questions?** Contact your web admin or refer to:
- Payload CMS Documentation
- KAWAI Digital Asset Library
- Technical Support Team

**Found a bug?** Report at: https://github.com/anthropics/claude-code/issues

---

*Last updated: January 2026*
*Version: 2.0 (Multi-media update)*
