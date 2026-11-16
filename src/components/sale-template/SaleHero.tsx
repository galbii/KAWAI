import Image from "next/image";
import { Bow, SatinBand } from "./RibbonBow";
import { Snowfall } from "./Snowfall";
import { SERIF } from "./tokens";
import type { SaleHeroContent } from "./types";

/**
 * The hero as a wrapped gift: the photograph runs full-bleed, a red satin
 * ribbon crosses it (down the right, along the foot) and the bow sits where
 * the two bands meet. The headline is set in white over a deep scrim, its
 * accent line in gold italic.
 *
 * Above the fold, so it enters on CSS keyframes rather than a scroll trigger.
 * `both` fill keeps the end state under reduced motion, where the global rule
 * clamps every duration to ~0 — the copy and ribbon are simply there.
 */
const ENTER = "animate-[price-rise_0.9s_cubic-bezier(0.16,1,0.3,1)_both]";

export function SaleHero({
  hero,
  storeName,
}: {
  hero: SaleHeroContent;
  storeName: string;
}) {
  return (
    <header className="relative isolate z-10 flex min-h-[40rem] items-end bg-kawai-black text-white sm:min-h-[44rem] lg:min-h-[min(54rem,92vh)]">
      {/* Photograph layer: clips the slow zoom and the snow; the bow below hangs free. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover motion-safe:animate-[sale-hero-zoom_14s_ease-out_both]"
        />
        {/* Scrims: a deep foot for the type, a left wash on wide screens. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-kawai-black/90 via-kawai-black/45 to-kawai-black/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-r from-kawai-red-900/55 via-kawai-black/15 to-transparent lg:block"
        />
        <Snowfall />
      </div>

      {/* The ribbon: down the right, along the foot, bow at the knot. */}
      <SatinBand
        vertical
        className="inset-y-0 right-14 w-2.5 origin-top animate-[sale-band-y_1.4s_cubic-bezier(0.16,1,0.3,1)_0.15s_both] sm:right-[12%] sm:w-4"
      />
      <SatinBand className="inset-x-0 bottom-0 h-2.5 origin-left animate-[sale-band-x_1.4s_cubic-bezier(0.16,1,0.3,1)_0.3s_both] sm:h-4" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-14 z-10 translate-x-1/2 translate-y-[46%] sm:right-[12%]"
      >
        <div className="origin-center animate-[sale-bow-tie_1s_cubic-bezier(0.34,1.56,0.64,1)_1s_both]">
          <Bow
            idSuffix="hero"
            className="h-16 w-auto motion-safe:animate-[sale-bow-sway_6s_ease-in-out_2.2s_infinite] sm:h-28"
          />
        </div>
      </div>

      {/* Headline panel */}
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 sm:px-10 sm:pb-24 lg:pb-28">
        <div className="max-w-2xl pr-16 sm:pr-0">
          <p
            className={`${ENTER} inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md sm:text-sm`}
            style={{ animationDelay: "0.1s" }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-kawai-red-400 shadow-[0_0_10px_var(--color-kawai-red-400)]"
            />
            {storeName}
          </p>

          <h1
            className="mt-6 text-[clamp(3rem,8.5vw,6.5rem)] leading-[0.95] tracking-[-0.01em] drop-shadow-[0_4px_24px_color-mix(in_srgb,black_45%,transparent)]"
            style={{ fontFamily: SERIF }}
          >
            <span
              className={`${ENTER} block`}
              style={{ animationDelay: "0.2s" }}
            >
              {hero.titleLead}
            </span>
            <span
              className={`${ENTER} block font-medium italic text-kawai-gold`}
              style={{ animationDelay: "0.35s" }}
            >
              {hero.titleAccent}
            </span>
          </h1>

          <p
            className={`${ENTER} mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg`}
            style={{ animationDelay: "0.5s" }}
          >
            {hero.body}
          </p>

          <p
            className={`${ENTER} mt-7 inline-flex items-center gap-2 rounded-full bg-kawai-gold px-4 py-1.5 text-sm font-semibold text-kawai-black shadow-[0_10px_30px_-10px_var(--color-kawai-gold)]`}
            style={{ animationDelay: "0.62s" }}
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5">
              <path
                fill="currentColor"
                d="M12 0c.6 5.6 2.4 7.4 8 8-5.6.6-7.4 2.4-8 8-.6-5.6-2.4-7.4-8-8 5.6-.6 7.4-2.4 8-8z"
                transform="translate(0 4)"
              />
            </svg>
            {hero.ending}
          </p>
        </div>
      </div>
    </header>
  );
}
