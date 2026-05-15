'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const R2 = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/';

const SLIDESHOW = [
  { src: `${R2}GX-2_RGB_loc03_sRGB.png`,                label: 'GX-2 Grand'  },
  { src: `${R2}KAWAI_ES_FILMSTILLS_16x9_00025.png`,     label: 'ES Series'   },
  { src: `${R2}250829_0101.png`,                         label: 'SK Concert'  },
  { src: `${R2}MP7SE_location_red.webp`,                label: 'MP7SE'       },
  { src: `${R2}CN201R_location01.webp`,                 label: 'CN201R'      },
];

// Initial 3 cells: CA701R spans col 1-2 + row 1-2, others fill right column
const BENTO_INITIAL = [
  { src: `${R2}KAWAI-CA701R-24_adjusted%20display.webp`, label: 'CA701R'      },
  { src: `${R2}KAWAIGRAND-02126-8bit.webp`,              label: 'Kawai Grand' },
  { src: `${R2}ATX4_AURES2_KeyVisual_1920px.jpg`,        label: 'AnyTime X4' },
];

// 5 extra images appended in the same 3-col grid when expanded
// Row 1: GX-2(1col) ES(1col) SK(1col)  → Row 2: MP7SE(1col) CN201R(2col)
const BENTO_EXTRA = SLIDESHOW;

interface GallerySectionProps {
  onImageClick: (src: string, alt: string, width?: number, height?: number) => void;
  isVisible: boolean;
}

