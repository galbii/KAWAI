'use client'

import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { CopyButton } from './CopyButton'

interface CodeClientProps {
  code: string
  language?: string
}

export function CodeClient({ code, language = 'typescript' }: CodeClientProps) {
  if (!code) return null

  return (
    <Highlight code={code} language={language} theme={themes.vsDark}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <div className="relative rounded-lg overflow-hidden border border-gray-800">
          <pre className="bg-[#1e1e1e] p-4 overflow-x-auto text-sm leading-relaxed">
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ className: 'table-row', line })}>
                  <span className="table-cell select-none text-right pr-4 text-gray-500 w-8">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </pre>
          <CopyButton code={code} />
        </div>
      )}
    </Highlight>
  )
}
