// next.config.mjs - Next.js Configuration for MDX Blog
import createMDX from '@next/mdx'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
 
  // Experimental features for better performance
  experimental: {
    mdxRs: true,
    // Externalize packages that don't work well in serverless
    serverComponentsExternalPackages: ['pdfjs-dist', 'mammoth', 'pdf-parse'],
  },
 
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains - be more specific in production
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
 
  // Fix for cross-origin requests in development
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
 
  // Fix workspace root warning
  outputFileTracingRoot: path.join(__dirname),
 
  // Webpack configuration optimized for Vercel serverless
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize problematic dependencies for serverless
      config.externals = config.externals || [];
      config.externals.push(
        'canvas',
        'sharp',
      );
     
      // Handle pdf-parse and pdfjs-dist native dependencies
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias.canvas = false;
      
      // Ensure proper module resolution for pdfjs-dist
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    return config;
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)