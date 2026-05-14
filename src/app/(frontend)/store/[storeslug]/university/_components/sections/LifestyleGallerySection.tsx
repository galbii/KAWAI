import type { LifestyleItem, StatItem } from '../../event.config';

interface LifestyleGallerySectionProps {
  lifestyleItems: LifestyleItem[]
  stats: StatItem[]
}

export default function LifestyleGallerySection({ lifestyleItems, stats }: LifestyleGallerySectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Experience the <span className="text-gradient-gold">Difference</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Witness the artistry and passion that goes into every KAWAI piano
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {lifestyleItems.map((item, index) => (
            <div key={index} className={`gallery-item relative h-72 bg-gradient-to-br ${item.gradient} rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up animate-delay-${index * 100}`}>
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10">
                <div className="text-5xl mb-4 transform hover:scale-125 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm font-medium">{item.subtitle}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className={`text-center animate-fade-in-up animate-delay-${(index + 1) * 100}`}>
              <div className="text-4xl font-bold text-gradient-gold mb-2">{stat.value}</div>
              <p className="text-gray-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}