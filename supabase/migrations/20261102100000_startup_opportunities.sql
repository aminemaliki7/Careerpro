-- Link new startup opportunities to the startup they belong to. Existing jobs
-- remain unlinked so historical records and applications are not rewritten.
alter table public.jobs
  add column startup_id uuid references public.startups(id) on delete set null,
  add column compensation_type text;

alter table public.jobs
  add constraint jobs_compensation_type_check
  check (
    compensation_type is null
    or compensation_type in ('paid', 'equity', 'unpaid', 'unspecified')
  );

-- Founder-created records still enter moderation as pending. Closed is only
-- used to let an owner unpublish a previously approved opportunity.
alter table public.jobs
  drop constraint jobs_status_check,
  add constraint jobs_status_check
    check (status in ('pending', 'approved', 'rejected', 'closed'));

create index jobs_startup_status_posted_date_idx
  on public.jobs (startup_id, status, posted_date desc);
