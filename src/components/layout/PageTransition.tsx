'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * PageTransition — wraps page content with a subtle fade + lift entrance.
 *
 * key={pathname} causes the motion.div to remount on every navigation,
 * re-triggering the initial → animate sequence. No exit animation intentionally
 * — exit animations add latency and the NavigationProgress bar handles the
 * "leaving" signal instead.
 *
 * Duration kept at 220ms so it feels snappy, not cinematic.
 * Uses --ease-elegant (0.25, 0.46, 0.45, 0.94) from the brand token set.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.22,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}