export default function GallerySection({ onImageClick, isVisible }: GallerySectionProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const expandRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => setCurrent(c => (c + 1) % SLIDESHOW.length), []);

  useEffect(() => {
    if (paused) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(advance, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, advance]);

  const prev = () => setCurrent(c => (c - 1 + SLIDESHOW.length) % SLIDESHOW.length);
  const next = () => setCurrent(c => (c + 1) % SLIDESHOW.length);

  const collapse = () => {
    expandRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setTimeout(() => setExpanded(false), 200);
  };

  const cellHeight = 'clamp(120px, 14vw, 180px)';

  return (
    <div
      className="mt-12 sm:mt-16"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 700ms ease, transform 700ms ease',
      }}
    >
      {/* ── Slideshow ──────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden group cursor-pointer"
        style={{ height: 'clamp(220px, 44vw, 520px)' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => { const img = SLIDESHOW[current]; if (img) onImageClick(img.src, img.label, 1600, 900); }}
      >
        {SLIDESHOW.map((img, i) => (
          <div key={img.src} className="absolute inset-0" style={{ opacity: i === current ? 1 : 0, transition: 'opacity 1000ms ease-in-out', zIndex: i === current ? 1 : 0 }}>
            <Image src={img.src} alt={img.label} fill sizes="100vw" className="object-cover" priority={i === 0} />
          </div>
        ))}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,13,46,0.82) 0%, rgba(26,13,46,0.15) 38%, transparent 62%)', zIndex: 2 }} />
        {SLIDESHOW.map((img, i) => (
          <div key={`lbl-${i}`} className="absolute bottom-7 left-7 pointer-events-none" style={{ zIndex: 3, opacity: i === current ? 1 : 0, transform: i === current ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 600ms ease 280ms, transform 600ms ease 280ms' }}>
            <div className="flex items-center gap-3">
              <div style={{ width: '28px', height: '1px', background: '#4D1979' }} />
              <span className="text-white font-light" style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>{img.label}</span>
            </div>
          </div>
        ))}
        <div className="absolute bottom-7 right-7 flex items-center gap-1.5" style={{ zIndex: 3 }}>
          {SLIDESHOW.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} aria-label={`Slide ${i + 1}`}
              style={{ height: '5px', width: i === current ? '22px' : '5px', borderRadius: '3px', background: i === current ? '#fff' : 'rgba(255,255,255,0.38)', transition: 'width 350ms ease, background 350ms ease', border: 'none', padding: 0, cursor: 'pointer' }} />
          ))}
        </div>
        <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ zIndex: 3, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(26,13,46,0.52)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7L9 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ zIndex: 3, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(26,13,46,0.52)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* ── Bento grid — desktop ────────────────────────────────────── */}
      {/*
          3-col grid. Initial state:
            col-span-2, row-span-2  │  col-span-1
            (CA701R)                │  (KAWAIGRAND)
                                    ├─────────────
                                    │  (AnyTime X4)
          Expanded: 5 more rows append seamlessly below.
      */}
      <div className="hidden md:block">
        <div
          className="grid gap-1 mt-1"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {/* Row 1-2: CA701R large left */}
          <div
            className="row-span-2 relative overflow-hidden cursor-pointer group"
            style={{ height: `calc(${cellHeight} * 2 + 4px)` }}
            onClick={() => onImageClick(BENTO_INITIAL[0]!.src, BENTO_INITIAL[0]!.label, 1200, 800)}
          >
            <Image src={BENTO_INITIAL[0]!.src} alt={BENTO_INITIAL[0]!.label} fill sizes="33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
            <HoverOverlay /><BentoLabel label={BENTO_INITIAL[0]!.label} />
          </div>

          {/* Row 1: Kawai Grand */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            style={{ height: cellHeight }}
            onClick={() => onImageClick(BENTO_INITIAL[1]!.src, BENTO_INITIAL[1]!.label, 800, 600)}
          >
            <Image src={BENTO_INITIAL[1]!.src} alt={BENTO_INITIAL[1]!.label} fill sizes="33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
            <HoverOverlay /><BentoLabel label={BENTO_INITIAL[1]!.label} />
          </div>

          {/* Row 2: AnyTime X4 */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            style={{ height: cellHeight }}
            onClick={() => onImageClick(BENTO_INITIAL[2]!.src, BENTO_INITIAL[2]!.label, 800, 600)}
          >
            <Image src={BENTO_INITIAL[2]!.src} alt={BENTO_INITIAL[2]!.label} fill sizes="33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
            <HoverOverlay /><BentoLabel label={BENTO_INITIAL[2]!.label} />
          </div>

          {/* ── Expanded rows: 5 images in the same 3-col grid ── */}
          {/* Wrap in a fragment so they sit inside the same grid */}
          {BENTO_EXTRA.map((img, i) => {
            // Last image (CN201R) spans 2 cols so the row fills completely: MP7SE(1) + CN201R(2)
            const isLast = i === BENTO_EXTRA.length - 1;
            return (
              <div
                key={img.src}
                className={`relative overflow-hidden cursor-pointer group${isLast ? ' col-span-2' : ''}`}
                style={{
                  height: cellHeight,
                  overflow: 'hidden',
                  maxHeight: expanded ? cellHeight : '0px',
                  transition: `max-height 500ms cubic-bezier(0.4,0,0.2,1) ${i * 60}ms, opacity 400ms ease ${i * 60}ms`,
                  opacity: expanded ? 1 : 0,
                }}
                onClick={() => onImageClick(img.src, img.label, 1200, 800)}
              >
                <Image src={img.src} alt={img.label} fill sizes={isLast ? '66vw' : '33vw'} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                <HoverOverlay /><BentoLabel label={img.label} />
              </div>
            );
          })}
        </div>

        {/* Expand button */}
        <div ref={expandRef} className="flex justify-center mt-4">
          <button
            onClick={expanded ? collapse : () => setExpanded(true)}
            className="flex items-center gap-2.5 px-5 py-2.5 transition-all duration-300"
            style={{ border: '1px solid rgba(77,25,121,0.3)', background: expanded ? 'rgba(77,25,121,0.08)' : 'transparent', color: '#4D1979' }}
          >
            <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
              {expanded ? 'Show less' : `View all ${BENTO_INITIAL.length + BENTO_EXTRA.length} photos`}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 400ms ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M2 4L6 8L10 4" stroke="#4D1979" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Bento grid — mobile ─────────────────────────────────────── */}
      <div className="md:hidden mt-1 flex flex-col gap-1">
        <div className="relative overflow-hidden cursor-pointer" style={{ height: '200px' }} onClick={() => onImageClick(BENTO_INITIAL[0]!.src, BENTO_INITIAL[0]!.label, 1200, 800)}>
          <Image src={BENTO_INITIAL[0]!.src} alt={BENTO_INITIAL[0]!.label} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,13,46,0.7) 0%, transparent 50%)' }} />
          <MobileBentoLabel label={BENTO_INITIAL[0]!.label} />
        </div>
        <div className="grid grid-cols-2 gap-1">
          {[BENTO_INITIAL[1]!, BENTO_INITIAL[2]!].map((img) => (
            <div key={img.src} className="relative overflow-hidden cursor-pointer" style={{ height: '130px' }} onClick={() => onImageClick(img.src, img.label, 800, 600)}>
              <Image src={img.src} alt={img.label} fill sizes="50vw" className="object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,13,46,0.7) 0%, transparent 50%)' }} />
              <MobileBentoLabel label={img.label} />
            </div>
          ))}
        </div>

        {/* Mobile expanded rows */}
        <div
          style={{ overflow: 'hidden', maxHeight: expanded ? '900px' : '0px', transition: 'max-height 600ms cubic-bezier(0.4,0,0.2,1)' }}
        >
          <div className="grid grid-cols-2 gap-1">
            {BENTO_EXTRA.map((img, i) => (
              <div
                key={img.src}
                className={`relative overflow-hidden cursor-pointer${i === BENTO_EXTRA.length - 1 && BENTO_EXTRA.length % 2 !== 0 ? ' col-span-2' : ''}`}
                style={{ height: '130px', opacity: expanded ? 1 : 0, transform: expanded ? 'translateY(0)' : 'translateY(10px)', transition: `opacity 400ms ease ${i * 50}ms, transform 400ms ease ${i * 50}ms` }}
                onClick={() => onImageClick(img.src, img.label, 800, 600)}
              >
                <Image src={img.src} alt={img.label} fill sizes="50vw" className="object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,13,46,0.7) 0%, transparent 50%)' }} />
                <MobileBentoLabel label={img.label} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <button
            onClick={expanded ? collapse : () => setExpanded(true)}
            className="flex items-center gap-2.5 px-5 py-2.5 transition-all duration-300"
            style={{ border: '1px solid rgba(77,25,121,0.3)', background: expanded ? 'rgba(77,25,121,0.08)' : 'transparent', color: '#4D1979' }}
          >
            <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
              {expanded ? 'Show less' : `View all ${BENTO_INITIAL.length + BENTO_EXTRA.length} photos`}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 400ms ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M2 4L6 8L10 4" stroke="#4D1979" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function HoverOverlay() {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
      style={{ background: 'linear-gradient(to top, rgba(26,13,46,0.78) 0%, transparent 52%)' }}
    />
  );
}

function BentoLabel({ label }: { label: string }) {
  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none" style={{ zIndex: 2 }}>
      <div style={{ width: '16px', height: '1px', background: '#4D1979' }} />
      <span className="text-white font-light" style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

function MobileBentoLabel({ label }: { label: string }) {
  return (
    <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none" style={{ zIndex: 2 }}>
      <div style={{ width: '12px', height: '1px', background: '#4D1979' }} />
      <span className="text-white font-light" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}
