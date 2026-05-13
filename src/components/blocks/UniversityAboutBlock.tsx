import React from 'react'
import { UniversityAboutRenderer } from './university/UniversityAboutRenderer'

interface UniversityAboutBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversityAboutBlock(block: UniversityAboutBlockProps) {
  return <UniversityAboutRenderer block={block} />
}
