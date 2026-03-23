import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wooden Key Actions | Kawai Pianos',
  description:
    "Kawai's award-winning keyboard actions — from wooden-key grand feel mechanisms to responsive hammer designs — give players complete freedom of musical expression.",
}

const woodenKeyActions = [
  {
    name: 'Grand Feel (GF) and Grand Feel II (GFII)',
    description:
      "The latest in Kawai's long line of wooden key actions. Both offer graded hammers, key counterweights, \"Ivory Touch\" key surfaces, Let-off and triple sensor key detection, and the longest key length of any Kawai digital piano. The GFII also adds \"Ebony Touch\" key surfaces.",
  },
  {
    name: 'Grand Feel Compact (GF-C)',
    description:
      "Designed to reproduce authentic touch weight characteristics of the Grand Feel actions within a smaller form factor. Retains the long wooden key sticks and 'seesaw' mechanism.",
  },
  {
    name: 'RM3II',
    description:
      'Earlier version offering many of the same attributes as the GF action, including the center pivot mechanical design, graded hammers, key counterweights, "Ivory Touch" key surfaces, Let-off and triple sensor key detection.',
  },
  {
    name: 'AWA PROII',
    description:
      'Earlier version wooden-key action with the mechanical design, graded hammers and key counterweights.',
  },
]

const plasticKeyActions = [
  {
    name: 'Responsive Hammer (RHII and RHIII)',
    description:
      'Latest versions featuring "Ivory Touch" key surfaces, triple sensor key detection, and Let-off. The RHIII adds key counterbalancing.',
  },
  {
    name: 'Responsive Hammer Compact (RHC)',
    description:
      'Reproduces the distinctive touch of an acoustic grand piano with spring-less technology. Designed along the RHIII principles in a more compact and lightweight package.',
  },
  {
    name: 'AHAIV-F',
    description:
      'Earlier version action with graded hammers, offering superior touch in entry-level Kawai digital pianos.',
  },
]

const actionTable: { action: string; instruments: string }[] = [
  { action: 'GF', instruments: 'CS10, CS7, CP1, CP2, MP11, MP11SE' },
  { action: 'GFII', instruments: 'CA97, CA67, CS8, CS11, CA78, CA98' },
  { action: 'RM3II', instruments: 'VPC1' },
  { action: 'AWA PROII', instruments: 'CE220' },
  { action: 'RHII', instruments: 'MP7, CS4, CP3' },
  { action: 'RHIII', instruments: 'CN25, CN35, ES8, CN27, CN37, MP7SE' },
  { action: 'RHC', instruments: 'ES110' },
  { action: 'AHA IV-F', instruments: 'ES100, KDP90, KCP90, CL26' },
]

export default function WoodenKeyActionsPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Hero */}
      <section className="bg-kawai-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">Technology</p>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-serif)] mb-4">
              Wooden Key Actions
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Kawai&apos;s award-winning keyboard actions — from wooden-key grand feel mechanisms to
              responsive hammer designs — give players complete freedom of musical expression.
            </p>
          </div>
        </div>
      </section>

      {/* The Ultimate in Feel */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              The Ultimate in Feel
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai&apos;s award-winning digital piano actions have long been known for their
              quality construction and authentic feel. As one of the world&apos;s premier builders
              of acoustic pianos, Kawai has long understood the importance of an instrument&apos;s
              touch to the player. Without a keyboard action that responds perfectly to an
              artist&apos;s commands, a piano can never create the precise sound that the artist
              seeks.
            </p>
            <p className="text-kawai-charcoal leading-relaxed">
              Kawai has created two types of digital piano actions — ones with traditional wooden
              keys and ones with plastic keys.
            </p>
          </div>
        </div>
      </section>

      {/* Wooden-Key Actions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Wooden-Key Actions
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-6">
              Kawai&apos;s wooden-key actions have long been heralded for providing the finest touch
              found on any digital piano. All 88 keys are made entirely of wood to ensure the
              natural feel of a grand piano. These actions feature extra-long wooden keys for
              greater control, plus a mechanical design similar to that found in Kawai&apos;s
              acoustic grand pianos.
            </p>
            <p className="text-kawai-charcoal leading-relaxed mb-10">
              The extended length of the wooden key allows for a pivot point in the middle of the
              key, pushing the hammers in an upward motion from the back of the key (the same as a
              grand piano action). This critical element provides the player with a level of
              expression and control normally found only in grand piano actions.
            </p>

            <div className="space-y-4">
              {woodenKeyActions.map((action) => (
                <div
                  key={action.name}
                  className="border-l-4 border-kawai-red bg-kawai-pearl rounded-r-lg p-6"
                >
                  <h4 className="font-semibold text-kawai-black mb-2">{action.name}</h4>
                  <p className="text-kawai-charcoal text-sm leading-relaxed">{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plastic-Key Actions */}
      <section className="py-16 bg-kawai-pearl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Plastic-Key Actions
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-10">
              These actions use an industry-standard design where the pivot point is placed at the
              back of the key. They utilize a hammer component under the keys that creates
              mechanical movement and feel similar to an acoustic piano. The hammer weights are
              &ldquo;graded&rdquo; — bass keys are heaviest, gradually becoming lighter moving up
              the keyboard.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {plasticKeyActions.map((action) => (
                <div
                  key={action.name}
                  className="bg-white border border-kawai-neutral rounded-lg p-6"
                >
                  <h4 className="font-semibold text-kawai-black mb-3">{action.name}</h4>
                  <p className="text-kawai-charcoal text-sm leading-relaxed">{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action-to-Instrument Reference */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-6">
              Action-to-Instrument Reference
            </h2>
            <p className="text-kawai-charcoal leading-relaxed mb-8">
              Use the table below to identify which action is found in each Kawai instrument.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-kawai-neutral text-sm">
                <thead>
                  <tr className="bg-kawai-black text-white">
                    <th className="text-left px-6 py-3 font-semibold tracking-wide">Action</th>
                    <th className="text-left px-6 py-3 font-semibold tracking-wide">Instruments</th>
                  </tr>
                </thead>
                <tbody>
                  {actionTable.map((row, index) => (
                    <tr
                      key={row.action}
                      className={index % 2 === 0 ? 'bg-kawai-pearl' : 'bg-white'}
                    >
                      <td className="px-6 py-3 font-medium text-kawai-black border-t border-kawai-neutral">
                        {row.action}
                      </td>
                      <td className="px-6 py-3 text-kawai-charcoal border-t border-kawai-neutral">
                        {row.instruments}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-kawai-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-serif)] mb-4">
            Feel the Difference
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Try Kawai&apos;s wooden-key actions for yourself at an authorized dealer near you.
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
