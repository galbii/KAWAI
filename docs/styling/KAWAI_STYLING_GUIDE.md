# Kawai Piano Website Styling Guide
**"Instrumental to Life" - Sophisticated with a Touch of Whimsy**

This comprehensive styling guide implements the official Kawai brand guidelines using modern Tailwind CSS practices, creating a maintainable and scalable design system that captures the brand's essence: sophisticated yet approachable, contemporary yet timeless.

## 🎹 Brand Philosophy

> "Making a classic feel contemporary" - Our styling approach balances the heritage of nearly 100 years of piano craftsmanship with modern web design principles.

### Core Brand Values in Design:
- **Sophisticated with a Touch of Whimsy**: Elegant but never stuffy
- **Cinematic Quality**: Rich depth, atmospheric lighting effects
- **Warm and Approachable**: Never elitist or intimidating  
- **Contemporary Heritage**: Modern interpretation of timeless craft
- **Emotional Connection**: Focus on human-piano relationship

---

## 🎨 Color System

### Official Brand Palette (from Brand Guidelines)

```css
/* Primary Colors */
--brand-primary: #E11922;    /* Official Kawai Red */
--brand-dark: #1E1B16;       /* Deep Black */
--brand-light: #FFFFFF;      /* Pure White */
--brand-neutral: #DBDBDB;    /* Light Grey */
```

### Extended Kawai Color Scale

#### Kawai Red (`kawai-red-*`)
- **Primary Use**: CTAs, accents, interactive states
- **500**: `#E11922` - Main brand color
- **600**: `#dc2626` - Hover states
- **700**: `#b91c1c` - Active states
- **50-100**: Light backgrounds and highlights
- **800-950**: Deep accents and shadows

#### Kawai Black (`kawai-black-*`) 
- **Primary Use**: Text, premium backgrounds
- **900**: `#1E1B16` - Main brand black
- **800-700**: Muted text, secondary elements
- **600-400**: Supporting text, subtle elements
- **300-50**: Light greys, backgrounds

### Usage Guidelines

