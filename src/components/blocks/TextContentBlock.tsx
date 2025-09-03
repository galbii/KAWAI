'use client'

interface TextContentBlockProps {
  content?: {
    title?: string | null
    richText?: any // Lexical rich text content
    alignment?: 'left' | 'center' | 'right' | null
    maxWidth?: 'small' | 'medium' | 'large' | 'full' | null
  }
  layout?: {
    backgroundColor?: 'white' | 'light' | 'dark' | 'brand' | null
    padding?: 'small' | 'medium' | 'large' | null
    textSize?: 'small' | 'medium' | 'large' | null
  }
}

export function TextContentBlock({
  content = {},
  layout = {}
}: TextContentBlockProps) {
  const alignment = content.alignment || 'left'
  const maxWidth = content.maxWidth || 'medium'
  const backgroundColor = layout.backgroundColor || 'white'
  const padding = layout.padding || 'medium'
  const textSize = layout.textSize || 'medium'
  
  // Layout classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  const maxWidthClasses = {
    small: 'max-w-2xl',
    medium: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-none'
  }
  
  const backgroundClasses = {
    white: 'bg-white text-kawai-black',
    light: 'bg-kawai-pearl text-kawai-black',
    dark: 'bg-kawai-black text-white',
    brand: 'bg-kawai-red text-white'
  }
  
  const paddingClasses = {
    small: 'py-8',
    medium: 'py-16 lg:py-24',
    large: 'py-24 lg:py-32'
  }
  
  const textSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl'
  }
  
  const alignmentClass = alignmentClasses[alignment]
  const maxWidthClass = maxWidthClasses[maxWidth]
  const backgroundClass = backgroundClasses[backgroundColor]
  const paddingClass = paddingClasses[padding]
  const textSizeClass = textSizeClasses[textSize]
  
  return (
    <section className={`${paddingClass} ${backgroundClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`${maxWidthClass} mx-auto ${alignmentClass}`}>
          {/* Title */}
          {content.title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {content.title}
            </h2>
          )}
          
          {/* Rich Text Content */}
          {content.richText && (
            <div className={`prose prose-lg max-w-none ${textSizeClass}`}>
              {/* For now, we'll render as plain text. In production, you'd use a Lexical renderer */}
              <div dangerouslySetInnerHTML={{ __html: content.richText }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}