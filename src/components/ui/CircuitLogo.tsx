'use client';
import React, { useId } from 'react';

interface HirelyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
  showWordmark?: boolean;
}

export default function HirelyLogo({
  size = 'md',
  className = '',
  color,
  showWordmark = true,
}: HirelyLogoProps) {
  const iconSize = { xs: 20, sm: 24, md: 28, lg: 36 }[size];
  const textSize = { xs: 'text-sm', sm: 'text-base', md: 'text-lg', lg: 'text-xl' }[size];
  const hex = '-14.43,-8.33 0,-16.67 14.43,-8.33 14.43,8.33 0,16.67 -14.43,8.33';
  const gradientId = `hirely-logo-gradient-${useId().replace(/:/g, '')}`;
  const fill = color ?? `url(#${gradientId})`;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {!color && (
          <defs>
            <linearGradient
              id={gradientId}
              x1="20"
              y1="18"
              x2="80"
              y2="82"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>
        )}
        <g transform="translate(50,50)">
          <polygon points={hex} fill={fill} transform="translate(0,-28.87)" />
          <polygon points={hex} fill={fill} transform="translate(25,-14.43)" />
          <polygon points={hex} fill={fill} transform="translate(25,14.43)" />
          <polygon points={hex} fill={fill} transform="translate(0,28.87)" />
          <polygon points={hex} fill={fill} transform="translate(-25,14.43)" />
          <polygon points={hex} fill={fill} transform="translate(-25,-14.43)" />
        </g>
      </svg>

      {showWordmark && (
        <span
          className={`font-bold tracking-tight leading-none ${textSize}`}
          style={{ color: color ?? '#3730A3' }}
        >
          Hirely
        </span>
      )}
    </span>
  );
}