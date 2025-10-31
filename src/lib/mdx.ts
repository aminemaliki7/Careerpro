// lib/mdx.ts
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

const rehypePrettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
}

export async function compileMDX(source: string) {
  // Normalize whitespace in source before compilation
  const normalizedSource = source
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
    .trim();

  const compiledSource = await compile(normalizedSource, {
    outputFormat: 'function-body',
    remarkPlugins: [
      remarkGfm,
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypePrettyCode, rehypePrettyCodeOptions],
    ],
  })
  
  return String(compiledSource)
}