export type SeedGroup = {
  name: string
  slug: string
  heading: string
  description: string
  isActive: boolean
  displayOrder: number
  seo: { metaTitle: string; metaDescription: string }
}

export type SeedCategory = {
  name: string
  slug: string
  description: string
  icon: string
  color: string
  displayOrder: number
  groupSlug: string
}

export type SeedFaq = {
  question: string
  excerpt: string
  answer: string[]
  groupSlug: string
  categorySlug: string
}

export const SEED_SUPPORT_GROUPS: SeedGroup[] = [
  {
    name: 'Product Support',
    slug: 'product-support',
    heading: 'Product Support',
    description:
      'How-to guides, settings, connectivity, app setup, and product information for your Kawai instrument.',
    isActive: true,
    displayOrder: 1,
    seo: {
      metaTitle: 'Product Support | Kawai Technical Support',
      metaDescription:
        'Get help setting up, connecting, and getting the most from your Kawai piano.',
    },
  },
  {
    name: 'Technical Support Division',
    slug: 'tsd',
    heading: 'Technical Support Division',
    description:
      'Need a repair, spare parts, or warranty service? Our Technical Support Division team is here to help.',
    isActive: true,
    displayOrder: 2,
    seo: {
      metaTitle: 'Technical Support Division | Kawai Support',
      metaDescription:
        'Request repairs, order spare parts, and get warranty support for your Kawai instrument.',
    },
  },
]

export const SEED_FAQ_CATEGORIES: SeedCategory[] = [
  // product-support categories
  {
    name: 'Bluetooth & Connectivity',
    slug: 'bluetooth-connectivity',
    description: 'Bluetooth MIDI and Audio setup for iOS, Android, Mac, and Windows.',
    icon: 'wifi',
    color: '#6366F1',
    displayOrder: 1,
    groupSlug: 'product-support',
  },
  {
    name: 'Apps & Software',
    slug: 'apps-software',
    description: 'PianoRemote, PiaBookPlayer, firmware updates, and app compatibility.',
    icon: 'smartphone',
    color: '#22C55E',
    displayOrder: 2,
    groupSlug: 'product-support',
  },
  {
    name: 'Settings & Configuration',
    slug: 'settings-configuration',
    description: 'Auto power off, language, saving preferences, and factory reset.',
    icon: 'settings',
    color: '#F59E0B',
    displayOrder: 3,
    groupSlug: 'product-support',
  },
  {
    name: 'Recording & Audio',
    slug: 'recording-audio',
    description: 'Recording to a computer, Line Out quality, USB audio, and DAW setup.',
    icon: 'mic',
    color: '#EC4899',
    displayOrder: 4,
    groupSlug: 'product-support',
  },
  {
    name: 'Piano Care & Maintenance',
    slug: 'piano-care-maintenance',
    description: 'Cleaning, placement, storage, transport, and tuning guidance.',
    icon: 'heart',
    color: '#2EC4A0',
    displayOrder: 5,
    groupSlug: 'product-support',
  },
  {
    name: 'Accessories & Compatibility',
    slug: 'accessories-compatibility',
    description:
      'USB memory, pedals, stands, power adapters, and headphone compatibility.',
    icon: 'package',
    color: '#E8A84E',
    displayOrder: 6,
    groupSlug: 'product-support',
  },
  {
    name: 'Product Information',
    slug: 'product-information',
    description:
      'Manufacturing locations, serial numbers, product features, and specifications.',
    icon: 'info',
    color: '#8B5CF6',
    displayOrder: 7,
    groupSlug: 'product-support',
  },
  {
    name: 'Sound & Behavior',
    slug: 'sound-behavior',
    description:
      'Understanding piano sounds, pedal functions, split mode, and expected behaviors.',
    icon: 'music',
    color: '#14B8A6',
    displayOrder: 8,
    groupSlug: 'product-support',
  },
  // tsd categories
  {
    name: 'Diagnose a Problem',
    slug: 'diagnose-problem',
    description: 'Something wrong with your piano? Start here.',
    icon: 'alert-circle',
    color: '#EF4444',
    displayOrder: 1,
    groupSlug: 'tsd',
  },
  {
    name: 'Spare Parts & Orders',
    slug: 'spare-parts-orders',
    description: 'Ordering genuine Kawai parts, accessories, and replacements.',
    icon: 'package',
    color: '#F59E0B',
    displayOrder: 2,
    groupSlug: 'tsd',
  },
  {
    name: 'Warranty & Defects',
    slug: 'warranty-defects',
    description: 'Warranty claims, transferability, and new product defects.',
    icon: 'shield',
    color: '#22C55E',
    displayOrder: 3,
    groupSlug: 'tsd',
  },
  {
    name: 'Repair & Modifications',
    slug: 'repair-modifications',
    description: 'Service appointments, ATX/AURES retrofit, and professional repairs.',
    icon: 'tool',
    color: '#6366F1',
    displayOrder: 4,
    groupSlug: 'tsd',
  },
  // product-support categories (continued)
  {
    name: 'Buying Guide',
    slug: 'buying-guide',
    description: 'Piano types, costs, brand history, and how to choose the right instrument.',
    icon: 'shopping-cart',
    color: '#0EA5E9',
    displayOrder: 9,
    groupSlug: 'product-support',
  },
  // tsd categories (continued)
  {
    name: 'Legacy Products & Synthesizers',
    slug: 'legacy-products-synthesizers',
    description: 'Discontinued Kawai synthesizers, session trainers, and legacy keyboard support.',
    icon: 'keyboard',
    color: '#8B5CF6',
    displayOrder: 5,
    groupSlug: 'tsd',
  },
  {
    name: 'Service Manuals & Downloads',
    slug: 'service-manuals-downloads',
    description: 'Acoustic service manuals, firmware/OS downloads, and technical documentation.',
    icon: 'download',
    color: '#64748B',
    displayOrder: 6,
    groupSlug: 'tsd',
  },
]

