import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Reveal from './Reveal'
import SectionEyebrow from './SectionEyebrow'
import { aboutImages } from './images'

export default function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-kawai-black py-28 text-white md:py-40">
      <Image
        src={aboutImages.cta}
        alt="A Kawai upright piano in an elegant interior"
        fill
        sizes="100vw"
        className="object-cover object-center -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-black/70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/50 to-black/60" />

      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionEyebrow tone="light" className="justify-center">
            Explore
          </SectionEyebrow>
          <h2 className="mt-4 mb-5 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.5rem)] leading-tight">
            Experience 97 Years of Innovation
          </h2>
          <p className="mx-auto mb-9 max-w-xl text-white/75">
            Discover how Kawai&apos;s legacy of craftsmanship and innovation can shape your musical
            journey.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/pianos">Explore Pianos</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/70 bg-transparent text-white hover:bg-white hover:text-kawai-black"
              asChild
            >
              <Link href="/find-a-dealer">Find a Dealer</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
