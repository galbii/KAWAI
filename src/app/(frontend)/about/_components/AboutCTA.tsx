import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutCTA() {
  return (
    <section className="bg-kawai-black text-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-kawai-red text-sm uppercase tracking-widest mb-3">EXPLORE</p>
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-serif)] mb-4">
            Experience 97 Years of Innovation
          </h2>
          <p className="text-white/70 mb-8">
            Discover how Kawai&apos;s legacy of craftsmanship and innovation can shape your musical
            journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/pianos">Explore Pianos</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white hover:text-kawai-black"
              asChild
            >
              <Link href="/find-a-dealer">Find a Dealer</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
