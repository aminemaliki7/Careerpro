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
      {/* Icon: Stylized 'H' as a roadmap with milestones and forward arrow */}
      <div className={`relative flex items-center justify-center ${config.spacing}`}>
        <svg
          width={config.icon}
          height={config.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left path: Career track with smooth curve */}
          <path
            d="M14 8c0 2 1 4 3 4h3v24c0 2-1 4-3 4H14"
            fill="#FFFFFF"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right path: Mirrored track with forward momentum */}
          <path
            d="M34 8c0 2-1 4-3 4h-3v24c0 2 1 4 3 4h3"
            fill="#FFFFFF"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crossbar: Bridge connecting paths */}
          <path
            d="M17 24h14"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Milestone dots: Representing blogs, trends, and applications */}
          <circle cx="20" cy="24" r="2" fill={color} />
          <circle cx="28" cy="24" r="2" fill={color} />
          {/* Arrow: Forward progress, inspired by Indeed's energy */}
          <path
            d="M34 36l4 4-4 4"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle glow: Inspired by Glassdoor's transparency */}
          <path
            d="M14 8c0 2 1 4 3 4h3v24c0 2-1 4-3 4H14 M34 8c0 2-1 4-3 4h-3v24c0 2 1 4 3 4h3"
            fill="url(#glow)"
            opacity="0.1"
          />
          <defs>
            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
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
