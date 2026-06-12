import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WriteAI — AI Writing Assistant',
  description: 'Generate blogs, emails, ad copy and more with AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
