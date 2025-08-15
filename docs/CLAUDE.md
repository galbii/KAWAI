# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Kawai Piano website** built with Next.js 15, Payload CMS v3, and Tailwind CSS. The site showcases Kawai's piano collection, heritage, and innovation with a sophisticated Japanese-inspired design system.

## Development Commands

**This project uses Bun as the primary package manager and runtime. NEVER use npm or yarn commands.**

**IMPORTANT: Do not start development servers (`bun run dev`) or run builds (`bun run build`) unless explicitly asked by the user.**

```bash
# Install dependencies
bun install

# Development server with Turbopack (only when user requests)
bun run dev

# Production build (only when user requests)
bun run build

# Start production server (only when user requests)
bun run start

# Linting (safe to run for code quality)
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
- **TypeScript 5** for comprehensive type safety
- **Bun** as package manager and runtime (not npm)

### Project Structure

**Next.js App Router Routing:**
- Each page is located at `src/app/[route]/page.tsx`
- Pages follow App Router directory structure:
  - `/` → `src/app/page.tsx`
  - `/pianos` → `src/app/pianos/page.tsx` 
  - `/pianos/digital` → `src/app/pianos/digital/page.tsx`
  - `/product/[model]` → `src/app/product/[model]/page.tsx` (specific piano models)

```
src/
├── app/                    # Next.js App Router pages
│   ├── (payload)/         # Payload admin routes (grouped route)
│   │   └── admin/[[...segments]]/page.tsx  # Payload CMS admin
│   ├── pianos/            # Piano catalog pages
│   │   ├── digital/page.tsx # Digital piano category
│   │   ├── grand/page.tsx # Grand piano category
│   │   ├── hybrid/page.tsx # Hybrid piano category
│   │   ├── upright/page.tsx # Upright piano category
│   │   ├── shigeru-kawai/ # Premium series
│   │   │   └── page.tsx   # Series overview
│   │   ├── compare/page.tsx # Piano comparison tool
│   │   ├── search/page.tsx  # Piano search
│   │   └── page.tsx       # Main piano catalog
│   ├── product/           # Individual piano model pages
│   │   └── [model]/page.tsx # Dynamic route for specific models (e.g., /product/ca901, /product/sk-ex)
│   ├── about/page.tsx     # About page
│   ├── showroom/page.tsx  # Showroom info
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
- **TypeScript Types**: Payload generates types automatically to `types/payload-types.ts`

### TypeScript Architecture

**Type Organization:**
- **Custom Types**: Centralized in `src/lib/types.ts` with comprehensive interfaces
- **Payload Types**: Auto-generated to `types/payload-types.ts` (configured in `payload.config.ts`)
- **Component Types**: Inline types for component props using Next.js and React types
- **API Types**: Server action and route handler types using Next.js Request/Response types

**Key Type Definitions:**
- `Piano`, `Series`, `Category`, `Media` - Core content types
- `FilterCriteria`, `SearchFilters` - Search and filtering interfaces  
- `StructuredData` - SEO and schema markup types
- Global window extensions for analytics (GTM, Facebook Pixel)

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

### Bun Best Practices - CRITICAL
- **NEVER use npm or yarn commands** - this project exclusively uses Bun
- **Use `bun run` prefix** for all script execution instead of npm/yarn
- **Use `bun add`** instead of `npm install` for adding packages
- **Use `bun install`** instead of `npm install` for installing dependencies
- **Prefer `bun ci`** in CI/CD environments for reproducible builds
- **Use `bun add -d`** for development dependencies (shorter than `--dev`)
- **Trust packages when needed** with `bun pm trust <package>` for lifecycle scripts
- **Check package versions** with `bun pm version` for version management
- **Use absolute paths** in file operations when working with Bun APIs
- **Leverage Bun's speed** - installs are significantly faster than npm/yarn
- **IMPORTANT: Only run `bun run dev` or `bun run build` when explicitly requested by the user**

