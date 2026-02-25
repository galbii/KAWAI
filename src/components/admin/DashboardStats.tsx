import 'server-only'
import { getPayloadClient } from '@/lib/payload/queries'

const c = {
  bg: '#0C0C0F', panel: '#111116', surface: '#16161E', card: '#1C1C26',
  line: '#252535', lineSub: '#1C1C28', high: '#ECECF2', mid: '#8484A0', lo: '#4C4C68',
  violet: '#6366F1', jade: '#2EC4A0', rose: '#F16C6C', gold: '#E8A84E',
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  const s = status ?? 'draft'
  const color = s === 'active' ? c.jade : s === 'discontinued' ? c.rose : c.gold
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 20,
      background: `${color}1A`, color, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.03em', textTransform: 'capitalize',
    }}>
      {s}
    </span>
  )
}

function formatRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Inline SVG icons
const IconPiano = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="2" y="5" width="18" height="12" rx="2" stroke={c.mid} strokeWidth="1.5" />
    <rect x="5" y="5" width="1.5" height="7" fill={c.mid} />
    <rect x="8.5" y="5" width="1.5" height="7" fill={c.mid} />
    <rect x="12" y="5" width="1.5" height="7" fill={c.mid} />
    <rect x="15.5" y="5" width="1.5" height="7" fill={c.mid} />
  </svg>
)

const IconStore = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="3" y="10" width="16" height="9" rx="1" stroke={c.mid} strokeWidth="1.5" />
    <path d="M1 10 L4 4 H18 L21 10" stroke={c.mid} strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="8" y="14" width="6" height="5" rx="1" stroke={c.mid} strokeWidth="1.5" />
  </svg>
)

const IconDoc = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="4" y="2" width="14" height="18" rx="2" stroke={c.mid} strokeWidth="1.5" />
    <line x1="7" y1="8" x2="15" y2="8" stroke={c.mid} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="12" x2="15" y2="12" stroke={c.mid} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="16" x2="11" y2="16" stroke={c.mid} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconImage = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="18" height="14" rx="2" stroke={c.mid} strokeWidth="1.5" />
    <circle cx="7.5" cy="9" r="1.5" fill={c.mid} />
    <path d="M2 15 L7 10 L11 14 L14 11 L20 17" stroke={c.mid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const stats = [
  { label: 'Products', icon: <IconPiano />, href: '/admin/collections/products', collection: 'products' as const },
  { label: 'Storefronts', icon: <IconStore />, href: '/admin/collections/storefronts', collection: 'storefronts' as const },
  { label: 'Posts', icon: <IconDoc />, href: '/admin/collections/posts', collection: 'posts' as const },
  { label: 'Media', icon: <IconImage />, href: '/admin/collections/media', collection: 'media' as const },
]

export async function DashboardStats() {
  const payload = await getPayloadClient()

  const [products, storefronts, posts, media, recentProducts] = await Promise.all([
    payload.count({ collection: 'products' }),
    payload.count({ collection: 'storefronts' }),
    payload.count({ collection: 'posts' }),
    payload.count({ collection: 'media' }),
    payload.find({
      collection: 'products',
      sort: '-updatedAt',
      limit: 5,
      depth: 0,
      select: { model: true, name: true, status: true, type: true, updatedAt: true },
    }),
  ])

  const counts = [products.totalDocs, storefronts.totalDocs, posts.totalDocs, media.totalDocs]

  return (
    <div style={{ padding: '24px var(--gutter-h) 0' }}>
      <style>{`
        .kawai-stat { text-decoration: none; display: flex; flex-direction: column; gap: 14px; }
        .kawai-stat:hover { border-color: ${c.violet} !important; }
        .kawai-recent-row { text-decoration: none; display: grid; align-items: center; }
        .kawai-recent-row:hover { background: ${c.card} !important; }
      `}</style>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
        marginBottom: 16,
      }}>
        {stats.map((stat, i) => (
          <a
            key={stat.label}
            href={stat.href}
            className="kawai-stat"
            style={{
              background: c.card,
              border: `1px solid ${c.line}`,
              borderRadius: 12,
              padding: '18px 20px',
              transition: 'border-color 0.15s',
            }}
          >
            {stat.icon}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.mid, marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: c.high, lineHeight: 1 }}>
                {counts[i]?.toLocaleString() ?? '—'}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Recent Products */}
      <div style={{
        background: c.panel,
        border: `1px solid ${c.line}`,
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.mid }}>
            Recently Updated
          </span>
          <a href="/admin/collections/products" style={{ fontSize: 12, color: c.violet, textDecoration: 'none', fontWeight: 500 }}>
            View all →
          </a>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 90px 90px 100px',
          gap: 8,
          padding: '0 0 10px',
          borderBottom: `1px solid ${c.lineSub}`,
          marginBottom: 6,
        }}>
          {['Model', 'Name', 'Status', 'Type', 'Updated'].map(col => (
            <span key={col} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.lo }}>
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        {recentProducts.docs.length === 0 && (
          <div style={{ color: c.lo, fontSize: 13, padding: '12px 0' }}>No products yet.</div>
        )}
        {recentProducts.docs.map((product) => (
          <a
            key={product.id}
            href={`/admin/collections/products/${product.id}`}
            className="kawai-recent-row"
            style={{
              gridTemplateColumns: '120px 1fr 90px 90px 100px',
              gap: 8,
              padding: '9px 8px',
              borderRadius: 7,
              marginLeft: -8,
              marginRight: -8,
              transition: 'background 0.12s',
            }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: c.high, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(product.model as string | undefined) ?? '—'}
            </span>
            <span style={{ fontSize: 13, color: c.mid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(product.name as string | undefined) ?? '—'}
            </span>
            <span><StatusBadge status={product.status as string | undefined} /></span>
            <span style={{ fontSize: 12, color: c.mid, textTransform: 'capitalize' }}>
              {(product.type as string | undefined) ?? '—'}
            </span>
            <span style={{ fontSize: 12, color: c.lo }}>
              {product.updatedAt ? formatRelativeTime(product.updatedAt as string) : '—'}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
