# Side Navigation Block - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Add the Block (CMS Admin)

1. Open Payload Admin at `/admin`
2. Navigate to **Pages** → Create/Edit a page
3. In **Content** tab, click **Add Block**
4. Select **🧭 Side Navigation**

### Step 2: Configure Basic Settings

```yaml
✅ Enabled: Check this box
📝 Title: "Navigation" or leave empty
📍 Position: "Right Side" (or Left)
🎨 Theme: "Light (Frosted Pearl)"
```

### Step 3: Add Navigation Sections

Click **Add Section** for each page section:

#### Example Configuration:
```
Section 1:
  Label: "Overview"
  Target ID: "overview"
  Icon: "● Circle"

Section 2:
  Label: "Features"
  Target ID: "features"
  Icon: "✨ Sparkles"

Section 3:
  Label: "Specifications"
  Target ID: "specs"
  Icon: "🎯 Target"

Section 4:
  Label: "Pricing"
  Target ID: "pricing"
  Icon: "⭐ Star"
```

### Step 4: Configure Mobile Style

```yaml
Mobile Style: "Floating Bottom Bar (Andon Style)"
```

**Or for pages with many sections:**
```yaml
Mobile Style: "Hamburger Menu (Top Right)"
```

### Step 5: Save & Add Section IDs to Your Content

Your page content blocks need matching HTML IDs. Example:

```html
<div id="overview">
  <h2>Overview</h2>
  <p>Product overview content...</p>
</div>

<div id="features">
  <h2>Features</h2>
  <p>Feature content...</p>
</div>

<div id="specs">
  <h2>Specifications</h2>
  <table>...</table>
</div>

<div id="pricing">
  <h2>Pricing</h2>
  <p>Pricing information...</p>
</div>
```

## ✨ Visual Preview

### Desktop View (Right Position)
```
┌─────────────────────────────────────────┐
│                                    ┌────┤
│  Page Content                      │NAV │
│  ════════════                      │    │
│                                    │● O │ ← Active
│  Section: Overview                 │  F │
│  ──────────────────                │  S │
│  Lorem ipsum dolor sit amet...     │    │
│                                    │────│
│                                    └────┤
│  Section: Features                      │
│  ──────────────────                     │
│  Consectetur adipiscing elit...         │
└─────────────────────────────────────────┘
```

### Mobile View (Bottom Bar)
```
┌──────────────────────┐
│  Page Content        │
│  ═══════════         │
│                      │
│  Section: Overview   │
│  ───────────────     │
│  Lorem ipsum...      │
│                      │
│  Section: Features   │
│  ───────────────     │
└──────────────────────┘
┌──────────────────────┐
│ ● Overview ✨ Featur │ ← Floating at bottom
└──────────────────────┘
```

## 🎨 Theme Examples

### Light Theme (Default)
- **Best for**: Professional pages, documentation
- **Colors**: Pearl background, charcoal text
- **Effect**: Subtle frosted glass

### Dark Theme
- **Best for**: Premium products, immersive pages
- **Colors**: Charcoal background, pearl text
- **Effect**: Elegant dark glass

### Red Accent
- **Best for**: Kawai brand pages, CTAs
- **Colors**: Red tint with charcoal text
- **Effect**: Attention-grabbing with brand identity

### Gold Accent
- **Best for**: Luxury products, special collections
- **Colors**: Gold tint with charcoal text
- **Effect**: Premium, exclusive feel

## 📱 Mobile Style Guide

### When to Use Bottom Bar
✅ **3-5 sections** - Easy to see all at once
✅ **Quick navigation needed** - Always visible
✅ **Content-heavy pages** - Users scroll frequently

### When to Use Hamburger Menu
✅ **6+ sections** - Too many for bottom bar
✅ **Cleaner UI preferred** - Hides until needed
✅ **Desktop-primary** - Mobile is supplementary

### When to Hide on Mobile
✅ **1-2 sections only** - Navigation not needed
✅ **Linear content** - Users read top to bottom
✅ **Simple pages** - Minimal structure

## ⚡ Pro Tips

### Tip 1: Match Your Header Height
Set **Scroll Offset** to your fixed header height:
- Small header: 60-70px
- Medium header: 80-100px (default: 80)
- Large header: 120-150px

### Tip 2: Keep Labels Short
❌ "Detailed Product Specifications and Technical Data"
✅ "Specifications"

### Tip 3: Use Semantic IDs
❌ `id="section1"`, `id="div-2"`
✅ `id="overview"`, `id="features"`

### Tip 4: Test Scroll-Spy
After setup, scroll through your page and verify:
- Active indicator moves to correct section
- Smooth scroll works when clicking nav items
- Mobile view transforms properly

### Tip 5: Place at Top of Layout
The Side Navigation block should be the **first block** in your page layout for proper rendering.

## 🐛 Common Issues & Fixes

### Issue: Navigation doesn't appear
**Fix**: Ensure `enabled` is checked and at least one section is defined

### Issue: Sections don't highlight on scroll
**Fix**: Verify HTML IDs match `targetId` exactly (case-sensitive)

### Issue: Smooth scroll jumps
**Fix**: Adjust `scrollOffset` to match your header height

### Issue: Mobile nav is hidden
**Fix**: Check `mobileStyle` isn't set to "Hidden on Mobile"

## 📚 Complete Documentation

For advanced configuration and detailed explanations:

- **Full Guide**: [`docs/SIDE_NAVIGATION_BLOCK.md`](./SIDE_NAVIGATION_BLOCK.md)
- **Implementation Summary**: [`SIDE_NAVIGATION_IMPLEMENTATION.md`](../SIDE_NAVIGATION_IMPLEMENTATION.md)
- **All Blocks Reference**: [`docs/BLOCKS.md`](./BLOCKS.md)

## 🎯 Example Use Cases

### Product Page
```yaml
sections:
  - "Overview" → #overview
  - "Key Features" → #features
  - "Specifications" → #specs
  - "Pricing" → #pricing
  - "Reviews" → #reviews
```

### About Page
```yaml
sections:
  - "Our Story" → #story
  - "Team" → #team
  - "Values" → #values
  - "Locations" → #locations
```

### Documentation Page
```yaml
sections:
  - "Introduction" → #intro
  - "Getting Started" → #getting-started
  - "Features" → #features
  - "API Reference" → #api
  - "Examples" → #examples
  - "FAQ" → #faq
```

### Piano Showcase Page
```yaml
sections:
  - "Sound" → #sound
  - "Touch" → #touch
  - "Technology" → #technology
  - "Design" → #design
  - "Find Dealer" → #dealer
```

---

**Ready to build?** Start with 3-4 sections and expand from there! 🎹
