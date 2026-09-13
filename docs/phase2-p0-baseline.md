# Phase 2 P0 — Baseline Snapshot

Freeze point captured before the P0 security changes.
Branch: `prod` at `867e593 Refactoring` (working tree clean).

## Build status at baseline
- `npm run type-check` (`tsc --noEmit`): passes.
- `npm run build`: passes (Next.js 15.5.7, ~52 routes, 1 middleware).
- Live schema not hoisted into the repo before this session.

## Known schema (from committed migrations)
Only two migrations exist:

1. `20260822233000_add_company_job_ownership.sql`
   - Adds `public.jobs.owner_id text` + index `jobs_owner_id_idx`.

2. `20260901000000_add_recruitment_automation_v1.sql`
   - Adds on `public.applications`: `pipeline_stage` (default `application`),
     `internal_notes`, `last_activity_date`.
   - `public.automation_config` (owner_id, job_id FK, rule_type, threshold,
     action, enabled, unique per job+rule).
   - `public.candidate_communications` (application_id FK, recruiter_id,
     event_type w/ CHECK constraint, subject, body, created_at) + indexes.

## Schema inferred from the codebase (unversioned in live DB)
- `public.jobs` — includes `title`, `company`, `location`, `type`, `salary_range`,
  `requirements`, `skills`, `description`, `owner_id`, `status`
  (`pending|approved|rejected`).
- `public.startups` — includes `slug`, `logo_url`, `status`
  (`pending|approved|rejected`).
- `public.applications` — `id uuid`, `user_id`, `job_id`, `job_title`, `company`,
  `location`, `salary_range`, `cv_text`, `cv_url`, `cv_file_name`,
  `generated_email`, `status` (`pending|interview|accepted|rejected`),
  `ai_applied`, `ats_score`, `applied_date`, `contacted_date`,
  `created_at`, `updated_at`, plus the 3 automation columns above.
- `public.user_profiles` — `id`, `clerk_id`, `role`
  (`candidate|company|founder|recruiter`).
- `public.emails` — `email` (newsletter subscribers).
- `public.podcast_stats` — `episode_slug`, `total_listens`,
  `total_duration_seconds`.
- `public.saved_jobs` — per-code references in `/api/jobs/saved`.

## Storage buckets
- `startup-logos` — public. Holds `logos/*` (site assets) AND, historically,
  `applications/*` (candidate CVs — PII). **Fix:** new uploads moved to
  `application-cvs` (private, migration `20260904000000_private_cv_storage.sql`).
  Existing public CV objects still need manual cleanup (SQL noted in the migration).

## How to export the authoritative live schema/RLS (Supabase CLI)
The service-role key cannot dump the schema via REST. To version the real
schema + RLS policies (recommended, part of the P0 baseline):

```
npx supabase link --project-ref <ref>      # needs SUPABASE_ACCESS_TOKEN
npx supabase db dump --linked > supabase/migrations/_live_dump.sql
```

Also enable RLS per-table (`alter table ... enable row level security;`) and add
policies once the live schema is versioned — aides exist (`add-note`,
`update-stage` reference the intended ownership model: recruiter = job.owner_id,
candidate = application.user_id).

## P0 changes captured after this snapshot
See the migration above plus the API/source edits made in this session
(internal_notes allowlist, candidate-timeline event filtering, storage IDOR
scoping, private CV bucket + signed-URL route, founder role gate, middleware
public routes restored, rate limiting, input validation, podcast stats fix,
status filters on detail routes).