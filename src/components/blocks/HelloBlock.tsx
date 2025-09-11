'use client'

import { cn } from '@/lib/utils'
import { format, formatDistanceToNow } from 'date-fns'

interface HelloBlockProps {
  message?: string | null
  showTimestamp?: boolean | null
  timestampFormat?: 'datetime' | 'date' | 'time' | 'relative' | null
  style?: {
    textSize?: 'small' | 'medium' | 'large' | 'xl' | null
    textAlign?: 'left' | 'center' | 'right' | null
    backgroundColor?: 'none' | 'light-gray' | 'dark-gray' | 'brand' | 'accent' | null
    padding?: 'none' | 'small' | 'medium' | 'large' | null
  }
  additionalContent?: {
    showDescription?: boolean | null
    description?: string | null
    showIcon?: boolean | null
    icon?: string | null
    iconPosition?: 'left' | 'right' | 'above' | 'below' | null
  }
}

export function HelloBlock({
  message = 'Hello, World!',
  showTimestamp = false,
  timestampFormat = 'datetime',
  style = {},
  additionalContent = {}
}: HelloBlockProps) {
  const now = new Date()
  
  // Format timestamp based on selected format
  const formatTimestamp = (format: string) => {
    switch (format) {
      case 'datetime':
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }).format(now)
      case 'date':
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium'
        }).format(now)
      case 'time':
        return new Intl.DateTimeFormat('en-US', {
          timeStyle: 'short'
        }).format(now)
      case 'relative':
        return formatDistanceToNow(now, { addSuffix: true })
      default:
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }).format(now)
    }
  }

  // Style classes
  const textSizeClasses = {
    small: 'text-base',
    medium: 'text-lg md:text-xl',
    large: 'text-xl md:text-2xl lg:text-3xl',
    xl: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
  }

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  const backgroundColorClasses = {
    none: '',
    'light-gray': 'bg-gray-50',
    'dark-gray': 'bg-gray-800 text-white',
    brand: 'bg-kawai-red text-white',
    accent: 'bg-kawai-gold text-kawai-black'
  }

  const paddingClasses = {
    none: '',
    small: 'py-4 px-6',
    medium: 'py-8 px-6',
    large: 'py-12 px-8'
  }

  const textSizeClass = textSizeClasses[style.textSize || 'medium']
  const textAlignClass = textAlignClasses[style.textAlign || 'center']
  const backgroundColorClass = backgroundColorClasses[style.backgroundColor || 'none']
  const paddingClass = paddingClasses[style.padding || 'medium']

  // Icon rendering helper
  const renderIcon = () => {
    if (!additionalContent.showIcon || !additionalContent.icon) return null
    
    return (
      <div className="flex-shrink-0">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-current/10">
          <span className="text-xl" role="img" aria-label={additionalContent.icon}>
            {getIconEmoji(additionalContent.icon)}
          </span>
        </div>
      </div>
    )
  }

  // Simple icon mapping
  const getIconEmoji = (iconName: string) => {
    const iconMap: Record<string, string> = {
      wave: '👋',
      smile: '😊',
      star: '⭐',
      heart: '❤️',
      check: '✅',
      rocket: '🚀',
      party: '🎉',
      music: '🎵',
      piano: '🎹',
      note: '🎵'
    }
    return iconMap[iconName.toLowerCase()] || '✨'
  }

  // Content layout based on icon position
  const getContentLayout = () => {
    const icon = renderIcon()
    const content = (
      <div className="flex-1">
        <div className={cn('font-semibold', textSizeClass)}>
          {message}
        </div>
        {showTimestamp && (
          <div className="text-sm opacity-75 mt-2">
            {formatTimestamp(timestampFormat || 'datetime')}
          </div>
        )}
        {additionalContent.showDescription && additionalContent.description && (
          <div className="text-base opacity-90 mt-3 leading-relaxed">
            {additionalContent.description}
          </div>
        )}
      </div>
    )

    if (!icon) return content

    const iconPosition = additionalContent.iconPosition || 'left'

    switch (iconPosition) {
      case 'above':
        return (
          <div className="space-y-4">
            <div className="flex justify-center">{icon}</div>
            {content}
          </div>
        )
      case 'below':
        return (
          <div className="space-y-4">
            {content}
            <div className="flex justify-center">{icon}</div>
          </div>
        )
      case 'right':
        return (
          <div className="flex items-center gap-4">
            {content}
            {icon}
          </div>
        )
      case 'left':
      default:
        return (
          <div className="flex items-center gap-4">
            {icon}
            {content}
          </div>
        )
    }
  }

  return (
    <div className={cn(
      'w-full rounded-lg transition-all duration-300',
      backgroundColorClass,
      paddingClass,
      textAlignClass
    )}>
      {getContentLayout()}
    </div>
  )
}