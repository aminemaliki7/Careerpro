create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null check (char_length(post_slug) between 1 and 200),
  user_id text not null,
  author_name text not null,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists post_comments_slug_created_at_idx
  on public.post_comments (post_slug, created_at desc);

alter table public.post_comments enable row level security;