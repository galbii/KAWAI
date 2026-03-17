import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'
import type { Media } from '@/payload-types'
import { MusicSchoolFacultyCarousel } from './MusicSchoolFacultyCarousel'

function isMedia(val: unknown): val is Media {
  return typeof val === 'object' && val !== null && 'url' in val
}

interface Props {
  storeslug: string
}

export async function MusicSchoolSection({ storeslug }: Props) {
  const school = await getMusicSchoolByStorefrontSlug(storeslug)
  if (!school) return null

  const faculty = (school.faculty ?? []).map((m: any) => ({
    id: m.id,
    name: m.name,
    title: m.title,
    role: m.role,
    photoUrl: isMedia(m.photo) ? m.photo.url ?? null : null,
    specialties: m.specialties,
    background: m.background,
  }))

  if (faculty.length === 0) return null

  const baseUrl = `/store/${storeslug}/music-school`

  return (
    <section className="border-t border-kawai-neutral overflow-hidden">
      <MusicSchoolFacultyCarousel
        faculty={faculty}
        schoolName={school.schoolName}
        about={school.about}
        baseUrl={baseUrl}
      />
    </section>
  )
}
