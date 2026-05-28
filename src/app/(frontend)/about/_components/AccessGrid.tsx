import Link from 'next/link'

export default function AccessGrid() {
  return (
    <section className="bg-kawai-pearl py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">EXPLORE</p>
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-10">
            Go Deeper
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-kawai-neutral rounded-lg p-8 hover:border-kawai-red transition-colors duration-200">
              <h3 className="text-xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-2">
                Awards &amp; Recognition
              </h3>
              <p className="text-kawai-charcoal text-sm leading-relaxed mb-5">
                More than 50 international awards for product design and service excellence.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/company/awards"
                  className="text-kawai-red font-medium hover:text-kawai-red-700 transition-colors duration-200"
                >
                  View our awards →
                </Link>
                <Link
                  href="/the-winners-choice"
                  className="text-kawai-charcoal text-sm hover:text-kawai-red transition-colors duration-200"
                >
                  The Winner&apos;s Choice →
                </Link>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white border border-kawai-neutral rounded-lg p-8 hover:border-kawai-red transition-colors duration-200">
              <h3 className="text-xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-2">
                Institutions &amp; Owners
              </h3>
              <p className="text-kawai-charcoal text-sm leading-relaxed mb-5">
                Universities, conservatories, and concert halls worldwide perform on Kawai.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/distinguished-owners"
                  className="text-kawai-red font-medium hover:text-kawai-red-700 transition-colors duration-200"
                >
                  Distinguished owners →
                </Link>
                <Link
                  href="/institutions/epic-program"
                  className="text-kawai-charcoal text-sm hover:text-kawai-red transition-colors duration-200"
                >
                  The EPIC program →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
