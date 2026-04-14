# KAWAI Piano Website Documentation

> **Comprehensive documentation for the KAWAI Piano retail platform**
> Built with Next.js 15, Payload CMS 3.52+, and advanced media optimization

---

## Quick Navigation

| Category | Description | Path |
|----------|-------------|------|
| **Architecture** | System design, blocks, pages, TypeScript | `docs/architecture/` |
| **Features** | Feature implementation docs | `docs/features/` |
| **Fixes** | Bug fixes, debug notes, patches | `docs/fixes/` |
| **Media** | R2 storage, image optimization | `docs/media/` |
| **Styling** | Brand guidelines, design system | `docs/styling/` |
| **Integrations** | Shopify, Constant Contact, Calendly | `docs/integrations/` |
| **Migration** | Data migration tools & guides | `docs/migration/` |
| **SEO** | Search optimization, analytics, tracking | `docs/seo/` |
| **Campaigns** | NAMM, ES60, CX, promotional pages | `docs/campaigns/` |
| **CMS** | Content management guides | `docs/cms/` |
| **Reference** | Product specs, data reference | `docs/reference/` |
| **Policies** | Legal, shipping, warranty policies | `docs/policies/` |
| **Internal** | Internal notes, maintenance, todos | `docs/internal/` |
| **Presentations** | HTML presentations | `docs/presentations/` |

---

## Documentation Index

### Architecture (`docs/architecture/`)
System design and core infrastructure documentation.

- **[MULTI-SITE-SYSTEM.md](./architecture/MULTI-SITE-SYSTEM.md)** - Multi-domain architecture (US + CAD)
- **[CANADIA.md](./architecture/CANADIA.md)** - Canadian site strategy overview
- **[cad.md](./architecture/cad.md)** - Canada multi-site implementation notes
- **[AUTO_PRODUCT_GENERATION_ARCHITECTURE.md](./architecture/AUTO_PRODUCT_GENERATION_ARCHITECTURE.md)** - Product auto-generation system
- **[HEADER_SYSTEM_DOCUMENTATION.md](./architecture/HEADER_SYSTEM_DOCUMENTATION.md)** - Navigation and header system
- **[NAVIGATION_CONTEXT_SYSTEM.md](./architecture/NAVIGATION_CONTEXT_SYSTEM.md)** - Context-aware navigation (dealer location)
- **[BLOCKS.md](./architecture/BLOCKS.md)** - Block system overview and registry
- **[SIMPLIFIED_BLOCKS.md](./architecture/SIMPLIFIED_BLOCKS.md)** - Simplified block data source pattern
- **[typescript.md](./architecture/typescript.md)** - TypeScript configuration guide

#### Pages Collection (`docs/architecture/pages/`)
- **[PAGES_ARCHITECTURE_DIAGRAM.md](./architecture/pages/PAGES_ARCHITECTURE_DIAGRAM.md)** - Visual architecture diagram
- **[PAGES_COLLECTION_RENDERING.md](./architecture/pages/PAGES_COLLECTION_RENDERING.md)** - How pages render blocks
- **[PAGES_COLLECTION_SUMMARY.md](./architecture/pages/PAGES_COLLECTION_SUMMARY.md)** - Collection overview
- **[PAGES_QUICK_REFERENCE.md](./architecture/pages/PAGES_QUICK_REFERENCE.md)** - Quick reference card
- **[PAGES_ROUTING_SOLUTION.md](./architecture/pages/PAGES_ROUTING_SOLUTION.md)** - Catch-all routing solution
- **[PAGES_TESTING_CHECKLIST.md](./architecture/pages/PAGES_TESTING_CHECKLIST.md)** - Testing checklist
- **[PAGES_TESTING_GUIDE.md](./architecture/pages/PAGES_TESTING_GUIDE.md)** - Testing guide

---

### Features (`docs/features/`)
Feature implementation documentation.

#### Blocks (`docs/features/blocks/`)
- **[BOTTOM_LEFT_POPUP_BLOCK.md](./features/blocks/BOTTOM_LEFT_POPUP_BLOCK.md)** - Bottom-left popup block
- **[SIDE_NAVIGATION_BLOCK.md](./features/blocks/SIDE_NAVIGATION_BLOCK.md)** - Side navigation block
- **[SIDE_NAVIGATION_QUICK_START.md](./features/blocks/SIDE_NAVIGATION_QUICK_START.md)** - Side nav quick start
- **[VIDEO_BACKGROUND_BLOCK.md](./features/blocks/VIDEO_BACKGROUND_BLOCK.md)** - Video background block

