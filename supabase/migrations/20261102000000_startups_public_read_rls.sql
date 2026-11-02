alter table public.startups enable row level security;

revoke select on public.startups from anon, authenticated, public;

grant select (
  id,
  name,
  slug,
  description,
  full_description,
  industry,
  size,
  funding_stage,
  founded_date,
  location,
  website_url,
  job_count,
  logo_url,
  featured,
  created_at,
  updated_at,
  status,
  vote_score
) on public.startups to anon, authenticated;

drop policy if exists startups_public_read_approved on public.startups;

create policy startups_public_read_approved
  on public.startups
  for select
  to anon, authenticated
  using (status = 'approved');
