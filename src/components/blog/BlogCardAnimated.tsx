'use client'

import { motion } from 'framer-motion'
import { BlogCard } from './BlogCard'
import type { Post } from '@/payload-types'

interface BlogCardAnimatedProps {
  post: Post
  // Position within the current load wave (0-based). -1 = already visible, skip animation.
  waveIndex: number
}

export function BlogCardAnimated({ post, waveIndex }: BlogCardAnimatedProps) {
  const shouldAnimate = waveIndex >= 0

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 14, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        shouldAnimate
          ? { duration: 0.6, delay: waveIndex * 0.06, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0 }
      }
      className="h-full"
    >
      <BlogCard post={post} className="h-full" />
    </motion.div>
  )
}
