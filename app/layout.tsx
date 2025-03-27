import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Navbar from './components/Navbar'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from '@/components/ui/toaster'
import { serverBaseURL } from './envConfig'
import ScrollToTop from './components/ScrollToTop'

const defaultUrl = serverBaseURL ?? 'http://localhost:3000';

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
    <html lang="en" className={GeistSans.className} style={{ scrollPaddingTop: "56px" }}>
      <head></head>
      <body className="bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <ScrollToTop />
        <main className="flex flex-col items-center">
          {children}
          <SpeedInsights />
        </main>
        <Toaster />
      </body>
    </html>
  )
}
