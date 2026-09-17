import { getAllPosts, getPodcastEpisodes } from '@/lib/posts';

export interface PostMeta {
  slug: string;
  title: string | null;
  publishedAt: string | null;
  audioUrl: string | null;
  audioDuration: number | null;
}

function toMeta(
  post: {
    slug?: string;
    title?: string | null;
    publishedAt?: string | null;
    audioUrl?: string | null;
    audioDuration?: number | null;
  } | null
): PostMeta | null {
  if (!post?.slug) return null;

  return {
    slug: post.slug,
    title: post.title ?? null,
    publishedAt: post.publishedAt ?? null,
    audioUrl: post.audioUrl ?? null,
    audioDuration:
      typeof post.audioDuration === 'number'
        ? post.audioDuration
        : null,
  };
}

export async function getPostMeta(): Promise<PostMeta[]> {
  try {
    const posts = await getAllPosts();

    return posts
      .map(toMeta)
      .filter((p): p is PostMeta => p !== null);
  } catch {
    return [];
  }
}

export async function getEpisodeMeta(): Promise<PostMeta[]> {
  try {
    const episodes = await getPodcastEpisodes();

    return episodes
      .map(toMeta)
      .filter((p): p is PostMeta => p !== null);
  } catch {
    return [];
  }
}