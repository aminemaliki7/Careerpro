'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Startup } from '@/types/startup';
import { Building2, MapPin, Users, Calendar, Briefcase } from 'lucide-react';

interface StartupCardProps {
  startup: Startup;
}

export default function StartupCard({ startup }: StartupCardProps) {
  const foundedYear = new Date(startup.foundedDate).getFullYear();
  
  const getLogoUrl = (logoUrl: string | undefined): string | null => {
    if (!logoUrl) return null;

    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
      return logoUrl;
    }

    // Existing logic for logo URL construction (Assuming environment variables are set)
    if (logoUrl.startsWith('/logos/')) {
      console.warn(`Skipping invalid logo path for ${startup.name}:`, logoUrl);
      return null;
    }

    if (logoUrl.startsWith('logos/')) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/startup-logos/${logoUrl}`;
    }

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/startup-logos/logos/${logoUrl}`;
  };

  const logoUrl = getLogoUrl(startup.logoUrl);

  return (
    <Link 
      href={`/startups/${startup.slug}`}
      // Mobile Change: Reduced padding from p-6 to p-4 for better screen fit
      className="block bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-[#0A66C2] hover:shadow-lg transition-all h-full flex flex-col group"
    >
      {/* Logo + Name Section */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* Mobile Change: Reduced logo size from w-16 h-16 to w-14 h-14 */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-gradient-to-br from-blue-50 to-[#0A66C2]/10 rounded-xl flex items-center justify-center overflow-hidden relative border border-blue-100">
          {logoUrl ? (
            <>
              <Image
                src={logoUrl}
                alt={`${startup.name} logo`}
                // Mobile Change: Adjusted width/height for new container size
                width={56} 
                height={56}
                className="object-contain"
                unoptimized
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.style.display = 'none';
                  const parent = imgElement.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.fallback-icon') as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }
                }}
              />
              <div className="fallback-icon w-full h-full items-center justify-center hidden">
                {/* Mobile Change: Smaller icon inside fallback */}
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A66C2]" />
              </div>
            </>
          ) : (
             <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A66C2]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {/* Mobile Change: Slightly smaller font for title on mobile */}
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-[#0A66C2] transition-colors">{startup.name}</h2>
          {startup.featured && (
            <span className="inline-block bg-gradient-to-r from-[#0A66C2] to-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {/* Mobile Change: Use text-xs for description to save vertical space, maintained line-clamp-2 */}
      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 h-8 sm:h-10 leading-relaxed">{startup.description}</p>

      {/* Stats Grid */}
      {/* Mobile Change: Reduced vertical gap in stats grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-3 mb-3 sm:mb-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          {/* Mobile Change: Smaller icon container (w-6 h-6) */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            {/* Mobile Change: Smaller icon (w-3 h-3) */}
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
          </div>
          <span className="text-gray-700 truncate">{startup.location}</span>
        </div>
        <div className="flex items-center gap-2">
           {/* Mobile Change: Smaller icon container (w-6 h-6) */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            {/* Mobile Change: Smaller icon (w-3 h-3) */}
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
          </div>
          <span className="text-gray-700 truncate">{startup.size}</span>
        </div>
        <div className="flex items-center gap-2">
           {/* Mobile Change: Smaller icon container (w-6 h-6) */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
            {/* Mobile Change: Smaller icon (w-3 h-3) */}
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
          </div>
          <span className="text-gray-700 truncate">{foundedYear}</span>
        </div>
        <div className="flex items-center gap-2">
           {/* Mobile Change: Tighter padding and text size for badge */}
          <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full font-medium truncate">
            {startup.fundingStage}
          </span>
        </div>
      </div>

      {/* Open Positions - Fixed at Bottom */}
      <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
        {startup.jobCount && startup.jobCount > 0 ? (
          // Mobile Change: Reduced padding from p-3 to p-2 for tightness
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-[#0A66C2]/10 rounded-lg p-2 sm:p-3 border border-blue-100">
            <div className="flex items-center gap-2">
              {/* Mobile Change: Smaller icon container (w-7 h-7) */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center">
                {/* Mobile Change: Smaller icon (w-4 h-4) */}
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {startup.jobCount} {startup.jobCount === 1 ? 'open role' : 'open roles'}
              </span>
            </div>
            <span className="text-sm font-medium text-[#0A66C2] group-hover:text-blue-700">
              View →
            </span>
          </div>
        ) : (
          <div className="text-center py-2 sm:py-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-400">No open roles</span>
          </div>
        )}
      </div>
    </Link>
  );
}