#### Dealer Hours (`docs/features/dealer-hours/`)
- **[DEALER-HOURS-COMPONENT.md](./features/dealer-hours/DEALER-HOURS-COMPONENT.md)** - Component reference
- **[DEALER-HOURS-EXAMPLES.md](./features/dealer-hours/DEALER-HOURS-EXAMPLES.md)** - Usage examples
- **[DEALER-HOURS-IMPLEMENTATION.md](./features/dealer-hours/DEALER-HOURS-IMPLEMENTATION.md)** - Implementation guide
- **[DEALER-HOURS-QUICKSTART.md](./features/dealer-hours/DEALER-HOURS-QUICKSTART.md)** - Quick start

#### Signature Pages (`docs/features/signature-pages/`)
- **[SIGNATURE2_IMPLEMENTATION_SUMMARY.md](./features/signature-pages/SIGNATURE2_IMPLEMENTATION_SUMMARY.md)** - Implementation overview
- **[SIGNATURE2_TRACKING.md](./features/signature-pages/SIGNATURE2_TRACKING.md)** - Tracking system
- **[SIGNATURE2_FINAL_SOLUTION.md](./features/signature-pages/SIGNATURE2_FINAL_SOLUTION.md)** - Final solution summary
- **[SIGNATURE2_DOUBLE_FIRING_FIX.md](./features/signature-pages/SIGNATURE2_DOUBLE_FIRING_FIX.md)** - Double-firing fix
- **[SIGNATURE2_HEADER_FOOTER_HIDING.md](./features/signature-pages/SIGNATURE2_HEADER_FOOTER_HIDING.md)** - Header/footer hiding

#### Other Features
- **[3D-VIEWER-FEATURE.md](./features/3D-VIEWER-FEATURE.md)** - 3D piano viewer
- **[ARTIST_CAROUSEL_IMPLEMENTATION.md](./features/ARTIST_CAROUSEL_IMPLEMENTATION.md)** - Artist carousel
- **[ARTIST_CAROUSEL_ENHANCED.md](./features/ARTIST_CAROUSEL_ENHANCED.md)** - Enhanced artist carousel
- **[ARTISTS_PAGE_SUMMARY.md](./features/ARTISTS_PAGE_SUMMARY.md)** - Artists page implementation
- **[AUTO_SCROLLING_TEXT_UPDATE.md](./features/AUTO_SCROLLING_TEXT_UPDATE.md)** - Auto-scrolling text
- **[blog.md](./features/blog.md)** - Blog system documentation
- **[BOTTOM_LEFT_POPUP_IMPLEMENTATION.md](./features/BOTTOM_LEFT_POPUP_IMPLEMENTATION.md)** - Bottom popup impl
- **[CUSTOM_MEDIA_PICKER.md](./features/CUSTOM_MEDIA_PICKER.md)** - Custom media picker admin component
- **[FLOATING_CART_ANALYSIS.md](./features/FLOATING_CART_ANALYSIS.md)** - Floating cart analysis
- **[FLOATING_CART_IMPLEMENTATION.md](./features/FLOATING_CART_IMPLEMENTATION.md)** - Floating cart implementation
- **[IMAGE-GALLERY-IMPLEMENTATION.md](./features/IMAGE-GALLERY-IMPLEMENTATION.md)** - Image gallery
- **[INSTRUMENTAL_TO_LIFE_UPDATES.md](./features/INSTRUMENTAL_TO_LIFE_UPDATES.md)** - I2L block updates
- **[MOBILE-DEALER-FINDER.md](./features/MOBILE-DEALER-FINDER.md)** - Mobile dealer finder
- **[MOBILE-DEALER-FINDER-DESIGN.md](./features/MOBILE-DEALER-FINDER-DESIGN.md)** - Mobile dealer finder design
- **[NEWS-CAROUSEL-GUIDE.md](./features/NEWS-CAROUSEL-GUIDE.md)** - News carousel guide
- **[PRODUCT_CATEGORY_DISPLAY.md](./features/PRODUCT_CATEGORY_DISPLAY.md)** - Product category display
- **[PRODUCTS-MENU-IMPLEMENTATION.md](./features/PRODUCTS-MENU-IMPLEMENTATION.md)** - Products mega menu
- **[PRODUCTS-NAVIGATION.md](./features/PRODUCTS-NAVIGATION.md)** - Products navigation system
- **[SIDE_NAVIGATION_AUTO_GENERATION.md](./features/SIDE_NAVIGATION_AUTO_GENERATION.md)** - Side nav auto-generation
- **[SIDE_NAVIGATION_IMPLEMENTATION.md](./features/SIDE_NAVIGATION_IMPLEMENTATION.md)** - Side nav implementation

