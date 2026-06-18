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

  const hex = '-14.43,-8.33 0,-16.67 14.43,-8.33 14.43,8.33 0,16.67 -14.43,8.33';

  return (
    <div className={`flex items-center cursor-pointer ${className}`}>
      <div className={`relative flex items-center justify-center ${config.spacing}`}>
        <svg
          width={config.icon}
          height={config.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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