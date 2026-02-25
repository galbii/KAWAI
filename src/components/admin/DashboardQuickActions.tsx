const c = {
  card: '#1C1C26', line: '#252535', high: '#ECECF2', jade: '#2EC4A0',
}

const ACTIONS = [
  { label: '+ New Product',    href: '/admin/collections/products/create',    accent: undefined },
  { label: '+ New Post',       href: '/admin/collections/posts/create',        accent: undefined },
  { label: '+ New Storefront', href: '/admin/collections/storefronts/create',  accent: undefined },
  { label: 'Upload Media',     href: '/admin/collections/media/create',         accent: c.jade },
]

export function DashboardQuickActions() {
  return (
    <div style={{
      padding: '0 var(--gutter-h)',
      marginBottom: 8,
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap' as const,
    }}>
      <style>{`
        .kawai-action:hover { opacity: 0.85; }
      `}</style>
      {ACTIONS.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className="kawai-action"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 38,
            padding: '0 16px',
            background: c.card,
            border: `1px solid ${c.line}`,
            borderRadius: 8,
            color: action.accent ?? c.high,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'opacity 0.15s',
            whiteSpace: 'nowrap' as const,
          }}
        >
          {action.label}
        </a>
      ))}
    </div>
  )
}