---

### Fixes (`docs/fixes/`)
Bug fixes, debug notes, and patches.

- **[BLOCK_DATA_SOURCE_UPDATE.md](./fixes/BLOCK_DATA_SOURCE_UPDATE.md)** - Block data source fix
- **[BLOCK_FIXES_SUMMARY.md](./fixes/BLOCK_FIXES_SUMMARY.md)** - Block fixes summary
- **[I2L_CTA_TROUBLESHOOTING.md](./fixes/I2L_CTA_TROUBLESHOOTING.md)** - I2L CTA troubleshooting
- **[MODAL_DEBUG_GUIDE.md](./fixes/MODAL_DEBUG_GUIDE.md)** - Modal debug guide
- **[NAVIGATION_DETECTION_TEST.md](./fixes/NAVIGATION_DETECTION_TEST.md)** - Navigation detection test
- **[SYNC_BUG.md](./fixes/SYNC_BUG.md)** - Shopify sync bug fix
- **[shopify-sync-fix-2026-01.md](./fixes/shopify-sync-fix-2026-01.md)** - Jan 2026 sync fix

Search UI fixes:
- **[search-blank-results-fix.md](./fixes/search-blank-results-fix.md)**
- **[search-ui-redesign.md](./fixes/search-ui-redesign.md)**
- **[search-product-cards-redesign.md](./fixes/search-product-cards-redesign.md)**
- **[SOLUTION-search-denormalized-fields.md](./fixes/SOLUTION-search-denormalized-fields.md)**
- **[DIAGNOSTIC-search-undefined-values.md](./fixes/DIAGNOSTIC-search-undefined-values.md)**
- **[CLEANUP-search-selection-indicators.md](./fixes/CLEANUP-search-selection-indicators.md)**
- **[GROUPED-BY-CATEGORY.md](./fixes/GROUPED-BY-CATEGORY.md)**
- **[SINGLE-CATEGORY-VIEW.md](./fixes/SINGLE-CATEGORY-VIEW.md)**
- **[LARGER-SEARCH-UI.md](./fixes/LARGER-SEARCH-UI.md)**
- **[HANDLE-PRODUCT-TYPES.md](./fixes/HANDLE-PRODUCT-TYPES.md)**
- **[VERIFY-PRODUCT-TYPES.md](./fixes/VERIFY-PRODUCT-TYPES.md)**

---

### Media (`docs/media/`)
Media system and asset optimization.

- **[MEDIA_SYSTEM_ARCHITECTURE.md](./media/MEDIA_SYSTEM_ARCHITECTURE.md)** - R2 media optimization system
- **[MEDIA_RENDERING_ARCHITECTURE.md](./media/MEDIA_RENDERING_ARCHITECTURE.md)** - Media rendering components
- **[r2-storage-config.md](./media/r2-storage-config.md)** - Cloudflare R2 storage configuration

---

### Styling (`docs/styling/`)
Brand guidelines and design system.

- **[KAWAI_STYLING_GUIDE.md](./styling/KAWAI_STYLING_GUIDE.md)** - Full brand styling guidelines
- **[STYLING_QUICK_REFERENCE.md](./styling/STYLING_QUICK_REFERENCE.md)** - Quick styling reference
- **[fonts.md](./styling/fonts.md)** - Font system documentation
- **[JAPANESE_MINIMALISM_UPDATE.md](./styling/JAPANESE_MINIMALISM_UPDATE.md)** - Japanese minimalism design update

Also see: **[BRANDING.md](./BRANDING.md)** at docs root — primary brand guidelines reference.

---

### Integrations (`docs/integrations/`)
Third-party service integrations.

