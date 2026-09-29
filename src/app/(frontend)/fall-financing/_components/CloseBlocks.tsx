import { Q4_CONTAINER } from './PromoStyles'
import { PromoButton, PromoLink } from './PromoUI'
import { LeadForm } from '@/components/campaign-lead'
import { dealer, questions, disclosures } from './campaign'

/**
 * The close: where the offers are redeemed, how to ask about them, and the
 * terms behind them.
 *
 * The dealer block is the page's one dark sheet. Three offers have each just
 * made their case on paper; the ink flips once, at the point where all three
 * converge on the same action, so the darkness marks the turn rather than
 * decorating every other section.
 */
export function DealerBlock() {
  return (
    <section className="bg-[color:var(--ink)]">
      <div className={`${Q4_CONTAINER} py-20 md:py-28`}>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-20">
          <div>
            <h2 className="q4-h2 max-w-[16ch] text-white">{dealer.heading}</h2>
            <p className="q4-lede mt-5 text-white/70">{dealer.body}</p>
          </div>

          <div className="md:pb-1">
            <p className="q4-num leading-[0.85] text-white" style={{ fontSize: 'clamp(4rem, 11vw, 8rem)' }}>
              {dealer.count}
            </p>
            <p className="mt-3 max-w-[22ch] text-[0.95rem] leading-snug text-white/55">
              {dealer.countLabel}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <PromoButton tone="dark" />
              <PromoLink href="/find-a-dealer" tone="dark">
                {dealer.locatorCta}
              </PromoLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The enquiry form, on the page rather than only behind a button. Someone who
 * has read to the bottom should not have to click to discover a form exists.
 * `LeadForm` renders content with no surface of its own, so the same definition
 * serves this placement and the modal every button opens.
 */
export function QuestionsBlock() {
  return (
    <section
      id="questions"
      className="scroll-mt-20 border-b border-[color:var(--rule)] bg-[color:var(--paper)]"
    >
      <div className={`${Q4_CONTAINER} py-20 md:py-28`}>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-20">
          <div>
            <h2 className="q4-h2 max-w-[14ch] text-[color:var(--ink)]">{questions.heading}</h2>
            <p className="q4-lede mt-5 text-[color:var(--muted)]">{questions.body}</p>
          </div>

          <div className="border border-[color:var(--rule-soft)] bg-[color:var(--card)] p-6 sm:p-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Terms for all three offers.
 *
 * Set quietly but not hidden: small type at a readable measure, grouped by the
 * offer each clause belongs to so a reader can find the one they care about.
 * Every figure is formatted from the same FinancingTerms object the blocks
 * above read, and `plan.test.ts` pins the worked example to what `planFor()`
 * computes — so the disclosures cannot quietly stop describing the page.
 */
export function DisclosuresBlock() {
  return (
    <section id="disclosures" className="scroll-mt-20 bg-[color:var(--paper)]">
      <div className={`${Q4_CONTAINER} py-14 md:py-20`}>
        <h2 className="text-[0.95rem] font-medium text-[color:var(--ink)]">
          {disclosures.heading}
        </h2>

        <div className="mt-5 grid gap-x-16 gap-y-6 border-t border-[color:var(--rule)] pt-6 md:grid-cols-2">
          <p className="max-w-[60ch] text-[0.78rem] leading-relaxed text-[color:var(--muted-dim)]">
            {disclosures.general}
          </p>

          <div className="space-y-3">
            {disclosures.financingTerms.map((line) => (
              <p
                key={line}
                className="max-w-[60ch] text-[0.78rem] leading-relaxed text-[color:var(--muted-dim)]"
              >
                {line}
              </p>
            ))}
            <p className="max-w-[60ch] text-[0.78rem] leading-relaxed text-[color:var(--muted-dim)]">
              {disclosures.financingExample}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
