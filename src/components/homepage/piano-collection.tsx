import Link from "next/link";
import { YouTubeEmbed } from '@next/third-parties/google';
import { PianoCollectionProps, DEFAULT_PIANO_COLLECTION_DATA } from '@/lib/types/homepage';

export function PianoCollection({ data = DEFAULT_PIANO_COLLECTION_DATA }: PianoCollectionProps) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Featured Pianos with Video */}
        <div className="grid lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-1">
            <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6">
              {data.collectionSectionHeader}
            </div>
            <h2 className="text-4xl md:text-6xl font-light text-kawai-black mb-8 font-serif leading-tight">
              {data.collectionTitle.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < data.collectionTitle.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-xl md:text-2xl text-kawai-black/70 mb-12 leading-relaxed">
              {data.collectionDescription}
            </p>
            <Link 
              href={data.collectionCta.link}
              className="inline-flex items-center text-kawai-red font-medium text-lg group"
            >
              {data.collectionCta.text}
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          {/* YouTube Video Embed - Takes 2/3 of the space */}
          <div className="lg:col-span-2 relative">
            <div className="aspect-video w-full overflow-hidden">
              <YouTubeEmbed 
                videoid={data.featuredVideo.youtubeId || "1cmwb6evs2A"} 
                height={data.featuredVideo.height || 500}
                width={data.featuredVideo.width || 800}
              />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}