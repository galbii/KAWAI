'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  storeslug: string
  schoolName?: string
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
    <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.44,0,.84.84,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"/>
  </svg>
)

const ProgramsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"/>
  </svg>
)

const FacultyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
    <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
  </svg>
)

const PoliciesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-40-64H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0,32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-64H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z"/>
  </svg>
)

export function MusicSchoolNav({ storeslug }: Props) {
  const pathname = usePathname()
  const base = `/store/${storeslug}/music-school`

  const navItems = [
    {
      label: 'Overview',
      href: base,
      isActive: pathname === base || pathname === `${base}/`,
      icon: <HomeIcon />,
    },
    {
      label: 'Programs',
      href: `${base}/programs`,
      isActive: pathname.startsWith(`${base}/programs`),
      icon: <ProgramsIcon />,
    },
    {
      label: 'Faculty',
      href: `${base}/faculty`,
      isActive: pathname.startsWith(`${base}/faculty`),
      icon: <FacultyIcon />,
    },
    {
      label: 'Policies',
      href: `${base}/policies`,
      isActive: pathname.startsWith(`${base}/policies`),
      icon: <PoliciesIcon />,
    },
  ]

  return (
    <>
      {/* Desktop: fixed right-side vertical nav */}
      <nav
        aria-label="Music school navigation"
        className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3"
      >
        {/* Vertical connecting line */}
        <div
          aria-hidden="true"
          className="absolute right-[19px] top-5 bottom-5 w-px bg-kawai-neutral"
        />

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative flex items-center gap-3"
            aria-label={item.label}
            aria-current={item.isActive ? 'page' : undefined}
          >
            {/* Label: hidden by default, slides in on hover or when active */}
            <span
              className={[
                'text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap',
                'transition-all duration-200',
                item.isActive
                  ? 'opacity-100 translate-x-0 text-kawai-black'
                  : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-kawai-charcoal',
              ].join(' ')}
            >
              {item.label}
            </span>

            {/* Icon button */}
            <div
              className={[
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center',
                'transition-all duration-200 border-2',
                item.isActive
                  ? 'bg-kawai-red border-kawai-red text-white shadow-[0_0_0_4px_rgba(225,25,34,0.12)]'
                  : 'bg-white border-kawai-neutral text-kawai-charcoal group-hover:border-kawai-red group-hover:text-kawai-red group-hover:shadow-sm',
              ].join(' ')}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </nav>

      {/* Mobile: fixed bottom tab bar */}
      <nav
        aria-label="Music school navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-kawai-neutral flex safe-area-bottom"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.isActive ? 'page' : undefined}
            className={[
              'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors',
              item.isActive ? 'text-kawai-red' : 'text-kawai-charcoal',
            ].join(' ')}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
