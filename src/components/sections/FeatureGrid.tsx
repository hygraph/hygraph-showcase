/**
 * Feature Grid Component - Displays features in responsive grid or carousel
 * Supports 2, 3, 4 column grid layouts and carousel mode
 * Enhanced with scroll-triggered stagger animations
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import type { GetPageQuery } from '@/types/hygraph-generated';

type FeatureGridType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'FeatureGrid' }>;

interface FeatureGridProps {
  section: FeatureGridType;
}

function getGridClasses(layout: string): string {
  switch (layout) {
    case 'GRID_2COL':
      return 'grid grid-cols-1 md:grid-cols-2';
    case 'GRID_3COL':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 'GRID_4COL':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    case 'CAROUSEL':
      return 'flex gap-6 overflow-x-hidden';
    case 'FEATURED':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    default:
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }
}

export default function FeatureGrid({ section }: FeatureGridProps) {
  const gridClasses = getGridClasses(section.layout);
  const isCarousel = section.layout === 'CAROUSEL';
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll button states
  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.scrollWidth / section.features.length;
    const scrollPosition = cardWidth * index;
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    setCurrentIndex(index);
  };

  // Navigation handlers
  const goToPrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = Math.min(section.features.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isCarousel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCarousel, currentIndex, section.features.length]);

  // Update scroll buttons on scroll
  useEffect(() => {
    if (!isCarousel || !carouselRef.current) return;

    const container = carouselRef.current;
    container.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();

    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, [isCarousel]);

  return (
    <section className="py-20 md:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Heading */}
        {section.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            {section.title}
          </h2>
        )}

        {/* Carousel Mode */}
        {isCarousel ? (
          <div className="relative">
            {/* Left gradient fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50/80 dark:from-gray-900/80 via-gray-50/20 dark:via-gray-900/20 to-transparent z-10 pointer-events-none" />

            {/* Right gradient fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50/80 dark:from-gray-900/80 via-gray-50/20 dark:via-gray-900/20 to-transparent z-10 pointer-events-none" />

            {/* Previous button */}
            {canScrollLeft && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-gray-700 shadow-soft-lg hover:shadow-soft-xl hover:scale-110 transition-all-smooth text-gray-900 dark:text-white"
                aria-label="Previous features"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next button */}
            {canScrollRight && (
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-gray-700 shadow-soft-lg hover:shadow-soft-xl hover:scale-110 transition-all-smooth text-gray-900 dark:text-white"
                aria-label="Next features"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Carousel container */}
            <div
              ref={carouselRef}
              className={`${gridClasses} scroll-smooth`}
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {section.features.map((feature) => (
                <div
                  key={feature.id}
                  className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-soft-md hover:shadow-soft-xl dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:ring-white/20 hover:-translate-y-1 transition-all-smooth flex-shrink-0"
                  style={{
                    scrollSnapAlign: 'start',
                    width: 'calc((100% - 48px) / 3)',
                    minWidth: '300px'
                  }}
                >
                  {/* Icon */}
                  {feature.icon && (
                    <div className="mb-6 relative">
                      {/* Animated background circle with enhanced dark mode */}
                      <div className="absolute inset-0 rounded-full transition-all duration-300 bg-gradient-to-br from-brand/15 via-brand/10 to-brand/5 dark:from-brand/25 dark:via-brand/20 dark:to-brand/15 group-hover:from-brand/25 group-hover:via-brand/20 group-hover:to-brand/15 dark:group-hover:from-brand/40 dark:group-hover:via-brand/30 dark:group-hover:to-brand/25 group-hover:shadow-glow dark:ring-1 dark:ring-brand/30 dark:group-hover:ring-brand/50" />
                      {/* Icon container */}
                      <div className="relative p-4">
                        <Image
                          src={feature.icon.url}
                          alt={feature.title}
                          width={64}
                          height={64}
                          className="h-16 w-16 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                        />
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-brand transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress dots */}
            {section.features.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {section.features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? 'w-8 bg-brand shadow-glow'
                        : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to feature ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grid Mode */
          <div className={`${gridClasses} gap-8`}>
            {section.features.map((feature, index) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const { ref, isVisible } = useStaggerAnimation(index, { threshold: 0.2 });

              return (
                <div
                  key={feature.id}
                  ref={ref}
                  className={`group flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-soft-md hover:shadow-soft-xl dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:ring-white/20 hover:-translate-y-1 transition-all-smooth ${
                    isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                >
                  {/* Icon */}
                  {feature.icon && (
                    <div className="mb-6 relative">
                      {/* Animated background circle with enhanced dark mode */}
                      <div className="absolute inset-0 rounded-full transition-all duration-300 bg-gradient-to-br from-brand/15 via-brand/10 to-brand/5 dark:from-brand/25 dark:via-brand/20 dark:to-brand/15 group-hover:from-brand/25 group-hover:via-brand/20 group-hover:to-brand/15 dark:group-hover:from-brand/40 dark:group-hover:via-brand/30 dark:group-hover:to-brand/25 group-hover:shadow-glow dark:ring-1 dark:ring-brand/30 dark:group-hover:ring-brand/50" />
                      {/* Icon container */}
                      <div className="relative p-4">
                        <Image
                          src={feature.icon.url}
                          alt={feature.title}
                          width={64}
                          height={64}
                          className="h-16 w-16 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                        />
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-brand transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
