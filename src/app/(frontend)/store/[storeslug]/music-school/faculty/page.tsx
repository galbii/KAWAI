import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'
import { FacultyPageCarousel } from '@/components/music-school/FacultyPageCarousel'

type Props = { params: Promise<{ storeslug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)
  if (!school) return { title: 'Faculty' }
  return {
    title: `Faculty | ${school.officialName || school.schoolName}`,
    description: `Meet the professional instructors at ${school.officialName || school.schoolName}.`,
  }
}

export default async function FacultyPage({ params }: Props) {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  if (!school) notFound()

  const faculty = school.faculty ?? []

  return (
    <div className="bg-kawai-pearl min-h-screen">

      {/* Slim header */}
      <header className="bg-kawai-black border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
              alt="Kawai Music School"
              className="h-7 w-auto opacity-80"
            />
            <div className="h-4 w-px bg-white/10" />
            <h1 className="text-white/60 text-[11px] tracking-[0.2em] uppercase font-medium">
              Faculty
            </h1>
          </div>
          <Link
            href={`/store/${storeslug}/music-school`}
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[11px] tracking-[0.15em] uppercase transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
            </svg>
            Overview
          </Link>
        </div>
      </header>

      {faculty.length === 0 ? (
        <p className="text-kawai-charcoal text-sm p-16">No faculty listed yet.</p>
      ) : (
        <FacultyPageCarousel faculty={faculty} storeslug={storeslug} />
      )}
    </div>
  )
}
