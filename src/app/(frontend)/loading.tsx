/**
 * GlobalLoadingSkeleton — shown by Next.js App Router while any (frontend)
 * page's server components are fetching data.
 *
 * The layout (header, footer) is already rendered — this fills the <main> slot.
 *
 * Design: pearl background, left-to-right shimmer sweep over a tall hero
 * area, a barely-there "KAWAI" watermark centred in the hero, and three
 * staggered card skeletons below. A single kawai-red accent line at the top
 * of the content area anchors the brand.
 */
export default function GlobalLoadingSkeleton() {
  return (
    <>
      {/* Shimmer keyframe — self-contained, only used by this component */}
      <style>{`
        @keyframes kawai-shimmer-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .kawai-shimmer {
          position: relative;
          overflow: hidden;
        }
        .kawai-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            transparent          0%,
            rgba(255,255,255,0.22) 40%,
            rgba(255,255,255,0.38) 50%,
            rgba(255,255,255,0.22) 60%,
            transparent          100%
          );
          animation: kawai-shimmer-sweep 2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes kawai-breath {
          0%, 100% { opacity: 0.12; }
          50%       { opacity: 0.22; }
        }
        .kawai-breath {
          animation: kawai-breath 2.8s ease-in-out infinite;
        }
        @keyframes kawai-pulse-stagger {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.6; }
        }
      `}</style>

      <div
        className="min-h-[80vh] bg-kawai-pearl"
        aria-label="Loading"
        aria-busy="true"
        role="status"
      >
        {/* ── Hero skeleton ─────────────────────────────────────── */}
        <div
          className="kawai-shimmer w-full"
          style={{
            height: 'clamp(320px, 58vh, 580px)',
            background: 'linear-gradient(160deg, #ede9e2 0%, #e4dfd7 60%, #dedad2 100%)',
          }}
        >
          {/* Barely-there brand watermark */}
          <div className="absolute inset-0 flex items-center justify-center select-none">
            <span
              className="kawai-breath text-[11px] font-semibold uppercase text-kawai-black"
              style={{ letterSpacing: '0.55em' }}
            >
              KAWAI
            </span>
          </div>
        </div>

        {/* ── Content area ──────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 lg:px-12">

          {/* Kawai-red accent rule — single confident line */}
          <div
            className="mb-14 mt-0 h-px w-full"
            style={{
              background: 'linear-gradient(90deg, #E11922 0%, rgba(225,25,34,0.18) 55%, transparent 100%)',
            }}
          />

          {/* Section heading skeleton */}
          <div className="mb-12 space-y-3">
            <div
              className="h-[11px] w-14 rounded-full bg-kawai-neutral/55"
              style={{ animation: 'kawai-pulse-stagger 2.4s ease-in-out infinite' }}
            />
            <div
              className="h-8 w-72 max-w-[80%] rounded bg-kawai-neutral/40"
              style={{ animation: 'kawai-pulse-stagger 2.4s ease-in-out 0.15s infinite' }}
            />
            <div
              className="h-4 w-[420px] max-w-full rounded bg-kawai-neutral/28"
              style={{ animation: 'kawai-pulse-stagger 2.4s ease-in-out 0.3s infinite' }}
            />
          </div>

          {/* 3-column card skeletons */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-20">
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="space-y-4">
                {/* Card image */}
                <div
                  className="kawai-shimmer rounded-lg"
                  style={{
                    aspectRatio: '16 / 10',
                    background: `linear-gradient(135deg, #e8e3db ${i * 4}%, #ddd8d0 100%)`,
                    animationDelay: `${i * 0.25}s`,
                  }}
                />
                {/* Card title */}
                <div
                  className="h-5 rounded bg-kawai-neutral/42"
                  style={{
                    width: `${74 - i * 7}%`,
                    animation: `kawai-pulse-stagger 2.4s ease-in-out ${i * 0.12}s infinite`,
                  }}
                />
                {/* Card body lines */}
                <div
                  className="h-[13px] w-full rounded bg-kawai-neutral/28"
                  style={{ animation: `kawai-pulse-stagger 2.4s ease-in-out ${i * 0.12 + 0.1}s infinite` }}
                />
                <div
                  className="h-[13px] rounded bg-kawai-neutral/22"
                  style={{
                    width: `${88 - i * 6}%`,
                    animation: `kawai-pulse-stagger 2.4s ease-in-out ${i * 0.12 + 0.2}s infinite`,
                  }}
                />
                {/* CTA ghost */}
                <div
                  className="mt-2 h-9 w-28 rounded border border-kawai-neutral/35 bg-transparent"
                  style={{ animation: `kawai-pulse-stagger 2.4s ease-in-out ${i * 0.12 + 0.3}s infinite` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
