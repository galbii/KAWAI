# KAWAI Piano — Font System

## Font Stack

| Font | CSS Variable | Usage |
|------|-------------|-------|
| **Inter** | `--font-brand-sans` | Body text, UI, navigation, labels — the primary workhorse |
| **Crimson Text** | `--font-brand-serif` / `--font-brand-luxury` | Headings, editorial copy, product descriptions — the luxury serif |
| **Cormorant Garamond** | `--font-family-cormorant` | Artist carousel, Japanese aesthetic sections — decorative |
| **Noto Sans** | `--font-family-noto` | Supplementary/international text |
| **Playfair Display** | `--font-buena-park` | Legacy — avoid for new work |

## Brand Identity Fonts

The two fonts that define the KAWAI brand:

- **Inter** — everything functional (nav, body, UI, labels)
- **Crimson Text** — everything emotional/premium (headlines, product names, editorial)

Crimson Text is aliased as both `--font-brand-serif` and `--font-brand-luxury` — same font, two semantic names depending on context.

## Usage in Code

Always apply fonts via CSS variable — never reference the font name directly:

```tsx
// Body / UI
<p className="font-[family-name:var(--font-brand-sans)]">Natural sound technology</p>

// Heading / Premium
<h1 className="font-[family-name:var(--font-brand-luxury)]">Concert Grand</h1>

// Decorative (artist/Japanese aesthetic)
<span className="font-[family-name:var(--font-family-cormorant)]">Artist Name</span>
```

```tsx
// ❌ Never use font name directly — breaks silently in production
<h2 className="font-playfair">...</h2>
<h2 className="font-cormorant">...</h2>
<h2 className="font-noto">...</h2>
```

## Font Loading

Defined in `src/app/layout.tsx`. Only **Inter is preloaded** — all others load with `display: swap`.

## CSS Variable Aliases (from globals.css)

```css
--font-brand-sans:    var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-brand-serif:   var(--font-crimson), Georgia, "Times New Roman", serif;
--font-brand-luxury:  var(--font-crimson), Georgia, "Times New Roman", serif;
--font-brand-music:   var(--font-inter), sans-serif;
--font-family-cormorant: var(--font-cormorant), "Playfair Display", Georgia, serif;
--font-family-noto:   var(--font-noto), -apple-system, BlinkMacSystemFont, sans-serif;
```
