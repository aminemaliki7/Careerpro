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
      className="block bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-[#0A66C2] hover:shadow-lg transition-all h-full flex flex-col group"
    >
      {/* Logo + Name Section - Stacked on mobile for 2-column grid */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-4 mb-2 sm:mb-4">
        {/* Logo - Centered on mobile */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-gradient-to-br from-blue-50 to-[#0A66C2]/10 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden relative border border-blue-100">
          {logoUrl ? (
            <>
              <Image
                src={logoUrl}
                alt={`${startup.name} logo`}
                width={48} 
                height={48}
                className="object-contain w-full h-full"
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
                <Building2 className="w-5 h-5 sm:w-8 sm:h-8 text-[#0A66C2]" />
              </div>
            </>
          ) : (
             <Building2 className="w-5 h-5 sm:w-8 sm:h-8 text-[#0A66C2]" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 w-full text-center sm:text-left">
          {/* Title - Centered on mobile, line-clamp-1 for compact height */}
          <h2 className="text-xs sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-[#0A66C2] transition-colors leading-tight">
            {startup.name}
          </h2>
          {startup.featured && (
            <span className="inline-block bg-gradient-to-r from-[#0A66C2] to-blue-600 text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Description - line-clamp-2 on mobile for compact height */}
      <p className="text-[10px] sm:text-sm text-gray-600 mb-2 sm:mb-4 line-clamp-2 leading-snug sm:leading-relaxed text-center sm:text-left">
        {startup.description}
      </p>

      {/* Stats - Single column on mobile for better readability in 2-col grid */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 sm:gap-x-4 sm:gap-y-3 mb-2 sm:mb-4 text-xs">
        <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 py-0.5 sm:py-0 min-h-[20px]">
          <div className="w-4 h-4 sm:w-7 sm:h-7 bg-blue-50 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-2 h-2 sm:w-4 sm:h-4 text-blue-600" />
          </div>
          <span className="text-gray-700 truncate text-[10px] sm:text-sm leading-none">{startup.location}</span>
        </div>
        
        <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 py-0.5 sm:py-0 min-h-[20px]">
          <div className="w-4 h-4 sm:w-7 sm:h-7 bg-green-50 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-2 h-2 sm:w-4 sm:h-4 text-green-600" />
          </div>
          <span className="text-gray-700 truncate text-[10px] sm:text-sm leading-none">{startup.size}</span>
        </div>
        
        <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 py-0.5 sm:py-0 min-h-[20px]">
          <div className="w-4 h-4 sm:w-7 sm:h-7 bg-orange-50 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-2 h-2 sm:w-4 sm:h-4 text-orange-600" />
          </div>
          <span className="text-gray-700 truncate text-[10px] sm:text-sm leading-none">{foundedYear}</span>
        </div>
        
        <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 py-0.5 sm:py-0 min-h-[20px]">
          <span className="inline-block px-1.5 sm:px-2 py-0.5 bg-purple-50 text-purple-700 text-[9px] sm:text-xs rounded-full font-medium truncate max-w-full leading-none">
            {startup.fundingStage}
          </span>
        </div>
      </div>

      {/* Open Positions - Fixed at Bottom */}
      <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-100">
        {startup.jobCount && startup.jobCount > 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-[#0A66C2]/10 rounded-md sm:rounded-lg p-1.5 sm:p-3 border border-blue-100 gap-0.5 sm:gap-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-5 h-5 sm:w-8 sm:h-8 bg-[#0A66C2] rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-[10px] sm:text-sm font-semibold text-gray-900">
                {startup.jobCount} {startup.jobCount === 1 ? 'role' : 'roles'}
              </span>
            </div>
            <span className="text-[10px] sm:text-sm font-medium text-[#0A66C2] group-hover:text-blue-700">
              View →
            </span>
          </div>
        ) : (
          <div className="text-center py-1.5 sm:py-3 bg-gray-50 rounded-md sm:rounded-lg">
            <span className="text-[10px] sm:text-sm text-gray-400">No roles</span>
          </div>
        )}
      </div>
    </Link>
  );
}