export const FAQ_SEED_DATA: SeedFaq[] = [
  // ─── TSD FAQs ────────────────────────────────────────────────────────────────

  {
    question: 'I think there might be something wrong with my piano — what should I do?',
    excerpt:
      'Start with the Kawai FAQ, then contact your authorized dealer, then your local Kawai subsidiary if needed.',
    answer: [
      'If you believe there may be an issue with your Kawai piano, first check the Kawai FAQ for relevant articles and troubleshooting advice.',
      'If you cannot find a resolution using the FAQ, contact the retailer where the piano was purchased — or your local authorised Kawai dealer — directly. They can provide assistance and, if necessary, arrange technical support, repair, and parts replacement. If your piano is still under warranty, no cost should be incurred for this service.',
      'If you are not satisfied with the level of support provided by the retailer or dealer, contact the local Kawai subsidiary or distributor in your country for further assistance.',
      'If you are still not satisfied, you may contact Kawai Japan directly via the Enquiry Form on the Kawai website.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'diagnose-problem',
  },
  {
    question: 'How can I buy spare parts and accessories for my piano?',
    excerpt: 'Accessories are available from authorised dealers. Spare parts require a qualified technician.',
    answer: [
      'Accessories such as piano covers, caster cups, and locking keys are available from your local Kawai authorised retailer.',
      'Due to the level of technical skill required to carry out repairs or replacement of parts, Kawai spare parts are not available to the general public. Should you require a spare part, please consult with your Kawai authorised retailer. Please be aware that retailers are under no obligation to order spare parts for customers.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'spare-parts-orders',
  },
  {
    question: 'Is it possible to add the ATX or AURES system to my existing Kawai piano?',
    excerpt:
      'ATX retrofit for upright pianos is available in Japan only. AURES and grand piano systems must be factory-installed.',
    answer: [
      'Upright pianos: Kawai Japan does offer the option to retrofit the ATX system to an existing Kawai upright piano, however this service is only available to domestic customers in Japan. Kawai Japan does not offer the retrofit ATX option to customers living outside of Japan. It is not possible to retrofit the AURES system to an existing upright piano — the AURES system must be installed at the factory when the instrument is produced.',
      'Grand pianos: Kawai Japan does not offer the option to retrofit the ATX or AURES systems to an existing Kawai grand piano. These systems must be installed at the factory when the instrument is produced.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'repair-modifications',
  },
  {
    question: "Is my piano's warranty transferrable?",
    excerpt:
      "No — the Kawai manufacturer's warranty is available to the original retail purchaser only.",
    answer: [
      "No, the Kawai manufacturer's warranty is available to the original retail purchaser only and cannot be transferred to a subsequent owner.",
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'There are scratches on the display of my brand new Kawai piano — what should I do?',
    excerpt:
      'Check for protective film first. If the scratches are on the actual display, document them and contact your dealer.',
    answer: [
      'If your new piano has display scratches, first check whether they are on the actual display screen or on protective film applied at the factory. Remove any protective film if present — what appeared to be scratches may disappear.',
      'If scratches are confirmed on the actual display, document the issue with photographs immediately. Contact your authorised Kawai dealer and reference your warranty. Minor display scratches typically do not affect functionality, but should be addressed through your dealer if the piano is brand new.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question:
      'The speakers on my ES920/ES520 digital piano have stopped producing sound — what should I do?',
    excerpt:
      'Check volume and mute settings first. If no output through any connection, contact a Kawai service centre.',
    answer: [
      'If your ES920 or ES520 has no speaker sound, work through the following steps: First, confirm the master volume is not set to zero. Second, verify the internal speakers are not muted in the settings menu. Third, test with headphones to isolate whether the issue is with the speakers specifically or with audio output in general.',
      'If headphones produce sound but speakers do not, the speaker output may be disabled in settings — consult your manual for the speaker/headphone output configuration option. If no sound is produced through any output including headphones, try a factory reset (consult your manual for the exact procedure).',
      'If the problem persists after these steps, contact your local Kawai authorised service centre for evaluation and repair.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'diagnose-problem',
  },

  // ─── Product Support — Product Information ───────────────────────────────────

  {
    question: 'Where are Kawai grand pianos manufactured?',
    excerpt:
      'Most Kawai grand pianos are made at the Ryuyo Piano Factory in Japan. The GL-10 and GL-20 (US) are built in Indonesia.',
    answer: [
      "With only a few exceptions, all Kawai acoustic grand pianos are made at Kawai's renowned Ryuyo Piano Factory located near Hamamatsu, Japan. The Ryuyo factory is one of the most advanced piano-building facilities of its kind, combining traditional craftsmanship with leading-edge technology.",
      'The entire GX Series of professional grand pianos and the GL Series GL-50, GL-40, GL-30, and GL-20 (Canada market) models are built at the Ryuyo facility.',
      "The 5' GL-10 and 5'2\" GL-20 (US market) are the only grand pianos built at Kawai's Karawan factory in Indonesia. The Karawan plant was designed to replicate the philosophy, culture, and technologies of the Ryuyo factory.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'Where are Kawai upright pianos manufactured?',
    excerpt:
      'Professional K Series uprights (K-300–K-800) are built in Japan. The K-200 and other models are built in Indonesia.',
    answer: [
      "The majority of Kawai's K Series professional upright pianos — the K-800, K-600, K-500, K-400, and K-300 — are crafted in the Ryuyo Piano Factory in Japan. The K-300 may also be produced in Indonesia depending on the market destination.",
      'Among the K Series, only the 45\" K-200 is built at the Karawan plant in Indonesia. All other Kawai upright pianos (the ST-1 and 506N Institutional Pianos, the 508 and 608 Designer Pianos, and the K-15 continental-style upright) are also built at the Karawan facility.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'Where are Kawai digital pianos produced?',
    excerpt:
      'Kawai digital pianos are manufactured in Japan and other countries. Visit the Kawai website or check with your dealer for your specific model.',
    answer: [
      'Kawai digital pianos are manufactured in various facilities depending on the model. Most Kawai instruments are produced in Japan. Visit the official Kawai website or contact your local authorised Kawai dealer for information about the manufacturing location of your specific model.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'Can I tell how old my Kawai acoustic piano is from its serial number?',
    excerpt:
      'Yes — all Kawai pianos have a serial number that corresponds to the approximate production year.',
    answer: [
      'All Kawai pianos are marked with a serial number made up of numbers and sometimes letters. The serial numbers listed on the Kawai website correspond to the approximate first number produced for each year, going back to 1927 for Japan production, 1988 for US production, and 2003 for Indonesia production.',
      'Starting letters other than A (US production) or F (Indonesia production) should be disregarded when interpreting serial numbers. Note that serial numbers for different models are not always sequential, so actual production dates may vary slightly.',
      'You can find the full serial number chart on the Kawai support website or by contacting your local Kawai authorised dealer.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'Where can I find the model or serial number of my piano?',
    excerpt:
      'Acoustic pianos: stamped on the frame. Digital pianos: printed on the name plate under the keybed.',
    answer: [
      'On an acoustic piano, the model number and serial number are stamped on the frame. On an upright piano, the model number is on the right-hand side of the frame, and the serial number is stamped around the middle of the piano, roughly in line with the middle octave.',
      'On a grand piano, the model number is on the right-hand side of the front of the frame in line with the 7th octave. The serial number is located just to the left of the model number in most cases.',
      'On a digital piano, the model and serial number are printed on the name plate on the underside of the keybed.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'Can you tell me when a new or updated Kawai piano model will be released?',
    excerpt:
      'Kawai cannot provide information about unannounced products. Watch the News section of the Kawai website for official announcements.',
    answer: [
      'Kawai is constantly developing new and improved products, however unfortunately we cannot provide any information about products until they have been officially announced.',
      'New product information is released via the News section and individual Product pages of the Kawai website when officially announced. Please note that some products released in specific regions may not be listed on the global website.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'What is the Millennium III action?',
    excerpt:
      'A piano action using ABS carbon composite components — lighter, stronger, and approximately 16–25% faster than traditional timber actions.',
    answer: [
      'Early piano actions were made of small timber components, but timber is susceptible to moisture and to expansion and contraction with changes in environmental conditions.',
      "The Millennium III action features components made from a material created by the infusion of carbon fibre with Kawai's ABS composites. This ABS carbon is incredibly sturdy and rigid, allowing the mechanical parts of the action to be made lighter and stronger.",
      'As a result, the Millennium III action is approximately 16% faster than traditional actions in upright pianos and 25% faster in grand pianos.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'What is polyphony?',
    excerpt:
      'Polyphony is the maximum number of notes a piano can play simultaneously. Higher polyphony allows for richer, more sustained performances.',
    answer: [
      'Polyphony is the maximum number of individual notes your piano can produce simultaneously. For example, a piano with 192-note polyphony can play up to 192 different notes at the same time.',
      'Higher polyphony is important for sustained passages — when the damper pedal is held and notes are accumulating — as a piano with low polyphony may drop older notes to accommodate new ones.',
      "Higher polyphony also allows for richer chord voicings and better handling of rapid passages. Check your piano's owner's manual for its specific polyphony rating.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'Why do Kawai digital pianos have wooden keys?',
    excerpt:
      "Wooden keys provide an authentic piano feel, proper weight distribution, and allow advanced escapement features found in Kawai's premium models.",
    answer: [
      "Wooden keys are used on Kawai digital pianos because they provide an authentic playing feel closely matching that of acoustic pianos. Wood offers the correct weight distribution and tactile response that pianists expect from a quality instrument.",
      "On premium Kawai models, wooden keys also enable advanced escapement mechanisms that simulate the let-off feel of a grand piano action — a detail that experienced pianists find especially valuable for expressive playing.",
      "This is a premium feature that distinguishes Kawai's higher-end digital instruments from those with fully synthetic key materials.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },

  // ─── Product Support — Piano Care & Maintenance ──────────────────────────────

  {
    question: 'How do I care for my Kawai acoustic piano?',
    excerpt:
      'Dust gently with a soft cloth, avoid alcohol and harsh chemicals, tune 2–4 times per year, and have a technician service the action periodically.',
    answer: [
      'Cleaning: Dust should be removed using a soft feather or wool-type duster. Avoid applying pressure to the finish or dragging dust across it, as this can create fine scratches. Fingerprints and similar marks can be cleaned with a dampened soft cloth followed by a dry cloth. For stubborn greasy dirt, a small amount of mild dishwashing liquid may help. In general, furniture polishes are not recommended except for specialized polishes for high-gloss finishes.',
      'Avoid using alcohol, benzine, thinner, or chlorine bleach on any part of the piano — these can cause discoloration or deterioration of painted parts and metal hardware.',
      'Tuning and Service: Kawai recommends 2–4 tunings per year, depending on the stability of temperature and humidity and the amount of use. Pianos also benefit from periodic regulation and voicing to keep the action and tone even. If the touch or tone seems uneven or notes do not repeat well, speak with a qualified piano technician.',
      'For interior cleaning of the plate, strings, soundboard, and action, always use a qualified piano technician — improper cleaning can cause damage.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'How do I care for my Kawai digital piano?',
    excerpt:
      'Keep it in a climate-controlled space, dust regularly, clean keys gently with a damp cloth, and update firmware when available.',
    answer: [
      'Keep the instrument in a stable, climate-controlled environment. Avoid placing it in direct sunlight, near heating or cooling vents, or in areas with large swings in temperature or humidity.',
      'Dust regularly with a soft cloth. Clean the keyboard gently as described in the keyboard cleaning guidelines — use a slightly damp (not wet) cloth and dry immediately. Never use alcohol, solvents, or harsh chemicals on the keys or cabinet.',
      'Avoid spilling liquids on or near the instrument. Update the firmware when new versions are released to ensure optimal performance and compatibility with apps such as PianoRemote.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'Can I use alcohol to disinfect my Kawai piano?',
    excerpt:
      'Do not apply alcohol directly to the piano. Instead, wash and disinfect your hands before playing and ensure fingers are fully dry.',
    answer: [
      'Please refrain from using alcohol, benzine, thinner, chlorine bleach, or similar substances on the keyboard or exterior of your piano. These chemicals can cause discoloration or deterioration of painted surfaces, metal hardware such as hinges, and key materials.',
      'Regarding hygiene, Kawai recommends washing your hands and disinfecting your fingers with alcohol before and after playing the piano. Ensure that your fingers are completely dry before you start to play.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'How do I clean fingerprints and stains from my digital piano keyboard?',
    excerpt:
      'Use a soft, slightly damp cloth. Never use alcohol or harsh chemicals. Dry the keys immediately after cleaning.',
    answer: [
      'Power off the piano before cleaning. Use a soft cloth that is slightly damp — not wet — to gently wipe the keys. Do not use alcohol, solvents, or harsh chemicals of any kind, as these can damage the key surface material.',
      'Dry the keys immediately with a dry soft cloth after wiping. For stubborn stains, a cloth with a very small amount of mild soap and water can be used, followed by immediate drying.',
      'Never allow moisture to drip into the gaps between the keys, as this can damage the key mechanism or internal components.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'Where should I place my piano in my home?',
    excerpt:
      'Choose a location with stable temperature and humidity, away from direct sunlight, exterior walls, and open windows.',
    answer: [
      'A piano is an intricately constructed instrument sensitive to fluctuations in temperature and humidity, wind, and light. The ideal location has a stable temperature and avoids large changes in humidity and exposure to drafts.',
      'Do not place the piano on a western-facing wall, which heats daily from the afternoon sun. Do not leave it directly under an open window or in any breezeway, as these areas expose the piano to temperature and humidity fluctuations that can cause unstable tuning.',
      'For more detailed guidance specific to your home environment, consult your piano technician.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'How often should I tune my piano?',
    excerpt:
      'Kawai recommends tuning at least twice per year. More frequent use requires more frequent tuning.',
    answer: [
      'Kawai recommends tuning your piano at least twice a year. The more heavily your piano is used, the more frequently it should be tuned.',
      'For acoustic pianos, your piano technician can recommend the appropriate interval based on your specific environmental conditions, the age of the piano, and how often it is played. In general, 2–4 tunings per year is the standard recommendation.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'What is the difference between tuning and regulation?',
    excerpt:
      'Tuning adjusts the pitch of the strings. Regulation adjusts the mechanical action — how the keys feel and respond.',
    answer: [
      'Tuning a piano means adjusting the pitch of the strings so that every note sounds at the correct frequency.',
      'Regulation refers to the adjustment of the touch — specifically the way the keys feel and respond to your playing. There is an intricate mechanical apparatus called the action, which comprises many small moving parts hidden between the key and the hammer that strikes the string. Regulation ensures that these parts are in good condition, properly aligned, and operating smoothly.',
      'Both tuning and regulation should be performed by a qualified piano technician.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'What is pitch raising?',
    excerpt:
      "If a piano hasn't been tuned for a long time, the pitch may drop below A440. A pitch raise corrects this before standard tuning can hold.",
    answer: [
      'If your piano has not been tuned for a long time, the pitch may have dropped below the standard Concert Pitch (A440). In this case, it will need additional tuning — called a pitch raise — before it can be tuned and remain stable.',
      'Depending on the condition and service history of the piano, more than one pitch raise may be required before the piano can hold its tune. Some very old pianos are no longer capable of supporting the string tension required to maintain A440 concert pitch.',
      'If you suspect your piano needs a pitch raise, consult a qualified piano technician for assessment.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: "What does it mean to 'voice' a piano?",
    excerpt:
      'Voicing is the manipulation of hammer felts to produce an even, balanced tone — softer for a darker sound, firmer for a brighter sound.',
    answer: [
      'Voicing is the gentle manipulation of the felts surrounding the hammer heads to produce an even tone throughout the piano.',
      'Hammer felts may be softened, resulting in a darker, warmer tone, or hardened to produce a brighter, more projected sound. An experienced piano technician will assess the uniformity of tone across all registers and adjust the hammer felts accordingly.',
      'Discuss voicing with your piano technician for more detailed information specific to your piano and playing style preferences.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'Is it necessary to use a dust cover on my Kawai digital piano?',
    excerpt:
      'Not essential, but highly recommended to protect the keyboard and internal components from dust when not in use.',
    answer: [
      'While not strictly necessary, using a dust cover is recommended to protect your instrument from dust and debris when not in use. This helps maintain the keyboard mechanism and internal components in good condition over time.',
      'For instruments used in performance or studio settings, a protective cover or case is especially valuable when transporting the instrument or storing it between sessions.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },
  {
    question: 'How should I store or transport my Kawai digital piano?',
    excerpt:
      'Use a protective case or cover, avoid extreme temperatures and humidity, and disconnect all cables before moving.',
    answer: [
      'When storing your digital piano, use a protective cover to prevent dust accumulation and physical damage. Store in a climate-controlled environment, avoiding extreme heat, cold, or humidity. Avoid direct sunlight, which can damage finishes and electronics over time.',
      'When transporting, disconnect all cables before moving the instrument. Secure the piano during transport to prevent tipping or sliding. For long-distance transport, use a padded case or custom cover.',
      'If storing long-term, remove batteries from any battery-operated components if applicable.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },

  // ─── Product Support — Settings & Configuration ──────────────────────────────

  {
    question: 'My Kawai piano turns itself off after a period of inactivity — what should I do?',
    excerpt:
      'This is the Auto Power Off feature. You can adjust or disable it in the settings menu. Check your manual for the exact steps.',
    answer: [
      "Kawai digital and hybrid pianos incorporate an Auto Power Off feature that can turn off the instrument automatically after a specified period of inactivity. In some regions, this function is enabled and set to 15 minutes before an instrument is shipped, to comply with local energy conservation regulations.",
      "To change the Auto Power Off setting, refer to the owner's manual included with your piano for model-specific instructions. The setting can typically be changed to Off, 30, 60, or 120 minutes, though disabling it will increase power consumption.",
      'Note: If your piano is connected to a device via Bluetooth MIDI or Bluetooth Audio, the Auto Power Off setting is still observed. If you wish to stream audio for extended periods, consider disabling Auto Power Off to prevent the instrument from turning off automatically.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },
  {
    question: 'How do I change the display language on my ES920?',
    excerpt:
      'Access the System or Setup menu and look for the Language option. Consult your manual for the exact button combination.',
    answer: [
      'To change the display language on your ES920, power on the piano and access the System or Setup menu. The exact button combination to enter this menu varies by firmware version — consult your owner\'s manual for the specific steps.',
      'In the menu, look for a Language or Display Language option and select your preferred language. Confirm the change to apply it. The piano may restart to apply the new language setting.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },
  {
    question: 'How do I reset all settings on my Kawai digital or hybrid piano?',
    excerpt:
      'Access the System or Setup menu and look for Initialize, Reset, or Factory Reset. Note: this erases all saved settings and recordings.',
    answer: [
      'To reset your piano to factory settings, access the System or Setup menu on your instrument. The exact navigation path varies by model — consult your owner\'s manual for the specific steps.',
      "Look for an option labelled Initialize, Reset, or Factory Reset. Confirm the reset when prompted. Note that this process will erase all saved settings, user sounds, and any recordings stored in the piano's internal memory.",
      'After the reset, the piano will restart with the factory default configuration.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },
  {
    question:
      'Why do files saved to USB memory by my Kawai piano all show the same date and time?',
    excerpt:
      "Your piano's internal clock may need to be set. Access the System or Setup menu to adjust the date and time.",
    answer: [
      "Digital pianos save files with a timestamp based on their internal clock. If all files show the same date and time, the piano's internal clock has likely not been set or has been reset.",
      "Access the System or Setup menu on your piano and look for a Date and Time or Clock setting. Once correctly set, newly saved files will display the correct date and time.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },
  {
    question:
      'How do I store adjusted settings to memory on my KDP75 or KDP120?',
    excerpt:
      "The KDP75/KDP120 don't support saving settings to the instrument's memory directly. Use the PianoRemote app to save User Sound presets instead.",
    answer: [
      "The KDP75 and KDP120 digital pianos do not support the ability to store adjusted settings directly to the instrument's internal memory. As a result, the piano returns to the factory default configuration each time it is turned on.",
      'However, it is possible to store adjustments to User Sound memories using the PianoRemote app, available for iOS and Android. Once stored, each User Sound memory can be quickly recalled with a single tap.',
      'The KDP75 requires a USB cable connection to use PianoRemote, while the KDP120 supports Bluetooth MIDI for a wireless connection to the app.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },
  {
    question: 'How do I enable Bluetooth on my CX102 or CX202 digital piano?',
    excerpt:
      'Press and hold the METRONOME and SOUND SELECT buttons simultaneously for five seconds to enable Bluetooth.',
    answer: [
      'To comply with international wireless regulations, the CX102 and CX202 digital pianos ship with Bluetooth turned off by default.',
      'To enable Bluetooth on the CX102 or CX202, ensure the piano is turned on, then press and hold the METRONOME and SOUND SELECT buttons simultaneously for five seconds. Bluetooth will be enabled and the piano will be ready to pair with a compatible device.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },
  {
    question:
      'How can I save my preferred configuration as the default power-on setting for ANYTIME ATX4 or AURES AR2?',
    excerpt:
      'Use the PianoRemote app (v1.1.4 or later) to save your preferred settings to the instrument\'s memory via the User Data menu.',
    answer: [
      "Since version 1.1.4 of the PianoRemote app, it is possible to save settings directly to the ATX4 or AR2 instrument's memory, allowing your preferred configuration to be selected automatically when the instrument is turned on.",
      'To save: configure your preferred sound, Virtual Technician settings, and other parameters in the PianoRemote app. Then open the Menu, tap User Data, and under Save settings to Piano, tap Save. Confirm to save the current configuration as the power-on default.',
      "To restore factory defaults: from the User Data menu, tap Factory Reset, then OK. On next power-up, the factory default configuration will be restored.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },
  {
    question:
      'How can I set preferred piano tab settings to be recalled at startup on CA99, CA79, NV10S, or NV5S?',
    excerpt:
      'Configure your preferred settings, then access the Memory or Initialization menu and select Save as Startup.',
    answer: [
      'To save your preferred startup settings on the CA99, CA79, NV10S, or NV5S, configure your preferred voice, effects, and Virtual Technician parameters as desired.',
      "Access the instrument's Memory or Startup Settings menu (consult your owner's manual for the exact navigation path on your model) and select Save as Startup or the equivalent option. Confirm to save.",
      'On next power-up, your saved configuration will be automatically recalled.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },
  {
    question: 'Can I use my Kawai digital piano in another country?',
    excerpt:
      "Generally yes, but check your power adapter's voltage specifications and be aware that warranty coverage may vary by region.",
    answer: [
      "Kawai digital pianos are generally compatible worldwide. However, check your power adapter's voltage specifications before using the instrument in another country — the adapter must match the local power supply (110V or 220V). You may need a voltage converter or a different plug adapter.",
      'Wireless features such as Bluetooth may be subject to regional regulations, and some features may be limited or unavailable in certain countries.',
      'Warranty coverage may also vary by region. Contact your local Kawai authorised dealer or the Kawai subsidiary in the destination country for region-specific information.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'settings-configuration',
  },

  // ─── Product Support — Bluetooth & Connectivity ──────────────────────────────

  {
    question: 'How do I connect my Kawai piano to an Android device via Bluetooth MIDI?',
    excerpt:
      "Enable Bluetooth on both devices, put the piano in pairing mode, then select it in your app's connection settings.",
    answer: [
      "Enable Bluetooth on both your piano and your Android device. Put the piano in Bluetooth pairing mode — consult your owner's manual for the model-specific button combination.",
      "Open the PianoRemote app (or your preferred MIDI app) on your Android device and navigate to the connection or settings menu. Select your piano from the list of available Bluetooth devices and confirm pairing on both devices.",
      'Once connected, the app should indicate a successful connection and all remote control functions will be available. If you experience difficulty pairing, ensure both devices have sufficient battery, are in close proximity, and that Bluetooth is properly enabled.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'How do I play audio from an Android device to my Kawai piano via Bluetooth Audio?',
    excerpt:
      'Pair your Android device to the piano via Bluetooth, then select the piano as your audio output device.',
    answer: [
      'Enable Bluetooth on both your piano and your Android device. Put the piano in Bluetooth Audio pairing mode (consult your manual). From your Android device\'s Bluetooth settings, search for available devices and select your Kawai piano.',
      "Once paired, open any music app on your Android device and audio will stream wirelessly to the piano's speakers. Adjust volume on both devices as needed.",
      'Note: Bluetooth Audio quality may vary depending on device specifications and Bluetooth version. Keep devices within reasonable range for a stable connection.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'How do I connect my Kawai piano to an iOS device via Bluetooth MIDI?',
    excerpt:
      'Enable Bluetooth on both devices, pair in iOS Bluetooth settings, then open the PianoRemote app to confirm the connection.',
    answer: [
      "Enable Bluetooth on both your piano and your iOS device. Put the piano in Bluetooth pairing mode (consult your owner's manual for model-specific instructions).",
      'On your iOS device, go to Settings > Bluetooth and select your piano from the list of available devices. Confirm pairing on both devices if prompted.',
      "Open the PianoRemote app — it should automatically detect the Bluetooth MIDI connection. If not, go to the app's settings menu to manually select your piano as the MIDI device.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'How do I play audio from an iOS device to my Kawai piano via Bluetooth Audio?',
    excerpt:
      'Pair your iOS device to the piano via Bluetooth, then select the piano as your audio output in Control Centre.',
    answer: [
      "Enable Bluetooth Audio on your piano (refer to your owner's manual). Enable Bluetooth on your iOS device. From Settings > Bluetooth or the iOS Control Centre, select your Kawai piano as the audio output device.",
      "Open any music app and audio will stream wirelessly to your piano's speakers. You can control the volume using your iOS device's volume controls.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'How do I connect my Kawai piano to a Mac via Bluetooth MIDI?',
    excerpt:
      'Pair the piano in macOS Bluetooth settings, then configure your MIDI app to use the piano as its input device.',
    answer: [
      'Enable Bluetooth on both your piano and your Mac. Put the piano in Bluetooth pairing mode. On your Mac, go to System Settings (or System Preferences on older macOS) > Bluetooth, find your piano in the list, and select to pair.',
      "Once paired, open your preferred MIDI application such as GarageBand. In the app's settings or preferences, configure the MIDI input to use your piano's Bluetooth connection. In GarageBand, create a software instrument track and begin playing.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'How do I play audio from a Mac to my Kawai piano via Bluetooth Audio?',
    excerpt:
      'Pair the piano as a Bluetooth device, then select it as the audio output in macOS Sound settings.',
    answer: [
      'Enable Bluetooth Audio on your piano. On your Mac, go to System Settings > Sound (or the menu bar volume icon) and select your Kawai piano as the audio output device.',
      'Open any audio application — iTunes, Spotify, GarageBand, etc. — and audio will stream wirelessly to your piano\'s speakers.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'How do I connect my Kawai piano to a Windows PC via Bluetooth MIDI?',
    excerpt:
      'Add the piano as a Bluetooth device in Windows Settings, then select it as the MIDI input in your MIDI application.',
    answer: [
      'Enable Bluetooth on both your piano and your Windows PC. Put the piano in Bluetooth pairing mode. Go to Windows Settings > Bluetooth & devices and select Add device > Bluetooth. Select your piano from the list and complete the pairing process.',
      'Open your preferred MIDI software (e.g. FL Studio, Ableton Live, or Reaper) and configure the MIDI input to use your piano\'s Bluetooth MIDI connection. Your piano will now communicate with Windows via Bluetooth MIDI.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'How do I play audio from a Windows PC to my Kawai piano via Bluetooth Audio?',
    excerpt:
      'Pair the piano in Windows Bluetooth settings, then select it as the default playback device.',
    answer: [
      'Enable Bluetooth Audio on your piano. In Windows Settings > Bluetooth & devices, pair your piano. Once paired, go to Settings > System > Sound and select your Kawai piano as the default playback device.',
      "Open any audio application and audio will stream wirelessly to your piano's speakers. Adjust volume using Windows volume controls or the application settings.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'Can I use Bluetooth MIDI and USB MIDI simultaneously on my Kawai piano?',
    excerpt:
      "Most Kawai pianos only support one MIDI connection method at a time. Check your specific model's documentation.",
    answer: [
      'Most Kawai digital and hybrid pianos support only one MIDI connection method at a time. You typically cannot use Bluetooth MIDI and USB MIDI simultaneously on the same instrument.',
      "Choose the connection method best suited to your current session. Some advanced systems may support multiple simultaneous connections — check your specific model's documentation or contact your Kawai dealer to confirm.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question:
      'Apps on my Android 13 device cannot connect to my piano via Bluetooth MIDI — what should I do?',
    excerpt:
      'Android 13 requires explicit Bluetooth permissions. Grant them in Settings > Apps > [App name] > Permissions.',
    answer: [
      'Android 13 introduced stricter Bluetooth permission requirements. To resolve connectivity issues, go to Settings > Apps > [App Name] > Permissions and ensure Bluetooth permission is enabled for the Kawai app.',
      "Also confirm that your piano's Bluetooth is enabled and in pairing mode. Update both the app and your piano's firmware to the latest versions. If the issue persists, try unpairing and re-pairing the devices, or reinstall the app.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question:
      'I hear noise when connecting my piano to an Android device via USB cable to record audio — what should I do?',
    excerpt:
      "Use a third-party recording app like 'USB Audio Recorder Pro' to bypass the Android audio system and eliminate the noise.",
    answer: [
      'When connecting certain Android devices (such as the Google Pixel 6 or later) via USB cable for audio recording, noise may occur due to how those devices handle USB audio.',
      'To prevent this, Kawai recommends using a third-party recording app such as USB Audio Recorder Pro, which bypasses the Android audio system and communicates directly with the USB audio interface. This typically eliminates the noise issue.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'What is the maximum cable length when connecting my piano to external devices?',
    excerpt:
      'Kawai recommends cables no longer than 3 metres for USB, MIDI, and Line connections to ensure connection quality.',
    answer: [
      'When connecting a Kawai digital or hybrid piano to an external device via USB, MIDI, or Line In/Out, Kawai recommends that the cable length does not exceed 3 metres.',
      'While it may be possible to use longer cables, Kawai cannot guarantee the quality or stability of the connection in such cases. For best results, always use the shortest cable that meets your needs.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'Do Kawai instruments sold in my country include Bluetooth?',
    excerpt:
      'Bluetooth availability varies by model and region. Most current digital piano models include Bluetooth MIDI and/or Bluetooth Audio.',
    answer: [
      'Bluetooth availability varies by piano model and sales region. Most recent Kawai digital piano models include Bluetooth MIDI and/or Bluetooth Audio functionality. However, some older models may not have Bluetooth, and availability may vary by region.',
      'Check your specific model\'s specifications on the Kawai website or consult your local Kawai authorised dealer for region-specific availability information.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'What are Bluetooth MIDI and Bluetooth Audio?',
    excerpt:
      'Bluetooth MIDI transfers musical performance data wirelessly. Bluetooth Audio streams audio wirelessly to or from your piano.',
    answer: [
      'Bluetooth MIDI is a wireless protocol that allows your piano to send and receive musical performance data — such as note on/off, velocity, and control changes — to apps and software on a connected device, without a physical cable.',
      'Bluetooth Audio is a wireless protocol that allows your piano to receive audio from external devices (so you can stream music through its speakers) and in some models also send audio to wireless headphones or speakers.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: "My piano doesn't have Bluetooth — can I still use apps like PianoRemote?",
    excerpt:
      'Yes — connect via USB cable instead. You may need a USB adapter depending on your device type.',
    answer: [
      'Yes. If your Kawai digital or hybrid piano does not feature Bluetooth, you can still use the PianoRemote app and other compatible apps by connecting your device via USB cable.',
      'Depending on your device, you may need a USB adapter (such as USB-C to USB-A or Lightning to USB-A). Once connected via USB, the app can communicate with your piano and provide full access to its features.',
      "Refer to your piano's owner's manual or contact your Kawai dealer for the recommended USB cable and adapter for your specific model.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question:
      'Can I connect multiple smartphones or tablets to my Kawai piano at the same time?',
    excerpt:
      'Most Kawai pianos support only one Bluetooth MIDI connection at a time. Check your model\'s documentation for multi-device support.',
    answer: [
      'Most Kawai digital pianos support only one Bluetooth MIDI connection at a time. To switch between devices, unpair the current device and pair the new one.',
      'Some newer or advanced models may support multiple simultaneous Bluetooth connections — check your specific model\'s documentation or contact your Kawai dealer to confirm what is supported.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'Do I need to download or install a driver to use USB-MIDI with my Kawai piano?',
    excerpt:
      'In most cases, no. Modern Mac and Windows systems include built-in USB-MIDI drivers that automatically recognise Kawai pianos.',
    answer: [
      'In most cases, no additional driver installation is required. macOS and modern versions of Windows include built-in USB-MIDI support, and the operating system will automatically recognise your Kawai piano when connected via USB.',
      "Ensure your operating system is up to date with the latest updates. If your piano is not recognised, check the Kawai website for model-specific driver downloads. Always download drivers from the official Kawai website to avoid security risks.",
      "Some legacy pianos or older operating systems may require drivers — refer to your piano's documentation or contact Kawai support if automatic detection does not work.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: 'How do I connect my Kawai piano to a computer?',
    excerpt:
      'Use a USB cable for MIDI and optionally audio. For audio recording, Line Out cables or USB audio offer the best quality.',
    answer: [
      "You can connect your Kawai piano to a computer in several ways. For MIDI communication (controlling software instruments, recording MIDI data), use a USB cable from the piano's USB to Host port to a USB port on your computer.",
      "For recording the piano's audio, connect the Line Out outputs to your computer's audio interface using the appropriate cables (typically 1/4\" to 1/4\" or 1/4\" to XLR). Some Kawai models also support USB audio, allowing audio to be transmitted directly over the USB cable.",
      'For the highest recording quality, Line Out via a dedicated audio interface is recommended over USB audio alone.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question: "How do I connect a USB-C or Thunderbolt device to my piano's USB MIDI port?",
    excerpt:
      "Use a USB-C to USB-A adapter to connect your device to the piano's standard USB port.",
    answer: [
      "To connect a USB-C or Thunderbolt device (such as a modern MacBook or iPad Pro) to your piano's USB to Host port, use a USB-C to USB-A adapter. Connect the adapter to your device and use a standard USB-A cable to connect to the piano.",
      'Some devices may require a powered USB hub for reliable operation. Once connected, install any necessary drivers as described in the USB-MIDI driver FAQ, then test the connection in your chosen MIDI application.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question:
      'Can I use Bluetooth to connect wireless headphones or speakers to my Kawai piano?',
    excerpt:
      "Yes, if your piano supports Bluetooth Audio output. Put your wireless device in pairing mode, then select it in the piano's Bluetooth settings.",
    answer: [
      "Yes, if your piano supports Bluetooth Audio output, you can connect wireless headphones or Bluetooth speakers. Put your wireless device in pairing mode, then access the Bluetooth settings on your piano (consult your owner's manual for the exact steps) and select your headphones or speakers from the available devices list.",
      'Once paired, audio from the piano will play through the wireless device. Check your manual to confirm whether Bluetooth Audio output is supported on your specific model.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },

  // ─── Product Support — Apps & Software ──────────────────────────────────────

  {
    question: 'How can I use the PianoRemote app to record my Kawai piano?',
    excerpt:
      "PianoRemote supports SMF (MIDI) recording via Bluetooth MIDI, and WAV/FLAC/AAC recording using the device's built-in microphone.",
    answer: [
      'The PianoRemote app supports two recording methods, configurable from the Recorder menu.',
      "SMF (MIDI): Captures key and pedal presses as MIDI data over a Bluetooth MIDI or USB-MIDI connection. Recorded data can be shared as a .mid file. This method captures performance data only — not the piano's audio.",
      "WAV/FLAC/AAC: Captures audio using the device's built-in microphone. The recording will include ambient room sounds. Audio quality depends on your device's microphone hardware. To record only the piano's audio, connect an external audio interface to your device and connect the piano's Line Out to that interface.",
      "Note: It is not currently possible to record the piano's audio directly as WAV/FLAC via Bluetooth. Bluetooth MIDI only transmits MIDI data, and Bluetooth Audio is receive-only.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question: "Why doesn't the PianoRemote app connect with my Kawai piano?",
    excerpt:
      'Check Bluetooth is enabled, restart both devices, unpair and re-pair, and ensure both the app and firmware are up to date.',
    answer: [
      'If PianoRemote is unable to connect to your piano, try the following steps: Ensure your piano model is compatible with PianoRemote (typically models launched since 2020). Confirm that Bluetooth is enabled on both your piano and your device.',
      'Restart both your device and the piano. In your device\'s Bluetooth settings, forget the piano and re-pair it. Ensure the PianoRemote app and your piano\'s firmware are both updated to the latest versions.',
      "Verify that Bluetooth MIDI permissions are enabled for the PianoRemote app in your device's Settings > Apps > PianoRemote > Permissions (especially on Android 13 and later). If the issue persists, contact your Kawai dealer or Kawai support.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question:
      "When I connect my piano to PianoRemote via Bluetooth MIDI, I'm asked to update the firmware — what should I do?",
    excerpt:
      'This usually indicates a connection issue, not a genuine firmware requirement. Restart both devices first. Check the Kawai website if the issue persists.',
    answer: [
      'A Firmware Update Required message may appear when the PianoRemote app is unable to establish a stable connection with the piano. In many cases, the problem can be resolved simply by restarting your smartphone or tablet and/or turning the piano off and back on again.',
      "If restarting does not resolve the issue, visit the Software Updates section of the Kawai support website to check whether a firmware update is available for your model that addresses app connectivity.",
      'If you do proceed with a firmware update, keep the piano powered on for the entire duration of the update process and do not disconnect the Bluetooth or USB connection.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question:
      "The PianoRemote app drains my device's battery even when running in the background — what should I do?",
    excerpt:
      'Manually close the PianoRemote app when not in use. It continues running in background mode to support its Metronome and Music Playback features.',
    answer: [
      'The PianoRemote app is designed to continue running in background mode so that its Metronome and Music Playback functions work even when the app is not shown on screen. As a result, it may continue to use device resources and battery when running in the background.',
      'To prevent battery drain, manually close the PianoRemote app when you have finished using it. On iOS, swipe up from the app switcher. On Android, use the recent apps view to close the app.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question:
      'How do I check which software version is running on my Kawai CA99, CA79, CA901, CA701, NV10S, or NV5S?',
    excerpt:
      'Tap the menu icon, navigate to System > Information > CHECK to view the current firmware version.',
    answer: [
      'To check the firmware version on a Kawai digital or hybrid piano with a touchscreen display (such as the CA99/CA79, CA901/CA701, or NV10S/NV5S), tap the hamburger menu icon (three horizontal lines) in the top-right corner to open the main menu.',
      'From the menu, tap System, then scroll to Information and tap CHECK. The Version/License screen will display the current firmware version. Tap the X button to return to the previous menu.',
      'Recording this version number is useful when contacting Kawai support or when checking the support website to see if an update is available.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question:
      "The page turning feature of the PiaBookPlayer app doesn't work on my AR/ATX upright piano — what should I do?",
    excerpt:
      "The page turning feature requires sostenuto pedal functionality. On AR/ATX pianos, the soft pedal can be temporarily reconfigured as a sostenuto pedal.",
    answer: [
      "The page turning feature in PiaBookPlayer uses the sostenuto pedal for hands-free page turns. AR/ATX upright hybrid instruments do not offer sostenuto pedal functionality by default, so page turning is limited.",
      "To work around this, it is possible to reconfigure the AR/ATX's soft pedal to function as a sostenuto pedal: While the piano is turned off, depress and hold the soft pedal, then turn on the AR/ATX control box, then release the soft pedal. The soft pedal will now function as a sostenuto pedal, enabling page turning in PiaBookPlayer.",
      'To restore the soft pedal to its normal function, turn the AR/ATX control box off and on again.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question: 'How do I use Kawai apps with my digital piano?',
    excerpt:
      'Download the app, connect via Bluetooth MIDI or USB, and follow the app\'s connection guide to link it to your piano.',
    answer: [
      "To use Kawai apps such as PianoRemote with your digital piano: Download the app from the App Store (iOS) or Google Play (Android). Verify that your piano is compatible with the app by checking your owner's manual or the app store listing.",
      'Connect your piano to your device via Bluetooth MIDI or USB (using appropriate cables and adapters if needed). Open the app and follow its connection wizard or settings menu to establish communication with your piano.',
      "Once connected, the app will display your piano's current settings and allow you to access remote control features. Refer to the app's help documentation for instructions on using specific features.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question: 'Which apps are compatible with my Kawai piano?',
    excerpt:
      'PianoRemote works with most Kawai digital and hybrid pianos launched since 2020. Check the Kawai website for a full compatibility list.',
    answer: [
      'Kawai offers several apps designed for compatible digital and hybrid pianos. PianoRemote (iOS/Android) is compatible with most Kawai instruments launched since approximately 2020. PiaBookPlayer works with Kawai grand and upright pianos equipped with ATX or AURES systems.',
      'Most standard MIDI apps (GarageBand, FL Studio, Ableton Live, etc.) are also compatible via USB MIDI or Bluetooth MIDI.',
      "Visit the Kawai support website or consult your piano's documentation for a complete list of recommended apps for your specific model and firmware version.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question: 'Apps behave strangely on my Android smartphone — what should I do?',
    excerpt:
      'Force stop the app, clear its cache, restart your device, update the app, and reinstall if the issue continues.',
    answer: [
      'If a Kawai app is behaving unexpectedly on your Android device, try the following steps: Force stop the app and clear its cache via Settings > Apps > [App Name] > Storage > Clear Cache. Restart your device.',
      'Ensure the app is updated to the latest version from Google Play. Verify that your device is running a supported version of Android. For connectivity issues, ensure Bluetooth is enabled and the piano is nearby.',
      'If the app continues to behave incorrectly, uninstall and reinstall the app. If problems persist after reinstallation, contact Kawai support with details of the issue and your device model.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question: 'What is the Demo Mode feature in Kawai apps?',
    excerpt:
      "Demo Mode lets you explore app features and sounds without needing a connected piano — useful for evaluation and familiarisation.",
    answer: [
      "Demo Mode in Kawai apps allows you to explore and experience the app's functionality without requiring a physical connection to a compatible Kawai piano.",
      "In Demo Mode, you can preview sounds, navigate the app interface, and understand the capabilities of the app before connecting to your instrument. Certain features that require an active piano connection may have limited functionality or display default values rather than live piano settings.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question: 'Can I use Kawai apps on my Chromebook?',
    excerpt:
      'Kawai apps are designed for iOS and Android. They may work on Chromebooks that support Android apps via Google Play, depending on your model.',
    answer: [
      'Kawai apps such as PianoRemote and PiaBookPlayer are designed for iOS and Android devices and are not natively available for Chromebooks.',
      'However, if your Chromebook supports Android apps (most Chromebooks from 2017 onward do), you may be able to install and run Kawai apps through the Google Play Store. Go to Settings on your Chromebook and look for the Google Play Store or Android apps section to check whether Android app support is enabled on your device.',
      'Functionality and performance may vary compared to a native iOS or Android device.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question: "Firmware update shows 'Insert USB Memory' — what should I do?",
    excerpt:
      'Ensure a FAT32-formatted USB drive is properly inserted, with the firmware file in the root directory, and retry.',
    answer: [
      "If the display shows Insert USB Memory during a firmware update, ensure that a compatible USB memory device is properly inserted into the piano's USB port. The USB drive should be formatted as FAT32 — exFAT and NTFS are not supported.",
      'Download the correct firmware file for your specific piano model from the Kawai software updates page and place the file in the root directory of the USB drive (not in a subfolder). Insert the drive and restart the update process.',
      'If the message persists, try a different USB memory device from a reputable manufacturer with a capacity of 32GB or under.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },
  {
    question: "Firmware update shows 'File not found' — what should I do?",
    excerpt:
      "Verify the firmware filename is correct, that it's in the root directory (not a subfolder), and that you've downloaded the right file for your model.",
    answer: [
      'If the display shows File not found during a firmware update, check the following: Verify that the firmware file is named exactly as expected by your piano — do not rename the file after downloading.',
      'Ensure the file is placed in the root directory of the USB drive, not inside any subfolder. Re-download the firmware file directly from the Kawai software updates page to rule out a corrupted download. Double-check that you have downloaded the correct firmware file for your specific piano model.',
      'If the issue persists after trying these steps, contact Kawai support for further assistance.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'apps-software',
  },

  // ─── Product Support — Recording & Audio ─────────────────────────────────────

  {
    question: 'How can I record the audio from my Kawai piano onto a computer?',
    excerpt:
      'Connect via Line Out to an audio interface, or via USB audio if supported. Use a DAW such as GarageBand, Audacity, or Reaper.',
    answer: [
      "To record your piano to a computer, connect the piano's Line Out outputs to your computer's audio interface using appropriate cables (typically 1/4\" to 1/4\" or 1/4\" to XLR for balanced connections). Install recording software such as GarageBand, Audacity, or Reaper, and configure the input source to your audio interface.",
      "Some Kawai models also support USB audio, which transmits audio directly over the USB cable — check your piano's manual to see if this feature is available. Set appropriate input levels to avoid clipping.",
      'For the best recording quality, use Line Out via a dedicated audio interface rather than USB audio alone, as this provides lower latency and better signal quality.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'recording-audio',
  },
  {
    question: 'How can I achieve the best sound quality from the Line Out connectors on my Kawai piano?',
    excerpt:
      'Use high-quality shielded cables, keep runs short, avoid nearby power sources, and set the output level to avoid clipping.',
    answer: [
      "For the best audio quality from your piano's Line Out connectors: Use high-quality, shielded audio cables and keep cable runs as short as practical. Position cables away from power sources and wireless devices to minimise interference.",
      "Adjust the piano's output level to maximise signal without causing clipping in your recording chain. When connecting to a computer, use a dedicated external audio interface set to line-level input for the best results.",
      "Check whether your specific model's Line Out connectors are balanced (XLR) or unbalanced (1/4\" TRS/TS) — see your owner's manual — and use the appropriate cable type for your equipment.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'recording-audio',
  },
  {
    question: 'Recordings via USB audio on my Kawai piano are too quiet — what should I do?',
    excerpt:
      "Increase the piano's master volume, raise the input gain in your recording software, and ensure no limiting is applied.",
    answer: [
      'If USB audio recordings are too quiet, first increase the main volume output on your piano before recording — this raises the level sent over USB.',
      'In your recording software (DAW), increase the input gain or level for the USB audio input. Ensure that no audio normalisation, limiting, or volume reduction is applied in the software that might be attenuating the signal.',
      "If the signal is still too low, consider connecting via Line Out to an external audio interface instead, which offers more control over input gain and typically provides better recording levels and quality.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'recording-audio',
  },
  {
    question:
      "How can I play VST software using my Kawai piano and hear it through the piano's speakers?",
    excerpt:
      "Connect via USB MIDI to route your playing to the VST, then route the VST's audio output back to the piano's audio inputs via an interface.",
    answer: [
      "To use VST software instruments with your piano while monitoring through the piano's speakers: Connect your piano to a computer via USB MIDI. Install your DAW and configure it to receive MIDI input from the piano.",
      "Route the VST's audio output to your computer's audio interface, then connect the audio interface's output to the piano's Line In input (if available). Adjust the mixer in your DAW and on the piano to balance the levels.",
      "Note: This setup requires a piano model with Line In functionality and a separate external audio interface. The latency of this chain depends on your computer's audio buffer settings.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'recording-audio',
  },
  {
    question:
      'Why does AURES piano playback sometimes sound different through headphones or speakers than through the soundboard?',
    excerpt:
      "The AURES soundboard creates unique acoustic resonance that headphones and external speakers cannot fully replicate.",
    answer: [
      "The AURES soundboard system creates a distinctive acoustic experience when sound is transmitted directly through the piano's soundboard. This resonance adds spatial depth and harmonic richness that cannot be fully replicated through headphones or external speakers.",
      "Through headphones, you lose the acoustic resonance of the soundboard, the natural spatial field of the instrument, and the room acoustics that form part of the soundboard experience. The tonal characteristics will also differ based on your headphone model.",
      'This difference is by design — the soundboard represents the closest approximation to an acoustic piano experience, while headphones and external speakers provide a more direct signal playback.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'recording-audio',
  },

  // ─── Product Support — Accessories & Compatibility ───────────────────────────

  {
    question: 'What USB memory device should I buy for use with my Kawai piano?',
    excerpt:
      'Choose a reputable brand, 32GB or under, USB 2.0, formatted as FAT32. Avoid high-capacity, encrypted, or wireless-capable drives.',
    answer: [
      'When selecting a USB memory device for your Kawai piano, Kawai recommends the following guidelines:',
      'Brand: Choose a device from a reputable manufacturer such as SanDisk, Samsung, Kingston, Sony, or Transcend. Avoid unbranded devices.',
      'Capacity: Select a device with a capacity of 32GB or under — this is sufficient for all audio recording and file storage needs. Avoid very large capacity devices (256GB or higher).',
      'Interface: Choose a device that uses the USB 2.0 standard. USB 3.x devices are theoretically backwards-compatible but USB 2.0 native is preferred.',
      'Filesystem: Most USB drives come pre-formatted as FAT32, which is fully supported. The exFAT filesystem is not supported. Avoid drives with special security or fingerprint lock features.',
      'If saved files are no longer needed, delete them using a file manager rather than reformatting the drive.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'accessories-compatibility',
  },
  {
    question: 'What power adapter specifications does my Kawai digital piano require?',
    excerpt:
      "Specifications vary by model. Check the label on your existing adapter or your owner's manual. Contact Kawai for replacement adapters.",
    answer: [
      "Power adapter specifications vary by piano model. Common specifications include an input of 100–240V 50/60Hz (universal), with a DC output voltage typically between 12V and 24V depending on the model. Connector size also varies.",
      "Check the label on your existing power adapter for the exact specifications. You can also find this information in your piano's owner's manual under Specifications.",
      "For replacement adapters, contact your local Kawai authorised dealer with your piano's model number to ensure you receive the correct compatible adapter. Never use an aftermarket adapter unless it has been confirmed compatible by Kawai.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'accessories-compatibility',
  },
  {
    question: 'Which damper pedals are compatible with my Kawai digital piano?',
    excerpt:
      'Use Kawai\'s official pedal for your model. Some generic MIDI-compatible pedals may work. Contact your dealer with your model number to confirm.',
    answer: [
      "Compatible damper pedals vary by piano model. Kawai's factory-supplied pedal for your specific model is always the recommended choice for full functionality, including continuous control (half-pedalling) where supported.",
      'Some generic MIDI-compatible pedals may work for basic on/off damper control, but may not support advanced features like continuous pedalling.',
      "Contact your local Kawai authorised dealer with your piano's model number for a list of officially compatible pedals and accessories.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'accessories-compatibility',
  },
  {
    question: 'Can I use high-impedance headphones with my Kawai digital piano?',
    excerpt:
      'High-impedance headphones (250Ω+) will work but may produce lower volume. For best results, use headphones with 16–100Ω impedance.',
    answer: [
      "Most Kawai digital pianos' headphone outputs are optimised for standard impedance headphones in the range of 16–32 ohms. High-impedance headphones (250 ohms or higher) will work but may produce lower volume levels than standard headphones at the same volume setting.",
      "If using high-impedance headphones, increase the piano's volume accordingly. For the best listening experience and volume levels, Kawai recommends headphones with an impedance between 16 and 100 ohms.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'accessories-compatibility',
  },
  {
    question:
      'Is the ES110S HML-1 stand and F-350 triple pedal board compatible with the ES120?',
    excerpt:
      'Compatibility varies. Consult your ES120 manual or contact Kawai before purchasing to confirm compatibility.',
    answer: [
      "Compatibility between Kawai portable piano stands and pedal boards varies by model year and configuration. The ES110S stand and F-350 pedal board may not be fully compatible with the ES120 due to differences in the instrument's underside design.",
      "Before purchasing, consult your ES120 owner's manual for the list of compatible optional accessories, or contact your local Kawai authorised dealer to verify compatibility for your specific model and region.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'accessories-compatibility',
  },
  {
    question:
      'I lost the thumbscrews that secure my ES portable piano to the stand — where can I get replacements?',
    excerpt:
      'Replacement thumbscrews are available through authorised Kawai dealers. Contact your dealer with your model number.',
    answer: [
      "Replacement thumbscrews for Kawai portable digital pianos are available through authorised Kawai dealers. Contact your local dealer with your instrument's model number to confirm the correct size and order a replacement set.",
      'If your local dealer cannot assist, contact your regional Kawai subsidiary or distributor for further help.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'accessories-compatibility',
  },
  {
    question: 'What MIDI values can each pedal of the GFP-3 triple pedal unit transmit?',
    excerpt:
      'Consult the GFP-3 documentation or contact Kawai for the specific MIDI CC numbers and value ranges for each pedal.',
    answer: [
      'The GFP-3 triple pedal unit transmits MIDI Control Change (CC) messages for the damper, sostenuto, and soft pedals. The specific CC numbers and value ranges are documented in the GFP-3 owner\'s manual.',
      "Consult the GFP-3 documentation included with the unit, or download the manual from the Kawai support website. If you cannot locate this information, contact your local Kawai authorised dealer or Kawai customer support with your piano and pedal model numbers.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'accessories-compatibility',
  },

  // ─── Product Support — Sound & Behavior ──────────────────────────────────────

  {
    question:
      'Why do the upper notes of my Kawai digital piano sustain without using the damper pedal?',
    excerpt:
      'This is normal — it accurately simulates acoustic pianos, where the upper strings are undamped and naturally sustain longer.',
    answer: [
      "This is normal and expected behaviour, particularly on Kawai hybrid pianos. On an acoustic grand piano, the strings for the uppermost notes are not fitted with dampers — they sustain freely regardless of pedal use. Kawai digital and hybrid pianos model this behaviour accurately.",
      'If the sustained upper notes seem unusually loud or out of character, check your piano\'s settings or contact Kawai support for confirmation.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question:
      'Why can I hear the keyboard action mechanism when playing my Kawai digital piano?',
    excerpt:
      'Hearing the action is normal on models with wooden keys and escapement mechanisms — it accurately simulates acoustic piano feel.',
    answer: [
      'Hearing some mechanical sound from the keyboard action is normal on Kawai digital and hybrid pianos, especially those equipped with wooden keys and escapement mechanisms. This is by design — the action sounds you hear are an accurate simulation of the physical response of an acoustic piano action.',
      'If the sound is unusually loud, inconsistent, or accompanies a note that is not sounding correctly, check that nothing is obstructing the key mechanism. If a specific key sounds or feels different from the others, contact your Kawai dealer.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question:
      'Why can I hear faint resonances and other sounds from notes on my digital piano?',
    excerpt:
      'This is normal — it reflects advanced sound modelling including sympathetic resonance, hammer noise, and soundboard resonance.',
    answer: [
      "Hearing various subtle tones, resonances, and mechanical sounds from your Kawai digital piano is normal and reflects the instrument's sophisticated sound modelling technology.",
      'These sounds include sympathetic string resonance (where unplayed strings subtly resonate in sympathy with played notes), hammer strike and key release sounds, and soundboard resonance on hybrid models. These details are all part of what makes the instrument sound authentically like an acoustic piano.',
      'This is not a defect but a deliberate feature of advanced piano sound design. If a specific sound seems unusually prominent or is accompanied by a malfunction, contact your Kawai dealer.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question: 'The damper pedal doesn\'t work during demo song playback — is this normal?',
    excerpt:
      'Yes — some Kawai pianos disable the damper pedal during demo playback to prevent accidental interruption.',
    answer: [
      'Yes, this is normal behaviour on some Kawai digital pianos. Certain models disable the damper pedal and other controls during demo song playback to prevent accidental interruption of the demonstration.',
      "To use the damper pedal normally, stop the demo song playback and switch to manual playing mode. If you prefer to control the pedal during playback, check your piano's settings menu for options that may allow this — not all models support this.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question:
      "When I enable Split mode on my ES110 or ES120, the lower section sound doesn't sustain with the damper pedal — is this normal?",
    excerpt:
      'Yes — in Split mode, the damper pedal is configured by default to affect only the upper (right-hand) section.',
    answer: [
      'Yes, this is the expected behaviour. On the ES110 and ES120, when Split mode is active, the damper pedal is configured by default to affect only the upper (right-hand) section of the keyboard. The lower section does not respond to the damper pedal.',
      'If you would like the damper pedal to affect both sections simultaneously, consult your owner\'s manual for instructions on adjusting the Split mode damper pedal configuration.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question: 'How should the pedals on a piano function?',
    excerpt:
      'Right: sustain (damper). Left: soft pedal. Middle: sostenuto (grand) or various functions on digital. Kawai digitals replicate these acoustically.',
    answer: [
      "Piano pedals have three standard functions: The right (damper) pedal sustains notes by lifting the dampers from all strings, allowing them to continue sounding after you release the keys. The left (soft or una corda) pedal reduces volume and slightly changes the tone character.",
      'The middle (sostenuto) pedal sustains only the notes that are held down at the moment the pedal is pressed, while subsequent notes play without sustain. On some upright pianos, the middle pedal instead acts as a practice mute.',
      "On Kawai digital pianos, these functions are replicated digitally. Consult your owner's manual for the specific pedal configuration of your model, as some models allow pedal functions to be customised.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question: 'What is the Concert Magic function?',
    excerpt:
      'Concert Magic lets you perform pre-arranged piano pieces by pressing any key rhythmically — useful for beginners or entertainment.',
    answer: [
      'Concert Magic is a feature available on select Kawai digital piano models that allows users to perform pre-arranged piano pieces by pressing keys rhythmically, without needing to know how to play piano conventionally. The piece plays in real time as you tap keys.',
      "To listen to a Concert Magic piece without pressing the keys, select the song and look for a Listen or Demo playback option in your piano's Concert Magic settings. Refer to your owner's manual for the exact navigation steps for your model.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question:
      'What is the optimum distance from the wall for a digital or hybrid piano equipped with a soundboard speaker?',
    excerpt:
      'Place at least 6–12 inches from the wall to allow proper air circulation and prevent sound reflections that muddy the tone.',
    answer: [
      'For digital and hybrid pianos equipped with a soundboard speaker system, Kawai recommends placing the instrument at least 6–12 inches (15–30 cm) away from the wall behind it. This allows adequate air circulation around the soundboard and prevents reflections from the wall surface affecting the resonance.',
      'Avoid placing the piano directly in a corner, as corner placement can cause low-frequency buildup and uneven sound. Room acoustics will affect the overall sound quality, so experiment with placement to find the position that sounds best in your space.',
      'Refer to your owner\'s manual for any model-specific spacing recommendations.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question:
      'Does the soundboard speaker system on my Kawai hybrid piano produce sound, or is it just for decoration?',
    excerpt:
      'The soundboard speaker is fully functional — it resonates acoustically like a real piano soundboard and is central to the hybrid piano experience.',
    answer: [
      'The soundboard speaker system on Kawai hybrid pianos is fully functional and produces authentic piano sound. It is not decorative.',
      'The soundboard works by vibrating in response to the audio signal, reproducing the acoustic resonance of a traditional piano soundboard. This creates a realistic, full-range piano tone that fills the room in a way that conventional speakers cannot replicate.',
      'The soundboard system is a core feature of Kawai hybrid pianos and works in conjunction with the instrument\'s built-in speakers to deliver the complete acoustic piano experience.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'sound-behavior',
  },
  {
    question:
      'The USB MIDI device on my ES520 portable piano is sometimes not detected correctly by my computer — what should I do?',
    excerpt:
      'Try different USB ports, restart both devices, update drivers, and use a different cable. USB 2.0 ports work most reliably.',
    answer: [
      'If your computer intermittently fails to recognise the ES520 as a USB MIDI device, try the following steps: Connect to a different USB port on your computer — USB 2.0 ports generally work most reliably with Kawai instruments. Try a different USB cable, as faulty cables are a common cause of intermittent detection issues.',
      'Restart both the ES520 and your computer, then reconnect. On Windows, open Device Manager and check for any unknown devices or error indicators next to the piano. If found, right-click and update the driver. On Mac, open Audio MIDI Setup (Applications > Utilities) to confirm the piano appears as a MIDI device.',
      'Ensure your operating system is fully up to date. If the issue persists, check the Kawai support website for any driver downloads for the ES520, or contact your local Kawai authorised dealer for further assistance.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'bluetooth-connectivity',
  },
  {
    question:
      'I really like some of the demo songs included with my Kawai piano — is it possible to get the sheet music?',
    excerpt:
      'Sheet music for included demo songs may be available through Kawai or your local dealer. Contact them with your piano model for details.',
    answer: [
      'Sheet music for the demo songs included with Kawai digital and hybrid pianos may be available through Kawai\'s official channels or through your local authorised dealer.',
      'Contact your local Kawai dealer or the Kawai subsidiary in your region with your piano\'s model number and the name of the specific song you are interested in. Availability varies by model and region.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },

  // ─── Product Support — Buying Guide ──────────────────────────────────────────

  {
    question: 'What is the difference between a grand piano and an upright piano?',
    excerpt: 'Grand pianos are horizontal with a repetition lever action. Uprights are vertical and more compact. Grands produce richer tone and allow faster repeated notes.',
    answer: [
      'Visually, grand pianos are positioned horizontally and stand on three legs; they are longer than they are tall. Upright pianos have a vertical orientation and are taller than they are deep.',
      'Physically, grand pianos are much heavier — ranging from around 600 lbs for a baby grand to over 1,100 lbs for a 9-foot concert grand. Upright pianos typically range from around 400 to 600 lbs.',
      'From a sound perspective, grand pianos can project more volume, especially with the lid fully open. The horizontal design allows the full acoustic potential of the internal components — larger soundboard, longer strings, and bigger iron plate — resulting in deeper, richer tone.',
      'Mechanically, grand pianos have a repetition lever (jack) that allows a note to be replayed without fully releasing the key. This is essential for rapid repeated notes in advanced repertoire. Upright pianos do not have a repetition lever — each note must be fully released before being replayed.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'How much do Kawai grand pianos cost?',
    excerpt: 'Kawai grand pianos range from the GL-10 baby grand starting at $6,990 to the SK-EX concert grand at $120,000+. Prices vary by series, size, and dealer.',
    answer: [
      'Kawai grand pianos range from the smallest baby grand to the world-renowned 9-foot Shigeru Kawai SK-EX Concert Grand. There are two main production series — the GL Professional Series (Indonesia) and the GX Performance Series (Japan). GX pianos are priced higher due to premium Japanese manufacturing.',
      'Approximate MSRP ranges: GL-10 (5\'0") $6,990–$8,490 | GL-15 (5\'1") $7,990–$9,490 | GL-20 (5\'5") $9,990–$11,990 | GL-30 (5\'11") $11,990–$14,490 | GL-40 (6\'1") $13,990–$17,490 | GL-50 (6\'6") $16,990–$21,490 | GL-60 (7\'0") $19,990–$25,490.',
      'GX Series MSRP: GX-1 (5\'0") $22,490–$28,490 | GX-2 (5\'1") $24,990–$30,490 | GX-5 (5\'5") $32,490–$40,490 | GX-7 (5\'11") $40,490–$50,490 | GX-9 (6\'1") $48,490–$60,490.',
      'Shigeru Kawai Series: SK-2 (5\'11") $65,490–$75,490 | SK-5 (6\'2") $72,490–$82,490 | SK-6 (6\'2") $78,490–$88,490 | SK-EX (9\'0") $120,000+.',
      'Prices listed are manufacturers\' suggested retail prices and may vary by region and dealer. Contact a Kawai authorized dealer for current pricing and promotions.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'What is the best piano for me?',
    excerpt: 'The best piano is the one that matches your space, budget, playing level, and musical goals. Visiting a Kawai dealer to play multiple models is the best way to decide.',
    answer: [
      'The "best" piano is highly subjective — every pianist plays differently, has different needs, and pursues different musical goals. A piano ideal for a classical concert performer may not suit a jazz musician, and a piano perfect for a professional may be overpowered in a small living room.',
      'Before selecting a piano, consider: the amount of physical space in your home, your budget, the level and style of music you wish to play, how often the piano will be played, whether you will be recording, whether you need to transport it, and the aesthetic qualities that matter most to you.',
      'Visit a Kawai dealer and play a variety of models from different series, sizes, and types. Pay close attention to how the piano feels under your fingers (the "touch") and whether the tone resonates with you emotionally. The right piano will inspire you to play more often.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'How many keys are on a piano?',
    excerpt: 'Most modern pianos have 88 keys — seven full octaves plus three additional notes. This has been the standard since the late 1800s.',
    answer: [
      'Most modern pianos have 88 keys — a number that was not standardized until the late 1800s. The predecessor of the piano, the harpsichord, had only 60 keys. As composers pushed the boundaries of range, piano manufacturers added keys, eventually settling on 88 as the standard.',
      '88 keys represent seven full octaves plus three additional notes, giving pianists ample range for nearly all music composed for the piano, from Baroque through contemporary.',
      'Virtually all modern pianos manufactured today, including all Kawai pianos, feature 88 keys. A few exceptions exist: some portable digital pianos marketed for beginners may have 54 or 76 keys. However, for serious students, a full 88-key keyboard is strongly recommended.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'How much do Kawai grand pianos weigh?',
    excerpt: 'Kawai grand pianos range from 617 lbs for the GL-10 baby grand to 1,280 lbs for the SK-EX concert grand. Weight increases with piano size.',
    answer: [
      'GL Series (Indonesia): GL-10 (5\'0") 617 lbs / 280 kg | GL-15 (5\'1") 639 lbs / 290 kg | GL-20 (5\'5") 705 lbs / 320 kg | GL-30 (5\'11") 793 lbs / 360 kg | GL-40 (6\'1") 858 lbs / 389 kg | GL-50 (6\'6") 925 lbs / 420 kg | GL-60 (7\'0") 992 lbs / 450 kg.',
      'GX Series (Japan): GX-1 (5\'0") 637 lbs / 289 kg | GX-2 (5\'1") 660 lbs / 299 kg | GX-5 (5\'5") 740 lbs / 336 kg | GX-7 (5\'11") 859 lbs / 390 kg | GX-9 (6\'1") 948 lbs / 430 kg.',
      'Shigeru Kawai Series (Japan): SK-2 (5\'11") 920 lbs / 418 kg | SK-3 (5\'0") 639 lbs / 290 kg | SK-5 (6\'2") 1,050 lbs / 476 kg | SK-6 (7\'0") 1,120 lbs / 508 kg | SK-7 (7\'6") 1,190 lbs / 540 kg | SK-EX (9\'0") 1,280 lbs / 581 kg.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'How much do Kawai upright pianos weigh?',
    excerpt: 'Kawai upright pianos range from 440 lbs for the GL-1 to 683 lbs for the K-500. Weight varies by model height and construction.',
    answer: [
      'GL Upright Series (Indonesia): GL-1 (44") 440 lbs / 200 kg | GL-2 (46") 485 lbs / 220 kg.',
      'K Series Uprights (Japan): K-200 (45") 519 lbs / 235 kg | K-300 (48") 595 lbs / 270 kg | K-500 (52") 683 lbs / 310 kg.',
      'UST Upright Series: UST-8 (45") 529 lbs / 240 kg | UST-9 (48") 600 lbs / 272 kg.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'What is a hybrid piano?',
    excerpt: 'A hybrid piano combines a real acoustic piano action with digital electronics — giving you authentic touch and the flexibility of a digital instrument.',
    answer: [
      'A hybrid piano combines the acoustic piano action and sound with digital electronics. Kawai hybrid pianos blend the mechanical action of an acoustic piano — including authentic wooden keys and key weight — with digital technology that enables connectivity, recording, and sound customization.',
      'Kawai\'s hybrid piano models include instruments like the K-200 ATX3 and K-300 AURES. These feature full acoustic piano mechanisms, integrated digital sound systems, Bluetooth and USB connectivity, built-in speakers, and recording and playback capabilities — all with the authentic touch and feel of an acoustic piano.',
      'Hybrid pianos are ideal for musicians who want the traditional acoustic experience but also appreciate modern convenience. They are particularly popular in homes where both traditional and contemporary sounds are valued, and in settings where practice volume must be controlled.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'Do Kawai pianos come with a bench, metronome, and lamp?',
    excerpt: 'It depends on the model and dealer promotions. Some models include a matching bench. Metronomes and lamps are typically optional accessories.',
    answer: [
      'Piano Bench: Some Kawai piano models are sold with a matching piano bench included, while others require the bench to be purchased separately. Ask your Kawai dealer about bench options and whether one is included with your specific model.',
      'Metronome: Kawai metronomes are available as optional accessories and are typically not included with piano purchases. They can be purchased separately from Kawai dealers or various music retailers.',
      'Lamp: Piano lamps are not standard with Kawai piano purchases but are available as optional accessories through authorized Kawai dealers. For specific information about what is included with your purchase, consult your local Kawai dealer about current promotions and package options.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'What is the history of Kawai?',
    excerpt: 'Kawai was founded in 1927 by Koichi Kawai in Japan and has grown into one of the world\'s leading piano manufacturers, known for innovation in both acoustic and digital instruments.',
    answer: [
      'Kawai was founded in 1927 by Koichi Kawai, a pioneering piano builder with a vision to create instruments of exceptional quality. From its humble beginnings in Japan, Kawai has grown into a global leader in acoustic and digital piano manufacturing.',
      'The company established its state-of-the-art manufacturing facility in Hamamatsu, Japan — widely recognized as one of the world\'s finest piano production centers. Kawai\'s commitment to craftsmanship has earned the company numerous accolades and the respect of musicians and technicians worldwide.',
      'In addition to acoustic pianos, Kawai has been instrumental in pioneering digital piano technology. Today, Kawai continues to innovate and develop new technologies — from the Millennium III ABS carbon action to advanced sound sampling from Shigeru Kawai concert grands — to enhance the piano experience for musicians of all levels.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'What is the Shigeru Kawai brand?',
    excerpt: 'Shigeru Kawai represents the pinnacle of Kawai\'s piano artistry — handcrafted instruments of the highest quality, named after the son of Kawai\'s founder.',
    answer: [
      'The Shigeru Kawai brand represents the pinnacle of Kawai\'s piano-making artistry. These pianos are named after Shigeru Kawai, the visionary son of Kawai\'s founder, who led the company through much of the 20th century and was instrumental in establishing Kawai\'s reputation for excellence.',
      'Shigeru Kawai pianos are handcrafted with meticulous attention to detail, manufactured exclusively in Japan using premium materials, and designed with input from world-renowned pianists and technicians. They are available in a limited range of models from baby grand to concert grand sizes, and are among the most expensive and sought-after pianos in the world.',
      'The Shigeru Kawai SK-EX concert grand is used by professional pianists and recording artists worldwide and is considered among the finest concert pianos available. These instruments represent the absolute top of Kawai\'s product line.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'What kind of piano do I need for my home?',
    excerpt: 'Consider your available space, budget, playing level, and how often the piano will be used. Visiting a Kawai dealer and playing several models is the best way to decide.',
    answer: [
      'Choosing the right piano for your home depends on several factors. Space: Grand pianos require more floor space than uprights. If space is limited, an upright or high-quality digital piano may be the best choice.',
      'Budget: Kawai offers a wide range of prices, from entry-level models to concert grands. Determine how much you can invest. Use: Will the piano be used for practice, lessons, performance, or casual playing? Professional pianists benefit from higher-end instruments, while beginners may be well-served by entry-level models.',
      'Sound and Touch: Do you prefer the warm tone of an acoustic piano or the consistency of a digital? Play different models at a dealer to find what feels right. Acoustics: Consider your home\'s acoustic environment and the neighbors\' proximity.',
      'Maintenance: Are you prepared to tune an acoustic piano 2–4 times per year? Digital pianos require minimal maintenance. Visiting a Kawai dealer and playing several different pianos is the best way to determine what will work best for your home.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'Is a Kawai piano good for beginners?',
    excerpt: 'Yes — Kawai makes excellent beginner pianos at various price points. Look for 88 weighted keys, responsive action, and a tone you enjoy.',
    answer: [
      'Yes — Kawai makes excellent pianos for beginners of all ages. The company offers models at different price points, making it possible to find a quality instrument that fits any budget.',
      'For beginners, Kawai recommends a full 88-key piano with weighted keys (which simulate the feel of an acoustic piano), a responsive and reliable action, and a pleasant tone that will inspire practice and progress.',
      "Kawai's GL Series offers excellent value for beginners looking at acoustic instruments, while the CN and KDP series digital pianos are popular choices for students. The key is to choose a piano that sounds and feels good to you — this will inspire you to practice more and progress faster.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'How long does a piano last?',
    excerpt: 'A high-quality acoustic piano, with proper care, can last 50–100 years or more. Kawai\'s 10-year warranty reflects confidence in the durability of their instruments.',
    answer: [
      'A high-quality acoustic piano, with proper care and maintenance, can last 50 to 100 years or even longer. Some historic pianos from the 1800s are still being played today. Kawai pianos are built to last for generations.',
      'The lifespan of a piano depends on: quality of construction and materials, frequency of use, environmental conditions (temperature and humidity), regular maintenance and tuning, and professional care and repairs as needed.',
      "Kawai's 10-year full warranty on acoustic pianos reflects the company's confidence in the durability and longevity of its instruments. With proper care, a Kawai piano can provide decades of musical enjoyment.",
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'Can I buy a used Kawai piano?',
    excerpt: 'Yes, but have it inspected by a qualified piano technician before purchase. Used pianos do not carry the Kawai 10-year warranty, which only covers new pianos from authorized dealers.',
    answer: [
      'Yes, used Kawai pianos are available through private sellers, piano dealers, and online marketplaces. However, buying a used piano requires careful evaluation.',
      'Age and Condition: Determine the piano\'s age using the serial number and assess its current condition. Older pianos may require significant reconditioning. Professional Evaluation: Have a qualified piano technician inspect any used piano before purchase — they can identify needed repairs and estimate costs.',
      'Warranty: Used pianos typically do not come with a manufacturer\'s warranty. Kawai\'s 10-year warranty applies only to new pianos purchased from authorized dealers. For more information about used Kawai pianos, especially those imported from Japan, contact a Kawai authorized dealer for guidance.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'How do I find an authorized Kawai dealer near me?',
    excerpt: 'Use the Dealer Locator at kawaius.com to search by location and find authorized Kawai dealers with contact info, hours, and promotions.',
    answer: [
      'Kawai maintains a network of authorized dealers across the United States and Canada. You can find an authorized Kawai piano dealer in your area by visiting the Dealer Locator on Kawai\'s website at kawaius.com.',
      'The Dealer Locator allows you to search by location and view information about authorized dealers near you, including contact information, showroom hours, and current promotions.',
      'Purchasing from an authorized Kawai dealer ensures you receive genuine Kawai pianos with full manufacturer warranties, expert knowledge from trained staff, delivery and setup services, access to financing options, and professional after-sales support.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },
  {
    question: 'Do Kawai pianos require tuning and maintenance?',
    excerpt: 'Acoustic pianos need tuning 2–4 times per year and periodic regulation and voicing. Digital pianos require minimal maintenance and no tuning.',
    answer: [
      'Acoustic pianos require regular tuning and maintenance. Kawai recommends 2–4 tunings per year, depending on environmental conditions and how often the piano is played. Concert pianos may require even more frequent tuning.',
      'Beyond tuning, pianos benefit from periodic regulation (adjustment of the action) and voicing (adjustment of hammer tone) to maintain consistent touch and tone quality.',
      'Environmental conditions matter: maintain stable temperature (65–75°F) and humidity (45–55% relative humidity) to protect the instrument. Digital pianos require minimal maintenance beyond dusting and occasional cleaning, and do not require tuning.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'buying-guide',
  },

  // ─── Product Support — Product Information (additions) ───────────────────────

  {
    question: 'How do Kawai grand piano models compare in size?',
    excerpt: 'Kawai grand pianos range from 4\'9" to 9\'1". Here is a complete chart of current and legacy Kawai grand piano models organized by size.',
    answer: [
      'Kawai grand piano models vary significantly in size. Here is a chart of past and present models by approximate length:',
      '4\'9": Shigeru | 5\'0": GM-2, GM-10, GM-10K, GM-12, GL-10 | 5\'1": GE-1, GE-20, 350 (Legacy) | 5\'2": GL-20 | 5\'5": GE-30, GL-30, KG-1 (Legacy) | 5\'7": GE-2 | 5\'9": GE-3 | 5\'10": 500 (Legacy), KG-2 (Legacy).',
      '5\'11"–6\'0": GL-40 | 6\'1": 600 (Legacy), KG-3 (Legacy), GS-30, GS-40, R-O, RX-3, SK-3 | 6\'2"–6\'3": GL-50 | 6\'6": R-1, RX-A, RX-5, SK-5 | 6\'7": GX-5, SK-5L | 6\'8": 650 (Legacy), KG-5 (Legacy).',
      '6\'9": KG-6E, KG-6A (Legacy), GS-50, GS-60 | 7\'0": R-2, RX-6, GX-6, SK-6, SK-6L | 7\'4": 750 (Legacy), KG-6C, KG-7 | 7\'5": GS-70 | 7\'6": RX-7, GX-7, SK-7, SK-7L | 8\'2": 800 (Legacy), GS-80 | 9\'0": KG-8 (Legacy), GS-100EX, SK-EX | 9\'1": SK-EX-L.',
      'Note: Models in bold are currently in production. Models in the same row share the same string scales and basic dimensions.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'What are Kawai\'s discontinued digital piano models (Legacy Products)?',
    excerpt: 'Kawai Legacy Products are discontinued models reclassified for their historical significance. They include CS, CN, CA, ES, CP, KDP, and MP series models from 1990 to the present.',
    answer: [
      'Kawai Legacy Products are instruments no longer in production but which have made significant contributions to the company\'s history. As newer technology replaces older models, Kawai reclassifies discontinued models as Kawai Legacy Products.',
      'Discontinued Console & Portable Models (1990–present) include: CP1, CP2, CP3, Z1000, K300-ATX2, K200-ATX2, CS4, CS7, CS10, CS11, CS8, ES1, ES7, ES100, CN270, CN25, CN27, CN29, CN35, CN37, CN39, KDP90, KCP90, CA49, CA59, CA65, CA67, CA97, CE220, CL26.',
      'Discontinued Professional Stage Models include: MP6, MP7, MP8, MP9000, MP10, MP11.',
      'These discontinued models are sought after by piano enthusiasts who value their unique characteristics in Kawai\'s digital piano evolution. Replacement parts and firmware support may be limited for older legacy products.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },
  {
    question: 'What are Kawai\'s discontinued acoustic and hybrid piano models?',
    excerpt: 'Discontinued Kawai acoustic and hybrid models include the RX grand series, K-2/K-3/K-5/K-6/K-8 uprights, UST-9, K300-ATX2, and K200-ATX2.',
    answer: [
      'Kawai Legacy Products from each acoustic piano category include:',
      'Discontinued Grand Pianos: RX-1, RX-2, RX-3, RX-5, RX-6, RX-7, GM-10, GM-11, GM-12, GM-10K, GE-30, CR-40.',
      'Discontinued Upright Pianos: K-2, K-3, K-5, K-6, K-8, UST-9.',
      'Discontinued Hybrid Pianos: K300-ATX2, K200-ATX2.',
      'These models represent important milestones in Kawai\'s history and remain popular among pianists and collectors. Many continue to perform well despite their age, though reconditioning may be needed depending on use and environmental conditions.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'product-information',
  },

  // ─── Product Support — Piano Care (TSD US-specific version) ──────────────────

  {
    question: 'What is the detailed care guide for my Kawai piano?',
    excerpt: 'Use a soft duster for cleaning, avoid furniture polishes, tune 2–4 times per year, and have a Registered Piano Technician (RPT) perform regulation and voicing.',
    answer: [
      'Cleaning: Use a soft feather or wool-type duster to remove dust. Avoid applying pressure or dragging dust across the finish — this can cause fine scratches that eventually dull a high-gloss finish. Fingerprints can be cleaned with a dampened soft cloth followed by a dry cloth. For stubborn greasy dirt, a small amount of mild dishwashing liquid or high-quality window cleaner (such as Windex) may help.',
      'Furniture polishes are generally not recommended except for specialized high-gloss polishes. One recommended product is "Cory" Polish, available from Kawai America, your authorized dealer, and many piano technicians. If a high-gloss finish becomes dull or deeply scratched, a polyester repair specialist can restore it — contact your dealer for a referral.',
      'The interior of the piano (plate, strings, soundboard, and action) should only be cleaned by a qualified piano technician. Improper cleaning may cause damage.',
      'Tuning and Service: Kawai recommends 2–4 tunings per year, depending on temperature stability, humidity, and frequency of use. Pianos also need periodic regulation and voicing to maintain even touch and tone. If the touch seems uneven or notes do not repeat well, consult a technician.',
      'For finding a qualified technician, Kawai recommends contacting a Registered Piano Technician (RPT) member of the Piano Technicians Guild. RPT members have demonstrated proficiency in piano tuning and servicing and maintain continuing education to keep their skills current.',
    ],
    groupSlug: 'product-support',
    categorySlug: 'piano-care-maintenance',
  },

  // ─── TSD — Warranty & Defects (US-specific warranty and returns) ─────────────

  {
    question: 'What warranty coverage does Kawai offer on acoustic pianos?',
    excerpt: 'Kawai acoustic pianos are covered by a 10-Year Full Warranty — one of the strongest in the piano industry, including full replacement if a problem cannot be corrected.',
    answer: [
      'Kawai acoustic pianos are supported by one of the strongest warranties in the piano industry: a TEN YEAR FULL WARRANTY. This full warranty guarantees that the manufacturer will stand behind the product, even to the point of full replacement if a problem cannot be corrected.',
      "Kawai's 10-Year Full Warranty embodies our commitment to excellence — it is the seal of Kawai craftsmanship and the assurance of your satisfaction.",
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What is the difference between a full warranty and a limited warranty?',
    excerpt: 'A full warranty guarantees repair or replacement and is transferable to new owners. A limited warranty places restrictions on the manufacturer\'s liability and is generally not transferable.',
    answer: [
      'A Full Warranty guarantees that the manufacturer will stand behind the product, even to the point of full replacement if a problem cannot be corrected. By definition, a full warranty is transferable from one owner to the next — meaning the warranty remains in effect for the full period regardless of owner, enhancing the piano\'s resale value.',
      'A Limited Warranty places limits on the manufacturer\'s legal responsibility to repair defects and is generally not transferable. Kawai\'s acoustic piano warranty is a Full Warranty, not a limited warranty.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'Is Kawai\'s acoustic piano warranty transferable to a new owner?',
    excerpt: 'Yes — Kawai\'s 10-Year Full Warranty is fully transferable, enhancing the resale value of the instrument for the full warranty period.',
    answer: [
      "Yes. Kawai's TEN YEAR FULL WARRANTY is transferable from one owner to the next. The warranty remains in effect for the full period regardless of owner, thereby enhancing the piano's resale value if transferred to a new owner during the warranty period.",
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What does the Kawai acoustic piano warranty cover?',
    excerpt: 'The warranty covers defects in materials and workmanship. Normal wear and external forces beyond the manufacturer\'s control are not covered.',
    answer: [
      "The Kawai acoustic piano warranty covers defects of materials and workmanship. If problems occur related to the piano's original materials or factory assembly, such issues are covered under warranty.",
      'Normal wear and external forces beyond the control of the manufacturer are not covered. For specific questions about whether a particular issue is covered, contact Kawai\'s Technical Support Division (TSD).',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What documentation do I need to maintain my Kawai warranty coverage?',
    excerpt: 'Retain your original sales receipt as proof of purchase date and fill out and return your warranty card to Kawai.',
    answer: [
      "Customers should retain their sales receipt or purchase statement as proof of the date of purchase. You should also fill out your warranty card and return it to Kawai.",
      'If you have questions about your warranty coverage or need a copy of your warranty, contact Kawai\'s Technical Support Division (TSD).',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What warranty coverage is available for Kawai digital pianos?',
    excerpt: 'Kawai digital piano warranties vary by series: CN/CA/DG/NV Series — 5 years parts and labor; KDP/ES/CX Series — 3 years parts and labor; MP/VPC Series — 3 years parts, 1 year labor.',
    answer: [
      'Kawai America Corporation and Kawai Canada Music offer the following warranties for Kawai digital pianos purchased from authorized dealers in the US and Canada:',
      'Kawai CN, CA, DG, and NV Series products: 5 Years Parts and Labor.',
      'Kawai CX, KDP, and ES Series products: 3 Years Parts and Labor.',
      'Kawai MP and VPC Series products: 3 Years Parts and 1 Year Labor.',
      'For questions about your specific model\'s warranty, contact Kawai\'s Technical Support Division (TSD).',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'Do I need a Return Authorization (RA) number to return merchandise to Kawai?',
    excerpt: 'Yes — all authorized Kawai dealers must obtain an RA number from TSD before returning any serialized merchandise or electronic sub-assemblies.',
    answer: [
      'As an Authorized Kawai Dealer operating in North America, to return any serialized merchandise to Kawai, you must first obtain a Return Authorization (RA) Number from Kawai America\'s Technical Support Department (TSD). An RA number is also required for any non-serialized electronic sub-assemblies sent to Kawai for repair.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'Do non-serialized items like adapters and headphones require an RA number?',
    excerpt: 'Non-serialized items do not require an RA number but still require pre-authorization from TSD before return.',
    answer: [
      'Non-serialized merchandise such as adapters, headphones, case parts, or similar items do not require an RA number but still require pre-authorization from TSD before returning.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'Can acoustic pianos be returned directly to Kawai by retail customers?',
    excerpt: 'No — acoustic pianos cannot be returned directly to Kawai by piano owners. The return process must go through an Authorized Kawai Dealer.',
    answer: [
      'Acoustic pianos cannot be returned directly to Kawai from a retail customer (piano owner). The return authorization process must be facilitated through an Authorized Kawai Dealer.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What happens to defective units that are returned to Kawai?',
    excerpt: 'Kawai will repair or replace defective units at its option. Units may not be returned for credit. Include a description of the issue and the RA number must be on the carton.',
    answer: [
      'KAWAI will, at its option, replace an instrument only if repair is not possible. Defective units may not be returned for credit but will be repaired.',
      'When returning a defective electronic unit, include a short note describing the issue and what was done to attempt correction prior to requesting the RA. The RA number and serial number must be prominently displayed on the outside of the carton(s), or noted on all documentation for large items such as a piano.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'How should I handle returning a damaged instrument to Kawai?',
    excerpt: 'Contact TSD for approval. Since shipping damage is not Kawai\'s direct responsibility, options include filing a claim with the shipper or parts replacement and labor reimbursement.',
    answer: [
      'Contact TSD for approval to return damaged instruments. Since shipping damage is not Kawai\'s direct responsibility, TSD may discuss other options such as (a) filing a claim with the shipper or (b) parts replacement and labor reimbursement to repair damaged units.',
      'Damaged units may not be returned for credit but will either be repaired or replaced by TSD.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What should I do if I receive an incorrect product from Kawai?',
    excerpt: 'Accept the shipment and contact TSD to arrange return of the incorrect unit and shipment of the correct product. An RA number will be issued.',
    answer: [
      'As an Authorized Kawai Dealer, if you receive an instrument you believe was sent in error, please accept the shipment and contact TSD to arrange for the return and shipment of the correct product. An RA number will be issued for the return, which must be initiated by TSD.',
      'Kawai Piano Owners may contact the Kawai Dealer from whom they purchased their instrument for advice.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What happens if I return a unit to Kawai without a Return Authorization number?',
    excerpt: 'Units returned without a Return Authorization number will be refused and returned to the sender.',
    answer: [
      'UNITS RETURNED WITHOUT A RETURN AUTHORIZATION WILL BE REFUSED AND RETURNED TO THE SENDER. Always obtain an RA number from TSD before shipping any merchandise back to Kawai.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What are the payment terms for non-warranty repairs at Kawai?',
    excerpt: 'All non-warranty repair charges must be charged to a valid credit card prior to shipment back to the customer. Do not include credit card info in documentation with the returned unit.',
    answer: [
      'All non-warranty repair charges for retail customer repairs must be charged to a valid credit card prior to shipment back to the customer. Please do not include credit card information in any documentation enclosed with the returned unit. TSD will call for the credit card information when the work is completed.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'How are completed non-warranty repairs returned to customers?',
    excerpt: 'Completed non-warranty repairs are returned by Federal Express Ground unless special handling is requested. Shipping charges will be added to the invoice.',
    answer: [
      'Completed non-warranty repairs are returned by Federal Express Ground unless special handling is requested. Shipping charges will be added to the invoice.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'How are warranty repairs shipped back to customers?',
    excerpt: 'Warranty repairs are returned pre-paid via Federal Express Ground. Expedited shipping is available by request at the owner\'s expense.',
    answer: [
      'Warranty repairs are returned pre-paid via Federal Express Ground. Expedited handling (third day, second day, or next day) is available by special request — but the owner will be responsible for any additional expense.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What is required for carry-in service at Kawai\'s facility in Rancho Dominguez, CA?',
    excerpt: 'Product brought to Kawai\'s Rancho Dominguez facility must have an RA number. Call TSD before arriving and notify Kawai of the delivery time.',
    answer: [
      "Product carried into Kawai's facility in Rancho Dominguez, CA for repairs must also have an RA number. Call or email TSD and obtain an RA prior to bringing in the unit.",
      'This policy includes acoustic pianos and digital pianos delivered by local dealers or via independent delivery services and piano movers. You or the movers must also call on or before the day of delivery to let Kawai know the time of arrival.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What is Kawai\'s online store return policy?',
    excerpt: 'Kawai\'s online store has a No-Questions-Asked return policy for instruments within 15 days of receipt. Accessories are not returnable. Email sales@kawaius.com to start the process.',
    answer: [
      'Requests for return of instruments purchased directly from Kawai America\'s online store are accepted up to 15 days after receipt of the instrument. Accessories may not be returned.',
      'To begin the return process, send an email to sales@kawaius.com and include the model, serial number, and the original order number.',
      'These policies apply only to instruments purchased in the United States from Kawai America\'s online store at kawaius.com. For purchases from independent retailers, refer to those retailers\' policies.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'What are the conditions for returning an instrument purchased from Kawai\'s online store?',
    excerpt: 'The instrument must be returned in its original packaging and received in new condition. Shipping charges are not refundable. Repair and restocking fees may apply if improperly packed.',
    answer: [
      'The instrument must be returned in its original packaging. Instruments must be received in new condition upon return to a Kawai distribution center.',
      'Shipping charges to your location are not refundable. Return shipping charges are not refundable. Repair and restocking fees may apply to instruments improperly repacked for return.',
      'You are encouraged, but not required, to insure the piano against return shipping damage.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'How do I report shipping damage on an instrument from Kawai\'s online store?',
    excerpt: 'Report shipping damage within 5 days of receipt by emailing service@kawaius.com or calling TSD at (310) 631-1771 ext. 6867. Attach photos if possible.',
    answer: [
      'Reports of shipping damage must be made within 5 days of receipt of the instrument.',
      'Report physical or concealed damage to Kawai TSD via email at service@kawaius.com or call (310) 631-1771 ext. 6867, Monday–Friday, 8am–5pm Pacific time. Attach supporting photos if possible. Include the model, serial number, and order number.',
      'When Kawai determines return shipping is necessary, it is at no charge to you. Replacement instruments or parts will also be shipped at no charge.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'How do I report a defective product purchased from Kawai\'s online store?',
    excerpt: 'Report operational failures to support@kawaius.com or call (310) 631-1771 ext. 6868. A product support specialist will contact you to assess the issue.',
    answer: [
      'Reports of defects shall be made in a timely manner. Report suspected operational failures to Kawai Product Support via email at support@kawaius.com or call (310) 631-1771 ext. 6868, Monday–Friday, 8am–5pm Pacific time.',
      'Include the model, serial number, and order number. A product support specialist will contact you to determine the nature of the problem. If a repair is not feasible, a replacement instrument will be authorized at no charge to you.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },
  {
    question: 'How can I contact Kawai\'s Technical Support Division (TSD)?',
    excerpt: 'Contact TSD by email at service@kawaius.com, by phone at (310) 631-1771 ext. 6867, or visit at 2055 E. University Drive, Rancho Dominguez, CA 90220.',
    answer: [
      'You can reach Kawai TSD in the following ways:',
      'Email: service@kawaius.com (shipping damage / warranty service) | support@kawaius.com (defective products / product support) | sales@kawaius.com (online store returns).',
      'Phone: (310) 631-1771 — Extension 6867 for TSD (Technical Service Department), Extension 6868 for Product Support. Hours: 8am–5pm Pacific time, Monday through Friday.',
      'Mailing Address: 2055 E. University Drive, Rancho Dominguez, CA 90220.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'warranty-defects',
  },

  // ─── TSD — Service Manuals & Downloads ───────────────────────────────────────

  {
    question: 'Where is the serial number on my Kawai piano, and how do I determine the year it was made?',
    excerpt: 'Serial number location varies by instrument type. Grand: under the music desk on the iron plate. Upright: top of the iron plate. Digital: under the keybed on the right side.',
    answer: [
      'For Kawai grand pianos, the serial number is found on the iron plate under the music desk on the right side (near the tuning pins). You may need to slide out the music desk to see it.',
      'For Kawai upright pianos, the serial number is located either (1) at the top right side of the iron plate (near the tuning pins) or (2) at the top center of the plate between the bass and treble sections. Lift the piano lid to find it.',
      'For Kawai acoustic hybrid pianos (K200-ATX3 and K300 AURES), the serial number is at the top center of the iron plate under the Kawai logo.',
      'For console digital pianos (KDP/CN/CA/CS/CP/NV) and portable digital pianos (ES Series), the serial number is under the keybed on the right side. For MP Series stage pianos, the serial number is on the back of the instrument.',
      'Japan production serial numbers begin with 4200 in 1927 and reach 2,774,800 in 2023. U.S. production (1988–2004) begins with A6904. Indonesia production (2003–2020) begins with F000200. Serial numbers for different models are not always sequential — actual dates may vary slightly.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What should I know about used Kawai pianos imported from Japan?',
    excerpt: 'Used Kawai pianos from Japan are typically 20–30 years old, may have wood seasoning issues in drier North American climates, and do not carry Kawai\'s transferable warranty.',
    answer: [
      'Typical used Kawai pianos from Japan are approximately 20–30 years old. At this stage, a piano may require major reconditioning — hammers and strings may need replacement, tuning pins reset, and regulation and voicing performed. This overhaul can be costly and should be factored into the purchase price.',
      'Some younger used pianos (6–12 years old) have been subjected to rigorous daily use in Japanese music schools and will almost certainly require reconditioning sooner than normal.',
      'Wood Seasoning: Kawai pianos built for Japan were historically seasoned for Japan\'s humid climate, differently from those built for North America. Moving them to a drier North American environment can cause problems. Current production instruments are well-seasoned for North America and are far less susceptible to these issues.',
      'Wood Instability: All older pianos are affected by fundamental instability of wood in piano actions, which compromises tone and touch consistency. Newer Kawai models with ABS Styran action parts are scientifically proven to be 30x more resistant to swelling and shrinking than comparable wooden parts.',
      'Replacement Parts: Kawai America and Kawai Canada do not carry parts inventory for models that were never sold in North America or were built long ago. Parts will not be available for these instruments.',
      'Warranty: Kawai\'s 10-Year Fully Transferable Warranty applies only to new units purchased from an authorized Kawai dealer in North America.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What acoustic piano service manuals are available from Kawai?',
    excerpt: 'Kawai offers six downloadable service documents for piano technicians, including parts manuals, regulation guides (English and Spanish), a voicing manual, and a care guide.',
    answer: [
      'The following service manuals are available for download from Kawai\'s Technical Support Division and are intended for experienced piano technicians:',
      '1. Acoustic Parts Manual (15.5MB) — detailed listing of Kawai piano part numbers with illustrations, including treble string scale information for most Kawai piano models.',
      '2. Upright Piano Regulation Manual — English (1.8MB) — complete regulation steps with specifications for Kawai upright pianos, with photo illustrations.',
      '3. Grand Piano Regulation Manual — English (4.4MB) — complete regulation steps with specifications for Kawai grand piano models, with photo illustrations.',
      '4. Manual de Regulacion de Pianos de Cola — Español (2.7MB) — regulation steps with specifications for Kawai grand piano models in Spanish, with photo illustrations.',
      '5. Voicing the Kawai Grand Piano (80.9MB) — complete guide for voicing Kawai grand piano hammers, including how to needle and shape hammers for optimal tone.',
      '6. Caring for your Kawai Piano — general guidelines for piano owners regarding proper piano care, location, temperature and humidity, and service needs.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What should I do before updating the operating system on my Kawai digital piano?',
    excerpt: 'Save all user settings before updating. An OS update may reset your custom configurations to factory defaults.',
    answer: [
      'Before updating the operating system on your Kawai digital piano, always save any user settings first. This is critical to prevent loss of your custom sounds, configurations, and preferences.',
      'After the update, you may need to restore your saved settings. Read all update instructions carefully before proceeding. If the update uses a USB drive, ensure it is formatted as FAT32 and the firmware file is in the root directory.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What firmware updates are available for Kawai CS and CA concert artist digital pianos?',
    excerpt: 'Firmware updates are available for CS6–CS11, CA63–CA97, and CA95 models. Download the appropriate zip file from the Kawai Digital Piano Software Update page and follow the instructions PDF.',
    answer: [
      'CS Series Updates: CS11 v1.10 (cs11_v110.zip) | CS8 v1.10 (cs8_v110.zip) | CS10 v2.02 | CS9 v1.07 (cs9_v107.zip) | CS7 v2.02 (cs7_v202.zip) | CS6 v1.07 (cs6_v107.zip). Read the instructions/change log PDF before updating each model.',
      'CA Series Updates: CA97 v1.10 | CA67 v1.09 (ca67_v110.zip) | CA95 v2.02 (ca95_v202.zip) | CA65 v2.02 (ca65_v202.zip) | CA93 v1.09 (ca93_v109.zip) | CA63 v1.09 (ca63_v109.zip). Read the instructions PDF before updating each model.',
      'All updates can be downloaded from the Digital Piano Software Update page on the Kawai TSD website. Remember to save user settings before updating.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What firmware updates are available for Kawai CN concert pianist digital pianos?',
    excerpt: 'Updates are available for CN33, CN34, CN35, and CN43. Download the appropriate zip file from the Kawai Digital Piano Software Update page.',
    answer: [
      'CN Series Updates: CN35 v1.09 (cn35_v109.zip) | CN34 v1.11 (cn34_v111.zip) | CN33 v1.21 (cn33_v121.zip) | CN43 v1.05 (cn43_v105.zip).',
      'All updates can be downloaded from the Digital Piano Software Update page on the Kawai TSD website. Read the instructions/change log PDF before proceeding with each update. Remember to save user settings before updating.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What firmware updates are available for Kawai CP concert performer digital pianos?',
    excerpt: 'Updates are available for CP1–CP3, CP209/CP179, CP139, CP119, CP200/CP170/CP150, CP110, and CPXX5/CPXX7 series. Help disks and style libraries are also available.',
    answer: [
      'CP1 v1.05 (CP1_ver105.zip) | CP2 v1.06 (CP2_ver106.zip) | CP3 v1.06 (CP3_ver106.zip).',
      'CPXX9 series: CP209/CP179 system v1.05 | CP139 system v1.04 | CP119 system v1.06. Save user settings before updating.',
      'CPXX0 series: CP200/CP170/CP150 system v2 (CP200_170_150 v2.zip). CP110 system (CP110 OS Complete.zip). Save user settings before updating.',
      'CPXX5 series: v1.06 (CPXX5 OS v1.06.zip) and v2.04 (CPXX5 OS v2.04.zip). CPXX7 series: call (800) 421-2177 x862 for assistance.',
      'CP Help Disks: Basics.zip, Recording.zip, Utilities.zip — overview of CP features, internal recorder, and utilities.',
      'CP Style Libraries: CP_BigBand.zip (9 Big Band styles), CP_Latin1.zip (9 Latin styles), CP_Trad.zip (9 Traditional styles). See cp style library.jpg for loading instructions.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What firmware updates are available for Kawai ES portable digital pianos?',
    excerpt: 'ES7 v1.17 and ES8 v1.05 updates are available from the Kawai Digital Piano Software Update page.',
    answer: [
      'ES7 system v1.17 (es7_v117.zip) — read the instructions/change log PDF before updating.',
      'ES8 system v1.05 (es8_v108.zip) — read the instructions/change log PDF before updating.',
      'All updates can be downloaded from the Digital Piano Software Update page on the Kawai TSD website.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What firmware updates are available for Kawai MP professional stage pianos?',
    excerpt: 'Updates are available for MP4 through MP11, plus MP9500 and MP9000. The MP9500/MP9000 updates carry risk of Flash-ROM damage if transmission fails.',
    answer: [
      'Standard MP Updates: MP4 v2.12 | MP5 v1.15 | MP6 v1.13 (mp6_v113.zip) | MP7 v1.16 (mp7_v116) | MP8 v2.15 | MP8II v1.15 | MP10 v1.07 (mp10_v107.zip) | MP11 v1.16 (mp11_v116.zip). Read the included instructions before updating.',
      'MP9500 and MP9000: These OS updates are performed by playing an SMF file containing SYSEX via MIDI or USB. IMPORTANT: If the data is not correctly transmitted, there is a risk of damaging the Flash-ROM, requiring PCB board replacement at your cost. Not all sequencing hardware/software can transmit SYSEX correctly. Proceed at your own risk and read all instructions carefully.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What software and sound bank downloads are available for the Kawai K-1 synthesizer?',
    excerpt: 'K-1 resources include a sound library PDF, SYSEX sound banks, SMF versions of all factory banks, and a SYSEX utility for PC.',
    answer: [
      'K-1 Libraries.pdf — sound list for all K-1 factory sound banks.',
      'K-1.zip — SYSEX versions of all K-1 factory sound banks, with read me instructions and a SYSEX utility for PC.',
      'K-1 Multis.rtf — explanation of how to create a K-1 multi patch for use as a sequencing template.',
      'K-1 SMF.zip — SMF versions of all K-1 factory sound banks with read me instructions.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What software and sound bank downloads are available for the Kawai K-3, K-4, and K-5 synthesizers?',
    excerpt: 'SYSEX sound banks, SMF versions, multi patch guides, and SYSEX utilities are available for K-3, K-4, and K-5 series synthesizers.',
    answer: [
      'K-3: K-3.zip — SYSEX versions of all K-3 factory sound banks with instructions and SYSEX utility for PC. K-3 SMF.zip — SMF versions with read me.',
      'K-4: K-4.zip — SYSEX versions of all K-4 factory sound banks with read me and SYSEX utility. K-4 Multis.rtf — explanation of how to create a K-4 multi patch for sequencing. K-4 SMF.zip — SMF versions of all K-4 factory sound banks.',
      'K-5: K-5 Sound Library.pdf — sound list for all K-5 factory banks. K-5 Cake.zip — Cakewalk .wrk versions. K-5MID.zip — SMF versions. Req_acks.mid — MIDI file that sends data dump request messages to K-5/K-5m. Req_acks.txt — instructions.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What software, sound banks, and OS updates are available for the Kawai K5000 synthesizer series?',
    excerpt: 'K5000 resources include arpeggio patterns, sound bank collections, demos, system enhancements, OS updates for K5000W/S/R, and supplement materials.',
    answer: [
      'Sound Banks: ARP.zip (arpeggio patterns) | Collect 1 & 2.zip (two banks with multi/combi patches) | K5k ASL Library.zip (4 banks) | v1 Factory.zip and v3 Factory.zip (original factory banks). K5000 Library.zip — sound list for factory ASL library.',
      'Demos: K5k Demo.zip — collection of original K5000 demos.',
      'System Enhancements: k5k_v3.txt, k5k_v4.txt, k5k_v4.03.txt, k5k_v4.04.txt — enhancement lists for K5000W/S/R system versions 3.00 through 4.04.',
      'K5000R OS Updates: K5KR301.zip (v3.01) and K5KR404.zip (v4.04). SAVE YOUR SOUNDS FIRST. Format a 2HD disk using K5000, insert K5KR file, hold F8 and power on. Supplement 40R.zip also available.',
      'K5000S OS Updates: K5KS300.zip (v3.00) and K5KS404.zip (v4.04). SAVE YOUR SOUNDS FIRST. Hold F2 and power on. Supplement 40S.zip also available.',
      'K5000W OS Updates: K5KW310.zip (v3.10) and K5KW403.zip (v4.03). SAVE YOUR SOUNDS FIRST. Hold Oct > button and power on. Supplement 40W.zip also available.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What USB-MIDI and serial port drivers are available for Kawai instruments on older Windows versions?',
    excerpt: 'Kawai offers USB-MIDI drivers for Windows Vista and XP, and serial port MIDI drivers for Windows 95, 98, and NT.',
    answer: [
      'USB-MIDI Drivers: Vista Driver.zip — for Windows Vista (32-bit) and Kawai models with built-in USB interface. Kawai USB-MIDI.zip — for Windows XP (32-bit) and Kawai models with built-in USB interface. Read the included instructions.',
      'Serial Port MIDI Drivers: drvwin95.zip — for Windows 95 and Kawai models with built-in serial-to-host interface. drvwin98.zip — for Windows 98. drvwinnt.zip — for Windows NT.',
      'For modern Windows 10/11 systems, no additional driver is needed — USB-MIDI is natively supported.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },
  {
    question: 'What downloads are available for other Kawai legacy digital instruments (XD-5, Z1000, GB, DRP, R50)?',
    excerpt: 'Factory reset SYSEX files, sound banks, style libraries, OS updates, and help materials are available for XD-5, Z1000, GB series, DRP-10, ACR-20, R50, and R50E.',
    answer: [
      'XD-5: XD-5.zip — SYSEX versions of all XD-5 factory sound banks with read me and SYSEX utility. XD-5smf.zip — SMF versions.',
      'Z1000: All Euro Styles.zip (80 styles) | Style Convert.zip (updated style convert with Yamaha and 5 new styles) | Z1000 system v2.42 (Z1000 v242.zip). Save user settings before updating. Insert formatted disk, hold Pops button and power on.',
      'GB Series: GB Card List.jpg — list of remaining GB ROM cards in stock and songs on each card. GB2 Helpful Hints.rtf — tips for GB2. GB4 Getting Started.rtf — tips for GB4.',
      'DRP-10/ACR-20: DRP_ACR.zip — supplement materials originally included on floppy disk.',
      'R50/R50E/R100: R50.syx, R50E.syx, R100.syx — SYSEX data files that restore factory settings for each model.',
      'GMega LX/KC20 SYSEX: Four SYSEX message data files available (REQUESTS 1 of 4.zip, SECTION 2 of 4.zip, SETTING 3 of 4.zip, SYSFUNCT 4 of 4.zip) with explanation included.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'service-manuals-downloads',
  },

  // ─── TSD — Legacy Products & Synthesizers ────────────────────────────────────

  {
    question: 'How do I create a multi patch and sequence using my Kawai K-1 synthesizer?',
    excerpt: 'Configure system MIDI settings, set each section to a unique MIDI channel in a Multi patch, then connect to your sequencer. Step-by-step instructions are provided.',
    answer: [
      'Before sequencing with the K-1, you must create a Multi patch for multi-timbral operation. Each of the 8 sections must be set to a separate MIDI channel.',
      'Preliminary SYSTEM settings: (1) Push SYSTEM. (2) Push -NO until display shows SYSTEM/MIDI = SYS. (3) Push SYSTEM 3 more times. (4) Push -NO to set INT PROTECT = OFF. (5) Continue pushing SYSTEM until SYSTEM/MIDI = SYS appears again. (6) Change SYS to RCV using +YES twice. (7) Push SYSTEM, then set RCV CH = 1. (8) Push SYSTEM, then set OMNI = OFF. (9) Push SYSTEM, then set RCV PRG = SECT using +YES. (10) Push MULTI to exit.',
      'Creating the Multi Patch: (1) Pick a Multi patch to overwrite. (2) Push EDIT. (3) Push C for Window 3 and use buttons 1–8 to select sections. Set POLY = VR, MODE = MIDI, and RCV CH = section number for each section. (4) Push B for Window 2, set ZONE LO = C-2 and ZONE HI = G8, and VEL SW = ALL for each section. (5) Push D for Window 4 and set TRANS = 0, TUNE = 0, LEVEL = 100, OUTPUT = L+R for each section. (6) Push WRITE to save.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'legacy-products-synthesizers',
  },
  {
    question: 'How do I create a multi patch and sequence using my Kawai K-4 synthesizer?',
    excerpt: 'Configure system MIDI settings, create a Multi patch with each section on a unique MIDI channel, then connect to your sequencer. Step-by-step instructions are provided.',
    answer: [
      'Before sequencing with the K-4, create a Multi patch configured for multi-timbral operation.',
      'Preliminary SYSTEM settings: (1) Push WRITE 5 times. (2) Push -NO to set INT PROTECT = OFF. (3) Push SYSTEM. (4) Set SYSTEM/MIDI = RCV. (5) Push SYSTEM, set RCV CH = 1. (6) Push SYSTEM, set OMNI = OFF. (7) Push SYSTEM, set RCV PRG = SECT using +YES. (8) Push MULTI to exit.',
      'Creating the Multi Patch: (1) Choose a Multi patch to overwrite. (2) Push EDIT. (3) Push C for Window 3: set RCV CH = section number, and for K-4 keyboards set MODE = MIDI for each section. (4) Push B for Window 2: set ZONE LO = C-2, ZONE HI = G8, VEL SW = ALL for each section. (5) Push D for Window 4: set LEVEL = 100, TRANS = 0, TUNE = 0, SUBMIX = A for each section. (6) Push WRITE twice, then +YES twice to save.',
      'Program Change Chart: Banks A–D correspond to program numbers 1–64 (A=1–16, B=17–32, C=33–48, D=49–64).',
    ],
    groupSlug: 'tsd',
    categorySlug: 'legacy-products-synthesizers',
  },
  {
    question: 'How do I get started using my Kawai GB-4 Session Trainer?',
    excerpt: 'Use the STYLE page to select a rhythm and the CHORD INPUT page to enter chord progressions, then save to one of 50 user locations.',
    answer: [
      'STYLE Page: Select your accompaniment rhythm (1–100 available). Choose variations (VR1, VR2), fills (FL1, FL2), endings (END), or other style options. Press PLAY/ENTER to start at measure 001.',
      'CHORD INPUT Page: Input chord progressions by measure and beat. Move the cursor to measure 001 and input the first chord using C–B buttons, the 10-key pad, and flat/sharp buttons. Press ENTER after each chord. Create slash chords (e.g. D/G) using the "/" button. Use the dial on the ">" sign to review all entered chords.',
      'Saving Your Song: Navigate to the WRITE TO 101 USER CHORD page (last page). Choose a save location (101–150), give your song a name, press ENTER, answer YES to confirm. The song is saved and ready to play.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'legacy-products-synthesizers',
  },
  {
    question: 'Can I still get song cards for my Kawai GB Session Trainer?',
    excerpt: 'Yes, Kawai GB Song Cards are still available. Compatible cards include GB201, GB203, GB204, GB205, GB211, GB213, GB216, and GB226 for GB2, GB4, and A15 Band Amp.',
    answer: [
      'Kawai GB Song Cards are available. Compatible cards include:',
      'GB201: Metal — Shy Boy, Intuition, Panama, and others. GB203: Casiopeia, Mid-Manhattan, Galactic Funk, and others. GB204: Eurobeat, Status Q, Soul Train, Synrock, and others. GB205: Basic Patterns (8 Beat, 16 Beat, Shuffle, Disco, Rap, Ballad, Samba, Bossa, Enka).',
      'GB211: Richie Blackmore (Highway Star, Black Night, Speed King). GB213: Jazz & Fusion (Red Clay, Sugar, Killer Joe). GB216: Yngwie Malmsteen (Too Young to Die, Trilogy Suite Op. 5). GB226: Rhythm & Blues (I Can\'t Turn You Loose, Sex Machine).',
      'Cards are compatible with GB2, GB4, and A15 Band Amp. Contact Kawai America at (310) 631-1771 ext. 322 to order.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'legacy-products-synthesizers',
  },
  {
    question: 'Where can I get information about Kawai bass guitars?',
    excerpt: 'Kawai bass guitars were sold in the US from 1985–2000. Models included the FIIB Series, RB865A, RB65A, and KRB Series. Contact Kawai America for additional information.',
    answer: [
      'Kawai bass guitars were sold in the US from late 1985 until 2000. Key models include:',
      'FIIB Series: Neck-through bass with active electronics. 5-piece laminated Maple/Mahogany neck, 22-fret Rosewood fingerboard, active Kawai P-Bass pickups with 9V battery pre-amps. Available in Black, Pearl White, Candy Apple Red, and wood combinations.',
      'RB865A: 5-string bolt-on neck, Ash body, Maple neck with 24-fret Rosewood fingerboard, gold Schaller 3-D5 bridge, Kawai J-Bass pickups with RAC-100 active circuit (±18dB bass, ±12dB treble).',
      'RB65A: 4-string version of RB865A with Schaller PJX pickups.',
      'KRB Series (1985–1990): Multiple models (KRB40, KRB55, KRB69, KRB105, KRB115, KRB120) with various pickup configurations and electronic options.',
      'For additional information, contact Kawai America by email through their website.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'legacy-products-synthesizers',
  },
  {
    question: 'How do I upgrade ROM or reset my Kawai keyboard? (Models A through K)',
    excerpt: 'ROM update versions and reset procedures for Kawai legacy keyboards from ACR-20 through KSP30. Includes GB4, K1, K3, K4, K5, K5000, K11, and others.',
    answer: [
      'ACR-20: No update (V1.0A). Reset: Hold NO + YES and power up. DRP-10: No update (V1.0B). Reset: Hold NO + YES and power up.',
      'FS Series: No update. Reset: Hold lowest C + E and power up. FS900: No update. Reset: Hold lowest C and power up.',
      'GMEGA: No update. GM Reset: Push > + EXIT. Factory Reset: Push SYSTEM until FACTORY RESET EXEC?=N/Y, answer YES twice.',
      'GB4: Update KP137C (V1.22). Reset: Hold VOCAL + GUITAR and power up.',
      'K1: Update P104E (V1.5). K1M: Update P105E (V1.5). K1r: Update P163A (V1.4). K1II: Update P193C (V1.3). K1rII: Update P205A (V1.1). No reset procedure for K1 series.',
      'K3: Update 5P36G/5P361. Reset: Turn memory protect OFF, hold lowest C + C# + D and power up. K3M: No update. Reset: Turn memory protect OFF, hold 1 + 2 + 3 and power up.',
      'K4: Update P206C (V1.4). K4r: Update P207C (V1.4). No reset. K5: Update P109H (V1.2). K5m: Update P020H (V1.2). No reset.',
      'K5000W/S/R: Disk update (V3.00). Reset: Insert system disk, hold F2 (W/S) or F8 (R) and power up.',
      'K11: No update. GM Reset: Push PFRM/COMP + SYSTEM. Factory Reset: Push SYSTEM until FACTORY RESET EXEC?=N/Y, answer YES twice.',
      'KC10: No update. Reset: Hold SYSTEM + 4 and power up. KC20: No update. Reset: Hold SYSTEM + EDIT + COMP and power up, then hit EXIT. KSP5/10/30: No update. Reset: Hold SYSTEM, then push DEMO.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'legacy-products-synthesizers',
  },
  {
    question: 'How do I upgrade ROM or reset my Kawai keyboard? (Models M through Z)',
    excerpt: 'ROM update versions and reset procedures for Kawai legacy keyboards from M8000 through Z1000, including MK10, MR series, MS, P260/P360, PH, PV, Q series, R50e, R100, WK, X, XD5, XS1, and Z1000.',
    answer: [
      'M8000: Updates P059B/P0559C. Reset: Turn memory protect OFF, hold 9 and power up.',
      'MK10: Update P061E. Reset: Hold lowest 2 black keys and power up. MK20: No update. Reset: Hold WRITE and power up.',
      'MR300: Updates MP035B/MP071A. MR380: Updates MP034B/MP071A. No reset procedure.',
      'MS Series: No update (V1.22). Reset: Hold lowest C + C# and power up.',
      'P260: Update P128B. P360: Update P127B. No reset.',
      'PH50: No update. Reset: Hold LEVEL + SYSTEM and power up. PHm: Update P197B. Reset: Hold LEVEL + SYSTEM and power up.',
      'PV10: Update P089C. PV30: Update P089C. No reset.',
      'Q55: Update MP080A. No reset. Q80: Update P130B. Reset: Hold SELECT and power up. Q80EX: Update KP058F. Reset: Hold SELECT and power up.',
      'R50e: Update P001E. Global reset: Hold ERASE and power up. Clear pattern/song: Hold ACCENT + ERASE, then ENTER twice.',
      'R100: Update 6P13E/6P14E. Global reset: Hold ERASE and power up. Clear: Hold lower half of COMMAND SELECT key #1 + ERASE, then ENTER twice.',
      'WK40/50: No update. Reset: Hold ERASE and power up. Erase recorder: Hold lowest C + E and power up. X Series: No update. Reset: Hold lowest C + E and power up.',
      'XD5: Update HP019B (V1.2). Reset: Hold SYSTEM + PREV and power up. XS1: No update. Reset: Hold SYSTEM + 4 and power up.',
      'Z1000: Disk update (V2.21). Reset: Insert system disk, hold POPS and power up.',
    ],
    groupSlug: 'tsd',
    categorySlug: 'legacy-products-synthesizers',
  },
]
