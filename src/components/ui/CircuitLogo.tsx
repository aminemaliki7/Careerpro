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


// Export the demo as default for artifact display
