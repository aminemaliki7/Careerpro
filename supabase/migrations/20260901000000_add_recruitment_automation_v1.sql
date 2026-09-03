-- Recruitment Automation V1 - Database Schema
-- Phase 1 Migration
-- Date: 2026-09-01

-- ============================================================================
-- STEP 1: Add columns to applications table for pipeline tracking
-- ============================================================================

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS pipeline_stage VARCHAR(50) DEFAULT 'application',
  ADD COLUMN IF NOT EXISTS internal_notes TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP DEFAULT NULL;

-- ============================================================================
-- STEP 2: Create automation_config table for recruitment rules
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.automation_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  job_id INTEGER NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  rule_type VARCHAR(50) NOT NULL,
  threshold INTEGER NOT NULL,
  action VARCHAR(50) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT automation_config_job_rule_unique UNIQUE (job_id, rule_type)
);

CREATE INDEX IF NOT EXISTS automation_config_owner_job 
  ON public.automation_config(owner_id, job_id);
CREATE INDEX IF NOT EXISTS automation_config_job 
  ON public.automation_config(job_id);

-- ============================================================================
-- STEP 3: Create candidate_communications table for event timeline
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.candidate_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  recruiter_id TEXT NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT event_type_check CHECK (
    event_type IN (
      'application_submitted',
      'ats_analyzed',
      'stage_changed',
      'note_added',
      'email_sent',
      'candidate_rejected',
      'candidate_hired'
    )
  )
);

CREATE INDEX IF NOT EXISTS candidate_comms_application 
  ON public.candidate_communications(application_id);
CREATE INDEX IF NOT EXISTS candidate_comms_recruiter 
  ON public.candidate_communications(recruiter_id);
CREATE INDEX IF NOT EXISTS candidate_comms_created 
  ON public.candidate_communications(created_at DESC);

-- ============================================================================
-- STEP 4: Add comments for documentation
-- ============================================================================

COMMENT ON COLUMN public.applications.pipeline_stage IS 
  'Workflow stage tracking: application, review, shortlisted, interview, offer, hired, rejected';

COMMENT ON COLUMN public.applications.internal_notes IS 
  'Private notes added by recruiter about the candidate';

COMMENT ON COLUMN public.applications.last_activity_date IS 
  'Timestamp of last recruiter interaction with this application';

COMMENT ON TABLE public.automation_config IS 
  'Per-job automation rules for candidate screening (e.g., auto-shortlist if ATS >= threshold)';

COMMENT ON TABLE public.candidate_communications IS 
  'Timeline of all events related to a candidate application (submissions, stage changes, notes, emails, etc.)';

COMMENT ON COLUMN public.candidate_communications.event_type IS 
  'Type of event: application_submitted, ats_analyzed, stage_changed, note_added, email_sent, candidate_rejected, candidate_hired';
