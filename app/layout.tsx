import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Navbar from './components/Navbar'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from '@/components/ui/toaster'
import { baseURL } from './envConfig'

const defaultUrl = baseURL

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'TV Show App',
  description: 'A social media app for TV shows by @ajglodo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head></head>
      <body className="bg-background text-foreground">
        <Navbar />
        <main className="min-h-screen flex flex-col items-center">
          {children}
          <SpeedInsights />
        </main>
        <Toaster />
      </body>
    </html>
  )
}
