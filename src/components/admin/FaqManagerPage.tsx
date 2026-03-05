// Server Component — no 'use client'
// Wraps FaqManagerView in Payload's DefaultTemplate so that the
// .template-default CSS class is applied and the CustomNav sidebar renders.
import type { ServerProps, VisibleEntities } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { FaqManagerView } from './FaqManagerView'

// Payload passes AdminViewServerProps to custom view components.
// That type extends ServerProps and includes initPageResult (with visibleEntities).
type Props = ServerProps & {
  initPageResult: { visibleEntities: VisibleEntities }
}

export function FaqManagerPage({ initPageResult, ...serverProps }: Props) {
  return (
    <DefaultTemplate
      {...serverProps}
      visibleEntities={initPageResult.visibleEntities}
    >
      <FaqManagerView />
    </DefaultTemplate>
  )
}
