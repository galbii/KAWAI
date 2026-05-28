import Image from 'next/image'
import Link from 'next/link'

export default function HeritageFeature() {
  return (
    <section id="story" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-[360px] md:h-[460px] rounded-lg overflow-hidden order-1">
            <Image
              src="/images/optimized/misc/kawai-piano-hands_1200.webp"
              alt="Hands of a Kawai craftsman at the piano"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="order-2">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">HERITAGE</p>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              A Family Legacy of Craft
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              In 1927, Koichi Kawai — a gifted inventor and former apprentice to Torakusu Yamaha —
              founded Kawai with a singular belief: that exceptional pianos should be within reach of
              every musician. Three generations later, that founding conviction still guides every
              instrument we build, marrying traditional Japanese craftsmanship with relentless
              scientific curiosity.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-6">
              <Link
                href="/company/koichi-kawai"
                className="inline-flex items-center text-kawai-red font-medium hover:text-kawai-red-700 transition-colors duration-200"
              >
                Meet our founder, Koichi Kawai →
              </Link>
              <Link
                href="/company/our-philosophy"
                className="inline-flex items-center text-kawai-red font-medium hover:text-kawai-red-700 transition-colors duration-200"
              >
                Our philosophy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
