import type { MarketingBlogLatestBlock } from '@/payload-types'
import { BlogLatestBlock as BlogLatestBlockServer } from '@/blocks/marketing/BlogLatestBlock'

export async function BlogLatestBlock(props: MarketingBlogLatestBlock) {
  return <BlogLatestBlockServer {...props} />
}
