/**
 * CTA Block Component - Call-to-action section
 * Conversion-focused section with headline, description, and buttons
 * Enhanced with scroll-triggered animations
 */

'use client';

import Button from '@/components/ui/Button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { GetPageQuery } from '@/types/hygraph-generated';

type CTABlockType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'CTABlock' }>;
import type { Locale } from '@/lib/utils/locale';

interface CTABlockProps {
  section: CTABlockType;
  locale: Locale;
}

function getBackgroundClasses(backgroundColor: string): string {
  switch (backgroundColor) {
    case 'PRIMARY':
      return 'bg-gradient-brand text-white';
    case 'SECONDARY':
      return 'bg-gradient-subtle dark:bg-gray-800 text-gray-900 dark:text-white';
    case 'LIGHT':
      return 'bg-brand-light dark:bg-brand/20 text-gray-900 dark:text-white';
    case 'DARK':
      return 'bg-gray-900 dark:bg-black text-white';
    default:
      return 'bg-gradient-brand text-white';
  }
}

export default function CTABlock({ section, locale }: CTABlockProps) {
  const backgroundClasses = getBackgroundClasses(section.backgroundColor);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className={`relative py-20 md:py-28 overflow-hidden ${backgroundClasses}`}
    >
      {/* Decorative background elements for PRIMARY variant */}
      {section.backgroundColor === 'PRIMARY' && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-3xl mx-auto text-center ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display mb-6">
            {section.headline}
          </h2>

          {/* Description */}
          {section.description && (
            <p className="text-lg md:text-xl mb-10 opacity-90 font-light leading-relaxed">
              {section.description.text}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button cta={section.primaryButton} />
            {section.secondaryButton && (
              <Button cta={section.secondaryButton} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
