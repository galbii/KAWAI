# Piano Finder Components - Integration Checklist

Use this checklist to integrate the new Piano Type Comparison and Use Case Cards components into your Piano Finder page.

---

## ✅ Pre-Integration Checklist

### 1. Review Components Locally
- [ ] Run `bun run dev` to start development server
- [ ] Navigate to component files in `/src/components/find-my-piano/`
- [ ] Review PianoTypeComparison.tsx
- [ ] Review UseCaseCards.tsx
- [ ] Check README.md for full documentation

### 2. Verify Dependencies
- [ ] Confirm Framer Motion is installed (`bun list | grep framer-motion`)
- [ ] Confirm React 18+ is installed
- [ ] Confirm Next.js 15 is installed
- [ ] All TypeScript types are valid (no lint errors)

### 3. Review Design System
- [ ] Verify kawai-pearl, kawai-red, kawai-black colors exist in globals.css
- [ ] Confirm font-serif and font-sans are configured
- [ ] Check that Tailwind config includes necessary utilities

---

## 📝 Page Integration Steps

### Step 1: Import Components
In your `/find-my-piano/page.tsx` file:

```tsx
import { PianoTypeComparison, UseCaseCards } from '@/components/find-my-piano';
```

- [ ] Add import statement to page file
- [ ] Confirm no TypeScript errors

### Step 2: Position Components in Page Structure

According to the SEO strategy, place components in this order:

```tsx
export default function PianoFinderPage() {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      {/* Your existing hero with CTA to quiz */}

      {/* 2. Interactive Quiz Section */}
      {/* Your existing 7-question quiz tool */}

      {/* 3. How to Choose Guide Section (~800 words) */}
      {/* To be created or existing content */}

      {/* 4. Key Decision Factors Section (~1200 words) */}
      {/* To be created or existing content */}

      {/* 5. Piano Type Comparison Section - NEW! */}
      <PianoTypeComparison />

      {/* 6. Use Case Cards Section - NEW! */}
      <UseCaseCards />

      {/* 7. FAQ Section */}
      {/* Your existing or new FAQ accordion */}

      {/* 8. Next Steps & Conversion Section */}
      {/* Dealer locator, Calendly, browsing CTAs */}
    </main>
  );
}
```

- [ ] Position PianoTypeComparison after Key Decision Factors section
- [ ] Position UseCaseCards after PianoTypeComparison
- [ ] Verify no layout issues (margins, padding conflicts)

### Step 3: Add Metadata
Add or update your page metadata for SEO:

```tsx
export const metadata = {
  title: 'Piano Finder - Find Your Perfect Kawai Piano | Interactive Tool',
  description: 'Use our expert piano finder to discover the perfect Kawai piano for your needs, budget, and goals. Get personalized recommendations in 7 questions. Compare grand, upright, digital, and hybrid pianos.',
  keywords: 'piano finder, find the right piano, piano selection tool, which piano should I buy, best piano for beginners, digital vs acoustic piano, piano buying guide, piano type comparison',
  openGraph: {
    title: 'Find Your Perfect Piano in 7 Questions | Kawai Piano Finder',
    description: 'Interactive piano selection tool with expert guidance. Compare grand, upright, digital, and hybrid pianos. Get personalized Kawai piano recommendations.',
    type: 'website',
    url: 'https://kawai.com/find-my-piano',
  }
};
```

- [ ] Add/update page title
- [ ] Add/update meta description
- [ ] Add/update keywords
- [ ] Add OpenGraph tags for social sharing

---

## 🔗 Content Verification

### Ensure These Pages/Routes Exist:

**Category Pages:**
- [ ] `/pianos/grand` - Grand piano collection page
- [ ] `/pianos/upright` - Upright piano collection page
- [ ] `/pianos/digital` - Digital piano collection page
- [ ] `/pianos/hybrid` - Hybrid piano collection page

**Guide Pages:**
- [ ] `/guides/first-piano` - Beginner piano guide
- [ ] `/guides/professional-piano-selection` - Professional guide
  - ⚠️ **Note:** If this doesn't exist, link to `/pianos/digital` or create new guide

**Product Pages (verify these exist or update component links):**
- [ ] `/product/es120`
- [ ] `/product/es520`
- [ ] `/product/es920`
- [ ] `/product/ca701`
- [ ] `/product/ca901`
- [ ] `/product/cn201`
- [ ] `/product/cn301`
- [ ] `/product/kdp120`
- [ ] `/product/nv10s`
- [ ] `/product/nv5s`
- [ ] `/product/mp11se`
- [ ] `/product/gx3`
- [ ] `/product/sk5`
- [ ] `/product/k300`
- [ ] `/product/k500`
- [ ] `/product/k800`

