// components/startups/StartupLogo.tsx
'use client';

import { useState } from 'react';

interface StartupLogoProps {
  logoUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StartupLogo({ logoUrl, name, size = 'md' }: StartupLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl'
  };

  // If no logo URL or image failed to load, show fallback
  if (!logoUrl || imageError) {
    return (
      <div className={`flex-shrink-0 ${sizeClasses[size]} bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center`}>
        <div className="w-full h-full flex items-center justify-center bg-[#0A66C2]/10 rounded-lg">
          <span className={`text-[#0A66C2] font-bold ${textSizeClasses[size]}`}>
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-shrink-0 ${sizeClasses[size]} bg-white rounded-xl border border-gray-200 p-3 shadow-sm`}>
      <img 
        src={logoUrl} 
        alt={`${name} logo`}
        className="w-full h-full object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );
}