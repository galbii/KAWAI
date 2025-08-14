const featuredInnovation = {
  name: "Grand Feel III",
  description: "Wooden keys with authentic grand piano touch",
  breakthrough: "2018"
};

const innovations = [
  {
    name: "Millennium III Action",
    breakthrough: "2000"
  },
  {
    name: "Shigeru Kawai Sound",
    breakthrough: "2020"
  }
];

export function InnovationShowcase() {
  return (
    <section className="py-48 bg-kawai-black text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Featured Innovation */}
        <div className="text-center mb-32">
          <div className="text-sm text-kawai-red font-medium tracking-[0.3em] uppercase mb-8">
            Since {featuredInnovation.breakthrough}
          </div>
          <h2 className="text-6xl md:text-8xl font-extralight text-white mb-12 font-serif leading-tight">
            {featuredInnovation.name}
          </h2>
          <p className="text-2xl md:text-3xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {featuredInnovation.description}
          </p>
        </div>

        {/* Other Innovations */}
        <div className="grid md:grid-cols-2 gap-16 border-t border-white/10 pt-20">
          {innovations.map((innovation, index) => (
            <div key={index} className="group">
              <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
                Since {innovation.breakthrough}
              </div>
              <h3 className="text-3xl md:text-4xl font-light text-white font-serif leading-tight group-hover:text-kawai-red transition-colors duration-300">
                {innovation.name}
              </h3>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}