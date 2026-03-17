import { getMusicSchoolByStorefrontSlug } from '@/lib/payload/queries'
import { MusicSchoolNav } from '@/components/music-school/MusicSchoolNav'

type Props = {
  children: React.ReactNode
  params: Promise<{ storeslug: string }>
}

export default async function MusicSchoolLayout({ children, params }: Props) {
  const { storeslug } = await params
  const school = await getMusicSchoolByStorefrontSlug(storeslug)

  return (
    <div className="relative">
      <MusicSchoolNav
        storeslug={storeslug}
        schoolName={school?.schoolName ?? undefined}
      />
      {/* Extra bottom padding on mobile so the bottom tab bar doesn't cover content */}
      <div className="pb-16 md:pb-0">
        {children}
      </div>
    </div>
  )
}
