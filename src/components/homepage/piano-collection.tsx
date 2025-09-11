import Link from "next/link";
import { YouTubeEmbed } from '@next/third-parties/google';
import { PianoCollectionProps, DEFAULT_PIANO_COLLECTION_DATA } from '@/lib/types/homepage';

export function PianoCollection({ data = DEFAULT_PIANO_COLLECTION_DATA }: PianoCollectionProps) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Featured Pianos with Video - Mobile optimized */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4 sm:mb-6">
              {data.collectionSectionHeader}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-kawai-black mb-6 sm:mb-8 font-serif leading-tight">
              {data.collectionTitle.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < data.collectionTitle.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-kawai-black/70 mb-8 sm:mb-12 leading-relaxed">
              {data.collectionDescription}
            </p>
            <Link 
              href={data.collectionCta.link}
              className="inline-flex items-center text-kawai-red font-medium text-base sm:text-lg group min-h-[44px] touch-manipulation"
            >
              {data.collectionCta.text}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          {/* YouTube Video Embed - Fully responsive container */}
          <div className="lg:col-span-2 relative order-1 lg:order-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg bg-black">
              <div className="absolute inset-0 w-full h-full">
                <YouTubeEmbed 
                  videoid={data.featuredVideo.youtubeId || "1cmwb6evs2A"} 
                  height={500}
                  width={800}
                  params="modestbranding=1&rel=0"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 0.5rem;"
                />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}