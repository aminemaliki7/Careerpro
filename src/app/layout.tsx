// src/app/layout.tsx
import { type Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper'; // Import the new wrapper

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
  title: 'Hirely - Expert Career Advice & Job Search Strategies',
  description: 'Get expert career advice, CV optimization tips, and job search strategies to land your dream tech job.',
  icons: {
    icon: '../images/blog/logo.svg',
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                  <GoogleAnalytics />
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}