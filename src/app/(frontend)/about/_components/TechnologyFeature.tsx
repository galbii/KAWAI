import Image from 'next/image'
import Reveal from './Reveal'
import SectionEyebrow from './SectionEyebrow'
import ArrowLink from './ArrowLink'
import { aboutImages } from './images'

export default function TechnologyFeature() {
  return (
    <section className="bg-kawai-black py-20 text-white md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Image (right on desktop) */}
          <Reveal className="lg:order-2 lg:col-span-7">
            <div className="relative h-[58vh] min-h-[380px] overflow-hidden rounded-lg md:h-[64vh]">
              <Image
                src={aboutImages.technology}
                alt="Overhead view of a Kawai grand piano's gold soundboard and strings"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>

          {/* Copy (left on desktop) */}
          <Reveal delay={0.12} className="lg:order-1 lg:col-span-5">
            <SectionEyebrow tone="light">Innovation</SectionEyebrow>
            <h2 className="mt-4 mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4vw,3rem)] leading-tight text-white">
              Engineered by Science
            </h2>
            <p className="mb-7 leading-relaxed text-white/70">
              Kawai has never treated piano-making as tradition alone. From the introduction of ABS
              composite actions in 1971 to today&apos;s ABS-Carbon and Millennium III mechanisms, our
              advances are proven in the laboratory and felt under the fingers. The same research
              drives Progressive Harmonic Imaging, bringing the voice of our concert grands into every
              digital instrument we make.
            </p>
            <ArrowLink href="/technology" tone="light">
              Explore our technology
            </ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
