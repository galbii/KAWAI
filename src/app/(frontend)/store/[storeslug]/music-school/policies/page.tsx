import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'
import { cn } from '@/lib/utils'

type Props = { params: Promise<{ storeslug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)
  if (!school) return { title: 'Tuition & Policies' }
  return {
    title: `Tuition & Policies | ${school.officialName || school.schoolName}`,
    description: `Lesson rates, fees, and policies for ${school.officialName || school.schoolName}.`,
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="pt-14 pb-2 flex items-baseline justify-between">
      <span className="text-[10px] tracking-[0.25em] uppercase text-kawai-charcoal/40 font-medium">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[10px] tracking-[0.2em] uppercase text-kawai-charcoal/30">
          {count} item{count !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

function PricingTable({
  semester,
}: {
  semester: {
    semester: string
    weeks?: string
    price30min?: string
    price45min?: string
    price60min?: string
    registrationDeadline?: string
    fullSemesterPrice30?: number
    fullSemesterPrice45?: number
    fullSemesterPrice60?: number
    monthlyRates?: Array<{ month?: string; price30?: number; price45?: number; price60?: number }>
    lessonPackages?: Array<{
      lessonCount?: number
      price30?: number
      price45?: number
      price60?: number
    }>
    payInFullDeadline?: string
    semesterNotes?: string
  }
}) {
  const hasMonthly =
    Array.isArray(semester.monthlyRates) && semester.monthlyRates.length > 0
  const hasPackages =
    Array.isArray(semester.lessonPackages) && semester.lessonPackages.length > 0
  const hasStructured =
    semester.fullSemesterPrice30 != null ||
    semester.fullSemesterPrice45 != null ||
    semester.fullSemesterPrice60 != null

  // Monthly breakdown table
  if (hasMonthly) {
    const months = semester.monthlyRates!
    return (
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-kawai-neutral">
              <th className="text-left text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 pr-4">
                Duration
              </th>
              {hasStructured && (
                <th className="text-right text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 px-4">
                  Full Semester
                </th>
              )}
              {months.map((m, i) => (
                <th
                  key={i}
                  className="text-right text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 px-4"
                >
                  {m.month ?? `Month ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: '30 min',
                full: semester.fullSemesterPrice30,
                monthly: months.map((m) => m.price30),
              },
              {
                label: '45 min',
                full: semester.fullSemesterPrice45,
                monthly: months.map((m) => m.price45),
              },
              {
                label: '60 min',
                full: semester.fullSemesterPrice60,
                monthly: months.map((m) => m.price60),
              },
            ]
              .filter(
                (row) =>
                  row.full != null || row.monthly.some((v) => v != null),
              )
              .map((row, ri) => (
                <tr
                  key={row.label}
                  className={cn(
                    'border-b border-kawai-neutral/40',
                    ri % 2 === 0 ? 'bg-kawai-pearl' : 'bg-white',
                  )}
                >
                  <td className="py-2.5 pr-4 font-medium text-kawai-black text-[13px]">
                    {row.label}
                  </td>
                  {hasStructured && (
                    <td className="py-2.5 px-4 text-right text-kawai-charcoal text-[13px]">
                      {row.full != null ? `$${row.full}` : '—'}
                    </td>
                  )}
                  {row.monthly.map((price, mi) => (
                    <td
                      key={mi}
                      className="py-2.5 px-4 text-right text-kawai-charcoal text-[13px]"
                    >
                      {price != null ? `$${price}` : '—'}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Lesson packages table (Summer style)
  if (hasPackages) {
    const packages = semester.lessonPackages!
    return (
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-kawai-neutral">
              <th className="text-left text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 pr-4">
                Duration
              </th>
              {packages.map((pkg, i) => (
                <th
                  key={i}
                  className="text-right text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 px-4"
                >
                  {pkg.lessonCount != null ? `${pkg.lessonCount} Lessons` : `Package ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: '30 min',
                prices: packages.map((p) => p.price30),
              },
              {
                label: '45 min',
                prices: packages.map((p) => p.price45),
              },
              {
                label: '60 min',
                prices: packages.map((p) => p.price60),
              },
            ]
              .filter((row) => row.prices.some((v) => v != null))
              .map((row, ri) => (
                <tr
                  key={row.label}
                  className={cn(
                    'border-b border-kawai-neutral/40',
                    ri % 2 === 0 ? 'bg-kawai-pearl' : 'bg-white',
                  )}
                >
                  <td className="py-2.5 pr-4 font-medium text-kawai-black text-[13px]">
                    {row.label}
                  </td>
                  {row.prices.map((price, pi) => (
                    <td
                      key={pi}
                      className="py-2.5 px-4 text-right text-kawai-charcoal text-[13px]"
                    >
                      {price != null ? `$${price}` : '—'}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Structured prices (no breakdown)
  if (hasStructured) {
    return (
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-kawai-neutral">
              <th className="text-left text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 pr-4">
                Duration
              </th>
              <th className="text-right text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 px-4">
                Full Semester
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: '30 min', price: semester.fullSemesterPrice30 },
              { label: '45 min', price: semester.fullSemesterPrice45 },
              { label: '60 min', price: semester.fullSemesterPrice60 },
            ]
              .filter((r) => r.price != null)
              .map((row, ri) => (
                <tr
                  key={row.label}
                  className={cn(
                    'border-b border-kawai-neutral/40',
                    ri % 2 === 0 ? 'bg-kawai-pearl' : 'bg-white',
                  )}
                >
                  <td className="py-2.5 pr-4 font-medium text-kawai-black text-[13px]">
                    {row.label}
                  </td>
                  <td className="py-2.5 px-4 text-right text-kawai-charcoal text-[13px]">
                    ${row.price}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Legacy text fallback
  const legacyRows = [
    { label: '30 min', value: semester.price30min },
    { label: '45 min', value: semester.price45min },
    { label: '60 min', value: semester.price60min },
  ].filter((r) => r.value)

  if (legacyRows.length === 0) return null

  return (
    <div className="mt-5 space-y-2">
      {legacyRows.map((row) => (
        <div key={row.label} className="flex justify-between items-center py-2 border-b border-kawai-neutral/40">
          <span className="text-[13px] font-medium text-kawai-black">{row.label}</span>
          <span className="text-[13px] text-kawai-charcoal">{row.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function PoliciesPage({ params }: Props) {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  if (!school) notFound()

  const tuitionSemesters: Array<{
    id?: string
    semester: string
    weeks?: string
    price30min?: string
    price45min?: string
    price60min?: string
    registrationDeadline?: string
    fullSemesterPrice30?: number
    fullSemesterPrice45?: number
    fullSemesterPrice60?: number
    monthlyRates?: Array<{ month?: string; price30?: number; price45?: number; price60?: number }>
    lessonPackages?: Array<{ lessonCount?: number; price30?: number; price45?: number; price60?: number }>
    payInFullDeadline?: string
    semesterNotes?: string
  }> = school.tuitionSemesters ?? []

  const fees: Array<{ id?: string; feeName: string; amount?: string; notes?: string }> =
    school.fees ?? []

  const policies: Array<{ id?: string; title: string; body: string }> =
    school.policies ?? []

  const faqs: Array<{ id?: string; question: string; answer: string }> =
    school.faqs ?? []

  const groupClasses: Array<{
    id?: string
    name: string
    description?: string
    ageRange?: string
    studentsMin?: number
    studentsMax?: number
    tuition?: number
    schedule?: string
    sessionsInfo?: string
  }> = school.groupClasses ?? []

  const makeupOptions: Array<{ option?: string }> = school.makeupOptions ?? []

  // Determine if any policy content exists
  const hasNamedPolicies = policies.length > 0
  const hasWithdrawal = !!(
    school.withdrawalPolicy ||
    school.withdrawalEmail ||
    school.withdrawalNoticeDays != null
  )
  const hasMakeup = !!(school.makeupLessonPolicy || makeupOptions.length > 0)
  const hasProtocol = !!school.lessonProtocol
  const hasFoodDrinks = !!school.foodDrinksPolicy
  const hasPhoto = !!school.photoReleasePolicy
  const hasPolicies =
    hasNamedPolicies || hasWithdrawal || hasMakeup || hasProtocol || hasFoodDrinks || hasPhoto

  const hasPaymentInfo = !!(school.tuitionDueDate || school.acceptedPayments)

  return (
    <div className="bg-kawai-pearl min-h-screen">

      {/* ─── SLIM HEADER ──────────────────────────────────────── */}
      <header className="bg-kawai-black border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 md:pr-24 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
              alt="Kawai Music School"
              className="h-7 w-auto opacity-80"
            />
            <div className="h-4 w-px bg-white/10" />
            <h1 className="text-white/60 text-[11px] tracking-[0.2em] uppercase font-medium">
              Tuition &amp; Policies
            </h1>
          </div>
          <Link
            href={`/store/${storeslug}/music-school`}
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[11px] tracking-[0.15em] uppercase transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
            </svg>
            Overview
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:pr-24 pb-24">

        {/* ─── TUITION RATES ──────────────────────────────────── */}
        {tuitionSemesters.length > 0 && (
          <section>
            <SectionHeader label="Lesson Rates" />
            <div className="border-t border-kawai-neutral mt-2">
              {tuitionSemesters.map((sem) => (
                <div
                  key={sem.id ?? sem.semester}
                  className="border-b border-kawai-neutral py-10"
                >
                  {/* Semester header */}
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1">
                    <h2 className="text-2xl font-[family-name:var(--font-brand-luxury)] text-kawai-black">
                      {sem.semester}
                    </h2>
                    {sem.registrationDeadline && (
                      <span className="text-[11px] text-kawai-charcoal/50 border border-kawai-neutral px-2.5 py-1 rounded-full">
                        Reg. deadline: {sem.registrationDeadline}
                      </span>
                    )}
                  </div>
                  {sem.weeks && (
                    <p className="text-[12px] tracking-[0.12em] uppercase text-kawai-charcoal/40 mb-3">
                      {sem.weeks}
                    </p>
                  )}

                  {/* Pricing */}
                  <PricingTable semester={sem} />

                  {/* Pay-in-full deadline */}
                  {sem.payInFullDeadline && (
                    <p className="mt-4 text-[12px] text-kawai-charcoal/60 italic">
                      Pay-in-full discount available through {sem.payInFullDeadline}.
                    </p>
                  )}

                  {/* Semester notes */}
                  {sem.semesterNotes && (
                    <p className="mt-3 text-[13px] text-kawai-charcoal leading-relaxed">
                      {sem.semesterNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── GROUP CLASS RATES ──────────────────────────────── */}
        {groupClasses.length > 0 && (
          <section>
            <SectionHeader label="Group Class Rates" count={groupClasses.length} />
            <div className="border-t border-kawai-neutral mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {groupClasses.map((cls) => (
                <div
                  key={cls.id ?? cls.name}
                  className="bg-white border border-kawai-neutral rounded-lg p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-snug">
                      {cls.name}
                    </h3>
                    {cls.tuition != null && (
                      <span className="flex-shrink-0 text-kawai-red font-semibold text-base font-[family-name:var(--font-brand-luxury)]">
                        ${cls.tuition}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {cls.ageRange && (
                      <span className="text-[11px] text-kawai-charcoal/60 border border-kawai-neutral px-2.5 py-1 rounded-full">
                        Ages {cls.ageRange}
                      </span>
                    )}
                    {(cls.studentsMin != null || cls.studentsMax != null) && (
                      <span className="text-[11px] text-kawai-charcoal/60 border border-kawai-neutral px-2.5 py-1 rounded-full">
                        {cls.studentsMin != null && cls.studentsMax != null
                          ? `${cls.studentsMin}–${cls.studentsMax} students`
                          : cls.studentsMin != null
                          ? `Min ${cls.studentsMin} students`
                          : `Max ${cls.studentsMax} students`}
                      </span>
                    )}
                  </div>

                  {cls.description && (
                    <p className="text-[13px] text-kawai-charcoal leading-relaxed mb-3">
                      {cls.description}
                    </p>
                  )}

                  {cls.schedule && (
                    <p className="text-[12px] text-kawai-charcoal/60">
                      <span className="font-medium text-kawai-charcoal">Schedule:</span>{' '}
                      {cls.schedule}
                    </p>
                  )}
                  {cls.sessionsInfo && (
                    <p className="text-[12px] text-kawai-charcoal/60 mt-1">
                      {cls.sessionsInfo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── FEES ───────────────────────────────────────────── */}
        {fees.length > 0 && (
          <section>
            <SectionHeader label="Fees" count={fees.length} />
            <div className="border-t border-kawai-neutral mt-2 pt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-kawai-neutral">
                    <th className="text-left text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 pr-6">
                      Fee
                    </th>
                    <th className="text-right text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 px-4">
                      Amount
                    </th>
                    <th className="text-left text-[10px] tracking-[0.18em] uppercase text-kawai-red/80 font-semibold pb-2 pl-6">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee, fi) => (
                    <tr
                      key={fee.id ?? fee.feeName}
                      className={cn(
                        'border-b border-kawai-neutral/40',
                        fi % 2 === 0 ? 'bg-kawai-pearl' : 'bg-white',
                      )}
                    >
                      <td className="py-3 pr-6 font-medium text-kawai-black text-[13px]">
                        {fee.feeName}
                      </td>
                      <td className="py-3 px-4 text-right text-kawai-charcoal text-[13px] whitespace-nowrap">
                        {fee.amount ?? '—'}
                      </td>
                      <td className="py-3 pl-6 text-kawai-charcoal/70 text-[12px]">
                        {fee.notes ?? ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ─── PAYMENT INFO ───────────────────────────────────── */}
        {hasPaymentInfo && (
          <section>
            <SectionHeader label="Payment Information" />
            <div className="border-t border-kawai-neutral mt-2 pt-6">
              <div className="bg-white border border-kawai-neutral rounded-lg p-6 flex flex-col sm:flex-row gap-6">
                {school.tuitionDueDate && (
                  <div className="flex-1">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-kawai-charcoal/40 font-medium mb-1">
                      Tuition Due
                    </p>
                    <p className="text-kawai-black text-[15px] font-medium">
                      {school.tuitionDueDate}
                    </p>
                  </div>
                )}
                {school.acceptedPayments && (
                  <div className="flex-1">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-kawai-charcoal/40 font-medium mb-1">
                      Accepted Payments
                    </p>
                    <p className="text-kawai-charcoal text-[14px] leading-relaxed">
                      {school.acceptedPayments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ─── POLICIES ───────────────────────────────────────── */}
        {hasPolicies && (
          <section>
            <SectionHeader label="Policies" />
            <div className="border-t border-kawai-neutral mt-2 pt-2">

              {/* Named policies from CMS array */}
              {policies.map((policy) => (
                <details
                  key={policy.id ?? policy.title}
                  className="group border-b border-kawai-neutral"
                >
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none hover:text-kawai-black transition-colors">
                    <span className="text-[15px] font-medium text-kawai-black">
                      {policy.title}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-kawai-red flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    >
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                  </summary>
                  <div className="pb-6 pr-8">
                    <p className="text-[14px] text-kawai-charcoal leading-relaxed">
                      {policy.body}
                    </p>
                  </div>
                </details>
              ))}

              {/* Withdrawal Policy */}
              {hasWithdrawal && (
                <details className="group border-b border-kawai-neutral">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none hover:text-kawai-black transition-colors">
                    <span className="text-[15px] font-medium text-kawai-black">
                      Withdrawal Policy
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-kawai-red flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    >
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                  </summary>
                  <div className="pb-6 pr-8 space-y-3">
                    {school.withdrawalPolicy && (
                      <p className="text-[14px] text-kawai-charcoal leading-relaxed">
                        {school.withdrawalPolicy}
                      </p>
                    )}
                    {school.withdrawalNoticeDays != null && (
                      <p className="text-[13px] text-kawai-charcoal/70">
                        Written notice required{' '}
                        <strong className="text-kawai-black">
                          {school.withdrawalNoticeDays} days
                        </strong>{' '}
                        in advance.
                      </p>
                    )}
                    {school.withdrawalEmail && (
                      <p className="text-[13px] text-kawai-charcoal/70">
                        Submit withdrawal requests to{' '}
                        <a
                          href={`mailto:${school.withdrawalEmail}`}
                          className="text-kawai-red underline underline-offset-2 hover:text-kawai-red-700 transition-colors"
                        >
                          {school.withdrawalEmail}
                        </a>
                        .
                      </p>
                    )}
                  </div>
                </details>
              )}

              {/* Makeup Lessons */}
              {hasMakeup && (
                <details className="group border-b border-kawai-neutral">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none hover:text-kawai-black transition-colors">
                    <span className="text-[15px] font-medium text-kawai-black">
                      Makeup Lessons
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-kawai-red flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    >
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                  </summary>
                  <div className="pb-6 pr-8 space-y-4">
                    {school.makeupLessonPolicy && (
                      <p className="text-[14px] text-kawai-charcoal leading-relaxed">
                        {school.makeupLessonPolicy}
                      </p>
                    )}
                    {makeupOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {makeupOptions.map((opt, oi) =>
                          opt.option ? (
                            <span
                              key={oi}
                              className="text-[12px] text-kawai-charcoal border border-kawai-neutral px-3 py-1 rounded-full"
                            >
                              {opt.option}
                            </span>
                          ) : null,
                        )}
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Lesson Protocol */}
              {hasProtocol && (
                <details className="group border-b border-kawai-neutral">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none hover:text-kawai-black transition-colors">
                    <span className="text-[15px] font-medium text-kawai-black">
                      Lesson Protocol
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-kawai-red flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    >
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                  </summary>
                  <div className="pb-6 pr-8">
                    <p className="text-[14px] text-kawai-charcoal leading-relaxed">
                      {school.lessonProtocol}
                    </p>
                  </div>
                </details>
              )}

              {/* Food & Drinks */}
              {hasFoodDrinks && (
                <details className="group border-b border-kawai-neutral">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none hover:text-kawai-black transition-colors">
                    <span className="text-[15px] font-medium text-kawai-black">
                      Food &amp; Drinks
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-kawai-red flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    >
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                  </summary>
                  <div className="pb-6 pr-8">
                    <p className="text-[14px] text-kawai-charcoal leading-relaxed">
                      {school.foodDrinksPolicy}
                    </p>
                  </div>
                </details>
              )}

              {/* Photo & Media Release */}
              {hasPhoto && (
                <details className="group border-b border-kawai-neutral">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none hover:text-kawai-black transition-colors">
                    <span className="text-[15px] font-medium text-kawai-black">
                      Photo &amp; Media Release
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-kawai-red flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    >
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                  </summary>
                  <div className="pb-6 pr-8">
                    <p className="text-[14px] text-kawai-charcoal leading-relaxed">
                      {school.photoReleasePolicy}
                    </p>
                  </div>
                </details>
              )}
            </div>
          </section>
        )}

        {/* ─── FAQs ───────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section>
            <SectionHeader label="Frequently Asked Questions" count={faqs.length} />
            <div className="border-t border-kawai-neutral mt-2 pt-2">
              {faqs.map((faq, fi) => (
                <details
                  key={faq.id ?? faq.question}
                  className="group border-b border-kawai-neutral"
                >
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none">
                    <span className="text-[15px] font-medium text-kawai-charcoal group-hover:text-kawai-black transition-colors pr-6">
                      {faq.question}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-kawai-red flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    >
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                  </summary>
                  <div className="pb-6 pr-8">
                    <p className="text-[14px] text-kawai-charcoal/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ─── EMPTY STATE ────────────────────────────────────── */}
        {tuitionSemesters.length === 0 &&
          fees.length === 0 &&
          !hasPolicies &&
          faqs.length === 0 &&
          groupClasses.length === 0 && (
            <p className="text-kawai-charcoal text-sm py-16">
              No policies or rates have been published yet.
            </p>
          )}

        {/* ─── CONTACT CTA ────────────────────────────────────── */}
        {school.contactInfo?.phone && (
          <div className="pt-16 border-t border-kawai-neutral flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-kawai-charcoal/40 mb-1">
                Questions about tuition or enrollment?
              </p>
              <p className="text-kawai-black text-lg font-[family-name:var(--font-brand-luxury)]">
                Contact us — we&rsquo;re happy to help
              </p>
            </div>
            <a
              href={`tel:${school.contactInfo.phone}`}
              className="flex-shrink-0 bg-kawai-red text-white px-7 py-3 rounded text-sm font-semibold tracking-wide hover:bg-kawai-red-700 transition-colors"
            >
              {school.contactInfo.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
