import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Koichi Kawai — Founder | Kawai Pianos',
  description:
    "The extraordinary story of a wagon-maker's son who became the founding genius of one of the world's great piano companies.",
}

const challenges = [
  {
    title: 'The Craftsmen Problem',
    description:
      "A shortage of qualified craftsmen who could meet Kawai's exacting standards required significant investment in training and development.",
  },
  {
    title: 'The Materials Problem',
    description:
      'The continual scarcity of quality materials in post-war Japan demanded creative solutions and relentless supplier relationships.',
  },
  {
    title: 'The Market Problem',
    description:
      'An underdeveloped network of dealers for reaching potential customers required building distribution from the ground up.',
  },
]

export default function KoichiKawaiPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Company</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-2">
              Koichi Kawai
            </h1>
            <p className="text-kawai-gold text-base tracking-wide mb-4">
              Founder &middot; Inventive Genius
            </p>
            <p className="text-lg text-white/70 max-w-2xl">
              The extraordinary story of a wagon-maker&apos;s son who became the founding genius
              of one of the world&apos;s great piano companies.
            </p>
          </div>
        </div>
      </section>

      {/* A Dream Is Born */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              A Dream Is Born
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              It was well over a century ago in Japan that a reed organ builder was struggling
              alone to build an upright piano from imported parts. One day, he was surprised to
              see a neighbor&apos;s son riding by on a unique pedal-driven cart, the first ever
              to travel the roads of Hamamatsu, Japan. The aspiring piano builder was so
              impressed when he learned that the boy had designed and built the cart by himself
              that he invited the young man to be his apprentice. The next day, the invitation
              was accepted and a dream was born — as the young man, Koichi Kawai, the son of a
              wagon maker, would set out to build his first piano.
            </p>
          </div>
        </div>
      </section>

      {/* Inventive Genius */}
      <section className="py-16 bg-white border-y border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Inventive Genius
            </h2>
            <p className="text-kawai-charcoal leading-relaxed">
              The ensuing years would reveal Koichi Kawai&apos;s extraordinary genius for design
              and innovation. He led the research and development team that introduced pianos to
              his country. Later, he became the first in Japan to design and build a complete
              piano action, receiving many patents for his designs and inventions. It was an
              impressive beginning — yet his greatest achievements were still to come.
            </p>
          </div>
        </div>
      </section>

      {/* Birth of a Company */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Birth of a Company
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              During the 1920s, the Japanese piano industry began to falter. The company that
              employed Koichi was struggling and new management had taken control from the
              original owner. It was then that Koichi Kawai, confident that the pursuit of
              excellence would always bring opportunity, decided to build a dream of his own.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              His quest began in 1927 as he and seven kindred colleagues formed the Kawai
              Musical Instrument Research Laboratory in Hamamatsu, Japan. Together, it was their
              dream to one day build the world&apos;s finest piano.
            </p>
          </div>
        </div>
      </section>

      {/* Early Challenges */}
      <section className="py-16 bg-white border-y border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
              Overcoming Early Challenges
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-8">
              The early years provided many diverse challenges:
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {challenges.map((challenge) => (
                <div
                  key={challenge.title}
                  className="bg-kawai-pearl border border-kawai-neutral rounded-lg p-6"
                >
                  <div className="w-2 h-2 rounded-full bg-kawai-red mb-4" />
                  <h3 className="text-base font-semibold text-kawai-black mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-kawai-charcoal text-sm leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-kawai-charcoal leading-relaxed">
              Yet the determined company prospered. By the early fifties, Kawai had grown to
              over 500 people producing over 1,500 pianos per year.
            </p>
          </div>
        </div>
      </section>

      {/* Emperor's Recognition */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Emperor&apos;s Recognition
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Koichi Kawai&apos;s achievements were recognized at the highest level. He received
              the prestigious &ldquo;Blue Ribbon Medal&rdquo; from the Emperor of Japan —
              becoming the first person in the musical instrument industry to receive such an
              honor.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              By the end of its first quarter century, the company had put in place the
              foundations of excellence and dedication that would motivate and inspire its people
              for decades to come.
            </p>
          </div>
        </div>
      </section>

      {/* Legacy */}
      <section className="py-16 bg-white border-y border-kawai-neutral">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              A Legacy That Endures
            </h2>
            <p className="text-kawai-charcoal leading-relaxed">
              Koichi Kawai&apos;s vision — to build the world&apos;s finest pianos — has guided
              the company through nearly a century of growth, challenge, and achievement. His son
              Shigeru, grandson Hirotaka, and great-grandson Kentaro have each carried this legacy
              forward, building on the foundation of innovation and craftsmanship that Koichi
              established with seven colleagues in 1927. Today, Kawai is one of the most
              celebrated piano makers in the world — a testament to the genius and determination
              of its founder.
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
                Our Philosophy
              </h2>
              <p className="text-white/60 mt-2">
                Discover the principles Koichi set in motion — and how they guide us today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/company/our-philosophy"
                className="inline-block px-6 py-3 bg-kawai-red text-white text-sm font-medium rounded hover:bg-kawai-red-700 transition-colors duration-200 text-center"
              >
                Our Philosophy
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
