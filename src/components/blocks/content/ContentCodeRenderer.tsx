import React from 'react'
import type { ContentCodeBlock } from '@/payload-types'
import { CodeClient } from '@/components/blocks/Code/CodeClient'

interface ContentCodeRendererProps extends ContentCodeBlock {}

export function ContentCodeRenderer({ language = 'typescript', code }: ContentCodeRendererProps) {
  return (
    <div className="my-8 not-prose">
      <CodeClient code={code} language={language} />
    </div>
  )
}