#### Shopify (`docs/integrations/shopify/`)
- **[shopify-integration.md](./integrations/shopify/shopify-integration.md)** - Core integration guide
- **[shopify-integration-v2.md](./integrations/shopify/shopify-integration-v2.md)** - V2 integration
- **[shopify-admin-api-integration.md](./integrations/shopify/shopify-admin-api-integration.md)** - Admin API (OAuth)
- **[webhook-shopify.md](./integrations/shopify/webhook-shopify.md)** - Webhook integration
- **[SHOPIFY_CUSTOM_FIELDS_GUIDE.md](./integrations/shopify/SHOPIFY_CUSTOM_FIELDS_GUIDE.md)** - Custom fields guide
- **[utm-attribution-tracking.md](./integrations/shopify/utm-attribution-tracking.md)** - UTM tracking
- **[shopifytrackingintegration.md](./integrations/shopify/shopifytrackingintegration.md)** - Tracking integration
- **[COLLECTIONS_SYNC.md](./integrations/shopify/COLLECTIONS_SYNC.md)** - Collections sync system
- **[DEBUG_SHOPIFY_SYNC.md](./integrations/shopify/DEBUG_SHOPIFY_SYNC.md)** - Sync debugging guide
- **[product-media-guide.md](./integrations/shopify/product-media-guide.md)** - Product media handling
- **[product-media-sync-guide.md](./integrations/shopify/product-media-sync-guide.md)** - Media sync guide
- **[products-collection-integration-plan.md](./integrations/shopify/products-collection-integration-plan.md)** - Collections plan
- **[productshopifyintegration.md](./integrations/shopify/productshopifyintegration.md)** - Product integration
- **[minimal-integration-guide.md](./integrations/shopify/minimal-integration-guide.md)** - Minimal setup guide
- **[read-only-integration-guide.md](./integrations/shopify/read-only-integration-guide.md)** - Read-only mode

#### Constant Contact (`docs/integrations/constant-contact/`)
- **[README.md](./integrations/constant-contact/README.md)** - Overview
- **[integration.md](./integrations/constant-contact/integration.md)** - Integration setup
- **[api-guide.md](./integrations/constant-contact/api-guide.md)** - API reference
- **[setup.md](./integrations/constant-contact/setup.md)** - Setup guide
- **[CONSTANT_CONTACT_LIST_CREATION_FIX.md](./integrations/constant-contact/CONSTANT_CONTACT_LIST_CREATION_FIX.md)** - List creation fix

#### Calendly (`docs/integrations/calendly/`)
- **[CALENDLY_TRACKING_TEST_GUIDE.md](./integrations/calendly/CALENDLY_TRACKING_TEST_GUIDE.md)** - Tracking test guide
- **[CALENDLY_PHONE_PREFILL_FIX.md](./integrations/calendly/CALENDLY_PHONE_PREFILL_FIX.md)** - Phone prefill fix
- **[CALENDLY_PHONE_DEBUG.md](./integrations/calendly/CALENDLY_PHONE_DEBUG.md)** - Phone field debug
- **[CALENDLY_EMAIL_CAPTURE_FIX.md](./integrations/calendly/CALENDLY_EMAIL_CAPTURE_FIX.md)** - Email capture fix

#### General
- **[INTEGRATION_GUIDE.md](./integrations/INTEGRATION_GUIDE.md)** - General integration guide
- **[INTEGRATION_REPORT.md](./integrations/INTEGRATION_REPORT.md)** - Integration status report

---

### Migration (`docs/migration/`)
Data migration tools and guides.

- **[MIGRATION_ANALYSIS_REPORT.md](./migration/MIGRATION_ANALYSIS_REPORT.md)** - Data migration analysis
- **[MIGRATION_API_GUIDE.md](./migration/MIGRATION_API_GUIDE.md)** - Migration API documentation
- **[migration-strategy.md](./migration/migration-strategy.md)** - Migration strategy guide
- **[csv-migration-api.md](./migration/csv-migration-api.md)** - CSV data migration API

#### Blog Migration (`docs/migration/blog/`)
- **[BLOG_MIGRATION_PLAN.md](./migration/blog/BLOG_MIGRATION_PLAN.md)** - Blog migration plan
- **[migration-strategy.md](./migration/blog/migration-scripts-guide.md)** - Migration scripts guide
- **[migration-workflow-quick-reference.md](./migration/blog/migration-workflow-quick-reference.md)** - Quick reference
- **[MIGRATION_SCRIPTS_SUMMARY.md](./migration/blog/MIGRATION_SCRIPTS_SUMMARY.md)** - Scripts summary
- **[PHASE_2_COMPLETE.md](./migration/blog/PHASE_2_COMPLETE.md)** - Phase 2 completion notes
- **[posts-schema-migration.md](./migration/blog/posts-schema-migration.md)** - Posts schema migration

---

### SEO (`docs/seo/`)
Search optimization and analytics.

