'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  className = '',
  style = { display: 'block' }
}: AdBannerProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
      try {
        window.adsbygoogle.push({});
      } catch (err) {
        console.error('Adsense push error:', err);
      }
    }
  }, []);

  return (
    <div className={`ad-wrapper ${className}`}>
      {/* Native-styled container that matches your site design */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Subtle "Sponsored" label - chess.com style */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Sponsored
          </span>
        </div>

        {/* Ad container with your site's styling */}
        <div className="flex justify-center items-center min-h-[250px]">
          <ins
            className="adsbygoogle"
            style={style}
            data-ad-client="ca-pub-1955463530202020"
            data-ad-slot={dataAdSlot}
            data-ad-format={dataAdFormat}
            data-full-width-responsive={dataFullWidthResponsive.toString()}
          ></ins>
        </div>

        {/* Optional: Add a subtle bottom border or decoration */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400">
            Support our platform by checking out our partners
          </p>
        </div>
      </div>

      <style jsx>{`
        .ad-wrapper {
          margin: 3rem auto;
          max-width: 100%;
        }

        /* Smooth fade-in animation */
        .ad-wrapper > div {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .ad-wrapper {
            margin: 2rem auto;
          }
        }

        /* Make ad blend with content on hover */
        .ad-wrapper:hover > div {
          border-color: #d1d5db;
        }
      `}</style>
    </div>
  );
}