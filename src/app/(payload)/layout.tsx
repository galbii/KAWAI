import type { Metadata } from 'next'
import { Inter, Crimson_Text } from 'next/font/google'

// Primary font for body text and UI elements
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// Elegant serif font for headings and brand elements
const crimsonText = Crimson_Text({
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
})

export default function PayloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimsonText.variable}`}>
        {children}
      </body>
    </html>
  )
}