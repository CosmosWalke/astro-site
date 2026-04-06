import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SmoothScrollProvider } from '@/components/SmoothScroll'
import { ClientWrapper } from '@/components/ClientWrapper'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ASTRO | The Keepers Protocol',
  description: 'Enter the world of ASTRO - A dystopian universe where Keepers protect the last remnants of humanity.',
  keywords: ['ASTRO', 'Keepers', 'Protocol', 'NFT', 'Web3', 'Dystopian', 'Universe'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#050508] text-[#e8e8ec] overflow-x-hidden">
        <SmoothScrollProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  )
}