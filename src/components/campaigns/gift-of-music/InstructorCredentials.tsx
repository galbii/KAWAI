'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface InstructorCredentialsProps {
  className?: string
}

interface Instructor {
  name: string
  title: string
  imageUrl: string
  briefBio: string
  fullBio: string
}

const instructors: Instructor[] = [
  {
    name: 'AZIN HAKIMI',
    title: 'Director – KAWAI MUSIC SCHOOL | Piano Teacher',
    imageUrl: 'https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.kawaipianosdallas.com/wp-content/uploads/2020/08/Azin-Hakimi-Piano-Teacher-321x450-jpg.webp?bwp',
    briefBio: 'Bachelor of Music from Yerevan State Conservatory. Warm, caring educator dedicated to excellence with students of all ages.',
    fullBio: 'Azin Hakimi was born in the historical city of Isfahan, Iran known for its grand avenues, covered bridges and beautiful gardens. She was drawn to the piano at an early age and began exploring various musical instruments in middle school. By the time she entered high school, Ms. Hakimii had devoted herself entirely to mastering the piano and eventually received a Bachelor of Music degree in piano performance from Yerevan State Conservatory of Armenia. While at the conservatory, she was active as a performer, accompanist, and teacher.\n\nIn 2016, Ms. Hakimii came to the United States to further her career while teaching piano to students of all ages and abilities at the Cincinnati School of Music. She is a dedicated teacher who questions the rationale behind every aspect of her instruction and encourages her students to strive for excellence with her warm and caring personality.\n\nMs. Hakimii loves spicy food, listening to classical music and playing duets with her husband, Sajad, a professional violinist and their 14-month-old son.'
  },
  {
    name: 'SOJUNG LIM',
    title: 'Voice & Piano Teacher',
    imageUrl: 'https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.kawaipianosdallas.com/wp-content/uploads/2024/12/Sojung-Lim-KPGD-419x450-jpg.webp?bwp',
    briefBio: 'Doctoral student at UNT. Graduate Performance Diploma from Johns Hopkins Peabody Institute. Extensive opera performance experience.',
    fullBio: 'Sojung Lim, South Korean soprano, is a doctoral student majoring in Vocal Performance and Vocal Pedagogy at the University of North Texas. Sojung performed Yvette/Georgette (La Rondine) with UNT Opera in the Spring of 2024, and she was assigned as a cover of La fée (Cendrillon) with UNT Opera in the Fall of 2023. Most recently, she performed the role of Coco and 2nd Policewoman (Orpheus in the Underworld) in Hawaii Performing Arts Festival. In 2020, she was featured as the role of Sojung (Isolation) in the pastiche opera film directed by Ann Baltz. Also, she performed "VII. Enfant" as the title role of Emilie (Emilie by Kaija Saariaho) at Peabody Institute of The Johns Hopkins University. Sojung performed the role of Knabe 1 (Die Zauberflöte) with Seoul National University Opera. She also participated in Das Italienisches Liederbuch Projeckt with Arlene Shrut at the Peabody Institute.\n\nSojung collaborated with numerous orchestras. She participated in the third Philharmonic Orchestra\'s Regular Concert at Seongnam Art Center Concert Hall. She also collaborated with National Police Symphony Orchestra at Universal Art Center in South Korea. Sojung participated in Su Camerata Concert at Seoul Arts Center and Suwon Debut Concert at Gyeonggi Arts Center in South Korea. She also held a concert for Suwon Medical Association.\n\nIn addition to performances, Sojung loves teaching both voice and piano. She had experienced in teaching piano for young students to adults when she was in South Korea. Also, she has been teaching middle and high school students in Dallas ISD to help them improve basic vocal techniques and musicality. Her goal for teaching is to let students sing and play music with passion and enjoyment.\n\nSojung Lim received her bachelor\'s degree in Vocal Performance from Seoul National University and her master\'s degree/Graduate Performance Diploma in Voice Performance at Peabody Institute of The Johns Hopkins University.'
  },
  {
    name: 'AMANDA BYARS',
    title: 'Piano Teacher',
    imageUrl: 'https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.kawaipianosdallas.com/wp-content/uploads/2019/09/Amanda-Byars-450x360-jpeg.webp?bwp',
    briefBio: 'Former SMU faculty. Master of Music in Piano Pedagogy. Studied under renowned pedagogue Louise Bianchi.',
    fullBio: 'Amanda Byars is an independent music educator specializing in group and private instruction for children and adults in Dallas, Texas. Prior to establishing Piano In Your Home, she served on the faculty at Southern Methodist University as Lecturer in Piano Pedagogy and Coordinator of Class Piano. She was also co-founder and teacher of piano at Dallas/Music – a performing arts center located in the Park Cities.\n\nMs. Byars received a Bachelor of Music in piano performance from Converse College in Spartanburg, South Carolina and the Master of Music in piano pedagogy from S.M.U. where she was a teaching assistant for the internationally renowned pedagogue, Louise Bianchi.'
  },
  {
    name: 'SUJEONG SIN',
    title: 'Piano Teacher',
    imageUrl: 'https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.kawaipianosdallas.com/wp-content/uploads/2025/08/photo-copy-322x450.webp?bwp',
    briefBio: 'DMA candidate at UNT. Award winner in Korean Culture & Arts National, National Youth Music, and VMP National competitions.',
    fullBio: 'South Korean pianist Sujeong Sin has distinguished herself through her academic achievements and musical artistry. She began her studies at Mokwon University in South Korea, where she earned her undergraduate degree with outstanding dedication.\n\nDriven by a pursuit of excellence, she continued her education in the United States, obtaining a Master of Music degree and a Certificate of Performance from the University of Texas at Austin, studying under the esteemed Prof. Gregory Allen. She then pursued a Doctor of Musical Arts degree at the University of North Texas, under the guidance of Prof. Adam Wodnicki.\n\nSujeong has received numerous accolades in national and international music competitions, including the Korean Culture and Arts National Music Competition, the National Youth Music Competition, and the VMP National Music Competition. Her exceptional talent was further recognized through the prestigious Butler School of Music Scholarship.\n\nBeyond her achievements as a performer, Sujeong is a dedicated educator with a deep passion for teaching. Under the mentorship of Prof. Sofia Gilmson, she taught college non-majors and young students, demonstrating a commitment to nurturing musicians of all levels. Her enthusiasm for guiding students toward their full potential reflects her unwavering dedication to both musical excellence and education.'
  },
  {
    name: 'YESEUL CHO',
    title: 'Piano Teacher',
    imageUrl: 'https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.kawaipianosdallas.com/wp-content/uploads/2023/08/ya-315x450-jpg.webp?bwp',
    briefBio: 'Peabody Institute graduate pursuing DMA at UNT. Award winner in prestigious competitions. Expert in Royal Conservatory curriculum.',
    fullBio: 'Yeseul Cho has an active career as a piano pedagogue, soloist, and chamber musician. She has taught all ages and stages; from pre-k through adult learners, and all levels from beginner through advanced.\n\nAs an educator, Yeseul Cho strives to cultivate well-rounded musicians, both professionally and personally. Her teaching philosophy emphasizes the importance of providing a safe and respectful education for every student. She ensures a secure environment not only in group classes but also in private lessons, allowing students to pursue their goals with confidence. Creating a healthy atmosphere through interpersonal skills is essential for fostering student development in every lesson.\n\nYeseul embraces versatility in her role as a teacher, readily adapting to each student to unlock their full potential. She maintains a flexible and open-minded attitude in every lesson, offering valuable experience teaching various syllabi and exams, such as the Royal Conservatory of Music, catering to students of different ages and proficiency levels. Her ultimate aim is to guide students in becoming independent learners through organized sequences and guided lessons.\n\nAs a soloist, Yeseul was awarded with prestigious prizes including Music Education News Concours, Pyeongtaek University Music Competition, Eumaksekye Competition and etc.\n\nYeseul studied at Sunhwa Arts High School in Seoul, South Korea, for musically gifted teenagers. She graduated with the highest honors from the College of Music, Ewha Woman\'s University in Seoul. Later she earned her Master\'s Degree in Piano Performance at the Peabody Institute of The Johns Hopkins University. She is currently pursuing a Doctor of Musical Arts degree in Piano Performance and Piano Pedagogy at the University of North Texas.'
  },
  {
    name: 'MANA HONDA-TARUI',
    title: 'Piano Teacher',
    imageUrl: 'https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.kawaipianosdallas.com/wp-content/uploads/2023/03/Mana-Honda-252x450-jpg.webp?bwp',
    briefBio: 'Premier Prix from Conservatoire National Region de Paris. Competition winner in Japan, Spain, and Italy.',
    fullBio: 'Mana Honda-Tarui was born in Osaka, started playing the piano at the age of 4.\n\nIn 1991, she moved to Tokyo, entered the Toho Gakuen Music High School, and studied the piano with Prof. Yasushi HIROSE. In 1994, she graduated from high school with honors and proceeded to the Solist Diploma course at Toho Gakuen Music University, one of Japan\'s top Conservatory.\n\nIn 1996 she moved to Paris, FRANCE, to further flourish her piano t skills with the world-renowned Professor Jaques ROUVIER and Professor Olivier GARDON at Conservatoire National Region de Paris (currently known as CRR Paris) and CRR de Marseille.\n\nIn 1998, She won the Premier Prix (First Prize) for the graduation exam of Cycle Superior at CNR de Paris. Afterwards, she completed Troisieme Cycle of CNR de Paris and CRR de Marseille in 2001.\n\nWhile studying at the Conservatory, she won awards, including 1st prize at the Miyanichi Music Competition, the special prize .at the Kanagawa Piano Competition (Japan), a semi-finalist at Maria canals International competition (Spain), a finalist at Marsala International competition (Italy).\n\nShe has held a variety of concerts in Paris, Nice, Tokyo, Osaka, Kobe etc.\n\nSince she got back to Japan in 2001, She has been teaching piano to every age range student as a teacher at \'Toho-Gakuen Music School for Children\' and supporting students to enroll in some universities in Japan. Her students have received numerous awards in both national and international competitions.'
  },
  {
    name: 'ARIEL TAN',
    title: 'Piano Teacher',
    imageUrl: 'https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.kawaipianosdallas.com/wp-content/uploads/2023/09/arieltan2-jpg.webp?bwp',
    briefBio: 'Master\'s in Piano Performance and Pedagogy from Texas State University. Seven years of teaching experience across Singapore and Texas.',
    fullBio: 'Ariel is an accomplished piano instructor with seven years of teaching experience. Her passion for music education and commitment to her students have made her a sought-after teacher. With expertise in both in-person and online instruction, Ariel has successfully guided students of all ages and skill levels on their musical journey.\n\nWith previous roles at different music schools in Singapore, Ariel has a wealth of experience teaching students of all ages and skill levels. She conducted both individual and group lessons, showcasing her versatility as an instructor. Ariel\'s meticulous approach to curriculum development, selection of course materials, and preparation of assignments and exams has contributed to her students\' success. She strongly believes in establishing a solid foundation by incorporating basic music theory into lessons and engaging students in discussions on musical selection and composer histories.\n\nAriel\'s dedication to music education extends beyond the classroom. As a Graduate Instructional Assistant at Texas State University, she collaborated with voice and instrumental students, fostering their growth and development. She also actively performed with the choir, contributing to higher artistic achievements. Ariel\'s ability to communicate and collaborate with fellow musicians has greatly enriched her teaching style.\n\nHer educational achievements further reinforce her expertise as a piano instructor. She holds a Master\'s degree in Piano Performance and Pedagogy from Texas State University, where she maintained an exceptional GPA and received prestigious scholarships and a Graduate Instructional Assistantship. Ariel\'s musical talent was recognized as she reached the finals of the Texas State Concerto Competition.\n\nAriel\'s pursuit of excellence began with a Bachelor\'s degree in Classical Music in Piano Performance from UCSI University in Malaysia, where she actively engaged in workshops conducted by renowned Kodály expert László Norbert Nemes. Her post-graduate studies at the School of the Arts Singapore (SOTA) refined her piano playing skills under the guidance of Dr. Kim Bo Kyung.\n\nWith Ariel\'s guidance, aspiring pianists can expect a comprehensive and enriching musical education tailored to their unique goals and interests. Her passion for teaching, combined with her extensive experience and educational background, make her an exceptional choice for anyone looking to embark on a rewarding piano journey.'
  }
]

