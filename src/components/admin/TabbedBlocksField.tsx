'use client'

import React, { useState } from 'react'
import {
  BlockSelector,
  BlocksField,
  Drawer,
  DrawerToggler,
  useConfig,
  useDrawerSlug,
  useField,
  useForm,
  useModal,
} from '@payloadcms/ui'

// Maps sidebar tab names to their block slugs.
// Add new block slugs here when creating new blocks.
const BLOCK_GROUPS: Record<string, string[]> = {
  Marketing: [
    'marketing-i2l',
    'marketing-technical-showcase',
    'marketing-grand-hero',
    'marketing-find-a-dealer',
    'marketing-dealer-finder',
    'marketing-3d-viewer',
    'marketing-instagram-carousel',
    'marketing-artist-carousel',
    'marketing-featured-models',
    'marketing-featured-collections',
    'marketing-rebate-table',
    'marketing-artist-hero',
    'marketing-pianos-browser',
    'marketing-artists-grid',
    'marketing-blog-grid',
    'marketing-blog-latest',
    'marketing-newsletter-popup',
  ],
  Layout: [
    'layout-brand-intro',
    'layout-hero-carousel',
    'layout-video-background',
    'layout-bottom-left-popup',
    'layout-side-navigation',
    'layout-calendly-embed',
    'layout-booking-modal',
  ],
  Events: ['events-university-hero', 'events-event-overview'],
  University: [
    'university-about',
    'university-booking',
    'university-countdown',
    'university-event-details',
    'university-event-hero',
    'university-faq',
    'university-location',
    'university-piano-showcase',
    'university-social-proof',
    'university-value-props',
  ],
  Product: ['product-hero-carousel', 'product-piano-pages'],
}

const ALL_TAB = 'All'
const TAB_NAMES = [ALL_TAB, ...Object.keys(BLOCK_GROUPS)]

function TabbedBlockDrawer({
  drawerSlug,
  rowCount,
  path,
  schemaPath,
}: {
  drawerSlug: string
  rowCount: number
  path: string
  schemaPath: string
}) {
  const [activeTab, setActiveTab] = useState(ALL_TAB)
  const { config } = useConfig()
  const { addFieldRow } = useForm()
  const { closeModal } = useModal()

  const allReferencedSlugs = Object.values(BLOCK_GROUPS).flat()
  const tabBlocks = (config.blocks ?? []).filter((b) =>
    activeTab === ALL_TAB
      ? allReferencedSlugs.includes(b.slug)
      : (BLOCK_GROUPS[activeTab] ?? []).includes(b.slug),
  )

  const onSelect = (blockType: string) => {
    void addFieldRow({ blockType, path, rowIndex: rowCount, schemaPath })
    closeModal(drawerSlug)
  }

  return (
    <Drawer slug={drawerSlug} title="Add Block">
      <div className="tabbed-drawer">
        <nav className="tabbed-drawer__sidebar">
          {TAB_NAMES.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`tabbed-drawer__tab${activeTab === tab ? ' tabbed-drawer__tab--active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="tabbed-drawer__content">
          <BlockSelector blocks={tabBlocks} onSelect={onSelect} />
        </div>
      </div>

      <style>{`
        .tabbed-drawer {
          display: flex;
          height: 100%;
          min-height: 0;
        }
        .tabbed-drawer__sidebar {
          background: var(--theme-elevation-50);
          border-right: 1px solid var(--theme-elevation-150);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          gap: 2px;
          padding: 24px 12px;
          width: 172px;
        }
        .tabbed-drawer__tab {
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--theme-elevation-600);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 12px;
          text-align: left;
          transition: background 120ms ease, color 120ms ease;
          width: 100%;
        }
        .tabbed-drawer__tab:hover {
          background: var(--theme-elevation-100);
          color: var(--theme-text);
        }
        .tabbed-drawer__tab--active {
          background: var(--theme-elevation-150);
          color: var(--theme-text);
          font-weight: 600;
        }
        .tabbed-drawer__content {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
        }
      `}</style>
    </Drawer>
  )
}

// Custom Field component for the Pages layout blocks field.
// Renders Payload's default BlocksField for row management (DnD, editing, validation),
// hides its "Add Block" button via a scoped CSS rule, then replaces it with a single
// button that opens a drawer with a category sidebar on the left.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TabbedBlocksField: React.FC<any> = (props) => {
  const { path, field, schemaPath } = props as {
    path: string
    field: { name: string }
    schemaPath?: string
  }

  const { value } = useField<unknown[]>({ path })
  const rowCount = value?.length ?? 0
  const resolvedSchemaPath = schemaPath ?? field?.name ?? 'layout'
  const drawerSlug = useDrawerSlug('tabbed-blocks-picker')

  return (
    <div className="tabbed-blocks-field">
      <style>{`
        .tabbed-blocks-field .blocks-field__drawer-toggler {
          display: none !important;
        }
        .tabbed-blocks-field .blocks-field__no-block-selected {
          display: none !important;
        }
      `}</style>

      <BlocksField {...props} />

      <TabbedBlockDrawer
        drawerSlug={drawerSlug}
        rowCount={rowCount}
        path={path}
        schemaPath={resolvedSchemaPath}
      />

      <DrawerToggler className="btn btn--style-secondary btn--size-medium tabbed-blocks-field__add-btn" slug={drawerSlug}>
        + Add Block
      </DrawerToggler>
    </div>
  )
}
