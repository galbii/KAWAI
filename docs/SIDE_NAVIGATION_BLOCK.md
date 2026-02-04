# Side Navigation Block - Implementation Guide

## Overview

The **Side Navigation Block** (`layout-side-navigation`) is a sophisticated scroll-spy navigation component that provides elegant section jumping for multi-section pages. Inspired by Japanese shoji screens and minimalist design principles, it automatically detects the user's scroll position and highlights the active section.

## Design Philosophy

**"Shoji Screen Navigation"** - A refined blend of Japanese wabi-sabi minimalism and contemporary glassmorphism:

- **Subtle presence**: Like a translucent paper screen that gently divides space
- **Intelligent tracking**: Ink-brush stroke indicator follows active sections
- **Mobile transformation**: Desktop side nav becomes floating "行灯" (andon lantern) style bottom bar
- **Purposeful interactions**: Smooth scroll animations with haiku-like simplicity

## Features

### Core Functionality
- ✅ **Scroll-spy detection** using Intersection Observer API
- ✅ **Smooth scroll** to sections with configurable offset
- ✅ **Auto-hide behavior** (optional) - hides on scroll down, shows on scroll up
- ✅ **Active section highlighting** with animated ink-brush indicator
- ✅ **Progress line** connecting navigation items (optional)

### Responsive Design
- 🖥️ **Desktop**: Fixed side navigation (left or right positioning)
- 📱 **Mobile**: Two transformation modes
  - **Bottom Bar**: Floating pill-style horizontal navigation
  - **Hamburger Menu**: Slide-out panel with full navigation list
  - **Hidden**: Completely hidden on mobile devices

### Customization
- 🎨 **Four themes**: Light, Dark, Kawai Red, Gold Accent
- 🎯 **Custom icons**: 10 icon options per navigation item
- 📏 **Compact mode**: Tighter spacing for more items
- 🔲 **Glassmorphism**: Optional backdrop blur effects
- 🖼️ **Borders**: Optional subtle borders

### Accessibility
- ♿ **ARIA labels** for screen readers
- ⌨️ **Keyboard navigation** support
- 🎯 **Semantic HTML** structure
- 📢 **aria-current** indicators for active sections

## Technical Implementation

### Block Definition

**File**: `src/blocks/layout/SideNavigation.ts`

```typescript
export const SideNavigation: Block = {
  slug: 'layout-side-navigation',
  labels: {
    singular: '🧭 Side Navigation',
    plural: 'Side Navigations',
  },
  interfaceName: 'LayoutSideNavigationBlock',
  fields: [
    // Configuration fields for sections, themes, behavior, etc.
  ]
}
```

### React Component

**File**: `src/components/blocks/SideNavigationBlock.tsx`

Key technologies:
- **Framer Motion**: Smooth animations and transitions
- **Intersection Observer**: Efficient scroll position detection
- **useScroll hook**: Track scroll direction for auto-hide
- **React state**: Manage active section and menu states

### Renderer

**File**: `src/components/blocks/layout/LayoutSideNavigationRenderer.tsx`

Simple pass-through component that connects Payload CMS data to the React component.

## Usage Guide

### Step 1: Add Block to Page

In the Payload CMS admin:

1. Navigate to **Pages** collection
2. Create or edit a page
3. In the **Content** tab, add a **Side Navigation** block
4. Configure settings:
   - **Enabled**: ✅ Check to enable
   - **Title**: Optional heading (e.g., "Navigation", "Contents")
   - **Position**: Left or Right (desktop only)
   - **Theme**: Choose visual style

### Step 2: Define Navigation Sections

For each section of your page:

1. Click **Add Section**
2. Configure:
   - **Label**: Display name (e.g., "Overview", "Features")
   - **Target ID**: HTML ID of the section (e.g., `overview`, `features`)
   - **Icon**: Optional visual indicator

**Important**: Target IDs must match the HTML `id` attributes on your page content sections.

### Step 3: Configure Mobile Behavior

Choose how navigation appears on mobile:

- **Bottom Bar (Andon Style)**: Floating pill navigation at bottom
  - Best for: 3-5 sections, quick access
  - UX: Always visible, horizontal scroll if needed

- **Hamburger Menu**: Slide-out panel from right
  - Best for: 6+ sections, cleaner UI
  - UX: Tap to open, reveals full list

- **Hidden**: Navigation not shown on mobile
  - Best for: Simple pages, mobile-first content

### Step 4: Assign HTML IDs to Page Sections

Each content block on your page needs an HTML `id` attribute that matches the navigation's target IDs.

**Example page structure**:

```html
<div id="overview">
  <!-- Overview content -->
</div>

<div id="features">
  <!-- Features content -->
</div>

<div id="specifications">
  <!-- Specifications content -->
</div>

<div id="pricing">
  <!-- Pricing content -->
</div>
```

