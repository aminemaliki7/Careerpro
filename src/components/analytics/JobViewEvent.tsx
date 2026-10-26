'use client';

import { useEffect } from 'react';
import { trackHirelyEvent } from '@/lib/analytics/track-event';

export default function JobViewEvent({ jobId }: { jobId: string }) {
  useEffect(() => {
    trackHirelyEvent('view_job', { job_id: jobId });
  }, [jobId]);

  return null;
}
