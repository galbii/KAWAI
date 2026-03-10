import 'server-only'
import { getPayloadClient } from '@/lib/payload/queries'

const c = {
  bg: '#08080C', panel: '#0F0F16', surface: '#141420', card: '#191926',
  line: '#1C1C2C', lineStr: '#252535', high: '#ECECF2', mid: '#8484A0', lo: '#4C4C68',
  violet: '#6366F1', jade: '#2EC4A0', rose: '#F16C6C', gold: '#E8A84E', red: '#C41E3A',
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  const s = status ?? 'draft'
  const color = s === 'active' ? c.jade : s === 'discontinued' ? c.rose : c.gold
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20,
      background: `${color}18`, color, fontSize: 12, fontWeight: 600,
      letterSpacing: '0.04em', textTransform: 'capitalize',
    }}>
      {s}
    </span>
  )
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  <  7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Stat card icons ────────────────────────────────────────────────────────
const IcoPiano = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="2.5" y="11" width="21" height="12" rx="2" stroke={c.mid} strokeWidth="1.8" />
    <rect x="6" y="7.5" width="2.5" height="8" rx="0.8" fill={c.mid} />
    <rect x="11" y="7.5" width="2.5" height="8" rx="0.8" fill={c.mid} />
    <rect x="16" y="7.5" width="2.5" height="8" rx="0.8" fill={c.mid} />
    <line x1="2.5" y1="15" x2="23.5" y2="15" stroke={c.mid} strokeWidth="1.2" />
  </svg>
)
const IcoStore = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="2.5" y="13" width="21" height="11" rx="1.5" stroke={c.mid} strokeWidth="1.8" />
    <path d="M1 13L4.5 4H21.5L25 13" stroke={c.mid} strokeWidth="1.8" strokeLinejoin="round" />
    <rect x="9" y="17" width="8" height="7" rx="1" stroke={c.mid} strokeWidth="1.8" />
  </svg>
)
const IcoDoc = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="4" y="2.5" width="18" height="21" rx="2" stroke={c.mid} strokeWidth="1.8" />
    <line x1="8.5" y1="9"  x2="17.5" y2="9"  stroke={c.mid} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="8.5" y1="13" x2="17.5" y2="13" stroke={c.mid} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="8.5" y1="17" x2="13.5" y2="17" stroke={c.mid} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
const IcoImg = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="2.5" y="5" width="21" height="16" rx="2" stroke={c.mid} strokeWidth="1.8" />
    <circle cx="9" cy="10.5" r="2" fill={c.mid} />
    <path d="M2.5 18L9 11.5L14 16L17.5 13L23.5 18" stroke={c.mid} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const IcoBriefcase = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="3" y="9" width="20" height="14" rx="2" stroke={c.mid} strokeWidth="1.8"/>
    <path d="M9 9V7C9 5.343 10.343 4 12 4H14C15.657 4 17 5.343 17 7V9" stroke={c.mid} strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="3" y1="15" x2="23" y2="15" stroke={c.mid} strokeWidth="1.2"/>
  </svg>
)
const IcoApps = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="20" height="20" rx="2" stroke={c.mid} strokeWidth="1.8"/>
    <line x1="3" y1="10" x2="23" y2="10" stroke={c.mid} strokeWidth="1.2"/>
    <line x1="9" y1="10" x2="9" y2="23" stroke={c.mid} strokeWidth="1.2"/>
    <circle cx="6" cy="6.5" r="1.2" fill={c.mid}/>
    <circle cx="10.5" cy="6.5" r="1.2" fill={c.mid}/>
  </svg>
)

const STATS = [
  { label: 'Products',     icon: <IcoPiano />,     href: '/admin/collections/products',      key: 0 },
  { label: 'Storefronts',  icon: <IcoStore />,     href: '/admin/collections/storefronts',   key: 1 },
  { label: 'Posts',        icon: <IcoDoc />,       href: '/admin/collections/posts',         key: 2 },
  { label: 'Media',        icon: <IcoImg />,       href: '/admin/collections/media',         key: 3 },
  { label: 'Open Jobs',    icon: <IcoBriefcase />, href: '/admin/job-manager',               key: 4 },
  { label: 'Applications', icon: <IcoApps />,      href: '/admin/collections/job-applications', key: 5 },
]

