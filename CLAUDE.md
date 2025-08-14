# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Kawai Piano website** built with Next.js 15, Payload CMS v3, and Tailwind CSS. The site showcases Kawai's piano collection, heritage, and innovation with a sophisticated Japanese-inspired design system.

## Development Commands

**This project uses Bun as the primary package manager and runtime.**

```bash
# Install dependencies
bun install

# Development server with Turbopack (preferred)
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Linting
bun run lint

# Add new dependencies
bun add <package>            # Production dependency
bun add -d <package>         # Development dependency

# Remove dependencies
bun remove <package>

# Update dependencies
bun update

# Check for outdated packages
bun outdated

# Reproducible installs (CI/CD)
bun ci
```

## Architecture

### Framework Stack
- **Next.js 15** with App Router (`src/app/`)
- **Payload CMS v3** for content management
- **MongoDB** as the database (via Mongoose adapter)
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (payload)/         # Payload admin routes
│   ├── pianos/            # Piano catalog pages
│   │   ├── digital/       # Digital piano category
│   │   ├── grand/         # Grand piano category
│   │   ├── hybrid/        # Hybrid piano category
│   │   └── upright/       # Upright piano category
│   └── layout.tsx         # Root layout with fonts and metadata
├── collections/           # Payload CMS collections
├── components/            # React components
│   ├── forms/            # Form components
│   ├── layout/           # Header, footer, navigation
│   ├── piano/            # Piano-specific components
│   └── ui/               # Reusable UI components
├── globals/              # Payload global configurations
├── lib/                  # Utilities and configurations
└── translations/         # i18n JSON files
```

### CMS Architecture

Payload CMS manages the following content types:

**Core Collections:**
- `Pianos` - Main piano catalog with specifications, pricing, media
- `PianoCategories` - Piano categories (Grand, Upright, Digital, etc.)
- `PianoSeries` - Piano series (Shigeru Kawai, GX, CA, etc.)
- `Technologies` - Kawai innovations (Millennium III, Grand Feel III)
- `Artists` - Endorsed artists and testimonials
- `Awards` - Industry awards and recognitions

**Content Collections:**
- `Pages` - Static pages and landing pages
- `Posts` - Blog posts and news
- `Media` - Images, videos, audio samples, brochures

**Configuration:**
- Admin accessible at `/admin`
- API routes at `/api`
- Database connection via `DATABASE_URI` environment variable
- Media uploads handled by Sharp

### Design System

The site uses a **Japanese-inspired design system** with Kawai brand colors:

**Brand Colors:**
- Kawai Red: `#e21d30` (primary accent)
- Kawai Black: `#1a1a1a` (primary text)
- Kawai Pearl: `#fafafa` (background)
- Kawai Gold: Custom accent for premium elements

**Typography:**
- **Inter** - Primary font for body text and UI
- **Crimson Text** - Elegant serif for headings and brand elements

**CSS Architecture (Tailwind v4 Simplified):**
- **@theme in globals.css**: Design tokens auto-generate utilities (`--color-kawai-red` → `bg-kawai-red`, `text-kawai-red`)
- **Minimal Custom CSS**: Only 3-4 complex components use `@utility` directive
- **Generated Utilities First**: Use `bg-kawai-red hover:bg-kawai-red-600` instead of custom classes
- **@apply for Simple Components**: Cards, layouts use `@apply` with generated utilities

### Key Features

**Piano Catalog:**
- Dynamic piano listing with filtering and search
- Comparison tool for multiple piano models
- Detailed specifications and media galleries
- Price calculations and availability by region
- SEO-optimized pages for each piano model

**Content Management:**
- Rich media support (images, audio samples, videos)
- Multilingual content (English/Japanese)
- Award and endorsement tracking
- Technology showcase integration

## Environment Setup

Required environment variables:
```bash
PAYLOAD_SECRET=your_payload_secret
DATABASE_URI=mongodb://localhost:27017/kawai-piano
```

## File Naming Conventions

