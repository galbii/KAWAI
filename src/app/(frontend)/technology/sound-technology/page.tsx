import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sound Technology | Kawai Pianos',
  description:
    'From the SK-EX Rendering engine to Harmonic Imaging — how Kawai faithfully reproduces the magnificence of a concert grand in digital form.',
}

export default function SoundTechnologyPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Technology</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Sound Technology
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              From the SK-EX Rendering engine to Harmonic Imaging — how Kawai faithfully reproduces
              the magnificence of a concert grand in digital form.
            </p>
          </div>
        </div>
      </section>

      {/* SK-EX Rendering */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              SK-EX Rendering Sound Technology
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              The magnificent tone of Kawai&apos;s flagship Shigeru Kawai SK-EX full concert grand
              piano is at the heart of the CA98 and CA78 digital pianos. Widely regarded as the
              &ldquo;Premier Pianos of Japan,&rdquo; Shigeru Kawai instruments grace the stages of
              concert halls and musical institutions throughout the world, and are prized for their
              tonal clarity and exceptional dynamic range.
            </p>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai has developed SK-EX Rendering &ndash; a brand new piano sound engine that blends
              multi-channel, 88-key sampling with the latest resonance modeling technology.
              Multi-channel sampling captures the sound from different points of the Shigeru Kawai
              concert grand piano, allowing a broader range of tonal characteristics to be
              reproduced, and providing a more lively, authentic response to changes in dynamics.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              This naturally expressive sound is further enriched by newly developed resonance
              algorithms, which physically model the complex tonal interactions produced by the
              strings, damper, and various other parts of an acoustic piano, giving players the
              impression that they&apos;re sitting at a living, breathing instrument.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Audio — Powered by Onkyo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Premium Audio — Powered by Onkyo
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Developed in collaboration with Onkyo, one of Japan&apos;s leading premium audio
              equipment manufacturers, the CA98 and CA78 digital pianos are the first musical
              instruments to utilise specialist components designed for high-end audio reproduction.
              With cutting-edge technologies such as 1-bit DSD processing, dual DAC signal
              conversion, and Onkyo&apos;s exclusive DIRDC circuitry, the Concert Artist&apos;s
              optimized power amplifiers reproduce the Shigeru Kawai grand piano sound with stunning
              richness and clarity.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              The CA98 features a considerably improved speaker system that pairs premium Onkyo
              driver units with Kawai&apos;s newly developed TwinDrive soundboard. This unique
              acoustic projection technology harnesses the latest Onkyo transducer components to
              channel sound energy onto a real wooden soundboard, resulting in a richer, more
              natural piano tone.
            </p>
          </div>
        </div>
      </section>

      {/* Harmonic Imaging */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Harmonic Imaging™
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-10">
              Kawai&apos;s highly acclaimed sound technology is called Harmonic Imaging™. Simply
              put, Harmonic Imaging is a blend of technology and techniques aimed at producing the
              most realistic recreation of a 9-foot concert grand piano possible.
            </p>

            <h3 className="text-xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
              88-Key Sampling
            </h3>
            <p className="text-kawai-charcoal leading-relaxed mb-10">
              Each key of a piano has its own unique tonal characteristics. Some have only one
              string, others two and still others three. There are also differences in hammer felt
              shape and density. By sampling and recreating each key individually (rather than
              &ldquo;stretching&rdquo; a smaller number of samples) the unique tonal character of
              each note is preserved.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-kawai-neutral rounded-lg p-6">
                <h4 className="font-semibold text-kawai-black mb-3">
                  Progressive Harmonic Imaging (PHI)
                </h4>
                <p className="text-kawai-charcoal text-sm leading-relaxed">
                  Uses a larger tonal &ldquo;database&rdquo; than regular Harmonic Imaging to
                  provide greater tonal details throughout the dynamic range.
                </p>
              </div>
              <div className="bg-white border border-kawai-neutral rounded-lg p-6">
                <h4 className="font-semibold text-kawai-black mb-3">
                  Ultra Progressive Harmonic Imaging (UPHI)
                </h4>
                <p className="text-kawai-charcoal text-sm leading-relaxed">
                  Uses the largest tonal database, providing the greatest tonal detail possible.
                </p>
              </div>
              <div className="bg-white border border-kawai-neutral rounded-lg p-6">
                <h4 className="font-semibold text-kawai-black mb-3">Harmonic Imaging XL</h4>
                <p className="text-kawai-charcoal text-sm leading-relaxed">
                  Extends the length of the critical attack portion of the sound by up to 120%,
                  articulating the characteristics of each note more clearly and organically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Than One Piano Sound */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              More Than One Piano Sound
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-10">
              A musician&apos;s preference for the sound of a piano is highly subjective. For this
              reason, most Kawai digital pianos offer more than one type of acoustic piano sound.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-kawai-pearl border border-kawai-neutral rounded-lg p-6">
                <h4 className="font-semibold text-kawai-black mb-3">Concert Grand 1</h4>
                <p className="text-kawai-charcoal text-sm leading-relaxed">
                  A well-rounded EX Concert Grand recorded in the standard fashion for classical and
                  jazz music.
                </p>
              </div>
              <div className="bg-kawai-pearl border border-kawai-neutral rounded-lg p-6">
                <h4 className="font-semibold text-kawai-black mb-3">Concert Grand 2</h4>
                <p className="text-kawai-charcoal text-sm leading-relaxed">
                  The original Harmonic Imaging Concert Grand sound with a very different character.
                </p>
              </div>
              <div className="bg-kawai-pearl border border-kawai-neutral rounded-lg p-6">
                <h4 className="font-semibold text-kawai-black mb-3">Pop Piano</h4>
                <p className="text-kawai-charcoal text-sm leading-relaxed">
                  An EX Concert Piano recorded with methods used on many famous pop and rock piano
                  recordings done in Los Angeles area studios.
                </p>
              </div>
              <div className="bg-kawai-pearl border border-kawai-neutral rounded-lg p-6">
                <h4 className="font-semibold text-kawai-black mb-3">Upright Piano</h4>
                <p className="text-kawai-charcoal text-sm leading-relaxed">
                  A new upright piano sound, perfect for music that needs a more intimate piano
                  sound.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-kawai-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-serif)] mb-4">
            Hear the Difference
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Experience Kawai&apos;s sound technology in person at an authorized dealer near you.
          </p>
          <Link
            href="/find-a-dealer"
            className="inline-block bg-kawai-red hover:bg-kawai-red-700 text-white px-8 py-4 rounded text-sm uppercase tracking-widest transition-colors"
          >
            Find a Dealer
          </Link>
        </div>
      </section>
    </div>
  )
}
