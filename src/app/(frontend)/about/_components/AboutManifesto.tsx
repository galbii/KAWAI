import Image from 'next/image'
import Reveal from './Reveal'
import { aboutImages } from './images'

export default function AboutManifesto() {
  return (
    <section className="relative overflow-hidden bg-kawai-pearl py-28 md:py-40">
      {/* Oversized brand wordmark, barely there — a watermark behind the founding statement. */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 justify-center opacity-[0.05]">
        <div className="relative aspect-[5/1] w-[150%] max-w-none md:w-[125%]">
          <Image src={aboutImages.wordmark} alt="" fill sizes="150vw" className="object-contain" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span
            aria-hidden
            className="mb-2 block font-[family-name:var(--font-brand-serif)] text-7xl leading-none text-kawai-gold md:text-8xl"
          >
            &ldquo;
          </span>
          <blockquote className="font-[family-name:var(--font-brand-serif)] text-[clamp(1.6rem,3.4vw,2.75rem)] font-normal italic leading-[1.3] text-kawai-black">
            Since 1927, three generations of the Kawai family have dedicated their lives to crafting
            inspiration through innovative piano technology, scientific research, and an unwavering
            commitment to quality.
          </blockquote>
          <div className="mx-auto mt-10 h-px w-16 bg-kawai-gold" />
        </Reveal>
      </div>
    </section>
  )
}
