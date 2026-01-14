# KAWAI Piano Website Documentation

> **Comprehensive documentation for the KAWAI Piano retail platform**
> Built with Next.js 15, Payload CMS 3.52+, and advanced media optimization

---

## Quick Navigation

| Category | Description | Path |
|----------|-------------|------|
| **Architecture** | System design, navigation, TypeScript | `docs/architecture/` |
| **Media** | R2 storage, image optimization | `docs/media/` |
| **Styling** | Brand guidelines, design system | `docs/styling/` |
| **Integrations** | Shopify, Constant Contact, Calendly | `docs/integrations/` |
| **Migration** | Data migration tools & guides | `docs/migration/` |
| **SEO** | Search optimization, analytics, tracking | `docs/seo/` |
| **Features** | Feature implementation docs | `docs/features/` |
| **Campaigns** | NAMM, ES60, promotional pages | `docs/campaigns/` |
| **CMS** | Content management guides | `docs/cms/` |
| **Reference** | Product specs, data reference | `docs/reference/` |
| **Internal** | Agent coordination, maintenance | `docs/internal/` |
| **Presentations** | HTML presentations | `docs/presentations/` |

---

## Documentation Index

### Architecture (`docs/architecture/`)
System design and core infrastructure documentation.

- **[MULTI-SITE-SYSTEM.md](./architecture/MULTI-SITE-SYSTEM.md)** - Multi-site architecture
- **[AUTO_PRODUCT_GENERATION_ARCHITECTURE.md](./architecture/AUTO_PRODUCT_GENERATION_ARCHITECTURE.md)** - Product auto-generation
- **[HEADER_SYSTEM_DOCUMENTATION.md](./architecture/HEADER_SYSTEM_DOCUMENTATION.md)** - Navigation and header system
- **[NAVIGATION_CONTEXT_SYSTEM.md](./architecture/NAVIGATION_CONTEXT_SYSTEM.md)** - Context-aware navigation
- **[typescript.md](./architecture/typescript.md)** - TypeScript configuration guide

### Media (`docs/media/`)
Media system and asset optimization.

- **[MEDIA_SYSTEM_ARCHITECTURE.md](./media/MEDIA_SYSTEM_ARCHITECTURE.md)** - R2 media optimization system
- **[MEDIA_RENDERING_ARCHITECTURE.md](./media/MEDIA_RENDERING_ARCHITECTURE.md)** - Media rendering components
- **[r2-storage-config.md](./media/r2-storage-config.md)** - Cloudflare R2 storage configuration

### Styling (`docs/styling/`)
Brand guidelines and design system.

- **[KAWAI_STYLING_GUIDE.md](./styling/KAWAI_STYLING_GUIDE.md)** - Brand styling guidelines
- **[STYLING_QUICK_REFERENCE.md](./styling/STYLING_QUICK_REFERENCE.md)** - Quick styling reference

### Integrations (`docs/integrations/`)
Third-party service integrations.

#### Shopify (`docs/integrations/shopify/`)
- **[shopify-integration.md](./integrations/shopify/shopify-integration.md)** - Shopify commerce integration guide
- **[shopify-admin-api-integration.md](./integrations/shopify/shopify-admin-api-integration.md)** - Admin API with OAuth
- **[webhook-shopify.md](./integrations/shopify/webhook-shopify.md)** - Webhook integration

#### Constant Contact (`docs/integrations/constant-contact/`)
- **[README.md](./integrations/constant-contact/README.md)** - Overview
- **[integration.md](./integrations/constant-contact/integration.md)** - Integration setup
- **[api-guide.md](./integrations/constant-contact/api-guide.md)** - API reference
- **[setup.md](./integrations/constant-contact/setup.md)** - Setup guide

#### Calendly (`docs/integrations/calendly/`)
- **[CALENDLY_TRACKING_TEST_GUIDE.md](./integrations/calendly/CALENDLY_TRACKING_TEST_GUIDE.md)** - Calendly integration testing

#### General
- **[INTEGRATION_GUIDE.md](./integrations/INTEGRATION_GUIDE.md)** - General integration guide
- **[INTEGRATION_REPORT.md](./integrations/INTEGRATION_REPORT.md)** - Integration status report

### Migration (`docs/migration/`)
Data migration tools and guides.

- **[MIGRATION_ANALYSIS_REPORT.md](./migration/MIGRATION_ANALYSIS_REPORT.md)** - Data migration analysis
- **[MIGRATION_API_GUIDE.md](./migration/MIGRATION_API_GUIDE.md)** - Migration API documentation
- **[migration-strategy.md](./migration/migration-strategy.md)** - Migration strategy guide
- **[csv-migration-api.md](./migration/csv-migration-api.md)** - CSV data migration API

### SEO (`docs/seo/`)
Search optimization and analytics.

