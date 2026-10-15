import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const postSlug = request.nextUrl.searchParams.get('slug')?.trim();
  if (!postSlug || postSlug.length > 200) {
    return NextResponse.json({ error: 'Invalid post slug' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('post_comments')
    .select('id, author_name, content, created_at')
    .eq('post_slug', postSlug)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading blog comments:', error);
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }

  const comments = (data || []).map((comment) => ({
    id: comment.id,
    author: comment.author_name,
    avatar: comment.author_name
      .split(/\s+/)
      .map((part: string) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    content: comment.content,
    timestamp: comment.created_at,
    likes: 0,
    isLiked: false,
  }));

  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to comment' }, { status: 401 });
  }

  let postSlug: string;
  let content: string;
  try {
    const body = await request.json();
    postSlug = typeof body.postSlug === 'string' ? body.postSlug.trim() : '';
    content = typeof body.content === 'string' ? body.content.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!postSlug || postSlug.length > 200 || !content || content.length > 2000) {
    return NextResponse.json({ error: 'Invalid comment' }, { status: 400 });
  }

  let authorName = 'Hirely member';
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    authorName = user.fullName || user.firstName || authorName;
  } catch (error) {
    console.error('Error loading comment author:', error);
  }

  const { data, error } = await supabaseAdmin
    .from('post_comments')
    .insert({ post_slug: postSlug, user_id: userId, author_name: authorName, content })
    .select('id, author_name, content, created_at')
    .single();

  if (error) {
    console.error('Error saving blog comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }

  return NextResponse.json({
    comment: {
      id: data.id,
      author: data.author_name,
      avatar: data.author_name
        .split(/\s+/)
        .map((part: string) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      content: data.content,
      timestamp: data.created_at,
      likes: 0,
      isLiked: false,
    },
  }, { status: 201 });
}