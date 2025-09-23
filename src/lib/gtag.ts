// lib/gtag.ts
export const GA_TRACKING_ID = 'G-22SZ09NN7Z';

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Événements spécifiques pour votre blog
export const trackBlogView = (slug: string) => {
  event('view_blog_post', 'blog', slug);
};

export const trackJobView = (jobId: string) => {
  event('view_job', 'jobs', jobId);
};

export const trackNewsletterSubscription = () => {
  event('newsletter_subscription', 'engagement');
};

export const trackRoadmapView = (roadmapId: string) => {
  event('view_roadmap', 'roadmaps', roadmapId);
};