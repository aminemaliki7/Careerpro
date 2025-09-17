// src/components/ui/CircuitLogo.tsx
'use client';

import React, { useState } from 'react';

interface CircuitLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CircuitLogo({ size = 'md', className = '' }: CircuitLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeConfig = {
    xs: { svg: 32, text: 'text-lg', spacing: 'mr-2' },
    sm: { svg: 36, text: 'text-xl', spacing: 'mr-2' },
    md: { svg: 42, text: 'text-2xl', spacing: 'mr-3' },
    lg: { svg: 48, text: 'text-3xl', spacing: 'mr-3' },
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={`flex items-center cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Circuit Board HM Symbol */}
      <div className={`relative ${config.spacing}`}>
        <svg 
          width={config.svg} 
          height={config.svg} 
          viewBox="0 0 42 42" 
          className="drop-shadow-lg"
        >
          <defs>
            {/* Main gradient for HM letters */}
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            
            {/* Glow effect */}
            <filter id="circuitGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Animated pulse for circuit traces */}
            <filter id="pulse">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Dark circuit board background */}
          <rect 
            width="42" 
            height="42" 
            fill="#0F172A" 
            rx="6" 
            opacity="0.9"
            className="transition-all duration-300"
          />
          
          {/* Circuit traces - animated on hover */}
          <g className="transition-all duration-500">
            {/* Top trace */}
            <path 
              d="M6 10 L12 10 L12 16 L18 16 M24 16 L30 16 L30 10 L36 10" 
              stroke="#10B981" 
              strokeWidth={isHovered ? "2" : "1"} 
              opacity={isHovered ? "1" : "0.6"} 
              fill="none"
              filter={isHovered ? "url(#pulse)" : "none"}
              className="transition-all duration-500"
            />
            
            {/* Bottom trace */}
            <path 
              d="M6 32 L12 32 L12 26 L18 26 M24 26 L30 26 L30 32 L36 32" 
              stroke="#8B5CF6" 
              strokeWidth={isHovered ? "2" : "1"} 
              opacity={isHovered ? "1" : "0.6"} 
              fill="none"
              filter={isHovered ? "url(#pulse)" : "none"}
              className="transition-all duration-500 delay-100"
            />
            
            {/* Side traces for extra detail */}
            <path 
              d="M4 21 L8 21" 
              stroke="#3B82F6" 
              strokeWidth="1" 
              opacity={isHovered ? "0.8" : "0.4"}
              className="transition-all duration-300 delay-200"
            />
            <path 
              d="M34 21 L38 21" 
              stroke="#3B82F6" 
              strokeWidth="1" 
              opacity={isHovered ? "0.8" : "0.4"}
              className="transition-all duration-300 delay-300"
            />
          </g>
          
          {/* HM Letters - main focus */}
          <g filter="url(#circuitGlow)">
            {/* H - left vertical */}
            <rect 
              x="10" 
              y="12" 
              width="3" 
              height="18" 
              fill="url(#circuitGradient)" 
              rx="1.5"
              className="transition-all duration-300"
            />
            
            {/* H - horizontal bar */}
            <rect 
              x="15" 
              y="19" 
              width="12" 
              height="3" 
              fill="url(#circuitGradient)" 
              rx="1.5"
              className="transition-all duration-300"
            />
            
            {/* H - right vertical (M part) */}
            <rect 
              x="29" 
              y="12" 
              width="3" 
              height="18" 
              fill="url(#circuitGradient)" 
              rx="1.5"
              className="transition-all duration-300"
            />
          </g>
          
          {/* Connection points - animated */}
          <g className="transition-all duration-300">
            <circle 
              cx="11.5" 
              cy="15" 
              r={isHovered ? "2" : "1.5"} 
              fill="#10B981"
              className="transition-all duration-300"
            />
            <circle 
              cx="30.5" 
              cy="27" 
              r={isHovered ? "2" : "1.5"} 
              fill="#8B5CF6"
              className="transition-all duration-300 delay-100"
            />
            <circle 
              cx="21" 
              cy="20.5" 
              r={isHovered ? "1.5" : "1"} 
              fill="#3B82F6"
              opacity={isHovered ? "1" : "0.7"}
              className="transition-all duration-300 delay-200"
            />
          </g>
          
          {/* Data flow indicators - subtle animation */}
          {isHovered && (
            <g opacity="0.6">
              <circle cx="8" cy="10" r="0.5" fill="#10B981">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="34" cy="32" r="0.5" fill="#8B5CF6">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </circle>
            </g>
          )}
        </svg>
      </div>
      
      {/* Text Logo */}
      <div className="flex items-baseline">
        <span className={`font-black ${config.text} bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500 bg-clip-text text-transparent tracking-tight transition-all duration-300 ${isHovered ? 'tracking-wide' : ''}`}>
        </span>
        <span className={`text-lg font-light text-gray-300 ml-1 transition-all duration-300 ${isHovered ? 'text-emerald-300' : ''}`}>
          
        </span>
      </div>
    </div>
  );
}