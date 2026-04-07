import type { MarketingRebateTableBlock } from '@/payload-types'
import { RebateSchedule } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'
import type { RebateSeries } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'

export function RebateTableRenderer(props: MarketingRebateTableBlock) {
  const { eyebrow, heading, deadline, schedule: rawSchedule } = props

  const schedule: RebateSeries[] = (rawSchedule ?? []).map((series) => ({
    seriesName: series.seriesName,
    models: (series.models ?? []).map((m) => ({
      model: m.model,
      finishes: m.finishes ?? '',
      consumerRebate: m.consumerRebate,
    })),
  }))

  if (schedule.length === 0) return null

  return (
    <RebateSchedule
      schedule={schedule}
      eyebrow={eyebrow ?? undefined}
      heading={heading ?? undefined}
      deadline={deadline ?? undefined}
    />
  )
}