**Quiz Anchor:**
- [ ] Ensure quiz section has `id="quiz"` attribute
  - Example: `<section id="quiz" className="...">`
  - This allows `/find-my-piano#quiz` anchor links to work

---

## 🎨 Styling Verification

### Test Responsive Breakpoints:
- [ ] Mobile (320px - 639px): Cards stack vertically
- [ ] Tablet (640px - 767px): Cards stack, larger text
- [ ] Tablet (768px - 1023px): Use cases show 2x2 grid
- [ ] Desktop (1024px+): Comparison shows table, use cases 2x2
- [ ] Large Desktop (1440px+): Full table with all columns visible

### Verify Design System:
- [ ] kawai-pearl background renders correctly
- [ ] kawai-red accents are visible and on-brand
- [ ] Font-serif (Crimson Text) loads for headings
- [ ] Font-sans (Inter) loads for body text
- [ ] Shadows and borders render as expected

### Test Animations:
- [ ] Scroll to components triggers fade-in animation
- [ ] Cards/rows stagger in with delays
- [ ] Hover effects work on desktop (shadow, color changes)
- [ ] Icons scale on card hover
- [ ] CTA arrows translate on hover

---

## 📊 Schema Markup (Optional but Recommended)

Add structured data for better SEO:

### HowTo Schema (for Piano Type Comparison)
```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Choose the Right Piano Type",
    "description": "Compare grand, upright, digital, and hybrid pianos to find the perfect match for your needs",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Consider Your Space",
        "text": "Measure your room and determine if you can accommodate a grand, upright, or compact digital piano"
      },
      {
        "@type": "HowToStep",
        "name": "Determine Your Budget",
        "text": "Piano prices range from $500 for entry-level digitals to $180,000+ for concert grands"
      },
      // Add more steps...
    ]
  })}
</script>
```

- [ ] Add HowTo schema to page (optional)
- [ ] Test with Google's Rich Results Test tool

### ItemList Schema (for Use Cases)
```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Piano Use Cases and Recommendations",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Best Pianos for Students & Beginners",
        "description": "Starting your piano journey requires an instrument that builds proper technique...",
        "url": "https://kawai.com/guides/first-piano"
      },
      // Add other use cases...
    ]
  })}
</script>
```

- [ ] Add ItemList schema to page (optional)
- [ ] Test with Google's Rich Results Test tool

---

## 🔍 Analytics Setup

### Add Event Tracking (Google Analytics 4)

**Track Section Views:**
```tsx
useEffect(() => {
  if (isVisible) {
    gtag('event', 'view_item', {
      event_category: 'Piano Finder',
      event_label: 'Piano Type Comparison',
      value: 1
    });
  }
}, [isVisible]);
```

- [ ] Add view tracking for PianoTypeComparison section
- [ ] Add view tracking for UseCaseCards section

**Track Link Clicks:**
- [ ] Track piano type category links (grand, upright, digital, hybrid)
- [ ] Track use case CTA clicks (guides, product pages)
- [ ] Track model chip clicks (ES120, CA901, etc.)
- [ ] Track quiz CTA clicks from component bottoms

**Custom Events to Set Up:**
```javascript
// Piano type selection
gtag('event', 'select_content', {
  content_type: 'piano_type',
  item_id: 'grand_piano'
});

// Use case selection
gtag('event', 'select_content', {
  content_type: 'use_case',
  item_id: 'students_beginners'
});

// Model interest
gtag('event', 'select_item', {
  items: [{
    item_id: 'ES120',
    item_name: 'Kawai ES120',
    item_category: 'Digital Piano',
    item_category2: 'Beginner'
  }]
});
```

- [ ] Configure custom events in Google Analytics
- [ ] Test events fire correctly in GA4 DebugView

---

## 🧪 Testing Checklist

### Functionality Testing:
- [ ] All links navigate correctly
- [ ] Model chips open correct product pages
- [ ] CTA buttons work on mobile and desktop
- [ ] Quiz anchor link (`#quiz`) scrolls to correct section
- [ ] No console errors in browser DevTools

