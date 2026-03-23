import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "The Winner's Choice | Kawai Pianos",
  description:
    "At international piano competitions, the world's finest young pianists consistently choose Kawai — making it the new international piano of choice.",
}

const competitions = [
  {
    name: '10th Tchaikovsky International Piano Competition',
    award: 'Top Two Prize Winners',
  },
  {
    name: '9th Van Cliburn International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '14th International Chopin Piano Competition',
    award: '2nd Prize Winner',
  },
  {
    name: '5th Dublin International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '13th Jose Iturbi International Piano Competition',
    award: 'Top Three Prize Winners',
  },
  {
    name: '1st Rachmaninoff International Piano Competition (USA)',
    award: 'First Prize Winner',
  },
  {
    name: '23rd William Kapell International Piano Competition',
    award: 'All Three Prize Winners',
  },
  {
    name: '42nd ARD International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '2nd Rachmaninoff International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '45th Ferruccio Busoni International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '11th Santander International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '8th Premio Dino Ciani International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '12th Vianna da Motta International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '2nd Hamamatsu International Piano Competition',
    award: 'First Prize Winner',
  },
  {
    name: '22nd Casagrande International Piano Competition',
    award: 'First Prize Winner',
  },
]

export default function WinnersChoicePage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              The Winner&apos;s Choice
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              At international piano competitions, the world&apos;s finest young pianists consistently
              choose Kawai — making it the new international piano of choice.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* The Winner's Choice section */}
            <div className="mb-14">
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-5">
                The Winner&apos;s Choice
              </h2>
              <p className="text-kawai-charcoal leading-relaxed text-base md:text-lg">
                They come from around the globe — exceptional young pianists ready to test their skills
                against the world&apos;s finest. At international piano competitions, these emerging
                professionals hope to encounter the perfect instrument — one that allows them to fully
                express their highest artistic intentions. After all, winning the top prize can sometimes
                be the key to a career on the concert stage. With this goal in mind, top prize winners
                in competitions throughout the world are making Kawai the new international piano of
                choice.
              </p>
            </div>

            {/* Competition Winners */}
            <div className="mb-14">
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
                Competition Winners
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {competitions.map((comp) => (
                  <div
                    key={comp.name}
                    className="border-l-4 border-kawai-red pl-4 py-3 bg-white rounded-r-lg"
                  >
                    <p className="font-semibold text-kawai-black text-sm leading-snug">{comp.name}</p>
                    <p className="text-kawai-red text-sm mt-1">{comp.award}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-kawai-neutral pt-12 text-center">
              <p className="text-kawai-charcoal mb-6 text-base">
                Experience the instrument trusted by the world&apos;s greatest competition winners.
              </p>
              <Link
                href="/pianos"
                className="inline-block bg-kawai-red text-white px-8 py-3 rounded-md text-sm font-semibold uppercase tracking-wider hover:bg-kawai-red-700 transition-colors"
              >
                Discover the Shigeru Kawai Concert Grand
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
