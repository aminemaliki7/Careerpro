// src/app/layout.tsx
import { type Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';
import Script from 'next/script';
import './globals.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hirely - AI, Startups & Tech Careers Worldwide',
  description:
    'Discover AI trends, startup insights, tech career roadmaps, and global job opportunities for developers, QA, DevOps, and IT professionals.',
  icons: { icon: '/images/blog/logo1.svg' },
  verification: { google: '00c4fbab1e48645b' },
  metadataBase: new URL('https://hirely.ma'),
  alternates: { canonical: 'https://hirely.ma' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hirely.ma',
    siteName: 'Hirely.ma',
    title: 'Hirely - AI, Startups & Tech Careers Worldwide',
    description:
      'Discover AI trends, startup insights, tech career roadmaps, and global job opportunities for developers, QA, DevOps, and IT professionals.',
    images: [
      { url: '/images/blog/logo1.svg', width: 1200, height: 630, alt: 'Hirely.ma - Global Tech Platform' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hirely - AI, Startups & Tech Careers Worldwide',
    description:
      'Discover AI trends, startup insights, tech career roadmaps, and global job opportunities for developers, QA, DevOps, and IT professionals.',
    images: ['/images/blog/logo1.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  keywords: [
    'AI trends 2026',
    'tech startups insights',
    'global tech jobs',
    'remote software engineering jobs',
    'developer career roadmap',
    'machine learning jobs worldwide',
    'DevOps career guidance',
    'QA automation careers',
    'emerging technologies',
    'startup job opportunities',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Podcast JSON-LD */}
          <Script
            id="podcast-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "PodcastSeries",
                "name": "Hirely Tech Podcast",
                "description": "A podcast sharing AI, startup, and tech career insights with global professionals.",
                "url": "https://hirely.ma/podcast",
                "inLanguage": "en",
                "areaServed": {
                  "@type": "Audience",
                  "audienceType": "English speaking countries worldwide"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Hirely.ma",
                  "url": "https://hirely.ma",
                  "logo": { "@type": "ImageObject", "url": "https://hirely.ma/images/blog/logo1.svg" }
                },
                "creator": { "@type": "Person", "name": "Amine" }
              }),
            }}
          />

          {/* Google Tag Manager */}
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-NH5L7MKV');`,
            }}
          />

          {/* Website JSON-LD */}
          <Script
            id="schema-org"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Hirely.ma',
                url: 'https://hirely.ma',
                description:
                  'Explore AI trends, startup insights, tech careers, and global job opportunities for IT professionals.',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://hirely.ma/jobs?search={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              }),
            }}
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-NH5L7MKV"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>

          {/* Google Analytics */}
          <GoogleAnalytics />

          {/* Google AdSense */}
          <Script
            id="adsbygoogle-init"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1955463530202020"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />

          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
