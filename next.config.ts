import { NextConfig } from "next";
import createMDX from '@next/mdx';
import path from 'path';

const nextConfig: NextConfig = {
  // === NEXT.JS WARNING FIXES ===

  // 1. Fix: Multiple Lockfiles Warning
  // Explicitly sets the project root for file tracing.
  outputFileTracingRoot: __dirname,

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
   serverExternalPackages: ['pdf-parse'],

  // Disable ESLint during builds (temporary)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Experimental features for better performance
  experimental: {
    mdxRs: true,

    // Instruct Next.js to treat pdf-parse as an external Node module.
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
    ];
  },

  // Handle trailing slashes consistently
  trailingSlash: false,

  // Output configuration for Vercel
  output: 'standalone',

  // Webpack overrides for pdfjs-dist (previously in next.config.mjs)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false, // pdfjs-dist has optional canvas dependency
      };

      config.module = config.module || {};
      config.module.rules = config.module.rules || [];

      config.module.rules.push({
        test: /pdf\.worker\.(min\.)?js/,
        type: 'asset/resource',
        generator: {
          filename: 'static/worker/[hash][ext][query]',
        },
      });
    }

    return config;
  },
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
