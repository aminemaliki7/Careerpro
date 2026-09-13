-- P0 Security Fix: CVs must not live in a public bucket (PII exposure).
-- New CV uploads go to a private, PDF-only bucket accessed via signed URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('application-cvs', 'application-cvs', false, 5242880, array['application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880,
      allowed_mime_types = array['application/pdf'];

-- Existing CV objects previously uploaded under the public "startup-logos"
-- bucket (path prefix "applications/") are still publicly readable until
-- deleted. Verify the migration and new code are working before cleaning up:
--
--   delete from storage.objects
--    where bucket_id = 'startup-logos'
--      and position('applications/' in name) = 1;