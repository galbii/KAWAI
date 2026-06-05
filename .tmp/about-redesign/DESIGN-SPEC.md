# /about — Cinematic Redesign Spec

> **Status:** Design reference, pre-implementation. Copy is locked; structural and motion direction are open for one round of review before any code lands in `src/`.
>
> **Concept (locked):** One continuous scroll narrative. A single Kawai grand soundboard photograph stays pinned and the camera moves *through* it — full piano → harp & gold strings → a single string vibrating → pulling back to a hand at the keys. Sections cross-fade through these camera frames rather than stacking. The page is a film, not a stack of cards.

---

## 1. Visual language

A black-box theater for one instrument. The page opens in near-total darkness with a single warm spotlight and ends in a fully lit, polished interior — so the *value of light* is the page's primary compositional move. Type is set the way a film title is set: enormous serif headlines anchored to a baseline grid, generous white-space margins (left- and bottom-aligned, never centered until the final beat), and a thin metallic gold hairline that recurs everywhere a section needs a border or a divider. The pinned media never sits behind translucent overlays competing for the eye — instead, copy lives *inside* clean rectangular "mattes" cut out of the image, so the typography and the photograph occupy distinct, non-overlapping zones. Numbers and dates are treated as cinematographic title cards — monospaced tabular figures struck onto the frame, not bullet-pointed inside a card. The eye is meant to travel down the page in long, slow arcs with one decisive event per scene; nothing fades up 24px to greet the viewer.

In one sentence: **Christopher Nolan's *Tenet* opening titles + a Steinway commercial + a single page of a Wim Wenders film book.**

---

## 2. Typography system

Everything outside the headline scale uses tabular figures (`font-variant-numeric: tabular-nums`) so numbers feel struck rather than typed.

