import { Metadata } from 'next'
import { BlogCard } from '@/components/blog/BlogCard'
import type { Post } from '@/payload-types'

// Use ISR (Incremental Static Regeneration) for better SEO and performance
// Pages are statically generated and revalidated every 5 minutes
export const revalidate = 300

interface BlogPageProps {
  searchParams: { category?: string }
}

// Generate metadata for blog index page
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'

  return {
    title: 'Blog | KAWAI Piano Gallery',
    description:
      'Explore our piano blog featuring education guides, product news, artist spotlights, maintenance tips, and more from KAWAI Piano Gallery.',
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    openGraph: {
      title: 'Blog | KAWAI Piano Gallery',
      description:
        'Explore our piano blog featuring education guides, product news, artist spotlights, maintenance tips, and more.',
      url: `${siteUrl}/blog`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | KAWAI Piano Gallery',
      description:
        'Explore our piano blog featuring education guides, product news, artist spotlights, and more.',
    },
  }
}

// Fetch published posts from Payload CMS
async function getPosts(category?: string): Promise<Post[]> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    const whereClause: any = {
      status: {
        equals: 'published',
      },
    }

    // Add category filter if provided
    if (category) {
      whereClause.categories = {
        contains: category,
      }
    }

    const posts = await payload.find({
      collection: 'posts',
      where: whereClause,
      limit: 50,
      sort: '-publishedDate',
      depth: 2, // Populate relationships
    })

    return posts.docs as Post[]
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// Blog index page component
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = searchParams
  const posts = await getPosts(category)

  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-kawai-charcoal mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover insights about pianos, music education, product updates, and
            expert advice from KAWAI Piano Gallery.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              No blog posts available at this time. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Category Filter Info (if active) */}
      {category && posts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <a
            href="/blog"
            className="inline-flex items-center text-kawai-red hover:underline"
          >
            ← View all posts
          </a>
        </div>
      )}
    </div>
  )
}
