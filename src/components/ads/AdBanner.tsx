'use client';

import { useEffect, useState, useRef } from 'react';

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
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [showAd, setShowAd] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const adRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in development
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
      
      try {
        window.adsbygoogle.push({});
        
        // Check ad status multiple times for better detection
        const checkAdLoad = () => {
          if (!adRef.current) return;
          
          const insElement = adRef.current.querySelector('ins.adsbygoogle');
          
          if (!insElement) {
            setShowAd(false);
            setIsChecking(false);
            return;
          }

          const adStatus = insElement.getAttribute('data-ad-status');
          const hasHeight = insElement.clientHeight > 0;
          const hasContent = insElement.innerHTML.trim() !== '';
          
          // Ad successfully loaded
          if (adStatus === 'filled' || (hasHeight && hasContent)) {
            setIsAdLoaded(true);
            setShowAd(true);
            setIsChecking(false);
            return true;
          }
          
          // Ad explicitly failed
          if (adStatus === 'unfilled') {
            setShowAd(false);
            setIsChecking(false);
            return true;
          }
          
          return false;
        };

        // Initial check after 1 second
        const timer1 = setTimeout(() => {
          if (!checkAdLoad()) {
            // Second check after 2.5 seconds if first check was inconclusive
            const timer2 = setTimeout(() => {
              if (!checkAdLoad()) {
                // Final check after 4 seconds - if still no ad, hide it
                const timer3 = setTimeout(() => {
                  checkAdLoad();
                  // If still loading after 4 seconds, assume no ad
                  setShowAd(false);
                  setIsChecking(false);
                }, 4000);
                
                return () => clearTimeout(timer3);
              }
            }, 2500);
            
            return () => clearTimeout(timer2);
          }
        }, 1000);

        return () => clearTimeout(timer1);
      } catch (err) {
        console.error('AdSense error:', err);
        setShowAd(false);
        setIsChecking(false);
      }
    }
  }, []);

  // Don't render anything if ad shouldn't be shown
  if (!showAd) {
    return null;
  }

  return (
    <div ref={adRef} className={`ad-wrapper ${className}`}>
      {/* Native-styled container that matches your site design */}
      <div className={`bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 ${isChecking && !isAdLoaded ? 'opacity-0' : 'opacity-100'}`}>
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
        {isAdLoaded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              Support our platform by checking out our partners
            </p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .ad-wrapper {
          margin: 3rem auto;
          max-width: 100%;
          transition: opacity 0.3s ease, max-height 0.3s ease;
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

        /* Hide container smoothly when no ad */
        .ad-wrapper:has(ins.adsbygoogle[data-ad-status="unfilled"]) {
          max-height: 0;
          opacity: 0;
          margin: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}