- **[piano-buyer-research-and-seo-strategy.md](./seo/piano-buyer-research-and-seo-strategy.md)** - SEO strategy research
- **[piano-finder-page-strategy-2025.md](./seo/piano-finder-page-strategy-2025.md)** - Piano finder page strategy
- **[SITEMAP_IMPLEMENTATION.md](./seo/SITEMAP_IMPLEMENTATION.md)** - Sitemap generation guide
- **[GOOGLE_SEARCH_CONSOLE_QUICKSTART.md](./seo/GOOGLE_SEARCH_CONSOLE_QUICKSTART.md)** - GSC setup guide
- **[CROSS_DOMAIN_TRACKING_SETUP.md](./seo/CROSS_DOMAIN_TRACKING_SETUP.md)** - Cross-domain tracking
- **[COMPETITIVE_ANALYSIS_PIANO_FINDERS.md](./seo/COMPETITIVE_ANALYSIS_PIANO_FINDERS.md)** - Competitive analysis
- **[TRACKING.md](./seo/TRACKING.md)** - Analytics & tracking implementation

---

### Campaigns (`docs/campaigns/`)
Campaign and promotional page documentation.

- **[CX_SERIES_MARKETING_STRATEGY.md](./campaigns/CX_SERIES_MARKETING_STRATEGY.md)** - CX series strategy

#### NAMM 2026 (`docs/campaigns/namm-2026/`)
- **[namm-2026-seo-architecture.md](./campaigns/namm-2026/namm-2026-seo-architecture.md)** - NAMM 2026 SEO strategy
- **[dealeremail.md](./campaigns/namm-2026/dealeremail.md)** - Dealer email template

#### ES60 (`docs/campaigns/es60/`)
- **[landing.md](./campaigns/es60/landing.md)** - ES60 landing page docs

---

### CMS (`docs/cms/`)
Content management guides.

- **[homepage-cms-implementation-guide.md](./cms/homepage-cms-implementation-guide.md)** - Homepage CMS setup
- **[copy-strategy-analysis.md](./cms/copy-strategy-analysis.md)** - Content strategy analysis
- **[CONVERSION_OPTIMIZATION_PLANS.md](./cms/CONVERSION_OPTIMIZATION_PLANS.md)** - Conversion optimization

---

### Reference (`docs/reference/`)
Reference data and specifications.

- **[KAWAI_PRODUCT_LINE_2024-2025.md](./reference/KAWAI_PRODUCT_LINE_2024-2025.md)** - Product line specifications
- **[storefronts.md](./reference/storefronts.md)** - Storefront reference data

---

### Policies (`docs/policies/`)
Legal and operational policies.

- **[privacy-policy.md](./policies/privacy-policy.md)**
- **[return-policy.md](./policies/return-policy.md)**
- **[shipping-policy.md](./policies/shipping-policy.md)**
- **[warranty-policy.md](./policies/warranty-policy.md)**
- **[financing-policy.md](./policies/financing-policy.md)**
- **[best-price-guarantee.md](./policies/best-price-guarantee.md)**
- **[README.md](./policies/README.md)** - Policies overview

---

### Internal (`docs/internal/`)
Development notes, maintenance, and internal planning.

- **[AGENT_COORDINATION.md](./internal/AGENT_COORDINATION.md)** - Development agent coordination
- **[cleanup-script.md](./internal/cleanup-script.md)** - Cleanup and maintenance scripts
- **[REFACTOR_PROPOSAL.md](./internal/REFACTOR_PROPOSAL.md)** - Refactor planning notes
- **[cookiestrategy.md](./internal/cookiestrategy.md)** - Cookie strategy notes
- **[dns.md](./internal/dns.md)** - DNS configuration notes
- **[todopages.md](./internal/todopages.md)** - Page build todo list

---

### Presentations (`docs/presentations/`)
- **[luxury-seo-strategy-presentation.html](./presentations/luxury-seo-strategy-presentation.html)**
- **[seo-strategy-presentation.html](./presentations/seo-strategy-presentation.html)**

---

## Getting Started

### For Developers
1. Start with **[`/CLAUDE.md`](../CLAUDE.md)** (project root) for the full dev guide
2. Review **[architecture/](./architecture/)** for system design
3. Check **[media/](./media/)** for asset handling

### For Content Managers
1. Read **[cms/](./cms/)** for content management
2. Review **[campaigns/](./campaigns/)** for campaign creation
3. Check **[BRANDING.md](./BRANDING.md)** for brand guidelines

### For DevOps/Admin
1. Study **[architecture/](./architecture/)** for system design
2. Review **[migration/](./migration/)** for data management
3. Check **[integrations/](./integrations/)** for third-party services

---

*Last Updated: April 2026*
*System Version: Next.js 15.4 + Payload CMS 3.52+*
