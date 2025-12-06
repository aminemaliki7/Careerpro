'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Startup } from '@/types/startup';
import { Building2, MapPin, Users, TrendingUp, Calendar, Briefcase } from 'lucide-react';

interface StartupCardProps {
  startup: Startup;
}

export default function StartupCard({ startup }: StartupCardProps) {
  const foundedYear = new Date(startup.foundedDate).getFullYear();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 cursor-pointer group">
      
      {/* Logo + Name */}
      <Link href={`/startups/${startup.slug}`} className="flex items-start gap-4">
        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-200">
          {startup.logoUrl ? (
            <Image
              src={startup.logoUrl}
              alt={`${startup.name} logo`}
              width={80}
              height={80}
              className="object-contain"
            />
          ) : (
            <Building2 className="w-10 h-10 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{startup.name}</h2>
          <p className="text-gray-600 mt-1 text-sm line-clamp-3">{startup.description}</p>
          {startup.featured && (
            <span className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-gray-700 text-sm">{startup.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          <span className="text-gray-700 text-sm">{startup.size}</span>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <span className="text-gray-700 text-sm">{startup.fundingStage}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          <span className="text-gray-700 text-sm">{foundedYear}</span>
        </div>
      </div>

      {/* Open Positions */}
      {startup.jobCount && startup.jobCount > 0 && (
        <div className="mt-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold">
                  {startup.jobCount} {startup.jobCount === 1 ? 'Position' : 'Positions'}
                </h3>
                <p className="text-gray-600 text-sm">Open at {startup.name}</p>
              </div>
            </div>

            <Link
              href={`/jobs?company=${startup.slug}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Jobs
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
