// components/startups/StartupDetail.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Startup } from '@/types/startup';
import { 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  Briefcase
} from 'lucide-react';

interface StartupDetailProps {
  startup: Startup;
}

export default function StartupDetail({ startup }: StartupDetailProps) {
  const foundedYear = new Date(startup.foundedDate).getFullYear();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-200">
            {startup.logoUrl ? (
              <Image
                src={startup.logoUrl}
                alt={`${startup.name} logo`}
                width={96}
                height={96}
                className="object-contain"
              />
            ) : (
              <Building2 className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {startup.name}
                </h1>
                <p className="text-lg text-gray-600">
                  {startup.description}
                </p>
              </div>
              
              {startup.featured && (
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-4 py-1.5 rounded-full font-semibold">
                  Featured
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
                {startup.industry}
              </span>
              <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                {startup.fundingStage}
              </span>
            </div>

            <a
              href={startup.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Location</span>
            </div>
            <span className="text-gray-900 font-semibold">{startup.location}</span>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Team Size</span>
            </div>
            <span className="text-gray-900 font-semibold">{startup.size}</span>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Funding Stage</span>
            </div>
            <span className="text-gray-900 font-semibold">{startup.fundingStage}</span>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Founded</span>
            </div>
            <span className="text-gray-900 font-semibold">{foundedYear}</span>
          </div>
        </div>
      </div>

      {/* Jobs Section (optional if you want to show related jobs) */}
      {startup.jobCount && startup.jobCount > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Open Positions
          </h2>
          <p className="text-gray-600">This startup has {startup.jobCount} open job(s). Check the jobs section to apply.</p>
        </div>
      )}

      {/* Optional: Description / Highlights */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">About {startup.name}</h2>
        <p className="text-gray-700 leading-relaxed">{startup.description}</p>
      </div>

      {/* Optional: External links or socials */}
      {/* You can add social icons or more details here */}
    </div>
  );
}
