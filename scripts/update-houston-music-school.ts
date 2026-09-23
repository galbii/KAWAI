#!/usr/bin/env tsx
/**
 * KPM Houston — 2026 content refresh
 *
 * Source: school-supplied copy (director bio, class catalogue, private-lesson
 * program description and rates, new faculty member).
 *
 * What it does:
 *   1. Replaces the semester tuition model (Fall 14wk / Spring 18wk / Summer)
 *      with the current monthly 4-lesson package rates — $190 / $280 / $370.
 *      The semester-tied policies (Semester Structure, Registration Deadlines)
 *      and the Fall/Spring supply fees go with it; registration fees stay.
 *   2. Moves the group keyboard classes out of `programs` and into
 *      `groupClasses`, where the schedule/session/class-size fields actually
 *      render. The old "Adult Group Keyboard Class" program row (Tues 6–6:45pm)
 *      is stale — the class now meets Thursdays 6:45–7:30pm.
 *   3. Rewrites `about` with the school's current private-lesson copy.
 *   4. Replaces Zhu Zhu's bio with the new one, adds Tian Qin to faculty.
 *
 * Deliberately incomplete: the Kids Group Keyboard Class ships without tuition
 * or a meeting time. The supplied copy repeated the adult class's $420 and its
 * Thurs 6:45–7:30pm slot for an 8 × 30-min course — a double-booking that can't
 * both be true. Fill those in once Houston confirms.
 *
 * Goes through the Local API (not the raw driver) so the collection's
 * afterChange hook fires and busts the `music-school-kpm-houston` cache tag.
 *
 * Usage:
 *   bun --env-file=.env.local run content:houston-school:dry-run
 *   bun --env-file=.env.local run content:houston-school
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const SCHOOL_SLUG = 'kpm-houston'

const ABOUT =
  'The private lesson program at the Kawai School of Music (KSM) is a small and selective music program serving Houston and the surrounding neighborhoods. We offer weekly not-for-credit one-on-one piano lessons to admitted students, taught by locally contracted professional instructors. We supplement the private lesson experience with other musical opportunities such as group music theory classes, group lessons, and recitals. The minimum age requirement for private lessons is five. Our environment is small yet personalized, catering to exceptionally gifted students and educating them in the art of traditional classical music performance. Students in the program have access to the Kawai School of Music’s top-notch concert hall and many inspiring musical activities. All instruction takes place exclusively at the Kawai Piano Gallery, 5800 Richmond Ave, Houston, TX 77057.'

const PROGRAMS = [
  {
    name: 'Private Piano Lessons',
    description:
      'Weekly one-on-one lessons for students of all ages, minimum age five. Choose a 30-, 45-, or 60-minute lesson length. Students perform in two recitals each year, in December and May.',
    ageRange: '5+',
    duration: '30 / 45 / 60 min',
    price: '$190–$370 per 4 lessons',
    programType: 'private-lessons',
    isHighlighted: true,
  },
  {
    name: 'Group Piano Lessons',
    description:
      'For beginner students of all ages (preschool through adult); covers piano technique, foundations of music, ensemble playing, and more',
    programType: 'private-lessons',
    isHighlighted: false,
  },
  {
    name: 'Beginner Piano Lessons',
    description: 'Private and group lessons for beginning students ages 5+',
    ageRange: '5+',
    programType: 'private-lessons',
    isHighlighted: false,
  },
  {
    name: 'Voice Lessons',
    description:
      'Vocal instruction for students of all ages, covering classical, pop, and musical theater styles. Lessons focus on technique, breath support, and performance skills.',
    programType: 'private-lessons',
    isHighlighted: false,
  },
]

const GROUP_CLASSES = [
  {
    name: 'Adult Group Keyboard Class',
    description: 'Tuition is $420 in total, due in full at the first class.',
    studentsMin: 4,
    studentsMax: 8,
    tuition: 420,
    schedule: 'Thursdays @ 6:45–7:30 pm',
    sessionsInfo:
      '14 weekly 45-minute sessions · Three sessions per year: Jan–Apr, May–Aug, Sep–Dec',
    isHighlighted: true,
  },
  {
    name: 'Kids Group Keyboard Class',
    description:
      'Call the school at 832-392-0702 for the current session’s meeting time and tuition.',
    ageRange: '4–6',
    studentsMin: null,
    studentsMax: 4,
    tuition: null,
    schedule: null,
    sessionsInfo:
      '8 weekly 30-minute sessions · Three sessions per year: Feb–Mar, May–Aug, Sep–Dec',
    isHighlighted: false,
  },
]

const TUITION_SEMESTERS = [
  {
    semester: 'Private Lessons',
    weeks: 'Billed monthly — four lessons',
    lessonPackages: [{ lessonCount: 4, price30: 190, price45: 280, price60: 370 }],
    semesterNotes:
      'Tuition is billed monthly in blocks of four lessons and is due at the beginning of each month.',
  },
]

const FEES = [
  { feeName: 'Registration Fee (per student)', amount: '$25' },
  { feeName: 'Registration Fee (per family)', amount: '$30' },
]

const POLICIES = [
  {
    title: 'Tuition Payment',
    body: 'Tuition is billed monthly in blocks of four lessons and is due at the beginning of each month.',
  },
  {
    title: 'Recitals',
    body: 'Students perform in two recitals each year, in December and May.',
  },
  {
    title: 'New Student Trial',
    body: 'New students meet with the director for a free trial lesson. Parents are expected to be present.',
  },
  {
    title: 'Minimum Age',
    body: 'Minimum age for private lessons is five years old.',
  },
]

const MAKEUP_LESSON_POLICY = 'Makeup lessons are scheduled directly through your studio teacher.'

const ZHU_ZHU_BACKGROUND =
  'Dr. Zhu Zhu is an internationally active pianist, educator, and studio director whose career spans the concert stage, the university classroom, and the private teaching studio. A graduate of the Interlochen Center for the Arts, the University of Michigan, and Rice University’s Shepherd School of Music — where she earned both her Master’s and Doctorate on full scholarship — she has performed at venues and festivals across the United States, China, Mexico, and Europe, including the Gilmore Festival, the Conservatory Project at the Kennedy Center, and Houston’s Musiqa concert series. She currently serves as President of the Houston Music Teachers Association (2026–2028) and Director of the Kawai School of Music in Houston. As a teacher, Dr. Zhu Zhu is as demanding as she is devoted: she holds her students to the highest musical standards while believing that the deepest purpose of music education is the cultivation of love — for music, for art, for discipline, and for one another. Her studio’s graduates have gone on to the nation’s most selective conservatories and universities, including The Juilliard School, Manhattan School of Music, Oberlin Conservatory, and the Shepherd School of Music at Rice, among others. She directs her Houston studio alongside her husband, Dr. Richard Marshall, and is the mother of two children, Vivi and Jackie.'

const TIAN_QIN_BACKGROUND =
  'Houston-based Chinese composer and keyboardist Tian Qin creates music that’s compelling, humorous, and visually vivid — blending text, craft, film, and choreography, often pushing the boundaries of traditional forms while incorporating her cultural heritage, engaging communal experiences, and guiding the explorations of body and mind. She has collaborated with The Rhythm Method, Loop38, Rhapsode Guild, Loadbang, Musiqa, Asia Society, and Roomful of Teeth, and is the 2024 American Guild of Organists Student Commissioning Project winner and a 2025 Houston Arts Alliance “Let Creativity Happen” Award recipient. Tian serves as a teaching artist at American Festival for the Arts & MusiqaLab, theory instructor at Opus One Chamber Music School, Auxiliary Programs Piano Instructor at Annunciation Orthodox School, organist at Trinity Episcopal Church (Houston), and a member of Gamelan of the New Moon, and she studies raga with Ragavan Manian.'

const TIAN_QIN = {
  name: 'Tian Qin',
  title: 'Composer and Keyboardist',
  specialties: 'Piano, composition, music theory, organ',
  background: TIAN_QIN_BACKGROUND,
  education: [
    { degree: 'M.M. Rice University (Brown Fellow)' },
    { degree: 'B.M. Manhattan School of Music' },
    { degree: 'Shanghai Conservatory of Music' },
  ],
}

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

  const zhuZhu = faculty.find((f) => f.name.includes('Zhu Zhu'))
  if (!zhuZhu) {
    console.error('✗ Zhu Zhu not found in Houston faculty. Aborting rather than guessing.')
    process.exit(1)
  }

  // Preserve every faculty member's photo + array ids; only rewrite Zhu Zhu.
  const updatedFaculty: FacultyMember[] = faculty.map((f) =>
    f === zhuZhu
      ? {
          ...f,
          name: 'Dr. Zhu Zhu',
          title: 'Director, Kawai School of Music',
          role: 'Director of KSM and piano instructor',
          specialties: 'Piano Performance',
          teachingFocus:
            'Pre-collegiate and conservatory-track students; cultivating a love for music, art, discipline, and one another',
          background: ZHU_ZHU_BACKGROUND,
        }
      : f,
  )

  const alreadyHasTianQin = faculty.some((f) => f.name === TIAN_QIN.name)
  if (!alreadyHasTianQin) updatedFaculty.push(TIAN_QIN as FacultyMember)

  console.log(`\n── KPM Houston (id: ${school.id}) ─────────────────────────\n`)
  console.log(`directorName: ${JSON.stringify((school as any).directorName)} → "Dr. Zhu Zhu"`)
  console.log(`minimumAge:   ${JSON.stringify((school as any).minimumAge ?? null)} → 5`)
  console.log(`tuitionDueDate: ${JSON.stringify((school as any).tuitionDueDate ?? null)} → "Beginning of each month"`)
  console.log(`\nabout: ${(school as any).about?.length ?? 0} chars → ${ABOUT.length} chars`)
  console.log(
    `\nprograms: ${((school as any).programs ?? []).length} → ${PROGRAMS.length}` +
      `  (dropped the stale "Adult Group Keyboard Class" row)`,
  )
  console.log(
    `groupClasses: ${((school as any).groupClasses ?? []).length} → ${GROUP_CLASSES.length}`,
  )
  console.log(
    `tuitionSemesters: ${((school as any).tuitionSemesters ?? [])
      .map((s: any) => s.semester)
      .join(', ')} → ${TUITION_SEMESTERS.map((s) => s.semester).join(', ')}`,
  )
  console.log(
    `fees: ${((school as any).fees ?? []).length} → ${FEES.length}  (supply fees were semester-tied)`,
  )
  console.log(
    `policies: ${((school as any).policies ?? [])
      .map((p: any) => p.title)
      .join(' | ')}\n       → ${POLICIES.map((p) => p.title).join(' | ')}`,
  )
  console.log(`makeupLessonPolicy: ${JSON.stringify((school as any).makeupLessonPolicy ?? null)}`)
  console.log(`                →   ${JSON.stringify(MAKEUP_LESSON_POLICY)}`)
  console.log(
    `\nfaculty: ${faculty.map((f) => f.name).join(', ')}\n      → ${updatedFaculty
      .map((f) => f.name)
      .join(', ')}`,
  )
  console.log(`  Zhu Zhu bio: ${zhuZhu.background?.length ?? 0} chars → ${ZHU_ZHU_BACKGROUND.length} chars`)
  console.log(`  Zhu Zhu photo preserved: ${JSON.stringify(zhuZhu.photo ?? null)}\n`)

  if (isDryRun) {
    console.log('DRY RUN — no changes written.\n')
    process.exit(0)
  }

  await payload.update({
    collection: 'music-schools',
    id: school.id,
    data: {
      directorName: 'Dr. Zhu Zhu',
      about: ABOUT,
      minimumAge: 5,
      programs: PROGRAMS,
      groupClasses: GROUP_CLASSES,
      tuitionSemesters: TUITION_SEMESTERS,
      tuitionPaymentType: 'monthly',
      tuitionDueDate: 'Beginning of each month',
      fees: FEES,
      policies: POLICIES,
      makeupLessonPolicy: MAKEUP_LESSON_POLICY,
      faculty: updatedFaculty,
    } as any,
  })

  console.log('✓ Updated. Revalidation hook fired for tag `music-school-kpm-houston`.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('Update failed:', err)
  process.exit(1)
})
