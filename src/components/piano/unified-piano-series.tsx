"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Piano {
  slug: string;
  name: string;
  series: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  keyFeatures: string[];
}

interface Series {
  name: string;
  description: string;
  highlight?: string;
  modelCount?: number;
  href?: string;
  pianos: Piano[];
}

interface UnifiedPianoSeriesProps {
  title: string;
  description: string;
  series: Series[];
  categorySlug: string;
}

interface SeriesCardProps {
  series: Series;
  index: number;
  categorySlug: string;
  isActive: boolean;
}

function SeriesCard({ series, index, categorySlug, isActive }: SeriesCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.section
          key={series.name}
          ref={cardRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
          className="flex items-start pb-8 min-h-[600px]"
        >
          <div className="w-full">
            <div className={`grid lg:grid-cols-4 gap-6 lg:gap-8 items-start ${
              isEven ? '' : 'lg:grid-flow-col-dense'
            }`}>
              {/* Content */}
              <motion.div 
                className={`space-y-6 lg:col-span-1 min-h-[500px] ${isEven ? '' : 'lg:col-start-4'}`}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {/* Title */}
                <motion.h3 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-kawai-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {series.name}
                </motion.h3>

                {/* Description */}
                <motion.p 
                  className="text-base md:text-lg leading-relaxed text-kawai-black/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {series.description}
                </motion.p>

                {/* Highlight */}
                {series.highlight && (
                  <motion.div 
                    className="bg-kawai-neutral/10 border-l-4 border-kawai-red p-4 rounded-r-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <p className="text-kawai-black font-semibold">{series.highlight}</p>
                  </motion.div>
                )}

                {/* Stats */}
                <motion.div 
                  className="flex gap-8 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div>
                    <span className="block text-kawai-black/60">Models Available</span>
                    <span className="font-bold text-kawai-black text-2xl">{series.pianos.length}</span>
                  </div>
                </motion.div>

                {/* Featured Models */}
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <h4 className="text-lg font-semibold text-kawai-black mb-3">
                    Featured Models:
                  </h4>
                  <div className="grid gap-2">
                    {series.pianos.slice(0, 3).map((piano, pianoIndex) => (
                      <motion.div
                        key={piano.slug}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + (pianoIndex * 0.1) }}
                      >
                        <Link
                          href={`/pianos/${categorySlug}/${piano.slug}`}
                          className="flex items-center justify-between p-3 bg-white/50 border border-kawai-neutral/10 rounded-lg hover:bg-white hover:border-kawai-red/20 transition-all duration-300 group"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-kawai-black group-hover:text-kawai-red transition-colors text-sm">
                              {piano.name}
                            </h5>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-kawai-black/60">
                            <span className="text-kawai-red">★ {piano.rating}</span>
                            <svg 
                              className="w-3 h-3 text-kawai-black/40 group-hover:text-kawai-red group-hover:translate-x-1 transition-all"
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div 
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <Link
                    href={series.href || `#${series.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
                  >
                    <span>Explore {series.name}</span>
                    <svg
                      className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Visual Element */}
              <motion.div 
                className={`relative lg:col-span-3 px-2 lg:px-3 ${isEven ? 'lg:col-start-2' : 'lg:col-start-1'}`}
                initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="aspect-[3/2] lg:aspect-[5/3] h-full min-h-[200px] lg:min-h-[250px] relative overflow-hidden group">
                  {/* Piano Image */}
                  <motion.div 
                    key={series.pianos[0]?.slug}
                    className="relative w-full h-full"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    layout
                  >
                    <Image
                      src={series.pianos[0]?.image || '/images/banners/default-piano.webp'}
                      alt={`${series.name} - ${series.pianos[0]?.name || 'Piano'}`}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      priority={index === 0}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export function UnifiedPianoSeries({ 
  title, 
  description, 
  series, 
  categorySlug
}: UnifiedPianoSeriesProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(series[0]?.name.toLowerCase().replace(/\s+/g, '-') || '');
  const titleRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Get current active series data
  const activeSeriesData = series.find(s => 
    s.name.toLowerCase().replace(/\s+/g, '-') === selectedTab
  ) || series[0];

  // Carousel setup with continuous scrolling
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      drag: false,
      slides: {
        perView: "auto",
        spacing: 0,
      },
      created(s) {
        startSmoothScroll(s);
      },
      updated(s) {
        startSmoothScroll(s);
      },
    }
  );

  const startSmoothScroll = (slider: any) => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const tryStart = () => {
      if (!slider?.track?.details) {
        // Retry if track details not ready yet
        setTimeout(tryStart, 100);
        return;
      }
      
      const animate = () => {
        if (slider.track && slider.track.details) {
          // Use track.add() for relative movement - works better with loop
          const increment = 0.0006; // Ultra slow, smooth scrolling
          
          // Use track.add() to add relative movement
          slider.track.add(increment);
          
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    tryStart();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTitleVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Force start animation when component mounts and slider is ready
    const timer = setTimeout(() => {
      if (instanceRef.current) {
        startSmoothScroll(instanceRef.current);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update carousel content when active series changes WITHOUT restarting animation
  useEffect(() => {
    if (instanceRef.current && activeSeriesData) {
      // Update the slides content but keep animation running
      instanceRef.current.update();
    }
  }, [selectedTab, activeSeriesData]);

  // Get pianos for current series for carousel
  const carouselPianos = activeSeriesData ? [...activeSeriesData.pianos, ...activeSeriesData.pianos, ...activeSeriesData.pianos] : [];

  return (
    <section className="pt-16 lg:pt-24 pb-0 bg-kawai-pearl" id="series">
      {/* Section Header */}
      <div ref={titleRef} className="text-center mb-16">
        <div className="w-full px-6 lg:px-8 xl:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6"
          >
            {title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </div>
      </div>

      {/* Premium Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full px-6 lg:px-8 xl:px-12 mb-0"
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Premium Tab List */}
          <TabsList className="grid w-full bg-white border border-kawai-neutral/20 shadow-sm rounded-xl p-2 h-auto gap-2" style={{
            gridTemplateColumns: `repeat(${series.length}, minmax(0, 1fr))`
          }}>
            {series.map((seriesData, index) => (
              <TabsTrigger
                key={seriesData.name}
                value={seriesData.name.toLowerCase().replace(/\s+/g, '-')}
                className="relative px-6 py-4 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-kawai-red data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-kawai-red/10 text-kawai-black/80 hover:text-kawai-black"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="font-semibold">
                    {seriesData.name.replace(' Series', '')}
                  </span>
                  <span className="text-xs opacity-70">
                    {seriesData.pianos.length} models
                  </span>
                </motion.div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content - Individual Series */}
          {series.map((seriesData, index) => (
            <TabsContent 
              key={seriesData.name} 
              value={seriesData.name.toLowerCase().replace(/\s+/g, '-')} 
              className="mt-16 focus-visible:outline-none"
            >
              <SeriesCard 
                series={seriesData} 
                index={index}
                categorySlug={categorySlug}
                isActive={selectedTab === seriesData.name.toLowerCase().replace(/\s+/g, '-')}
              />
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Continuous Scrolling Carousel */}
      <section className="bg-kawai-pearl overflow-hidden mt-16">
        <div ref={sliderRef} className="keen-slider">
          {carouselPianos.map((piano, index) => (
            <div 
              key={`${piano.slug}-${index}`} 
              className="keen-slider__slide relative aspect-square min-w-[250px] md:min-w-[300px] lg:min-w-[350px] xl:min-w-[400px]"
            >
              <img 
                src={piano.image} 
                alt={piano.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="text-sm md:text-base lg:text-lg font-bold">{piano.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}