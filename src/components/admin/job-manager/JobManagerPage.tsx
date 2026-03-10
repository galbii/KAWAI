// Server Component — no 'use client'
// Wraps JobManagerView in Payload's DefaultTemplate so that the
// .template-default CSS class is applied and the CustomNav sidebar renders.
import type { ServerProps, VisibleEntities } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { JobManagerView } from './JobManagerView'

// Payload passes AdminViewServerProps to custom view components.
// That type extends ServerProps and includes initPageResult (with visibleEntities).
type Props = ServerProps & {
  initPageResult: { visibleEntities: VisibleEntities }
}

export function JobManagerPage({ initPageResult, ...serverProps }: Props) {
  return (
    <DefaultTemplate
      {...serverProps}
      visibleEntities={initPageResult.visibleEntities}
    >
      <JobManagerView />
    </DefaultTemplate>
  )
}
