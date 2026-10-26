type HirelyEventName =
  | 'homepage_primary_cta_click'
  | 'company_cta_click'
  | 'company_profile_cta_click'
  | 'view_job'
  | 'match_analysis_started'
  | 'match_analysis_completed'
  | 'application_preparation_started'
  | 'application_preparation_completed';

/** Sends only non-personal event context through the existing GA4 setup. */
export function trackHirelyEvent(
  eventName: HirelyEventName,
  params: Record<string, string | number | boolean> = {},
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
