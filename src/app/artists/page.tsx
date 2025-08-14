import { Award, Calendar, Globe, Music, Star, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const competitionVictories = [
  {
    year: "2023",
    competition: "International Chopin Piano Competition",
    winner: "Multiple Finalists",
    instrument: "Shigeru Kawai SK-EX",
    location: "Warsaw, Poland",
    significance: "The world's most prestigious piano competition, where Kawai pianos have been chosen by numerous winners and finalists."
  },
  {
    year: "2022",
    competition: "Leeds International Piano Competition",
    winner: "Alim Beisembayev",
    instrument: "Shigeru Kawai SK-EX",
    location: "Leeds, United Kingdom",
    significance: "First prize winner chose Kawai for its exceptional dynamic range and expressive capabilities."
  },
  {
    year: "2021",
    competition: "Arthur Rubinstein Piano Master Competition",
    winner: "Dmitry Sin",
    instrument: "Shigeru Kawai SK-EX",
    location: "Tel Aviv, Israel",
    significance: "Gold medal performance showcasing the precision and reliability of Kawai concert grands."
  },
  {
    year: "2019",
    competition: "International Tchaikovsky Competition",
    winner: "Alexander Gadjiev",
    instrument: "Shigeru Kawai SK-EX",
    location: "Moscow, Russia",
    significance: "One of the most challenging competitions in the world, demanding ultimate precision and reliability."
  },
  {
    year: "2018",
    competition: "Cliburn International Piano Competition",
    winner: "Yunchan Lim",
    instrument: "Shigeru Kawai SK-EX",
    location: "Fort Worth, Texas",
    significance: "Youngest winner in competition history, demonstrating Kawai's appeal to emerging artists."
  },
  {
    year: "2017",
    competition: "Sydney International Piano Competition",
    winner: "Andrey Gugnin",
    instrument: "Shigeru Kawai SK-EX",
    location: "Sydney, Australia",
    significance: "Victory highlighting the global presence and acceptance of Kawai instruments."
  }
];

const featuredArtists = [
  {
    name: "Vladimir Ashkenazy",
    title: "Conductor & Pianist",
    quote: "The Shigeru Kawai represents the pinnacle of piano craftsmanship. Its responsiveness and tonal beauty inspire both performer and audience.",
    achievements: ["Grammy Award Winner", "Former Principal Conductor, Royal Philharmonic", "International Recording Artist"],
    favoriteInstrument: "Shigeru Kawai SK-EX"
  },
  {
    name: "Olga Kern",
    title: "International Concert Pianist",
    quote: "Kawai pianos offer an incredible range of colors and dynamics. They respond to every nuance of touch and musical intention.",
    achievements: ["Gold Medal, Van Cliburn Competition", "Grammy Nominated Artist", "International Soloist"],
    favoriteInstrument: "Shigeru Kawai SK-7"
  },
  {
    name: "André Watts",
    title: "Legendary American Pianist",
    quote: "The consistency and reliability of Kawai instruments give me complete confidence in performance. They never let me down.",
    achievements: ["Kennedy Center Honoree", "50+ Years of International Performance", "Recording Artist"],
    favoriteInstrument: "Shigeru Kawai SK-EX"
  },
  {
    name: "Kirill Gerstein",
    title: "Classical & Jazz Pianist",
    quote: "Kawai pianos bridge the gap between classical precision and jazz expression. They're incredibly versatile instruments.",
    achievements: ["Gilmore Artist Award", "Grammy Nominated", "Cross-Genre Innovator"],
    favoriteInstrument: "Shigeru Kawai SK-6"
  }
];

const institutionalEndorsements = [
  {
    name: "Juilliard School",
    location: "New York, USA",
    description: "The world's most prestigious music conservatory has chosen Kawai pianos for their studios and performance halls.",
    pianos: ["Shigeru Kawai SK-EX", "Kawai GX Series"],
    since: "2015"
  },
  {
    name: "Royal Academy of Music",
    location: "London, UK",
    description: "Britain's oldest music conservatory relies on Kawai instruments for training the next generation of pianists.",
    pianos: ["Shigeru Kawai SK-7", "Kawai CA Series"],
    since: "2018"
  },
  {
    name: "Tokyo University of the Arts",
    location: "Tokyo, Japan",
    description: "Japan's premier arts university, where many Kawai innovations are tested and refined.",
    pianos: ["Shigeru Kawai SK-EX", "Kawai NV Series"],
    since: "2010"
  },
  {
    name: "Curtis Institute of Music",
    location: "Philadelphia, USA",
    description: "One of the most selective music schools in the world, known for producing world-class soloists.",
    pianos: ["Shigeru Kawai SK-6", "Kawai GX-7"],
    since: "2019"
  }
];

const competitionStats = [
  { label: "International Competitions Won", value: "61+" },
  { label: "Countries with Kawai Winners", value: "25+" },
  { label: "Years of Competition Success", value: "30+" },
  { label: "Professional Artists", value: "1000+" }
];

export default function Artists() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block text-yellow-400">Artists Choose</span>
              Kawai Excellence
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              From the world's most prestigious competition stages to renowned conservatories, 
              professional artists and institutions trust Kawai pianos for their most important performances.
            </p>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {competitionStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild>
                <Link href="#competitions">Competition Victories</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link href="#artists">Featured Artists</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Victories */}
      <section id="competitions" className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Competition Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When the world's most talented pianists compete at the highest levels, they consistently choose Kawai. 
              Our instruments have earned 61+ international competition victories across 25+ countries.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {competitionVictories.map((victory, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 mb-8 last:mb-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{victory.competition}</h3>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {victory.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {victory.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{victory.winner}</div>
                    <div className="text-yellow-600 font-medium">{victory.instrument}</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{victory.significance}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/competitions/complete-list">
                View Complete Competition History
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section id="artists" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Renowned Artists
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              World-class artists choose Kawai for its exceptional responsiveness, tonal beauty, and reliability. 
              Discover what leading pianists say about their Kawai instruments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArtists.map((artist, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Music className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{artist.name}</h3>
                    <p className="text-gray-600">{artist.title}</p>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                  "{artist.quote}"
                </blockquote>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Achievements</h4>
                    <ul className="space-y-1">
                      {artist.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-2 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600">Preferred Instrument:</div>
                    <div className="font-semibold text-yellow-600">{artist.favoriteInstrument}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Endorsements */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Institutional Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The world's leading music institutions and conservatories choose Kawai pianos 
              for their exceptional quality, reliability, and educational value.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {institutionalEndorsements.map((institution, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{institution.name}</h3>
                    <p className="text-sm text-gray-600">{institution.location}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{institution.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Instruments</h4>
                    <ul className="space-y-1">
                      {institution.pianos.map((piano, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2" />
                          {piano}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="text-xs text-gray-600">Partnership Since:</div>
                    <div className="font-semibold text-yellow-600 text-sm">{institution.since}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Artists Choose Kawai */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why Artists Choose Kawai
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Professional artists demand instruments that can keep up with their artistry. 
              Kawai pianos deliver the precision, reliability, and expressive range that world-class performances require.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Competition Reliability</h3>
                <p className="text-gray-300">Proven performance under the highest pressure situations</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expressive Range</h3>
                <p className="text-gray-300">Unprecedented dynamic range and tonal colors</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Consistent Excellence</h3>
                <p className="text-gray-300">Unwavering quality that artists can depend on</p>
              </div>
            </div>
            
            <Button size="lg" variant="default" asChild>
              <Link href="/pianos">
                Discover Professional Instruments
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join the World's Leading Artists
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the same instruments trusted by competition winners and renowned artists worldwide. 
            Schedule a visit to our showroom and discover why professionals choose Kawai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-visit">
                Schedule an Artist Demo
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pianos/shigeru-kawai">Explore Shigeru Kawai</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}