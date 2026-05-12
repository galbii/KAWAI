interface SocialBrandIconProps {
  platform: string
  className?: string
}

export function SocialBrandIcon({ platform, className = 'w-4 h-4' }: SocialBrandIconProps) {
  switch (platform) {
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect width="24" height="24" rx="5.5" fill="url(#ig-grad)" />
          <path
            d="M12 7.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 7.92a3.12 3.12 0 110-6.24 3.12 3.12 0 010 6.24zm5.04-8.16a1.08 1.08 0 100 2.16 1.08 1.08 0 000-2.16zm3.36 1.08c0-1.44-.48-2.76-1.44-3.72A5.357 5.357 0 0015.24 3H8.76C5.88 3 3.6 5.28 3.6 8.16v6.48C3.6 17.52 5.88 19.8 8.76 19.8h6.48c1.44 0 2.76-.48 3.72-1.44.96-.96 1.44-2.28 1.44-3.72V8.04zm-1.68 6.6c0 .96-.36 1.8-.96 2.4-.6.6-1.44.96-2.4.96H8.64c-.96 0-1.8-.36-2.4-.96-.6-.6-.96-1.44-.96-2.4V8.04c0-.96.36-1.8.96-2.4.6-.6 1.44-.96 2.4-.96h6.48c.96 0 1.8.36 2.4.96.6.6.96 1.44.96 2.4v6.6z"
            fill="white"
          />
        </svg>
      )

    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#FF0000" />
          <path
            d="M19.8 8.2a1.8 1.8 0 00-1.27-1.27C17.3 6.6 12 6.6 12 6.6s-5.3 0-6.53.33A1.8 1.8 0 004.2 8.2C3.87 9.43 3.87 12 3.87 12s0 2.57.33 3.8a1.8 1.8 0 001.27 1.27c1.23.33 6.53.33 6.53.33s5.3 0 6.53-.33a1.8 1.8 0 001.27-1.27c.33-1.23.33-3.8.33-3.8s0-2.57-.33-3.8z"
            fill="white"
          />
          <path d="M10.2 14.4V9.6l4.4 2.4-4.4 2.4z" fill="#FF0000" />
        </svg>
      )

    case 'spotify':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#1DB954" />
          <path
            d="M16.94 16.38c-.19.3-.55.4-.85.2-2.34-1.44-5.28-1.76-8.76-.96-.34.1-.65-.15-.75-.45-.1-.35.15-.65.5-.75 3.8-.86 7.08-.5 9.67 1.1.31.16.4.54.19.86zm1.19-2.74c-.24.36-.7.5-1.05.25-2.68-1.64-6.76-2.12-9.92-1.14-.4.12-.82-.1-.94-.5-.12-.4.1-.82.5-.94 3.62-1.08 8.12-.56 11.16 1.28.36.22.46.7.25 1.05zm.1-2.85C14.96 8.9 7.58 8.67 4.48 9.62c-.48.14-.98-.13-1.12-.6-.14-.48.13-.98.6-1.12 3.56-1.08 9.48-.87 13.22 1.33.43.25.58.8.33 1.23-.25.44-.8.58-1.23.33z"
            fill="white"
          />
        </svg>
      )

    case 'apple-music':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#FC3C44" />
          <path
            d="M16.5 6l-6.5 1.5v7.08c-.3-.1-.63-.16-.97-.16-1.4 0-2.53.97-2.53 2.17S7.63 18.76 9.03 18.76c1.38 0 2.5-.95 2.52-2.13V10.5l5-1.15V14.92c-.3-.1-.63-.16-.97-.16-1.4 0-2.53.97-2.53 2.17s1.13 2.17 2.53 2.17c1.38 0 2.5-.95 2.52-2.13V6h-1.1z"
            fill="white"
          />
        </svg>
      )

    case 'soundcloud':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#FF5500" />
          <path
            d="M4 14.5a1 1 0 102 0v-1a1 1 0 10-2 0v1zm2.5.5a1 1 0 102 0v-2.5a1 1 0 10-2 0V15zm2.5.25a1 1 0 102 0V11.5a1 1 0 10-2 0v3.75zm2.5.25a1 1 0 102 0V10.5a1 1 0 10-2 0V16zm2.5 0c.55 0 1-.45 1-1V9.5c0-.55-.45-1-1-1s-1 .45-1 1V15c0 .55.45 1 1 1zm2.5-.5a1 1 0 001-1V10c0-1.66-1.34-3-3-3-.28 0-.55.04-.81.1A3.5 3.5 0 0013 9.5V15c0 .55.45 1 1 1h4.5z"
            fill="white"
          />
        </svg>
      )

    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#1877F2" />
          <path
            d="M16.5 8H14c-.28 0-.5.22-.5.5V10h3l-.5 2.5H13.5V20H11v-7.5H9V10h2V8.5C11 6.57 12.57 5 14.5 5H16.5v3z"
            fill="white"
          />
        </svg>
      )

    case 'twitter':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#000000" />
          <path
            d="M17.75 5h-2.5L12 9.25 9 5H4l5.25 7L4 19h2.5L10 14.5 13.25 19H19l-5.5-7.25L17.75 5zm-2.25 12l-9-12h1.75l9 12h-1.75z"
            fill="white"
          />
        </svg>
      )

    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#010101" />
          <path
            d="M19 8.5a4.5 4.5 0 01-4.5-4.5h-2V15.5a2 2 0 11-2-2 2 2 0 01.5.07V11.5a5.5 5.5 0 00-.5-.03 5.5 5.5 0 000 11 5.5 5.5 0 005.5-5.5V9a7 7 0 004 1.25V8a4.5 4.5 0 01-1-.5z"
            fill="white"
          />
        </svg>
      )

    case 'linkedin':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#0A66C2" />
          <path
            d="M7 9.5H5v9h2v-9zm-1-3a1.25 1.25 0 100 2.5A1.25 1.25 0 006 6.5zm13 12h-2v-4.5c0-1.5-.75-2-1.5-2s-1.5.5-1.5 2V18.5h-2v-9h2V11c.25-.5 1-1.5 2.5-1.5C18.5 9.5 19 11 19 13v5.5z"
            fill="white"
          />
        </svg>
      )

    case 'bandcamp':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#1DA0C3" />
          <path d="M4 14.5L8.5 7H20l-4.5 7.5H4z" fill="white" />
        </svg>
      )

    case 'website':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 2C9.5 5 8 8.5 8 12s1.5 7 4 10M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
  }
}
