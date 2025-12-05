import { NextConfig } from "next";
import createMDX from '@next/mdx';
import path from 'path'; // <-- Added Node.js path module for absolute path resolution

const nextConfig: NextConfig = {
  // === NEXT.JS WARNING FIXES ===
  
  // 1. Fix: Multiple Lockfiles Warning
  // Explicitly sets the project root for file tracing. 
  // We use `path.join(__dirname, '../../')` because your log indicated 
  // the incorrect lockfile was two directories up (C:\Users\malik\package-lock.json).
  // If your project root is the same folder as next.config.js, use `path.join(__dirname, './')` or just `__dirname`.
  outputFileTracingRoot: path.join(__dirname, '../../'), 

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  // Disable ESLint during builds (temporary)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features for better performance
  experimental: {
    mdxRs: true,
    
    // NOTE: `allowedDevOrigins` is not a recognized Next.js experimental option.
    // If you need to adjust development CORS behavior, handle it via headers()
    // (see the headers() config above) or a local development proxy instead.
    
    // Instruct Next.js to treat pdf-parse as an external Node module.
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains - be more specific in production
      },
      {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Fix for cross-origin requests in development (existing headers)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Handle trailing slashes consistently
  trailingSlash: false,
  
  // Output configuration for Vercel
  output: 'standalone',
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);