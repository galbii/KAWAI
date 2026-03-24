import type { Config, Plugin } from 'payload'

export const musicSchoolSeedPlugin = (): Plugin => (config: Config): Config => {
  return {
    ...config,
    onInit: async (payload) => {
      if (config.onInit) await config.onInit(payload)
      if (process.env.PAYLOAD_SEED === 'true') {
        await seedMusicSchools(payload)
      }
    },
  }
}

async function findStorefrontId(
  payload: import('payload').Payload,
  slug: string,
): Promise<string | null> {
  try {
    const result = await payload.find({
      collection: 'storefronts',
      where: { slug: { equals: slug } },
      depth: 0,
      limit: 1,
    })
    const doc = result.docs[0]
    if (doc) {
      payload.logger.info(`Found storefront for slug "${slug}" (id: ${doc.id})`)
      return String(doc.id)
    }
    payload.logger.info(`No storefront found for slug "${slug}" — proceeding without storefront link`)
    return null
  } catch (err) {
    payload.logger.info(
      `Could not query storefront for slug "${slug}": ${err instanceof Error ? err.message : String(err)} — proceeding without storefront link`,
    )
    return null
  }
}

async function seedMusicSchools(payload: import('payload').Payload): Promise<void> {
  payload.logger.info('Checking MusicSchools collection for seeding...')

  try {
    // Check if KPM Houston already exists — if so, skip all seeding
    const existing = await payload.find({
      collection: 'music-schools',
      where: { schoolName: { equals: 'KPM Houston' } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      payload.logger.info('MusicSchools already seeded — skipping')
      return
    }

    payload.logger.info('Seeding MusicSchools...')

    // ── Houston ──────────────────────────────────────────────────────────────
    const houstonStorefrontId = await findStorefrontId(payload, 'houston')

    const houstonData: Record<string, unknown> = {
      schoolName: 'KPM Houston',
      slug: 'kpm-houston',
      isActive: true,
      officialName: 'Kawai School of Music (KSM)',
      directorName: 'Zhu Zhu',
      about:
        'The Private Lesson Program at KSM is a small and selective music program serving Houston and surrounding areas. It offers weekly not-for-credit one-on-one individual piano lessons taught by professional instructors. KSM supplements the private lesson experience with group music theory classes, group lessons, and recitals. The school caters to students of all ages and skill levels in classical, jazz, and pop styles. Minimum age requirement for private lessons is age five. All instruction takes place exclusively at the Kawai Piano Gallery.',
      contactInfo: {
        address: '5800 Richmond Ave',
        city: 'Houston',
        state: 'TX',
        zip: '77057',
        phone: '713-904-0001',
        schoolPhone: '832-392-0702',
        email: 'info@kawaipianoshouston.com',
        website: 'kawaipianoshouston.com',
      },
      hours: [
        { day: 'Monday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Tuesday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Wednesday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Thursday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Friday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Saturday', hoursOpen: '10:00 am – 6:00 pm' },
        { day: 'Sunday', hoursOpen: '1:00 pm – 5:00 pm' },
      ],
      programs: [
        {
          name: 'Private Piano Lessons',
          description:
            'Weekly one-on-one lessons for beginner to advanced students ages 5 and up (30, 45, or 60 min)',
          ageRange: '5+',
        },
        {
          name: 'Group Piano Lessons',
          description:
            'For beginner students of all ages (preschool through adult); covers piano technique, foundations of music, ensemble playing, and more',
        },
        {
          name: 'Beginner Piano Lessons',
          description: 'Private and group lessons for beginning students ages 5+',
          ageRange: '5+',
        },
        {
          name: 'Voice Lessons',
          description:
            'Vocal instruction for students of all ages, covering classical, pop, and musical theater styles. Lessons focus on technique, breath support, and performance skills.',
        },
        {
          name: 'Adult Group Keyboard Class',
          description: '14 weekly sessions, Tues @ 6pm–6:45pm',
          price: '$420 for 14 weekly sessions',
        },
      ],
      facilities: [
        { name: 'Soundproof Teaching and Practice Rooms', description: '' },
        { name: 'Comfortable Waiting Area', description: '' },
        {
          name: 'Concert Hall',
          description:
            "160-seat concert hall with Kawai's flagship Shigeru Kawai SK-EX concert grand piano and a second 7-foot SK semi-concert grand for dual-piano performances.",
          capacity: 160,
          dimensions: "33′ × 20′ stage",
        },
      ],
      tuitionSemesters: [
        { semester: 'Fall',   weeks: '14 weeks',  price30min: '$630',       price45min: '$910',       price60min: '$1,190' },
        { semester: 'Spring', weeks: '18 weeks',  price30min: '$810',       price45min: '$1,170',     price60min: '$1,530' },
        { semester: 'Summer', weeks: '6–8 weeks', price30min: '$270–$350',  price45min: '$390–$520',  price60min: '$510–$680' },
      ],
      fees: [
        { feeName: 'Registration Fee (per student)', amount: '$25' },
        { feeName: 'Registration Fee (per family)',  amount: '$30' },
        { feeName: 'Supply Fee — Fall semester',     amount: '$10' },
        { feeName: 'Supply Fee — Spring semester',   amount: '$15' },
      ],
      policies: [
        {
          title: 'Semester Structure',
          body: 'Fall: 14 lessons (Aug–Dec). Spring: 18 lessons (Jan–May). Summer: 6–8 lessons (Jun–Aug). Summer is not required but highly recommended.',
        },
        {
          title: 'Registration Deadlines',
          body: 'Fall: August 10. Spring: December 1. Summer: May 1.',
        },
        {
          title: 'Tuition Payment',
          body: 'Tuition is due by the 10th of each month or may be paid in full per semester in advance.',
        },
        {
          title: 'New Student Trial',
          body: 'New students meet with the director for a free trial lesson. Parents are expected to be present.',
        },
        {
          title: 'Minimum Age',
          body: 'Minimum age for private lessons is five years old.',
        },
      ],
      faculty: [
        {
          name: 'Zhu Zhu',
          title: 'Director, Kawai School of Music',
          role: 'Director of KSM and piano instructor',
          specialties: 'Piano Performance',
          teachingFocus:
            'Pre-collegiate students; passionate about cultivating love for music, art, discipline',
          background:
            'Studied under Dr. Robert Roux at Rice. Won the Shepherd School concerto competition and soloed with the Shepherd School symphony orchestra. Awarded the Lodieska Stockbridge Vaughn Fellowship. Most outstanding undergraduate student award at University of Michigan. Performed at the Gilmore Festival, Kennedy Center Conservatory Project, and Musiqa concert series. Distinguished Professor at Qingdao University School of Music; Director of International Neoarts Foundation.',
          education: [
            { degree: 'D.M.A. Piano Performance, Rice University (Shepherd School of Music)' },
            { degree: 'M.M. Piano Performance, Rice University' },
            { degree: 'B.M. Piano Performance, University of Michigan' },
          ],
        },
        {
          name: 'Jane Vandiver',
          title: 'Beginner Piano, Group Lessons, and Voice Lessons',
          role: 'Voice and piano teacher',
          specialties: 'Beginner piano lessons, group lessons, voice lessons',
          background:
            "Performed in every US state except Alaska, plus Canada, UK, Germany, Greece, Italy, Turkey, Scotland, Spain, Iceland, Australia, and Japan. Performed with The New Christy Minstrels, Les Brown Band, The Glenn Miller Band, and The Henry Mancini Orchestra. Sang at Kennedy Center for President Bush Sr.'s Inaugural Ball. Voice on national commercials (TV Land, Viacom). Owner of Star Singers Studio. Theater credits include Theater Under the Stars, Actors Workshop, The Country Playhouse.",
          education: [],
        },
      ],
    }

    if (houstonStorefrontId) {
      houstonData.storefront = houstonStorefrontId
    }

    await payload.create({
      collection: 'music-schools',
      data: houstonData as any,
    })

    payload.logger.info('Created MusicSchool: KPM Houston')

    // ── Dallas ───────────────────────────────────────────────────────────────
    const dallasStorefrontId = await findStorefrontId(payload, 'dallas')

    const dallasData: Record<string, unknown> = {
      schoolName: 'KPM Dallas',
      slug: 'kpm-dallas',
      isActive: true,
      officialName: 'Kawai Music School (KMS)',
      directorName: 'Azin Hakimi',
      about:
        'The Private Lessons Program at Kawai Music School is a personalized music program serving Dallas and surrounding areas. It offers weekly not-for-credit one-on-one individual piano lessons taught by professional instructors. The school supplements the private lesson experience with group music theory classes, group lessons, and recitals. The environment is small yet personalized, catering to students of all ages and skill levels in classical, jazz, and pop styles. Minimum age for private lessons is age five. All instruction takes place exclusively at the Kawai Piano Gallery.',
      contactInfo: {
        address: '601 W. Plano Parkway, Suite 153',
        city: 'Plano',
        state: 'TX',
        zip: '75075',
        phone: '972-379-2200',
        schoolPhone: '972-955-3339',
        email: 'info@kawaipianosdallas.com',
        schoolEmail: 'kawaimusicschool@kawaius.com',
        website: 'kawaipianosdallas.com',
      },
      hours: [
        { day: 'Monday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Tuesday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Wednesday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Thursday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Friday', hoursOpen: '10:00 am – 7:00 pm' },
        { day: 'Saturday', hoursOpen: '10:00 am – 6:00 pm' },
        { day: 'Sunday', hoursOpen: '1:00 pm – 5:00 pm' },
      ],
      programs: [
        {
          name: 'Private Lessons',
          description: 'Piano, strings, and guitar; 30, 45, or 60 minutes in length',
        },
        {
          name: 'Group Lessons for Ages 4–5',
          description:
            'Young beginners; note reading, rhythm, basic piano technique through movement, singing, and activities',
          ageRange: '4-5',
        },
        {
          name: 'Way Cool Keyboarding Class for Kids',
          description:
            'Intro to piano basics; experience multiple music styles; Piano Band ensemble; minimum 4 per class',
          ageRange: '6-10',
        },
        {
          name: 'Way Cool Keyboarding for Teens',
          description:
            'Chord chart playing + traditional note reading; contemporary, rock, praise & worship, pop styles; minimum 4 per class',
          ageRange: '11-16',
        },
        {
          name: 'Musical Moments for the Adult Hobbyist',
          description:
            'Stress-free experience for beginning adults; learn to read music, play by chords, create music with others',
        },
        {
          name: 'Free Complimentary Lesson',
          description: 'Call 972-955-3339 to sign up',
          price: 'Free',
        },
      ],
      facilities: [
        { name: 'Soundproof Rooms', description: '' },
        { name: 'Comfortable Waiting Area', description: '' },
        { name: "Kid's Play Zone", description: '' },
        {
          name: 'Concert Hall',
          description:
            "200-seat concert hall with Kawai's flagship Shigeru Kawai SK-EX concert grand piano. Available for personal recitals, group performances, educational presentations, private parties, corporate meetings, and special events.",
          capacity: 200,
        },
        {
          name: 'Shigeru Room',
          description:
            'Dedicated room presenting the luxury Shigeru Kawai Grand Piano line, used for masterclasses and advanced student performances.',
        },
      ],
      faculty: [
        {
          name: 'Azin Hakimi',
          title: 'Director, Kawai Music School & Piano Teacher',
          role: 'Director of KMS and piano teacher',
          teachingFocus:
            'Warm and caring personality; questions the rationale behind every aspect of instruction; encourages students to strive for excellence.',
          background:
            'Born in Isfahan, Iran. Active as performer, accompanist, and teacher while at the conservatory. Came to the US in 2016 and taught at the Cincinnati School of Music, working with students of all ages and abilities.',
          education: [
            {
              degree:
                'Bachelor of Music in Piano Performance, Yerevan State Conservatory of Armenia',
            },
          ],
        },
        {
          name: 'Sojung Lim',
          title: 'Voice & Piano Teacher',
          role: 'Voice and piano teacher',
          specialties: 'Vocal Performance and Vocal Pedagogy',
          background:
            'South Korean soprano. Performed roles with UNT Opera, Hawaii Performing Arts Festival, Peabody Institute, and Seoul National University Opera. Collaborated with orchestras including National Police Symphony Orchestra (South Korea). Teaching experience with piano students (young to adult) in South Korea and voice students in Dallas ISD.',
          education: [
            {
              degree:
                'Doctoral student in Vocal Performance and Vocal Pedagogy, University of North Texas (current)',
            },
            {
              degree:
                'M.M./Graduate Performance Diploma in Voice Performance, Peabody Institute of The Johns Hopkins University',
            },
            { degree: 'B.M. in Vocal Performance, Seoul National University' },
          ],
        },
        {
          name: 'Amanda Byars',
          title: 'Piano Teacher',
          role: 'Piano teacher (group and private instruction for children and adults)',
          background:
            'Former faculty at Southern Methodist University as Lecturer in Piano Pedagogy and Coordinator of Class Piano. Co-founder and teacher at Dallas/Music performing arts center in the Park Cities. Founder of Piano In Your Home.',
          education: [
            {
              degree:
                'M.M. in Piano Pedagogy, Southern Methodist University (teaching assistant for Louise Bianchi)',
            },
            { degree: 'B.M. in Piano Performance, Converse College, Spartanburg, SC' },
          ],
        },
        {
          name: 'Sujeong Sin',
          title: 'Piano Teacher',
          role: 'Piano teacher',
          background:
            'Award winner in Korean Culture and Arts National Music Competition, National Youth Music Competition, VMP National Music Competition. Received Butler School of Music Scholarship. Taught college non-majors and young students under mentorship of Prof. Sofia Gilmson.',
          education: [
            {
              degree:
                'D.M.A. student, University of North Texas (under Prof. Adam Wodnicki)',
            },
            {
              degree:
                'M.M. and Certificate of Performance, University of Texas at Austin (under Prof. Gregory Allen)',
            },
            { degree: 'B.M., Mokwon University, South Korea' },
          ],
        },
        {
          name: 'Yeseul Cho',
          title: 'Piano Teacher',
          role: 'Piano teacher',
          teachingFocus:
            'Emphasizes safe, respectful education; creates healthy atmosphere through interpersonal skills; aims to guide students to become independent learners.',
          background:
            'Active pedagogue, soloist, and chamber musician. Teaches all ages from pre-k through adults, all levels. Experienced with Royal Conservatory of Music syllabi and exams. Award winner: Music Education News Concours, Pyeongtaek University Music Competition, Eumaksekye Competition.',
          education: [
            {
              degree:
                'D.M.A. student in Piano Performance and Piano Pedagogy, University of North Texas (current)',
            },
            {
              degree:
                'M.M. in Piano Performance, Peabody Institute of The Johns Hopkins University',
            },
            {
              degree:
                "B.M. (highest honors), College of Music, Ewha Woman's University, Seoul",
            },
          ],
        },
        {
          name: 'Mana Honda-Tarui',
          title: 'Piano Teacher',
          role: 'Piano teacher',
          background:
            'Born in Osaka, Japan; started piano at age 4. Won Premier Prix (First Prize) at CNR de Paris graduation exam. Awards include 1st prize at Miyanichi Music Competition, special prize at Kanagawa Piano Competition, semi-finalist at Maria Canals International Competition (Spain), finalist at Marsala International Competition (Italy). Concerts in Paris, Nice, Tokyo, Osaka, Kobe. Former teacher at Toho-Gakuen Music School for Children.',
          education: [
            {
              degree:
                "Solist Diploma course, Toho Gakuen Music University (Japan's top conservatory)",
            },
            {
              degree:
                'Cycle Superior and Troisieme Cycle, Conservatoire National Region de Paris (CNR de Paris) and CRR de Marseille',
            },
          ],
        },
        {
          name: 'Ariel Tan',
          title: 'Piano Teacher',
          role: 'Piano teacher',
          background:
            'Seven years teaching experience. Graduate Instructional Assistant at Texas State University. Finalist in Texas State Concerto Competition. Incorporates music theory, musical selection discussions, and composer histories into lessons. Post-graduate studies at School of the Arts Singapore under Dr. Kim Bo Kyung.',
          education: [
            {
              degree: 'M.M. in Piano Performance and Pedagogy, Texas State University',
            },
            {
              degree:
                'B.M. in Classical Music/Piano Performance, UCSI University, Malaysia',
            },
          ],
        },
        {
          name: 'Gia Choi',
          title: 'Piano Teacher',
          role: 'Piano teacher',
          background:
            'Korean-American pianist; began piano at age five. Won senior division of MTNA competition for Oklahoma. Orchestral debut as soloist with Lawton Philharmonic Orchestra at age 16. Full scholarship to Aspen Music Festival and School, studying with Joseph Kalichstein and Gabriel Chodos. Previous instructors include Hyunsoon Whang, Thomas Labé, and Gabriel Chodos. Extensive experience in collaborative performance and keyboard skills instruction.',
          education: [
            {
              degree:
                'D.M.A. in Piano Performance, University of North Texas (under Joseph Banowetz; held Teaching Fellowship for 5 years)',
            },
            {
              degree: 'M.M., University of North Texas (awarded Teaching Fellowship)',
            },
            { degree: 'B.M., Cameron University (Presser Scholar Award)' },
          ],
        },
      ],
      policies: [
        {
          title: 'Tuition Payment',
          body: 'Tuition is due on the first day of every month via credit card auto-withdrawal on the first week of the month. No cash accepted.',
        },
        {
          title: 'Contracts & Withdrawal',
          body: 'No long-term contracts. One-month written withdrawal notice required to end enrollment. Notify the Director at kawaimusicschool@kawaius.com — notice to the teacher alone is not sufficient.',
        },
        {
          title: 'Missed Lessons',
          body: 'Lessons missed without 24-hour advance notice are non-refundable; makeup provided via Recorded Video. Lessons cancelled with 24-hour notice will be rescheduled or a substitute teacher provided. Group class absences are non-refundable with no makeup.',
        },
        {
          title: 'Child Supervision',
          body: 'Children under age 12 must be escorted by a responsible adult at all times.',
        },
        {
          title: 'Conduct',
          body: 'No food or drinks inside the school except bottled water.',
        },
      ],
      faqs: [
        {
          question: 'Is the piano difficult to learn?',
          answer:
            'The piano is difficult to learn; however it can be one of the most fun and rewarding experiences you undertake. With a good teacher, patience and dedication, you can learn to play. The important thing is to enjoy the journey.',
        },
        {
          question: 'What age should my child start?',
          answer:
            'There is no right age to begin. Whether they start at three or ten, they can both excel with the right learning environment and support. The school has beginning students of all ages.',
        },
        {
          question: 'How often should I practice?',
          answer:
            'Daily practice is required. Each session should be focused on learning or improving a passage, piece, or musical concept. Students are taught how to practice correctly to ensure consistent improvement.',
        },
      ],
    }

    if (dallasStorefrontId) {
      dallasData.storefront = dallasStorefrontId
    }

    await payload.create({
      collection: 'music-schools',
      data: dallasData as any,
    })

    payload.logger.info('Created MusicSchool: KPM Dallas')
    payload.logger.info('MusicSchools seeding completed!')
  } catch (error) {
    payload.logger.error(
      `MusicSchools seeding failed: ${error instanceof Error ? error.message : String(error)}`,
    )
    console.error('Full error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  }
}