✅ **DO**
- Use `brand-primary` (#E11922) for primary CTAs and key brand moments
- Use `brand-dark` (#1E1B16) for primary text and sophisticated backgrounds
- Maintain 4.5:1 contrast ratio minimum for accessibility
- Use extended scales (`kawai-red-*`, `kawai-black-*`) for variations

❌ **DON'T**
- Never use pure black (#000000) instead of brand-dark
- Don't use the red for large text blocks (poor readability)
- Avoid using colors outside the defined palette
- Don't use brand colors for error states (use semantic colors)

---

## 🔤 Typography System

### Font Hierarchy (aligned with Brand Guidelines)

```css
/* Primary - Sophisticated Headlines */
font-family: 'BuenaParkJF', Georgia, 'Times New Roman', serif;
/* Secondary - Clean Supporting Text */
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;  
/* Musical Elements */
font-family: 'Lato', sans-serif;
```

### Typography Classes

#### Headlines (Sophisticated)
```html
<h1 class="heading-brand-hero">Instrumental to Life</h1>
<h2 class="heading-brand-section">Our Piano Collection</h2>
<h3 class="heading-brand-card">Grand Piano Series</h3>
```

#### Body Text (Approachable)
```html
<p class="text-brand-sophisticated">Premium content with personality</p>
<p class="text-brand-approachable">Accessible, everyday content</p>
<span class="text-brand-musical">SHEET MUSIC ELEMENTS</span>
```

### Typography Best Practices

✅ **DO**
- Use serif fonts (`font-brand-serif`) for headlines and brand voice
- Use sans-serif (`font-brand-sans`) for body text and UI
- Apply `text-sophisticated` for premium content
- Maintain consistent line-height (1.6 for body, tighter for headlines)

❌ **DON'T**
- Mix multiple serif fonts in the same design
- Use all-caps extensively (except for musical elements)
- Set body text smaller than 16px (accessibility)
- Use tight letter-spacing on body text

---

## 🎛️ Component Library

### Buttons - Interactive Excellence

#### Primary Button (Brand CTAs)
```html
<button class="btn-brand-primary">
  Explore Our Pianos
</button>
```
- **Use for**: Primary actions, main CTAs
- **Interactions**: Hover lift, red glow shadow
- **Accessibility**: Focus ring, proper contrast

#### Secondary Button (Supporting Actions)
```html
<button class="btn-brand-secondary">
  Learn More
</button>
```
- **Use for**: Secondary actions, alternative paths
- **Style**: Transparent with brand-dark border
- **Hover**: Inverts to dark background

#### Musical Button (Special Elements)
```html
<button class="btn-brand-musical">
  ♪ PLAY SAMPLE
</button>
```
- **Use for**: Audio controls, musical interactions
- **Font**: Lato Bold (musical elements font)
- **Style**: Gradient red, compact form

### Cards - Cinematic Depth

#### Primary Card (General Use)
```html
<div class="card-brand-primary">
  <img src="piano.jpg" alt="Kawai Piano" />
  <div class="p-brand-lg">
    <h3 class="heading-brand-card">Piano Model</h3>
    <p class="text-brand-approachable">Description...</p>
  </div>
</div>
```

#### Intimate Card (Personal Connection)
```html
<div class="card-brand-intimate">
  <!-- Focus on human-piano relationship -->
</div>
```

#### Dynamic Card (Energetic Content)
```html
<div class="card-brand-dynamic">
  <!-- Performance, movement, energy -->
</div>
```

#### Cinematic Card (Premium Content)
```html
<div class="card-brand-cinematic">
  <!-- Shimmer effect, premium depth -->
</div>
```

### Navigation - Premium Interactions

```html
<nav class="nav-brand-primary">
  <button class="nav-brand-trigger">Our Pianos</button>
  <div class="nav-brand-dropdown">
    <a href="/grand" class="nav-brand-link">Grand Pianos</a>
    <a href="/digital" class="nav-brand-link">Digital Pianos</a>
  </div>
</nav>
```

### Forms - Elegant and Accessible

```html
<div class="fieldset-brand">
  <label class="label-brand" for="email">Email Address</label>
  <input class="input-brand-primary" type="email" id="email" />
</div>
```

---

## 📐 Layout System

### Spacing (Japanese Ma Principle)

The design follows Japanese "Ma" (negative space) principles:

```css
--ma-space: 24px;  /* Core spacing unit */
```

#### Spacing Scale
- `brand-xs`: 4px - Tight internal spacing
- `brand-sm`: 8px - Small gaps, compact layouts  
- `brand-md`: 16px - Standard element spacing
- `brand-lg`: 24px - Ma space, section breaks
- `brand-xl`: 32px - Large section spacing
- `brand-2xl`: 48px - Major layout breaks
- `brand-3xl`: 64px - Page section spacing
- `brand-4xl`: 96px - Hero section spacing

### Container System

```html
<div class="container-brand">
  <!-- Max-width, centered, responsive padding -->
</div>

<section class="section-brand-primary">
  <!-- Standard section spacing -->
</section>

<section class="section-brand-compact">  
  <!-- Tighter section spacing -->
</section>
```

### Grid System (Ma-based)

```html
<div class="grid-brand-ma">
  <!-- Auto-fit grid with Ma spacing -->
</div>
```

---

## ✨ Visual Effects

### Shadows (Cinematic Depth)

```css
/* Subtle depth */
.shadow-brand-subtle
/* Standard cards */  
.shadow-brand-medium
/* Premium elements */
.shadow-brand-premium
/* Hero sections */
.shadow-brand-cinematic
/* Red glow for CTAs */
.shadow-brand-red-glow
```

### Animations (Piano-Inspired)

```css
/* Piano key press effect */
.hover-piano:hover
/* Elegant fade-ins */
.animate-fade-in-cinematic
/* Smooth sliding */  
.animate-slide-in-elegant
```

### Gradients (Brand Atmosphere)

```html
<div class="bg-brand-gradient-primary">
  <!-- Dark sophisticated gradient -->
</div>

<div class="bg-brand-gradient-heritage">
  <!-- Red to black, heritage feel -->
</div>

<div class="bg-brand-gradient-premium">
  <!-- Multi-stop premium gradient -->
</div>
```

---

## 🎵 Special Components

### Sheet Music Device

Unique to Kawai brand, for creative headlines:

```html
<div class="sheet-music-device">
  Hold a room with the tips of your fingers
</div>
```

**Usage Rules:**
- Only for creative headlines, not everyday content
- Must be musically accurate (work with composer)
- Centered within content area
- Never rotated or modified

### Piano Key Elements

```html
<div class="piano-key-white hover-piano">White Key</div>
<div class="piano-key-black hover-piano">Black Key</div>
```

### Heritage Timeline

```html
<div class="heritage-timeline-dot"></div>
```

---

## 🎯 Responsive Design

### Mobile-First Approach

All components are built mobile-first, scaling up:

```html
<!-- Base: Mobile -->
<button class="btn-brand-primary">
<!-- Tablet: Enhanced -->
<button class="btn-brand-primary md:btn-brand-large">
<!-- Desktop: Full experience -->  
<button class="btn-brand-primary md:btn-brand-large lg:px-brand-2xl">
```

### Breakpoint Strategy

- **Mobile**: Core experience, all functionality
- **Tablet**: Enhanced spacing, larger touch targets
- **Desktop**: Full cinematic experience, hover effects
- **Large**: Optimized for concert hall displays

---

## ♿ Accessibility

### Color Contrast
- **AA Compliance**: 4.5:1 minimum for normal text
- **AAA Preferred**: 7:1 for important content
- **High Contrast Mode**: Automatic border enhancements

### Motion & Animation
- **Reduced Motion**: All animations respect `prefers-reduced-motion`
- **Focus Management**: Clear focus indicators on all interactive elements
- **Screen Readers**: Semantic HTML, ARIA labels where needed

### Keyboard Navigation
```css
.focus-visible-brand  /* Consistent focus styling */
```

---

## ⚡ Performance Optimization

### Tailwind CSS v4 Simplified Approach

**Philosophy**: Use auto-generated utilities first, custom components sparingly.

- **@theme Configuration**: Design tokens auto-generate utilities (`--color-kawai-red` → `bg-kawai-red`)
- **Generated-First**: Use `bg-kawai-red hover:bg-kawai-red-600` instead of custom classes
- **Minimal Custom CSS**: Only complex multi-property components need `@utility`
- **Performance Optimized**: Fewer custom definitions = faster builds

### CSS Organization (v4 Simplified)

```
src/
├── app/globals.css          # @theme + simple @import
└── styles/
    └── brand-components.css # 3-4 @utility components + @apply classes
```

### v4 Best Practices

**1. Auto-Generated Utilities (Preferred)**
```html
<!-- Good: Use generated utilities -->
<button class="bg-kawai-red text-white px-6 py-3 hover:bg-kawai-red-600">
  Primary Button
</button>

<div class="bg-kawai-pearl border border-kawai-neutral/30 p-8 rounded-lg shadow-brand-medium">
  Card Content
</div>
```

**2. Custom Components (Only When Complex)**
```html
<!-- Only for complex multi-property components -->
<button class="btn-brand-primary">
  Complex Button with Gradient & Animation
</button>
```

**3. @theme Configuration**
```css
@import "tailwindcss";

@theme {
  /* Auto-generates bg-kawai-red, text-kawai-red, border-kawai-red, etc. */
  --color-kawai-red: #E11922;
  --color-kawai-black: #1E1B16;
  --color-kawai-pearl: #FFFFFF;
  
  /* Auto-generates font-brand-serif utility */
  --font-brand-serif: "BuenaParkJF", serif;
  
  /* Auto-generates shadow-brand-medium utility */
  --shadow-brand-medium: 0 4px 16px rgb(30 27 22 / 0.08);
}
```

### Loading Strategy

1. **Critical CSS**: Base brand colors, typography
2. **Component CSS**: Loaded as needed
3. **Interactive CSS**: Hover states, animations

---

## 🛠️ Development Workflow

### Adding New Components

1. **Define in brand-components.css** using @apply
2. **Document usage** in this guide  
3. **Test accessibility** with screen readers
4. **Verify responsive** behavior on all devices
5. **Check performance** impact

### Naming Convention

```css
/* Component type - brand - variant */
.btn-brand-primary
.card-brand-intimate  
.nav-brand-dropdown
.input-brand-search
```

### Brand Compliance Checklist

- [ ] Uses official brand colors (#E11922, #1E1B16)
- [ ] Follows typography hierarchy  
- [ ] Implements Ma spacing principles
- [ ] Includes hover/focus states
- [ ] Supports dark mode (if applicable)
- [ ] Passes accessibility tests
- [ ] Works on mobile devices
- [ ] Maintains brand personality

---

## 🎨 Usage Examples (v4 Simplified)

### Hero Section with Generated Utilities
```html
<section class="bg-gradient-to-br from-kawai-black to-kawai-black-800 py-24 px-4">
  <div class="max-w-7xl mx-auto text-center">
    <h1 class="text-5xl md:text-7xl font-bold text-kawai-pearl mb-6 font-brand-serif">
      Instrumental to Life
    </h1>
    <p class="text-xl text-kawai-pearl/90 mb-8 max-w-2xl mx-auto">
      Discover pianos that feel better to play and sound better to listen to
    </p>
    <button class="btn-brand-primary">
      Explore Our Collection
    </button>
  </div>
</section>
```

### Piano Showcase Card
```html
<div class="card-brand-dynamic">
  <img src="grand-piano.jpg" alt="Kawai Grand Piano" 
       class="w-full h-64 object-cover" />
  <div class="p-brand-xl">
    <h3 class="heading-brand-card">GX Series Grand Piano</h3>
    <p class="text-brand-approachable mb-brand-md">
      Experience the perfect balance of power and precision...
    </p>
    <div class="flex-brand-between">
      <span class="text-brand-musical">FROM $89,000</span>
      <button class="btn-brand-secondary">Learn More</button>
    </div>
  </div>
</div>
```

### Navigation Header
```html
<header class="nav-brand-primary">
  <div class="container-brand">
    <div class="flex-brand-between py-brand-md">
      <div class="kawai-logo-container">
        <img src="/kawai-logo.png" alt="Kawai" class="h-8" />
      </div>
      <nav class="hidden md:flex space-x-brand-md">
        <button class="nav-brand-trigger">Our Pianos</button>
        <button class="nav-brand-trigger">Heritage</button>
        <button class="nav-brand-trigger">Support</button>
      </nav>
      <button class="btn-brand-musical">
        🎹 Find My Piano
      </button>
    </div>
  </div>
</header>
```

---

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   bun add -d tailwindcss @tailwindcss/typography @tailwindcss/forms
   ```

2. **Use Existing Configuration**
   The `tailwind.config.js` is already configured with all brand tokens.

3. **Import Styles**
   Brand components are automatically imported in `globals.css`.

4. **Start Building**
   ```html
   <button class="btn-brand-primary">Get Started</button>
   <div class="card-brand-intimate">...</div>
   <h2 class="heading-brand-section">...</h2>
   ```

---

## 📞 Support & Maintenance

### Brand Compliance Contact
- **Warrick Baker**: warrick@kawai.com.au
- **Taylor Chapman**: taylor.chapman@ogilvy.com

### Development Questions
Check existing components before creating new ones. All brand elements should feel:
- **Sophisticated** but never stuffy
- **Contemporary** but honoring heritage  
- **Approachable** but maintaining quality
- **Cinematic** but functionally sound

---

*This styling guide ensures that every pixel reflects Kawai's 100-year commitment to excellence while embracing modern web standards and accessibility best practices.*

**Remember**: We're not just building a website—we're crafting digital experiences that are truly "Instrumental to Life." 🎹

---

## 📖 Quick Reference: v4 Generated Utilities

### Available Auto-Generated Classes
From your `@theme` configuration, you automatically get:

**Colors:**
```
bg-kawai-red, bg-kawai-black, bg-kawai-pearl, bg-kawai-neutral
text-kawai-red, text-kawai-black, text-kawai-pearl, text-kawai-neutral  
border-kawai-red, border-kawai-black, border-kawai-pearl, border-kawai-neutral
```

**Typography:**
```
font-brand-serif, font-brand-sans, font-brand-music
```

**Shadows:**
```
shadow-brand-subtle, shadow-brand-medium, shadow-brand-premium, shadow-brand-red-glow
```

**Spacing:**
```
p-brand-xs through p-brand-4xl
m-brand-xs through m-brand-4xl
gap-brand-xs through gap-brand-4xl
```

### Development Workflow
1. **First**: Try using generated utilities (`bg-kawai-red hover:bg-kawai-red-600`)
2. **If complex**: Use existing custom components (`btn-brand-primary`)
3. **Only if needed**: Create new `@utility` or `@apply` class in brand-components.css
