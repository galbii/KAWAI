import { BookingForm } from './BookingForm'
import { DEADLINE_LONG } from './campaign'
import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import { Reveal } from './Choreography'
import type { HoursEntry } from './schedule'

interface SimpleBookingSectionProps {
  storeslug: string
  locationName?: string | null
  hours?: HoursEntry[] | null
}

/**
 * The close, and the only thing on the page that asks for anything.
 *
 * The long page's close was a dark full-height panel of restated offers with a
 * button that opened a form somewhere else. This one is the form. Everything
 * above it exists to get a visitor here, so there is nothing between arriving
 * and typing.
 *
 * Server-rendered around a client form: only the form's state is on the client.
 */
export function SimpleBookingSection({
  storeslug,
  locationName,
  hours,
}: SimpleBookingSectionProps) {
  return (
    <section
      id="book"
      className="relative bg-kawai-pearl border-t border-kawai-black/10 scroll-mt-20"
    >
      <RuledGround animate />

      <div className={`relative ${BTS_CONTAINER} py-14 md:py-20`}>
        <SectionHead
          eyebrow={`Ends ${DEADLINE_LONG}`}
          title="Book an appointment"
          aside={
            locationName
              ? `We’ll have them tuned and uncovered for you at ${locationName}.`
              : 'We’ll have them tuned and uncovered for you.'
          }
          className="mb-9"
        />

        <Reveal delay={0.08}>
          <BookingForm storeslug={storeslug} locationName={locationName} hours={hours} />
        </Reveal>
      </div>
    </section>
  )
}
