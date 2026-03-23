import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How a Piano Action Works | Kawai Pianos',
  description:
    'An in-depth look at the intricate mechanism that transforms a pianist\'s touch into musical sound — and why Kawai\'s Millennium III Action represents its fifth evolution.',
}

const actionBenefits = [
  {
    title: 'Strength',
    description:
      'Adding carbon fiber to our renowned ABS-Styran parts increased strength by 90%.',
  },
  {
    title: 'Speed',
    description:
      'With lighter ABS-Carbon parts, the Millennium III Action is approximately 25% faster than a conventional wooden action.',
  },
  {
    title: 'Power',
    description:
      'ABS-Carbon is more rigid and sends more energy to the hammer with every keystroke.',
  },
  {
    title: 'Control',
    description:
      'The jack is redesigned with a microscopic surface texture to provide unparalleled control for pianissimo playing.',
  },
]

export default function PianoActionPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Technology</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              How a Piano Action Works
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              An in-depth look at the intricate mechanism that transforms a pianist&apos;s touch
              into musical sound — and why Kawai&apos;s Millennium III Action represents its fifth
              evolution.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Professionals Choose Kawai */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Professionals Choose Kawai
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              In the beginning was the conventional wooden piano action. It evolved through three
              generations — and it was good. The 1980s brought the fourth generation of the piano
              action, the Kawai Ultra-Responsive ABS Action — and it was much better. Now, you can
              experience the fifth evolution of piano touch — the revolutionary Millennium III Action
              with carbon composite parts.
            </p>
          </div>
        </div>
      </section>

      {/* Section: How Does a Piano Action Work? */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              How Does a Piano Action Work?
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              A piano action is an amazing mechanism with an enormous responsibility. Its crucial
              task is to transfer musical energy seamlessly from the pianist&apos;s fingers to the
              piano strings. To accomplish it properly, all 8,000+ parts of the piano action must
              remain stable and work together perfectly at all times. Even the smallest dimensional
              or positional change in any component part can hurt piano performance.
            </p>
          </div>
        </div>
      </section>

      {/* Section: The Big Picture */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Big Picture
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              When a piano key is pressed, a corresponding hammer rises to strike the string (or
              strings) causing the highly-tensioned strings to vibrate. The energy of the vibrating
              string is transferred to the soundboard through a component called the
              &ldquo;bridge.&rdquo; Because the soundboard is mounted with tremendous tension
              (similar to the tensioned head of a drum), it resonates intensely when sound energy is
              received. It is the resonating vibrations of the soundboard that a listener hears as
              &ldquo;tone.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Section: The Inner Workings */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Inner Workings
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              When a grand piano key is depressed, the other end of the key lifts upward with equal
              force. This key movement lifts a screw known as the &ldquo;capstan.&rdquo; The capstan
              is located under a multi-faceted hinged assembly called the &ldquo;wippen&rdquo; that
              contains an L-shaped part called the &ldquo;jack.&rdquo; The upward force of the
              capstan causes the wippen to rise, thrusting the jack upward into another component
              called the &ldquo;knuckle&rdquo; fixed to one end of the hammer shank. As the knuckle
              and hammer shank are forced upward, the felt hammer is propelled toward the string.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Creating Tone */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Creating Tone
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              The hammer must bounce off (or &ldquo;release&rdquo;) from the string immediately so
              the strings can vibrate — even if the player holds the key down. As the jack raises the
              knuckle, it engages a component called the &ldquo;let-off button&rdquo; that causes
              the jack to release from the knuckle at the precise moment before the hammer hits the
              string. This &ldquo;let-off&rdquo; allows the hammer to fall away so the strings can
              vibrate freely after the strike.
            </p>
          </div>
        </div>
      </section>

      {/* Section: The Problem of Repetition */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Problem of Repetition
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              What if the player wants to repeat the same note immediately? The end of the key is
              fitted with a component called the &ldquo;backcheck&rdquo; that rises as the key is
              pressed and catches the hammer as it rebounds from the string. The raised backcheck
              holds the hammer just under the strings awaiting another strike. If the note is
              repeated, the key only needs to be raised slightly for the jack to reset. This
              inventive design makes rapid repeated notes possible.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Making the Tone Stop */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Making the Tone Stop
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              When a key is not being played, a component called the &ldquo;damper&rdquo; rests on
              top of the corresponding strings. When a key is initially pressed, the key pushes up
              on a component called the &ldquo;damper lever&rdquo; which lifts the &ldquo;damper
              felts&rdquo; off the strings. The pianist can also use the &ldquo;damper pedal&rdquo;
              (sustain pedal) to lift all dampers at one time.
            </p>
          </div>
        </div>
      </section>

      {/* Section: The Critical Importance of Stability */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Critical Importance of Stability
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              A piano action requires thousands of individual components to work together perfectly
              — every time, over time. That&apos;s why Kawai introduced composite action parts over
              50 years ago. Even the slightest change in the size of a part or its precise position
              will affect both piano tone and touch. For example, if the shrinking or swelling of
              any component causes the position of a hammer to be misaligned by as little as one
              millimeter, the tone and touch of a note will be compromised.
            </p>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Since 1970, Kawai has invested millions of dollars to create piano actions with
              composite materials, including leading-edge carbon fiber. Because composite action
              parts are virtually impervious to shrinking, swelling or warping due to humidity, they
              remain extremely stable over time.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Features of the Millennium III ABS-Carbon Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-8">
              Features of the Millennium III ABS-Carbon Action
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {actionBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-kawai-pearl border border-kawai-neutral rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-kawai-black mb-3">{benefit.title}</h3>
                  <p className="text-kawai-charcoal leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why You Need a Modern Piano Action */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Why You Need a Modern Piano Action
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              The &ldquo;action&rdquo; is the mechanism inside a piano that transforms the
              player&apos;s touch on a key into a hammer strike. In the early 18th century, Italian
              inventor Bartolomeo Christofori created the first piano action. In the 19th century,
              French piano maker Sebastian Erard developed the &ldquo;double escapement&rdquo;
              design. Then, at the halfway point of the 20th Century, evolution stopped — except at
              Kawai.
            </p>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              As early as the 1960s, Kawai craftsmen recognized the serious problems associated with
              wood for mechanical action parts. Kawai invested millions of dollars to develop
              composite action parts, first introduced in 1970. By the 1990s, these efforts resulted
              in the Kawai Ultra-Responsive Action — the fourth major evolution. Kawai continued
              with the introduction of carbon composites — the Millennium III Action launched the
              &ldquo;5th Evolution.&rdquo;
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              Today, nearly fifty years after its historic introduction of composite parts, Kawai
              continues to be the leader of innovation — now the recipient of over 50 major
              international awards.
            </p>
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
            The best way to understand the difference is to play it. Find an authorized Kawai dealer
            and feel five generations of innovation beneath your fingers.
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
