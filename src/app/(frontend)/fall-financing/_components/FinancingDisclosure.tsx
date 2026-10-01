import { disclosures, SECTION } from './campaign'

/**
 * The Supporting Disclosure — §3 section 8.
 *
 * ── §4.4, which governs everything about this file ───────────────────────
 *
 * The Supporting Disclosure must be visible HTML text on page load. Not an
 * image. Not only a link to the PDF. And explicitly NOT behind an accordion, a
 * tab, a "read more" toggle or a modal. A "See financing terms" dialog held
 * this content at one point and was removed for that reason; if a future change
 * wants the page quieter, the answer is not to hide this.
 *
 * It must also stay legible: WCAG AA 4.5:1 against its background, recommended
 * minimum 12px. `--body` on `--ground` is Walnut on Ivory at 10.14:1, and the
 * sizes below bottom out at 0.8rem (12.8px) rather than the 0.76rem used for
 * ordinary fine print elsewhere on the page.
 *
 * ── Why the headline is not repeated here ────────────────────────────────
 *
 * It used to be: this file opened with its own copy of "0% for the first 24
 * months (APR 8.01%)*" and the terms sentence, a few hundred pixels below the
 * section head that had already said both. The approved banner states the
 * headline once and puts the details link and the fine print directly under
 * it, so the page does the same — FinancingBlock's lockup heads this
 * disclosure, and this file renders what the banner has below that line.
 *
 * That is a §4.1 improvement, not a §4.4 risk. Every sentence below is still
 * visible text on load; what is gone is a second copy of a regulated headline
 * that could drift out of step with the first.
 *
 * ── §4.3 ─────────────────────────────────────────────────────────────────
 *
 * This section is where both footnote marks land: `*` on the worked example,
 * `**` on the exclusions line. Every mark used anywhere on the page resolves
 * here — `*` from the headline, `**` from the subhead — which is what "both
 * footnotes must appear on this same page" requires.
 * `financing-compliance.test.ts` fails if a mark is used with no footnote.
 */
export function FinancingDisclosure() {
  return (
    <div id={SECTION.disclosures} className="scroll-mt-20">
      {/* ── There is no "Click here for details" link here ───────────────
          §5 asks for one, pointing at the 2026 Financing Disclosure PDF, and
          `disclosures.detailsLink` still holds the label and the URL. It is
          not rendered because the URL it holds 404s: the requirements marked
          that path "To confirm" and no PDF was ever published at it. A bold
          link promising the full terms and delivering a 404 is worse for a
          reader than no link, and worse for §5 than an honest omission.

          To restore it: publish the PDF (or correct DISCLOSURE_PDF in
          campaign.ts to wherever it lands), then put the anchor back here. The
          disclosure text below is what §4.4 requires and does not depend on
          the link either way. */}

      {/* One column, in the order the marks are introduced: the lender terms,
          then `*`, then `**`. This was a two-column grid spanning the full
          104rem container, which set 13px type in two 45ch columns either side
          of a 4rem gutter — a shape that reads as two unrelated blocks of
          small print rather than one disclosure. Keep it a single stack. */}
      <div className="space-y-3.5">
        {disclosures.financingTerms.map((line) => (
          <p key={line} className="text-[0.8rem] leading-relaxed text-[color:var(--body)]">
            {line}
          </p>
        ))}

        {/* The * footnote. Its mark is on the headline in FinancingBlock. */}
        <p className="text-[0.8rem] leading-relaxed text-[color:var(--body)]">
          {disclosures.financingExample}
        </p>

        {/* The ** footnote. Its mark is on the subhead in FinancingBlock. */}
        <p className="text-[0.8rem] leading-relaxed text-[color:var(--body)]">
          {disclosures.exclusions}
        </p>
      </div>
    </div>
  )
}
