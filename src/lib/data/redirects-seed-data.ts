// Source: kawaius_redirect_map.csv — WooCommerce /product/ → Shopify /products/ (50 entries)
// All redirects are site-relative paths on kawaius.com.
// Grand piano entries originally mapped to kawaipianos.com; overridden to kawaius.com per product team.

export type RedirectSeedEntry = {
  from: string
  toUrl: string
  notes: string
}

export const REDIRECTS_SEED_DATA: RedirectSeedEntry[] = [
  // ─── Digital ─────────────────────────────────────────────────────────────
  {
    from: '/product/ca901',
    toUrl: '/products/kawai-ca901-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/ca701',
    toUrl: '/products/kawai-ca701-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/kawai-ca501-digital-piano',
    toUrl: '/products/kawai-ca501-digital-piano',
    notes: '[Digital] Confirmed — Slug unchanged, path only (/product/ → /products/)',
  },
  {
    from: '/product/kawai-ca401-digital-piano',
    toUrl: '/products/kawai-ca401-digital-piano',
    notes: '[Digital] Confirmed — Slug unchanged, path only (/product/ → /products/)',
  },
  {
    from: '/product/cn301',
    toUrl: '/products/kawai-cn301-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/cn201',
    toUrl: '/products/kawai-cn201-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/mp11se',
    toUrl: '/products/kawai-mp11se-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/mp7se',
    toUrl: '/products/kawai-mp7se-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/dg30',
    toUrl: '/products/kawai-dg30-digital-grand-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/cx202',
    toUrl: '/products/kawai-cx202',
    notes: '[Digital] Inferred — Pattern match from cx102; verify against GSC',
  },
  {
    from: '/product/cx102',
    toUrl: '/products/kawai-cx-102',
    notes: '[Digital] Confirmed — Note: new slug has extra hyphen (kawai-cx-102)',
  },
  {
    from: '/product/es920',
    toUrl: '/products/kawai-es920-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/es120',
    toUrl: '/products/kawai-es120-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/es60',
    toUrl: '/products/kawai-es60-digital-piano',
    notes: '[Digital] Inferred — Pattern match; no direct WooCommerce product page found in search - verify in GSC',
  },
  {
    from: '/product/kdp120',
    toUrl: '/products/kawai-kdp120-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/kdp110',
    toUrl: '/products/kawai-kdp110-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/kdp75',
    toUrl: '/products/kawai-kdp75-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/kdp70',
    toUrl: '/products/kawai-kdp70-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },

  // ─── Upright ─────────────────────────────────────────────────────────────
  {
    from: '/product/ms134',
    toUrl: '/products/kawai-ms134',
    notes: '[Upright] Inferred — Pattern match; verify in GSC',
  },
  {
    from: '/product/ms130',
    toUrl: '/products/kawai-ms130',
    notes: '[Upright] Inferred — Pattern match; verify in GSC',
  },
  {
    from: '/product/ms123',
    toUrl: '/products/kawai-ms123',
    notes: '[Upright] Inferred — Pattern match; verify in GSC',
  },
  {
    from: '/product/kawai-k-500-limited-edition',
    toUrl: '/products/kawai-k-500-limited-edition-60th-anniversary',
    notes: '[Upright] Confirmed — Old slug missing "60th-anniversary" suffix',
  },
  {
    from: '/product/k-500',
    toUrl: '/products/kawai-k-500-upright-piano',
    notes: '[Upright] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/k-400',
    toUrl: '/products/kawai-k-400-upright-piano',
    notes: '[Upright] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/k-300',
    toUrl: '/products/kawai-k-300-upright-piano',
    notes: '[Upright] Inferred — Pattern match from k-500/k-400; verify in GSC',
  },
  {
    from: '/product/k-200',
    toUrl: '/products/kawai-k-200-upright-piano',
    notes: '[Upright] Inferred — Pattern match from k-500/k-400; verify in GSC',
  },
  {
    from: '/product/k-15',
    toUrl: '/products/kawai-k-15-upright-piano',
    notes: '[Upright] Inferred — Pattern match; verify in GSC',
  },
  {
    from: '/product/st-1',
    toUrl: '/products/kawai-st-1-upright-piano',
    notes: '[Upright] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/607',
    toUrl: '/products/kawai-607-designer-console-upright-piano',
    notes: '[Upright] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/508',
    toUrl: '/products/kawai-508-decorator-console-upright-piano',
    notes: '[Upright] Inferred — Pattern match from 607; verify in GSC',
  },
  {
    from: '/product/506n',
    toUrl: '/products/kawai-506n-institutional-upright-piano',
    notes: '[Upright] Confirmed — Old slug was just model code',
  },

  // ─── Hybrid ──────────────────────────────────────────────────────────────
  {
    from: '/product/gl-30-aures-2',
    toUrl: '/products/kawai-gl-30-aures-2-hybrid-piano',
    notes: '[Hybrid] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/nv12',
    toUrl: '/products/kawai-nv12',
    notes: '[Hybrid] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/nv6',
    toUrl: '/products/kawai-nv6',
    notes: '[Hybrid] Inferred — Pattern match from nv12; verify in GSC',
  },
  {
    from: '/product/k-300-aures-2',
    toUrl: '/products/kawai-k-300-aures-2-hybrid-piano',
    notes: '[Hybrid] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/k200-atx4',
    toUrl: '/products/kawai-k200-atx4-hybrid-piano',
    notes: '[Hybrid] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/gl10-atx4',
    toUrl: '/products/kawai-gl10-atx4-hybrid-piano',
    notes: '[Hybrid] Confirmed — Old slug was just model code',
  },

  // ─── Grand ───────────────────────────────────────────────────────────────
  {
    from: '/product/cr-45',
    toUrl: '/products/kawai-cr-45-crystal-grand-piano',
    notes: '[Grand] Inferred — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gx-7',
    toUrl: '/products/kawai-gx-7-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gx-6',
    toUrl: '/products/kawai-gx-6-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gx-5',
    toUrl: '/products/kawai-gx-5-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gx-3',
    toUrl: '/products/kawai-gx-3-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gx-2-limited-edition-60th-anniversary',
    toUrl: '/products/kawai-gx-2-limited-edition-60th-anniversary',
    notes: '[Grand] Inferred — Slug inferred; verify exact old slug in GSC. CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gx-2',
    toUrl: '/products/kawai-gx-2-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gx-1',
    toUrl: '/products/kawai-gx-1-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gl-50',
    toUrl: '/products/kawai-gl-50-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gl-40',
    toUrl: '/products/kawai-gl-40-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gl-30',
    toUrl: '/products/kawai-gl-30-classic-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gl-20',
    toUrl: '/products/kawai-gl-20-baby-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
  {
    from: '/product/gl-10',
    toUrl: '/products/kawai-gl-10-baby-grand-piano',
    notes: '[Grand] Confirmed — CSV had kawaipianos.com; redirecting to kawaius.com',
  },
]
