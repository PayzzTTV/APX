import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'sonner'
import AnimationProvider from '@/components/AnimationProvider'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="bg-background text-foreground min-h-screen overflow-x-hidden">
        <Navbar />
        <main className="mx-auto px-4 py-6 pb-20">
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
      </body>
    </html>
  )
}
