import Image from 'next/image'
import { PromoReveal } from '@/components/fall-promo'
import { Lockup } from './Lockup'
import type { SaleMoment as Moment } from './types'

/**
 * A marketing moment between promos: one holiday lockup and its photography.
 * Never a credit headline or a disclosure — those belong to the promos.
 *
 * - feature: a large photograph beside the lockup, alternating sides.
 * - gallery: the lockup over three snapshots laid loose on the white field,
 *   each in a white print border with a slight tilt ("Your holidays have
 *   photos"). The tilt is static, so reduced motion changes nothing.
 * - band: one wide photograph with the lockup on a white panel across its foot.
 */

const TILT = ['-rotate-[3deg]', 'rotate-[2deg] sm:-translate-y-6', '-rotate-[1.5deg]']

export function SaleMoment({ moment }: { moment: Moment }) {
  const headingId = `${moment.id}-heading`
  const [first, ...rest] = moment.images

  if (moment.layout === 'gallery') {
    return (
      <section aria-labelledby={headingId} className="px-5 sm:px-10">
        <PromoReveal className="mx-auto max-w-6xl">
          <div data-reveal="rise">
            <Lockup lockup={moment.lockup} id={headingId} size="xl" />
          </div>
          <div className="mt-12 grid grid-cols-3 items-start gap-3 sm:mt-16 sm:gap-8">
            {moment.images.slice(0, 3).map((img, i) => (
              <figure
                key={img.src}
                data-reveal="pop"
                className={`bg-white p-1.5 shadow-[0_24px_50px_-24px_color-mix(in_srgb,var(--color-kawai-black)_45%,transparent)] ring-1 ring-kawai-black/5 sm:p-3 sm:pb-10 ${TILT[i] ?? ''}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-kawai-pearl">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 32vw, 30vw"
                    className="object-cover"
                    style={img.position ? { objectPosition: img.position } : undefined}
                  />
                </div>
              </figure>
            ))}
          </div>
        </PromoReveal>
      </section>
    )
  }

  if (moment.layout === 'band') {
    return (
      <section aria-labelledby={headingId} className="px-5 sm:px-10">
        <PromoReveal className="relative mx-auto max-w-7xl">
          {first && (
            <div data-reveal="wipe" className="relative aspect-[16/9] overflow-hidden bg-kawai-pearl sm:aspect-[21/9]">
              <Image
                src={first.src}
                alt={first.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
                style={first.position ? { objectPosition: first.position } : undefined}
              />
            </div>
          )}
          <div
            data-reveal="rise"
            className="relative mx-auto -mt-16 w-[92%] max-w-3xl bg-white px-6 pb-8 pt-10 sm:-mt-28 sm:px-12 sm:pb-12 sm:pt-14"
          >
            <Lockup lockup={moment.lockup} id={headingId} size="lg" />
          </div>
        </PromoReveal>
      </section>
    )
  }

  // feature
  return (
    <section aria-labelledby={headingId} className="px-5 sm:px-10">
      <PromoReveal className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {first && (
            <div className="relative lg:col-span-7">
              <div data-reveal="wipe" className="relative aspect-[16/9] overflow-hidden bg-kawai-pearl">
                <Image
                  src={first.src}
                  alt={first.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                  style={first.position ? { objectPosition: first.position } : undefined}
                />
              </div>
            </div>
          )}
          <div className="lg:col-span-5">
            <div data-reveal="rise">
              <Lockup lockup={moment.lockup} id={headingId} size="xl" align="start" />
            </div>
            {rest[0] && (
              <div data-reveal="fade" className="relative mt-10 hidden aspect-[3/2] w-2/3 overflow-hidden bg-kawai-pearl lg:block">
                <Image
                  src={rest[0].src}
                  alt={rest[0].alt}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  style={rest[0].position ? { objectPosition: rest[0].position } : undefined}
                />
              </div>
            )}
          </div>
        </div>
      </PromoReveal>
    </section>
  )
}