### TypeScript Best Practices - CRITICAL
- **Maintain Strict Type Safety**: Always use proper TypeScript types, never use `any`
- **Use Project Type Definitions**: Import types from `src/lib/types.ts` for consistency
- **Path Aliases**: Use `@/` for absolute imports (configured in `tsconfig.json`)
- **Component Props**: Always type component props using interfaces or type aliases
- **Payload Types**: Import generated Payload types from `types/payload-types.ts` when available
- **Next.js Types**: Use official Next.js types for pages, API routes, and configuration
- **Type-Only Imports**: Use `import type` for type-only imports to optimize bundles
- **Strict Configuration**: Never modify `tsconfig.json` strict settings or disable type checking
- **Performance**: Leverage `skipLibCheck: true` for faster compilation (already configured)

### Component Organization
- Place piano-specific components in `src/components/piano/`
- Use the established UI component library in `src/components/ui/`
- Layout components go in `src/components/layout/`

### Utility Functions
- Piano-specific utilities are in `src/lib/utils.ts`
- Functions include price formatting, piano model formatting, search/filter logic
- Use existing utilities before creating new ones

### TypeScript Development Workflow
- **Type Checking**: Use `bun run lint` to check for TypeScript errors
- **Auto-completion**: Leverage IDE TypeScript integration for better DX
- **Type Generation**: Payload CMS types are auto-generated on build
- **Import Organization**: Use `@/` path aliases for clean imports
- **Type Safety**: All API endpoints, components, and utilities should be fully typed

### Content Management
- All content should be manageable via Payload admin
- Use relationships between collections (piano → series → category)
- Media assets should be uploaded through the CMS
- **Type Safety**: Use generated Payload types for all CMS data operations

### SEO and Performance
- All pages include comprehensive metadata using Next.js typed metadata API
- Images are optimized using Sharp
- Use Next.js Image component for all media with proper TypeScript props
- Implement proper semantic HTML structure with TypeScript JSX types

## Common Tasks

### Package Management with Bun (NOT npm/yarn)
```bash
# ALWAYS use Bun commands - NEVER npm or yarn
bun add react-query              # Production dependency (NOT npm install)
bun add -d @types/node          # Development dependency (NOT npm install --save-dev)
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

# INCORRECT COMMANDS - DO NOT USE:
# npm install                   # ❌ Use "bun install" instead
# npm run dev                   # ❌ Use "bun run dev" instead
# yarn add                      # ❌ Use "bun add" instead
```

### TypeScript Development Tasks
```bash
# Type checking and linting
bun run lint                    # Runs ESLint with TypeScript rules

# Adding typed dependencies
bun add @types/package-name -d  # Add TypeScript type definitions
bun add zod                     # Add runtime type validation library

# Generating Payload types
# Types are auto-generated during build process to types/payload-types.ts
# Manual generation (if needed): bun run payload generate:types
```

### Adding New Piano Models
1. Use Payload admin to create new piano entry
2. Associate with appropriate series and category using typed relationships
3. Upload media assets (images, brochures, audio)
4. Define specifications and features with proper TypeScript interfaces
5. Set pricing and availability using typed fields
6. **Type Safety**: Use `Piano` interface from `src/lib/types.ts` for consistency

### Modifying Design System
- Update brand colors in `src/app/globals.css`
- Brand elements use Kawai Red (`#E11922`) as primary accent
- Typography combines Inter (body) + Crimson Text (headings)
- Use existing Kawai utility classes (`kawai-red`, `kawai-heading`, etc.)

### Adding New Collections
1. Create collection file in `src/collections/` with proper TypeScript interfaces
2. Import and register in `payload.config.ts` 
3. Generate TypeScript types with Payload (automatic on build)
4. **Type Safety**: Define custom interfaces in `src/lib/types.ts` for additional type safety
5. Use generated Payload types for database operations

### Creating New Components
```tsx
// Example: Properly typed React component
import type { Piano } from '@/lib/types'
import type { FC } from 'react'

interface PianoCardProps {
  piano: Piano
  className?: string
  onClick?: (pianoId: string) => void
}

const PianoCard: FC<PianoCardProps> = ({ piano, className, onClick }) => {
  // Component implementation
}

export default PianoCard
```

### API Route Development
```ts
// Example: Typed Next.js API route
import type { NextRequest } from 'next/server'
import type { Piano } from '@/lib/types'

export async function GET(request: NextRequest) {
  // Properly typed API logic
  const pianos: Piano[] = await fetchPianos()
  return Response.json(pianos)
}
```

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