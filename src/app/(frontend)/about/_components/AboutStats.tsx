const stats = [
  { value: '1927', label: 'Founded' },
  { value: '2.4M+', label: 'Pianos Built' },
  { value: '50+', label: 'Awards' },
  { value: '61+', label: 'Competition Victories' },
  { value: '3', label: 'Generations' },
]

export default function AboutStats() {
  return (
    <section className="bg-kawai-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {stats.map(({ value, label }, index) => (
            <div
              key={label}
              className={index === stats.length - 1 ? 'col-span-2 md:col-span-1' : undefined}
            >
              <div className="text-3xl md:text-4xl font-bold text-kawai-red mb-2">{value}</div>
              <div className="text-white/60 text-sm uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
