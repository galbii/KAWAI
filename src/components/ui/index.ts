/**
 * UI Components
 *
 * Central barrel export for all UI components in the KAWAI Piano website.
 * Provides easy access to buttons, cards, dialogs, inputs, and other UI primitives.
 *
 * @example Basic Usage
 * ```tsx
 * import { Button, Card, Input, Label } from '@/components/ui'
 *
 * function MyForm() {
 *   return (
 *     <Card>
 *       <Label>Email</Label>
 *       <Input type="email" placeholder="Enter email" />
 *       <Button>Submit</Button>
 *     </Card>
 *   )
 * }
 * ```
 *
 * @example Advanced Usage
 * ```tsx
 * import {
 *   Dialog, DialogContent, DialogHeader, DialogTitle,
 *   Tabs, TabsList, TabsTrigger, TabsContent,
 *   ResponsiveContainer
 * } from '@/components/ui'
 * ```
 */

// ============================================================================
// Core UI Components
// ============================================================================

export { Button, buttonVariants } from './button'
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent
} from './card'
export { Badge, badgeVariants, type BadgeProps } from './badge'
export { Input } from './input'
export { Label } from './label'
export { FormField, type FormFieldProps } from './form-field'
export { Separator } from './separator'

// ============================================================================
// Dialog Components
// ============================================================================

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from './dialog'

export { Modal, type ModalProps } from './modal'

// ============================================================================
// Dropdown Menu Components
// ============================================================================

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from './dropdown-menu'

// ============================================================================
// Navigation Components
// ============================================================================

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from './navigation-menu'

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from './hover-card'

// ============================================================================
// Tabs Components
// ============================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

// ============================================================================
// Carousel Components
// ============================================================================

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from './carousel'

// ============================================================================
// Loading & Skeleton Components
// ============================================================================

export {
  LoadingSkeleton,
  ImageSkeleton,
  VideoSkeleton,
  CardSkeleton
} from './loading-skeleton'

export {
  LoadingSpinner,
  PianoLoadingSkeleton,
  FeaturedCarouselSkeleton,
  CategorySectionSkeleton,
  LoadingState,
  InlineLoadingState
} from './loading-states'

// ============================================================================
// Media Components
// ============================================================================

export { OptimizedImage } from './optimized-image'
export { OptimizedVideo } from './optimized-video'
export { default as YouTubeEmbed, YouTubeHeroEmbed, YouTubeCardEmbed } from './youtube-embed'

// ============================================================================
// Layout & Container Components
// ============================================================================

export {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack
} from './responsive-container'

// ============================================================================
// Error Handling Components
// ============================================================================

export {
  ErrorBoundary,
  PianoSectionErrorFallback,
  HomeSectionErrorFallback,
  NoResultsFallback,
  LoadingFallback
} from './error-boundary'

// ============================================================================
// Branding Components
// ============================================================================

export { KawaiLogo } from './kawai-logo'
export { ShowroomCTA, QuickScheduleCTA, InlineShowroomLink } from './showroom-cta'

// ============================================================================
// Interactive Components
// ============================================================================

export { default as EmailCapturePopup } from './EmailCapturePopup'
export { ContextAwareLink } from './ContextAwareLink'

// ============================================================================
// Decorative Components
// ============================================================================

export { PianoKeyboardDivider } from './PianoKeyboardDivider'
export { SimpleDivider } from './SimpleDivider'

// ============================================================================
// Subdirectory Re-exports
// ============================================================================

// Media components (image, video, gallery, lightbox)
export * from './media'
export { ImageGalleryLightbox } from './image-gallery-lightbox'

// Animation components (scroll animations, transitions)
export * from './animations'

// 3D Viewer components (product viewers)
export * from './3d-viewer'

// Icon components
export { CategoryIcon } from './icons/CategoryIcon'

// Motion primitives (animation building blocks)
export { InView, type InViewProps } from './motion-primitives/in-view'
