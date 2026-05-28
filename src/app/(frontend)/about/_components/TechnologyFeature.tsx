import Image from 'next/image'
import Link from 'next/link'

export default function TechnologyFeature() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-[360px] md:h-[460px] rounded-lg overflow-hidden order-1 lg:order-2">
            <Image
              src="/images/gallery/Grand Feel Compact - action sample (layers) copy.webp"
              alt="Kawai Grand Feel action mechanism, layered detail"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="order-2 lg:order-1">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">INNOVATION</p>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Engineered by Science
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai has never treated piano-making as tradition alone. From the introduction of ABS
              composite actions in 1971 to today&apos;s ABS-Carbon and Millennium III mechanisms, our
              advances are proven in the laboratory and felt under the fingers. The same research
              drives Progressive Harmonic Imaging, bringing the voice of our concert grands into
              every digital instrument we make.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-6">
              <Link
                href="/technology"
                className="inline-flex items-center text-kawai-red font-medium hover:text-kawai-red-700 transition-colors duration-200"
              >
                Explore our technology →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
