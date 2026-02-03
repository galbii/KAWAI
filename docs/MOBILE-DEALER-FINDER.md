# Mobile Dealer Finder Component

## Overview

The `DealerFinderMobile` component provides a premium, touch-optimized mobile experience for finding KAWAI piano dealers. It features smooth animations, bottom-sheet interactions, and a refined mobile-first design that complements the desktop dealer finder experience.

## File Location

```
src/app/(frontend)/find-a-dealer/components/DealerFinderMobile.tsx
```

## Features

### Core Functionality

1. **Location Search**
   - Google Places autocomplete integration
   - "Use My Location" geolocation support
   - Real-time search as you type

2. **Filtering System**
   - Quick dealer type pills (All, Acoustic & Digital, Professional)
   - Advanced filters in bottom sheet drawer
   - Real-time dealer count updates
   - Active filter badge indicators

3. **View Modes**
   - Map view with interactive markers
   - List view with scrollable dealer cards
   - Smooth transitions between views
   - Floating bottom navigation

4. **Dealer Cards**
   - Compact mobile-optimized design
   - Featured dealer badges
   - Distance indicators
   - Dealer type badges
   - Quick actions (call, directions)

5. **Selected Dealer Sheet**
   - Bottom sheet modal with dealer details
   - Contact information and actions
   - Smooth slide-in animation
   - Easy dismiss interaction

## Mobile UX Principles

### Touch Targets
- All interactive elements have a minimum 44px tap target
- Buttons use `active:scale-95` for tactile feedback
- Generous padding for easy one-handed use

### Animations
- Smooth 300ms transitions for view changes
- Bottom sheet slides in from bottom
- Filter panel slides in from bottom
- All animations respect `prefers-reduced-motion`

### Layout
- Fixed header with search and filters
- Scrollable content area
- Fixed bottom navigation (floating style)
- Safe area inset support for iOS devices

### Performance
- View transitions use `translate-x` for GPU acceleration
- Memoized filtered dealer list
- Efficient state management

## Component Structure

```tsx
<DealerFinderMobile dealers={dealers} />
  ├── Fixed Header
  │   ├── Search Bar
  │   ├── Dealer Type Pills (horizontal scroll)
  │   └── Filters Bar (count + filter button)
  │
  ├── Main Content Area
  │   ├── Map View (translate-x transition)
  │   │   └── DealerMapLibre component
  │   └── List View (translate-x transition)
  │       └── Mobile Dealer Cards
  │
  ├── Floating Bottom Navigation
  │   ├── Map button
  │   └── List button (with count)
  │
  ├── Filter Panel (bottom sheet)
  │   └── FilterPanel component
  │
  └── Selected Dealer Sheet (conditional)
      └── Dealer details + actions
```

## Usage

### Integration

The mobile component is automatically shown on screens below the `lg` breakpoint (1024px):

```tsx
// DealerFinderClient.tsx
<DealerFinderMobile dealers={dealers} />  {/* lg:hidden */}
<div className="hidden lg:block">          {/* Desktop view */}
  {/* Desktop dealer finder */}
</div>
```

### Props

```tsx
interface Props {
  dealers: Dealer[]  // Array of dealer objects from Payload CMS
}
```

The component manages its own internal state for:
- Search location and address
- Selected filters (types, services, radius)
- View mode (map/list)
- Selected dealer
- UI states (filter panel open, dealer sheet open)

## Styling

### Design System

