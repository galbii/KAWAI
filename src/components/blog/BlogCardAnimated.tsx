'use client'

import { motion } from 'framer-motion'
import { BlogCard } from './BlogCard'
import type { Post } from '@/payload-types'

interface BlogCardAnimatedProps {
  post: Post
  index: number
}

export function BlogCardAnimated({ post, index }: BlogCardAnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      <BlogCard post={post} className="h-full" />
    </motion.div>
  )
}
