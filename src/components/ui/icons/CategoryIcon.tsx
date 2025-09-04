interface CategoryIconProps {
  iconName: string
  className?: string
}

export function CategoryIcon({ iconName, className }: CategoryIconProps) {
  // Dynamic icon import would require build-time resolution
  // For now, using a piano icon as fallback
  const PianoIcon = () => (
    <svg 
      className={className} 
      fill="currentColor" 
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 18v-4h1v4H7zm3 0v-4h1v4h-1zm3 0v-4h1v4h-1zm3 0v-4h1v4h-1zM4 14h16V6H4v8z"/>
    </svg>
  )
  
  return <PianoIcon />
}