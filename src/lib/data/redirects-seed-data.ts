// Source: kawaius-redirect-map.csv (comprehensive product redirect map)
// Merged with legacy WooCommerce redirect map and GSC 404 export.
// All redirects are site-relative paths on kawaius.com.
// Trailing-slash variants are intentionally excluded — middleware normalizes them before matching.
// Note: /product/f-351 uses /accessories — overrides /pianos/grand mapping.

export type RedirectSeedEntry = {
  from: string
  toUrl: string
  notes: string
}

export const REDIRECTS_SEED_DATA: RedirectSeedEntry[] = [
  // ─── Shigeru Kawai ────────────────────────────────────────────────────────
  // SK-EX — flagship concert grand
  {
    from: '/product/sk-ex',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] SK-EX flagship concert grand',
  },
  {
    from: '/products/sk-ex',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] SK-EX — /products/ prefix variant',
  },
  {
    from: '/products/kawai-sk-ex',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] SK-EX — full slug /products/ variant',
  },
  {
    from: '/products/kawai-sk-ex-concert-grand-piano',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] SK-EX — long-form slug variant',
  },
  {
    from: '/products/kawai-shigeru-sk-ex',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] SK-EX — shigeru-prefixed slug variant',
  },
  {
    from: '/products/kawai-shigeru-sk-ex-concert-grand-piano',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] SK-EX — long-form shigeru-prefixed variant',
  },
  {
    from: '/product/shigeru-sk-ex',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] SK-EX — shigeru-prefixed /product/ variant',
  },
  // Legacy "Kawai EX" name → SK-EX
  {
    from: '/product/kawai-ex',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] Legacy "Kawai EX" concert grand name maps to SK-EX',
  },
  {
    from: '/products/kawai-ex',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] Legacy "Kawai EX" — /products/ prefix variant',
  },
  {
    from: '/product/kawai-ex-concert-grand-piano',
    toUrl: '/shigeru/models/sk-ex',
    notes: '[Shigeru] Legacy "Kawai EX" — long-form slug variant',
  },
  // SK-2
  {
    from: '/product/sk-2',
    toUrl: '/shigeru/models/sk-2',
    notes: '[Shigeru] SK-2 salon grand 5\'11"',
  },
  {
    from: '/products/sk-2',
    toUrl: '/shigeru/models/sk-2',
    notes: '[Shigeru] SK-2 — /products/ prefix variant',
  },
  {
    from: '/products/kawai-sk-2',
    toUrl: '/shigeru/models/sk-2',
    notes: '[Shigeru] SK-2 — full slug /products/ variant',
  },
  // SK-3
  {
    from: '/product/sk-3',
    toUrl: '/shigeru/models/sk-3',
    notes: '[Shigeru] SK-3 conservatory grand 6\'2"',
  },
  {
    from: '/products/sk-3',
    toUrl: '/shigeru/models/sk-3',
    notes: '[Shigeru] SK-3 — /products/ prefix variant',
  },
  {
    from: '/products/kawai-sk-3',
    toUrl: '/shigeru/models/sk-3',
    notes: '[Shigeru] SK-3 — full slug /products/ variant',
  },
  // SK-5
  {
    from: '/product/sk-5',
    toUrl: '/shigeru/models/sk-5',
    notes: '[Shigeru] SK-5 chamber grand 6\'7"',
  },
  {
    from: '/products/sk-5',
    toUrl: '/shigeru/models/sk-5',
    notes: '[Shigeru] SK-5 — /products/ prefix variant',
  },
  {
    from: '/products/kawai-sk-5',
    toUrl: '/shigeru/models/sk-5',
    notes: '[Shigeru] SK-5 — full slug /products/ variant',
  },
  // SK-6
  {
    from: '/product/sk-6',
    toUrl: '/shigeru/models/sk-6',
    notes: '[Shigeru] SK-6 orchestra grand 7\'0"',
  },
  {
    from: '/products/sk-6',
    toUrl: '/shigeru/models/sk-6',
    notes: '[Shigeru] SK-6 — /products/ prefix variant',
  },
  {
    from: '/products/kawai-sk-6',
    toUrl: '/shigeru/models/sk-6',
    notes: '[Shigeru] SK-6 — full slug /products/ variant',
  },
  // SK-7
  {
    from: '/product/sk-7',
    toUrl: '/shigeru/models/sk-7',
    notes: '[Shigeru] SK-7 semi-concert grand 7\'6"',
  },
  {
    from: '/products/sk-7',
    toUrl: '/shigeru/models/sk-7',
    notes: '[Shigeru] SK-7 — /products/ prefix variant',
  },
  {
    from: '/products/kawai-sk-7',
    toUrl: '/shigeru/models/sk-7',
    notes: '[Shigeru] SK-7 — full slug /products/ variant',
  },

  // ─── Digital — CA Series ──────────────────────────────────────────────────
  {
    from: '/product/ca401',
    toUrl: '/products/kawai-ca401-digital-piano',
    notes: '[Digital/CA] CA401 current model',
  },
  {
    from: '/products/ca401',
    toUrl: '/products/kawai-ca401-digital-piano',
    notes: '[Digital/CA] CA401 — /products/ prefix variant',
  },
  {
    from: '/product/kawai-ca401-digital-piano',
    toUrl: '/products/kawai-ca401-digital-piano',
    notes: '[Digital/CA] CA401 — full slug /product/ path change only',
  },
  {
    from: '/product/ca48',
    toUrl: '/products/kawai-ca48-digital-piano',
    notes: '[Digital/CA] CA48 legacy model',
  },
  {
    from: '/products/ca48',
    toUrl: '/products/kawai-ca48-digital-piano',
    notes: '[Digital/CA] CA48 — /products/ prefix variant',
  },
  {
    from: '/product/ca501',
    toUrl: '/products/kawai-ca501-digital-piano',
    notes: '[Digital/CA] CA501 current model',
  },
  {
    from: '/products/ca501',
    toUrl: '/products/kawai-ca501-digital-piano',
    notes: '[Digital/CA] CA501 — /products/ prefix variant',
  },
  {
    from: '/product/kawai-ca501-digital-piano',
    toUrl: '/products/kawai-ca501-digital-piano',
    notes: '[Digital/CA] CA501 — full slug /product/ path change only',
  },
  {
    from: '/product/ca58',
    toUrl: '/products/kawai-ca58-digital-piano',
    notes: '[Digital/CA] CA58 legacy model',
  },
  {
    from: '/products/ca58',
    toUrl: '/products/kawai-ca58-digital-piano',
    notes: '[Digital/CA] CA58 — /products/ prefix variant',
  },
  {
    from: '/product/ca65',
    toUrl: '/products/kawai-ca65-digital-piano',
    notes: '[Digital/CA] CA65 legacy model',
  },
  {
    from: '/products/ca65',
    toUrl: '/products/kawai-ca65-digital-piano',
    notes: '[Digital/CA] CA65 — /products/ prefix variant',
  },
  {
    from: '/product/ca67',
    toUrl: '/products/kawai-ca67-digital-piano',
    notes: '[Digital/CA] CA67 legacy model',
  },
  {
    from: '/products/ca67',
    toUrl: '/products/kawai-ca67-digital-piano',
    notes: '[Digital/CA] CA67 — /products/ prefix variant',
  },
  {
    from: '/product/ca701',
    toUrl: '/products/kawai-ca701-digital-piano',
    notes: '[Digital/CA] CA701 current flagship-tier model',
  },
  {
    from: '/products/ca701',
    toUrl: '/products/kawai-ca701-digital-piano',
    notes: '[Digital/CA] CA701 — /products/ prefix variant',
  },
  {
    from: '/product/ca78',
    toUrl: '/products/kawai-ca78-digital-piano',
    notes: '[Digital/CA] CA78 legacy model',
  },
  {
    from: '/products/ca78',
    toUrl: '/products/kawai-ca78-digital-piano',
    notes: '[Digital/CA] CA78 — /products/ prefix variant',
  },
  {
    from: '/product/ca901',
    toUrl: '/products/kawai-ca901-digital-piano',
    notes: '[Digital/CA] CA901 current flagship model — high priority',
  },
  {
    from: '/products/ca901',
    toUrl: '/products/kawai-ca901-digital-piano',
    notes: '[Digital/CA] CA901 — /products/ prefix variant',
  },
  {
    from: '/product/ca95',
    toUrl: '/products/kawai-ca95-digital-piano',
    notes: '[Digital/CA] CA95 legacy model',
  },
  {
    from: '/products/ca95',
    toUrl: '/products/kawai-ca95-digital-piano',
    notes: '[Digital/CA] CA95 — /products/ prefix variant',
  },
  {
    from: '/product/ca97',
    toUrl: '/products/kawai-ca97-digital-piano',
    notes: '[Digital/CA] CA97 legacy model',
  },
  {
    from: '/products/ca97',
    toUrl: '/products/kawai-ca97-digital-piano',
    notes: '[Digital/CA] CA97 — /products/ prefix variant',
  },

  // ─── Digital — CE, CL, CN Series ─────────────────────────────────────────
  {
    from: '/product/ce220',
    toUrl: '/products/kawai-ce220-digital-piano',
    notes: '[Digital/CE] CE220',
  },
  {
    from: '/products/ce220',
    toUrl: '/products/kawai-ce220-digital-piano',
    notes: '[Digital/CE] CE220 — /products/ prefix variant',
  },
  {
    from: '/product/cl26',
    toUrl: '/products/kawai-cl26-digital-piano',
    notes: '[Digital/CL] CL26',
  },
  {
    from: '/products/cl26',
    toUrl: '/products/kawai-cl26-digital-piano',
    notes: '[Digital/CL] CL26 — /products/ prefix variant',
  },
  {
    from: '/product/cn201',
    toUrl: '/products/kawai-cn201-digital-piano',
    notes: '[Digital/CN] CN201 current model',
  },
  {
    from: '/products/cn201',
    toUrl: '/products/kawai-cn201-digital-piano',
    notes: '[Digital/CN] CN201 — /products/ prefix variant',
  },
  {
    from: '/product/cn23',
    toUrl: '/products/kawai-cn23-digital-piano',
    notes: '[Digital/CN] CN23 legacy model',
  },
  {
    from: '/products/cn23',
    toUrl: '/products/kawai-cn23-digital-piano',
    notes: '[Digital/CN] CN23 — /products/ prefix variant',
  },
  {
    from: '/product/cn25',
    toUrl: '/products/kawai-cn25-digital-piano',
    notes: '[Digital/CN] CN25 legacy model',
  },
  {
    from: '/products/cn25',
    toUrl: '/products/kawai-cn25-digital-piano',
    notes: '[Digital/CN] CN25 — /products/ prefix variant',
  },
  {
    from: '/product/cn27',
    toUrl: '/products/kawai-cn27-digital-piano',
    notes: '[Digital/CN] CN27 legacy model',
  },
  {
    from: '/products/cn27',
    toUrl: '/products/kawai-cn27-digital-piano',
    notes: '[Digital/CN] CN27 — /products/ prefix variant',
  },
  {
    from: '/product/cn301',
    toUrl: '/products/kawai-cn301-digital-piano',
    notes: '[Digital/CN] CN301 current model',
  },
  {
    from: '/products/cn301',
    toUrl: '/products/kawai-cn301-digital-piano',
    notes: '[Digital/CN] CN301 — /products/ prefix variant',
  },
  {
    from: '/product/cn34',
    toUrl: '/products/kawai-cn34-digital-piano',
    notes: '[Digital/CN] CN34 legacy model',
  },
  {
    from: '/products/cn34',
    toUrl: '/products/kawai-cn34-digital-piano',
    notes: '[Digital/CN] CN34 — /products/ prefix variant',
  },
  {
    from: '/product/cn35',
    toUrl: '/products/kawai-cn35-digital-piano',
    notes: '[Digital/CN] CN35 legacy model',
  },
  {
    from: '/products/cn35',
    toUrl: '/products/kawai-cn35-digital-piano',
    notes: '[Digital/CN] CN35 — /products/ prefix variant',
  },

  // ─── Digital — CP, CS, CX Series ─────────────────────────────────────────
  {
    from: '/product/cp1',
    toUrl: '/products/kawai-cp1-digital-piano',
    notes: '[Digital/CP] CP1 stage piano legacy',
  },
  {
    from: '/products/cp1',
    toUrl: '/products/kawai-cp1-digital-piano',
    notes: '[Digital/CP] CP1 — /products/ prefix variant',
  },
  {
    from: '/product/cp2',
    toUrl: '/products/kawai-cp2-digital-piano',
    notes: '[Digital/CP] CP2 stage piano legacy',
  },
  {
    from: '/products/cp2',
    toUrl: '/products/kawai-cp2-digital-piano',
    notes: '[Digital/CP] CP2 — /products/ prefix variant',
  },
  {
    from: '/product/cp3',
    toUrl: '/products/kawai-cp3-digital-piano',
    notes: '[Digital/CP] CP3 stage piano legacy',
  },
  {
    from: '/products/cp3',
    toUrl: '/products/kawai-cp3-digital-piano',
    notes: '[Digital/CP] CP3 — /products/ prefix variant',
  },
  {
    from: '/product/cs4',
    toUrl: '/products/kawai-cs4-digital-piano',
    notes: '[Digital/CS] CS4',
  },
  {
    from: '/products/cs4',
    toUrl: '/products/kawai-cs4-digital-piano',
    notes: '[Digital/CS] CS4 — /products/ prefix variant',
  },
  {
    from: '/product/cs7',
    toUrl: '/products/kawai-cs7-digital-piano',
    notes: '[Digital/CS] CS7',
  },
  {
    from: '/products/cs7',
    toUrl: '/products/kawai-cs7-digital-piano',
    notes: '[Digital/CS] CS7 — /products/ prefix variant',
  },
  {
    from: '/product/cs8',
    toUrl: '/products/kawai-cs8-digital-piano',
    notes: '[Digital/CS] CS8',
  },
  {
    from: '/products/cs8',
    toUrl: '/products/kawai-cs8-digital-piano',
    notes: '[Digital/CS] CS8 — /products/ prefix variant',
  },
  {
    from: '/product/cs10',
    toUrl: '/products/kawai-cs10-hybrid-digital-piano',
    notes: '[Digital/CS] CS10 hybrid digital',
  },
  {
    from: '/products/cs10',
    toUrl: '/products/kawai-cs10-hybrid-digital-piano',
    notes: '[Digital/CS] CS10 — /products/ prefix variant',
  },
  // CX Series — note: cx-102 has a hyphen in the slug
  {
    from: '/product/cx-102',
    toUrl: '/products/kawai-cx-102',
    notes: '[Digital/CX] CX-102 (hyphenated slug)',
  },
  {
    from: '/products/cx-102',
    toUrl: '/products/kawai-cx-102',
    notes: '[Digital/CX] CX-102 — /products/ prefix variant',
  },
  {
    from: '/product/cx102',
    toUrl: '/products/kawai-cx-102',
    notes: '[Digital/CX] CX-102 — no-hyphen legacy variant',
  },
  {
    from: '/product/cx202',
    toUrl: '/products/kawai-cx202',
    notes: '[Digital/CX] CX202',
  },
  {
    from: '/products/cx202',
    toUrl: '/products/kawai-cx202',
    notes: '[Digital/CX] CX202 — /products/ prefix variant',
  },

  // ─── Digital — DG, ES Series ─────────────────────────────────────────────
  {
    from: '/product/dg30',
    toUrl: '/products/kawai-dg30-digital-grand-piano',
    notes: '[Digital/DG] DG30 digital grand',
  },
  {
    from: '/products/dg30',
    toUrl: '/products/kawai-dg30-digital-grand-piano',
    notes: '[Digital/DG] DG30 — /products/ prefix variant',
  },
  {
    from: '/product/es1',
    toUrl: '/products/kawai-es1-digital-piano',
    notes: '[Digital/ES] ES1 legacy portable',
  },
  {
    from: '/products/es1',
    toUrl: '/products/kawai-es1-digital-piano',
    notes: '[Digital/ES] ES1 — /products/ prefix variant',
  },
  {
    from: '/product/es3',
    toUrl: '/products/kawai-es3-digital-piano',
    notes: '[Digital/ES] ES3 legacy portable',
  },
  {
    from: '/products/es3',
    toUrl: '/products/kawai-es3-digital-piano',
    notes: '[Digital/ES] ES3 — /products/ prefix variant',
  },
  {
    from: '/product/es6',
    toUrl: '/products/kawai-es6-digital-piano',
    notes: '[Digital/ES] ES6 legacy portable',
  },
  {
    from: '/products/es6',
    toUrl: '/products/kawai-es6-digital-piano',
    notes: '[Digital/ES] ES6 — /products/ prefix variant',
  },
  {
    from: '/product/es8',
    toUrl: '/products/kawai-es8-digital-piano',
    notes: '[Digital/ES] ES8 legacy portable',
  },
  {
    from: '/products/es8',
    toUrl: '/products/kawai-es8-digital-piano',
    notes: '[Digital/ES] ES8 — /products/ prefix variant',
  },
  {
    from: '/product/es60',
    toUrl: '/products/kawai-es60-digital-piano',
    notes: '[Digital/ES] ES60 legacy portable',
  },
  {
    from: '/products/es60',
    toUrl: '/products/kawai-es60-digital-piano',
    notes: '[Digital/ES] ES60 — /products/ prefix variant',
  },
  {
    from: '/product/kawai-es60',
    toUrl: '/products/kawai-es60-digital-piano',
    notes: '[Digital/ES] ES60 — alt slug with kawai- prefix',
  },
  {
    from: '/product/es100',
    toUrl: '/products/kawai-es100-digital-piano',
    notes: '[Digital/ES] ES100 legacy portable',
  },
  {
    from: '/products/es100',
    toUrl: '/products/kawai-es100-digital-piano',
    notes: '[Digital/ES] ES100 — /products/ prefix variant',
  },
  {
    from: '/product/es110',
    toUrl: '/products/kawai-es110-digital-piano',
    notes: '[Digital/ES] ES110 legacy portable',
  },
  {
    from: '/products/es110',
    toUrl: '/products/kawai-es110-digital-piano',
    notes: '[Digital/ES] ES110 — /products/ prefix variant',
  },
  {
    from: '/product/es120',
    toUrl: '/products/kawai-es120-digital-piano',
    notes: '[Digital/ES] ES120 current entry model',
  },
  {
    from: '/products/es120',
    toUrl: '/products/kawai-es120-digital-piano',
    notes: '[Digital/ES] ES120 — /products/ prefix variant',
  },
  {
    from: '/product/es520',
    toUrl: '/products/kawai-es520-digital-piano',
    notes: '[Digital/ES] ES520 current mid model',
  },
  {
    from: '/products/es520',
    toUrl: '/products/kawai-es520-digital-piano',
    notes: '[Digital/ES] ES520 — /products/ prefix variant',
  },
  {
    from: '/product/es920',
    toUrl: '/products/kawai-es920-digital-piano',
    notes: '[Digital/ES] ES920 current flagship — high priority',
  },
  {
    from: '/products/es920',
    toUrl: '/products/kawai-es920-digital-piano',
    notes: '[Digital/ES] ES920 — /products/ prefix variant',
  },

  // ─── Digital — KCP, KDP, KLCS Series ─────────────────────────────────────
  {
    from: '/product/kcp90',
    toUrl: '/products/kawai-kcp90-digital-piano',
    notes: '[Digital/KCP] KCP90',
  },
  {
    from: '/products/kcp90',
    toUrl: '/products/kawai-kcp90-digital-piano',
    notes: '[Digital/KCP] KCP90 — /products/ prefix variant',
  },
  {
    from: '/product/kdp70',
    toUrl: '/products/kawai-kdp70-digital-piano',
    notes: '[Digital/KDP] KDP70',
  },
  {
    from: '/products/kdp70',
    toUrl: '/products/kawai-kdp70-digital-piano',
    notes: '[Digital/KDP] KDP70 — /products/ prefix variant',
  },
  {
    from: '/product/kdp75',
    toUrl: '/products/kawai-kdp75-digital-piano',
    notes: '[Digital/KDP] KDP75 current model',
  },
  {
    from: '/products/kdp75',
    toUrl: '/products/kawai-kdp75-digital-piano',
    notes: '[Digital/KDP] KDP75 — /products/ prefix variant',
  },
  {
    from: '/product/kdp90',
    toUrl: '/products/kawai-kdp90-digital-piano',
    notes: '[Digital/KDP] KDP90 legacy model',
  },
  {
    from: '/products/kdp90',
    toUrl: '/products/kawai-kdp90-digital-piano',
    notes: '[Digital/KDP] KDP90 — /products/ prefix variant',
  },
  {
    from: '/product/kdp110',
    toUrl: '/products/kawai-kdp110-digital-piano',
    notes: '[Digital/KDP] KDP110 legacy model',
  },
  {
    from: '/products/kdp110',
    toUrl: '/products/kawai-kdp110-digital-piano',
    notes: '[Digital/KDP] KDP110 — /products/ prefix variant',
  },
  {
    from: '/product/kdp120',
    toUrl: '/products/kawai-kdp120-digital-piano',
    notes: '[Digital/KDP] KDP120 current model',
  },
  {
    from: '/products/kdp120',
    toUrl: '/products/kawai-kdp120-digital-piano',
    notes: '[Digital/KDP] KDP120 — /products/ prefix variant',
  },
  {
    from: '/product/klcs',
    toUrl: '/products/kawai-klcs-digital-piano',
    notes: '[Digital/KLCS] KLCS classroom system',
  },
  {
    from: '/products/klcs',
    toUrl: '/products/kawai-klcs-digital-piano',
    notes: '[Digital/KLCS] KLCS — /products/ prefix variant',
  },

  // ─── Digital — MAV8, MP Stage, VPC1, X, Z Series ─────────────────────────
  {
    from: '/product/mav8',
    toUrl: '/products/kawai-mav8-midi-patchbay',
    notes: '[Digital/MAV8] MAV8 MIDI patchbay accessory',
  },
  {
    from: '/products/mav8',
    toUrl: '/products/kawai-mav8-midi-patchbay',
    notes: '[Digital/MAV8] MAV8 — /products/ prefix variant',
  },
  {
    from: '/product/mp7',
    toUrl: '/products/kawai-mp7-digital-piano',
    notes: '[Digital/MP] MP7 stage piano legacy',
  },
  {
    from: '/products/mp7',
    toUrl: '/products/kawai-mp7-digital-piano',
    notes: '[Digital/MP] MP7 — /products/ prefix variant',
  },
  {
    from: '/product/mp7se',
    toUrl: '/products/kawai-mp7se-digital-piano',
    notes: '[Digital/MP] MP7SE stage piano current',
  },
  {
    from: '/products/mp7se',
    toUrl: '/products/kawai-mp7se-digital-piano',
    notes: '[Digital/MP] MP7SE — /products/ prefix variant',
  },
  {
    from: '/product/mp8',
    toUrl: '/products/kawai-mp8-digital-piano',
    notes: '[Digital/MP] MP8 stage piano legacy',
  },
  {
    from: '/products/mp8',
    toUrl: '/products/kawai-mp8-digital-piano',
    notes: '[Digital/MP] MP8 — /products/ prefix variant',
  },
  {
    from: '/product/mp11',
    toUrl: '/products/kawai-mp11-digital-piano',
    notes: '[Digital/MP] MP11 stage piano legacy',
  },
  {
    from: '/products/mp11',
    toUrl: '/products/kawai-mp11-digital-piano',
    notes: '[Digital/MP] MP11 — /products/ prefix variant',
  },
  {
    from: '/product/mp11se',
    toUrl: '/products/kawai-mp11se-digital-piano',
    notes: '[Digital/MP] MP11SE stage piano flagship — high priority',
  },
  {
    from: '/products/mp11se',
    toUrl: '/products/kawai-mp11se-digital-piano',
    notes: '[Digital/MP] MP11SE — /products/ prefix variant',
  },
  {
    from: '/product/mp9000',
    toUrl: '/products/kawai-mp9000-digital-piano',
    notes: '[Digital/MP] MP9000 legacy stage piano',
  },
  {
    from: '/products/mp9000',
    toUrl: '/products/kawai-mp9000-digital-piano',
    notes: '[Digital/MP] MP9000 — /products/ prefix variant',
  },
  {
    from: '/product/vpc1',
    toUrl: '/products/kawai-vpc1-digital-piano',
    notes: '[Digital/VPC] VPC1 MIDI controller',
  },
  {
    from: '/products/vpc1',
    toUrl: '/products/kawai-vpc1-digital-piano',
    notes: '[Digital/VPC] VPC1 — /products/ prefix variant',
  },
  {
    from: '/product/x120',
    toUrl: '/products/kawai-x120-digital-piano',
    notes: '[Digital/X] X120',
  },
  {
    from: '/products/x120',
    toUrl: '/products/kawai-x120-digital-piano',
    notes: '[Digital/X] X120 — /products/ prefix variant',
  },
  {
    from: '/product/z1000',
    toUrl: '/products/kawai-z1000-digital-keyboard',
    notes: '[Digital/Z] Z1000 digital keyboard',
  },
  {
    from: '/products/z1000',
    toUrl: '/products/kawai-z1000-digital-keyboard',
    notes: '[Digital/Z] Z1000 — /products/ prefix variant',
  },

  // ─── Digital — Discontinued (no product page, not in CSV) ─────────────────
  {
    from: '/product/ca49',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CA49 — GSC 404 export; no product page',
  },
  {
    from: '/product/ca59',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CA59 — GSC 404 export; no product page',
  },
  {
    from: '/product/kawai-ca59-digital-piano',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CA59 — alt full slug; GSC 404 export',
  },
  {
    from: '/product/ca79',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CA79 — GSC 404 export; no product page',
  },
  {
    from: '/product/ca98',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CA98 — GSC 404 export; no product page',
  },
  {
    from: '/product/ca99',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CA99 — GSC 404 export; no product page',
  },
  {
    from: '/product/cn270',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CN270 — GSC 404 export; no product page',
  },
  {
    from: '/product/cn29',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CN29 — GSC 404 export; no product page',
  },
  {
    from: '/product/cn33',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CN33 — GSC 404 export; no product page',
  },
  {
    from: '/product/cn37',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CN37 — GSC 404 export; no product page',
  },
  {
    from: '/product/cn39',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] CN39 — GSC 404 export; no product page',
  },
  {
    from: '/product/cs11',
    toUrl: '/pianos/novus-series',
    notes: '[Digital/Discontinued] CS11 legacy hybrid; closest match is Novus series',
  },
  {
    from: '/product/es4',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] ES4 — GSC 404 export; no product page',
  },
  {
    from: '/product/es7',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] ES7 — GSC 404 export; no product page',
  },
  {
    from: '/product/mp5',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] MP5 — GSC 404 export; no product page',
  },
  {
    from: '/product/mp6',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] MP6 — GSC 404 export; no product page',
  },
  {
    from: '/product/mp9500',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] MP9500 — GSC 404 export; no product page',
  },
  {
    from: '/product/mp10',
    toUrl: '/pianos/digital',
    notes: '[Digital/Discontinued] MP10 — GSC 404 export; no product page',
  },
  // Novus-prefixed legacy paths (WooCommerce used "novus-" prefix)
  {
    from: '/product/novus-nv5',
    toUrl: '/products/kawai-novus-nv5-hybrid-piano',
    notes: '[Digital/Novus] NV5 — WooCommerce "novus-" prefixed slug variant',
  },
  {
    from: '/product/novus-nv5s',
    toUrl: '/products/kawai-nv5s-hybrid-digital-piano',
    notes: '[Digital/Novus] NV5S — WooCommerce "novus-" prefixed slug variant',
  },
  {
    from: '/product/novus-nv10',
    toUrl: '/products/kawai-novus-nv10-hybrid-piano',
    notes: '[Digital/Novus] NV10 — WooCommerce "novus-" prefixed slug variant',
  },
  {
    from: '/product/novus-nv10s',
    toUrl: '/products/kawai-nv10s-hybrid-digital-piano',
    notes: '[Digital/Novus] NV10S — WooCommerce "novus-" prefixed slug variant',
  },

  // ─── Grand — CR, GE, GL Series ────────────────────────────────────────────
  {
    from: '/product/cr-45',
    toUrl: '/products/kawai-cr-45-crystal-grand-piano',
    notes: '[Grand/CR] CR-45 Crystal Grand',
  },
  {
    from: '/products/cr-45',
    toUrl: '/products/kawai-cr-45-crystal-grand-piano',
    notes: '[Grand/CR] CR-45 — /products/ prefix variant',
  },
  {
    from: '/product/cr-40',
    toUrl: '/pianos/crystal-grand-piano',
    notes: '[Grand/CR] CR-40 legacy crystal grand; redirect to crystal grand page',
  },
  {
    from: '/product/ge-30',
    toUrl: '/products/kawai-ge-30-baby-grand-piano',
    notes: '[Grand/GE] GE-30 baby grand legacy',
  },
  {
    from: '/products/ge-30',
    toUrl: '/products/kawai-ge-30-baby-grand-piano',
    notes: '[Grand/GE] GE-30 — /products/ prefix variant',
  },
  {
    from: '/product/gl-10',
    toUrl: '/products/kawai-gl-10-baby-grand-piano',
    notes: '[Grand/GL] GL-10 baby grand 5\'0"',
  },
  {
    from: '/products/gl-10',
    toUrl: '/products/kawai-gl-10-baby-grand-piano',
    notes: '[Grand/GL] GL-10 — /products/ prefix variant',
  },
  {
    from: '/product/gl-20',
    toUrl: '/products/kawai-gl-20-baby-grand-piano',
    notes: '[Grand/GL] GL-20 baby grand',
  },
  {
    from: '/products/gl-20',
    toUrl: '/products/kawai-gl-20-baby-grand-piano',
    notes: '[Grand/GL] GL-20 — /products/ prefix variant',
  },
  {
    from: '/product/gl-30',
    toUrl: '/products/kawai-gl-30-classic-grand-piano',
    notes: '[Grand/GL] GL-30 classic grand',
  },
  {
    from: '/products/gl-30',
    toUrl: '/products/kawai-gl-30-classic-grand-piano',
    notes: '[Grand/GL] GL-30 — /products/ prefix variant',
  },
  {
    from: '/product/gl-40',
    toUrl: '/products/kawai-gl-40-grand-piano',
    notes: '[Grand/GL] GL-40 grand',
  },
  {
    from: '/products/gl-40',
    toUrl: '/products/kawai-gl-40-grand-piano',
    notes: '[Grand/GL] GL-40 — /products/ prefix variant',
  },
  {
    from: '/product/gl-50',
    toUrl: '/products/kawai-gl-50-grand-piano',
    notes: '[Grand/GL] GL-50 grand',
  },
  {
    from: '/products/gl-50',
    toUrl: '/products/kawai-gl-50-grand-piano',
    notes: '[Grand/GL] GL-50 — /products/ prefix variant',
  },

  // ─── Grand — GM, GX Series ────────────────────────────────────────────────
  {
    from: '/product/gm-10k',
    toUrl: '/products/kawai-gm-10k-baby-grand-piano',
    notes: '[Grand/GM] GM-10K baby grand legacy',
  },
  {
    from: '/products/gm-10k',
    toUrl: '/products/kawai-gm-10k-baby-grand-piano',
    notes: '[Grand/GM] GM-10K — /products/ prefix variant',
  },
  {
    from: '/product/gm-11',
    toUrl: '/products/kawai-gm-11-baby-grand-piano',
    notes: '[Grand/GM] GM-11 baby grand legacy',
  },
  {
    from: '/products/gm-11',
    toUrl: '/products/kawai-gm-11-baby-grand-piano',
    notes: '[Grand/GM] GM-11 — /products/ prefix variant',
  },
  {
    from: '/product/gm-12',
    toUrl: '/products/kawai-gm-12-baby-grand-piano',
    notes: '[Grand/GM] GM-12 baby grand legacy',
  },
  {
    from: '/products/gm-12',
    toUrl: '/products/kawai-gm-12-baby-grand-piano',
    notes: '[Grand/GM] GM-12 — /products/ prefix variant',
  },
  {
    from: '/product/gm10',
    toUrl: '/products/kawai-gm10-grand-piano',
    notes: '[Grand/GM] GM10 grand legacy',
  },
  {
    from: '/products/gm10',
    toUrl: '/products/kawai-gm10-grand-piano',
    notes: '[Grand/GM] GM10 — /products/ prefix variant',
  },
  {
    from: '/product/gx-1',
    toUrl: '/products/kawai-gx-1-grand-piano',
    notes: '[Grand/GX] GX-1 professional grand',
  },
  {
    from: '/products/gx-1',
    toUrl: '/products/kawai-gx-1-grand-piano',
    notes: '[Grand/GX] GX-1 — /products/ prefix variant',
  },
  {
    from: '/product/gx-2',
    toUrl: '/products/kawai-gx-2-grand-piano',
    notes: '[Grand/GX] GX-2 professional grand',
  },
  {
    from: '/products/gx-2',
    toUrl: '/products/kawai-gx-2-grand-piano',
    notes: '[Grand/GX] GX-2 — /products/ prefix variant',
  },
  {
    from: '/product/gx-2-limited-edition',
    toUrl: '/products/kawai-gx-2-limited-edition-60th-anniversary',
    notes: '[Grand/GX] GX-2 60th Anniversary Limited Edition',
  },
  {
    from: '/products/gx-2-limited-edition',
    toUrl: '/products/kawai-gx-2-limited-edition-60th-anniversary',
    notes: '[Grand/GX] GX-2 LE — /products/ prefix variant',
  },
  {
    from: '/product/gx-2-limited-edition-60th-anniversary',
    toUrl: '/products/kawai-gx-2-limited-edition-60th-anniversary',
    notes: '[Grand/GX] GX-2 LE — full old slug variant',
  },
  {
    from: '/product/kawai-kawai-gx-2-limited-edition',
    toUrl: '/products/kawai-gx-2-limited-edition-60th-anniversary',
    notes: '[Grand/GX] GX-2 LE — malformed double-kawai slug',
  },
  {
    from: '/product/kawai-k-500-limited-edition',
    toUrl: '/products/kawai-k-500-limited-edition-60th-anniversary',
    notes: '[Upright/K] K-500 LE — alt slug missing "60th-anniversary" suffix',
  },
  {
    from: '/product/gx-3',
    toUrl: '/products/kawai-gx-3-grand-piano',
    notes: '[Grand/GX] GX-3 professional grand',
  },
  {
    from: '/products/gx-3',
    toUrl: '/products/kawai-gx-3-grand-piano',
    notes: '[Grand/GX] GX-3 — /products/ prefix variant',
  },
  {
    from: '/product/gx-5',
    toUrl: '/products/kawai-gx-5-grand-piano',
    notes: '[Grand/GX] GX-5 professional grand',
  },
  {
    from: '/products/gx-5',
    toUrl: '/products/kawai-gx-5-grand-piano',
    notes: '[Grand/GX] GX-5 — /products/ prefix variant',
  },
  {
    from: '/product/gx-6',
    toUrl: '/products/kawai-gx-6-grand-piano',
    notes: '[Grand/GX] GX-6 professional grand',
  },
  {
    from: '/products/gx-6',
    toUrl: '/products/kawai-gx-6-grand-piano',
    notes: '[Grand/GX] GX-6 — /products/ prefix variant',
  },
  {
    from: '/product/gx-7',
    toUrl: '/products/kawai-gx-7-grand-piano',
    notes: '[Grand/GX] GX-7 professional grand',
  },
  {
    from: '/products/gx-7',
    toUrl: '/products/kawai-gx-7-grand-piano',
    notes: '[Grand/GX] GX-7 — /products/ prefix variant',
  },

  // ─── Grand — RX Series ────────────────────────────────────────────────────
  {
    from: '/product/rx-1',
    toUrl: '/products/kawai-rx-1-grand-piano',
    notes: '[Grand/RX] RX-1 legacy grand',
  },
  {
    from: '/products/rx-1',
    toUrl: '/products/kawai-rx-1-grand-piano',
    notes: '[Grand/RX] RX-1 — /products/ prefix variant',
  },
  {
    from: '/product/rx3',
    toUrl: '/products/kawai-rx3',
    notes: '[Grand/RX] RX3 legacy (no hyphen in slug)',
  },
  {
    from: '/products/rx3',
    toUrl: '/products/kawai-rx3',
    notes: '[Grand/RX] RX3 — /products/ prefix variant',
  },
  {
    from: '/product/rx-5',
    toUrl: '/products/kawai-rx-5-artist-grand-piano',
    notes: '[Grand/RX] RX-5 Artist legacy grand',
  },
  {
    from: '/products/rx-5',
    toUrl: '/products/kawai-rx-5-artist-grand-piano',
    notes: '[Grand/RX] RX-5 — /products/ prefix variant',
  },
  {
    from: '/product/rx-6',
    toUrl: '/products/kawai-rx-6-semi-concert-grand-piano',
    notes: '[Grand/RX] RX-6 semi-concert legacy grand',
  },
  {
    from: '/products/rx-6',
    toUrl: '/products/kawai-rx-6-semi-concert-grand-piano',
    notes: '[Grand/RX] RX-6 — /products/ prefix variant',
  },
  {
    from: '/product/rx-7',
    toUrl: '/products/kawai-rx-7-semi-concert-grand-piano',
    notes: '[Grand/RX] RX-7 semi-concert legacy grand',
  },
  {
    from: '/products/rx-7',
    toUrl: '/products/kawai-rx-7-semi-concert-grand-piano',
    notes: '[Grand/RX] RX-7 — /products/ prefix variant',
  },
  // RX legacy discontinued (no product page)
  {
    from: '/product/rx-2',
    toUrl: '/pianos/grand',
    notes: '[Grand/RX/Discontinued] RX-2 — no product page',
  },
  {
    from: '/product/rx-3',
    toUrl: '/pianos/grand',
    notes: '[Grand/RX/Discontinued] RX-3 — no product page',
  },

  // ─── Upright — 506N, 508, 607, 907 ───────────────────────────────────────
  {
    from: '/product/506n',
    toUrl: '/products/kawai-506n-institutional-upright-piano',
    notes: '[Upright/506N] 506N institutional',
  },
  {
    from: '/products/506n',
    toUrl: '/products/kawai-506n-institutional-upright-piano',
    notes: '[Upright/506N] 506N — /products/ prefix variant',
  },
  {
    from: '/product/508',
    toUrl: '/products/kawai-508-decorator-console-upright-piano',
    notes: '[Upright/508] 508 decorator console',
  },
  {
    from: '/products/508',
    toUrl: '/products/kawai-508-decorator-console-upright-piano',
    notes: '[Upright/508] 508 — /products/ prefix variant',
  },
  {
    from: '/product/607',
    toUrl: '/products/kawai-607-designer-console-upright-piano',
    notes: '[Upright/607] 607 designer console',
  },
  {
    from: '/products/607',
    toUrl: '/products/kawai-607-designer-console-upright-piano',
    notes: '[Upright/607] 607 — /products/ prefix variant',
  },
  // 907 is a designer studio upright, NOT a grand — corrected from prior mapping
  {
    from: '/product/907',
    toUrl: '/products/kawai-907-designer-studio-upright-piano',
    notes: '[Upright/907] 907 designer studio upright (was incorrectly mapped to /pianos/grand)',
  },
  {
    from: '/products/907',
    toUrl: '/products/kawai-907-designer-studio-upright-piano',
    notes: '[Upright/907] 907 — /products/ prefix variant',
  },

  // ─── Upright — K Series ───────────────────────────────────────────────────
  {
    from: '/product/k-15',
    toUrl: '/products/kawai-k-15-upright-piano',
    notes: '[Upright/K] K-15 entry upright',
  },
  {
    from: '/products/k-15',
    toUrl: '/products/kawai-k-15-upright-piano',
    notes: '[Upright/K] K-15 — /products/ prefix variant',
  },
  {
    from: '/product/k-200',
    toUrl: '/products/kawai-k-200-upright-piano',
    notes: '[Upright/K] K-200',
  },
  {
    from: '/products/k-200',
    toUrl: '/products/kawai-k-200-upright-piano',
    notes: '[Upright/K] K-200 — /products/ prefix variant',
  },
  {
    from: '/product/k-300',
    toUrl: '/products/kawai-k-300-upright-piano',
    notes: '[Upright/K] K-300 bestseller — high priority',
  },
  {
    from: '/products/k-300',
    toUrl: '/products/kawai-k-300-upright-piano',
    notes: '[Upright/K] K-300 — /products/ prefix variant',
  },
  {
    from: '/product/k-400',
    toUrl: '/products/kawai-k-400-upright-piano',
    notes: '[Upright/K] K-400',
  },
  {
    from: '/products/k-400',
    toUrl: '/products/kawai-k-400-upright-piano',
    notes: '[Upright/K] K-400 — /products/ prefix variant',
  },
  {
    from: '/product/k-500',
    toUrl: '/products/kawai-k-500-upright-piano',
    notes: '[Upright/K] K-500 professional',
  },
  {
    from: '/products/k-500',
    toUrl: '/products/kawai-k-500-upright-piano',
    notes: '[Upright/K] K-500 — /products/ prefix variant',
  },
  {
    from: '/product/k-500-limited-edition',
    toUrl: '/products/kawai-k-500-limited-edition-60th-anniversary',
    notes: '[Upright/K] K-500 60th Anniversary Limited Edition',
  },
  {
    from: '/products/k-500-limited-edition',
    toUrl: '/products/kawai-k-500-limited-edition-60th-anniversary',
    notes: '[Upright/K] K-500 LE — /products/ prefix variant',
  },
  // K-6 is an active product — corrected from prior discontinued mapping
  {
    from: '/product/k-6',
    toUrl: '/products/kawai-k-6-upright-piano',
    notes: '[Upright/K] K-6 (was incorrectly mapped as discontinued)',
  },
  {
    from: '/products/k-6',
    toUrl: '/products/kawai-k-6-upright-piano',
    notes: '[Upright/K] K-6 — /products/ prefix variant',
  },
  // K-800 is an active product — corrected from prior discontinued mapping
  {
    from: '/product/k-800',
    toUrl: '/products/kawai-k-800-upright-piano',
    notes: '[Upright/K] K-800 flagship 53" (was incorrectly mapped as discontinued)',
  },
  {
    from: '/products/k-800',
    toUrl: '/products/kawai-k-800-upright-piano',
    notes: '[Upright/K] K-800 — /products/ prefix variant',
  },
  // K legacy (discontinued, no product page)
  {
    from: '/product/k-2',
    toUrl: '/pianos/upright',
    notes: '[Upright/K/Discontinued] K-2 — GSC 404 export; no product page',
  },
  {
    from: '/product/k-3',
    toUrl: '/pianos/upright',
    notes: '[Upright/K/Discontinued] K-3 — GSC 404 export; no product page',
  },
  {
    from: '/product/k-5',
    toUrl: '/pianos/upright',
    notes: '[Upright/K/Discontinued] K-5 — GSC 404 export; no product page',
  },
  {
    from: '/product/k-8',
    toUrl: '/pianos/upright',
    notes: '[Upright/K/Discontinued] K-8 — GSC 404 export; no product page',
  },

  // ─── Upright — MS, ST, UST Series ────────────────────────────────────────
  {
    from: '/product/ms123',
    toUrl: '/products/kawai-ms123',
    notes: '[Upright/MS] MS123 Master Series',
  },
  {
    from: '/products/ms123',
    toUrl: '/products/kawai-ms123',
    notes: '[Upright/MS] MS123 — /products/ prefix variant',
  },
  {
    from: '/product/ms130',
    toUrl: '/products/kawai-ms130',
    notes: '[Upright/MS] MS130 Master Series',
  },
  {
    from: '/products/ms130',
    toUrl: '/products/kawai-ms130',
    notes: '[Upright/MS] MS130 — /products/ prefix variant',
  },
  {
    from: '/product/ms-130',
    toUrl: '/products/kawai-ms130',
    notes: '[Upright/MS] MS130 — hyphenated alt slug variant',
  },
  {
    from: '/product/ms134',
    toUrl: '/products/kawai-ms134',
    notes: '[Upright/MS] MS134 Master Series',
  },
  {
    from: '/products/ms134',
    toUrl: '/products/kawai-ms134',
    notes: '[Upright/MS] MS134 — /products/ prefix variant',
  },
  {
    from: '/product/st-1',
    toUrl: '/products/kawai-st-1-upright-piano',
    notes: '[Upright/ST] ST-1 studio upright',
  },
  {
    from: '/products/st-1',
    toUrl: '/products/kawai-st-1-upright-piano',
    notes: '[Upright/ST] ST-1 — /products/ prefix variant',
  },
  {
    from: '/product/ust-9',
    toUrl: '/products/kawai-ust-9-institutional-upright-piano',
    notes: '[Upright/UST] UST-9 institutional (was incorrectly mapped to /pianos/upright)',
  },
  {
    from: '/products/ust-9',
    toUrl: '/products/kawai-ust-9-institutional-upright-piano',
    notes: '[Upright/UST] UST-9 — /products/ prefix variant',
  },

  // ─── Hybrid — GL ATX / AURES ──────────────────────────────────────────────
  {
    from: '/product/gl-30-aures-2',
    toUrl: '/products/kawai-gl-30-aures-2-hybrid-piano',
    notes: '[Hybrid/GL] GL-30 AURES 2 silent system',
  },
  {
    from: '/products/gl-30-aures-2',
    toUrl: '/products/kawai-gl-30-aures-2-hybrid-piano',
    notes: '[Hybrid/GL] GL-30 AURES 2 — /products/ prefix variant',
  },
  {
    from: '/product/gl10-atx4',
    toUrl: '/products/kawai-gl10-atx4-hybrid-piano',
    notes: '[Hybrid/GL] GL10 ATX4 silent system',
  },
  {
    from: '/products/gl10-atx4',
    toUrl: '/products/kawai-gl10-atx4-hybrid-piano',
    notes: '[Hybrid/GL] GL10 ATX4 — /products/ prefix variant',
  },
  // gl30-atx2 has a product page — corrected from prior /pianos/anytime-pianos mapping
  {
    from: '/product/gl30-atx2',
    toUrl: '/products/kawai-gl30-atx2-hybrid-grand-piano',
    notes: '[Hybrid/GL] GL30 ATX2 silent grand (was incorrectly mapped to /pianos/anytime-pianos)',
  },
  {
    from: '/products/gl30-atx2',
    toUrl: '/products/kawai-gl30-atx2-hybrid-grand-piano',
    notes: '[Hybrid/GL] GL30 ATX2 — /products/ prefix variant',
  },

  // ─── Hybrid — GX AURES ────────────────────────────────────────────────────
  {
    from: '/product/gx-2-aures-2',
    toUrl: '/products/kawai-gx-2-aures-2-hybrid-piano',
    notes: '[Hybrid/GX] GX-2 AURES 2 silent grand',
  },
  {
    from: '/products/gx-2-aures-2',
    toUrl: '/products/kawai-gx-2-aures-2-hybrid-piano',
    notes: '[Hybrid/GX] GX-2 AURES 2 — /products/ prefix variant',
  },

  // ─── Hybrid — K AURES / ATX ───────────────────────────────────────────────
  {
    from: '/product/k-300-aures-2',
    toUrl: '/products/kawai-k-300-aures-2-hybrid-piano',
    notes: '[Hybrid/K] K-300 AURES 2 silent upright',
  },
  {
    from: '/products/k-300-aures-2',
    toUrl: '/products/kawai-k-300-aures-2-hybrid-piano',
    notes: '[Hybrid/K] K-300 AURES 2 — /products/ prefix variant',
  },
  // k-500-aures destination corrected to match actual Shopify slug (no "-hybrid-piano" suffix)
  {
    from: '/product/k-500-aures',
    toUrl: '/products/kawai-k-500-aures',
    notes: '[Hybrid/K] K-500 AURES silent upright',
  },
  {
    from: '/products/k-500-aures',
    toUrl: '/products/kawai-k-500-aures',
    notes: '[Hybrid/K] K-500 AURES — /products/ prefix variant',
  },
  {
    from: '/product/k-500-aures-2',
    toUrl: '/products/kawai-k-500-aures-2-hybrid-piano',
    notes: '[Hybrid/K] K-500 AURES 2 silent upright',
  },
  {
    from: '/products/k-500-aures-2',
    toUrl: '/products/kawai-k-500-aures-2-hybrid-piano',
    notes: '[Hybrid/K] K-500 AURES 2 — /products/ prefix variant',
  },
  {
    from: '/product/k200-atx2',
    toUrl: '/products/kawai-k200-atx2-hybrid-upright-piano',
    notes: '[Hybrid/K] K200 ATX2 silent upright',
  },
  {
    from: '/products/k200-atx2',
    toUrl: '/products/kawai-k200-atx2-hybrid-upright-piano',
    notes: '[Hybrid/K] K200 ATX2 — /products/ prefix variant',
  },
  {
    from: '/product/k200-atx3',
    toUrl: '/products/kawai-k200-atx3-hybrid-upright-piano',
    notes: '[Hybrid/K] K200 ATX3 silent upright',
  },
  {
    from: '/products/k200-atx3',
    toUrl: '/products/kawai-k200-atx3-hybrid-upright-piano',
    notes: '[Hybrid/K] K200 ATX3 — /products/ prefix variant',
  },
  {
    from: '/product/k200-atx4',
    toUrl: '/products/kawai-k200-atx4-hybrid-piano',
    notes: '[Hybrid/K] K200 ATX4 silent upright',
  },
  {
    from: '/products/k200-atx4',
    toUrl: '/products/kawai-k200-atx4-hybrid-piano',
    notes: '[Hybrid/K] K200 ATX4 — /products/ prefix variant',
  },
  {
    from: '/product/k300-atx2',
    toUrl: '/products/kawai-k300-atx2-hybrid-upright-piano',
    notes: '[Hybrid/K] K300 ATX2 silent upright',
  },
  {
    from: '/products/k300-atx2',
    toUrl: '/products/kawai-k300-atx2-hybrid-upright-piano',
    notes: '[Hybrid/K] K300 ATX2 — /products/ prefix variant',
  },
  {
    from: '/product/k300-aures',
    toUrl: '/products/kawai-k300-aures-hybrid-upright-piano',
    notes: '[Hybrid/K] K300 AURES silent upright',
  },
  {
    from: '/products/k300-aures',
    toUrl: '/products/kawai-k300-aures-hybrid-upright-piano',
    notes: '[Hybrid/K] K300 AURES — /products/ prefix variant',
  },

  // ─── Hybrid — Novus NV Series ─────────────────────────────────────────────
  {
    from: '/product/nv5s',
    toUrl: '/products/kawai-nv5s-hybrid-digital-piano',
    notes: '[Hybrid/NV] NV5S — high priority',
  },
  {
    from: '/products/nv5s',
    toUrl: '/products/kawai-nv5s-hybrid-digital-piano',
    notes: '[Hybrid/NV] NV5S — /products/ prefix variant',
  },
  {
    from: '/product/nv6',
    toUrl: '/products/kawai-nv6',
    notes: '[Hybrid/NV] NV6',
  },
  {
    from: '/products/nv6',
    toUrl: '/products/kawai-nv6',
    notes: '[Hybrid/NV] NV6 — /products/ prefix variant',
  },
  {
    from: '/product/nv10s',
    toUrl: '/products/kawai-nv10s-hybrid-digital-piano',
    notes: '[Hybrid/NV] NV10S flagship — high priority',
  },
  {
    from: '/products/nv10s',
    toUrl: '/products/kawai-nv10s-hybrid-digital-piano',
    notes: '[Hybrid/NV] NV10S — /products/ prefix variant',
  },
  {
    from: '/product/nv12',
    toUrl: '/products/kawai-nv12',
    notes: '[Hybrid/NV] NV12',
  },
  {
    from: '/products/nv12',
    toUrl: '/products/kawai-nv12',
    notes: '[Hybrid/NV] NV12 — /products/ prefix variant',
  },

  // ─── Accessories ──────────────────────────────────────────────────────────
  {
    from: '/product/f-10h',
    toUrl: '/accessories',
    notes: '[Accessories] F-10H foot pedal',
  },
  {
    from: '/product/f-302',
    toUrl: '/accessories',
    notes: '[Accessories] F-302 triple pedal bar',
  },
  {
    from: '/product/f-350',
    toUrl: '/accessories',
    notes: '[Accessories] F-350 triple pedal bar',
  },
  {
    from: '/product/f-351',
    toUrl: '/accessories',
    notes: '[Accessories] F-351 triple pedal bar',
  },
  {
    from: '/product/gfp-3',
    toUrl: '/accessories',
    notes: '[Accessories] GFP-3 Grand Feel Triple Pedal',
  },
  {
    from: '/product/hm-5',
    toUrl: '/accessories',
    notes: '[Accessories] HM-5 designer stand',
  },
  {
    from: '/product/hml-1',
    toUrl: '/accessories',
    notes: '[Accessories] HML-1 designer stand',
  },
  {
    from: '/product/hml-2',
    toUrl: '/accessories',
    notes: '[Accessories] HML-2 stand',
  },
  {
    from: '/product/hml-3',
    toUrl: '/accessories',
    notes: '[Accessories] HML-3 designer stand',
  },
  {
    from: '/product/sc-1',
    toUrl: '/accessories',
    notes: '[Accessories] SC-1 soft case',
  },
  {
    from: '/product/sc-2',
    toUrl: '/accessories',
    notes: '[Accessories] SC-2 soft carry case',
  },
  {
    from: '/product/sh-9',
    toUrl: '/accessories',
    notes: '[Accessories] SH-9 headphone',
  },

  // ─── WooCommerce Product Categories ──────────────────────────────────────
  {
    from: '/product-category/digital-pianos',
    toUrl: '/pianos/digital',
    notes: '[WooCommerce/Category] Legacy product-category URL',
  },
  {
    from: '/product-category/grand-pianos',
    toUrl: '/pianos/grand',
    notes: '[WooCommerce/Category] Legacy product-category URL',
  },
  {
    from: '/product-category/upright-pianos',
    toUrl: '/pianos/upright',
    notes: '[WooCommerce/Category] Legacy product-category URL',
  },
  {
    from: '/product-category/hybrid-pianos',
    toUrl: '/pianos/hybrid',
    notes: '[WooCommerce/Category] Legacy product-category URL',
  },
  {
    from: '/product-category/master-series',
    toUrl: '/pianos/upright',
    notes: '[WooCommerce/Category] Legacy subcategory → upright',
  },
  {
    from: '/product-category/k-series',
    toUrl: '/pianos/upright',
    notes: '[WooCommerce/Category] Legacy subcategory → upright',
  },
  {
    from: '/product-category/gl-series',
    toUrl: '/pianos/grand',
    notes: '[WooCommerce/Category] Legacy subcategory → grand',
  },
  {
    from: '/product-category/gx-series',
    toUrl: '/pianos/grand',
    notes: '[WooCommerce/Category] Legacy subcategory → grand',
  },
  {
    from: '/product-category/ca-series',
    toUrl: '/pianos/digital',
    notes: '[WooCommerce/Category] Legacy subcategory → digital',
  },
  {
    from: '/product-category/cn-series',
    toUrl: '/pianos/digital',
    notes: '[WooCommerce/Category] Legacy subcategory → digital',
  },
  {
    from: '/product-category/es-series',
    toUrl: '/pianos/digital',
    notes: '[WooCommerce/Category] Legacy subcategory → digital',
  },
  {
    from: '/product-category/mp-series',
    toUrl: '/pianos/digital',
    notes: '[WooCommerce/Category] Legacy subcategory → digital',
  },
  {
    from: '/product-category/novus-series',
    toUrl: '/pianos/hybrid',
    notes: '[WooCommerce/Category] Legacy subcategory → hybrid',
  },
  {
    from: '/product-category/shigeru-kawai',
    toUrl: '/shigeru',
    notes: '[WooCommerce/Category] Legacy subcategory → Shigeru hub',
  },
  {
    from: '/product-category/upright-pianos/anytime-pianos',
    toUrl: '/pianos/anytime-pianos',
    notes: '[WooCommerce/Category] Legacy nested subcategory',
  },

  // ─── WooCommerce Product Tags ──────────────────────────────────────────────
  {
    from: '/product-tag/es7-digital-piano',
    toUrl: '/pianos/digital',
    notes: '[WooCommerce/Tag] Legacy product tag → digital',
  },
  {
    from: '/product-tag/digital-piano',
    toUrl: '/pianos/digital',
    notes: '[WooCommerce/Tag] Legacy product tag → digital',
  },
  {
    from: '/product-tag/grand-piano',
    toUrl: '/pianos/grand',
    notes: '[WooCommerce/Tag] Legacy product tag → grand',
  },
  {
    from: '/product-tag/upright-piano',
    toUrl: '/pianos/upright',
    notes: '[WooCommerce/Tag] Legacy product tag → upright',
  },
  {
    from: '/product-tag/hybrid-piano',
    toUrl: '/pianos/hybrid',
    notes: '[WooCommerce/Tag] Legacy product tag → hybrid',
  },
  {
    from: '/product-tag/shigeru-kawai',
    toUrl: '/shigeru',
    notes: '[WooCommerce/Tag] Legacy product tag → Shigeru hub',
  },

  // ─── Artists ──────────────────────────────────────────────────────────────
  {
    from: '/artists/acoustic-piano',
    toUrl: '/artists',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/alina-uddin',
    toUrl: '/artists/alina-uddin',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/aysedeniz-gokcin',
    toUrl: '/artists/aysedeniz-gokcin',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/dan-haerle',
    toUrl: '/artists/dan-haerle',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/danny-guerrero',
    toUrl: '/artists/danny-guerrero',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/david-arnay',
    toUrl: '/artists/david-arnay',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/joe-yamada',
    toUrl: '/artists/joe-yamada',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/joey-lieber',
    toUrl: '/artists/joey-lieber',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/john-paul-kaplan',
    toUrl: '/artists/john-paul-kaplan',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/junko-ueno-garrett',
    toUrl: '/artists/junko-ueno-garrett',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/mike-jones',
    toUrl: '/artists/mike-jones',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/neil-sedaka',
    toUrl: '/artists/neil-sedaka',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/nichole-nordeman',
    toUrl: '/artists/nichole-nordeman',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/phil-thompson',
    toUrl: '/artists/phil-thompson',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/tim-glemser',
    toUrl: '/artists/tim-glemser',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/acoustic-piano/yuko-maruyama',
    toUrl: '/artists/yuko-maruyama',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/craig-morris',
    toUrl: '/artists/craig-morris',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/david-witham',
    toUrl: '/artists/david-witham',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/isha-love',
    toUrl: '/artists/isha-love',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/jason-d-williams',
    toUrl: '/artists/jason-d-williams',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/jon-carin',
    toUrl: '/artists/jon-carin',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/joshua-levy',
    toUrl: '/artists/joshua-levy',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/marty-grebb',
    toUrl: '/artists/marty-grebb',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/muse',
    toUrl: '/artists/muse',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/onerepublic',
    toUrl: '/artists/onerepublic',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/scars-on-45',
    toUrl: '/artists/scars-on-45',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/stephen-large',
    toUrl: '/artists/stephen-large',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/digital-piano/steve-nieve',
    toUrl: '/artists/steve-nieve',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },
  {
    from: '/artists/piano/steven-curtis-chapman',
    toUrl: '/artists/steven-curtis-chapman',
    notes: '[Artists] Old site nested under /artists/[type]/; new site uses /artists/slug',
  },

  // ─── CMS Pages — Top-level ───────────────────────────────────────────────
  {
    from: '/acoustic-pianos',
    toUrl: '/pianos/grand',
    notes: '[CMS] GSC 404 export; top-level → /pianos/grand',
  },
  {
    from: '/archive-2010',
    toUrl: '/',
    notes: '[CMS] Very old archive page; redirect to homepage',
  },
  {
    from: '/ccpa',
    toUrl: '/about',
    notes: '[CMS] No CCPA page in sitemap; redirect to /about',
  },
  {
    from: '/contact-us',
    toUrl: '/contact',
    notes: '[CMS] Updated: new site has /contact page',
  },
  {
    from: '/dealer_locator',
    toUrl: '/find-a-dealer',
    notes: '[CMS] Old static URL → /find-a-dealer',
  },
  {
    from: '/digital',
    toUrl: '/pianos/digital',
    notes: '[CMS] Very old nav; redirect to /pianos/digital',
  },
  {
    from: '/digital-pianos',
    toUrl: '/pianos/digital',
    notes: '[CMS] GSC 404 export; top-level → /pianos/digital',
  },
  {
    from: '/faqs',
    toUrl: '/faq',
    notes: '[CMS] New site uses /faq (singular)',
  },
  {
    from: '/grand',
    toUrl: '/pianos/grand',
    notes: '[CMS] Very old nav; redirect to /pianos/grand',
  },
  {
    from: '/hybrid',
    toUrl: '/pianos/hybrid',
    notes: '[CMS] Very old nav; redirect to /pianos/hybrid',
  },
  {
    from: '/institutions',
    toUrl: '/pianos/institutional',
    notes: '[CMS] Redirect to institutional page in sitemap',
  },
  {
    from: '/kawai_artists',
    toUrl: '/artists',
    notes: '[CMS] Old WP URL; redirect to /artists',
  },
  {
    from: '/main_links',
    toUrl: '/pianos',
    notes: '[CMS] Old nav root → /pianos',
  },
  {
    from: '/modules-sequencers-drum-machines-amps-owners-manual',
    toUrl: '/faq',
    notes: '[CMS] Old legacy page; redirect to /faq',
  },
  {
    from: '/namm-2025',
    toUrl: '/namm-2026',
    notes: '[CMS] GSC 404 export; previous NAMM page → current /namm-2026',
  },
  {
    from: '/privacy-policy',
    toUrl: '/about',
    notes: '[CMS] Not in sitemap; redirect to /about',
  },
  {
    from: '/shigeru-kawai',
    toUrl: '/pianos/shigeru-kawai',
    notes: '[CMS] GSC 404 export; top-level → /pianos/shigeru-kawai',
  },
  {
    from: '/shigeru-kawai/sk-ex',
    toUrl: '/pianos/shigeru-kawai/sk-ex',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/shop',
    toUrl: '/pianos',
    notes: '[CMS] GSC 404 export; old shop → /pianos',
  },
  {
    from: '/upright',
    toUrl: '/pianos/upright',
    notes: '[CMS] Very old nav; redirect to /pianos/upright',
  },

  // ─── CMS Pages — Blog / Category ─────────────────────────────────────────
  {
    from: '/category/blog',
    toUrl: '/blog',
    notes: '[CMS] WP blog category → /blog',
  },
  {
    from: '/category/company',
    toUrl: '/company',
    notes: '[CMS] WP category → /company',
  },
  {
    from: '/category/company/awards',
    toUrl: '/company/awards',
    notes: '[CMS] WP subcategory → /company/awards',
  },
  {
    from: '/category/company/shigeru-kawai',
    toUrl: '/pianos/shigeru-kawai',
    notes: '[CMS] WP category → Shigeru Kawai page',
  },
  {
    from: '/category/institutions',
    toUrl: '/pianos/institutional',
    notes: '[CMS] WP category → institutional page',
  },
  {
    from: '/category/news',
    toUrl: '/news',
    notes: '[CMS] WP news category → /news',
  },
  {
    from: '/category/pianos',
    toUrl: '/pianos',
    notes: '[CMS] WP pianos category → /pianos',
  },
  {
    from: '/category/pianos/digital-pianos',
    toUrl: '/pianos/digital',
    notes: '[CMS] WP subcategory → /pianos/digital',
  },
  {
    from: '/category/pianos/grand-pianos',
    toUrl: '/pianos/grand',
    notes: '[CMS] WP subcategory → /pianos/grand',
  },
  {
    from: '/category/pianos/hybrid',
    toUrl: '/pianos/hybrid',
    notes: '[CMS] WP subcategory → /pianos/hybrid',
  },
  {
    from: '/category/pianos/upright-pianos',
    toUrl: '/pianos/upright',
    notes: '[CMS] WP subcategory → /pianos/upright',
  },
  {
    from: '/category/technical-support-division',
    toUrl: '/technical-support-division',
    notes: '[CMS] WP category → TSD page',
  },
  {
    from: '/category/technical-support-division/faq',
    toUrl: '/faq',
    notes: '[CMS] WP subcategory → /faq',
  },
  {
    from: '/category/technology',
    toUrl: '/technology',
    notes: '[CMS] WP category → /technology',
  },

  // ─── CMS Pages — Company ─────────────────────────────────────────────────
  {
    from: '/company/hirotaka-kawai',
    toUrl: '/about/heritage/hirotaka-kawai',
    notes: 'Third-president bio relocated under About > Heritage',
  },
  {
    from: '/company/kawai-heritage',
    toUrl: '/about/heritage',
    notes: '[CMS] Not in sitemap; heritage → /about/heritage',
  },
  {
    from: '/company/kentaro-kawai',
    toUrl: '/about/heritage/kentaro-kawai',
    notes: 'Fourth-president bio relocated under About > Heritage',
  },
  {
    from: '/company/ryuyo-grand-piano-factory',
    toUrl: '/about/craftsmanship',
    notes: '[CMS] Not in sitemap; Ryuyo factory → /about/craftsmanship',
  },
  {
    from: '/company/koichi-kawai',
    toUrl: '/about/heritage/koichi-kawai',
    notes: 'Founder page relocated under the About > Heritage umbrella',
  },
  {
    from: '/company/shigeru-kawai',
    toUrl: '/about/heritage/shigeru-kawai',
    notes: 'Shigeru Kawai (the man) → heritage bio (distinct from /pianos/shigeru-kawai line)',
  },
  {
    from: '/company/timeline',
    toUrl: '/about/heritage',
    notes: '[CMS] Not in sitemap; company timeline → /about/heritage',
  },

  // ─── CMS Pages — Digital legacy sections ─────────────────────────────────
  {
    from: '/digital/ca',
    toUrl: '/pianos/ca-series',
    notes: '[CMS] Old static CA landing → CA series page',
  },
  {
    from: '/digital/ca/om',
    toUrl: '/faq',
    notes: '[CMS] Old owner manuals dir → /faq',
  },
  {
    from: '/digital/cn',
    toUrl: '/pianos/cn-series',
    notes: '[CMS] Old static CN landing → CN series',
  },
  {
    from: '/digital/cnx7',
    toUrl: '/pianos/cn-series',
    notes: '[CMS] Old CNX7 series → CN series',
  },
  {
    from: '/digital/cp',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[CMS] Old CP stage piano → MP stage pianos',
  },
  {
    from: '/digital/cs',
    toUrl: '/pianos/novus-series',
    notes: '[CMS] Old CS hybrid → Novus series as closest match',
  },
  {
    from: '/digital/cs/brochure',
    toUrl: '/faq',
    notes: '[CMS] Old brochure dir → /faq',
  },
  {
    from: '/digital/cs/om',
    toUrl: '/faq',
    notes: '[CMS] Old owner manual dir → /faq',
  },
  {
    from: '/digital/features',
    toUrl: '/pianos/digital',
    notes: '[CMS] Old features section → /pianos/digital',
  },
  {
    from: '/digital/klcs',
    toUrl: '/pianos/institutional',
    notes: '[CMS] Old KLCS classroom system → institutional',
  },
  {
    from: '/digital/mp',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[CMS] Old MP landing → MP stage pianos',
  },
  {
    from: '/digital/other',
    toUrl: '/pianos/digital',
    notes: '[CMS] Old "other digitals" → /pianos/digital',
  },
  {
    from: '/digital/portable',
    toUrl: '/pianos/es-series',
    notes: '[CMS] Old portable landing → ES series',
  },
  {
    from: '/digital/portable/es110',
    toUrl: '/pianos/es-series',
    notes: '[CMS] Old ES110 static page → ES series',
  },
  {
    from: '/digital/vpc1',
    toUrl: '/pianos/digital',
    notes: '[CMS] Old VPC1 static page → /pianos/digital',
  },

  // ─── CMS Pages — Find a Dealer ────────────────────────────────────────────
  {
    from: '/find-a-dealer/acoustic-digital',
    toUrl: '/find-a-dealer',
    notes: '[CMS] Sub-page; redirect to parent',
  },
  {
    from: '/find-a-dealer/professional-product-dealer',
    toUrl: '/find-a-dealer',
    notes: '[CMS] Sub-page; redirect to parent',
  },

  // ─── CMS Pages — Guides ──────────────────────────────────────────────────
  {
    from: '/guides/acoustic-piano',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/digital-care',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/digital-piano',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/first-piano',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/home-setup',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; sub-page → /guides',
  },
  {
    from: '/guides/professional',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; sub-page → /guides',
  },

  // ─── CMS Pages — Hybrid legacy sections ───────────────────────────────────
  {
    from: '/hybrid/nv10',
    toUrl: '/pianos/novus-series',
    notes: '[CMS] Old NV10 static page → Novus series',
  },

  // ─── CMS Pages — Institutions ─────────────────────────────────────────────
  {
    from: '/institutions/epic-program/conservatoire-de-musique',
    toUrl: '/institutions/epic-program',
    notes: '[CMS] Deep sub-page → EPIC program parent',
  },

  // ─── CMS Pages — Learn ────────────────────────────────────────────────────
  {
    from: '/learn/acoustic-vs-digital',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; /learn/ section → /guides',
  },
  {
    from: '/learn/heritage',
    toUrl: '/about/heritage',
    notes: '[CMS] GSC 404 export; heritage → /about/heritage',
  },
  {
    from: '/learn/kawai-innovation',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; /learn/ section → /technology',
  },
  {
    from: '/learn/kawai-story',
    toUrl: '/company',
    notes: '[CMS] GSC 404 export; /learn/ section → /company',
  },
  {
    from: '/learn/millennium-action',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; /learn/ section → /technology',
  },
  {
    from: '/learn/piano-basics',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; /learn/ section → /guides',
  },
  {
    from: '/learn/piano-types',
    toUrl: '/guides',
    notes: '[CMS] GSC 404 export; /learn/ section → /guides',
  },

  // ─── CMS Pages — Main Links (legacy nav) ─────────────────────────────────
  {
    from: '/main_links/about_us',
    toUrl: '/about',
    notes: '[CMS] Old legacy about_us → /about',
  },
  {
    from: '/main_links/d-owners',
    toUrl: '/distinguished-owners',
    notes: '[CMS] Old legacy d-owners → /distinguished-owners',
  },
  {
    from: '/main_links/epic',
    toUrl: '/institutions/epic-program',
    notes: '[CMS] Old legacy epic → /institutions/epic-program',
  },
  {
    from: '/main_links/epic/testimonial_video',
    toUrl: '/institutions/testimonial-videos',
    notes: '[CMS] Old testimonial video dir → testimonial-videos page',
  },
  {
    from: '/main_links/grands_09',
    toUrl: '/pianos/grand',
    notes: '[CMS] 2009 era grand pianos page → /pianos/grand',
  },
  {
    from: '/main_links/institutional',
    toUrl: '/pianos/institutional',
    notes: '[CMS] Old institutional nav → institutional page',
  },
  {
    from: '/main_links/why_kawai',
    toUrl: '/about',
    notes: '[CMS] Old why_kawai section → /about',
  },

  // ─── CMS Pages — Pianos (legacy sub-paths) ────────────────────────────────
  {
    from: '/pianos/acoustic-vs-digital-pianos',
    toUrl: '/guides',
    notes: '[CMS] Redirect to /guides page',
  },
  {
    from: '/pianos/digital-pianos',
    toUrl: '/pianos/digital',
    notes: '[CMS] Redirect to /pianos/digital',
  },
  {
    from: '/pianos/digital-pianos/alfred-lessons',
    toUrl: '/pianos/digital',
    notes: '[CMS] Sub-page; redirect to /pianos/digital',
  },
  {
    from: '/pianos/digital-pianos/bluetooth',
    toUrl: '/pianos/digital',
    notes: '[CMS] Sub-page; redirect to /pianos/digital',
  },
  {
    from: '/pianos/digital-pianos/ca-series',
    toUrl: '/pianos/ca-series',
    notes: '[CMS] Redirect to CA series page',
  },
  {
    from: '/pianos/digital-pianos/ce-kdp-kcp-cl-digitals',
    toUrl: '/pianos/kdp-series',
    notes: '[CMS] Redirect to KDP series as closest match',
  },
  {
    from: '/pianos/digital-pianos/cn-series',
    toUrl: '/pianos/cn-series',
    notes: '[CMS] Redirect to CN series page',
  },
  {
    from: '/pianos/digital-pianos/concert-magic',
    toUrl: '/faq/what-is-the-concert-magic-function',
    notes: '[CMS] FAQ entry exists',
  },
  {
    from: '/pianos/digital-pianos/mp-series',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[CMS] Redirect to MP stage pianos page',
  },
  {
    from: '/pianos/don-mannino-golden-hammer',
    toUrl: '/about',
    notes: '[CMS] Old promo page; redirect to /about',
  },
  {
    from: '/pianos/grand-pianos',
    toUrl: '/pianos/grand',
    notes: '[CMS] Redirect to /pianos/grand',
  },
  {
    from: '/pianos/grand-pianos/gl-series',
    toUrl: '/pianos/gl-series',
    notes: '[CMS] Exact series page exists',
  },
  {
    from: '/pianos/grand-pianos/gx-blak-series',
    toUrl: '/pianos/gx-series',
    notes: '[CMS] Redirect to GX series page',
  },
  {
    from: '/pianos/grand-pianos/gx-series',
    toUrl: '/pianos/gx-series',
    notes: '[CMS] Exact match',
  },
  {
    from: '/pianos/upright-pianos',
    toUrl: '/pianos/upright',
    notes: '[CMS] Redirect to /pianos/upright',
  },

  // ─── CMS Pages — Support ─────────────────────────────────────────────────
  {
    from: '/support',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export; support (renamed)',
  },
  {
    from: '/support/crating-guidelines',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/es120-midi-specs',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/firmware',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/kb',
    toUrl: '/faq',
    notes: '[CMS] GSC 404 export; knowledge base → /faq',
  },
  {
    from: '/support/manuals',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/service-bulletins',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/tech-notes',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/technical',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/technical-guides',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/technotes',
    toUrl: '/technical-support-division',
    notes: '[CMS] GSC 404 export; alt spelling',
  },
  {
    from: '/support/warranty',
    toUrl: '/warranty',
    notes: '[CMS] GSC 404 export',
  },
  {
    from: '/support/warranty-repairs',
    toUrl: '/warranty',
    notes: '[CMS] GSC 404 export',
  },

  // ─── CMS Pages — Technical Support Division ──────────────────────────────
  {
    from: '/technical-support-division/contact-us',
    toUrl: '/contact',
    notes: '[CMS] GSC 404 export; TSD contact sub-page → /contact',
  },
  {
    from: '/technical-support-division/software-os',
    toUrl: '/technical-support-division',
    notes: '[CMS] Sub-page; redirect to TSD parent',
  },
  {
    from: '/technical-support-division/warranty-repairs',
    toUrl: '/warranty',
    notes: '[CMS] GSC 404 export; TSD sub-page → /warranty',
  },

  // ─── CMS Pages — Technology ──────────────────────────────────────────────
  {
    from: '/technology/abs-carbon',
    toUrl: '/technology/abs',
    notes: '[CMS] GSC 404 export; ABS Carbon variant → /technology/abs',
  },
  {
    from: '/technology/abs/the-critics',
    toUrl: '/technology/abs',
    notes: '[CMS] Sub-page; redirect to ABS parent',
  },
  {
    from: '/technology/abs/the-evidence-1',
    toUrl: '/technology/abs',
    notes: '[CMS] Sub-page',
  },
  {
    from: '/technology/abs/the-evidence-2',
    toUrl: '/technology/abs',
    notes: '[CMS] Sub-page',
  },
  {
    from: '/technology/abs/the-evidence-3',
    toUrl: '/technology/abs',
    notes: '[CMS] Sub-page',
  },
  {
    from: '/technology/abs/the-solution',
    toUrl: '/technology/abs',
    notes: '[CMS] Sub-page',
  },
  {
    from: '/technology/abs/the-symptoms',
    toUrl: '/technology/abs',
    notes: '[CMS] Sub-page',
  },
  {
    from: '/technology/abs/the-truth',
    toUrl: '/technology/abs',
    notes: '[CMS] Sub-page',
  },
  {
    from: '/technology/grand-feel-iii',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; Grand Feel III → /technology',
  },
  {
    from: '/technology/millennium-iii',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; Millennium III → /technology',
  },
  {
    from: '/technology/phi',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; PHI → /technology',
  },
  {
    from: '/technology/shs',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; SHS → /technology',
  },
  {
    from: '/technology/sk-ex-rendering',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; SK-EX Rendering → /technology',
  },
  {
    from: '/technology/soundboard-speaker-',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; truncated URL → /technology',
  },
  {
    from: '/technology/wooden-',
    toUrl: '/technology',
    notes: '[CMS] GSC 404 export; truncated URL → /technology',
  },

  // ─── Blog / News (/news/ → /blog/) ───────────────────────────────────────
  {
    from: '/news/11-finalists-chose-shigeru-kawai-at-the-2025-chopin-competition-heres-why',
    toUrl: '/blog/11-finalists-chose-shigeru-kawai-at-the-2025-chopin-competition-heres-why',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/an-interview-with-vladimir-petrov-the-runner-up-of-the-nashville-international-chopin-piano-competition-on-a-shigeru-kawai',
    toUrl: '/blog/an-interview-with-vladimir-petrov-the-runner-up-of-the-nashville-international-chopin-piano-competition-on-a-shigeru-kawai',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/best-digital-piano-under-500-kawais-premium-sound-quality-at-budget-prices',
    toUrl: '/blog/best-digital-piano-under-500-kawais-premium-sound-quality-at-budget-prices',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/dallas-x-kawai-university-of-texas-showroom-event',
    toUrl: '/blog/dallas-x-kawai-university-of-texas-showroom-event',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/free-delivery-at-kawai-denver-colorados-official-storefront',
    toUrl: '/blog/free-delivery-at-kawai-denver-colorados-official-storefront',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/hando-nakhur-kawai-dallas-christmas-concert-december-7th-2025',
    toUrl: '/blog/hando-nakhur-kawai-dallas-christmas-concert-december-7th-2025',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/interview-with-vincent-ong-5th-prize-winner-of-19th-international-chopin-piano-competition',
    toUrl: '/blog/interview-with-vincent-ong-5th-prize-winner-of-19th-international-chopin-piano-competition',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/introducing-the-kawai-master-series-upright-pianos',
    toUrl: '/blog/introducing-the-kawai-master-series-upright-pianos',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/jose-iturbi-competition',
    toUrl: '/blog/jose-iturbi-competition',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-60th-anniversary',
    toUrl: '/blog/kawai-60th-anniversary',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-announces-namm-2026-artist-performances',
    toUrl: '/blog/kawai-announces-namm-2026-artist-performances',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/kawai-at-namm-2026-exclusive-event-giveaways-at-this-years-booth',
    toUrl: '/blog/kawai-at-namm-2026-exclusive-event-giveaways-at-this-years-booth',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/kawai-cn201-cn301-digital-pianos',
    toUrl: '/blog/kawai-cn201-cn301-digital-pianos',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-dg30-digital-piano-launch',
    toUrl: '/blog/kawai-dg30-digital-piano-launch',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-es-120-digital-piano',
    toUrl: '/blog/kawai-es-120-digital-piano',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-mp-series-pro-digital-keyboard-line',
    toUrl: '/blog/kawai-mp-series-pro-digital-keyboard-line',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/kawai-pianos-partners-with-musicians-institute-to-empower-the-next-generation-of-contemporary-musicians',
    toUrl: '/blog/kawai-pianos-partners-with-musicians-institute-to-empower-the-next-generation-of-contemporary-musicians',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/kawai-x-roli-official-collaboration',
    toUrl: '/blog/kawai-x-roli-official-collaboration',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/meet-guangbin-wang-the-blind-pianist-who-chose-shigeru-kawai-to-win-the-2025-nashville-international-chopin-piano-competition',
    toUrl: '/blog/meet-guangbin-wang-the-blind-pianist-who-chose-shigeru-kawai-to-win-the-2025-nashville-international-chopin-piano-competition',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/namm-2026-recap-kawais-booth-features-american-idol-winner-rising-artists',
    toUrl: '/blog/namm-2026-recap-kawais-booth-features-american-idol-winner-rising-artists',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/namm-show-2023',
    toUrl: '/blog/namm-show-2023',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/piotr-alexewicz-5th-prize-audience-prize-winner-at-the-19th-international-chopin-piano-competition',
    toUrl: '/blog/piotr-alexewicz-5th-prize-audience-prize-winner-at-the-19th-international-chopin-piano-competition',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/shigeru-kawai-julien-cohen-bohemian-rhapsody-flashmob',
    toUrl: '/blog/shigeru-kawai-julien-cohen-bohemian-rhapsody-flashmob',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/shigeru-kawai-sk-ex-shines-at-thomas-f-hulbert-international-piano-competition-2025',
    toUrl: '/blog/shigeru-kawai-sk-ex-shines-at-thomas-f-hulbert-international-piano-competition-2025',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },
  {
    from: '/news/shigeru-kawai-sk-ex-takes-1st-and-2nd-at-the-6th-takamatsu-international-piano-competition',
    toUrl: '/blog/shigeru-kawai-sk-ex-takes-1st-and-2nd-at-the-6th-takamatsu-international-piano-competition',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/takanori-aoki',
    toUrl: '/blog/takanori-aoki',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/the-piano-that-gave-3-finalists-an-edge-at-the-2025-chopin-competition',
    toUrl: '/blog/the-piano-that-gave-3-finalists-an-edge-at-the-2025-chopin-competition',
    notes: '[Blog] GSC export; /news/ → /blog/',
  },
  {
    from: '/news/zitong-wang-international-chopin-piano-competition-winner',
    toUrl: '/blog/zitong-wang-international-chopin-piano-competition-winner',
    notes: '[Blog] /news/ → /blog/; verify post exists',
  },

  // ─── GSC "Crawled — currently not indexed" export 2026-07-09 ─────────────
  // Legacy WordPress-era URLs Google still recrawls. Destinations verified
  // against the live sitemap on 2026-07-09 — every toUrl below exists.
  // Deliberately NOT redirected (allowed to hard-404): /wp-content/*, /tag/*,
  // /digital/*.pdf|.html static assets, ?p= query URLs, and malformed paths.

  // Old flat digital-piano product URLs
  {
    from: '/digital-pianos/es120',
    toUrl: '/products/kawai-es120-digital-piano',
    notes: '[GSC-2026-07] Legacy flat product URL',
  },
  {
    from: '/digital-pianos/es920',
    toUrl: '/products/kawai-es920-digital-piano',
    notes: '[GSC-2026-07] Legacy flat product URL',
  },

  // Old /news/* posts
  {
    from: '/news/ca-series-digital-pianos-ca79-ca99',
    toUrl: '/pianos/ca-series',
    notes: '[GSC-2026-07] CA79/CA99 news post → CA series collection',
  },
  {
    from: '/news/editors-choice-award-2024',
    toUrl: '/company/awards',
    notes: '[GSC-2026-07] Award news post → awards page',
  },
  {
    from: '/news/kawai-celebrates-hazel-scott-and-don-shirley',
    toUrl: '/blog/kawai-celebrates-hazel-scott-and-don-shirley',
    notes: '[GSC-2026-07] /news/ → /blog/ (post exists)',
  },
  {
    from: '/news/music-inc-awards-gx2',
    toUrl: '/company/awards',
    notes: '[GSC-2026-07] Award news post → awards page',
  },

  // Old nested /pianos/* content pages
  {
    from: '/pianos/digital-piano-buyers-guide',
    toUrl: '/guides/digital-piano',
    notes: '[GSC-2026-07] Old buyers guide → current guide',
  },
  {
    from: '/pianos/digital-pianos/ca-99-product-excellence-award',
    toUrl: '/company/awards',
    notes: '[GSC-2026-07] Award page → awards hub',
  },
  {
    from: '/pianos/digital-pianos/ca65-ca95',
    toUrl: '/pianos/ca-series',
    notes: '[GSC-2026-07] Discontinued CA65/CA95 → CA series',
  },
  {
    from: '/pianos/grand-pianos/gl-series-grand-pianos',
    toUrl: '/pianos/gl-series',
    notes: '[GSC-2026-07] Old GL series URL (2-word slug not covered by next.config pattern)',
  },
  {
    from: '/pianos/grand-pianos/gl-series-mmr-award',
    toUrl: '/company/awards',
    notes: '[GSC-2026-07] Award page → awards hub',
  },
  {
    from: '/pianos/grand-pianos/gx-2-award',
    toUrl: '/company/awards',
    notes: '[GSC-2026-07] Award page → awards hub',
  },
  {
    from: '/pianos/hybrid-pianos',
    toUrl: '/pianos/hybrid',
    notes: '[GSC-2026-07] Old hybrid category (bare, no slug — next.config pattern needs a slug)',
  },
  {
    from: '/pianos/hybrid/aures-hybrid',
    toUrl: '/pianos/aures',
    notes: '[GSC-2026-07] AURES hybrid line → aures collection',
  },
  {
    from: '/pianos/hybrid/aures-hybrid/gx-2-aures-2',
    toUrl: '/products/kawai-gx-2-aures-2-hybrid-piano',
    notes: '[GSC-2026-07] GX-2 AURES 2 product',
  },
  {
    from: '/pianos/hybrid/aures-hybrid/k-300-aures-2',
    toUrl: '/products/kawai-k-300-aures-2-hybrid-piano',
    notes: '[GSC-2026-07] K-300 AURES 2 product',
  },
  {
    from: '/pianos/hybrid/kawai-k300-aures-hybrid',
    toUrl: '/products/kawai-k300-aures-hybrid-upright-piano',
    notes: '[GSC-2026-07] K300 AURES product',
  },
  {
    from: '/pianos/hybrid/kawai-novus-nv5-award',
    toUrl: '/company/awards',
    notes: '[GSC-2026-07] Award page → awards hub',
  },
  {
    from: '/pianos/hybrid/novus-hybrid',
    toUrl: '/pianos/novus-series',
    notes: '[GSC-2026-07] NOVUS line → novus-series collection',
  },
  {
    from: '/pianos/hybrid/novus-hybrid/nv10s',
    toUrl: '/pianos/novus-series',
    notes: '[GSC-2026-07] NV10S has no standalone product page → series',
  },
  {
    from: '/pianos/hybrid/novus-hybrid/nv5s',
    toUrl: '/pianos/novus-series',
    notes: '[GSC-2026-07] NV5S has no standalone product page → series',
  },
  {
    from: '/pianos/hybrid/novus-series',
    toUrl: '/pianos/novus-series',
    notes: '[GSC-2026-07] /pianos/hybrid/ prefix not in next.config pattern',
  },
  {
    from: '/pianos/ryuyo-piano-factory',
    toUrl: '/shigeru/about',
    notes: '[GSC-2026-07] Ryuyo factory content lives on Shigeru about page',
  },
  {
    from: '/pianos/upright-pianos/designer-series',
    toUrl: '/pianos/console',
    notes: '[GSC-2026-07] Designer (furniture-style) uprights → console collection',
  },
  {
    from: '/pianos/upright-pianos/institutional-series',
    toUrl: '/pianos/institutional',
    notes: '[GSC-2026-07] Institutional uprights → institutional collection',
  },
  {
    from: '/pianos/upright-pianos/k-series/specs',
    toUrl: '/pianos/k-series',
    notes: '[GSC-2026-07] 2-segment path not covered by next.config pattern',
  },

  // Old WooCommerce /product-category/* taxonomy
  {
    from: '/product-category/accessories',
    toUrl: '/accessories',
    notes: '[GSC-2026-07] WooCommerce category',
  },
  {
    from: '/product-category/digital-piano',
    toUrl: '/pianos/digital',
    notes: '[GSC-2026-07] WooCommerce category',
  },
  {
    from: '/product-category/digital-piano/cl-series',
    toUrl: '/pianos/digital',
    notes: '[GSC-2026-07] Discontinued CL series → digital category',
  },
  {
    from: '/product-category/digital-piano/cs-series',
    toUrl: '/pianos/cs-series',
    notes: '[GSC-2026-07] WooCommerce category → CS series collection',
  },
  {
    from: '/product-category/digital-piano/page/2',
    toUrl: '/pianos/digital',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/grand-pianos/crystal-grand-piano',
    toUrl: '/pianos/crystal-grand-piano',
    notes: '[GSC-2026-07] Crystal grand → collection',
  },
  {
    from: '/product-category/grand-pianos/page/1',
    toUrl: '/pianos/grand',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/grand-pianos/page/2',
    toUrl: '/pianos/grand',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/hybrid/page/1',
    toUrl: '/pianos/hybrid',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/legacy-pianos',
    toUrl: '/pianos',
    notes: '[GSC-2026-07] Legacy/discontinued archive → pianos hub',
  },
  {
    from: '/product-category/legacy-pianos/page/1',
    toUrl: '/pianos',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/legacy-pianos/page/2',
    toUrl: '/pianos',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/legacy-pianos/page/3',
    toUrl: '/pianos',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/legacy-pianos/page/5',
    toUrl: '/pianos',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/pianos/upright-pianos',
    toUrl: '/pianos/upright',
    notes: '[GSC-2026-07] WooCommerce category',
  },
  {
    from: '/product-category/pianos/upright-pianos/page/2',
    toUrl: '/pianos/upright',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/upright-pianos/page/1',
    toUrl: '/pianos/upright',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },
  {
    from: '/product-category/upright-pianos/page/2',
    toUrl: '/pianos/upright',
    notes: '[GSC-2026-07] WooCommerce pagination',
  },

  // Old WooCommerce /product-tag/* pages — mapped to the model's product page
  // where one exists, otherwise to the model's series collection
  {
    from: '/product-tag/ca-series-digital-pianos',
    toUrl: '/pianos/ca-series',
    notes: '[GSC-2026-07] Tag → CA series',
  },
  {
    from: '/product-tag/ca98-digital-piano',
    toUrl: '/pianos/ca-series',
    notes: '[GSC-2026-07] Discontinued CA98 → CA series',
  },
  {
    from: '/product-tag/cn25',
    toUrl: '/pianos/cn-series',
    notes: '[GSC-2026-07] Discontinued CN25 → CN series',
  },
  {
    from: '/product-tag/cs11-digital-piano/feed',
    toUrl: '/pianos/cs-series',
    notes: '[GSC-2026-07] Discontinued CS11 (RSS feed URL) → CS series',
  },
  {
    from: '/product-tag/dg30',
    toUrl: '/pianos/digital-grand',
    notes: '[GSC-2026-07] DG30 → digital grand collection',
  },
  {
    from: '/product-tag/es520',
    toUrl: '/pianos/es-series',
    notes: '[GSC-2026-07] ES520 has no product page → ES series',
  },
  {
    from: '/product-tag/gl20',
    toUrl: '/products/kawai-gl-20-baby-grand-piano',
    notes: '[GSC-2026-07] GL-20 product page exists',
  },
  {
    from: '/product-tag/gl30-atx2-upright-piano',
    toUrl: '/products/kawai-gl30-atx2-hybrid-grand-piano',
    notes: '[GSC-2026-07] GL30 ATX2 product page exists',
  },
  {
    from: '/product-tag/kawai-ca65-digital-piano',
    toUrl: '/pianos/ca-series',
    notes: '[GSC-2026-07] Discontinued CA65 → CA series',
  },
  {
    from: '/product-tag/kawai-ca78',
    toUrl: '/pianos/ca-series',
    notes: '[GSC-2026-07] Discontinued CA78 → CA series',
  },
  {
    from: '/product-tag/kawai-cn25',
    toUrl: '/pianos/cn-series',
    notes: '[GSC-2026-07] Discontinued CN25 → CN series',
  },
  {
    from: '/product-tag/kawai-cn34',
    toUrl: '/pianos/cn-series',
    notes: '[GSC-2026-07] Discontinued CN34 → CN series',
  },
  {
    from: '/product-tag/kawai-cn34-digital-piano/feed',
    toUrl: '/pianos/cn-series',
    notes: '[GSC-2026-07] Discontinued CN34 (RSS feed URL) → CN series',
  },
  {
    from: '/product-tag/kawai-cs4-digital-piano/feed',
    toUrl: '/pianos/cs-series',
    notes: '[GSC-2026-07] Discontinued CS4 (RSS feed URL) → CS series',
  },
  {
    from: '/product-tag/kawai-gl20/feed',
    toUrl: '/products/kawai-gl-20-baby-grand-piano',
    notes: '[GSC-2026-07] GL-20 (RSS feed URL) → product page',
  },
  {
    from: '/product-tag/kawai-kdp90-digital-piano/feed',
    toUrl: '/pianos/kdp-series',
    notes: '[GSC-2026-07] Discontinued KDP90 (RSS feed URL) → KDP series',
  },
  {
    from: '/product-tag/kawai-mp11-digital-piano',
    toUrl: '/products/kawai-mp11-digital-piano',
    notes: '[GSC-2026-07] MP11 product page exists',
  },
  {
    from: '/product-tag/kawai-mp5',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[GSC-2026-07] Discontinued MP5 → MP stage pianos',
  },
  {
    from: '/product-tag/kawai-novus-nv5/feed',
    toUrl: '/pianos/novus-series',
    notes: '[GSC-2026-07] NV5 (RSS feed URL) → NOVUS series',
  },
  {
    from: '/product-tag/kawai-ust9',
    toUrl: '/pianos/institutional',
    notes: '[GSC-2026-07] UST-9 institutional upright → institutional collection',
  },
  {
    from: '/product-tag/mp10-digital-piano',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[GSC-2026-07] Discontinued MP10 → MP stage pianos',
  },
  {
    from: '/product-tag/mp7-digital-piano',
    toUrl: '/pianos/mp-stage-pianos',
    notes: '[GSC-2026-07] Discontinued MP7 → MP stage pianos',
  },
  {
    from: '/product-tag/rx6-grand-piano',
    toUrl: '/pianos/rx',
    notes: '[GSC-2026-07] Discontinued RX-6 → RX collection',
  },
  {
    from: '/product-tag/sc-1-soft-carry-case',
    toUrl: '/products/kawai-sc-1-soft-case',
    notes: '[GSC-2026-07] SC-1 case product page exists',
  },
  {
    from: '/product-tag/sc-1-soft-carry-case/feed',
    toUrl: '/products/kawai-sc-1-soft-case',
    notes: '[GSC-2026-07] SC-1 case (RSS feed URL) → product page',
  },
  {
    from: '/product-tag/sc-1-soft-case',
    toUrl: '/products/kawai-sc-1-soft-case',
    notes: '[GSC-2026-07] SC-1 case → product page',
  },

  // Malformed / campaign /product/* slugs (the generic /product/→/products/
  // rewrite lands these on non-existent slugs — exact mappings beat it because
  // middleware CMS redirects run before next.config redirects)
  {
    from: '/product/ca901-ab',
    toUrl: '/products/kawai-ca901-digital-piano',
    notes: '[GSC-2026-07] CA901 finish variant slug',
  },
  {
    from: '/product/gl-10-sale',
    toUrl: '/products/kawai-gl-10-baby-grand-piano',
    notes: '[GSC-2026-07] Old sale campaign slug',
  },
  {
    from: '/product/k-200-sale',
    toUrl: '/products/kawai-k-200-upright-piano',
    notes: '[GSC-2026-07] Old sale campaign slug',
  },
  {
    from: '/product/k-300-',
    toUrl: '/products/kawai-k-300-upright-piano',
    notes: '[GSC-2026-07] Truncated slug',
  },
  {
    from: '/product/k200-atx4/feed',
    toUrl: '/products/kawai-k200-atx4-hybrid-piano',
    notes: '[GSC-2026-07] K200 ATX4 (RSS feed URL) → product page',
  },
  {
    from: '/product/kawai-ca501-digital-',
    toUrl: '/products/kawai-ca501-digital-piano',
    notes: '[GSC-2026-07] Truncated slug',
  },
  {
    from: '/products/anymusic/atx5/tech-specs',
    toUrl: '/pianos/anytime-pianos',
    notes: '[GSC-2026-07] Ancient AnyTime static path → AnyTime collection',
  },
  {
    from: '/products/digital',
    toUrl: '/pianos/digital',
    notes: '[GSC-2026-07] Old category-ish path',
  },
  {
    from: '/products/digitalpianos/mp-series/mp11se',
    toUrl: '/products/kawai-mp11se-digital-piano',
    notes: '[GSC-2026-07] Ancient static path → MP11SE product page',
  },
  {
    from: '/products/kawai-es8-digital-',
    toUrl: '/pianos/es-series',
    notes: '[GSC-2026-07] Truncated slug; ES8 discontinued → ES series',
  },

  // Old WooCommerce /shop pagination
  {
    from: '/shop/page/1',
    toUrl: '/pianos',
    notes: '[GSC-2026-07] WooCommerce shop archive',
  },
  {
    from: '/shop/page/11',
    toUrl: '/pianos',
    notes: '[GSC-2026-07] WooCommerce shop archive',
  },
]
