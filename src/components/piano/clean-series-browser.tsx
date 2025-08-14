"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
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

interface CleanSeriesBrowserProps {
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
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

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
          className="min-h-[60vh] flex items-center py-12"
        >
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
              isEven ? '' : 'lg:grid-flow-col-dense'
            }`}>
              {/* Content */}
              <motion.div 
                className={`space-y-6 ${isEven ? '' : 'lg:col-start-2'}`}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {/* Title */}
                <motion.h3 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {series.name}
                </motion.h3>

                {/* Description */}
                <motion.p 
                  className="text-lg md:text-xl leading-relaxed text-kawai-black/80 max-w-2xl"
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
                  <div>
                    <span className="block text-kawai-black/60">Series Focus</span>
                    <span className="font-bold text-kawai-red">{series.highlight || 'Premium Quality'}</span>
                  </div>
                </motion.div>

                {/* Piano Models List */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <h4 className="text-xl font-semibold text-kawai-black mb-4">
                    Available Models:
                  </h4>
                  <div className="grid gap-3 max-h-64 overflow-y-auto">
                    {series.pianos.map((piano, pianoIndex) => (
                      <motion.div
                        key={piano.slug}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + (pianoIndex * 0.1) }}
                      >
                        <Link
                          href={`/pianos/${categorySlug}/${piano.slug}`}
                          className="flex items-center justify-between p-4 bg-white border border-kawai-neutral/20 rounded-lg hover:border-kawai-red/30 hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-kawai-black group-hover:text-kawai-red transition-colors">
                              {piano.name}
                            </h5>
                            <p className="text-sm text-kawai-black/60 line-clamp-1 mt-1">
                              {piano.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-kawai-black/60 ml-4">
                            <div className="flex items-center gap-1">
                              <span className="text-kawai-red">★</span>
                              <span>{piano.rating}</span>
                            </div>
                            <span className="text-xs">({piano.reviews} reviews)</span>
                            <svg 
                              className="w-4 h-4 text-kawai-black/40 group-hover:text-kawai-red group-hover:translate-x-1 transition-all"
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
                className={`relative ${isEven ? '' : 'lg:col-start-1'}`}
                initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-kawai-neutral/20 to-kawai-neutral/40 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform duration-500">
                  {/* Piano Icon */}
                  <motion.div 
                    className="w-32 h-32 text-kawai-black/30 transition-transform duration-300 group-hover:scale-110"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5z"/>
                      <path d="M8 7h1v6H8zM10 7h1v4h-1zM12 7h1v6h-1zM14 7h1v4h-1zM16 7h1v6h-1z"/>
                    </svg>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-kawai-red/5" />
                  
                  {/* Series Name Watermark */}
                  <motion.div 
                    className="absolute bottom-4 right-4 opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <span className="text-2xl font-bold text-kawai-black">
                      {series.name.split(' ')[0]}
                    </span>
                  </motion.div>

                  {/* Model Count Badge */}
                  <motion.div 
                    className="absolute top-4 right-4 bg-kawai-red text-white px-3 py-1 rounded-full text-sm font-medium"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    {series.pianos.length} Models
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

export function CleanSeriesBrowser({ 
  title, 
  description, 
  series, 
  categorySlug 
}: CleanSeriesBrowserProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(series[0]?.name.toLowerCase().replace(/\s+/g, '-') || '');
  const titleRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="py-16 lg:py-24 bg-kawai-pearl" id="series">
      {/* Section Header */}
      <div ref={titleRef} className="text-center mb-16">
        <div className="max-w-4xl mx-auto px-6">
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
        className="max-w-5xl mx-auto px-6 mb-12"
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
              className="mt-8 focus-visible:outline-none"
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
    </section>
  );
}