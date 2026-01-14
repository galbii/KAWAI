'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  code: string
}

export function CopyButton({ code }: CopyButtonProps) {
  const [text, setText] = useState('Copy')

  function updateCopyStatus() {
    if (text === 'Copy') {
      setText('Copied!')
      setTimeout(() => {
        setText('Copy')
      }, 2000)
    }
  }

  return (
    <div className="absolute top-2 right-2">
      <Button
        size="sm"
        variant="secondary"
        className="text-xs px-3 py-1 h-auto"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          updateCopyStatus()
        }}
      >
        {text}
      </Button>
    </div>
  )
}
