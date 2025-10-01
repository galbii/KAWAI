"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface UseCase {
  title: string;
  icon: React.ReactNode;
  description: string;
  perfectForYouIf: string[];
  recommendedModels: Array<{
    name: string;
    link: string;
  }>;
  ctaText: string;
  ctaLink: string;
  keywords: string[];
}

export function UseCaseCards() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const useCases: UseCase[] = [
    {
      title: "Students & Beginners",
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      description: "Starting your piano journey requires an instrument that builds proper technique while staying within budget. The ideal beginner piano offers authentic weighted keys that develop finger strength and touch sensitivity from day one, reliable sound quality that makes practice enjoyable, and durability to withstand years of daily learning. Kawai's entry-level digital pianos deliver professional-quality touch and tone at accessible price points, giving students the foundation they need without compromise. Features like built-in metronomes, lesson functions, and headphone jacks enhance practice efficiency, while USB connectivity enables modern learning apps and recording for progress tracking.",
      perfectForYouIf: [
        "You're starting piano lessons or teaching a child aged 5-12",
        "You need a reliable, budget-friendly piano that won't hinder development",
        "You want weighted keys that feel like a real piano (not a toy keyboard)",
        "Silent practice with headphones is essential for your living situation"
      ],
      recommendedModels: [
        { name: "ES120", link: "/product/es120" },
        { name: "ES520", link: "/product/es520" },
        { name: "CN301", link: "/product/cn301" },
        { name: "KDP120", link: "/product/kdp120" }
      ],
      ctaText: "Explore Beginner-Friendly Pianos",
      ctaLink: "/guides/first-piano",
      keywords: ["best piano for beginners", "piano for kids", "student piano", "beginner digital piano", "piano for lessons", "affordable piano for students"]
    },
    {
      title: "Professionals & Teachers",
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
        </svg>
      ),
      description: "Professional pianists and piano teachers demand instruments that deliver uncompromising performance, session after session. Your piano must provide the expressive control needed for advanced repertoire, the consistent touch response required for teaching demonstrations, and the tonal authenticity that inspires both you and your students. Kawai's professional pianos feature our flagship Millennium III Carbon Fiber Action in acoustic models and Grand Feel wooden-key action in premium digitals—delivering the precise repetition speed, uniform weight, and dynamic range that serious music-making requires. For teaching studios, dual-piano connectivity, robust construction for heavy daily use, and versatile sound options ensure your instrument enhances rather than limits your pedagogical goals.",
      perfectForYouIf: [
        "You perform professionally or teach advanced students daily",
        "You need concert-level touch and tone for serious classical repertoire",
        "Your piano must withstand 4-8 hours of intensive daily playing",
        "You require dual-piano connectivity for teaching or ensemble practice"
      ],
      recommendedModels: [
        { name: "CA901", link: "/product/ca901" },
        { name: "Novus NV10S", link: "/product/nv10s" },
        { name: "GX-3 Grand", link: "/product/gx3" },
        { name: "Shigeru Kawai SK-5", link: "/product/sk5" }
      ],
      ctaText: "Discover Professional Instruments",
      ctaLink: "/guides/professional-piano-selection",
      keywords: ["professional piano", "piano for teachers", "teaching studio piano", "concert piano", "advanced piano", "best piano for classical music"]
    },
    {
      title: "Home Entertainment",
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      description: "Your home piano should be a source of joy and connection—a beautiful instrument that invites family members to gather, explore music together, and create lasting memories. Modern home entertainment pianos blend elegant design with versatile features: authentic piano sound for classical pieces, orchestral voices for creative exploration, simple Bluetooth connectivity for playing along with favorite songs, and recording capabilities to capture and share musical moments. Kawai's home pianos are designed to complement your living space aesthetically while delivering rich, room-filling sound that enhances any gathering. Intuitive controls and preset sounds make it easy for family members of all skill levels to enjoy making music, while premium action and tone satisfy more serious players in the household.",
      perfectForYouIf: [
        "You want a piano that brings the family together musically",
        "You need versatile sounds beyond traditional piano (strings, organs, more)",
        "Aesthetic design that complements your home décor matters to you",
        "You appreciate modern connectivity: Bluetooth audio, apps, recording"
      ],
      recommendedModels: [
        { name: "CA701", link: "/product/ca701" },
        { name: "ES920", link: "/product/es920" },
        { name: "CN201", link: "/product/cn201" },
        { name: "K-500 Upright", link: "/product/k500" }
      ],
      ctaText: "Find Your Perfect Home Piano",
      ctaLink: "/pianos/digital",
      keywords: ["home piano", "family piano", "living room piano", "piano with Bluetooth", "versatile piano", "piano for entertainment"]
    },
    {
      title: "Recording & Composition",
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
      description: "Modern music creators need a piano that seamlessly bridges acoustic authenticity with digital workflow integration. The ideal recording piano delivers pristine audio quality via USB and line outputs, velocity-sensitive MIDI that captures every nuance of your performance, and multiple sound engines to inspire compositional creativity. Kawai's recording-focused instruments feature high-resolution multi-channel sampling, dedicated line outputs for professional audio interfaces, class-compliant USB-MIDI for plug-and-play DAW integration, and onboard recording to capture spontaneous ideas instantly. Advanced sound customization—from brilliance and reverb to detailed voicing—ensures your piano tracks sit perfectly in any mix, whether you're producing classical arrangements, contemporary singer-songwriter material, or cinematic soundscapes.",
      perfectForYouIf: [
        "You produce music in a home studio or professional recording environment",
        "You need USB-MIDI connectivity for seamless DAW integration (Logic, Ableton, etc.)",
        "High-quality audio outputs and multiple sound engines are essential to your workflow",
        "You want to capture composition ideas instantly with onboard recording"
      ],
      recommendedModels: [
        { name: "ES920", link: "/product/es920" },
        { name: "MP11SE", link: "/product/mp11se" },
        { name: "CA901", link: "/product/ca901" },
        { name: "ES520", link: "/product/es520" }
      ],
      ctaText: "Explore Studio-Ready Pianos",
      ctaLink: "/pianos/digital",
      keywords: ["recording piano", "MIDI piano", "USB piano", "studio piano", "piano for composition", "producer piano", "DAW piano"]
    }
  ];

  return (
    <section ref={sectionRef} className="relative bg-kawai-pearl py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Your Musical Journey
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black mb-6 leading-tight">
            Find the Perfect Piano for{" "}
            <span className="text-kawai-red">Your Goals</span>
          </h2>
          <p className="text-lg sm:text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed">
            Whether you're learning, teaching, performing, or creating, we have a piano designed specifically for your musical journey.
          </p>
        </motion.div>

        {/* Use Case Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              className="bg-white rounded-xl shadow-sm border border-kawai-pearl/50 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-kawai-red group-hover:scale-110 transition-transform duration-300">
                    {useCase.icon}
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-kawai-black mb-4 font-serif">
                  {useCase.title}
                </h3>

                <p className="text-kawai-black/70 leading-relaxed mb-6">
                  {useCase.description}
                </p>

                {/* Perfect For You If Section */}
                <div className="mb-6 p-4 bg-kawai-pearl/50 rounded-lg">
                  <h4 className="text-sm font-semibold text-kawai-red mb-3 uppercase tracking-wide">
                    Perfect for you if:
                  </h4>
                  <ul className="space-y-2">
                    {useCase.perfectForYouIf.map((point, idx) => (
                      <li key={idx} className="flex items-start text-sm text-kawai-black/80">
                        <svg className="w-5 h-5 text-kawai-red mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Models */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-kawai-black mb-3 uppercase tracking-wide">
                    Recommended Kawai Models:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.recommendedModels.map((model) => (
                      <Link
                        key={model.name}
                        href={model.link}
                        className="inline-block px-4 py-2 bg-kawai-red/10 hover:bg-kawai-red hover:text-white text-kawai-red rounded-full text-sm font-medium transition-all duration-200"
                      >
                        {model.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={useCase.ctaLink}
                  className="inline-flex items-center text-kawai-red hover:text-kawai-black font-medium transition-colors duration-200 group/cta"
                >
                  {useCase.ctaText}
                  <svg className="w-5 h-5 ml-2 group-hover/cta:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 lg:mt-16"
        >
          <div className="inline-block p-8 bg-white rounded-xl shadow-sm border border-kawai-pearl/50">
            <p className="text-kawai-black/70 mb-6 text-lg max-w-2xl">
              Not sure which category fits your needs? Our Piano Finder Quiz will help you discover the perfect Kawai piano based on your unique goals, space, and budget.
            </p>
            <Link
              href="/find-my-piano#quiz"
              className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg min-h-[44px]"
            >
              Take the Piano Finder Quiz
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
