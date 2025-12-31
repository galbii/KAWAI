import type { Post } from '@/payload-types'

interface ArticleSidebarProps {
  post: Post
  className?: string
}

export function ArticleSidebar({ post, className = '' }: ArticleSidebarProps) {
  return (
    <aside
      className={`hidden lg:block w-80 ml-12 ${className}`}
      aria-label="Article sidebar"
    >
      <div className="sticky top-24 space-y-8">
        {/* Placeholder for future sidebar components */}

        {/* Table of Contents - Coming in Phase 3 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-kawai-charcoal uppercase tracking-wider mb-4">
            In This Article
          </h3>
          <p className="text-sm text-gray-500 italic">
            Table of contents will appear here
          </p>
        </div>

        {/* Share Card - Coming in Phase 3 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-kawai-charcoal uppercase tracking-wider mb-4">
            Share This Article
          </h3>
          <p className="text-sm text-gray-500 italic">
            Share buttons will appear here
          </p>
        </div>

        {/* Newsletter Signup - Coming in Phase 3 */}
        <div className="bg-gradient-to-br from-kawai-pearl to-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-kawai-charcoal uppercase tracking-wider mb-2">
            Stay Inspired
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Get piano insights delivered to your inbox
          </p>
          <p className="text-xs text-gray-500 italic">
            Newsletter form coming in Phase 3
          </p>
        </div>

        {/* Related Posts - Coming in Phase 3 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-kawai-charcoal uppercase tracking-wider mb-4">
            Related Posts
          </h3>
          <p className="text-sm text-gray-500 italic">
            Related posts will appear here
          </p>
        </div>
      </div>
    </aside>
  )
}
