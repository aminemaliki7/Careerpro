'use client';
import React from 'react';

interface HirelyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?: string; // Customizable for brand alignment (e.g., LinkedIn blue, Indeed orange)
}

export default function HirelyLogo({ size = 'md', className = '', color = '#0A66C2' }: HirelyLogoProps) {
  // Size configurations – tuned for balance and responsiveness
  const sizeConfig = {
    xs: { icon: 20, text: 'text-base', spacing: 'mr-1' },
    sm: { icon: 24, text: 'text-lg', spacing: 'mr-1.5' },
    md: { icon: 28, text: 'text-xl', spacing: 'mr-2' },
    lg: { icon: 36, text: 'text-2xl', spacing: 'mr-2.5' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center cursor-pointer ${className}`}>
      {/* Icon: Moroccan star */}
      <div className={`relative flex items-center justify-center ${config.spacing}`}>
        <svg
          width={config.icon}
          height={config.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main star shape */}
          <path
            d="M50 0L61.8 38.2L100 38.2L69.1 61.8L80.9 100L50 76.4L19.1 100L30.9 61.8L0 38.2L38.2 38.2L50 0Z"
            fill={color}
          />
        </svg>
      </div>
      
      {/* Text: Bold, professional typography inspired by LinkedIn */}
      <div className="flex items-baseline font-sans">
        <span className={`font-bold ${config.text} tracking-tight`} style={{ color }}>
          Hirely
        </span>
      </div>
    </div>
  );
}

// Demo component showing different sizes and variations
function LogoDemo() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Hirely Logo Variations</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-8">
            <span className="w-16 text-sm text-gray-600">Large:</span>
            <HirelyLogo size="lg" />
          </div>
          
          <div className="flex items-center gap-8">
            <span className="w-16 text-sm text-gray-600">Medium:</span>
            <HirelyLogo size="md" />
          </div>
          
          <div className="flex items-center gap-8">
            <span className="w-16 text-sm text-gray-600">Small:</span>
            <HirelyLogo size="sm" />
          </div>
          
          <div className="flex items-center gap-8">
            <span className="w-16 text-sm text-gray-600">XSmall:</span>
            <HirelyLogo size="xs" />
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 p-8 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6">Dark Background</h3>
        <HirelyLogo size="lg" color="#ffffff" />
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Custom Colors</h3>
        <div className="space-y-4">
          <HirelyLogo size="md" color="#16a34a" className="mb-2" />
          <HirelyLogo size="md" color="#dc2626" className="mb-2" />
          <HirelyLogo size="md" color="#7c3aed" className="mb-2" />
        </div>
      </div>
    </div>
  );
}

// Export the demo as default for artifact display
