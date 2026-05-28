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
  return (
    <section className="bg-kawai-pearl py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">HERITAGE</p>
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-10">
            A Legacy of Innovation
          </h2>
          <ol className="relative border-l border-kawai-neutral ml-2">
            {events.map((e) => (
              <li key={e.year} className="mb-10 last:mb-0 pl-8 relative">
                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-kawai-red" />
                <div className="text-xl font-[family-name:var(--font-brand-serif)] text-kawai-red mb-1">
                  {e.year}
                </div>
                <h3 className="text-lg font-semibold text-kawai-black mb-2">{e.title}</h3>
                <p className="text-kawai-charcoal leading-relaxed">{e.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
