export const AD_SLOTS = {
  // Homepage ads
  HOMEPAGE_TOP: '4898994140',       
  HOMEPAGE_MIDDLE: 'YOUR_SLOT_ID_HERE', 
  HOMEPAGE_BOTTOM: 'YOUR_SLOT_ID_HERE',
  
  // Blog ads
  BLOG_TOP: 'YOUR_SLOT_ID_HERE',           
  BLOG_IN_CONTENT: 'YOUR_SLOT_ID_HERE', 
  BLOG_SIDEBAR: '9198296805',

  BLOG_BOTTOM: 'YOUR_SLOT_ID_HERE', 
  
  // Job listing ads
  JOBS_TOP: '6351870136',           
  JOBS_SIDEBAR: 'YOUR_SLOT_ID_HERE',
  JOB_DETAIL_TOP: 'YOUR_SLOT_ID_HERE',
  
  // Roadmap ads
  ROADMAP_TOP: '3725706794',        // Slot fourni pour Roadmap Top
  ROADMAP_SIDEBAR: 'YOUR_SLOT_ID_HERE',
} as const;

export type AdSlotKey = keyof typeof AD_SLOTS;
