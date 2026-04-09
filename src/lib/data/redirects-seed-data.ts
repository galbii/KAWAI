// Source: kawaius_master_redirects_FINAL.csv (291 entries)
// Merged with original WooCommerce redirect map (50 entries).
// All redirects are site-relative paths on kawaius.com.
// Grand piano entries originally mapped to kawaipianos.com; overridden to kawaius.com per product team.
// Note: /product/f-351 uses /pianos/accessories (Accessories) — overrides /pianos/grand (Grand Discontinued).

export type RedirectSeedEntry = {
  from: string
  toUrl: string
  notes: string
}

export const REDIRECTS_SEED_DATA: RedirectSeedEntry[] = [
  // ─── Digital — Current Products ──────────────────────────────────────────
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
    from: '/product/ca401',
    toUrl: '/products/kawai-ca401-digital-piano',
    notes: '[Digital] Confirmed — Duplicate slug; same destination as /product/kawai-ca401-digital-piano/',
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
    from: '/product/es520',
    toUrl: '/products/kawai-es520-digital-piano',
    notes: '[Digital] Confirmed — Added from GSC export; active product',
  },
  {
    from: '/product/es120',
    toUrl: '/products/kawai-es120-digital-piano',
    notes: '[Digital] Confirmed — Old slug was just model code',
  },
  {
    from: '/product/es60',
    toUrl: '/products/kawai-es60-digital-piano',
    notes: '[Digital] Inferred — Pattern match; verify in GSC',
  },
  {
    from: '/product/kawai-es60',
    toUrl: '/products/kawai-es60-digital-piano',
    notes: '[Digital] Confirmed — Alt slug; same destination as /product/es60/',
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

  // ─── Digital — Legacy (redirect to series pages) ─────────────────────────
  {
    from: '/product/ca67',
    toUrl: '/pianos/ca-series',
    notes: '[Digital/Legacy] Legacy CA series; redirect to CA series collection page',
  },
  {
    from: '/product/ca78',
    toUrl: '/pianos/ca-series',
    notes: '[Digital/Legacy] Legacy; redirect to CA series',
  },
  {
    from: '/product/ca97',
    toUrl: '/pianos/ca-series',
    notes: '[Digital/Legacy] Legacy; redirect to CA series',
  },
  {
    from: '/product/ce220',
    toUrl: '/pianos/digital',
    notes: '[Digital/Legacy] Very old legacy; redirect to digital pianos',
  },
  {
    from: '/product/cl26',
    toUrl: '/pianos/digital',
    notes: '[Digital/Legacy] Very old legacy',
  },
  {
    from: '/product/cn27',
    toUrl: '/pianos/cn-series',
    notes: '[Digital/Legacy] Legacy CN; redirect to CN series page',
  },
  {
    from: '/product/cn29',
    toUrl: '/pianos/cn-series',
    notes: '[Digital/Legacy] Legacy CN',
  },
  {
    from: '/product/cn37',
    toUrl: '/pianos/cn-series',
    notes: '[Digital/Legacy] Legacy CN',
  },
  {
    from: '/product/cp1',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[Digital/Legacy] Legacy stage piano; redirect to MP stage pianos page',
  },
  {
    from: '/product/cp2',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[Digital/Legacy] Legacy stage piano',
  },
  {
    from: '/product/cp3',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[Digital/Legacy] Legacy stage piano',
  },
  {
    from: '/product/es8',
    toUrl: '/pianos/es-series',
    notes: '[Digital/Legacy] Legacy ES portable',
  },
  {
    from: '/product/kcp90',
    toUrl: '/pianos/digital',
    notes: '[Digital/Legacy] Very old legacy KCP series',
  },
  {
    from: '/product/klcs',
    toUrl: '/pianos/institutional',
    notes: '[Digital/Legacy] Classroom system; redirect to institutional page',
  },
  {
    from: '/product/mp11',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[Digital/Legacy] Legacy predecessor to MP11SE',
  },
  {
    from: '/product/mp7',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[Digital/Legacy] Legacy predecessor to MP7SE',
  },
  {
    from: '/product/mp8',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[Digital/Legacy] Legacy stage piano',
  },

  // ─── Digital — Discontinued ───────────────────────────────────────────────
  {
    from: '/product/ca48',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/ca49',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/ca58',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/ca59',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/ca65',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/ca79',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/ca95',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/ca98',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/ca99',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/kawai-ca59-digital-piano',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — Alt slug; GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cn23',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cn25',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cn270',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cn33',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cn34',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cn35',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cn39',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cs10',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cs4',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/cs7',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/es1',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/es100',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/es3',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/es4',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/es6',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/es7',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/kdp90',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/mp10',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/mp5',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/mp6',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/mp9000',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/mp9500',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/vpc1',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/x120',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },
  {
    from: '/product/z1000',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/digital',
  },

  // ─── Upright — Current Products ──────────────────────────────────────────
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
    from: '/product/ms-130',
    toUrl: '/products/kawai-ms130',
    notes: '[Upright] Confirmed — Alt slug with hyphen; same destination as ms130',
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

  // ─── Upright — Discontinued ───────────────────────────────────────────────
  {
    from: '/product/k-2',
    toUrl: '/pianos/upright',
    notes: '[Upright/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/upright',
  },
  {
    from: '/product/k-3',
    toUrl: '/pianos/upright',
    notes: '[Upright/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/upright',
  },
  {
    from: '/product/k-5',
    toUrl: '/pianos/upright',
    notes: '[Upright/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/upright',
  },
  {
    from: '/product/k-6',
    toUrl: '/pianos/upright',
    notes: '[Upright/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/upright',
  },
  {
    from: '/product/k-8',
    toUrl: '/pianos/upright',
    notes: '[Upright/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/upright',
  },
  {
    from: '/product/k-800',
    toUrl: '/pianos/upright',
    notes: '[Upright/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/upright',
  },
  {
    from: '/product/mav8',
    toUrl: '/pianos/upright',
    notes: '[Upright/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/upright',
  },
  {
    from: '/product/ust-9',
    toUrl: '/pianos/upright',
    notes: '[Upright/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/upright',
  },

  // ─── Hybrid — Current Products ────────────────────────────────────────────
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
  {
    from: '/product/k-500-aures',
    toUrl: '/products/kawai-k-500-aures-hybrid-piano',
    notes: '[Hybrid] Confirmed — Active product',
  },
  {
    from: '/product/k300-atx2',
    toUrl: '/products/kawai-k300-atx2-hybrid-piano',
    notes: '[Hybrid] Inferred — Verify slug on Shopify',
  },
  {
    from: '/product/k300-aures',
    toUrl: '/products/kawai-k300-aures-hybrid-piano',
    notes: '[Hybrid] Confirmed — Active product',
  },
  {
    from: '/product/novus-nv10',
    toUrl: '/products/kawai-novus-nv10-hybrid-piano',
    notes: '[Hybrid] Updated — Specific product page confirmed in Payload',
  },
  {
    from: '/product/novus-nv10s',
    toUrl: '/products/kawai-novus-nv10s-hybrid-piano',
    notes: '[Hybrid] Updated — Specific product page confirmed in Payload',
  },
  {
    from: '/product/novus-nv5',
    toUrl: '/products/kawai-novus-nv5-hybrid-piano',
    notes: '[Hybrid] Confirmed — Active product',
  },
  {
    from: '/product/novus-nv5s',
    toUrl: '/products/kawai-novus-nv5s-hybrid-piano',
    notes: '[Hybrid] Inferred — Verify NV5S slug on Shopify',
  },

  // ─── Hybrid — Legacy ─────────────────────────────────────────────────────
  {
    from: '/product/cs11',
    toUrl: '/pianos/novus-series',
    notes: '[Hybrid/Legacy] Legacy hybrid; redirect to closest series page',
  },
  {
    from: '/product/cs8',
    toUrl: '/pianos/novus-series',
    notes: '[Hybrid/Legacy] Legacy hybrid',
  },
  {
    from: '/product/gl30-atx2',
    toUrl: '/pianos/anytime-pianos',
    notes: '[Hybrid/Legacy] Legacy ATX2 Anytime Piano',
  },

  // ─── Grand — Current Products ─────────────────────────────────────────────
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
  {
    from: '/product/sk-2',
    toUrl: '/products/kawai-sk-2-shigeru-grand-piano',
    notes: '[Grand] Inferred — Verify slug on Shopify',
  },
  {
    from: '/product/sk-3',
    toUrl: '/products/kawai-sk-3-shigeru-grand-piano',
    notes: '[Grand] Inferred — Verify slug on Shopify',
  },
  {
    from: '/product/sk-5',
    toUrl: '/products/kawai-sk-5-shigeru-grand-piano',
    notes: '[Grand] Inferred — Verify slug on Shopify',
  },
  {
    from: '/product/sk-7',
    toUrl: '/products/kawai-sk-7-shigeru-grand-piano',
    notes: '[Grand] Inferred — Verify slug on Shopify',
  },

  // ─── Grand — Legacy ───────────────────────────────────────────────────────
  {
    from: '/product/cr-40',
    toUrl: '/pianos/crystal-grand-piano',
    notes: '[Grand/Legacy] Legacy crystal grand; redirect to crystal grand page',
  },
  {
    from: '/product/gm-11',
    toUrl: '/pianos/grand',
    notes: '[Grand/Legacy] Legacy grand; redirect to grand pianos page',
  },
  {
    from: '/product/kawai-ex',
    toUrl: '/pianos/shigeru-kawai/sk-ex',
    notes: '[Grand/Legacy] Concert grand; redirect to SK-EX page as closest match',
  },
  {
    from: '/product/kawai-kawai-gx-2-limited-edition',
    toUrl: '/products/kawai-gx-2-limited-edition-60th-anniversary',
    notes: '[Grand/Legacy] Inferred — Malformed double-kawai slug; redirect to correct GX-2 LE product page',
  },

  // ─── Grand — Discontinued ─────────────────────────────────────────────────
  {
    from: '/product/907',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/ge-30',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/gm-10k',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/gm-12',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/gm10',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/rx-1',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/rx-2',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/rx-3',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/rx-5',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/rx-6',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },
  {
    from: '/product/rx-7',
    toUrl: '/pianos/grand',
    notes: '[Grand/Discontinued] Confirmed — GSC 404 export; discontinued → /pianos/grand',
  },

  // ─── Accessories ──────────────────────────────────────────────────────────
  // Note: /product/f-351 uses /pianos/accessories (overrides the Grand Discontinued → /pianos/grand mapping)
  {
    from: '/product/f-10h',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Foot pedal; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/f-302',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Triple pedal bar; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/f-350',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Triple pedal bar; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/f-351',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Triple pedal bar; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/gfp-3',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Grand Feel Triple Pedal; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/hm-5',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Designer Stand; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/hml-1',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Designer Stand; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/hml-2',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Stand; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/hml-3',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Designer Stand; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/sc-1',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Soft Case; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/sc-2',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Soft Carry Case; corrected from /pianos/grand to /pianos/accessories',
  },
  {
    from: '/product/sh-9',
    toUrl: '/pianos/accessories',
    notes: '[Accessories] Confirmed — Headphone; corrected from /pianos/grand to /pianos/accessories',
  },

  // ─── Collections (WooCommerce product-category) ───────────────────────────
  {
    from: '/product-category/upright-pianos/anytime-pianos',
    toUrl: '/pianos/anytime-pianos',
    notes: '[Collection] Confirmed — WooCommerce category → Shopify page',
  },

  // ─── Artists ──────────────────────────────────────────────────────────────
  {
    from: '/artists/acoustic-piano',
    toUrl: '/artists',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/alina-uddin',
    toUrl: '/artists/alina-uddin',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/aysedeniz-gokcin',
    toUrl: '/artists/aysedeniz-gokcin',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/dan-haerle',
    toUrl: '/artists/dan-haerle',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/danny-guerrero',
    toUrl: '/artists/danny-guerrero',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/david-arnay',
    toUrl: '/artists/david-arnay',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/joe-yamada',
    toUrl: '/artists/joe-yamada',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/joey-lieber',
    toUrl: '/artists/joey-lieber',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/john-paul-kaplan',
    toUrl: '/artists/john-paul-kaplan',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/junko-ueno-garrett',
    toUrl: '/artists/junko-ueno-garrett',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/mike-jones',
    toUrl: '/artists/mike-jones',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/neil-sedaka',
    toUrl: '/artists/neil-sedaka',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/nichole-nordeman',
    toUrl: '/artists/nichole-nordeman',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/phil-thompson',
    toUrl: '/artists/phil-thompson',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/tim-glemser',
    toUrl: '/artists/tim-glemser',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/yuko-maruyama',
    toUrl: '/artists/yuko-maruyama',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/craig-morris',
    toUrl: '/artists/craig-morris',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/david-witham',
    toUrl: '/artists/david-witham',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/isha-love',
    toUrl: '/artists/isha-love',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/jason-d-williams',
    toUrl: '/artists/jason-d-williams',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/jon-carin',
    toUrl: '/artists/jon-carin',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/joshua-levy',
    toUrl: '/artists/joshua-levy',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/marty-grebb',
    toUrl: '/artists/marty-grebb',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/muse',
    toUrl: '/artists/muse',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/onerepublic',
    toUrl: '/artists/onerepublic',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/scars-on-45',
    toUrl: '/artists/scars-on-45',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/stephen-large',
    toUrl: '/artists/stephen-large',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/steve-nieve',
    toUrl: '/artists/steve-nieve',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/piano/steven-curtis-chapman',
    toUrl: '/artists/steven-curtis-chapman',
    notes: '[Artists] Confirmed — Old site nested under /artists/[type]/; new site uses /artists/slug',
  },

  // ─── CMS Pages — Top-level ───────────────────────────────────────────────
  {
    from: '/acoustic-pianos',
    toUrl: '/pianos/grand',
    notes: '[CMS] Confirmed — GSC 404 export; top-level → /pianos/grand',
  },
  {
    from: '/archive-2010',
    toUrl: '/',
    notes: '[CMS] Inferred — Very old; redirect to homepage',
  },
  {
    from: '/ccpa',
    toUrl: '/about',
    notes: '[CMS] Inferred — No CCPA page in sitemap; redirect to /about',
  },
  {
    from: '/contact-us',
    toUrl: '/contact',
    notes: '[CMS] Confirmed — Updated: new site has /contact page',
  },
  {
    from: '/dealer_locator',
    toUrl: '/find-a-dealer',
    notes: '[CMS] Confirmed — Old static URL → /find-a-dealer',
  },
  {
    from: '/digital',
    toUrl: '/pianos/digital',
    notes: '[CMS] Confirmed — Very old nav; redirect to /pianos/digital',
  },
  {
    from: '/digital-pianos',
    toUrl: '/pianos/digital',
    notes: '[CMS] Confirmed — GSC 404 export; top-level → /pianos/digital',
  },
  {
    from: '/faqs',
    toUrl: '/faq',
    notes: '[CMS] Confirmed — New site uses /faq (singular)',
  },
  {
    from: '/grand',
    toUrl: '/pianos/grand',
    notes: '[CMS] Confirmed — Very old nav; redirect to /pianos/grand',
  },
  {
    from: '/hybrid',
    toUrl: '/pianos/hybrid',
    notes: '[CMS] Confirmed — Very old nav; redirect to /pianos/hybrid',
  },
  {
    from: '/institutions',
    toUrl: '/pianos/institutional',
    notes: '[CMS] Confirmed — Redirect to institutional page in sitemap',
  },
  {
    from: '/kawai_artists',
    toUrl: '/artists',
    notes: '[CMS] Confirmed — Old WP URL; redirect to /artists',
  },
  {
    from: '/main_links',
    toUrl: '/pianos',
    notes: '[CMS] Inferred — Old nav root → /pianos',
  },
  {
    from: '/modules-sequencers-drum-machines-amps-owners-manual',
    toUrl: '/faq',
    notes: '[CMS] Inferred — Old legacy page; redirect to /faq',
  },
  {
    from: '/namm-2025',
    toUrl: '/namm-2026',
    notes: '[CMS] Confirmed — GSC 404 export; previous NAMM page → current /namm-2026',
  },
  {
    from: '/privacy-policy',
    toUrl: '/about',
    notes: '[CMS] Inferred — Not in sitemap; redirect to /about',
  },
  {
    from: '/shigeru-kawai',
    toUrl: '/pianos/shigeru-kawai',
    notes: '[CMS] Confirmed — GSC 404 export; top-level → /pianos/shigeru-kawai',
  },
  {
    from: '/shigeru-kawai/sk-ex',
    toUrl: '/pianos/shigeru-kawai/sk-ex',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/shop',
    toUrl: '/pianos',
    notes: '[CMS] Confirmed — GSC 404 export; old shop → /pianos',
  },
  {
    from: '/upright',
    toUrl: '/pianos/upright',
    notes: '[CMS] Confirmed — Very old nav; redirect to /pianos/upright',
  },

  // ─── CMS Pages — Blog / Category ─────────────────────────────────────────
  {
    from: '/category/blog',
    toUrl: '/blog',
    notes: '[CMS] Confirmed — WP blog category → /blog',
  },
  {
    from: '/category/company',
    toUrl: '/company',
    notes: '[CMS] Confirmed — WP category → /company',
  },
  {
    from: '/category/company/awards',
    toUrl: '/company/awards',
    notes: '[CMS] Confirmed — WP subcategory → /company/awards',
  },
  {
    from: '/category/company/shigeru-kawai',
    toUrl: '/pianos/shigeru-kawai',
    notes: '[CMS] Confirmed — WP category → Shigeru Kawai page',
  },
  {
    from: '/category/institutions',
    toUrl: '/pianos/institutional',
    notes: '[CMS] Confirmed — WP category → institutional page',
  },
  {
    from: '/category/news',
    toUrl: '/news',
    notes: '[CMS] Confirmed — WP news category → /news',
  },
  {
    from: '/category/pianos',
    toUrl: '/pianos',
    notes: '[CMS] Confirmed — WP pianos category → /pianos',
  },
  {
    from: '/category/pianos/digital-pianos',
    toUrl: '/pianos/digital',
    notes: '[CMS] Confirmed — WP subcategory → /pianos/digital',
  },
  {
    from: '/category/pianos/grand-pianos',
    toUrl: '/pianos/grand',
    notes: '[CMS] Confirmed — WP subcategory → /pianos/grand',
  },
  {
    from: '/category/pianos/hybrid',
    toUrl: '/pianos/hybrid',
    notes: '[CMS] Confirmed — WP subcategory → /pianos/hybrid',
  },
  {
    from: '/category/pianos/upright-pianos',
    toUrl: '/pianos/upright',
    notes: '[CMS] Confirmed — WP subcategory → /pianos/upright',
  },
  {
    from: '/category/technical-support-division',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — WP category → TSD page',
  },
  {
    from: '/category/technical-support-division/faq',
    toUrl: '/faq',
    notes: '[CMS] Confirmed — WP subcategory → /faq',
  },
  {
    from: '/category/technology',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — WP category → /technology',
  },

  // ─── CMS Pages — Company ─────────────────────────────────────────────────
  {
    from: '/company/hirotaka-kawai',
    toUrl: '/about',
    notes: '[CMS] Inferred — Not in sitemap; redirect to /about',
  },
  {
    from: '/company/kawai-heritage',
    toUrl: '/about',
    notes: '[CMS] Inferred — Not in sitemap; redirect to /about',
  },
  {
    from: '/company/kentaro-kawai',
    toUrl: '/about',
    notes: '[CMS] Inferred — Not in sitemap; redirect to /about',
  },
  {
    from: '/company/ryuyo-grand-piano-factory',
    toUrl: '/about',
    notes: '[CMS] Inferred — Not in sitemap; redirect to /about',
  },
  {
    from: '/company/shigeru-kawai',
    toUrl: '/pianos/shigeru-kawai',
    notes: '[CMS] Confirmed — Redirect to Shigeru Kawai pianos page',
  },
  {
    from: '/company/timeline',
    toUrl: '/about',
    notes: '[CMS] Inferred — Not in sitemap; redirect to /about',
  },

  // ─── CMS Pages — Digital legacy sections ─────────────────────────────────
  {
    from: '/digital/ca',
    toUrl: '/pianos/ca-series',
    notes: '[CMS] Confirmed — Old static CA landing → CA series page',
  },
  {
    from: '/digital/ca/om',
    toUrl: '/faq',
    notes: '[CMS] Inferred — Old owner manuals dir → /faq',
  },
  {
    from: '/digital/cn',
    toUrl: '/pianos/cn-series',
    notes: '[CMS] Confirmed — Old static CN landing → CN series',
  },
  {
    from: '/digital/cnx7',
    toUrl: '/pianos/cn-series',
    notes: '[CMS] Confirmed — Old CNX7 series → CN series',
  },
  {
    from: '/digital/cp',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[CMS] Inferred — Old CP stage piano → MP stage pianos',
  },
  {
    from: '/digital/cs',
    toUrl: '/pianos/novus-series',
    notes: '[CMS] Inferred — Old CS hybrid → Novus series as closest match',
  },
  {
    from: '/digital/cs/brochure',
    toUrl: '/faq',
    notes: '[CMS] Inferred — Old brochure dir → /faq',
  },
  {
    from: '/digital/cs/om',
    toUrl: '/faq',
    notes: '[CMS] Inferred — Old owner manual dir → /faq',
  },
  {
    from: '/digital/features',
    toUrl: '/pianos/digital',
    notes: '[CMS] Inferred — Old features section → /pianos/digital',
  },
  {
    from: '/digital/klcs',
    toUrl: '/pianos/institutional',
    notes: '[CMS] Confirmed — Old KLCS classroom system → institutional',
  },
  {
    from: '/digital/mp',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[CMS] Confirmed — Old MP landing → MP stage pianos',
  },
  {
    from: '/digital/other',
    toUrl: '/pianos/digital',
    notes: '[CMS] Inferred — Old "other digitals" → /pianos/digital',
  },
  {
    from: '/digital/portable',
    toUrl: '/pianos/es-series',
    notes: '[CMS] Confirmed — Old portable landing → ES series',
  },
  {
    from: '/digital/portable/es110',
    toUrl: '/pianos/es-series',
    notes: '[CMS] Confirmed — Old ES110 static page → ES series',
  },
  {
    from: '/digital/vpc1',
    toUrl: '/pianos/digital',
    notes: '[CMS] Inferred — Old VPC1 static page → /pianos/digital',
  },

  // ─── CMS Pages — Find a Dealer ────────────────────────────────────────────
  {
    from: '/find-a-dealer/acoustic-digital',
    toUrl: '/find-a-dealer',
    notes: '[CMS] Confirmed — Sub-page; redirect to parent',
  },
  {
    from: '/find-a-dealer/professional-product-dealer',
    toUrl: '/find-a-dealer',
    notes: '[CMS] Confirmed — Sub-page; redirect to parent',
  },

  // ─── CMS Pages — Guides ──────────────────────────────────────────────────
  {
    from: '/guides/acoustic-piano',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/digital-care',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/digital-piano',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/first-piano',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/home-setup',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/professional',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; sub-page → /guides',
  },

  // ─── CMS Pages — Hybrid legacy sections ───────────────────────────────────
  {
    from: '/hybrid/nv10',
    toUrl: '/pianos/novus-series',
    notes: '[CMS] Confirmed — Old NV10 static page → Novus series',
  },

  // ─── CMS Pages — Institutions ─────────────────────────────────────────────
  {
    from: '/institutions/epic-program/conservatoire-de-musique',
    toUrl: '/institutions/epic-program',
    notes: '[CMS] Confirmed — Deep sub-page → EPIC program parent',
  },

  // ─── CMS Pages — Learn ────────────────────────────────────────────────────
  {
    from: '/learn/acoustic-vs-digital',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; /learn/ section → /guides',
  },
  {
    from: '/learn/heritage',
    toUrl: '/company',
    notes: '[CMS] Confirmed — GSC 404 export; /learn/ section → /company',
  },
  {
    from: '/learn/kawai-innovation',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; /learn/ section → /technology',
  },
  {
    from: '/learn/kawai-story',
    toUrl: '/company',
    notes: '[CMS] Confirmed — GSC 404 export; /learn/ section → /company',
  },
  {
    from: '/learn/millennium-action',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; /learn/ section → /technology',
  },
  {
    from: '/learn/piano-basics',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; /learn/ section → /guides',
  },
  {
    from: '/learn/piano-types',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — GSC 404 export; /learn/ section → /guides',
  },

  // ─── CMS Pages — Main Links (legacy nav) ─────────────────────────────────
  {
    from: '/main_links/about_us',
    toUrl: '/about',
    notes: '[CMS] Confirmed — Old legacy about_us → /about',
  },
  {
    from: '/main_links/d-owners',
    toUrl: '/distinguished-owners',
    notes: '[CMS] Confirmed — Old legacy d-owners → /distinguished-owners',
  },
  {
    from: '/main_links/epic',
    toUrl: '/institutions/epic-program',
    notes: '[CMS] Confirmed — Old legacy epic → /institutions/epic-program',
  },
  {
    from: '/main_links/epic/testimonial_video',
    toUrl: '/institutions/testimonial-videos',
    notes: '[CMS] Confirmed — Old testimonial video dir → testimonial-videos page',
  },
  {
    from: '/main_links/grands_09',
    toUrl: '/pianos/grand',
    notes: '[CMS] Confirmed — 2009 era grand pianos page → /pianos/grand',
  },
  {
    from: '/main_links/institutional',
    toUrl: '/pianos/institutional',
    notes: '[CMS] Confirmed — Old institutional nav → institutional page',
  },
  {
    from: '/main_links/why_kawai',
    toUrl: '/about',
    notes: '[CMS] Confirmed — Old why_kawai section → /about',
  },

  // ─── CMS Pages — Pianos (legacy sub-paths) ────────────────────────────────
  {
    from: '/pianos/acoustic-vs-digital-pianos',
    toUrl: '/guides',
    notes: '[CMS] Confirmed — Redirect to /guides page',
  },
  {
    from: '/pianos/digital-pianos',
    toUrl: '/pianos/digital',
    notes: '[CMS] Confirmed — Redirect to /pianos/digital',
  },
  {
    from: '/pianos/digital-pianos/alfred-lessons',
    toUrl: '/pianos/digital',
    notes: '[CMS] Inferred — Sub-page; redirect to /pianos/digital',
  },
  {
    from: '/pianos/digital-pianos/bluetooth',
    toUrl: '/pianos/digital',
    notes: '[CMS] Inferred — Sub-page; redirect to /pianos/digital',
  },
  {
    from: '/pianos/digital-pianos/ca-series',
    toUrl: '/pianos/ca-series',
    notes: '[CMS] Confirmed — Redirect to CA series page',
  },
  {
    from: '/pianos/digital-pianos/ce-kdp-kcp-cl-digitals',
    toUrl: '/pianos/kdp-series',
    notes: '[CMS] Inferred — Redirect to KDP series as closest match',
  },
  {
    from: '/pianos/digital-pianos/cn-series',
    toUrl: '/pianos/cn-series',
    notes: '[CMS] Confirmed — Redirect to CN series page',
  },
  {
    from: '/pianos/digital-pianos/concert-magic',
    toUrl: '/faq/what-is-the-concert-magic-function',
    notes: '[CMS] Confirmed — FAQ entry exists',
  },
  {
    from: '/pianos/digital-pianos/mp-series',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[CMS] Confirmed — Redirect to MP stage pianos page',
  },
  {
    from: '/pianos/don-mannino-golden-hammer',
    toUrl: '/about',
    notes: '[CMS] Inferred — Old promo page; redirect to /about',
  },
  {
    from: '/pianos/grand-pianos',
    toUrl: '/pianos/grand',
    notes: '[CMS] Confirmed — Redirect to /pianos/grand',
  },
  {
    from: '/pianos/grand-pianos/gl-series',
    toUrl: '/pianos/gl-series',
    notes: '[CMS] Confirmed — Exact series page exists',
  },
  {
    from: '/pianos/grand-pianos/gx-blak-series',
    toUrl: '/pianos/gx-series',
    notes: '[CMS] Confirmed — Redirect to GX series page',
  },
  {
    from: '/pianos/grand-pianos/gx-series',
    toUrl: '/pianos/gx-series',
    notes: '[CMS] Confirmed — Exact match',
  },
  {
    from: '/pianos/upright-pianos',
    toUrl: '/pianos/upright',
    notes: '[CMS] Confirmed — Redirect to /pianos/upright',
  },

  // ─── CMS Pages — Support ─────────────────────────────────────────────────
  {
    from: '/support',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export; support (renamed)',
  },
  {
    from: '/support/crating-guidelines',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/es120-midi-specs',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/firmware',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/kb',
    toUrl: '/faq',
    notes: '[CMS] Confirmed — GSC 404 export; knowledge base → /faq',
  },
  {
    from: '/support/manuals',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/service-bulletins',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/tech-notes',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/technical',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/technical-guides',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/technotes',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — GSC 404 export; alt spelling',
  },
  {
    from: '/support/warranty',
    toUrl: '/warranty',
    notes: '[CMS] Confirmed — GSC 404 export',
  },
  {
    from: '/support/warranty-repairs',
    toUrl: '/warranty',
    notes: '[CMS] Confirmed — GSC 404 export',
  },

  // ─── CMS Pages — Technical Support Division ──────────────────────────────
  {
    from: '/technical-support-division/contact-us',
    toUrl: '/contact',
    notes: '[CMS] Confirmed — GSC 404 export; TSD contact sub-page → /contact',
  },
  {
    from: '/technical-support-division/software-os',
    toUrl: '/technical-support-division',
    notes: '[CMS] Confirmed — Sub-page; redirect to TSD parent',
  },
  {
    from: '/technical-support-division/warranty-repairs',
    toUrl: '/warranty',
    notes: '[CMS] Confirmed — GSC 404 export; TSD sub-page → /warranty',
  },

  // ─── CMS Pages — Technology ──────────────────────────────────────────────
  {
    from: '/technology/abs-carbon',
    toUrl: '/technology/abs',
    notes: '[CMS] Confirmed — GSC 404 export; ABS Carbon variant → /technology/abs',
  },
  {
    from: '/technology/abs/the-critics',
    toUrl: '/technology/abs',
    notes: '[CMS] Confirmed — Sub-page; redirect to ABS parent',
  },
  {
    from: '/technology/abs/the-evidence-1',
    toUrl: '/technology/abs',
    notes: '[CMS] Confirmed — Sub-page',
  },
  {
    from: '/technology/abs/the-evidence-2',
    toUrl: '/technology/abs',
    notes: '[CMS] Confirmed — Sub-page',
  },
  {
    from: '/technology/abs/the-evidence-3',
    toUrl: '/technology/abs',
    notes: '[CMS] Confirmed — Sub-page',
  },
  {
    from: '/technology/abs/the-solution',
    toUrl: '/technology/abs',
    notes: '[CMS] Confirmed — Sub-page',
  },
  {
    from: '/technology/abs/the-symptoms',
    toUrl: '/technology/abs',
    notes: '[CMS] Confirmed — Sub-page',
  },
  {
    from: '/technology/abs/the-truth',
    toUrl: '/technology/abs',
    notes: '[CMS] Confirmed — Sub-page',
  },
  {
    from: '/technology/grand-feel-iii',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; Grand Feel III → /technology',
  },
  {
    from: '/technology/millennium-iii',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; Millennium III → /technology',
  },
  {
    from: '/technology/phi',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; PHI → /technology',
  },
  {
    from: '/technology/shs',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; SHS → /technology',
  },
  {
    from: '/technology/sk-ex-rendering',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; SK-EX Rendering → /technology',
  },
  {
    from: '/technology/soundboard-speaker-',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; truncated URL → /technology',
  },
  {
    from: '/technology/wooden-',
    toUrl: '/technology',
    notes: '[CMS] Confirmed — GSC 404 export; truncated URL → /technology',
  },

  // ─── Blog / News (/news/ → /blog/) ───────────────────────────────────────
  {
    from: '/news/11-finalists-chose-shigeru-kawai-at-the-2025-chopin-competition-heres-why',
    toUrl: '/blog/11-finalists-chose-shigeru-kawai-at-the-2025-chopin-competition-heres-why',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/an-interview-with-vladimir-petrov-the-runner-up-of-the-nashville-international-chopin-piano-competition-on-a-shigeru-kawai',
    toUrl: '/blog/an-interview-with-vladimir-petrov-the-runner-up-of-the-nashville-international-chopin-piano-competition-on-a-shigeru-kawai',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/best-digital-piano-under-500-kawais-premium-sound-quality-at-budget-prices',
    toUrl: '/blog/best-digital-piano-under-500-kawais-premium-sound-quality-at-budget-prices',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/dallas-x-kawai-university-of-texas-showroom-event',
    toUrl: '/blog/dallas-x-kawai-university-of-texas-showroom-event',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/free-delivery-at-kawai-denver-colorados-official-storefront',
    toUrl: '/blog/free-delivery-at-kawai-denver-colorados-official-storefront',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/hando-nakhur-kawai-dallas-christmas-concert-december-7th-2025',
    toUrl: '/blog/hando-nakhur-kawai-dallas-christmas-concert-december-7th-2025',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/interview-with-vincent-ong-5th-prize-winner-of-19th-international-chopin-piano-competition',
    toUrl: '/blog/interview-with-vincent-ong-5th-prize-winner-of-19th-international-chopin-piano-competition',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/introducing-the-kawai-master-series-upright-pianos',
    toUrl: '/blog/introducing-the-kawai-master-series-upright-pianos',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/jose-iturbi-competition',
    toUrl: '/blog/jose-iturbi-competition',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-60th-anniversary',
    toUrl: '/blog/kawai-60th-anniversary',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-announces-namm-2026-artist-performances',
    toUrl: '/blog/kawai-announces-namm-2026-artist-performances',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/kawai-at-namm-2026-exclusive-event-giveaways-at-this-years-booth',
    toUrl: '/blog/kawai-at-namm-2026-exclusive-event-giveaways-at-this-years-booth',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/kawai-cn201-cn301-digital-pianos',
    toUrl: '/blog/kawai-cn201-cn301-digital-pianos',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-dg30-digital-piano-launch',
    toUrl: '/blog/kawai-dg30-digital-piano-launch',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-es-120-digital-piano',
    toUrl: '/blog/kawai-es-120-digital-piano',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-mp-series-pro-digital-keyboard-line',
    toUrl: '/blog/kawai-mp-series-pro-digital-keyboard-line',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-pianos-partners-with-musicians-institute-to-empower-the-next-generation-of-contemporary-musicians',
    toUrl: '/blog/kawai-pianos-partners-with-musicians-institute-to-empower-the-next-generation-of-contemporary-musicians',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/kawai-x-roli-official-collaboration',
    toUrl: '/blog/kawai-x-roli-official-collaboration',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/meet-guangbin-wang-the-blind-pianist-who-chose-shigeru-kawai-to-win-the-2025-nashville-international-chopin-piano-competition',
    toUrl: '/blog/meet-guangbin-wang-the-blind-pianist-who-chose-shigeru-kawai-to-win-the-2025-nashville-international-chopin-piano-competition',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/namm-2026-recap-kawais-booth-features-american-idol-winner-rising-artists',
    toUrl: '/blog/namm-2026-recap-kawais-booth-features-american-idol-winner-rising-artists',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/namm-show-2023',
    toUrl: '/blog/namm-show-2023',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/piotr-alexewicz-5th-prize-audience-prize-winner-at-the-19th-international-chopin-piano-competition',
    toUrl: '/blog/piotr-alexewicz-5th-prize-audience-prize-winner-at-the-19th-international-chopin-piano-competition',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/shigeru-kawai-julien-cohen-bohemian-rhapsody-flashmob',
    toUrl: '/blog/shigeru-kawai-julien-cohen-bohemian-rhapsody-flashmob',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/shigeru-kawai-sk-ex-shines-at-thomas-f-hulbert-international-piano-competition-2025',
    toUrl: '/blog/shigeru-kawai-sk-ex-shines-at-thomas-f-hulbert-international-piano-competition-2025',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
  {
    from: '/news/shigeru-kawai-sk-ex-takes-1st-and-2nd-at-the-6th-takamatsu-international-piano-competition',
    toUrl: '/blog/shigeru-kawai-sk-ex-takes-1st-and-2nd-at-the-6th-takamatsu-international-piano-competition',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/takanori-aoki',
    toUrl: '/blog/takanori-aoki',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/the-piano-that-gave-3-finalists-an-edge-at-the-2025-chopin-competition',
    toUrl: '/blog/the-piano-that-gave-3-finalists-an-edge-at-the-2025-chopin-competition',
    notes: '[Blog] Confirmed — GSC export; /news/ → /blog/',
  },
  {
    from: '/news/zitong-wang-international-chopin-piano-competition-winner',
    toUrl: '/blog/zitong-wang-international-chopin-piano-competition-winner',
    notes: '[Blog] Inferred — Map to /blog/slug; verify post exists or redirect to /blog',
  },
]
