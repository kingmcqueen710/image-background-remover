import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free AI Image Background Remover - Remove BG Online',
  description:
    'Remove image background instantly with AI. Free, no signup required. Perfect for ecommerce, portraits, and design. Try now!',
  keywords:
    'image background remover, remove background from image free, background remover online, remove bg from photo, transparent background maker',
  openGraph: {
    title: 'Free AI Image Background Remover',
    description:
      'Remove image background instantly with AI. Free, no signup required. Perfect for ecommerce, portraits, and design.',
    type: 'website',
    siteName: 'BGRemover',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Image Background Remover',
    description: 'Remove image background instantly with AI. Free, no signup required.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
