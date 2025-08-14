"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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

interface EnhancedSeriesBrowserProps {
  title: string;
  description: string;
  series: Series[];
  categorySlug: string;
}

interface SeriesCardProps {
  series: Series;
  index: number;
  categorySlug: string;
  searchQuery: string;
}

function SeriesCard({ series, index, categorySlug, searchQuery }: SeriesCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Filter pianos based on search query
  const filteredPianos = series.pianos.filter(piano =>
    !searchQuery || 
    piano.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    piano.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
    piano.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  // Don't render if no pianos match search
  if (searchQuery && filteredPianos.length === 0) {
    return null;
  }

  return (
    <motion.section
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
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
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -30 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Title */}
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black">
              {series.name}
            </h3>

            {/* Description */}
            <p className="text-lg md:text-xl leading-relaxed text-kawai-black/80 max-w-2xl">
              {series.description}
            </p>

            {/* Highlight */}
            {series.highlight && (
              <div className="bg-kawai-neutral/10 border-l-4 border-kawai-red p-4 rounded-r-lg">
                <p className="text-kawai-black font-semibold">{series.highlight}</p>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-8 text-sm">
              <div>
                <span className="block text-kawai-black/60">Models</span>
                <span className="font-bold text-kawai-black">
                  {searchQuery ? filteredPianos.length : series.pianos.length}
                  {searchQuery && filteredPianos.length !== series.pianos.length && 
                    ` of ${series.pianos.length}`
                  }
                </span>
              </div>
              {searchQuery && filteredPianos.length > 0 && (
                <div>
                  <span className="block text-kawai-black/60">Found</span>
                  <span className="font-bold text-kawai-red">{filteredPianos.length} matches</span>
                </div>
              )}
            </div>

            {/* Piano Models List */}
            {filteredPianos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-kawai-black">
                  {searchQuery ? 'Matching Models:' : 'Available Models:'}
                </h4>
                <div className="grid gap-2 max-h-48 overflow-y-auto">
                  {filteredPianos.map((piano) => (
                    <Link
                      key={piano.slug}
                      href={`/pianos/${categorySlug}/${piano.slug}`}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-kawai-red/10 hover:border-kawai-red/30 border border-kawai-neutral/20 transition-all duration-300 group"
                    >
                      <div>
                        <span className="font-medium text-kawai-black group-hover:text-kawai-red transition-colors">
                          {piano.name}
                        </span>
                        <p className="text-sm text-kawai-black/60 line-clamp-1">
                          {piano.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-kawai-black/60">
                        <span>{piano.rating}★</span>
                        <span>({piano.reviews})</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-4">
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
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div 
            className={`relative ${isEven ? '' : 'lg:col-start-1'}`}
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 30 : -30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-kawai-neutral/20 to-kawai-neutral/40 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform duration-500">
              {/* Piano Icon */}
              <div className="w-32 h-32 text-kawai-black/30 transition-transform duration-300 group-hover:scale-110">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5z"/>
                  <path d="M8 7h1v6H8zM10 7h1v4h-1zM12 7h1v6h-1zM14 7h1v4h-1zM16 7h1v6h-1z"/>
                </svg>
              </div>

              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-kawai-red/5" />
              
              {/* Series Name Watermark */}
              <div className="absolute bottom-4 right-4 opacity-10">
                <span className="text-2xl font-bold text-kawai-black">
                  {series.name.split(' ')[0]}
                </span>
              </div>

              {/* Model Count Badge */}
              <div className="absolute top-4 right-4 bg-kawai-red text-white px-3 py-1 rounded-full text-sm font-medium">
                {searchQuery ? filteredPianos.length : series.pianos.length} Models
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export function EnhancedSeriesBrowser({ 
  title, 
  description, 
  series, 
  categorySlug 
}: EnhancedSeriesBrowserProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const titleRef = useRef<HTMLDivElement>(null);

  // Get all pianos for search
  const allPianos = series.flatMap(s => s.pianos);
  const filteredPianos = allPianos.filter(piano =>
    !searchQuery || 
    piano.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    piano.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
    piano.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter series based on search
  const filteredSeries = series.filter(s => 
    !searchQuery || s.pianos.some(piano =>
      piano.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piano.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piano.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
    <section className="py-16 lg:py-24 bg-kawai-pearl">
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
            className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-8"
          >
            {description}
          </motion.p>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kawai-black/50 h-4 w-4" />
              <Input
                placeholder="Search pianos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-kawai-neutral/30 focus:border-kawai-red"
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-kawai-black/60">
              <Filter className="h-4 w-4" />
              <span>{filteredPianos.length} pianos found</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs for Series Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-4xl mx-auto px-6 mb-12"
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white border border-kawai-neutral/30">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-kawai-red data-[state=active]:text-white"
            >
              All Series
            </TabsTrigger>
            {series.map((seriesData) => (
              <TabsTrigger
                key={seriesData.name}
                value={seriesData.name.toLowerCase().replace(/\s+/g, '-')}
                className="data-[state=active]:bg-kawai-red data-[state=active]:text-white text-sm"
              >
                {seriesData.name.replace(' Series', '')}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Series Tab */}
          <TabsContent value="all" className="mt-8">
            <div className="space-y-8">
              {filteredSeries.map((seriesData, index) => (
                <SeriesCard 
                  key={seriesData.name} 
                  series={seriesData} 
                  index={index}
                  categorySlug={categorySlug}
                  searchQuery={searchQuery}
                />
              ))}
              
              {filteredSeries.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <p className="text-kawai-black/60">No piano series found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Individual Series Tabs */}
          {series.map((seriesData) => (
            <TabsContent 
              key={seriesData.name} 
              value={seriesData.name.toLowerCase().replace(/\s+/g, '-')} 
              className="mt-8"
            >
              <SeriesCard 
                series={seriesData} 
                index={0}
                categorySlug={categorySlug}
                searchQuery={searchQuery}
              />
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </section>
  );
}