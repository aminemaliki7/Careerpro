'use client';
import React from 'react';

interface HirelyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export default function HirelyLogo({
  size = 'md',
  className = '',
  color = '#0A66C2',
}: HirelyLogoProps) {
  const sizeConfig = {
    xs: { icon: 20, text: 'text-base', spacing: 'mr-1' },
    sm: { icon: 24, text: 'text-lg', spacing: 'mr-1.5' },
    md: { icon: 28, text: 'text-xl', spacing: 'mr-2' },
    lg: { icon: 36, text: 'text-2xl', spacing: 'mr-2.5' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center cursor-pointer ${className}`}>
      <div
        className={`relative flex items-center justify-center ${config.spacing}`}
      >
        <svg
          width={config.icon}
          height={config.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top node */}
          <circle cx="50" cy="19" r="9" fill={color} />

          {/* Bottom left node */}
          <circle cx="21" cy="70" r="9" fill={color} />

          {/* Bottom right node */}
          <circle cx="79" cy="70" r="9" fill={color} />

          {/* Left connection */}
          <path
            d="M43 25 C20 30 14 55 26 63"
            stroke={color}
            strokeWidth="8.5"
            strokeLinecap="round"
          />

          {/* Bottom connection */}
          <path
            d="M30 72 C42 88 58 88 70 72"
            stroke={color}
            strokeWidth="8.5"
            strokeLinecap="round"
          />

          {/* Right connection */}
          <path
            d="M74 63 C86 55 80 30 57 25"
            stroke={color}
            strokeWidth="8.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex items-baseline font-sans">
        <span
          className={`font-bold ${config.text} tracking-tight`}
          style={{ color }}
        >
         
        </span>
      </div>
    </div>
  );
}