| Role | Spec |
|---|---|
| **Display 1** — single-word headline (HERO, MANIFESTO last line, CTA) | `font-brand-serif`, 600 weight, `clamp(5rem, 13vw, 11.25rem)`, leading `0.86`, tracking `-0.035em`. Italic variant used exactly twice on the page (manifesto, final CTA). |
| **Display 2** — section headline ("Engineered by Science", "A Family Legacy of Craft") | `font-brand-serif`, 500, `clamp(2.5rem, 6vw, 4.5rem)`, leading `0.95`, tracking `-0.02em` |
| **Year cards** — 1927, 1955, 1971, 1989, 2002, 2024 | `font-brand-serif`, 500, `clamp(4.5rem, 11vw, 9rem)`, leading `1`, tabular nums, tracking `-0.04em`. These are the timeline's *protagonists*, not labels. |
| **Stat numbers** — 2.4M+, 50+, 61+, 3 | `font-brand-serif`, 400, `clamp(3.5rem, 8vw, 6rem)`, tabular nums, leading `1` |
| **Body** | system sans (the project's default), 400, `1.0625rem`, leading `1.65`, max-width `38ch`. *Never* set body wider than 38 characters per line. |
| **Eyebrow / chapter mark** — "Chapter I", "Since 1927", "1927 — 2024" | uppercase sans, 500, `0.6875rem`, tracking `0.32em`, paired with a 40px gold rule on its left |
| **Caption / footnote** | uppercase sans, 400, `0.625rem`, tracking `0.18em`, used for image annotations and the timeline playhead label |
| **Italic** | Brand serif italic is used **three places only**: the manifesto quote, the word "Inspiration" in the hero, the word "Experience" in the final CTA. Restraint is the point. |

**Type hierarchy rule:** A scene has at most one Display 1 *or* one Display 2 — never both. Two large headlines in the same viewport would compete with the pinned image.

---

## 3. Color palette by scene

The page is a **dark → bright → dark → bright** journey that mirrors a piano's tonal range.

| Scene | Background | Primary type | Accent | Red appearance |
|---|---|---|---|---|
| **1. Hero** | `kawai-black` (#1E1B16) | white | `kawai-gold` hairline + eyebrow | — |
| **2. Manifesto** | `kawai-black` warming to `#15110d` | `kawai-pearl` | gold quotation glyph, gold hairline | — |
| **3. Stats / Numerics** | `kawai-black` | `kawai-pearl` numerals, gold labels | gold tick marks | A single 1px red vertical line as the "playhead" the numerals cross |
| **4. Heritage (Koichi)** | `kawai-pearl` (#FAF8F5) — *first light* | `kawai-black` | gold rule | — |
| **5. Timeline** | gradient `kawai-pearl` → `#1E1B16` over the scroll (literal sunrise → sunset). Each year card is a pearl plate sitting on top. | `kawai-black` on pearl, fades to pearl on black | gold | One red 1px vertical "now-line" runs the full timeline height. **This is the only sustained red on the page.** |
| **6. Technology** | `kawai-black` | `kawai-pearl` | `kawai-gold` for "ABS", "Millennium III", "Progressive Harmonic Imaging" — pulled out as gold call-out tags inside the body | — |
| **7. Go Deeper (Access Grid)** | `#0a0908` (deeper than black) | `kawai-pearl` | gold | Card hover state: a 1px red underline draws in under the link arrow |
| **8. CTA** | `kawai-black` with a final, slow brighten to `kawai-pearl` behind the buttons | `kawai-pearl` | gold | Primary CTA button is the only solid `kawai-red` element on the page |

**Rule for red:** Red appears as a 1px line in scenes 3 and 5, and as a single filled button in scene 8. That's it. Everywhere the current design uses red as decoration — bullet dots on the timeline, year text — gold replaces it. Red becomes the period at the end of the sentence.

---

## 4. Motion vocabulary

Six named motions. Each appears at most twice on the page so each remains recognizable. The current design uses one motion (fade-up 24px) seven times — that's the problem to solve.

| # | Name | Easing | Duration | Triggered by | What it looks like |
|---|---|---|---|---|---|
| **M1** | **Lens push** | `[0.65, 0, 0.35, 1]` (smooth ease-in-out, like a mechanical zoom lens) | Continuous, driven by `useScroll` over the pinned media frame (scroll progress 0 → 1.0) | Scroll progress in the pinned hero | The soundboard photo `scale`s from 1.0 → 3.8 and `translateY`s from 0 → -8% over the full pinned scroll. Acts as if a camera dolly is pushing slowly *into* the piano. Crops change which detail is visible. |
| **M2** | **Iris matte** | `[0.16, 1, 0.3, 1]` (expo out) | 1100ms | Scene change (next scene enters viewport) | A black rectangular "matte" (full-bleed div) opens like a film iris: its `clip-path` animates from `inset(50% 50% 50% 50%)` to `inset(0 0 0 0)`, revealing the next scene's copy mattes one rectangle at a time. Used between hero → manifesto and timeline → technology. |
| **M3** | **String resonance** | custom spring `{ stiffness: 90, damping: 6, mass: 0.4 }` (under-damped, oscillates) | ~1800ms decay | Scroll reaches the "single vibrating string" frame at progress ≈ 0.55 | A single SVG path (a horizontal line representing one string) `scaleY` oscillates from 1 → 1.6 → 0.7 → 1.2 → 1, with a parallel gaussian-blur filter pulsing on the photo behind it. Audible would be A4 — visually it's a 24px peak-to-peak shimmer that decays. |
| **M4** | **Playhead strike** | linear scroll-bound for the line; `[0.16, 1, 0.3, 1]` for the number flip | Line: scroll-bound. Number: 600ms after crossing | A vertical red 1px line that lives at a fixed `top: 50vh` "now line"; year cards scroll *past* it | Years slide vertically through the viewport. The instant a year card's vertical center crosses the playhead, that year's number does a **single-row digit roll-up** (each digit animates `translateY: 100% → 0%` with `overflow: hidden`), the gold underline strikes left → right (0 → 100% in 380ms), and the body copy beneath ink-reveals. This is the only "tick up" moment on the page. |
| **M5** | **Number strike** (stats) | `[0.22, 1, 0.36, 1]` | 1400ms total, staggered 180ms per stat | Stats scene enters viewport | Each stat's digits count up using `framer-motion`'s `animate(0, target, { duration })` with `useMotionValue` + `useTransform`. A gold 1px tick appears under each as its count completes. The current `Counter` already exists — we're keeping it but adding the tick. |
| **M6** | **Ink reveal** (type) | `[0.85, 0, 0.15, 1]` (slow start, fast finish — like ink wetting paper) | 900ms, staggered 60ms per line | Section copy enters viewport | Words slide up from a `clip-path: inset(0 0 100% 0)` mask, not opacity. Tracks tighten 0.04em → 0em as they settle. Used for Display 2 headlines and the manifesto. The text appears *written*, not faded in. |

**Anti-pattern: never use a default `whileInView` fade-up.** That's the current page's exhaustion. If a thing doesn't deserve one of these six motions, it doesn't animate. Buttons, body paragraphs, and the eyebrow chapter marks **arrive without motion** — the rhythm of restraint vs. event is the point.

**Reduced motion:** M1 (lens push) becomes a discrete 3-step crossfade between keyframes. M3 (string resonance) is replaced with a single 200ms opacity pulse. M2, M4, M6 fall back to instant reveal. M5 displays end values immediately.

---

## 5. Scene-by-scene composition

The page has **one** persistent layer (the pinned soundboard image) plus **8 scenes** of foreground copy. Total scroll length is ~600vh (current page is ~480vh). The pinned region is everything from scene 1 through scene 6 (~480vh of pinned scroll); scenes 7 and 8 release the pin and scroll normally.

### Scene 1 — Hero (0–100vh)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ─── CHAPTER I · SINCE 1927                                │
│                                                            │
│                                                            │
│    Crafting                                                │
│    Inspiration   ← italic, on its own line, smaller        │
│                                                            │
│                                                            │
│    Three generations.                                      │
│    Nearly a century of innovation.                         │
│    One uncompromising standard.                            │
│                                                            │
│    [ Our Story ]   Explore Pianos →                        │
│                                                            │
│                                                            │
│                                          [scroll  │  ↓ ]   │
└────────────────────────────────────────────────────────────┘
   Pinned image: soundboard photo, 100% opacity, scale 1.0
   Image crop: wide shot of full piano interior
   Image position: hero photo (the pianist) cross-dissolves
                   to technology photo (soundboard) over
                   100vh — by the end of scene 1 the
                   soundboard is in place for the pinned ride
```

Description: Hero copy lives in the **lower-left third** (not the left-50% column the current design uses). The headline is bigger and breaks "Crafting / Inspiration" so only "Inspiration" is italic — currently both words are upright. The two CTAs are stacked closer; the outline button drops its border and becomes a text link with an arrow (`Explore Pianos →`), so the primary red CTA is the only "button-shaped" object on the page. Motion: M6 ink reveal on the headline (staggered word-by-word); the chapter eyebrow strikes on with a left-to-right gold rule.

### Scene 2 — Manifesto (100–200vh)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│           ─── CHAPTER II · A FOUNDING BELIEF               │
│                                                            │
│                                                            │
│    Since 1927, three generations                           │
│    of the Kawai family have dedicated                      │
│    their lives to crafting inspiration                     │
│    through innovative piano technology,                    │
│    scientific research, and an                             │
│    unwavering commitment to quality.                       │
│                                                            │
│                                                            │
│           ── KOICHI KAWAI, FOUNDING PRINCIPLE              │
│                                                            │
└────────────────────────────────────────────────────────────┘
   Pinned image: soundboard, scale 1.4
   Image crop: zooming into the harp + cast iron plate
   Image position: shifted to the right edge so type breathes
                   on the left
```

Description: The italic quote sets **flush-left, ragged-right** (not centered as it is now). The oversized gold quote glyph is removed; instead, a thin gold rule sits above the eyebrow and the attribution sits below. The pinned image has zoomed in by 40% — the viewer should *feel* the camera moving even though they don't consciously notice it. The watermark wordmark is removed entirely — the piano photograph itself is the visual interest. Motion: M6 ink reveal, one phrase at a time on scroll.

### Scene 3 — Stats / "By the numbers" (200–280vh)

```
┌────────────────────────────────────────────────────────────┐
│  ─── CHAPTER III · BY THE NUMBERS                          │
│                                                            │
│                                                            │
│   1927       2.4M+      50+      61+        3              │
│   ─────      ─────     ─────    ─────      ───             │
│   FOUNDED    PIANOS    AWARDS   COMPETITION GENERATIONS    │
│              BUILT              VICTORIES                  │
│                                                            │
│                                                            │
│                              │ ←  red 1px playhead         │
│                              │    (full viewport height)   │
└────────────────────────────────────────────────────────────┘
   Pinned image: soundboard, scale 2.0
   Image crop: tight on the bass strings — gold dominates frame
   Image opacity: 30% (faded back so numerals read clearly)
```

Description: Stats are arranged on a **single horizontal baseline** like a film credit roll, separated by tabular spacing rather than vertical rules. The numerals strike up (M5) as the scene enters, then the gold underline draws beneath each, then the labels appear. The current 2-row stacking on desktop becomes a single decisive row. On mobile, stats stack vertically and the playhead becomes a horizontal line instead. **The "3 Generations" stat is no longer awkwardly orphaned** — it sits at the right end of the row, balanced against "1927" on the left, framing the other three numbers between them.

### Scene 4 — Heritage / Koichi Kawai (280–360vh)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                  ─── CHAPTER IV · ORIGIN                   │
│                                                            │
│                                                            │
│                  A Family                                  │
│                  Legacy of                                 │
│                  Craft                                     │
│                                                            │
│                                                            │
│                  In 1927, Koichi Kawai —                   │
│                  a gifted inventor and                     │
│                  former apprentice to                      │
│                  Torakusu Yamaha — founded                 │
│                  Kawai with a singular belief …            │
│                                                            │
│                  → Meet our founder, Koichi Kawai          │
│                  → Our philosophy                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
   Pinned image: scale 2.4, position shifted UP into top 60%
                 of viewport; bottom 40% is a clean
                 kawai-pearl matte where the type sits
   Image crop: single string + tuning pin, gold dominant
   Background of bottom matte: kawai-pearl (first light)
```

Description: The current design puts a photo of a man at an upright next to body copy in two columns. The new design **drops that secondary photo entirely** — the pinned soundboard *is* the heritage image, and the bottom of the viewport is a clean pearl-colored matte where the typography lives. This is the visual moment of "first light" — pearl bottom-matte appears for the first time after three scenes of black. The "Established 1927" plate (currently a black overlay tag) becomes a single line of caption type at the top of the matte: `EST. 1927  ·  HAMAMATSU, JAPAN`.

### Scene 5 — Timeline / "A Legacy of Innovation" (360–520vh)

```
┌────────────────────────────────────────────────────────────┐
│  ─── CHAPTER V · 1927 → 2024                               │
│                                                            │
│                                                            │
│                              │           1927              │
│                              │           ────              │
│                              │           FOUNDATION        │
│                              │           Koichi Kawai...   │
│                              │                             │
│                              │                             │
│         (years scroll        │           1955              │
│          past a fixed        │           ────              │
│          red playhead at     │           SECOND GEN.       │
│          50vh — the line     │           Shigeru Kawai...  │
│          is the only red     │                             │
│          on the page)        │                             │
│                              │           1971              │
│                              │           ────              │
│                              │           ABS TECHNOLOGY    │
│                              │                             │
│                              │           ...               │
└────────────────────────────────────────────────────────────┘
   Pinned image: scale 2.8 → 3.2 across the scene
   Image crop: a SINGLE string — frame is mostly gold
   Background: linear gradient from kawai-pearl at scene
               start to kawai-black at scene end
               (the timeline is a sunset)
   The playhead red line sits at exactly 50vh and
   does not move; the year cards move past it.
```

Description: This is the page's centerpiece. The current vertical timeline (small red dots, evenly-spaced year labels, body copy below each) is replaced by a **horizontal playhead model**: the red 1px line is fixed at 50% viewport height, and the year cards scroll *through* the viewport from bottom to top. As each year crosses the playhead, M4 fires — the digits roll up, the gold rule strikes, the body copy ink-reveals. Years that have not yet crossed are dimmed to 40% opacity; years that have crossed remain at 100% but desaturate slightly to indicate "past." This makes the timeline feel *scrubbed*, like a video editor's playhead. The background **literally darkens** as years progress — 1927 sits on pearl, 1955 on bone, 1971 on stone-grey, 1989 on charcoal, 2002 on near-black, 2024 on full black. The viewer arrives at scene 6 (Technology) already in the dark.

### Scene 6 — Technology / "Engineered by Science" (520–600vh)

```
┌────────────────────────────────────────────────────────────┐
│  ─── CHAPTER VI · INNOVATION                               │
│                                                            │
│                                                            │
│    Engineered                                              │
│    by Science                                              │
│                                                            │
│                                                            │
│    Kawai has never treated piano-making                    │
│    as tradition alone. From the                            │
│    introduction of  [ABS composite actions]                │
│    in 1971 to today's  [ABS-Carbon]  and                   │
│    [Millennium III]  mechanisms, our                       │
│    advances are proven in the laboratory                   │
│    and felt under the fingers. The same                    │
│    research drives  [Progressive Harmonic                  │
│    Imaging] , bringing the voice of our                    │
│    concert grands into every digital                       │
│    instrument we make.                                     │
│                                                            │
│    Explore our technology →                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
   Pinned image: scale 3.4, pulling back slightly
   Image crop: a HAND at the keys — the camera has dollied
               around to show the player's perspective
   The pinned image is at this point shifted to the upper
   right; the body copy lives left, getting room to breathe
   The four bracketed phrases are gold call-out tags
   (display: inline-block; padding: 2px 8px; border: 1px
   solid kawai-gold; tabular-nums on years inside them)
```

Description: The current side-by-side image + text becomes a left-aligned body block with **gold-bordered inline call-out tags** for the technology names. This is the only scene where the body copy has visible decorative ornaments inside it — and it works because the eye has been resting on uninterrupted serif for five scenes. The pinned image quietly resolves to "hand at keys" — the camera has completed its journey through the instrument and arrived at the player. M3 (string resonance) fires once when this scene enters viewport, on a single SVG line element overlaid on the photo, then never again.

### Scene 7 — Go Deeper (Access Grid) (600–680vh, pin released)

```
┌────────────────────────────────────────────────────────────┐
│  ─── CHAPTER VII · GO DEEPER                               │
│                                                            │
│                                                            │
│    ─────────────────────────────────────────────────       │
│    01                              02                      │
│                                                            │
│    Awards &                        Institutions            │
│    Recognition                     & Owners                │
│                                                            │
│    More than 50 international      Universities,           │
│    awards for product design       conservatories,         │
│    and service excellence.         and concert halls       │
│                                    worldwide perform       │
│    → View our awards               on Kawai.               │
│    → The Winner's Choice                                   │
│                                    → Distinguished owners  │
│                                    → The EPIC program      │
│    ─────────────────────────────────────────────────       │
└────────────────────────────────────────────────────────────┘
   Background: #0a0908 (deeper than black)
   No image. This is the page's only "rest" scene — a
   typographic palate cleanser before the CTA.
   Cards are not cards — they are two columns separated
   by a single 1px gold vertical rule.
```

Description: The current design wraps these in two rounded white cards on pearl. The new design **removes the card shells entirely** — Access Grid is just two columns of typography on dark, divided by a gold hairline. The numerals "01" and "02" are oversized (tabular, gold), serving as section anchors. Hovering a link draws a 1px red underline beneath the arrow — the only place red appears outside the timeline playhead and the CTA button.

### Scene 8 — Final CTA (680–800vh)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                Experience                                  │
│                97 Years of                                 │
│                Innovation.                                 │
│                                                            │
│                Discover how Kawai's legacy of              │
│                craftsmanship and innovation can            │
│                shape your musical journey.                 │
│                                                            │
│                                                            │
│                [ Explore Pianos ]   Find a Dealer →        │
│                                                            │
│                                                            │
│                ─── KAWAI · SINCE 1927                      │
│                                                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
   Background: kawai-black at top of scene, fading to a
               warm amber-pearl glow (#f3e9d6 → kawai-pearl)
               behind the CTA buttons. The page ends with
               first light, mirroring scene 4's "first light"
               moment.
   No image. The pinned media has been released; the
   photograph's last frame (hand at keys) was the climax
   in scene 6, and the rest of the page is type only.
   "Experience" is italic — third and final italic on page.
```

Description: The current CTA has a photo background with two heavy overlays. The new design **drops the photo** and instead uses a slow background-color animation (M1's continuous easing, scroll-bound) from black to a warm pearl glow as the viewer scrolls in. The primary "Explore Pianos" button is the only solid red on the page. The secondary "Find a Dealer" becomes a text link with arrow, matching the hero's treatment. A final chapter eyebrow closes the film: `KAWAI · SINCE 1927`.

---

## 6. The pinned media — keyframe interpolation

**One image, one continuous camera move.** The pinned media is `aboutImages.technology` — the overhead soundboard shot. It is the strongest image in the set and the only one with enough detail to survive a 3.4× zoom. The hero photo (pianist) and heritage photo (upright) are *not* pinned; they appear only as bookend frames at scroll progress 0 and 1.

| Scroll progress | Scene | Image | Scale | Translate X / Y | Object position | Filter | Opacity |
|---|---|---|---|---|---|---|---|
| 0.00 | Hero start | `aboutImages.hero` (pianist, dark) | 1.06 → 1.00 (settle) | 0, 0 | center center | none | 1.0 |
| 0.08 | Hero → Manifesto crossfade | hero fades out, `technology` fades in | technology starts at 1.0 | 0, 0 | center center | none | crossfade 1.0 → 0.0 / 0.0 → 1.0 |
| 0.15 | Manifesto | `technology` | 1.4 | -8%, 0 | 60% 50% (shifted toward right side of frame) | none | 1.0 |
| 0.28 | Stats | `technology` | 2.0 | -4%, -4% | 40% 60% (now showing bass strings, lower-left of original) | `brightness(0.7)` | 1.0 (numerals overlaid) |
| 0.40 | Heritage matte | `technology` | 2.4 | 0%, -28% (image pushed UP so bottom 40vh is clean pearl matte) | 50% 35% (tight on a single tuning pin + string) | none | 1.0 in upper 60vh, 0.0 below |
| 0.55 | Timeline mid (1971 = ABS year) | `technology` | 2.8 | 4%, -16% | 30% 50% (one isolated string fills frame — M3 string resonance fires HERE) | `brightness(0.85)` | 1.0 fading to 0.4 by end of timeline (sunset) |
| 0.70 | Technology scene start | `technology` | 3.2 | 8%, -8% | 25% 50% | none | 1.0 |
| 0.85 | Technology scene end | crossfade `technology` → `aboutImages.heritage` (pianist's hands at keys — actually the heritage photo, repurposed) | heritage starts at 1.2 | 0, 0 | center 40% (top of frame: hands and keys) | none | crossfade |
| 1.00 | Pin release | `aboutImages.heritage` | 1.0 | 0, 0 | center center | none | 1.0 (then unpinned and scrolled away) |

**Implementation note:** This is **two** crossfades (hero → technology at progress 0.08; technology → heritage at progress 0.85) bookending **one** continuous transform on the soundboard image. The transforms (scale, translate, object-position) are all driven by `useTransform(scrollYProgress, [0, 1], [start, end])` mappings that share the same easing curve (M1, smooth ease-in-out). A second `framer-motion` `MotionValue` drives the brightness filter independently because it does not run linearly — it dips at the stats scene and recovers.

**Critical:** `object-position` is animatable in CSS but Framer Motion does not transition the shorthand directly. Implementation must split into `--object-x` and `--object-y` CSS custom properties on the parent and reference them inside `objectPosition: 'var(--object-x) var(--object-y)'` on the `<Image>` element, then animate the custom properties via `motion.div` `style={{ "--object-x": objX }}`.

**Reduced motion fallback:** Instead of continuous transform, switch the image at 3 discrete checkpoints (progress 0.0, 0.5, 1.0) using opacity crossfade only. Scale stays at 1.0 throughout.

---

## 7. Three "money moments"

The three moments visitors will remember. Each is a small piece of code, not the full scene — these are the *signature shots* of the film.

### Money Moment 1 — The Lens Push (continuous, drives the entire pinned region)

The page's defining gesture. A camera slowly dollying into the soundboard for ~480vh of scroll. It looks effortless because it is one transform driven by one scroll value — but the lens has to feel *mechanical*, like a film camera on rails, not like a CSS animation. The smooth ease-in-out curve makes it feel inevitable.

```tsx
// .tmp/about-redesign/sketches/MoneyMoment1_LensPush.tsx
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export function PinnedSoundboard({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // M1 lens-push: continuous, ease-in-out feel from the curve itself
  const scale  = useTransform(scrollYProgress, [0, 1], [1.0, 3.4])
  const y      = useTransform(scrollYProgress, [0, 0.4, 1], ['0%', '-28%', '-8%'])
  const objX   = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], ['50%', '40%', '25%', '50%'])
  const objY   = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], ['50%', '35%', '50%', '40%'])
  const bright = useTransform(scrollYProgress, [0, 0.28, 0.55, 1], [1, 0.7, 0.85, 1])

  return (
    <div ref={ref} className="relative h-[600vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-kawai-black">
        <motion.div
          className="absolute inset-0"
          style={{ scale, y, filter: useTransform(bright, (b) => `brightness(${b})`) }}
        >
          <motion.div className="absolute inset-0" style={{ '--ox': objX, '--oy': objY } as any}>
            <Image src={src} alt="" fill priority sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'var(--ox) var(--oy)' }} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
```

### Money Moment 2 — The Year Playhead Strike (Timeline)

A 1px red vertical line, fixed at 50% viewport height. As each year card scrolls upward through the viewport, the moment its baseline crosses the line, the year's digits roll up like an old split-flap display, a gold underline strikes left-to-right, and the body copy ink-reveals. Six times. It's the page's only moment of repetition, and the repetition is the point — the viewer learns the rhythm and starts anticipating the next strike.

```tsx
// .tmp/about-redesign/sketches/MoneyMoment2_PlayheadStrike.tsx
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export function YearCard({ year, title, description }: { year: string; title: string; description: string }) {
  const ref = useRef<HTMLLIElement>(null)
  // Track when this card's center crosses 50vh
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'start 40%'] })
  // 0 → 1 over the moment of crossing the playhead
  const struck = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])

  // Gold underline draws left-to-right as struck advances
  const underlineX = useTransform(struck, [0, 1], ['-100%', '0%'])

  return (
    <li ref={ref} className="relative h-[100vh] flex flex-col justify-center">
      <div className="font-[family-name:var(--font-brand-serif)] text-[9rem] leading-none tabular-nums">
        {year.split('').map((d, i) => (
          <span key={i} className="inline-block overflow-hidden align-baseline" style={{ height: '0.86em' }}>
            <motion.span className="block" style={{ y: useTransform(struck, [0, 1], ['100%', '0%']) }}>{d}</motion.span>
          </span>
        ))}
      </div>
      <motion.div className="h-px bg-kawai-gold origin-left mt-3" style={{ scaleX: useTransform(struck, [0,1], [0,1]) }} />
      <motion.p style={{ opacity: struck, clipPath: useTransform(struck, [0,1], ['inset(0 100% 0 0)','inset(0 0 0 0)']) }}
        className="mt-6 max-w-[38ch] text-kawai-charcoal">
        <span className="block text-[0.6875rem] tracking-[0.32em] uppercase mb-2">{title}</span>
        {description}
      </motion.p>
    </li>
  )
}
```

### Money Moment 3 — String Resonance (mid-timeline, scene transition)

A single SVG horizontal line — one string — is overlaid on the pinned image at scroll progress 0.55 (which corresponds to the 1971 "ABS Technology Revolution" year, intentionally). When triggered once, it oscillates with an under-damped spring — like a string being plucked. The photo beneath gets a brief gaussian blur pulse, like the eye refocusing. This is the literal "single string vibrating" beat the concept calls for. It fires *exactly once*; the under-damped spring with `mass: 0.4` makes it visibly oscillate before settling.

```tsx
// .tmp/about-redesign/sketches/MoneyMoment3_StringResonance.tsx
'use client'
import { useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

export function StringResonance() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const [plucked, setPlucked] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!plucked && v > 0.5 && v < 0.6) setPlucked(true)
  })

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 1000 4" className="w-[80vw] h-1 overflow-visible">
        <motion.line
          x1="0" y1="2" x2="1000" y2="2"
          stroke="#d5c78c" strokeWidth="1"
          animate={plucked ? { scaleY: [1, 1.6, 0.7, 1.2, 0.9, 1] } : {}}
          transition={{ type: 'spring', stiffness: 90, damping: 6, mass: 0.4 }}
          style={{ transformOrigin: '500px 2px', filter: 'drop-shadow(0 0 8px rgba(213,199,140,0.6))' }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 backdrop-blur-[2px]"
        animate={plucked ? { opacity: [0, 0.4, 0, 0.2, 0] } : {}}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />
    </div>
  )
}
```

---

## 8. What gets dropped, kept, transformed

### Dropped

- **`AboutManifesto`'s oversized gold quotation mark glyph** — replaced by a thin gold rule above the eyebrow.
- **`AboutManifesto`'s 5% wordmark watermark** — the pinned photograph is the visual interest; the watermark would compete.
- **`AboutManifesto`'s center-aligned quote** — quote becomes flush-left ragged-right.
- **`HeritageFeature`'s `1024-683-madx.webp` heritage photo** — replaced by a clean pearl-colored bottom matte beneath the pinned soundboard. The heritage photo is **repurposed** as the final pinned-region frame (hands at keys) in scene 6.
- **`AboutTimeline`'s red dot bullets** — replaced by the playhead crossing model. No bullets exist.
- **`AboutTimeline`'s vertical track line** — replaced by the horizontal red playhead at 50vh.
- **`AboutTimeline`'s small year-as-label treatment** — years become the protagonists (Display 1 size).
- **`TechnologyFeature`'s side-by-side image + text** — image is the pinned soundboard; text lives in a left-aligned matte. Gold call-out tags decorate technology terms inline.
- **`AccessGrid`'s rounded white cards on pearl** — replaced by two typographic columns on near-black, separated by a 1px gold rule.
- **`AccessGrid`'s 4px gold top edge and "01"/"02" indices in corner** — indices grow to oversized tabular numerals; the gold top edge becomes the section's vertical dividing rule.
- **`AboutCTA`'s `MS130_RGB_image_04.webp` photo background with double dark overlay** — replaced by a slow scroll-driven background gradient from black to warm pearl glow. The pinned media is already released by this scene.
- **The `Reveal` fade-up-24px helper component** — never used in the redesign. It is the source of the current page's monotony.

### Kept

- **All locked copy strings**, verbatim. The redesign moves them, breaks them onto different lines, italicizes specific words, and decorates specific phrases — but does not change them.
- **`Counter` component for stats** — it already animates correctly; we extend it with a gold tick underline animation.
- **Brand color tokens** — black, pearl, gold, red, charcoal. No new colors are introduced. The redesign uses these *more strictly*, not differently.
- **`font-[family-name:var(--font-brand-serif)]` for all display type.** No font additions.
- **The chapter/section numbering pattern** (the current `SectionEyebrow` becomes "CHAPTER I", "CHAPTER II", etc.).
- **The two anchor CTAs in the hero** ("Our Story" + "Explore Pianos") and the two anchor CTAs in the final scene ("Explore Pianos" + "Find a Dealer") — but the secondary in each pair becomes a text link with arrow, not a filled outline button.
- **`AboutTimeline`'s 6 events with their full body copy** — repositioned, not rewritten.

### Transformed

- **8 sections → 1 continuous pinned region + 2 unpinned closing scenes.** Scenes 1 through 6 share one sticky media layer. Scenes 7 and 8 are typographic only.
- **`AboutStats` 5 statistics** transform from a two-row grid into a single horizontal "credit roll" baseline. Same 5 numbers; new arrangement.
- **`HeritageFeature` + Scene 4 matte design** — heritage copy moves into a clean pearl-colored bottom matte beneath the pinned image, eliminating the secondary photo and the founding-year plate.
- **`AboutTimeline`'s scroll-bound vertical line** transforms into a fixed red playhead at 50vh that years pass through.
- **`TechnologyFeature` tech terms** — "ABS composite actions", "ABS-Carbon", "Millennium III", "Progressive Harmonic Imaging" become gold-bordered inline call-out tags. The body copy stays verbatim; only those four phrases get the tag treatment.
- **`AccessGrid` two cards** transform into two typographic columns on dark, separated by a gold hairline. The "01"/"02" indices grow to Display-2-sized tabular numerals.
- **`AboutCTA` background photo** transforms into a scroll-driven black → warm-pearl background animation — the page ends with first light, mirroring scene 4.

---

## 9. Implementation notes (for whoever builds this)

- Pinned region is `position: sticky; top: 0; height: 100vh;` on the media layer, sitting inside a `height: 600vh` parent. Scene content layers above it with `mix-blend-mode: normal` and `pointer-events: none` on the pinned image.
- **Do not use `force-dynamic`**. ISR with `revalidate = 3600` (already set) is correct.
- The pinned image is `priority` and `sizes="100vw"`; the secondary heritage photo (used only at progress 0.85+) loads with `loading="lazy"`.
- Scroll progress is driven by **one** parent `useScroll` and distributed via context to child scenes — do not create 8 separate `useScroll` hooks on the same target, that's a measurable perf cost on mobile.
- All copy mattes (the rectangular cutouts) are non-blurred, opaque, `kawai-pearl` or `kawai-black` solid fills. Backdrop-blur on a full-bleed sticky background tanks Safari frame rate; we use solid mattes instead, and the design accommodates that by giving copy clean rectangular zones.
- The page is approximately **600vh on desktop, 800vh on mobile** (mobile scenes need more scroll because viewport is shorter and motions need time to read).
- `prefers-reduced-motion` shortcuts are spec'd inline above per motion; the page must remain navigable and beautiful without any of the six motions.
- Lighthouse target: LCP < 2.5s on a fast 4G connection. The hero photo (`aboutImages.hero`) is the LCP candidate and must be `priority`. The pinned soundboard image starts at opacity 0 and is *not* the LCP.

---

## 10. What success looks like

When the user scrolls this page, they should feel like the camera is doing the work, not the CSS. The current page is exhausting because every scene says "look at me, I am here" with a fade-up. The new page says "follow me through this instrument" — and the viewer is the one moving, the page is the one steady. The headline "Crafting Inspiration" is no longer just a title; by the time the viewer reaches the final CTA, they have *experienced* one continuous craft demonstration. That's the brief.
