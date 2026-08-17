'use client';
import React from 'react';

interface HirelyLogoProps {
  size?:      'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?:     string;
}

export default function HirelyLogo({
  size      = 'md',
  className = '',
  color     = '#4F46E5', // Updated from #0A66C2 to Indigo-600
}: HirelyLogoProps) {
  const iconSize = { xs: 20, sm: 24, md: 28, lg: 36 }[size];
  const textSize = { xs: 'text-sm', sm: 'text-base', md: 'text-lg', lg: 'text-xl' }[size];
  const hex = '-14.43,-8.33 0,-16.67 14.43,-8.33 14.43,8.33 0,16.67 -14.43,8.33';

  return (
    <div className={`flex items-center gap-2 cursor-pointer ${className}`}>
      {/* Hexagon icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(50,50)">
          <polygon points={hex} fill={color} transform="translate(0,-28.87)" />
          <polygon points={hex} fill={color} transform="translate(25,-14.43)" />
          <polygon points={hex} fill={color} transform="translate(25,14.43)" />
          <polygon points={hex} fill={color} transform="translate(0,28.87)" />
          <polygon points={hex} fill={color} transform="translate(-25,14.43)" />
          <polygon points={hex} fill={color} transform="translate(-25,-14.43)" />
        </g>
      </svg>

      {/* Wordmark */}
      <span
        className={`font-bold tracking-tight leading-none ${textSize}`}
        style={{ color }}
      >
  
      </span>
    </div>
  );
}