export async function DashboardStats() {
  const payload = await getPayloadClient()

  const [products, storefronts, posts, media, openJobs, applications, recentProducts] = await Promise.all([
    payload.count({ collection: 'products' }),
    payload.count({ collection: 'storefronts' }),
    payload.count({ collection: 'posts' }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'jobs', where: { status: { equals: 'open' } } }),
    payload.count({ collection: 'job-applications' }),
    payload.find({
      collection: 'products',
      sort: '-updatedAt',
      limit: 6,
      depth: 0,
      select: { model: true, name: true, status: true, type: true, updatedAt: true },
    }),
  ])

  const counts = [
    products.totalDocs,
    storefronts.totalDocs,
    posts.totalDocs,
    media.totalDocs,
    openJobs.totalDocs,
    applications.totalDocs,
  ]

  return (
    <div style={{ padding: '28px var(--gutter-h) 0' }}>
      <style>{`
        .kw-stat { text-decoration: none; }
        .kw-stat:hover { border-color: ${c.violet} !important; transform: translateY(-1px); }
        .kw-stat { transition: border-color 0.15s, transform 0.15s; }
        .kw-row { text-decoration: none; display: grid; }
        .kw-row:hover { background: ${c.card} !important; }
      `}</style>

      {/* ── Stats Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
        marginBottom: 20,
      }}>
        {STATS.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="kw-stat"
            style={{
              background: c.card,
              border: `1px solid ${c.lineStr}`,
              borderRadius: 14,
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {stat.icon}
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: c.lo, marginBottom: 6,
              }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: c.high, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {counts[stat.key]?.toLocaleString() ?? '—'}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* ── Recent Products Table ── */}
      <div style={{
        background: c.panel,
        border: `1px solid ${c.lineStr}`,
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 28,
      }}>
        {/* Table header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 26px 16px',
          borderBottom: `1px solid ${c.line}`,
        }}>
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: c.lo,
          }}>
            Recently Updated Products
          </span>
          <a href="/admin/collections/products" style={{ fontSize: 13, color: c.violet, textDecoration: 'none', fontWeight: 500 }}>
            View all →
          </a>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '130px 1fr 100px 100px 110px',
          gap: 8, padding: '10px 26px 8px',
          borderBottom: `1px solid ${c.line}`,
        }}>
          {['Model', 'Name', 'Status', 'Type', 'Updated'].map(col => (
            <span key={col} style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: c.lo,
            }}>
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        {recentProducts.docs.length === 0 && (
          <div style={{ color: c.lo, fontSize: 14, padding: '20px 26px' }}>No products yet.</div>
        )}
        {recentProducts.docs.map((product) => (
          <a
            key={product.id}
            href={`/admin/collections/products/${product.id}`}
            className="kw-row"
            style={{
              gridTemplateColumns: '130px 1fr 100px 100px 110px',
              gap: 8, padding: '13px 26px',
              borderBottom: `1px solid ${c.line}`,
              transition: 'background 0.1s',
              background: 'transparent',
            }}
          >
            <span style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 13,
              color: c.high, fontWeight: 600,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {(product.model as string | undefined) ?? '—'}
            </span>
            <span style={{
              fontSize: 13.5, color: c.mid,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {(product.name as string | undefined) ?? '—'}
            </span>
            <span>
              <StatusBadge status={product.status as string | undefined} />
            </span>
            <span style={{ fontSize: 13, color: c.mid, textTransform: 'capitalize' }}>
              {(product.type as string | undefined) ?? '—'}
            </span>
            <span style={{ fontSize: 12.5, color: c.lo }}>
              {product.updatedAt ? formatRelativeTime(product.updatedAt as string) : '—'}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