### Performance Testing:
- [ ] Components lazy-load (don't animate until visible)
- [ ] Page load time remains under 3 seconds
- [ ] Lighthouse score stays above 90
- [ ] No layout shift (CLS remains good)

### Accessibility Testing:
- [ ] Keyboard navigation works (Tab through all links)
- [ ] Focus states are visible
- [ ] Screen reader announces content correctly (test with VoiceOver/NVDA)
- [ ] Color contrast passes WCAG AA (use browser DevTools)
- [ ] Touch targets are 44px+ on mobile

### Cross-Browser Testing:
- [ ] Chrome/Edge (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing:
- [ ] iPhone (small screen 320px-375px)
- [ ] iPad (tablet 768px-1024px)
- [ ] Desktop (1440px+)
- [ ] Test landscape and portrait orientations

---

## 🚀 Deployment Checklist

### Pre-Deployment:
- [ ] Run `bun run build` to verify production build succeeds
- [ ] Check build output for any warnings or errors
- [ ] Verify TypeScript compilation passes
- [ ] Test production build locally with `bun run start`

### Post-Deployment:
- [ ] Visit live page and verify components render correctly
- [ ] Test all links work on production
- [ ] Check mobile responsiveness on real devices
- [ ] Submit updated sitemap to Google Search Console
- [ ] Request indexing for `/find-my-piano` in Search Console

### Monitoring (First 7 Days):
- [ ] Track page views and engagement time
- [ ] Monitor scroll depth to components
- [ ] Check CTR on component links
- [ ] Watch for error reports in Sentry/monitoring tool
- [ ] Review Core Web Vitals in Search Console

---

## 📈 Optimization (Weeks 2-4)

### A/B Testing Ideas:
- [ ] Test different CTA button text
  - "Take the Quiz" vs "Find My Piano" vs "Get Started"
- [ ] Test card vs table layout preference (desktop)
- [ ] Test icon styles (outlined vs filled vs illustrated)
- [ ] Test "Perfect for you if..." heading variations

### Content Refinements:
- [ ] Monitor which piano types get most clicks
- [ ] Track which use cases resonate most
- [ ] Update model recommendations based on inventory
- [ ] Adjust pricing if market changes

### Performance Tuning:
- [ ] Add preload hints for fonts if needed
- [ ] Consider static generation if content rarely changes
- [ ] Optimize animation performance if janky on low-end devices
- [ ] Lazy-load Framer Motion if bundle size is concern

---

## 📚 Documentation to Reference

During integration, keep these docs handy:

- **Component README:** `/src/components/find-my-piano/README.md`
- **Usage Examples:** `/src/components/find-my-piano/example-usage.tsx`
- **Visual Preview:** `/src/components/find-my-piano/COMPONENT_PREVIEW.md`
- **Delivery Summary:** `/PIANO_FINDER_COMPONENTS_DELIVERY.md`
- **SEO Strategy:** `/docs/seo/piano-finder-page-strategy-2025.md`
- **Design System:** `/CLAUDE.md` (sections on styling, components, TypeScript)

---

## 🆘 Troubleshooting

### Common Issues:

**Components don't animate:**
- ✅ Check IntersectionObserver is supported (polyfill for old browsers if needed)
- ✅ Verify `isVisible` state is updating (add console.log)
- ✅ Confirm threshold (0.2) allows trigger (try 0.1 if needed)

**Links are broken:**
- ✅ Verify all product/category/guide pages exist
- ✅ Update component links if routes are different
- ✅ Check Next.js Link component is imported correctly

**Styling looks wrong:**
- ✅ Confirm Tailwind CSS is processing the component files
- ✅ Check kawai-* custom classes are defined in globals.css
- ✅ Verify fonts are loading (check Network tab in DevTools)

**TypeScript errors:**
- ✅ Run `bun run lint` to see all errors
- ✅ Ensure all dependencies are installed (`bun install`)
- ✅ Check that @types packages are present

**Performance issues:**
- ✅ Lazy-load Framer Motion with dynamic import
- ✅ Reduce animation duration if 0.7s feels slow
- ✅ Use `will-change` CSS property sparingly
- ✅ Profile with React DevTools Profiler

---

## ✅ Final Sign-Off

Before marking complete:

- [ ] All components render correctly on production
- [ ] All links navigate to correct pages
- [ ] Analytics events are firing
- [ ] Mobile experience is smooth
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals are "Good"
- [ ] Content is accurate and on-brand
- [ ] SEO metadata is in place
- [ ] Schema markup added (if applicable)
- [ ] Team has been notified of new features

---

**Need Help?**
- Review component documentation in `/src/components/find-my-piano/README.md`
- Check example usage in `example-usage.tsx`
- Refer to SEO strategy in `/docs/seo/piano-finder-page-strategy-2025.md`

**Components are production-ready and waiting for integration!** 🎹✨
