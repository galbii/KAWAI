import { MongoClient, ObjectId } from 'mongodb'

/**
 * Seed the Dallas "Back to School, Back to Music!" signup campaign.
 *
 * Writes straight to Mongo rather than through the Local API: importing
 * payload.config outside Next crashes on Lexical's ESM init order
 * ("Cannot access 'DecoratorNode' before initialization"). The shape below
 * mirrors exactly what Payload stores, verified against the existing
 * fall-open-house document.
 *
 * Idempotent — re-running updates the existing doc by slug rather than
 * creating a duplicate, so copy edits can be applied by editing and re-running.
 *
 * Two deliberate safety choices:
 *  - isDefault stays false. Claiming the bare /store/dallas/signup URL is a
 *    marketer's call, not this script's.
 *  - liveSendEnabled stays false. No lead notification leaves the building
 *    until someone confirms the recipient list.
 */
const SLUG = 'back-to-school'

async function main() {
  const client = new MongoClient(process.env.DATABASE_URI!, { family: 4 })
  await client.connect()
  const db = client.db()

  const store = await db.collection('storefronts').findOne({ slug: 'dallas' })
  if (!store) throw new Error('No storefront with slug "dallas"')

  const now = new Date()

  const doc = {
    title: 'Back to School, Back to Music!',
    slug: SLUG,
    stores: [store._id],
    isActive: true,
    isDefault: false,

    hero: {
      kicker: 'Now enrolling · Kawai Music School Dallas',
      heading: 'Back to School, Back to Music!',
      subheading:
        'Start the school year at the bench. Book a free trial lesson, skip the enrollment fee, and study piano or voice one-on-one with professional instructors.',
      scrim: 'medium',
    },

    blocks: [
      {
        blockType: 'signup-details',
        heading: "What's included",
        items: [
          { icon: 'note', label: 'Trial lesson', value: 'Free — no obligation' },
          { icon: 'price', label: 'Enrollment fee', value: 'Waived — $0 to start' },
          {
            icon: 'price',
            label: 'Student discount',
            value: 'Special pricing toward piano purchase and rental',
          },
          { icon: 'people', label: 'Instruction', value: 'Personalized one-on-one lessons' },
          { icon: 'people', label: 'Faculty', value: 'Experienced, professional instructors' },
          { icon: 'note', label: 'Instruments', value: 'Piano and Voice' },
          {
            icon: 'calendar',
            label: 'Competitions',
            value: 'Exclusive Kawai competition opportunities',
          },
        ],
      },
      {
        blockType: 'signup-instructors',
        heading: "Who you'll study with",
        intro:
          'Our Dallas faculty teach piano and voice at every level — from a first lesson to competition preparation.',
        limit: 6,
      },
      {
        blockType: 'signup-location',
        heading: 'Getting here',
        showMap: true,
        showHours: true,
        parkingNote: 'Free parking directly in front of the studio entrance.',
      },
    ],

    form: {
      title: 'Book your free trial lesson',
      subtitle: 'Takes about 2 minutes',
      submitLabel: 'Claim My Free Lesson',
      finePrint:
        "We'll email a confirmation and call to schedule. No spam, and we never sell your information.",
      collectPhone: true,
      requirePhone: true,
      collectZip: true,
      requireZip: false,
      questions: [
        {
          type: 'select',
          label: 'Which would you like to study?',
          name: 'instrument',
          required: true,
          width: 'full',
          options: [
            { label: 'Piano', value: 'piano' },
            { label: 'Voice', value: 'voice' },
            { label: 'Both', value: 'both' },
            { label: 'Not sure yet', value: 'undecided' },
          ],
        },
        {
          type: 'radio',
          label: 'Student age group',
          name: 'ageGroup',
          required: true,
          width: 'full',
          options: [
            { label: '5–8', value: '5-8' },
            { label: '9–12', value: '9-12' },
            { label: '13+', value: '13-plus' },
            { label: 'Adult', value: 'adult' },
          ],
        },
        {
          type: 'select',
          label: 'Experience level',
          name: 'experience',
          required: false,
          width: 'full',
          options: [
            { label: 'Complete beginner', value: 'beginner' },
            { label: 'Some experience', value: 'some' },
            { label: 'Returning after a break', value: 'returning' },
            { label: 'Advanced', value: 'advanced' },
          ],
        },
        {
          type: 'checkbox',
          label: 'I’m also interested in piano rental or purchase options',
          name: 'wantsPianoInfo',
          required: false,
          width: 'full',
        },
        {
          type: 'textarea',
          label: 'Anything else we should know?',
          name: 'notes',
          required: false,
          width: 'full',
        },
      ],
      successMode: 'message',
    },

    notify: {
      recipients: [],
      cc: [],
      includeStorefrontEmail: false,
      includeSchoolEmail: false,
      autoRouteToRSM: false,
      subjectTemplate: 'New trial lesson request — {{campaign}} ({{store}})',
      liveSendEnabled: false,
      sendConfirmationToLead: true,
      confirmationSubject: "You're booked — your free trial lesson at Kawai Music School Dallas",
    },

    shopify: {
      enableSync: true,
      tags: [{ tag: 'back-to-school' }, { tag: 'music-school-lead' }],
      acceptsMarketing: false,
    },

    meta: {
      title: 'Back to School, Back to Music! | Kawai Music School Dallas',
      description:
        'Free trial lesson, no enrollment fee, and student discounts toward piano purchase and rental. Piano and voice lessons with professional instructors in Dallas.',
    },

    updatedAt: now,
  }

  const existing = await db.collection('signup-campaigns').findOne({ slug: SLUG })

  if (existing) {
    await db.collection('signup-campaigns').updateOne({ _id: existing._id }, { $set: doc })
    console.log(`Updated campaign ${existing._id}`)
  } else {
    const res = await db
      .collection('signup-campaigns')
      .insertOne({ _id: new ObjectId(), ...doc, createdAt: now, __v: 0 } as never)
    console.log(`Created campaign ${res.insertedId}`)
  }

  console.log(`  URL: /store/dallas/signup/${SLUG}`)
  console.log('  isDefault: false — bare /store/dallas/signup stays a 404 until you set it')
  console.log('  liveSendEnabled: false — leads save, no notification email sends')

  await client.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
