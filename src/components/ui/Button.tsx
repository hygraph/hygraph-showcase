/**
 * Button Component - CTA button with brand theming
 * Maps ButtonVariant enum to Tailwind classes
 * Uses dynamic brand colors from CSS variables
 */

import Link from 'next/link';
import type { GetPageQuery } from '@/types/hygraph-generated';

// Extract Button type from HeroSection's primaryCTA
type ButtonType = NonNullable<
  Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'HeroSection' }>['primaryCTA']
>;

interface ButtonProps {
  cta: ButtonType;
  className?: string;
}

/**
 * Gets button style classes based on variant
 */
function getVariantClasses(variant: string): string {
  switch (variant) {
    case 'PRIMARY':
      // Solid branded button - main CTA
      return 'bg-brand text-white hover:bg-brand-hover active:bg-brand-active shadow-soft-md hover:shadow-soft-lg dark:shadow-glow hover:scale-105';

    case 'SECONDARY':
      // Soft outlined button - secondary actions
      return 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-soft hover:shadow-soft-md hover:scale-105';

    case 'GHOST':
      // Transparent with border - perfect for dark backgrounds (hero sections)
      return 'bg-transparent border-2 border-white text-white hover:bg-white/10 dark:hover:bg-white/20 hover:border-white/90 active:bg-white/20 shadow-soft hover:shadow-soft-md hover:scale-105';

    case 'OUTLINE':
      // Brand-colored outline - versatile for light backgrounds
      return 'bg-transparent border-2 border-brand text-brand hover:bg-brand/5 dark:hover:bg-brand/10 hover:border-brand-hover active:bg-brand/10 shadow-soft hover:shadow-soft-md hover:scale-105';

    case 'TEXT':
      // Text-only, no background - subtle actions, links
      return 'bg-transparent text-brand hover:text-brand-hover dark:hover:text-brand-light underline-offset-4 hover:underline';

    default:
      // Fallback to primary
      return 'bg-brand text-white hover:bg-brand-hover shadow-soft-md hover:shadow-soft-lg dark:shadow-glow hover:scale-105';
  }
}

export default function Button({ cta, className = '' }: ButtonProps) {
  const variantClasses = getVariantClasses(cta.variant);

  // TEXT variant needs minimal styling, other variants get full button treatment
  const baseClasses = cta.variant === 'TEXT'
    ? 'inline-flex items-center justify-center font-semibold transition-all duration-250 focus:outline-none focus:ring-1 focus:ring-brand focus:ring-offset-1'
    : 'inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold transition-all duration-250 transform focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2';

  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

  // Check if it's an external link or should open in new tab
  if (cta.openInNewTab) {
    return (
      <a
        href={cta.href}
        className={combinedClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cta.label}
      </a>
    );
  }

  // For internal links, use Next.js Link
  return (
    <Link href={cta.href} className={combinedClasses}>
      {cta.label}
    </Link>
  );
}
