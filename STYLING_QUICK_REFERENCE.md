# Kawai Styling Quick Reference 🎹

## Brand Colors
```css
/* Primary Colors */
bg-brand-primary    /* #E11922 - Kawai Red */
bg-brand-dark       /* #1E1B16 - Deep Black */  
bg-brand-light      /* #FFFFFF - Pure White */
bg-brand-neutral    /* #DBDBDB - Light Grey */

/* Extended Scales */
bg-kawai-red-500    /* Primary red */
bg-kawai-black-900  /* Primary black */
text-brand-primary  /* Red text */
text-brand-dark     /* Black text */
```

## Typography
```html
<!-- Headlines (Serif - Sophisticated) -->
<h1 class="heading-brand-hero">Hero Headlines</h1>
<h2 class="heading-brand-section">Section Titles</h2>
<h3 class="heading-brand-card">Card Headlines</h3>

<!-- Body Text (Sans-serif - Approachable) -->
<p class="text-brand-sophisticated">Premium content</p>
<p class="text-brand-approachable">Regular content</p>
<span class="text-brand-musical">MUSICAL ELEMENTS</span>
```

## Buttons
```html
<button class="btn-brand-primary">Primary CTA</button>
<button class="btn-brand-secondary">Secondary Action</button>
<button class="btn-brand-musical">♪ PLAY SAMPLE</button>
<button class="btn-brand-ghost">Subtle Action</button>
```

## Cards  
```html
<div class="card-brand-primary">General cards</div>
<div class="card-brand-intimate">Personal connection</div>
<div class="card-brand-dynamic">Energetic content</div>
<div class="card-brand-cinematic">Premium with shimmer</div>
<div class="card-brand-premium">Dark luxury theme</div>
```

## Layout
```html
<div class="container-brand">Responsive container</div>
<section class="section-brand-primary">Standard sections</section>
<div class="grid-brand-ma">Ma-based grid</div>
<div class="flex-brand-center">Centered flex</div>
<div class="flex-brand-between">Space between</div>
```

## Spacing (Ma Principle)
```css
/* Japanese Ma-based spacing */
gap-ma              /* 24px core spacing */
p-brand-sm          /* 8px */
p-brand-md          /* 16px */ 
p-brand-lg          /* 24px - Ma */
p-brand-xl          /* 32px */
p-brand-2xl         /* 48px */
```

## Navigation
```html
<nav class="nav-brand-primary">
  <button class="nav-brand-trigger">Menu Item</button>
  <div class="nav-brand-dropdown">
    <a class="nav-brand-link">Sub Item</a>
  </div>
</nav>
```

## Forms
```html
<div class="fieldset-brand">
  <label class="label-brand">Label</label>
  <input class="input-brand-primary" />
</div>
```

## Effects
```css
/* Shadows */
shadow-brand-subtle     /* Light depth */
shadow-brand-medium     /* Standard cards */
shadow-brand-premium    /* Premium elements */
shadow-brand-cinematic  /* Hero sections */
shadow-brand-red-glow   /* CTA buttons */

/* Animations */
hover-piano             /* Piano key press effect */
animate-fade-in-cinematic
animate-slide-in-elegant

/* Gradients */
bg-brand-gradient-primary    /* Dark sophisticated */
bg-brand-gradient-heritage   /* Red to black */
bg-brand-gradient-premium    /* Multi-stop luxury */
```

## Special Components
```html
<!-- Sheet Music Device (Creative Headlines Only) -->
<div class="sheet-music-device">
  Hold a room with the tips of your fingers
</div>

<!-- Piano Keys -->
<div class="piano-key-white hover-piano">White Key</div>
<div class="piano-key-black hover-piano">Black Key</div>

<!-- Heritage Elements -->
<div class="heritage-timeline-dot"></div>
```

## Responsive Modifiers
```html
<!-- Mobile-first approach -->
<button class="btn-brand-primary md:btn-brand-large lg:px-brand-2xl">
<div class="card-brand-primary md:card-brand-expanded lg:card-brand-spacious">
```

## Brand Personality Checklist
- ✅ **Sophisticated** but never stuffy
- ✅ **Contemporary** but honoring 100-year heritage
- ✅ **Approachable** but maintaining premium quality
- ✅ **Cinematic** with atmospheric depth
- ✅ **Emotional** focusing on human-piano connection

## Performance
- All components use Tailwind JIT compilation
- CSS is tree-shaken in production
- Components respect `prefers-reduced-motion`
- High contrast mode supported
- Print styles included

---

*Quick access to Kawai brand styling. For complete documentation, see `KAWAI_STYLING_GUIDE.md`*