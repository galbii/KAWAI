/**
 * Canada-specific consumer rebate overrides (ca.kawaius.com).
 * Keyed by model number exactly as stored in the CMS.
 * Models not listed here fall back to the CMS consumerRebate value.
 */
export const CANADA_REBATES: Record<string, number> = {
  CN201:  150,
  CN301:  200,
  CA401:  200,
  CA501:  250,
  CA701:  350,
  CA901:  500,
  'DG-30': 500,
  ES60:    40,
  ES120:   60,
  ES920:  125,
  CX102:  100,
  CX202:  125,
  MP7SE:  175,
  MP11SE: 225,
  VPC1:   200,
}

export function getConsumerRebate(model: string, isCanada: boolean, usdRebate: number): number {
  if (!isCanada) return usdRebate
  return CANADA_REBATES[model] ?? usdRebate
}
