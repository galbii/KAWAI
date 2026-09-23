#!/usr/bin/env tsx
/**
 * KPM Dallas — add two faculty members
 *
 * Adds Christopher Richardson (piano) and Hyun Jung Kim (violin) from
 * school-supplied bios. Neither has a photo yet — the faculty carousel falls
 * back to initials on black, so both render cleanly until images are uploaded
 * through the admin panel.
 *
 * Degrees are split out into the `education` array to match how every other
 * Dallas faculty entry is structured; the prose left in `background` covers
 * honors, venues, and teachers.
 *
 * Idempotent: skips anyone already present by name.
 *
 * Goes through the Local API (not the raw driver) so the collection's
 * afterChange hook fires and busts the `music-school-kpm-dallas` cache tag.
 *
 * Usage:
 *   bun --env-file=.env.local run content:dallas-faculty:dry-run
 *   bun --env-file=.env.local run content:dallas-faculty
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const SCHOOL_SLUG = 'kpm-dallas'

const CHRISTOPHER_RICHARDSON = {
  name: 'Christopher Richardson',
  title: 'Piano Teacher',
  role: 'Piano teacher',
  specialties: 'Piano Performance',
  background:
    'Christopher Richardson is an award-winning pianist and dedicated educator who has taught students of all ages and skill levels since 2019. His honors include First Prize at the 2021 LA International Liszt Competition, Second Prize at the 2022 Virginia Waring International Piano Competition, and First Prize/Chopin Prize at the 2016 Music Teachers National Association Competition. He has performed at notable venues including Carnegie Hall, Benaroya Hall, McCallum Theater, Finney Chapel, the Music Tent in Aspen, and the Liszt Museum in Budapest, and has appeared as a soloist with several orchestras including the Minnesota Orchestra. His other major piano instructors have included Mack McCray, Duane Hulbert, and Frederick Weldy.',
  education: [
    { degree: 'M.M. in Piano Performance, University of Southern California (under Jeffrey Kahane)' },
    { degree: 'M.B.A., Cornell University' },
    {
      degree:
        'B.A. with honors in Music, Economics, and Molecular and Cell Biology, University of California, Berkeley',
    },
  ],
}

const HYUN_JUNG_KIM = {
  name: 'Hyun Jung Kim',
  title: 'Violin Teacher',
  role: 'Violin teacher',
  specialties: 'Violin, chamber music, orchestral performance',
  background:
    'Hyun Jung Kim is a violinist from South Korea who began her musical journey at the age of five. She started her studies at Ewha Womans University under Professor Taekju Lee, where her undergraduate work laid the groundwork for a profound love and deep passion for the violin. After graduating she focused on teaching and performing before pursuing a Master of Music at the University of Texas at Austin under Sandy Yamamoto. She is currently advancing her expertise through doctoral studies at the University of North Texas as an Anshel Brusilow Scholarship full-scholarship recipient, under the mentorship of Professor Julia Bushkova. Alongside her academic work she serves as a Teaching Assistant and is a violinist in the Bancroft Quartet, where she continues to shine in chamber music; she previously honed her chamber music skills as a member of the Marie A. Moore Piano Trio. She is deeply committed to her orchestral performances and dedicates significant time to teaching young musicians, fostering the next generation of musicians.',
  education: [
    {
      degree:
        'Doctoral studies in Violin Performance, University of North Texas (Anshel Brusilow Scholarship full-scholarship recipient; under Prof. Julia Bushkova)',
    },
    { degree: 'M.M., University of Texas at Austin (under Sandy Yamamoto)' },
    { degree: 'B.M., Ewha Womans University, South Korea (under Prof. Taekju Lee)' },
  ],
}

const ADDITIONS = [CHRISTOPHER_RICHARDSON, HYUN_JUNG_KIM]

type FacultyMember = {
  id?: string
  name: string
  title?: string | null
  role?: string | null
  photo?: string | null
  specialties?: string | null
  teachingFocus?: string | null
  background?: string | null
  education?: Array<{ id?: string; degree?: string | null }>
}

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run')
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'music-schools',
    where: { slug: { equals: SCHOOL_SLUG } },
    depth: 0,
    limit: 1,
  })

  const school = found.docs[0]
  if (!school) {
    console.error(`✗ No music school with slug "${SCHOOL_SLUG}" found. Aborting.`)
    process.exit(1)
  }

  const faculty: FacultyMember[] = ((school as any).faculty ?? []) as FacultyMember[]
  const existingNames = new Set(faculty.map((f) => f.name))

  const toAdd = ADDITIONS.filter((f) => !existingNames.has(f.name))
  const skipped = ADDITIONS.filter((f) => existingNames.has(f.name))

  console.log(`\n── KPM Dallas (id: ${school.id}) ──────────────────────────\n`)
  console.log(`existing faculty (${faculty.length}): ${faculty.map((f) => f.name).join(', ')}\n`)

  for (const f of skipped) {
    console.log(`• ${f.name} — already present, skipping`)
  }
  for (const f of toAdd) {
    console.log(`+ ${f.name} — ${f.title}`)
    console.log(`    background: ${f.background.length} chars`)
    console.log(`    education:  ${f.education.length} entries`)
    console.log(`    photo:      none (carousel falls back to initials)`)
  }

  if (toAdd.length === 0) {
    console.log('\nNothing to add.\n')
    process.exit(0)
  }

  console.log(`\nfaculty count: ${faculty.length} → ${faculty.length + toAdd.length}\n`)

  if (isDryRun) {
    console.log('DRY RUN — no changes written.\n')
    process.exit(0)
  }

  // Existing members are passed back untouched (ids + photos preserved).
  await payload.update({
    collection: 'music-schools',
    id: school.id,
    data: { faculty: [...faculty, ...toAdd] } as any,
  })

  console.log('✓ Updated. Revalidation hook fired for tag `music-school-kpm-dallas`.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('Update failed:', err)
  process.exit(1)
})
