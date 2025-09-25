// UI and component-related types
// Common interface patterns for React components

import type { ReactNode, HTMLAttributes, CSSProperties } from 'react'
import type { Media } from '@/payload-types'

// Base component props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
  id?: string
  'data-testid'?: string
}

// Styled component variants
export type ComponentVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl'

export interface StyledComponentProps {
  variant?: ComponentVariant
  size?: ComponentSize
}

// Button component types
export interface ButtonProps extends BaseComponentProps, StyledComponentProps {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// Input component types
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  error?: string | boolean
  helperText?: string
  label?: string
  name?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
}

// Modal and dialog types
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
  backdrop?: boolean | 'static'
  keyboard?: boolean
}

// Card component types
export interface CardProps extends BaseComponentProps {
  header?: ReactNode
  footer?: ReactNode
  image?: Media | string
  imageAlt?: string
  imagePlacement?: 'top' | 'bottom' | 'left' | 'right'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  hoverable?: boolean
}

// Navigation types
export interface NavigationItem {
  label: string
  href?: string
  icon?: ReactNode
  badge?: string | number
  active?: boolean
  disabled?: boolean
  children?: NavigationItem[]
  onClick?: () => void
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T | string
  title: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (value: any, record: T, index: number) => ReactNode
}

export interface TableProps<T = any> extends BaseComponentProps {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  rowKey?: keyof T | ((record: T) => string)
  pagination?: boolean | PaginationConfig
  onRowClick?: (record: T, index: number) => void
  selection?: {
    selectedRowKeys?: (string | number)[]
    onChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void
  }
}

export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => ReactNode
  onChange?: (page: number, pageSize: number) => void
}

// Form types
export interface FormFieldProps extends BaseComponentProps {
  name: string
  label?: string
  required?: boolean
  error?: string | boolean
  helperText?: string
  tooltip?: string
}

export interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// Loading states
export interface LoadingProps extends BaseComponentProps {
  loading: boolean
  size?: ComponentSize
  overlay?: boolean
  tip?: string
}

// Empty states
export interface EmptyStateProps extends BaseComponentProps {
  title?: string
  description?: string
  image?: Media | string | ReactNode
  action?: ReactNode
}

// Toast/notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationProps {
  type: NotificationType
  title?: string
  message: string
  duration?: number
  closable?: boolean
  onClose?: () => void
}

// Theme and styling
export interface ThemeColors {
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
}

export interface ThemeBreakpoints {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface Theme {
  colors: ThemeColors
  breakpoints: ThemeBreakpoints
  spacing: Record<string, string>
  typography: Record<string, CSSProperties>
  shadows: Record<string, string>
  borderRadius: Record<string, string>
}

// Responsive design types
export type ResponsiveValue<T> = T | {
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

// Animation and transition types
export interface AnimationProps {
  animate?: boolean
  duration?: number
  delay?: number
  easing?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
}

// Accessibility types
export interface AccessibilityProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-hidden'?: boolean
  'aria-live'?: 'off' | 'polite' | 'assertive'
  role?: string
  tabIndex?: number
}

// Intersection Observer types for performance
export interface IntersectionObserverProps {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  skip?: boolean
  initialInView?: boolean
  fallbackInView?: boolean
  trackVisibility?: boolean
  delay?: number
}

// Combined props for common component patterns
export interface ComponentWithMedia extends BaseComponentProps {
  media?: Media | string
  mediaAlt?: string
  mediaPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'background'
  mediaRounded?: boolean
  mediaObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export interface ComponentWithCTA extends BaseComponentProps {
  title?: string
  description?: string
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
}