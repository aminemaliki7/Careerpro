import dotenv from 'dotenv'

dotenv.config({
  path: '.env.local',
})

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const IMAGES_DIR = path.join(
  process.cwd(),
  'public/images'
)

const AUDIO_DIR = path.join(
  process.cwd(),
  'public/audio/blog'
)

const IMAGES_BUCKET = 'images'
const AUDIO_BUCKET = 'audio'

const DRY_RUN = process.argv.includes('--dry-run')
const SKIP_IMAGES = process.argv.includes('--skip-images')
const SKIP_AUDIO = process.argv.includes('--skip-audio')

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

type LocalFile = {
  fullPath: string
  relPath: string
}

/**
 * Files/folders that should never be uploaded.
 */
const IGNORE_PATTERNS = [
  /_fichiers$/,
  /^\[.*\]$/,
]

function shouldIgnore(name: string): boolean {
  return IGNORE_PATTERNS.some((re) =>
    re.test(name)
  )
}

function getAllFiles(
  directory: string
): LocalFile[] {
  if (!fs.existsSync(directory)) {
    return []
  }

  const entries = fs.readdirSync(
    directory,
    { withFileTypes: true }
  )

  const files: LocalFile[] = []

  for (const entry of entries) {
    if (shouldIgnore(entry.name)) {
      continue
    }

    const fullPath = path.join(
      directory,
      entry.name
    )

    if (entry.isDirectory()) {
      files.push(
        ...getAllFiles(fullPath)
      )
      continue
    }

    const relPath = path
      .relative(directory, fullPath)
      .split(path.sep)
      .join('/')

    files.push({
      fullPath,
      relPath,
    })
  }

  return files
}

function guessContentType(
  fileName: string
): string {
  const ext = path
    .extname(fileName)
    .toLowerCase()

  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',

    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.aac': 'audio/aac',
  }

  return (
    map[ext] ??
    'application/octet-stream'
  )
}

async function ensureBucket(
  name: string
): Promise<void> {
  const {
    data: buckets,
    error,
  } = await supabase.storage.listBuckets()

  if (error) {
    throw error
  }

  const exists = buckets.some(
    (bucket) => bucket.name === name
  )

  if (exists) {
    console.log(
      `  Bucket "${name}" already exists`
    )
    return
  }

  if (DRY_RUN) {
    console.log(
      `  [dry-run] Would create public bucket "${name}"`
    )
    return
  }

  const {
    error: createError,
  } = await supabase.storage.createBucket(
    name,
    {
      public: true,
    }
  )

  if (createError) {
    throw createError
  }

  console.log(
    `  Created public bucket "${name}"`
  )
}

/**
 * Uploads the file and returns ONLY the
 * Supabase Storage key/path.
 *
 * Example:
 * blog/article.mp3
 */
async function uploadFile(
  bucket: string,
  file: LocalFile
): Promise<string | null> {
  const storageKey = file.relPath

  if (DRY_RUN) {
    console.log(
      `  [dry-run] Would upload ${file.relPath} -> ${bucket}/${storageKey}`
    )

    return storageKey
  }

  const buffer = fs.readFileSync(
    file.fullPath
  )

  const {
    error,
  } = await supabase.storage
    .from(bucket)
    .upload(
      storageKey,
      buffer,
      {
        contentType:
          guessContentType(
            file.relPath
          ),
        upsert: true,
      }
    )

  if (error) {
    throw new Error(
      `Upload failed for ${file.relPath}: ${error.message}`
    )
  }

  return storageKey
}

async function uploadFolder(
  bucket: string,
  directory: string,
  label: string
): Promise<Map<string, string>> {
  const files = getAllFiles(directory)

  console.log('')
  console.log(
    `${label}: found ${files.length} file(s) in ${directory}`
  )

  const storageKeyByRelPath =
    new Map<string, string>()

  for (const file of files) {
    try {
      const storageKey =
        await uploadFile(
          bucket,
          file
        )

      if (storageKey) {
        storageKeyByRelPath.set(
          file.relPath,
          storageKey
        )
      }

      console.log(
        `  ✓ ${file.relPath}`
      )
    } catch (error) {
      console.error(
        `  ✗ ${file.relPath}`
      )

      console.error(
        error instanceof Error
          ? error.message
          : String(error)
      )
    }
  }

  return storageKeyByRelPath
}

/**
 * Converts the old local DB value into
 * the relative Storage key.
 *
 * /images/foo.jpg
 *       ↓
 * foo.jpg
 *
 * /audio/blog/foo.mp3
 *       ↓
 * foo.mp3
 */
function localPathToStorageKey(
  localPath: string | null,
  prefix: string
): string | null {
  if (
    !localPath ||
    !localPath.startsWith(prefix)
  ) {
    return null
  }

  return localPath.slice(
    prefix.length
  )
}

type ArticleMediaRow = {
  id: string
  slug: string
  cover_image: string | null
  audio_url: string | null
}

