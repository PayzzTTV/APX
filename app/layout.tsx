import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'sonner'
import AnimationProvider from '@/components/AnimationProvider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import QueryProvider from '@/components/QueryProvider'

export const metadata: Metadata = {
  title: 'APX - Location de Voitures',
  description: 'Louez la voiture de vos rêves en quelques clics',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'APX',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="bg-background text-foreground min-h-screen overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
        >
          Aller au contenu principal
        </a>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main id="main-content" className="mx-auto px-4 py-6 pb-20" role="main">
              <AnimationProvider>
                {children}
              </AnimationProvider>
            </main>
            <Toaster
              position="top-center"
              expand={false}
              richColors
              theme="dark"
              toastOptions={{
                style: {
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#fff',
                },
              }}
            />
          </NextIntlClientProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
