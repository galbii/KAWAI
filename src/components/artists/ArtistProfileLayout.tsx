'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { cn } from '@/lib/utils'

interface ArtistProfileLayoutProps {
  sidebar: React.ReactNode
  main: React.ReactNode
  rightPanel: React.ReactNode
}

export function ArtistProfileLayout({ sidebar, main, rightPanel }: ArtistProfileLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-14"
    >
      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
        {sidebar}
        <main className="flex-1 min-w-0">
          {main}
        </main>
        {rightPanel}
      </div>
    </motion.div>
  )
}
