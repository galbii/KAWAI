import Link from "next/link";

export function PianoCollection() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Featured Pianos with Video */}
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          <div className="lg:col-span-2 lg:pl-1">
            <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6">
              Featured Models
            </div>
            <h2 className="text-4xl md:text-6xl font-light text-kawai-black mb-8 font-serif leading-tight">
              Kawai K-500 &<br />
              GX2 Limited Edition
            </h2>
            <p className="text-xl md:text-2xl text-kawai-black/70 mb-12 leading-relaxed">
              Discover the exceptional craftsmanship and innovation that defines our most sought-after instruments
            </p>
            <Link 
              href="/pianos"
              className="inline-flex items-center text-kawai-red font-medium text-lg group"
            >
              Explore Collection
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          {/* YouTube Video Embed - Takes 3/5 of the space */}
          <div className="lg:col-span-3 relative">
            <div className="aspect-video w-full">
              <iframe
                src="https://www.youtube.com/embed/1cmwb6evs2A"
                title="Kawai Piano Showcase"
                className="w-full h-full rounded-lg shadow-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}