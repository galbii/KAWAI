const c = {
  card: '#191926', line: '#1C1C2C', lineStr: '#252535',
  high: '#ECECF2', mid: '#8484A0', jade: '#2EC4A0', violet: '#6366F1',
}

const ACTIONS = [
  { label: '+ New Product',    href: '/admin/collections/products/create',   color: c.violet },
  { label: '+ New Post',       href: '/admin/collections/posts/create',       color: undefined },
  { label: '+ New Storefront', href: '/admin/collections/storefronts/create', color: undefined },
  { label: 'Upload Media',     href: '/admin/collections/media/create',       color: c.jade },
]

export function DashboardQuickActions() {
  return (
    <div style={{
      padding: '0 var(--gutter-h)',
      marginBottom: 10,
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap' as const,
    }}>
      <style>{`
        .kw-action:hover { opacity: 0.8; transform: translateY(-1px); }
        .kw-action { transition: opacity 0.15s, transform 0.15s; }
      `}</style>
      {ACTIONS.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className="kw-action"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 42,
            padding: '0 20px',
            background: c.card,
            border: `1px solid ${c.lineStr}`,
            borderRadius: 10,
            color: action.color ?? c.high,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
            whiteSpace: 'nowrap' as const,
          }}
        >
          {action.label}
        </a>
      ))}
    </div>
  )
}
