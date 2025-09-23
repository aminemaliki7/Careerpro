// types/gtag.d.ts
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
  }
}

export {};

// Types pour les événements GA
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}