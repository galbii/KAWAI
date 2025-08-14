const heritageYears = [
  { year: "1927", milestone: "Founded" },
  { year: "1980s", milestone: "Digital Innovation" },
  { year: "2000s", milestone: "Millennium Action" },
  { year: "2024", milestone: "Global Excellence" }
];

export function HeritageTimeline() {
  return (
    <section className="py-48 bg-kawai-pearl">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-light text-kawai-black mb-16 font-serif">
            A Century of <span className="text-kawai-red">Craft</span>
          </h2>
        </div>
        
        <div className="space-y-24">
          {heritageYears.map((milestone, index) => (
            <div key={index} className="flex items-center justify-between border-b border-kawai-black/10 pb-8 last:border-b-0">
              <div className="text-6xl md:text-8xl font-extralight text-kawai-red font-serif">
                {milestone.year}
              </div>
              <div className="text-right">
                <h3 className="text-2xl md:text-3xl font-light text-kawai-black font-serif">
                  {milestone.milestone}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}