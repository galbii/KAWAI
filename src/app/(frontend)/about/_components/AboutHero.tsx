import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center text-white overflow-hidden">
      <Image
        src="/images/banners/GX-7-BLAK-grand-styling.webp"
        alt="Kawai GX-7 grand piano"
        fill
        priority
        className="object-cover object-center -z-10"
        sizes="100vw"
      />
      {/* Left-weighted gradient keeps the headline crisp while revealing the grand on the right; bottom vignette grounds the frame. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-kawai-red text-sm uppercase tracking-widest mb-4">
            <span className="h-px w-8 bg-kawai-red" />
            Since 1927
          </p>
          <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-brand-serif)] tracking-tight leading-[1.05] mb-5">
            Crafting Inspiration
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8">
            Three generations. Nearly a century of innovation. One uncompromising standard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="#story">Our Story</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white hover:text-kawai-black"
              asChild
            >
              <Link href="/pianos">Explore Pianos</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
