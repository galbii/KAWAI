/**
 * PerformanceSchedule Component
 *
 * Displays the daily performance schedule for NAMM 2026 artists
 * Organized by date with time slots
 */

import { Calendar, Clock, MapPin, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PerformanceEvent {
  id: string
  artistName: string
  title: string
  date: string // e.g., "January 22, 2026"
  time: string // e.g., "2:00 PM - 2:45 PM"
  location: string // e.g., "Kawai Booth - Main Stage"
  description?: string
  genre?: string
}

interface PerformanceScheduleProps {
  events?: PerformanceEvent[]
  className?: string
}

// Default schedule (replace with CMS data)
const DEFAULT_SCHEDULE: PerformanceEvent[] = [
  // Day 1: January 22
  {
    id: '1',
    artistName: 'Sarah Chen',
    title: 'Classical Masterworks',
    date: 'January 22, 2026',
    time: '10:00 AM - 10:45 AM',
    location: 'Kawai Booth - Main Stage',
    description: 'Featuring works by Chopin and Rachmaninoff on the Shigeru Kawai SK-EX',
    genre: 'Classical'
  },
  {
    id: '2',
    artistName: 'Marcus Williams',
    title: 'Jazz Explorations',
    date: 'January 22, 2026',
    time: '1:00 PM - 1:45 PM',
    location: 'Kawai Booth - Demo Area',
    description: 'Modern jazz improvisation on the Kawai Novus NV10S',
    genre: 'Jazz'
  },
  {
    id: '3',
    artistName: 'Elena Rodriguez',
    title: 'Cinematic Soundscapes',
    date: 'January 22, 2026',
    time: '3:30 PM - 4:15 PM',
    location: 'Kawai Booth - Main Stage',
    description: 'Original compositions for film and media',
    genre: 'Contemporary'
  },

  // Day 2: January 23
  {
    id: '4',
    artistName: 'David Thompson',
    title: 'Broadway & Beyond',
    date: 'January 23, 2026',
    time: '11:00 AM - 11:45 AM',
    location: 'Kawai Booth - Main Stage',
    description: 'Musical theater classics and contemporary hits',
    genre: 'Broadway'
  },
  {
    id: '5',
    artistName: 'Yuki Tanaka',
    title: 'Modern Classical',
    date: 'January 23, 2026',
    time: '2:00 PM - 2:45 PM',
    location: 'Kawai Booth - Demo Area',
    description: 'Contemporary classical works on the Shigeru Kawai SK-7L',
    genre: 'Modern Classical'
  },
  {
    id: '6',
    artistName: 'Andre Dubois',
    title: 'Soul Sessions',
    date: 'January 23, 2026',
    time: '4:30 PM - 5:15 PM',
    location: 'Kawai Booth - Main Stage',
    description: 'R&B and soul piano showcase',
    genre: 'R&B'
  },

  // Day 3: January 24
  {
    id: '7',
    artistName: 'Sarah Chen',
    title: 'Romantic Era Favorites',
    date: 'January 24, 2026',
    time: '10:30 AM - 11:15 AM',
    location: 'Kawai Booth - Main Stage',
    description: 'Liszt, Brahms, and Schumann performances',
    genre: 'Classical'
  },
  {
    id: '8',
    artistName: 'Marcus Williams',
    title: 'Jazz Fusion Finale',
    date: 'January 24, 2026',
    time: '1:30 PM - 2:15 PM',
    location: 'Kawai Booth - Demo Area',
    description: 'Closing performance featuring collaborative improvisation',
    genre: 'Jazz'
  }
]

// Group events by date
function groupEventsByDate(events: PerformanceEvent[]): Record<string, PerformanceEvent[]> {
  return events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = []
    }
    acc[event.date]!.push(event)
    return acc
  }, {} as Record<string, PerformanceEvent[]>)
}

function PerformanceEventCard({ event }: { event: PerformanceEvent }) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl",
      "bg-zinc-900/50 border border-white/5",
      "hover:border-[#E31937]/50 hover:bg-zinc-900",
      "transition-all duration-300 ease-out",
      "p-6"
    )}>
      {/* Left Border Accent */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E31937] to-[#FF3B55]",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      )} />

      {/* Content */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          {/* Time & Artist Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#E31937] mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">{event.time}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#E31937] transition-colors">
              {event.title}
            </h3>
            <p className="text-sm text-white/60 font-medium">
              {event.artistName}
            </p>
          </div>

          {/* Genre Badge */}
          {event.genre && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Music className="w-3.5 h-3.5 text-[#E31937]" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">
                {event.genre}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            {event.description}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-white/50">
          <MapPin className="w-4 h-4 text-[#E31937]" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  )
}

export default function PerformanceSchedule({
  events = DEFAULT_SCHEDULE,
  className
}: PerformanceScheduleProps) {
  if (!events || events.length === 0) {
    return (
      <section className={cn("py-24 bg-zinc-950", className)}>
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Performance Schedule
          </h2>
          <p className="text-lg text-white/60">
            Schedule coming soon - check back for performance times
          </p>
        </div>
      </section>
    )
  }

  const eventsByDate = groupEventsByDate(events)
  const dates = Object.keys(eventsByDate).sort()

  return (
    <section className={cn("py-24 bg-zinc-950", className)}>
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Calendar className="w-4 h-4 text-[#E31937]" />
            <span className="text-sm font-medium text-white/80">
              3-Day Event Schedule
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Performance Schedule
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Plan your visit to catch your favorite artists live at the Kawai booth
          </p>
        </div>

        {/* Schedule by Date */}
        <div className="space-y-12">
          {dates.map((date, dateIndex) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#E31937] to-[#FF3B55] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-white/80 uppercase">
                      Day {dateIndex + 1}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {new Date(date).getDate()}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {date}
                  </h3>
                  <p className="text-sm text-white/50">
                    {eventsByDate[date]!.length} performance{eventsByDate[date]!.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Events for this date */}
              <div className="space-y-4 pl-0 md:pl-20">
                {eventsByDate[date]!.map((event) => (
                  <PerformanceEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Note */}
        <div className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/60 text-center">
            <span className="text-[#E31937] font-semibold">Note:</span>{' '}
            All performances are free with NAMM badge. Seating is first-come, first-served.
            Times are subject to change.
          </p>
        </div>
      </div>
    </section>
  )
}

export { PerformanceEventCard }
