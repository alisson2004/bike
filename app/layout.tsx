import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Mono, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { SupabaseAuthProvider } from '@/components/auth/supabase-auth-provider'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

const dmMono = DM_Mono({ 
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap'
})

const bebasNeue = Bebas_Neue({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'VoltRide | Premium Electric Bikes Australia',
    template: '%s | VoltRide'
  },
  description: 'Electric bike sales, parts and mobile servicing across Australia.',
  keywords: ['electric bike sales', 'e-bikes', 'electric bikes', 'bike shop', 'parts', 'mobile servicing', 'VoltRide'],
  authors: [{ name: 'VoltRide' }],
  icons: {
    icon: '/apple-icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'VoltRide',
  },
}

export const viewport: Viewport = {
  themeColor: '#0b0b0e',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${dmMono.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#16161f',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f5f5f0',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
