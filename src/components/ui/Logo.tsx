/**
 * Logo Component - Modern branded logo with SVG icon
 * Renders a premium logo that matches the site's modern aesthetic
 */

import Link from 'next/link';
import type { Locale } from '@/lib/utils/locale';

interface LogoProps {
  locale: Locale;
  siteName?: string;
  variant?: 'default' | 'compact';
}

/**
 * Modern bike icon SVG - minimalist and premium
 */
function BikeIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Front wheel */}
      <circle
        cx="36"
        cy="32"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Rear wheel */}
      <circle
        cx="12"
        cy="32"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Frame - modern geometric design */}
      <path
        d="M12 32 L20 16 L28 16 L36 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 16 L24 24 L36 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 24 L12 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Seat */}
      <line
        x1="20"
        y1="16"
        x2="18"
        y2="13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Handlebar */}
      <path
        d="M28 16 L30 12 L32 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Electric accent - small lightning bolt on frame */}
      <path
        d="M25 20 L24 22 L25 22 L24 24"
        stroke="url(#lightning-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <defs>
        <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--color-brand-primary))" />
          <stop offset="100%" stopColor="hsl(var(--color-brand-dark))" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({ locale, siteName = 'HyBike', variant = 'default' }: LogoProps) {
  return (
    <Link
      href={`/${locale}/home`}
      className="group flex items-center gap-3 hover:scale-105 transition-all-smooth"
    >
      {/* Icon with gradient on hover */}
      <div className="relative">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-brand rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        <div className="relative text-brand group-hover:text-brand-dark transition-colors">
          <BikeIcon className={variant === 'compact' ? 'h-7 w-7' : 'h-9 w-9'} />
        </div>
      </div>

      {/* Text logo with gradient */}
      <div className="flex flex-col">
        <span
          className={`font-display font-bold text-gradient-brand leading-none ${
            variant === 'compact' ? 'text-xl' : 'text-2xl'
          }`}
        >
          {siteName}
        </span>
        {variant === 'default' && (
          <span className="text-[10px] font-medium text-gray-500 tracking-wider uppercase mt-0.5">
            Electric Bikes
          </span>
        )}
      </div>
    </Link>
  );
}
