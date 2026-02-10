/**
 * StatsBar Component - Trust indicators and social proof
 * Displays statistics like "10,000+ Happy Riders" in various layouts
 * Enhanced with scroll-triggered animations
 */

'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { GetPageQuery } from '@/types/hygraph-generated';
import type { Locale } from '@/lib/utils/locale';

type StatsBarType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'StatsBar' }>;

interface StatsBarProps {
  section: StatsBarType;
  locale: Locale;
}

function getLayoutClasses(layout: string): string {
  switch (layout) {
    case 'HORIZONTAL':
      return 'flex flex-wrap justify-center items-center gap-8 md:gap-12';
    case 'GRID':
      return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8';
    case 'MINIMAL':
      return 'flex flex-wrap justify-center items-center gap-6 md:gap-8';
    default:
      return 'flex flex-wrap justify-center items-center gap-8 md:gap-12';
  }
}

function getBackgroundClasses(backgroundColor: string): string {
  switch (backgroundColor) {
    case 'PRIMARY':
      return 'bg-gradient-brand text-white';
    case 'SECONDARY':
      return 'bg-gradient-subtle dark:bg-gray-800 text-gray-900 dark:text-white';
    case 'LIGHT':
      return 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white';
    case 'DARK':
      return 'bg-gray-900 dark:bg-black text-white';
    default:
      return 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white';
  }
}

function getStatSizeClasses(layout: string): { valueClass: string; labelClass: string } {
  switch (layout) {
    case 'HORIZONTAL':
      return {
        valueClass: 'text-4xl md:text-5xl font-bold',
        labelClass: 'text-sm md:text-base font-medium'
      };
    case 'GRID':
      return {
        valueClass: 'text-3xl md:text-4xl font-bold',
        labelClass: 'text-sm font-medium'
      };
    case 'MINIMAL':
      return {
        valueClass: 'text-2xl md:text-3xl font-bold',
        labelClass: 'text-xs md:text-sm font-medium'
      };
    default:
      return {
        valueClass: 'text-4xl md:text-5xl font-bold',
        labelClass: 'text-sm md:text-base font-medium'
      };
  }
}

export default function StatsBar({ section, locale }: StatsBarProps) {
  const backgroundClasses = getBackgroundClasses(section.backgroundColor);
  const layoutClasses = getLayoutClasses(section.statsLayout);
  const { valueClass, labelClass } = getStatSizeClasses(section.statsLayout);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className={`py-16 md:py-20 ${backgroundClasses} ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {section.title && (
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            {section.title}
          </h2>
        )}

        <div className={layoutClasses}>
          {section.stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center ${
                section.statsLayout === 'MINIMAL' ? 'flex items-center gap-2' : ''
              }`}
            >
              {stat.icon && section.statsLayout !== 'MINIMAL' && (
                <div className="mb-3 flex justify-center">
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 bg-brand/10 dark:bg-brand/20 rounded-full" />
                    <Image
                      src={stat.icon.url}
                      alt=""
                      width={48}
                      height={48}
                      className="relative h-12 w-12 object-contain"
                    />
                  </div>
                </div>
              )}

              <div className={section.statsLayout === 'MINIMAL' ? 'flex items-baseline gap-2' : ''}>
                <div
                  className={`${valueClass} ${
                    section.backgroundColor === 'PRIMARY' ||
                    section.backgroundColor === 'DARK'
                      ? 'text-white'
                      : 'text-brand dark:text-brand-light'
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`${labelClass} ${
                    section.backgroundColor === 'PRIMARY' ||
                    section.backgroundColor === 'DARK'
                      ? 'text-white/90'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
