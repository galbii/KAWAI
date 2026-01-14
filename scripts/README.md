# KAWAI Piano Scripts & Utilities

This directory contains scripts for database operations, integrations, data processing, and testing.

---

## Directory Structure

```
scripts/
├── migration/        # Data migration scripts
├── shopify/          # Shopify integration & testing
├── artists/          # Artist data scraping & validation
├── seeding/          # Database seeding scripts
├── deployment/       # Deployment & setup scripts
├── data-processing/  # Python data processing tools
└── testing/          # Integration & validation tests
```

---

## Categories

### Migration (`scripts/migration/`)
Database migration tools for importing data into Payload CMS.

| Script | Description |
|--------|-------------|
| `migrate-csv-to-products.js` | Main CSV to Products migration |
| `install-migration-deps.js` | Install migration dependencies |
| `create-dealer-locations.js` | Create dealer location records |

**Usage:**
```bash
# Dry run first
DRY_RUN=true node scripts/migration/migrate-csv-to-products.js

# Actual migration
node scripts/migration/migrate-csv-to-products.js
```

### Shopify (`scripts/shopify/`)
Shopify Storefront & Admin API integration scripts.

| Script | Description |
|--------|-------------|
| `test-shopify.ts` | Basic Shopify connection test |
| `test-shopify-utilities.ts` | Utility function tests |
| `test-shopify-cart.ts` | Cart API testing |
| `test-shopify-integration.ts` | Full integration test |
| `demo-shopify-integration.ts` | Demo integration flow |
| `diagnose-shopify-products.ts` | Product diagnosis tool |

**Usage:**
```bash
bun run scripts/shopify/test-shopify.ts
```

### Artists (`scripts/artists/`)
Artist data scraping and validation tools.

| Script | Description |
|--------|-------------|
| `scrape-artist-bios.ts` | Scrape artist biographies |
| `scrape-artists.js` | General artist scraping |
| `check-artist.cjs` | Validate artist data |
| `check-social-links.cjs` | Validate social media links |

### Seeding (`scripts/seeding/`)
Database seeding scripts for initial data setup.

| Script | Description |
|--------|-------------|
| `seed-pianos-page.js` | Seed pianos page content |

### Deployment (`scripts/deployment/`)
Deployment and environment setup scripts.

| Script | Description |
|--------|-------------|
| `create-dallas-signature.sh` | Create Dallas signature page |

### Data Processing (`scripts/data-processing/`)
Python scripts for data analysis and processing.

| Script | Description |
|--------|-------------|
| `comprehensive_catalog_analysis_first_half.py` | Catalog analysis |
| `extract_products.py` | Product data extraction |

**Usage:**
```bash
python scripts/data-processing/extract_products.py
```

### Testing (`scripts/testing/`)
Integration and validation test scripts.

| Script | Description |
|--------|-------------|
| `test-calendly-integration.js` | Calendly integration test |
| `test-calendly-simulation.cjs` | Calendly event simulation |
| `test-calendly-tracking.html` | Browser-based tracking test |
| `test-contact-submission.js` | Contact form submission test |
| `test-migration-api.js` | Migration API test |
| `validate-integration.js` | General integration validation |
| `validate-tracking-implementation.cjs` | Analytics tracking validation |

---

## Environment Variables

Scripts may require these environment variables:

```bash
# Database
DATABASE_URI=mongodb+srv://...

# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
SHOPIFY_ADMIN_ACCESS_TOKEN=...

# Payload CMS
PAYLOAD_SECRET=...
```

---

## Notes

- **Bun Runtime**: Use `bun run` for TypeScript files
- **Node Runtime**: Use `node` for JavaScript files
- **Python**: Use `python` for data processing scripts
- **Dry Run**: Always test migrations with `DRY_RUN=true` first
