'use client'

/* eslint-disable @next/next/no-img-element -- faithful campaign port: decorative
   imagery uses intrinsic aspect ratios + CSS backgrounds, not the next/image pipeline. */

import { useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * CX Line landing page — self-contained "ebony + copper" campaign experience.
 *
 * Ported from the standalone marketing mockup. Differences from the static HTML:
 *  - Tailwind v2 CDN dropped; layout utilities resolve from the project's v4 build.
 *  - Custom theme tokens + classes live in ./cx.css scoped under `.cx-page`.
 *  - GSAP + ScrollTrigger are imported from the npm dep (not cdnjs) so they pass CSP.
 *  - Tab switching is React state; CTAs link to product pages and /find-a-dealer.
 *  - The YouTube hero background + SK-EX demo use the IFrame API (already CSP-allowed).
 */

const HERO_START = 21
const HERO_END = 32

type CxTab = 'cx202' | 'cx102'

export function CxLanding() {
  const [tab, setTab] = useState<CxTab>('cx202')
  const rootRef = useRef<HTMLDivElement>(null)

  // ---- GSAP entrance + scroll reveals ----
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let ctx: { revert: () => void } | null = null
    let cancelled = false

    ;(async () => {
      try {
        const gsapMod = await import('gsap')
        const stMod = await import('gsap/ScrollTrigger')
        if (cancelled) return
        const gsap = gsapMod.default ?? gsapMod
        const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          // Hero entrance
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.to('.string', { scaleX: 1, duration: 1.4, stagger: 0.12, ease: 'power2.inOut' })
            .from('#cxHeroEyebrow', { opacity: 0, y: 14, duration: 0.7 }, '-=.7')
            .from('[data-hero-line]', { opacity: 0, y: 40, duration: 0.9, stagger: 0.15 }, '-=.4')
            .from('#cxScrollCue', { opacity: 0, duration: 0.8 }, '-=.3')

          // Strings: subtle idle vibration
          gsap.utils.toArray<HTMLElement>('.string').forEach((s, i) => {
            gsap.to(s, {
              y: i % 2 ? 6 : -6,
              duration: 2.4 + i * 0.4,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            })
          })

          // Scroll reveals
          gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%' },
            })
          })

          // 1927 parallax
          gsap.to('#cxYearParallax', {
            y: -80,
            ease: 'none',
            scrollTrigger: { trigger: '#cx-story', start: 'top bottom', end: 'bottom top', scrub: true },
          })
        }, root)
      } catch {
        // If GSAP fails to load, reveal everything so no content stays hidden.
        root.querySelectorAll<HTMLElement>('[data-reveal],[data-hero-line]').forEach((el) => {
          el.style.opacity = '1'
          el.style.transform = 'none'
        })
        root.querySelectorAll<HTMLElement>('.string').forEach((el) => {
          el.style.transform = 'scaleX(1)'
        })
      }
    })()
    // Note: prefers-reduced-motion is handled in cx.css (forces [data-reveal] visible).

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  // ---- YouTube hero background loop + SK-EX listen demo ----
  useEffect(() => {
    type YTPlayer = {
      playVideo: () => void
      seekTo: (s: number, allow: boolean) => void
      getCurrentTime?: () => number
      getPlayerState?: () => number
      destroy?: () => void
    }
    const w = window as unknown as {
      YT?: { Player: new (id: string, opts: unknown) => YTPlayer; PlayerState: { ENDED: number } }
      onYouTubeIframeAPIReady?: () => void
    }

    let heroPlayer: YTPlayer | null = null
    let listenPlayer: YTPlayer | null = null
    let listenReady = false
    let poll: ReturnType<typeof setInterval> | null = null

    function build() {
      if (!w.YT) return
      heroPlayer = new w.YT.Player('cxYtPlayer', {
        videoId: 'OH2UhpNyGY8',
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0,
          iv_load_policy: 3, loop: 1, modestbranding: 1, playsinline: 1,
          rel: 0, start: HERO_START, end: HERO_END,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.playVideo()
            e.target.seekTo(HERO_START, true)
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === w.YT?.PlayerState.ENDED || e.data === 2) {
              heroPlayer?.seekTo(HERO_START, true)
              heroPlayer?.playVideo()
            }
          },
        },
      })

      listenPlayer = new w.YT.Player('cxListenPlayer', {
        videoId: '-J6DZQtLo1Q',
        playerVars: {
          autoplay: 0, controls: 1, disablekb: 0, fs: 1,
          iv_load_policy: 3, modestbranding: 1, playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => { listenReady = true },
          onStateChange: (e: { data: number }) => {
            if (e.data === w.YT?.PlayerState.ENDED) {
              listenPlayer?.seekTo(0, true)
              listenPlayer?.playVideo()
            }
          },
        },
      })

      poll = setInterval(() => {
        if (heroPlayer?.getCurrentTime && heroPlayer.getCurrentTime() >= HERO_END - 0.15) {
          heroPlayer.seekTo(HERO_START, true)
        }
      }, 200)
    }

    // The API calls this global once loaded.
    const prev = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => { prev?.(); build() }

    if (w.YT?.Player) {
      build()
    } else if (!document.getElementById('cx-yt-api')) {
      const tag = document.createElement('script')
      tag.id = 'cx-yt-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }

    const poster = document.getElementById('cxListenPoster')
    const onPosterClick = () => {
      if (listenReady && listenPlayer) {
        listenPlayer.seekTo(0, true)
        listenPlayer.playVideo()
        if (poster) poster.style.display = 'none'
      }
    }
    poster?.addEventListener('click', onPosterClick)

    return () => {
      if (poll) clearInterval(poll)
      poster?.removeEventListener('click', onPosterClick)
      heroPlayer?.destroy?.()
      listenPlayer?.destroy?.()
    }
  }, [])

  const tabBtn = (id: CxTab): CSSProperties => ({
    color: tab === id ? 'var(--copper)' : 'var(--ivory-dim)',
    borderBottomColor: tab === id ? 'var(--copper)' : 'transparent',
  })

  return (
    <div ref={rootRef} className="cx-page">
      {/* ============ NAV ============ */}
      <header
        className="fixed top-0 left-0 w-full z-40"
        style={{
          background: 'rgba(11,11,14,.82)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--ebony-line)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline space-x-3">
            <span className="font-display text-2xl tracking-widest">
              <img src="/images/cx/logo.svg" alt="Kawai" />
            </span>
            <span className="text-dim text-xs tracking-widest hidden sm:inline">EST. 1927</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase text-dim">
            <a href="#cx-story" className="hover:text-copper">Our Story</a>
            <a href="#cx-why" className="hover:text-copper">Craft</a>
            <a href="#cx-models" className="hover:text-copper">CX Line</a>
            <a href="#cx-dealer" className="btn-red" style={{ padding: '10px 22px' }}>Find a Dealer</a>
          </nav>
        </div>
      </header>

      {/* ============ 1. HERO ============ */}
      <section id="cx-hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          id="cxYtBgWrap"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}
        >
          <div
            id="cxYtPlayer"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '177.78vh',
              height: '100vh',
              minWidth: '100vw',
              minHeight: '56.25vw',
              transform: 'translate(-50%,-50%)',
            }}
          />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'linear-gradient(to bottom, rgba(11,11,14,.35) 0%, rgba(11,11,14,.55) 40%, rgba(11,11,14,.80) 100%)',
          }}
        />

        <div className="absolute inset-0" style={{ zIndex: 2 }} aria-hidden="true">
          <div className="string" style={{ top: '22%' }} />
          <div className="string" style={{ top: '36%' }} />
          <div className="string" style={{ top: '52%' }} />
          <div className="string" style={{ top: '68%' }} />
          <div className="string" style={{ top: '82%' }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24" style={{ zIndex: 3 }}>
          <p className="eyebrow mb-8" id="cxHeroEyebrow">Hamamatsu, Japan — Since 1927</p>
          <h1 className="font-display text-ivory" style={{ fontSize: 'clamp(40px,7.5vw,96px)', lineHeight: 1.04 }}>
            <span className="block" data-hero-line>The Piano Maker&apos;s</span>
            <span className="block" data-hero-line>
              <em className="text-copper not-italic" style={{ fontStyle: 'italic' }}>Digital Piano.</em>
            </span>
          </h1>
          <p className="text-dim mt-8 text-base md:text-lg max-w-2xl mx-auto leading-relaxed" data-hero-line>
            For nearly a century, Kawai has built concert grand pianos by hand. The new CX Line puts everything
            we&apos;ve learned under your fingers — for less than you&apos;d expect.
          </p>
          <div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center sm:space-x-5 space-y-4 sm:space-y-0"
            data-hero-line
          >
            <a href="#cx-story" className="btn-copper">Discover the Story</a>
            <a href="#cx-models" className="btn-ghost">See the CX Line</a>
          </div>
        </div>

        <div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-dim text-xs tracking-widest uppercase"
          style={{ zIndex: 3 }}
          id="cxScrollCue"
        >
          Scroll
          <div
            className="mx-auto mt-3"
            style={{ width: 1, height: 48, background: 'linear-gradient(var(--copper),transparent)' }}
          />
        </div>
      </section>

      {/* ============ 2. BRAND STORY ============ */}
      <section id="cx-story" className="relative py-32 md:py-44 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="font-display year-giant" id="cxYearParallax">19<span>27</span></div>
          </div>
          <div>
            <p className="eyebrow mb-6" data-reveal>Our Story</p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight" data-reveal>
              Before we made a single digital piano,<br />we spent a century making pianos.
            </h2>
            <p className="text-dim mt-8 leading-relaxed" data-reveal>
              In 1927, Koichi Kawai began building pianos in Hamamatsu, Japan. Today, Kawai grand pianos stand on the
              world&apos;s most demanding concert stages — and our craftsmen still voice each instrument by hand,
              hammer by hammer.
            </p>
            <p className="text-dim mt-5 leading-relaxed" data-reveal>
              Our legacy in acoustic pianos is why we can pursue the ultimate feel in digital instruments. Here is the
              meticulous touch that only those who truly know the <em className="text-copper">&quot;real thing&quot;</em>{' '}
              could achieve.
            </p>
          </div>
        </div>
      </section>

      <div className="hairline max-w-7xl mx-auto" />

      {/* ============ 3. WHY A PIANO MAKER'S DIGITAL ============ */}
      <section id="cx-why" className="py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="eyebrow mb-6" data-reveal>The Difference</p>
          <h2 className="font-display text-3xl md:text-5xl max-w-3xl leading-tight" data-reveal>
            What changes when a piano maker builds a digital piano?
          </h2>

          <div className="grid md:grid-cols-3 gap-px mt-20" style={{ background: 'var(--ebony-line)' }}>
            <div className="bg-ebony-soft p-10 md:p-12" data-reveal>
              <div className="text-red font-num text-sm tracking-widest mb-6">TOUCH</div>
              <h3 className="font-display text-2xl mb-4">The feel of a grand piano</h3>
              <p className="text-dim leading-relaxed text-sm">
                The Responsive Hammer action in the CX Line is engineered from the same principles as our grand piano
                actions — graded weight from bass to treble, and the subtle resistance your fingers expect from a real
                instrument.
              </p>
            </div>
            <div className="bg-ebony-soft p-10 md:p-12" data-reveal>
              <div className="text-red font-num text-sm tracking-widest mb-6">TONE</div>
              <h3 className="font-display text-2xl mb-4">The voice of our concert grand</h3>
              <p className="text-dim leading-relaxed text-sm">
                Every note is sampled from the Shigeru Kawai SK-EX — the handcrafted concert grand chosen by pianists at
                the world&apos;s leading competitions.
              </p>
            </div>
            <div className="bg-ebony-soft p-10 md:p-12" data-reveal>
              <div className="text-red font-num text-sm tracking-widest mb-6">VOICING</div>
              <h3 className="font-display text-2xl mb-4">Tuned by human ears</h3>
              <p className="text-dim leading-relaxed text-sm">
                Our Master Piano Artisans — the same craftsmen who voice our acoustic instruments — fine-tune the
                response of every digital model. Spec sheets can&apos;t capture it. Your hands will.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LISTEN: Hear the SK-EX ============ */}
      <section id="cx-listen" className="py-16 bg-ebony-soft" style={{ borderTop: '1px solid var(--ebony-line)' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="eyebrow mb-6" data-reveal>Hear It</p>
          <div className="mt-14 mx-auto relative" style={{ maxWidth: 880 }} data-reveal>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', border: '1px solid var(--ebony-line)' }}>
              <div
                id="cxListenPoster"
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  cursor: 'pointer',
                  background: '#000 center/cover no-repeat',
                  backgroundImage: "url('https://img.youtube.com/vi/-J6DZQtLo1Q/maxresdefault.jpg')",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: '50%',
                    background: 'var(--brand-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 40px -8px rgba(225,25,34,.6)',
                    transition: 'transform .3s',
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 4 }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 18,
                    left: 0,
                    right: 0,
                    color: 'var(--ivory)',
                    fontSize: 12,
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                    opacity: 0.85,
                  }}
                >
                  ▶ Play sound demo
                </span>
              </div>
              <div id="cxListenPlayer" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            </div>
            <p className="text-dim text-xs mt-4" style={{ opacity: 0.7 }}>
              Shigeru Kawai SK-EX — performance excerpt
            </p>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT DEEP-DIVE: CX202 / CX102 ============ */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mt-32" id="cx-product-detail">
            <p className="eyebrow mb-6 text-center" data-reveal>Features</p>
            <div className="flex border-b" style={{ borderColor: 'var(--ebony-line)' }} data-reveal>
              <button
                className={`pd-tab px-8 py-4 text-xs tracking-widest uppercase ${tab === 'cx202' ? 'active' : ''}`}
                style={tabBtn('cx202')}
                onClick={() => setTab('cx202')}
              >
                CX202
              </button>
              <button
                className={`pd-tab px-8 py-4 text-xs tracking-widest uppercase ${tab === 'cx102' ? 'active' : ''}`}
                style={tabBtn('cx102')}
                onClick={() => setTab('cx102')}
              >
                CX102
              </button>
            </div>

            {/* ===== CX202 ===== */}
            <div className="pt-16" style={{ display: tab === 'cx202' ? 'block' : 'none' }}>
              <div className="w-full overflow-hidden mb-16" data-reveal>
                <img src="/images/cx/scene.jpg" alt="CX202" className="w-full object-cover" style={{ maxHeight: 520, objectPosition: 'center' }} />
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-start mb-20" data-reveal>
                <div>
                  <p className="eyebrow mb-4">CX202 — The Step Up</p>
                  <h3 className="font-display text-4xl md:text-5xl leading-tight">
                    An excellent introduction to Kawai digital piano quality
                  </h3>
                </div>
                <div>
                  <p className="text-dim leading-relaxed">
                    The CX202 offers aspiring pianists an accessible way to enjoy authentic piano touch and tone. Its
                    Responsive Hammer Compact II action and rich Shigeru Kawai SK-EX sounds make playing feel expressive
                    and natural. With Bluetooth® Audio and MIDI, USB connectivity for learning apps, and features that
                    support regular practice, the CX202 inspires musical growth at home.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center mb-20" data-reveal>
                <div><img src="/images/cx/rhcii.jpg" alt="CX202 Touch" className="w-full" loading="lazy" /></div>
                <div>
                  <div className="text-copper font-num text-xs tracking-widest uppercase mb-4">Touch</div>
                  <h4 className="font-display text-2xl md:text-3xl mb-5">Responsive Hammer Compact II keyboard action</h4>
                  <p className="text-dim leading-relaxed text-sm">
                    Developed to represent the distinctive touch of an acoustic grand piano, the RHCII&apos;s spring-less
                    mechanism and sturdy construction delivers consistent upward and downward motion. Improved cushioning
                    material reduces keyboard noise, resulting in a smooth, natural, and highly authentic playing
                    experience — with graded key weights from bass to treble.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center mb-20" data-reveal>
                <div className="md:order-2"><img src="/images/cx/img_skex.jpg" alt="CX202 Sound" className="w-full" loading="lazy" /></div>
                <div className="md:order-1">
                  <div className="text-copper font-num text-xs tracking-widest uppercase mb-4">Sound</div>
                  <h4 className="font-display text-2xl md:text-3xl mb-5">Shigeru Kawai SK-EX concert grand</h4>
                  <p className="text-dim leading-relaxed text-sm">
                    Earning a reputation as the premier pianos of Japan, Shigeru Kawai instruments grace the stages of
                    concert halls throughout the world, prized for outstanding tonal clarity and exceptional dynamic
                    range. The CX202 reproduces the magnificent tone of the flagship SK-EX, hand-built by dedicated
                    craftsmen at the Shigeru Kawai R&amp;D Laboratory in Ryuyo, Japan.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center mb-20" data-reveal>
                <div><img src="/images/cx/score.jpg" alt="CX202 Features" className="w-full" loading="lazy" /></div>
                <div>
                  <div className="text-copper font-num text-xs tracking-widest uppercase mb-4">Features</div>
                  <h4 className="font-display text-2xl md:text-3xl mb-5">Connectivity &amp; learning tools</h4>
                  <ul className="text-dim text-sm space-y-3 leading-relaxed">
                    {[
                      'Bluetooth® MIDI & Audio for wireless connection to apps and speakers',
                      'Built-in Burgmüller, Czerny, Beyer & Alfred lesson songs',
                      'PianoRemote & PiaBookPlayer app support (iOS / Android)',
                      'Spatial Headphone Sound (SHS) — play at full volume with headphones, any time',
                      'Grand Feel Pedal System — damper, soft & sostenuto with half-pedal support',
                      '40W stereo speaker system with Low Volume Balance',
                    ].map((t) => (
                      <li className="flex gap-3" key={t}>
                        <span className="text-copper mt-1">—</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center mb-20" data-reveal>
                <div className="md:order-2"><img src="/images/cx/cx202color.jpg" alt="CX202 Design" className="w-full" loading="lazy" /></div>
                <div className="md:order-1">
                  <div className="text-copper font-num text-xs tracking-widest uppercase mb-4">Design</div>
                  <h4 className="font-display text-2xl md:text-3xl mb-5">Three finishes. One slim cabinet.</h4>
                  <p className="text-dim leading-relaxed text-sm mb-6">
                    At just over 40 cm in depth, the CX202 fits apartments and narrow spaces with ease. A retractable key
                    cover protects the keyboard, and a broad folding music rest keeps the top clean. Available in three
                    wood finishes:
                  </p>
                  <div className="flex gap-4 text-xs tracking-widest uppercase text-dim">
                    <span className="border px-3 py-2" style={{ borderColor: 'var(--ebony-line)' }}>Premium Rosewood</span>
                    <span className="border px-3 py-2" style={{ borderColor: 'var(--ebony-line)' }}>Satin Black</span>
                    <span className="border px-3 py-2" style={{ borderColor: 'var(--ebony-line)' }}>Satin White</span>
                  </div>
                </div>
              </div>

              <div data-reveal>
                <div className="text-copper font-num text-xs tracking-widest uppercase mb-6">Specifications</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                      <CxSpec label="Keyboard" value="88 keys · Responsive Hammer Compact II · Grade-weighted · Triple sensor · Matte key surface" first />
                      <CxSpec label="Piano Sound" value="Harmonic Imaging (HI) · SK-EX Stereo sampling · 192 note maximum polyphony" />
                      <CxSpec label="Voices" value="17" num />
                      <CxSpec label="Output" value="40 W (20 W × 2)· 12cm x 2 speakers" num />
                      <CxSpec label="Pedals" value="Grand Feel Pedal System · Damper (half-pedal) / Soft / Sostenuto" />
                      <CxSpec label="Connectivity" value="USB-MIDI · Bluetooth MIDI (BLE) · Bluetooth Audio 5.2" />
                      <CxSpec label="Headphones" value={'1× ¼" + 1× ⅛" stereo · SHS spatial sound'} />
                      <CxSpec label="Dimensions" value={'53 3/4" × 16" × 33 2/3" · 81 1/2 lbs.'} num />
                      <CxSpec label="Finishes" value="Premium Rosewood · Premium Satin Black · Premium Satin White" />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ===== CX102 ===== */}
            <div className="pt-16" style={{ display: tab === 'cx102' ? 'block' : 'none' }}>
              <div className="w-full overflow-hidden mb-16" data-reveal>
                <img src="/images/cx/hero_cx102.jpg" alt="CX102" className="w-full object-cover" style={{ maxHeight: 520, objectPosition: 'center' }} loading="lazy" />
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-start mb-20" data-reveal>
                <div>
                  <p className="eyebrow mb-4">CX102 — The Essential</p>
                  <h3 className="font-display text-4xl md:text-5xl leading-tight">
                    The essential Kawai digital piano experience
                  </h3>
                </div>
                <div>
                  <p className="text-dim leading-relaxed">
                    The CX102 brings the same Responsive Hammer Compact II action and Shigeru Kawai SK-EX concert grand
                    sound as the CX202 — in a streamlined package that focuses on what matters most: the feel and tone of
                    a real piano.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center mb-20" data-reveal>
                <div><img src="/images/cx/rhcii.jpg" alt="CX102 Touch" className="w-full" loading="lazy" /></div>
                <div>
                  <div className="text-copper font-num text-xs tracking-widest uppercase mb-4">Touch</div>
                  <h4 className="font-display text-2xl md:text-3xl mb-5">Responsive Hammer Compact II keyboard action</h4>
                  <p className="text-dim leading-relaxed text-sm">
                    The same spring-less, grade-weighted, triple-sensor RHCII action found in the CX202 — delivering the
                    consistent, natural resistance your fingers expect from an acoustic grand piano, at a more accessible
                    price.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center mb-20" data-reveal>
                <div className="md:order-2"><img src="/images/cx/img_skex.jpg" alt="CX102 Sound" className="w-full" loading="lazy" /></div>
                <div className="md:order-1">
                  <div className="text-copper font-num text-xs tracking-widest uppercase mb-4">Sound</div>
                  <h4 className="font-display text-2xl md:text-3xl mb-5">Shigeru Kawai SK-EX concert grand</h4>
                  <p className="text-dim leading-relaxed text-sm">
                    The same SK-EX concert grand sampling at the heart of every CX Line piano. Full 88-key stereo sampling
                    with Harmonic Imaging technology delivers expressive, dynamic tone from pianissimo to fortissimo.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center mb-20" data-reveal>
                <div><img src="/images/cx/score.jpg" alt="CX102 Features" className="w-full" loading="lazy" /></div>
                <div>
                  <div className="text-copper font-num text-xs tracking-widest uppercase mb-4">Features</div>
                  <h4 className="font-display text-2xl md:text-3xl mb-5">Everything you need. Nothing you don&apos;t.</h4>
                  <ul className="text-dim text-sm space-y-3 leading-relaxed">
                    {[
                      'Bluetooth® MIDI for wireless connection to learning apps',
                      'Built-in lesson songs: Burgmüller, Czerny, Beyer & Alfred',
                      'PianoRemote app support (iOS / Android)',
                      'Spatial Headphone Sound (SHS)',
                      'Grand Feel Pedal System with half-pedal support',
                    ].map((t) => (
                      <li className="flex gap-3" key={t}>
                        <span className="text-copper mt-1">—</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div data-reveal>
                <div className="text-copper font-num text-xs tracking-widest uppercase mb-6">Specifications</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                      <CxSpec label="Keyboard" value="88 keys · Responsive Hammer Compact II · Grade-weighted · Matte key surface" first />
                      <CxSpec label="Piano Sound" value="Harmonic Imaging (HI) · SK-EX Stereo sampling · 192 note maximum polyphony" />
                      <CxSpec label="Voices" value="17" num />
                      <CxSpec label="Output" value="22 W (11 W × 2)· 12cm x 2 speakers" num />
                      <CxSpec label="Pedals" value="Grand Feel Pedal System · Damper (half-pedal) / Soft / Sostenuto" />
                      <CxSpec label="Connectivity" value="USB-MIDI · Bluetooth MIDI (BLE)" />
                      <CxSpec label="Headphones" value={'1× ¼" + 1× ⅛" stereo · SHS spatial sound'} />
                      <CxSpec label="Dimensions" value={'53 3/4" × 16" × 33 2/3" · 79 1/2 lbs.'} num />
                      <CxSpec label="Finishes" value="Embossed Black · Embossed White" />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CTA within product section */}
            <div
              className="mt-16 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ borderTop: '1px solid var(--ebony-line)' }}
              data-reveal
            >
              <p className="text-dim text-sm">
                Want a side-by-side comparison?{' '}
                <a
                  href="https://www.kawai-global.com/product_comparison/detail.php?n=cx202,cx102&ct=36"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-copper underline"
                >
                  Full spec comparison →
                </a>
              </p>
              <a href="#cx-dealer" className="btn-red">Find a Dealer Near You</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      <section
        className="relative overflow-hidden"
        style={{ borderTop: '1px solid var(--ebony-line)', borderBottom: '1px solid var(--ebony-line)' }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: '#000 center/cover no-repeat',
            backgroundImage: "url('/images/cx/social-chopin.jpg')",
            backgroundAttachment: 'fixed',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'linear-gradient(to bottom, rgba(11,11,14,.78) 0%, rgba(11,11,14,.62) 50%, rgba(11,11,14,.82) 100%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 text-center py-40 md:py-52" style={{ zIndex: 2 }}>
          <p className="eyebrow mb-10" data-reveal>Trusted Where Pianos Matter Most</p>
          <blockquote
            className="font-display text-2xl md:text-4xl leading-snug"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,.5)' }}
            data-reveal
          >
            &quot;Kawai pianos are chosen on the stages of the world&apos;s leading piano competitions, and in
            conservatories and teaching studios across the United States.&quot;
          </blockquote>
          <div
            className="flex flex-wrap justify-center items-center mt-14 text-xs tracking-widest uppercase"
            style={{ color: 'rgba(242,237,226,.85)' }}
            data-reveal
          >
            <span className="px-6 py-3">International Competitions</span>
            <span className="text-copper" aria-hidden="true">·</span>
            <span className="px-6 py-3">Music Conservatories</span>
            <span className="text-copper" aria-hidden="true">·</span>
            <span className="px-6 py-3">Piano Teachers Nationwide</span>
            <span className="text-copper" aria-hidden="true">·</span>
            <span className="px-6 py-3">Concert Halls Worldwide</span>
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS: CX102 / CX202 ============ */}
      <section id="cx-models" className="py-32 md:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <p className="eyebrow mb-6 text-center" data-reveal>The CX Line</p>
          <h2 className="font-display text-3xl md:text-5xl text-center leading-tight" data-reveal>
            Two ways in. One standard of craft.
          </h2>
          <p className="text-dim text-center mt-6 max-w-2xl mx-auto" data-reveal>
            Every CX Line piano shares the same grand-derived action and SK-EX concert grand voice. Choose the one that
            fits your home.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-20">
            <div className="relative border border-line p-10 md:p-12" data-reveal>
              <div className="text-dim text-xs tracking-widest uppercase mb-2">The Essential</div>
              <h3 className="font-display text-4xl">CX<span className="text-copper">102</span></h3>
              <div className="font-num text-2xl mt-6">$1,199 <span className="text-dim text-sm">MSRP</span></div>
              <div className="hairline my-8" />
              <dl className="text-sm">
                <CxRow label="Keyboard" value="88 keys · Responsive Hammer action" />
                <CxRow label="Piano sound" value="SK-EX Concert Grand" />
                <CxRow label="Polyphony" value="192 notes" num />
                <CxRow label="Output Power" value="22 W (11 W × 2)" num />
                <CxRow label="Connectivity" value="USB · Bluetooth MIDI" />
              </dl>
              <a href="/products/kawai-cx-102" className="btn-ghost block text-center mt-10">Try the CX102</a>
            </div>

            <div
              className="relative p-10 md:p-12"
              style={{ border: '1px solid var(--brand-red)', background: 'linear-gradient(180deg,rgba(225,25,34,.08),transparent 45%)' }}
              data-reveal
            >
              <div className="badge-pop">Most Popular</div>
              <div className="text-dim text-xs tracking-widest uppercase mb-2">The Step Up</div>
              <h3 className="font-display text-4xl">CX<span className="text-copper">202</span></h3>
              <div className="font-num text-2xl mt-6">$1,799 <span className="text-dim text-sm">MSRP</span></div>
              <div className="hairline my-8" />
              <dl className="text-sm">
                <CxRow label="Keyboard" value="88 keys · Responsive Hammer action" />
                <CxRow label="Piano sound" value="SK-EX Concert Grand" />
                <CxRow label="Polyphony" value="192 notes" num />
                <CxRow label="Output Power" value="40 W (20 W × 2)" num />
                <CxRow label="Connectivity" value="USB · Bluetooth MIDI & Audio" />
              </dl>
              <a href="/products/kawai-cx202" className="btn-red block text-center mt-10">Try the CX202</a>
            </div>
          </div>

          <p className="text-dim text-xs text-center mt-8">
            Prices and specifications shown are sample placeholders for layout purposes.
          </p>
        </div>
      </section>

      {/* ============ CTA: Find a Dealer ============ */}
      <section id="cx-dealer" className="py-32 md:py-44 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <p className="eyebrow mb-6" data-reveal>Hear It For Yourself</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight" data-reveal>
            Words can&apos;t describe touch.<br />Find a Kawai dealer near you.
          </h2>
          <p className="text-dim mt-8 leading-relaxed" data-reveal>
            Sit down. Play one note. You&apos;ll understand what nearly a century of piano making feels like.
          </p>
          <div className="mt-12 flex justify-center" data-reveal>
            <a href="/find-a-dealer" className="btn-red">Find a Dealer</a>
          </div>
          <p className="text-dim text-xs mt-6" data-reveal>
            Prefer to browse first?{' '}
            <a href="#cx-models" className="text-copper underline">Compare CX102 and CX202</a>
          </p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="pb-16 pt-12" style={{ borderTop: '1px solid var(--ebony-line)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-dim text-xs tracking-widest uppercase space-y-4 md:space-y-0">
          <div className="font-display text-ivory text-lg tracking-widest normal-case">
            KAWAI <span className="text-dim text-xs align-middle">— Since 1927</span>
          </div>
          <div className="space-x-8">
            <a href="/privacy-policy" className="hover:text-copper">Privacy</a>
            <a href="/find-a-dealer" className="hover:text-copper">Find a Dealer</a>
            <a href="/" className="hover:text-copper">kawaius.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CxSpec({ label, value, num, first }: { label: string; value: string; num?: boolean; first?: boolean }) {
  return (
    <tr className="spec-row">
      <td className={`text-dim py-4 pr-8${first ? ' w-48' : ''}`}>{label}</td>
      <td className={`py-4${num ? ' font-num' : ''}`}>{value}</td>
    </tr>
  )
}

function CxRow({ label, value, num }: { label: string; value: string; num?: boolean }) {
  return (
    <div className="spec-row flex justify-between py-4">
      <dt className="text-dim">{label}</dt>
      <dd className={num ? 'font-num' : undefined}>{value}</dd>
    </div>
  )
}