**In Payload CMS**: When creating content blocks, ensure each major section has a unique ID. This may require custom field configuration or using the block's built-in ID field.

### Step 5: Fine-Tune Behavior

**Scroll Offset**:
- Set this to match your fixed header height
- Default: 80px
- Prevents content from scrolling under fixed headers

**Auto-Hide**:
- Enable to hide navigation when scrolling down
- Shows again when scrolling up
- Provides more screen real estate

**Progress Line**:
- Visual connector between navigation items
- Adds vertical line on left side of items
- Helps visualize page structure

**Compact Mode**:
- Reduces spacing between items
- Useful when you have 8+ navigation items
- Maintains readability while saving space

## Configuration Reference

### Field Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Checkbox | `true` | Enable/disable the block |
| `title` | Text | "Navigation" | Optional heading above nav items |
| `position` | Select | "right" | Desktop position (left/right) |
| `theme` | Select | "light" | Visual theme (light/dark/red/gold) |
| `sections` | Array | `[]` | Navigation section definitions (1-12 items) |
| `mobileStyle` | Select | "bottom-bar" | Mobile appearance mode |
| `mobileLabel` | Text | "Menu" | Hamburger menu button label |
| `smoothScroll` | Checkbox | `true` | Enable smooth scroll animation |
| `scrollOffset` | Number | `80` | Pixel offset for scroll positioning |
| `autoHide` | Checkbox | `false` | Auto-hide on scroll down |
| `showProgress` | Checkbox | `true` | Show vertical progress line |
| `glassmorphism` | Checkbox | `true` | Enable backdrop blur effect |
| `showBorder` | Checkbox | `true` | Show container border |
| `compactMode` | Checkbox | `false` | Use tighter spacing |

### Section Configuration

Each section requires:

| Field | Required | Description |
|-------|----------|-------------|
| `label` | Yes | Display text (e.g., "Overview") |
| `targetId` | Yes | HTML ID of target section |
| `icon` | No | Visual indicator (circle, piano, etc.) |

### Icon Options

- `none` - No icon
- `circle` - ● Classic dot
- `square` - ■ Square bullet
- `triangle` - ▲ Triangle
- `diamond` - ◆ Diamond
- `piano` - 🎹 Piano emoji
- `sparkles` - ✨ Sparkles
- `target` - 🎯 Target
- `pin` - 📍 Location pin
- `star` - ⭐ Star

## Best Practices

### Content Structure

✅ **DO:**
- Use 3-8 navigation items for optimal UX
- Keep labels concise (1-3 words)
- Assign unique, semantic IDs (`overview`, `features`, not `section1`)
- Place Side Navigation block at the TOP of your page layout
- Test on mobile devices to ensure proper transformation

❌ **DON'T:**
- Exceed 12 navigation items (overwhelming)
- Use generic IDs (`div1`, `content2`)
- Place Side Navigation block at the BOTTOM of the page
- Forget to add HTML IDs to your content sections
- Use special characters in target IDs (stick to lowercase letters and hyphens)

### Theme Selection

**Light Theme** (Frosted Pearl):
- Use on: Light backgrounds, minimal pages
- Best for: Professional, clean aesthetic
- Text: Dark charcoal on pearl glass

**Dark Theme** (Charcoal Glass):
- Use on: Dark backgrounds, immersive pages
- Best for: Luxury, premium feel
- Text: Light pearl on charcoal glass

**Red Accent**:
- Use on: Brand-focused pages, CTAs
- Best for: Drawing attention, Kawai brand pages
- Text: Dark charcoal with red highlights

**Gold Accent**:
- Use on: Premium pages, special collections
- Best for: Luxury products, exclusivity
- Text: Dark charcoal with gold highlights

### Mobile Optimization

**Bottom Bar** works best when:
- You have 3-5 sections
- Users need quick access to all sections
- Page is content-heavy with frequent scrolling

**Hamburger Menu** works best when:
- You have 6+ sections
- You want a cleaner mobile UI
- Desktop nav is primary, mobile is supplementary

**Hidden** works best when:
- Page has minimal sections (1-2)
- Mobile users consume content linearly
- Navigation isn't critical on small screens

### Performance Considerations

The Side Navigation block is optimized for performance:

- **Intersection Observer**: Efficient scroll detection (no scroll event listeners)
- **Framer Motion**: GPU-accelerated animations
- **Conditional rendering**: Only renders necessary mobile components
- **Memoization**: React state updates only when section changes

**No performance impact** on page load or scroll smoothness.

## Examples

### Example 1: Product Page with Features

