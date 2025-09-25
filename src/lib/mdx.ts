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
  const compiledSource = await compile(source, {
    outputFormat: 'function-body',
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypePrettyCode, rehypePrettyCodeOptions],
    ],
  })
  
  return String(compiledSource)
}