**Colors:**
- `kawai-red` (#C41E3A) - Primary actions and accents
- `kawai-charcoal` (#2C2C2C) - Selected states and text
- `kawai-gold` (#D4AF37) - Featured badges
- Gray scale for secondary elements

**Typography:**
- IBM Plex Sans throughout
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Precise size hierarchy for mobile readability

**Spacing:**
- 16px (4 units) base unit
- Generous padding for touch targets
- Consistent 12-16px card padding

### Responsive Breakpoints

- Mobile: `< 1024px` (component visible)
- Desktop: `≥ 1024px` (component hidden)

## Reused Components

The mobile component leverages existing components:

1. **SearchBar** - Location search with autocomplete
2. **FilterPanel** - Advanced filter drawer
3. **DealerMapLibre** - Interactive map with markers
4. **DealerTypeFilter** - Not directly reused; mobile has custom implementation

### Custom Components

**MobileDealerCard** - Compact dealer card optimized for mobile:
- Smaller touch targets
- Condensed information display
- Quick-action buttons
- Distance badge
- Dealer type badges

## State Management

### Internal State

```tsx
const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
const [searchAddress, setSearchAddress] = useState<string>('')
const [selectedRadius, setSelectedRadius] = useState(25)
const [selectedDealerTypes, setSelectedDealerTypes] = useState<string[]>([])
const [selectedServices, setSelectedServices] = useState<string[]>([])
const [selectedDealer, setSelectedDealer] = useState<string | null>(null)
const [filtersOpen, setFiltersOpen] = useState(false)
const [viewMode, setViewMode] = useState<ViewMode>('map')
const [dealerTypeFilter, setDealerTypeFilter] = useState<DealerTypeFilter>('all')
const [dealerSheetOpen, setDealerSheetOpen] = useState(false)
```

### Computed Values

- `dealerCounts` - Memoized count of dealers by type
- `filteredDealers` - Memoized filtered and sorted dealer list
- `selectedDealerData` - Memoized currently selected dealer details

## Accessibility

### Screen Reader Support
- Semantic HTML elements (button, nav, address)
- Proper ARIA labels on interactive elements
- Focus management for modal interactions

### Keyboard Navigation
- Tab order follows visual hierarchy
- Enter/Space for button activation
- Escape to close modals

### Reduced Motion
- All animations respect `prefers-reduced-motion: reduce`
- Defined in global CSS with 0.01ms duration override

## Performance Optimizations

1. **Memoization**
   - `useMemo` for expensive computations (filtering, sorting)
   - `useCallback` for event handlers

2. **Lazy Rendering**
   - Filter panel only renders when open
   - Dealer sheet only renders when dealer selected

3. **GPU Acceleration**
   - `translate-x` for view transitions
   - `scale` for button feedback

4. **Efficient Filtering**
   - Single-pass filtering with multiple conditions
   - Early returns for empty states

## Browser Support

- Modern mobile browsers (Chrome, Safari, Firefox, Edge)
- iOS Safari 14+
- Android Chrome 90+
- Supports safe area insets for iOS notched devices

## Related Files

- `/src/app/(frontend)/find-a-dealer/DealerFinderClient.tsx` - Main container
- `/src/app/(frontend)/find-a-dealer/components/SearchBar.tsx` - Search component
- `/src/app/(frontend)/find-a-dealer/components/FilterPanel.tsx` - Filter drawer
- `/src/app/(frontend)/find-a-dealer/components/DealerMapLibre.tsx` - Map component
- `/src/app/globals.css` - Utility classes (scrollbar-hide, pb-safe)

## Future Enhancements

Potential improvements for future iterations:

1. **Pull to Refresh** - Native-feeling refresh gesture
2. **Haptic Feedback** - Vibration on button taps (iOS)
3. **Persistent State** - Save search/filter preferences to localStorage
4. **Share Location** - Share dealer via native share API
5. **Offline Support** - Cache dealer data for offline browsing
6. **Virtual Scrolling** - For lists with 100+ dealers
7. **Swipe Gestures** - Swipe between map/list views
8. **Map Clustering** - Group nearby dealers on map

## Maintenance Notes

### When Adding New Filters
1. Update `FilterPanel` component first
2. Mobile component will automatically pick up new filters
3. Test filter count badge updates correctly

### When Modifying Dealer Data
1. Update `Dealer` type in `@/payload-types`
2. Update `MobileDealerCard` if new fields needed
3. Update selected dealer sheet if new details added

### When Changing Animations
1. Test on actual devices (not just Chrome DevTools)
2. Verify iOS Safari behavior (different animation timing)
3. Test with reduced motion preferences enabled

## Testing Checklist

- [ ] Search by location works on mobile
- [ ] "Use My Location" requests permission and works
- [ ] Filter panel opens and closes smoothly
- [ ] Map/List toggle transitions smoothly
- [ ] Dealer cards are tappable with 44px minimum
- [ ] Selected dealer sheet opens from list view
- [ ] All buttons have tactile feedback (scale)
- [ ] Active filter count updates correctly
- [ ] Horizontal pill scroll works without visible scrollbar
- [ ] Safe area insets work on iOS notched devices
- [ ] Works in landscape orientation
- [ ] No layout shift on orientation change
- [ ] Reduced motion preferences respected
