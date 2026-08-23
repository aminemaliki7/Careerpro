-- Each job posting belongs to the Clerk user who created it.
-- This lets the company dashboard show only that company's jobs and applicants.
alter table public.jobs
  add column if not exists owner_id text;

create index if not exists jobs_owner_id_idx
  on public.jobs (owner_id);