function InstructorCard({ instructor, index }: { instructor: Instructor; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isImageLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="group"
    >
      <div className={cn(
        "grid md:grid-cols-[240px_1fr] gap-3 lg:gap-4 bg-amber-50/70 backdrop-blur-sm rounded-none border-l-4 border-kawai-red hover:border-kawai-black hover:bg-amber-50 transition-all duration-300 p-3 lg:p-4 shadow-sm hover:shadow-md",
        isImageLeft ? "" : "md:grid-cols-[1fr_240px]"
      )}>
        {/* Image */}
        <div className={cn(
          "relative w-full aspect-[3/4] overflow-hidden rounded-sm",
          isImageLeft ? "md:order-1" : "md:order-2"
        )}>
          <Image
            src={instructor.imageUrl}
            alt={instructor.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className={cn(
          "flex flex-col justify-center",
          isImageLeft ? "md:order-2" : "md:order-1"
        )}>
          {/* Name */}
          <h3 className="font-serif text-lg sm:text-xl mb-0.5 text-kawai-black leading-tight">
            {instructor.name}
          </h3>

          {/* Title */}
          <p className="text-xs text-kawai-red mb-2 font-light tracking-wide">
            {instructor.title}
          </p>

          {/* Brief Bio - Show first ~250 characters */}
          <p className="text-base sm:text-lg text-kawai-black/80 leading-snug font-light mb-2">
            {instructor.fullBio.substring(0, 250)}...
          </p>

          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs text-kawai-red hover:text-kawai-black transition-colors duration-200 group/btn self-start"
          >
            <span className="font-medium">
              {isExpanded ? 'Show Less' : 'Read Full Bio'}
            </span>
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </button>

          {/* Expandable Full Bio */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-kawai-black/10">
                  {instructor.fullBio.split('\n\n').map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-kawai-black/80 leading-snug font-light mb-2.5 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative Line */}
          <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-kawai-red via-rose-400 to-kawai-red group-hover:w-20 transition-all duration-300" />
        </div>
      </div>
    </motion.div>
  )
}

export default function InstructorCredentials({ className }: InstructorCredentialsProps) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24 bg-kawai-pearl text-kawai-black relative overflow-hidden", className)}>
      {/* Subtle background accents */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kawai-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kawai-red/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-4 leading-tight text-kawai-black">
            Meet Our
            <br />
            <span className="text-kawai-red">World-Class Instructors</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-kawai-red via-rose-400 to-kawai-red mx-auto mb-6" />
          <p className="text-base sm:text-lg lg:text-xl text-kawai-black/70 max-w-4xl mx-auto leading-relaxed font-light">
            Learn from award-winning musicians holding degrees from prestigious conservatories worldwide
          </p>
        </motion.div>

        {/* Instructor List - Alternating Layout */}
        <div className="space-y-4 lg:space-y-5">
          {instructors.map((instructor, index) => (
            <InstructorCard
              key={instructor.name}
              instructor={instructor}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
