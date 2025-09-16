// next.config.mjs - Next.js Configuration for MDX Blog
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Experimental features for better performance
  experimental: {
    mdxRs: true,
  },
  // Image optimization for blog images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
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