```yaml
# Side Navigation Configuration
enabled: true
title: "Explore"
position: right
theme: light
sections:
  - label: "Overview"
    targetId: "overview"
    icon: "piano"
  - label: "Key Features"
    targetId: "features"
    icon: "sparkles"
  - label: "Specifications"
    targetId: "specs"
    icon: "target"
  - label: "Pricing"
    targetId: "pricing"
    icon: "star"
mobileStyle: bottom-bar
smoothScroll: true
scrollOffset: 80
showProgress: true
glassmorphism: true
```

### Example 2: Documentation Page

```yaml
enabled: true
title: "Contents"
position: left
theme: dark
sections:
  - label: "Introduction"
    targetId: "intro"
    icon: "circle"
  - label: "Getting Started"
    targetId: "getting-started"
    icon: "circle"
  - label: "Features"
    targetId: "features"
    icon: "circle"
  - label: "API Reference"
    targetId: "api"
    icon: "circle"
  - label: "Examples"
    targetId: "examples"
    icon: "circle"
  - label: "FAQ"
    targetId: "faq"
    icon: "circle"
mobileStyle: hamburger
compactMode: true
autoHide: false
```

### Example 3: Landing Page with Hero Sections

```yaml
enabled: true
title: ""  # No title
position: right
theme: red
sections:
  - label: "Innovation"
    targetId: "innovation"
    icon: "sparkles"
  - label: "Craftsmanship"
    targetId: "craftsmanship"
    icon: "diamond"
  - label: "Artists"
    targetId: "artists"
    icon: "star"
  - label: "Find Dealer"
    targetId: "dealers"
    icon: "pin"
mobileStyle: bottom-bar
smoothScroll: true
scrollOffset: 100  # Larger header
autoHide: true
showBorder: false
```

## Troubleshooting

### Navigation Not Appearing

**Issue**: Side navigation doesn't render on the page.

**Solutions**:
1. ✅ Ensure `enabled` is checked in CMS
2. ✅ Verify at least one section is defined
3. ✅ Check that block is added to page's `layout` field
4. ✅ Confirm block is registered in `payload.config.ts`

### Sections Not Highlighting

**Issue**: Active section indicator doesn't change on scroll.

**Solutions**:
1. ✅ Verify HTML IDs exist on page sections
2. ✅ Ensure `targetId` values match HTML `id` attributes exactly
3. ✅ Check that sections are visible in viewport (height > 0)
4. ✅ Adjust `scrollOffset` to account for fixed headers

### Smooth Scroll Not Working

**Issue**: Clicking navigation items doesn't smoothly scroll.

**Solutions**:
1. ✅ Verify `smoothScroll` is enabled
2. ✅ Check for CSS `scroll-behavior: auto` overrides
3. ✅ Ensure target sections exist on the page
4. ✅ Test in different browsers (Safari has different smooth scroll behavior)

### Mobile Navigation Hidden

**Issue**: Navigation doesn't appear on mobile devices.

**Solutions**:
1. ✅ Check `mobileStyle` setting (ensure not set to "hidden")
2. ✅ Verify responsive breakpoint (`lg:block` = 1024px+)
3. ✅ Test on actual mobile device, not just browser DevTools
4. ✅ Check z-index conflicts with other fixed elements

## Technical Notes

### Browser Compatibility

- **Intersection Observer**: Supported in all modern browsers (IE11+)
- **Smooth Scroll**: Fully supported, graceful fallback for older browsers
- **Framer Motion**: React 18+ required
- **CSS Backdrop Filter**: Glassmorphism may not work in older Firefox versions

### Dependencies

- `framer-motion` - Animation library
- `react` - React 18+
- Tailwind CSS (for styling)

### Z-Index Hierarchy

The Side Navigation uses the following z-index values:

- Desktop nav: `z-40` (40)
- Mobile bottom bar: `z-40` (40)
- Mobile hamburger button: `z-50` (50)
- Mobile menu backdrop: `z-40` (40)
- Mobile menu panel: `z-40` (40)

Ensure your fixed headers/footers use compatible z-index values.

## Future Enhancements

Potential improvements for future versions:

- [ ] **Nested navigation**: Support for sub-sections
- [ ] **Scroll progress bar**: Visual indicator of page progress
- [ ] **Custom animations**: User-selectable transition styles
- [ ] **Keyboard shortcuts**: Jump to sections with number keys
- [ ] **Section thumbnails**: Optional preview images
- [ ] **Sticky behavior**: Option to stick to top on scroll
- [ ] **Custom breakpoints**: Configure mobile transformation point
- [ ] **Analytics integration**: Track section engagement

## Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Intersection Observer MDN**: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- **BLOCKS.md**: Full blocks documentation
- **CLAUDE.md**: Project architecture guide

---

**Version**: 1.0.0
**Last Updated**: 2026-02-04
**Author**: Kawai Piano Development Team
