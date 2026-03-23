import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ABS-Carbon Technology | Kawai Pianos',
  description:
    'Discover how Kawai\'s ABS-Carbon composite material powers the Millennium III Action — combining long-term stability with the extraordinary strength of carbon fiber for superior piano performance.',
}

const benefits = [
  {
    title: 'Durability',
    description:
      'ABS-Carbon parts are more durable than conventional wooden parts and over 50% stronger, which means less maintenance and parts replacement.',
  },
  {
    title: 'Speed',
    description:
      'ABS-Carbon makes the Millennium III Grand Action 25% faster. Keys depress and return more swiftly, providing increased repetition and playing speed.',
  },
  {
    title: 'Power',
    description:
      'The added rigidity of ABS-Carbon provides more power with less effort. The piano responds to a lighter touch, making it easier to play.',
  },
  {
    title: 'Control',
    description:
      'The meticulous redesign of the Millennium III Action offers superb control for the player. It is now easier than ever to maintain control for pianissimo playing.',
  },
]

const carbonUses = [
  {
    title: 'Aircraft',
    description:
      'The Boeing 777 uses carbon fiber in its construction to fly faster than the competition with lower fuel costs. Similarly, carbon fiber makes up over half the material used for the Boeing 787 Dreamliner and Airbus 380.',
  },
  {
    title: 'Sports Equipment',
    description:
      'The strength, weight and lower density of carbon fiber allows golf club designers to create lighter clubs that result in a faster swing and longer shots.',
  },
  {
    title: 'Formula One Cars',
    description:
      'Formula One and other leading racing cars are made faster and safer thanks to the strength and lightweight character of carbon fiber composite parts.',
  },
  {
    title: 'Bridges',
    description:
      'The 1.6 mile-long West Gate Bridge of Melbourne, Australia and its supports are reinforced by carbon fiber.',
  },
  {
    title: 'World-Class Racing Bicycles',
    description:
      'More top riders are competing in the Tour de France with carbon fiber bikes than ever before.',
  },
  {
    title: 'Other Musical Instruments',
    description:
      'Many manufacturers of string bows for violins and cellos are using carbon fiber due to its lightweight speed and resistance to breakage.',
  },
]

export default function CarbonFiberTechnologyPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Technology</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              ABS-Carbon Technology
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              The revolutionary composite material powering Kawai&apos;s Millennium III Action —
              combining long-term stability with the extraordinary strength of carbon fiber.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Introducing ABS-Carbon */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Introducing ABS-Carbon
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              ABS-Carbon, the new composite material in our revolutionary Millennium III Action,
              combines the long-term stability of ABS Styran — a composite used in Kawai actions for
              over 40 years — with the extraordinary strength of carbon fiber. ABS-Carbon produces
              more dynamic power, greater durability, improved control and unparalleled speed to
              enhance the playing experience.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Why Carbon Fiber? */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Why Carbon Fiber?
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Carbon fiber has been called the lightest, strongest material on earth. In Kawai
              pianos, it allows a lighter design that helps to make our Millennium III Action
              tremendously fast and effortless to play while sustaining exceptional tone. The rigid
              character of ABS-Carbon also offers pianists more power with less effort. Its
              resistance to shrinking and swelling helps to provide these benefits consistently over
              many years — something conventional wood components are unable to deliver.
            </p>
          </div>
        </div>
      </section>

      {/* Section: What's Wrong with Wood? */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              What&apos;s Wrong with Wood?
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              While certainly ideal for the sound-producing elements of a piano, wood is less
              suitable for the many mechanical components in a piano action. Wood is susceptible to
              breakage from continual stress and can shrink and swell dramatically with changes in
              climate. This inherent inconsistency of wood parts can impair a piano&apos;s tone and
              touch — and lead to costly repairs and maintenance.
            </p>
          </div>
        </div>
      </section>

      {/* Section: The Benefits of ABS-Carbon */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
              The Benefits of ABS-Carbon
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-white border border-kawai-neutral rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-kawai-black mb-3">{benefit.title}</h3>
                  <p className="text-kawai-charcoal leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Carbon Fiber Is The Future */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Carbon Fiber Is The Future
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-8">
              Carbon fiber is already trusted in some of the world&apos;s most demanding
              applications — from aerospace engineering to elite athletics. Its adoption in piano
              design follows a long tradition of materials science improving performance where
              precision matters most.
            </p>
            <ul className="space-y-3 mb-8">
              {carbonUses.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="text-kawai-red mt-1">→</span>
                  <div>
                    <strong className="text-kawai-black">{item.title}:</strong>{' '}
                    <span className="text-kawai-charcoal">{item.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-kawai-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] mb-4">
            Experience the Millennium III Action
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Visit an authorized Kawai dealer to feel the speed, power, and control of ABS-Carbon
            technology for yourself.
          </p>
          <Link
            href="/find-a-dealer"
            className="inline-block bg-kawai-red text-white px-8 py-3 rounded font-medium hover:bg-kawai-red-700 transition-colors"
          >
            Find a Dealer
          </Link>
        </div>
      </section>
    </div>
  )
}
