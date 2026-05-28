'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal'
import SectionEyebrow from './SectionEyebrow'

const events = [
  {
    year: '1927',
    title: 'Foundation',
    description:
      'Koichi Kawai, former apprentice to Torakusu Yamaha, establishes Kawai Musical Instruments with a vision to democratize access to quality pianos.',
  },
  {
    year: '1955',
    title: 'Second Generation Leadership',
    description:
      'Shigeru Kawai becomes president, introducing a scientific approach to piano innovation and establishing the foundation for modern Kawai technology.',
  },
  {
    year: '1971',
    title: 'ABS Technology Revolution',
    description:
      'Kawai introduces revolutionary ABS composite materials for piano actions, later proven at Cal Poly to be superior to traditional wood in durability and consistency.',
  },
  {
    year: '1989',
    title: 'Third Generation & Global Expansion',
    description:
      "Hirotaka Kawai takes leadership, introducing robotics in manufacturing and expanding Kawai's global presence while maintaining traditional craftsmanship values.",
  },
  {
    year: '2002',
    title: 'Millennium III Action',
    description:
      'Launch of the revolutionary Millennium III Action, representing the pinnacle of composite action technology and setting new standards for touch and response.',
  },
  {
    year: '2024',
    title: 'Continued Excellence',
    description:
      '97 years later, Kawai continues to lead with 61+ international competition victories and instruments trusted by artists and institutions worldwide.',
  },
]

export default function AboutTimeline() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 75%', 'end 65%'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="bg-kawai-pearl py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionEyebrow>Heritage</SectionEyebrow>
            <h2 className="mt-4 mb-14 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.25rem)] leading-tight text-kawai-black">
              A Legacy of Innovation
            </h2>
          </Reveal>

          <ol ref={listRef} className="relative ml-3">
            {/* Static track */}
            <span aria-hidden className="absolute bottom-2 left-0 top-2 w-px bg-kawai-neutral" />
            {/* Progress line that draws as the section scrolls through the viewport */}
            <motion.span
              aria-hidden
              className="absolute bottom-2 left-0 top-2 w-px origin-top bg-kawai-red"
              style={{ scaleY: reduce ? 1 : scaleY }}
            />

            {events.map((event) => (
              <li key={event.year} className="relative mb-12 pl-10 last:mb-0">
                <span
                  aria-hidden
                  className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-kawai-red ring-4 ring-kawai-pearl"
                />
                <Reveal>
                  <div className="font-[family-name:var(--font-brand-serif)] text-2xl text-kawai-red">
                    {event.year}
                  </div>
                  <h3 className="mt-1 mb-2 text-lg font-semibold text-kawai-black">{event.title}</h3>
                  <p className="leading-relaxed text-kawai-charcoal">{event.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