async function migrateArticlesTable(
  imageKeyByPath: Map<string, string>,
  audioKeyByPath: Map<string, string>
): Promise<{
  updated: number
  unmatchedCoverImages: ArticleMediaRow[]
  unmatchedAudio: ArticleMediaRow[]
}> {
  console.log('')
  console.log('Fetching articles...')

  const {
    data,
    error,
  } = await supabase
    .from('articles')
    .select(
      'id, slug, cover_image, audio_url'
    )

  if (error) {
    throw error
  }

  const articles =
    (data as ArticleMediaRow[]) ?? []

  console.log(
    `  Found ${articles.length} article row(s)`
  )

  const unmatchedCoverImages:
    ArticleMediaRow[] = []

  const unmatchedAudio:
    ArticleMediaRow[] = []

  let updated = 0

  for (const article of articles) {
    const updates: Record<
      string,
      string
    > = {}

    /**
     * IMAGE
     */
    if (
      article.cover_image?.startsWith('/')
    ) {
      const key =
        localPathToStorageKey(
          article.cover_image,
          '/images/'
        )

      const storageKey = key
        ? imageKeyByPath.get(key)
        : undefined

      if (storageKey) {
        updates.cover_image =
          storageKey
      } else {
        unmatchedCoverImages.push(
          article
        )
      }
    }

    /**
     * AUDIO
     */
    if (
      article.audio_url?.startsWith('/')
    ) {
      const key =
        localPathToStorageKey(
          article.audio_url,
          '/audio/blog/'
        )

      const storageKey = key
        ? audioKeyByPath.get(key)
        : undefined

      if (storageKey) {
        updates.audio_url =
          storageKey
      } else {
        unmatchedAudio.push(
          article
        )
      }
    }

    if (
      Object.keys(updates).length === 0
    ) {
      continue
    }

    if (DRY_RUN) {
      console.log(
        `  [dry-run] Would update "${article.slug}":`,
        updates
      )

      updated++
      continue
    }

    const {
      error: updateError,
    } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', article.id)

    if (updateError) {
      console.error(
        `  ✗ ${article.slug}: ${updateError.message}`
      )
    } else {
      console.log(
        `  ✓ ${article.slug}`
      )

      updated++
    }
  }

  return {
    updated,
    unmatchedCoverImages,
    unmatchedAudio,
  }
}

async function migrate() {
  console.log('')
  console.log(
    '=========================================='
  )
  console.log(
    'Hirely Media → Supabase Storage Migration'
  )
  console.log(
    '=========================================='
  )

  if (DRY_RUN) {
    console.log(
      'DRY RUN — no changes will be made'
    )
  }

  /**
   * BUCKETS
   */
  if (!SKIP_IMAGES) {
    console.log('')
    console.log('=== Images bucket ===')

    await ensureBucket(
      IMAGES_BUCKET
    )
  }

  if (!SKIP_AUDIO) {
    console.log('')
    console.log('=== Audio bucket ===')

    await ensureBucket(
      AUDIO_BUCKET
    )
  }

  /**
   * UPLOAD IMAGES
   */
  const imageKeyByPath =
    SKIP_IMAGES
      ? new Map<string, string>()
      : await uploadFolder(
          IMAGES_BUCKET,
          IMAGES_DIR,
          'Images'
        )

  /**
   * UPLOAD AUDIO
   */
  const audioKeyByPath =
    SKIP_AUDIO
      ? new Map<string, string>()
      : await uploadFolder(
          AUDIO_BUCKET,
          AUDIO_DIR,
          'Audio'
        )

  /**
   * UPDATE DATABASE
   */
  const {
    updated,
    unmatchedCoverImages,
    unmatchedAudio,
  } = await migrateArticlesTable(
    imageKeyByPath,
    audioKeyByPath
  )

  console.log('')
  console.log(
    '=========================================='
  )
  console.log(
    'MIGRATION RESULT'
  )
  console.log(
    '=========================================='
  )

  console.log(
    `Images uploaded: ${imageKeyByPath.size}`
  )

  console.log(
    `Audio uploaded:  ${audioKeyByPath.size}`
  )

  console.log(
    `Articles updated: ${updated}`
  )

  console.log(
    '=========================================='
  )

  /**
   * UNMATCHED IMAGES
   */
  if (
    unmatchedCoverImages.length > 0
  ) {
    console.log('')
    console.log(
      'cover_image not found on disk (left untouched):'
    )

    for (
      const article
      of unmatchedCoverImages
    ) {
      console.log(
        `  - ${article.slug}: ${article.cover_image}`
      )
    }
  }

  /**
   * UNMATCHED AUDIO
   */
  if (
    unmatchedAudio.length > 0
  ) {
    console.log('')
    console.log(
      'audio_url not found on disk (left untouched):'
    )

    for (
      const article
      of unmatchedAudio
    ) {
      console.log(
        `  - ${article.slug}: ${article.audio_url}`
      )
    }
  }

  console.log('')

  if (
    unmatchedCoverImages.length > 0 ||
    unmatchedAudio.length > 0
  ) {
    process.exitCode = 1
  }
}

migrate()