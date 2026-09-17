import dotenv from 'dotenv'

dotenv.config({
  path: '.env.local',
})
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const postsDirectory = path.join(
  process.cwd(),
  'src/content/posts'
)

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL'
  )
}

if (!serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY'
  )
}

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey
)

function getAllMdxFiles(
  directory: string
): string[] {
  const entries = fs.readdirSync(
    directory,
    { withFileTypes: true }
  )

  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(
      directory,
      entry.name
    )

    if (entry.isDirectory()) {
      files.push(
        ...getAllMdxFiles(fullPath)
      )
    }

    if (
      entry.isFile() &&
      entry.name.endsWith('.mdx')
    ) {
      files.push(fullPath)
    }
  }

  return files
}

function toStringArray(
  value: unknown
): string[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map(String)
  }

  return [String(value)]
}

function toNullableString(
  value: unknown
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return null
  }

  return String(value)
}

function toDate(
  value: unknown,
  fallback: string
): string {
  if (!value) {
    return fallback
  }

  const date = new Date(String(value))

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  return date.toISOString()
}

function getSlug(
  filePath: string,
  data: Record<string, unknown>
): string {
  if (
    typeof data.slug === 'string' &&
    data.slug.trim()
  ) {
    return data.slug.trim()
  }

  return path.basename(
    filePath,
    '.mdx'
  )
}

async function migrate() {
  const files =
    getAllMdxFiles(postsDirectory)

  console.log('')
  console.log(
    '=========================================='
  )
  console.log(
    'Hirely MDX → Supabase Article Migration'
  )
  console.log(
    '=========================================='
  )
  console.log(
    `Found ${files.length} MDX articles`
  )
  console.log('')

  let success = 0
  let failed = 0

  for (const filePath of files) {
    const fileName =
      path.basename(filePath)

    try {
      const source =
        fs.readFileSync(
          filePath,
          'utf8'
        )

      const parsed =
        matter(source)

      const data =
        parsed.data as Record<
          string,
          unknown
        >

      const content =
        parsed.content.trim()

      const slug =
        getSlug(filePath, data)

      const publishedAt =
        toDate(
          data.publishedAt,
          new Date().toISOString()
        )

      const updatedAt =
        toDate(
          data.updatedAt,
          publishedAt
        )

      const article = {
        slug,

        title: String(
          data.title ?? slug
        ),

        description: String(
          data.description ?? ''
        ),

        /*
         * Keep the original Markdown.
         * We will render it properly in Next.js.
         */
        content,

        published_at:
          publishedAt,

        updated_at:
          updatedAt,

        author: String(
          data.author ?? 'Hirely'
        ),

        tags:
          toStringArray(
            data.tags
          ),

        seo_keywords:
          toStringArray(
            data.seoKeywords
          ),

        featured:
          Boolean(
            data.featured ?? false
          ),

        cover_image:
          toNullableString(
            data.coverImage
          ),

        audio_url:
          toNullableString(
            data.audioUrl
          ),

        audio_duration:
          data.audioDuration !==
          undefined
            ? Number(
                data.audioDuration
              )
            : null,

        highlights:
          data.highlights ??
          null,

        roadmap:
          data.roadmap ??
          null,

        affiliate_course_links:
          data.affiliateCourseLinks ??
          null,

        /*
         * Every existing MDX article
         * is currently public.
         */
        status: 'published',
      }

      const { error } =
        await supabase
          .from('articles')
          .upsert(
            article,
            {
              onConflict: 'slug',
            }
          )

      if (error) {
        throw error
      }

      console.log(
        `✓ ${slug}`
      )

      success++
    } catch (error) {
      console.error(
        `✗ ${fileName}`
      )

      console.error(
        error instanceof Error
          ? error.message
          : String(error)
      )

      failed++
    }
  }

  console.log('')
  console.log(
    '=========================================='
  )
  console.log('MIGRATION RESULT')
  console.log(
    '=========================================='
  )

  console.log(
    `Total:   ${files.length}`
  )

  console.log(
    `Success: ${success}`
  )

  console.log(
    `Failed:  ${failed}`
  )

  console.log(
    '=========================================='
  )
  console.log('')

  if (failed > 0) {
    process.exitCode = 1
  }
}

migrate()