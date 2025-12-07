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
      className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-[#0A66C2] hover:shadow-lg transition-all h-full flex flex-col group"
    >
      {/* Logo + Name Section - Fixed Height */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-blue-50 to-[#0A66C2]/10 rounded-xl flex items-center justify-center overflow-hidden relative border border-blue-100">
          {logoUrl ? (
            <>
              <Image
                src={logoUrl}
                alt={`${startup.name} logo`}
                width={64}
                height={64}
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
                <Building2 className="w-8 h-8 text-[#0A66C2]" />
              </div>
            </>
          ) : (
            <Building2 className="w-8 h-8 text-[#0A66C2]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-[#0A66C2] transition-colors">{startup.name}</h2>
          {startup.featured && (
            <span className="inline-block bg-gradient-to-r from-[#0A66C2] to-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Description - Fixed Height */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">{startup.description}</p>

      {/* Stats Grid - Fixed Height */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-gray-700 truncate">{startup.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-gray-700 truncate">{startup.size}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <span className="text-gray-700 truncate">{foundedYear}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium truncate">
            {startup.fundingStage}
          </span>
        </div>
      </div>

      {/* Open Positions - Fixed at Bottom */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        {startup.jobCount && startup.jobCount > 0 ? (
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-[#0A66C2]/10 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center">
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
          <div className="text-center py-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-400">No open roles</span>
          </div>
        )}
      </div>
    </Link>
  );
}