- **[piano-buyer-research-and-seo-strategy.md](./seo/piano-buyer-research-and-seo-strategy.md)** - SEO strategy research
- **[piano-finder-page-strategy-2025.md](./seo/piano-finder-page-strategy-2025.md)** - Piano finder page strategy
- **[SITEMAP_IMPLEMENTATION.md](./seo/SITEMAP_IMPLEMENTATION.md)** - Sitemap generation guide
- **[GOOGLE_SEARCH_CONSOLE_QUICKSTART.md](./seo/GOOGLE_SEARCH_CONSOLE_QUICKSTART.md)** - GSC setup guide
- **[CROSS_DOMAIN_TRACKING_SETUP.md](./seo/CROSS_DOMAIN_TRACKING_SETUP.md)** - Cross-domain tracking
- **[COMPETITIVE_ANALYSIS_PIANO_FINDERS.md](./seo/COMPETITIVE_ANALYSIS_PIANO_FINDERS.md)** - Competitive analysis

### Features (`docs/features/`)
Feature implementation documentation.

#### Signature Pages (`docs/features/signature-pages/`)
- **[SIGNATURE2_IMPLEMENTATION_SUMMARY.md](./features/signature-pages/SIGNATURE2_IMPLEMENTATION_SUMMARY.md)** - Implementation overview
- **[SIGNATURE2_TRACKING.md](./features/signature-pages/SIGNATURE2_TRACKING.md)** - Tracking system
- **[SIGNATURE2_FINAL_SOLUTION.md](./features/signature-pages/SIGNATURE2_FINAL_SOLUTION.md)** - Final solution summary
- **[SIGNATURE2_DOUBLE_FIRING_FIX.md](./features/signature-pages/SIGNATURE2_DOUBLE_FIRING_FIX.md)** - Double-firing fix
- **[SIGNATURE2_HEADER_FOOTER_HIDING.md](./features/signature-pages/SIGNATURE2_HEADER_FOOTER_HIDING.md)** - Header/footer hiding

#### Other Features
- **[3D-VIEWER-FEATURE.md](./features/3D-VIEWER-FEATURE.md)** - 3D piano viewer
- **[blog.md](./features/blog.md)** - Blog system documentation
- **[ARTISTS_PAGE_SUMMARY.md](./features/ARTISTS_PAGE_SUMMARY.md)** - Artists page implementation

### Campaigns (`docs/campaigns/`)
Campaign and promotional page documentation.

#### NAMM 2026 (`docs/campaigns/namm-2026/`)
- **[namm-2026-seo-architecture.md](./campaigns/namm-2026/namm-2026-seo-architecture.md)** - NAMM 2026 SEO strategy
- **[dealeremail.md](./campaigns/namm-2026/dealeremail.md)** - Dealer email template

#### ES60 (`docs/campaigns/es60/`)
- **[landing.md](./campaigns/es60/landing.md)** - ES60 landing page

### CMS (`docs/cms/`)
Content management guides.

- **[homepage-cms-implementation-guide.md](./cms/homepage-cms-implementation-guide.md)** - Homepage CMS setup
- **[copy-strategy-analysis.md](./cms/copy-strategy-analysis.md)** - Content strategy analysis
- **[CONVERSION_OPTIMIZATION_PLANS.md](./cms/CONVERSION_OPTIMIZATION_PLANS.md)** - Conversion optimization

### Reference (`docs/reference/`)
Reference data and specifications.

- **[KAWAI_PRODUCT_LINE_2024-2025.md](./reference/KAWAI_PRODUCT_LINE_2024-2025.md)** - Product line specifications

### Internal (`docs/internal/`)
Development and maintenance documentation.

- **[AGENT_COORDINATION.md](./internal/AGENT_COORDINATION.md)** - Development agent coordination
- **[cleanup-script.md](./internal/cleanup-script.md)** - Cleanup and maintenance scripts

### Presentations (`docs/presentations/`)
- **[luxury-seo-strategy-presentation.html](./presentations/luxury-seo-strategy-presentation.html)**
- **[seo-strategy-presentation.html](./presentations/seo-strategy-presentation.html)**

---

## Root Files

- **[CLAUDE.md](./CLAUDE.md)** - AI assistant development guide
- **[README.md](./README.md)** - This file

---

## Getting Started

### For Developers
1. Start with **[CLAUDE.md](./CLAUDE.md)** for development overview
2. Review **[architecture/](./architecture/)** for system design
3. Check **[media/](./media/)** for asset handling

### For Content Managers
1. Read **[cms/](./cms/)** for content management
2. Review **[campaigns/](./campaigns/)** for campaign creation
3. Check **[styling/](./styling/)** for brand guidelines

### For DevOps/Admin
1. Study **[architecture/](./architecture/)** for system design
2. Review **[migration/](./migration/)** for data management
3. Check **[integrations/](./integrations/)** for third-party services

---

*Last Updated: January 2025*
*System Version: Next.js 15 + Payload CMS 3.52+*
