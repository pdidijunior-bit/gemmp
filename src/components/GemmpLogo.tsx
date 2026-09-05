import React from 'react';

interface GemmpLogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon-only';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GemmpLogo: React.FC<GemmpLogoProps> = ({
  variant = 'horizontal',
  theme = 'auto',
  className = '',
  size = 'md',
}) => {
  const isDark = theme === 'dark' || theme === 'auto';

  // Dimension tokens
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-13 h-13 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  };

  const whiteColor = isDark ? '#FFFFFF' : '#0F172A';
  const amberColor = '#F59E0B';

  // Isometric Folded Hexagon "G" Emblem from official Gemmp image
  const LogoIcon = () => (
    <div
      className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-200 group-hover:scale-105 flex items-center justify-center`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Folded Ribbon (White in image, or deep navy on light surfaces) */}
        <path
          d="M 86 30 L 50 9 L 14 30 L 14 53 L 29 45 L 29 37 L 50 25 L 71 37 L 86 30 Z"
          fill={whiteColor}
        />

        {/* Bottom Folded Ribbon & "G" Tongue (Golden Amber in image) */}
        <path
          d="M 14 65 L 50 86 L 86 65 L 86 42 L 71 50 L 71 59 L 50 71 L 29 59 L 29 51 L 14 59 L 14 65 Z"
          fill={amberColor}
        />

        {/* Inner Horizontal "G" Spur / Central Core */}
        <path
          d="M 36 49 L 64 36 L 64 45 L 47 54 L 36 49 Z"
          fill={amberColor}
        />
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return <LogoIcon />;
  }

  const textColor = isDark ? 'text-white' : 'text-slate-950';
  const dividerColor = isDark ? 'bg-white/70' : 'bg-slate-400';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 1. Geometric Hexagon G Emblem */}
      <LogoIcon />

      {/* 2. Vertical Divider Line from Image */}
      <div className={`w-[2px] h-8 sm:h-9 ${dividerColor} shrink-0`} />

      {/* 3. Typography & Architectural Dotted Baseline from Image */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-black tracking-wider uppercase font-heading leading-none ${textSizes[size]} ${textColor}`}
          style={{ fontFamily: "'Outfit', 'Poppins', sans-serif", letterSpacing: '0.08em' }}
        >
          GEMMP
        </span>

        {/* Golden amber architectural square dot sequence from image */}
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-[1px]" />
        </div>
      </div>
    </div>
  );
};
