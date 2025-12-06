// components/startups/StartupDetail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Startup } from '@/types/startup';
import { 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  Briefcase,
  Upload,
  X
} from 'lucide-react';

interface StartupDetailProps {
  startup: Startup;
  isEditable?: boolean; // Add this if you want edit mode
}

export default function StartupDetail({ startup, isEditable = false }: StartupDetailProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(startup.logoUrl || null);
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  const foundedYear = new Date(startup.foundedDate).getFullYear();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        // Here you would typically upload to your server
        // handleUploadToServer(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    // Here you would typically remove from server
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
          {/* Logo Upload Section */}
          <div className="relative group">
            <div 
              className={`w-24 h-24 flex-shrink-0 rounded-2xl flex items-center justify-center overflow-hidden border-2 transition-all duration-300 ${
                logoPreview ? 'bg-white border-gray-200' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'
              }`}
              onMouseEnter={() => setIsUploadHovered(true)}
              onMouseLeave={() => setIsUploadHovered(false)}
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt={`${startup.name} logo`}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              ) : (
                <Building2 className="w-12 h-12 text-gray-400" />
              )}

              {/* Upload Overlay - Show on hover or when no logo */}
              {isEditable && (
                <label 
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
                    isUploadHovered || !logoPreview ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    background: 'rgba(10, 102, 194, 0.9)',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-white mx-auto mb-1" />
                    <span className="text-xs text-white font-medium">
                      {logoPreview ? 'Change' : 'Upload'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Remove Button */}
            {isEditable && logoPreview && (
              <button
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                title="Remove logo"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Upload Helper Text */}
            {isEditable && !logoPreview && (
              <p className="text-xs text-gray-500 mt-2 text-center max-w-[96px]">
                PNG, JPG up to 5MB
              </p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
                  {startup.name}
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {startup.description}
                </p>
              </div>
              
              {startup.featured && (
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#0A66C2] to-blue-600 text-white text-sm px-4 py-1.5 rounded-full font-semibold shadow-lg whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                  Featured
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg font-medium text-sm border border-[#0A66C2]/20">
                <Building2 className="w-3.5 h-3.5" />
                {startup.industry}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-medium text-sm border border-green-200">
                <TrendingUp className="w-3.5 h-3.5" />
                {startup.fundingStage}
              </span>
            </div>

            <a
              href={startup.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0A66C2] hover:text-[#004182] font-medium transition-colors duration-300 group"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <div className="flex flex-col items-start group">
            <div className="flex items-center gap-2 text-gray-500 mb-2 group-hover:text-[#0A66C2] transition-colors duration-300">
              <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-[#0A66C2]/10 transition-colors duration-300">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Location</span>
            </div>
            <span className="text-gray-900 font-semibold text-base">{startup.location}</span>
          </div>

          <div className="flex flex-col items-start group">
            <div className="flex items-center gap-2 text-gray-500 mb-2 group-hover:text-[#0A66C2] transition-colors duration-300">
              <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-[#0A66C2]/10 transition-colors duration-300">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Team Size</span>
            </div>
            <span className="text-gray-900 font-semibold text-base">{startup.size}</span>
          </div>

          <div className="flex flex-col items-start group">
            <div className="flex items-center gap-2 text-gray-500 mb-2 group-hover:text-[#0A66C2] transition-colors duration-300">
              <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-[#0A66C2]/10 transition-colors duration-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Funding Stage</span>
            </div>
            <span className="text-gray-900 font-semibold text-base">{startup.fundingStage}</span>
          </div>

          <div className="flex flex-col items-start group">
            <div className="flex items-center gap-2 text-gray-500 mb-2 group-hover:text-[#0A66C2] transition-colors duration-300">
              <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-[#0A66C2]/10 transition-colors duration-300">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Founded</span>
            </div>
            <span className="text-gray-900 font-semibold text-base">{foundedYear}</span>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      {startup.jobCount && startup.jobCount > 0 && (
        <div className="bg-gradient-to-br from-[#0A66C2]/5 to-blue-50 border border-[#0A66C2]/20 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#0A66C2] rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-display font-bold mb-2 text-gray-900">
                Open Positions
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This startup has <span className="font-semibold text-[#0A66C2]">{startup.jobCount}</span> open position{startup.jobCount !== 1 ? 's' : ''}. Check the jobs section to explore opportunities and apply.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#0A66C2]/10 rounded-lg">
            <Building2 className="w-5 h-5 text-[#0A66C2]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900">
            About {startup.name}
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-base">
          {startup.description}
        </p>
      </div>
    </div>
  );
}