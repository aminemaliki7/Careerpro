import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Hirely - Expert Career Advice & Job Search Strategies',
  description: 'Get expert career advice, CV optimization tips, and job search strategies to land your dream tech job.',
  keywords: 'career advice, job search, CV optimization, tech jobs, interview tips',
  authors: [{ name: 'Hirely Team' }],
  creator: 'Hirely',
  publisher: 'Hirely',
  openGraph: {
    title: 'Hirely - Expert Career Advice & Job Search Strategies',
    description: 'Get expert career advice, CV optimization tips, and job search strategies to land your dream tech job.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hirely - Expert Career Advice & Job Search Strategies',
    description: 'Get expert career advice, CV optimization tips, and job search strategies to land your dream tech job.',
  },
  icons: {
    icon: '../images/blog/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body 
          className={`
            ${geistSans.variable} ${geistMono.variable} 
            antialiased 
            text-gray-900 
            bg-white
            overflow-x-hidden
          `}
        >
          {/* Mobile-first responsive container */}
          <div className="flex flex-col min-h-screen w-full max-w-full">
            {/* Header with mobile optimization */}
            <Header />
            
            {/* Main content area with proper mobile spacing */}
            <main className="flex-grow w-full">
              <div className="w-full max-w-full overflow-x-hidden">
                {children}
              </div>
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
          

        </body>
      </html>
    </ClerkProvider>
  )
}