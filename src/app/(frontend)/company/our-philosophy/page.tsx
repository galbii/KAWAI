import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Philosophy | Kawai Pianos',
  description:
    'The principles that guide every instrument we build — a commitment to craftsmanship, innovation, and the belief that music should be within reach of every musician.',
}

const coreBeliefs = [
  {
    title: 'Craftsmanship Above All',
    description:
      'Every Kawai piano is the product of skilled craftspeople who take personal pride in their work. From the hand-crafting of soundboards to the regulation of each action component, human care is irreplaceable.',
  },
  {
    title: 'Innovation Through Science',
    description:
      'Kawai has never been content with "good enough." Our investment in research and materials science — from ABS composites in 1970 to ABS-Carbon today — reflects a belief that scientific progress and musical tradition are not in conflict.',
  },
  {
    title: 'Music for Everyone',
    description:
      'From our founding, Kawai has believed that quality instruments should be accessible to musicians at every level. Our product range — from entry digital pianos to the Shigeru Kawai concert grand — reflects this inclusive vision.',
  },
  {
    title: 'Three-Generation Commitment',
    description:
      "Family stewardship ensures that Kawai's values endure. Koichi Kawai's original dream, carried forward by Shigeru, Hirotaka, and now Kentaro Kawai, is reflected in every instrument that bears the Kawai name.",
  },
]

export default function OurPhilosophyPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Company</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Our Philosophy
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              The principles that guide every instrument we build — a commitment to
              craftsmanship, innovation, and the belief that music should be within reach of
              every musician.
            </p>
          </div>
        </div>
      </section>

      {/* Video placeholder */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Kawai Philosophy of Piano Building
            </h2>

            <div className="aspect-video bg-kawai-black rounded-xl flex items-center justify-center mb-8 border border-kawai-neutral">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-kawai-red flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-white/70 text-sm">Philosophy of Piano Building</p>
                <p className="text-white/40 text-xs mt-1">Video coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
              Our Core Beliefs
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {coreBeliefs.map((belief) => (
                <div
                  key={belief.title}
                  className="bg-white border border-kawai-neutral rounded-lg p-7"
                >
                  <h3 className="text-lg font-semibold text-kawai-black mb-3">
                    {belief.title}
                  </h3>
                  <p className="text-kawai-charcoal leading-relaxed text-sm">
                    {belief.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Crafting Inspiration */}
      <section className="py-16 bg-white border-y border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Crafting Inspiration
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai&apos;s philosophy is embodied in a simple phrase: &ldquo;Crafting
              Inspiration.&rdquo; It describes both what we do — the physical crafting of musical
              instruments — and why we do it — to inspire musicians to reach new heights of
              artistic expression.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              This philosophy manifests in the attention to detail found in every Kawai
              instrument: the careful selection of tonewoods, the meticulous voicing of each
              hammer, the precision engineering of action components, and the thoughtful design
              of the playing experience from first touch to final note.
            </p>
          </div>
        </div>
      </section>

      {/* A Living Philosophy */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              A Living Philosophy
            </h2>
            <p className="text-kawai-charcoal leading-relaxed">
              The Kawai philosophy is not static — it evolves as we learn, as materials science
              advances, and as musicians&apos; needs change. What remains constant is the commitment
              to the musician: to provide instruments that are worthy of their aspirations,
              durable enough to outlast a lifetime of playing, and beautiful enough to inspire
              the music within.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kawai-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-kawai-red text-sm uppercase tracking-widest mb-2">Continue</p>
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)]">
                Meet Our Founder
              </h2>
              <p className="text-white/60 mt-2">
                The man whose vision gave these principles their first expression.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/about/heritage/koichi-kawai"
                className="inline-block px-6 py-3 bg-kawai-red text-white text-sm font-medium rounded hover:bg-kawai-red-700 transition-colors duration-200 text-center"
              >
                Koichi Kawai
              </Link>
              <Link
                href="/company"
                className="inline-block px-6 py-3 border border-white/30 text-white text-sm font-medium rounded hover:border-white transition-colors duration-200 text-center"
              >
                Back to Company
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
