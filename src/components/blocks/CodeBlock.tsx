import React from 'react'
import { CodeClient } from './Code/CodeClient'

export interface CodeBlockProps {
  code: string
  language?: string
  blockType: 'code'
  className?: string
}

export function CodeBlock({ className, code, language = 'typescript' }: CodeBlockProps) {
  return (
    <div className={[className, 'not-prose my-6'].filter(Boolean).join(' ')}>
      <CodeClient code={code} language={language} />
    </div>
  )
}
