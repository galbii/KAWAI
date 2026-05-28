import Image from 'next/image'
import Reveal from './Reveal'
import SectionEyebrow from './SectionEyebrow'
import ArrowLink from './ArrowLink'
import { aboutImages } from './images'

export default function HeritageFeature() {
  return (
    <section id="story" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Image */}
          <Reveal className="lg:col-span-7">
            <div className="relative h-[58vh] min-h-[380px] overflow-hidden rounded-lg md:h-[64vh]">
              <Image
                src={aboutImages.heritage}
                alt="A pianist at a Kawai upright in a refined sitting room"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />
              {/* Founding-year plate, overlapping the lower-left of the frame. */}
              <div className="absolute bottom-0 left-0 bg-kawai-black/85 px-6 py-4 backdrop-blur-sm">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-kawai-gold">
                  Established
                </span>
                <span className="font-[family-name:var(--font-brand-serif)] text-2xl text-white">
                  1927
                </span>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <Reveal delay={0.12} className="lg:col-span-5">
            <SectionEyebrow>Heritage</SectionEyebrow>
            <h2 className="mt-4 mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4vw,3rem)] leading-tight text-kawai-black">
              A Family Legacy of Craft
            </h2>
            <p className="mb-7 leading-relaxed text-kawai-charcoal">
              In 1927, Koichi Kawai — a gifted inventor and former apprentice to Torakusu Yamaha —
              founded Kawai with a singular belief: that exceptional pianos should be within reach of
              every musician. Three generations later, that founding conviction still guides every
              instrument we build, marrying traditional Japanese craftsmanship with relentless
              scientific curiosity.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <ArrowLink href="/company/koichi-kawai">Meet our founder, Koichi Kawai</ArrowLink>
              <ArrowLink href="/company/our-philosophy">Our philosophy</ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
