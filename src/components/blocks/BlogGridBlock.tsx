import type { MarketingBlogGridBlock } from '@/payload-types'
import { BlogGridBlock as BlogGridBlockServer } from '@/blocks/marketing/BlogGridBlock'

export async function BlogGridBlock(props: MarketingBlogGridBlock) {
  return <BlogGridBlockServer {...props} />
}
