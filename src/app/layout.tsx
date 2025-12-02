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
  title: 'Hirely.ma - Daily Tech Jobs, Career Tips & Roadmaps',
  description:
    'Find tech jobs, enhance your developer skills, and follow practical career roadmaps for software engineers, QA, DevOps, and IT professionals.',
  icons: { icon: '/images/blog/logo1.svg' },
  verification: { google: '00c4fbab1e48645b' },
  metadataBase: new URL('https://hirely.ma'),
  alternates: { canonical: 'https://hirely.ma' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hirely.ma',
    siteName: 'Hirely.ma',
    title: 'Hirely - Find Tech Jobs, Career Advice & Developer Roadmaps',
    description:
      'Find tech jobs, enhance your developer skills, and follow practical career roadmaps for software engineers, QA, DevOps, and IT professionals.',
    images: [{ url: '/images/blog/logo1.svg', width: 1200, height: 630, alt: 'Hirely.ma - Tech Jobs Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hirely - Find Tech Jobs, Career Advice & Developer Roadmaps',
    description:
      'Find tech jobs, enhance your developer skills, and follow practical career roadmaps for software engineers, QA, DevOps, and IT professionals.',
    images: ['/images/blog/logo1.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
 keywords: [
  'tech jobs platform',
  'software engineering careers',
  'IT jobs worldwide',
  'career roadmaps for developers',
  'DevOps engineer jobs',
  'QA automation jobs',
  'internship opportunities',
  'graduate tech jobs',
  'remote tech jobs',
  'job board for tech professionals',
],

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script
  id="podcast-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PodcastSeries",
      "name": "Hirely Tech Podcast",
      "description": "A podcast where tech professionals share real career stories, job advice, and insights on software, DevOps, QA and the tech industry.",
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
        "logo": {
          "@type": "ImageObject",
          "url": "https://hirely.ma/images/blog/logo1.svg"
        }
      },
      "creator": {
        "@type": "Person",
        "name": "Amine"
      }
    })
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

          {/* JSON-LD Schema for SEO */}
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
                  'Discover daily tech job opportunities, expert career tips, and step-by-step career roadmaps to land your dream IT job.',
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
          {/* Google Tag Manager (noscript) */}
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

          {/* App content */}
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
