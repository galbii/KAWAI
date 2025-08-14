"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, Filter, Star, ArrowRight } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface PianoSeries {
  name: string;
  description: string;
  pianos: Piano[];
}

interface ProductBrowserProps {
  title: string;
  description: string;
  series: PianoSeries[];
  categorySlug: string;
  featuredPianos?: Piano[];
}

export function ProductBrowser({
  title,
  description,
  series,
  categorySlug,
  featuredPianos = []
}: ProductBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(series[0]?.name || "all");

  // Get all pianos for "All" tab
  const allPianos = useMemo(() => {
    return series.flatMap(s => s.pianos);
  }, [series]);

  // Filter pianos based on search query
  const getFilteredPianos = (pianos: Piano[]) => {
    if (!searchQuery) return pianos;
    
    return pianos.filter(piano =>
      piano.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piano.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piano.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredAllPianos = getFilteredPianos(allPianos);
  const filteredSeriesPianos = (seriesName: string) => {
    const seriesData = series.find(s => s.name === seriesName);
    return seriesData ? getFilteredPianos(seriesData.pianos) : [];
  };

  return (
    <section className="py-16 lg:py-24 bg-kawai-pearl">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6"
          >
            {title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-4xl mx-auto mb-8"
          >
            {description}
          </motion.p>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
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
            <span>{filteredAllPianos.length} pianos found</span>
          </div>
        </motion.div>

        {/* Featured Pianos Carousel (if provided) */}
        {featuredPianos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-kawai-black mb-6">Featured Models</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPianos.slice(0, 3).map((piano, index) => (
                <motion.div
                  key={piano.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <PianoCard piano={piano} categorySlug={categorySlug} featured />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Piano Series Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Tabs value={selectedSeries} onValueChange={setSelectedSeries} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-white border border-kawai-neutral/30">
              <TabsTrigger value="all" className="data-[state=active]:bg-kawai-red data-[state=active]:text-white">
                All Models
              </TabsTrigger>
              {series.map((seriesData) => (
                <TabsTrigger
                  key={seriesData.name}
                  value={seriesData.name}
                  className="data-[state=active]:bg-kawai-red data-[state=active]:text-white text-sm"
                >
                  {seriesData.name.replace(' Series', '')}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All Models Tab */}
            <TabsContent value="all" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAllPianos.map((piano, index) => (
                  <motion.div
                    key={piano.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index % 8) }}
                  >
                    <PianoCard piano={piano} categorySlug={categorySlug} />
                  </motion.div>
                ))}
              </div>
              
              {filteredAllPianos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-kawai-black/60">No pianos found matching your search.</p>
                </div>
              )}
            </TabsContent>

            {/* Individual Series Tabs */}
            {series.map((seriesData) => (
              <TabsContent key={seriesData.name} value={seriesData.name} className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-kawai-neutral/30 mb-6">
                  <h3 className="text-xl font-bold text-kawai-black mb-2">{seriesData.name}</h3>
                  <p className="text-kawai-black/70">{seriesData.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSeriesPianos(seriesData.name).map((piano, index) => (
                    <motion.div
                      key={piano.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * (index % 8) }}
                    >
                      <PianoCard piano={piano} categorySlug={categorySlug} />
                    </motion.div>
                  ))}
                </div>
                
                {filteredSeriesPianos(seriesData.name).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-kawai-black/60">No pianos found in this series matching your search.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}

interface PianoCardProps {
  piano: Piano;
  categorySlug: string;
  featured?: boolean;
}

function PianoCard({ piano, categorySlug, featured = false }: PianoCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-kawai-neutral/30 ${featured ? 'ring-2 ring-kawai-red/20' : ''}`}>
          <CardHeader className="pb-3">
            <div className="aspect-video bg-gradient-to-br from-kawai-neutral/20 to-kawai-neutral/40 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              {piano.image ? (
                <img
                  src={piano.image}
                  alt={piano.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-16 h-16 text-kawai-black/30">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5z"/>
                    <path d="M8 7h1v6H8zM10 7h1v4h-1zM12 7h1v6h-1zM14 7h1v4h-1zM16 7h1v6h-1z"/>
                  </svg>
                </div>
              )}
            </div>
            
            <CardTitle className="text-lg font-bold text-kawai-black group-hover:text-kawai-red transition-colors">
              {piano.name}
            </CardTitle>
            <CardDescription className="text-sm text-kawai-black/60">
              {piano.series}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-3">
            <p className="text-sm text-kawai-black/70 line-clamp-2 mb-3">
              {piano.description}
            </p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(piano.rating)
                        ? 'text-kawai-red fill-current'
                        : 'text-kawai-neutral/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-kawai-black/60">
                {piano.rating} ({piano.reviews} reviews)
              </span>
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full group-hover:bg-kawai-red group-hover:text-white group-hover:border-kawai-red transition-all"
              asChild
            >
              <Link href={`/pianos/${categorySlug}/${piano.slug}`}>
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80 bg-white/95 backdrop-blur-md border border-kawai-neutral/30">
        <div className="space-y-3">
          <h4 className="font-bold text-kawai-black">{piano.name}</h4>
          <p className="text-sm text-kawai-black/70">{piano.description}</p>
          
          {piano.keyFeatures.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-kawai-black mb-2">Key Features:</h5>
              <ul className="text-xs text-kawai-black/70 space-y-1">
                {piano.keyFeatures.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-kawai-red rounded-full mt-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {piano.keyFeatures.length > 3 && (
                  <li className="text-kawai-red font-medium">
                    +{piano.keyFeatures.length - 3} more features
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}