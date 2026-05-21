export interface DigitalSeries {
  id: string
  label: string
  seriesName: string
  description: string
  warrantyDuration: string
  warrantyNote?: string
  covered: string[]
  notCovered: string[]
  pdfUrl: string
}

export const digitalSeries: DigitalSeries[] = [
  {
    id: 'cn-ca-dg-nv',
    label: 'CN · CA · DG · NV',
    seriesName: 'CN, CA, DG & NV Series — Digital & Hybrid Pianos',
    description:
      "Covers the CN, CA, DG, and NV series — Kawai's flagship digital and hybrid piano instruments.",
    warrantyDuration: '5-Year Limited Warranty — parts and labor from original purchase date.',
    warrantyNote: 'Kawai will first attempt to perform service at the location of the instrument.',
    covered: [
      'Manufacturing defects in materials and workmanship',
      'Electronic components and circuit boards',
      'Action and key mechanism components',
      'Speaker and amplification systems',
      'Cabinet and structural components',
      'Power supply components',
    ],
    notCovered: [
      'Damage from accident, negligence, misuse, or improper installation',
      'Shipping damage (claims must be filed with the carrier)',
      'Repair or attempted repair by unauthorized parties',
      'Units with altered, defaced, or removed serial numbers',
      'Normal wear and tear or periodic maintenance',
      'Deterioration from perspiration, corrosion, extreme temperature, or humidity',
      'Power line surge, lightning damage, or acts of God',
      'RFI/EMI interference from improper grounding or uncertified equipment',
    ],
    pdfUrl:
      'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/WARRANTY%20CARD_CN,%20CA,%20DG,%20NV.pdf',
  },
  {
    id: 'cx-kdp-es',
    label: 'CX · KDP · ES',
    seriesName: 'CX, KDP & ES Series — Digital Pianos',
    description:
      "Covers the CX, KDP, and ES series — Kawai's versatile range of digital pianos from portable instruments to full-console models.",
    warrantyDuration: '3-Year Limited Warranty — parts and labor from original purchase date.',
    covered: [
      'Manufacturing defects in materials and workmanship',
      'Electronic components and circuit boards',
      'Key action and touch response mechanisms',
      'Speaker and audio output systems',
      'Power supply components',
    ],
    notCovered: [
      'Damage from accident, negligence, misuse, or improper installation',
      'Shipping damage (claims must be filed with the carrier)',
      'Repair or attempted repair by unauthorized parties',
      'Units with altered, defaced, or removed serial numbers',
      'Normal wear and tear or periodic maintenance',
      'Deterioration from perspiration, corrosion, extreme temperature, or humidity',
      'Power line surge, lightning damage, or acts of God',
      'RFI/EMI interference from improper grounding or uncertified equipment',
    ],
    pdfUrl:
      'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/WARRANTY%20CARD_CX,%20KDP,%20ES.pdf',
  },
  {
    id: 'mp-vpc',
    label: 'MP · VPC',
    seriesName: 'MP Stage Pianos & VPC',
    description:
      'Covers the MP Stage Piano and VPC Virtual Piano Controller series — purpose-built instruments for professional performance and studio use.',
    warrantyDuration:
      '1-Year Labor / 3-Year Parts Warranty — no charge for labor for 1 year; no charge for parts for 3 years from original purchase date.',
    covered: [
      'Manufacturing defects in materials and workmanship',
      'Electronic components and MIDI/audio circuitry',
      'Hammer action mechanism components',
      'Connectivity ports and interfaces',
      'Power supply components',
    ],
    notCovered: [
      'Damage from accident, negligence, misuse, or improper installation',
      'Shipping damage (claims must be filed with the carrier)',
      'Repair or attempted repair by unauthorized parties',
      'Units with altered, defaced, or removed serial numbers',
      'Normal wear and tear or periodic maintenance',
      'Deterioration from perspiration, corrosion, extreme temperature, or humidity',
      'Power line surge, lightning damage, or acts of God',
      'RFI/EMI interference from improper grounding or uncertified equipment',
    ],
    pdfUrl:
      'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/WARRANTY%20CARD_MP,%20VPC.pdf',
  },
]

// Map model prefix → series ID. Used for ?from=<model> deep links.
const modelPrefixToSeries: { prefix: RegExp; seriesId: string }[] = [
  { prefix: /^cn/i, seriesId: 'cn-ca-dg-nv' },
  { prefix: /^ca/i, seriesId: 'cn-ca-dg-nv' },
  { prefix: /^dg/i, seriesId: 'cn-ca-dg-nv' },
  { prefix: /^nv/i, seriesId: 'cn-ca-dg-nv' },
  { prefix: /^cx/i, seriesId: 'cx-kdp-es' },
  { prefix: /^kdp/i, seriesId: 'cx-kdp-es' },
  { prefix: /^es/i, seriesId: 'cx-kdp-es' },
  { prefix: /^mp/i, seriesId: 'mp-vpc' },
  { prefix: /^vpc/i, seriesId: 'mp-vpc' },
]

export function seriesIdForModel(model: string | undefined): string | undefined {
  if (!model) return undefined
  const cleaned = model.replace(/[\s-]/g, '')
  return modelPrefixToSeries.find((m) => m.prefix.test(cleaned))?.seriesId
}