- Use **kebab-case** for file names (`piano-finder.tsx`)
- Use **PascalCase** for component names (`PianoFinder`)
- Use **camelCase** for utility functions and variables
- Collection files use **PascalCase** (`Pianos.ts`)

## Development Guidelines

### Bun Best Practices
- **Use `bun run` prefix** for all script execution instead of npm/yarn
- **Prefer `bun ci`** in CI/CD environments for reproducible builds
- **Use `bun add -d`** for development dependencies (shorter than `--dev`)
- **Trust packages when needed** with `bun pm trust <package>` for lifecycle scripts
- **Check package versions** with `bun pm version` for version management
- **Use absolute paths** in file operations when working with Bun APIs
- **Leverage Bun's speed** - installs are significantly faster than npm/yarn

### Component Organization
- Place piano-specific components in `src/components/piano/`
- Use the established UI component library in `src/components/ui/`
- Layout components go in `src/components/layout/`

### Utility Functions
- Piano-specific utilities are in `src/lib/utils.ts`
- Functions include price formatting, piano model formatting, search/filter logic
- Use existing utilities before creating new ones

### Content Management
- All content should be manageable via Payload admin
- Use relationships between collections (piano → series → category)
- Media assets should be uploaded through the CMS

### SEO and Performance
- All pages include comprehensive metadata
- Images are optimized using Sharp
- Use Next.js Image component for all media
- Implement proper semantic HTML structure

## Common Tasks

### Package Management with Bun
```bash
# Add packages faster than npm/yarn
bun add react-query              # Production dependency
bun add -d @types/node          # Development dependency
bun add react@18.2.0            # Specific version
bun add git+ssh://git@github.com/owner/repo.git  # Git dependency

# Clean installs for CI/CD
bun ci                          # Equivalent to npm ci

# Check and update packages
bun outdated                    # Check for updates
bun update                      # Update all packages
bun update react               # Update specific package

# Package management utilities
bun pm trust <package>         # Trust package for lifecycle scripts
bun pm version patch          # Bump version and create git tag
```

### Adding New Piano Models
1. Use Payload admin to create new piano entry
2. Associate with appropriate series and category
3. Upload media assets (images, brochures, audio)
4. Define specifications and features
5. Set pricing and availability

### Modifying Design System
- Update brand colors in `src/app/globals.css`
- Brand elements use Kawai Red (`#E11922`) as primary accent
- Typography combines Inter (body) + Crimson Text (headings)
- Use existing Kawai utility classes (`kawai-red`, `kawai-heading`, etc.)

### Adding New Collections
1. Create collection file in `src/collections/`
2. Import and register in `payload.config.ts`
3. Generate TypeScript types with Payload

## Tailwind v4 Component Usage

### Use Generated Utilities (Preferred)
```tsx
// Good: Use auto-generated utilities from @theme
<button className="bg-kawai-red hover:bg-kawai-red-600 text-white px-6 py-3 rounded-md">
  Explore Pianos
</button>

<div className="bg-kawai-pearl border border-kawai-neutral/30 p-8 rounded-lg">
  <h2 className="text-kawai-black font-bold text-2xl mb-4">Piano Collection</h2>
  <p className="text-kawai-black/80">Discover our instruments...</p>
</div>
```

### Use Custom Components (When Complex)
```tsx
// For complex multi-property components
<button className="btn-brand-primary">
  Complex Button with Gradient & Animation
</button>

<nav className="nav-brand-trigger">
  Navigation with Underline Animation
</nav>
```

### Available Auto-Generated Utilities
From `@theme` configuration, you automatically get:
- **Colors**: `bg-kawai-red`, `text-kawai-black`, `border-kawai-pearl`
- **Spacing**: `p-brand-lg`, `m-brand-xl`, `gap-brand-md`
- **Typography**: `font-brand-serif`, `font-brand-sans`
- **Shadows**: `shadow-brand-medium`, `shadow-brand-premium`

This website emphasizes **Japanese craftsmanship**, **musical heritage**, and **innovative technology** in its content and design approach.