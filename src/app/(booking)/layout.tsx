import type { Metadata } from 'next'
import '../globals.css' // Import global styles

export const metadata: Metadata = {
  title: 'Reserve Your Invitation | KAWAI Piano Gallery',
  description: 'Reserve your invitation to the exclusive KAWAI signature collection showcase. Limited-time premium piano viewing appointments available.',
  robots: 'noindex, nofollow', // Keep booking pages private
}

export default function BookingRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}