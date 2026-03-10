import { JobListingsPanel } from './JobListingsPanel'
import type { JobListingItem } from './JobListingsPanel'

export type { JobListingItem }

interface Props {
  jobs: JobListingItem[]
  title?: string
}

export function JobGrid({ jobs }: Props) {
  return <JobListingsPanel jobs={jobs} />
}
