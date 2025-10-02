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
  description: 'Discover daily tech job opportunities, expert career tips, and step-by-step career roadmaps to land your dream IT job.',
  icons: {
    icon: '/images/blog/logo1.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google AdSense account meta */}
          <meta name="google-adsense-account" content="ca-pub-1955463530202020" />

          {/* Google AdSense script */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1955463530202020"
            crossOrigin="anonymous"
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <GoogleAnalytics />
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
