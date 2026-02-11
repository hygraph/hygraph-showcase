/**
 * Product Showcase Component - Displays products from Content Federation
 * Shows live product data from BigCommerce/PIM
 * Supports audience filtering and different display styles
 * Enhanced with interactive carousel mode
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import type { GetPageQuery } from '@/types/hygraph-generated';

type ProductShowcaseType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'ProductShowcase' }>;
import type { GetProductsQuery } from '@/types/hygraph-generated';

type Product = GetProductsQuery['products'][0];
// Type guard for products with federated data
type ProductWithFederation = Product & {
  externalProduct: NonNullable<Product['externalProduct']>;
};

function hasFederatedData(product: Product): product is ProductWithFederation {
  return product.externalProduct !== undefined && product.externalProduct !== null;
}
import type { Locale } from '@/lib/utils/locale';

interface ProductShowcaseProps {
  section: ProductShowcaseType;
  locale: Locale;
  products: Product[];
}

function getDisplayStyleClasses(layout: string, itemsPerRow: number): string {
  switch (layout) {
    case 'GRID':
      if (itemsPerRow === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      if (itemsPerRow === 4) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    case 'CAROUSEL':
      return 'flex gap-6 overflow-x-hidden';
    case 'LIST':
      return 'flex flex-col gap-4';
    default:
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  }
}

export default function ProductShowcase({ section, locale, products }: ProductShowcaseProps) {
  const displayClasses = getDisplayStyleClasses(section.layout, section.itemsPerRow ?? 3);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter products if showPrices/showStock enabled, only show products with federation data
  const displayProducts = products.filter(product => {
    if (section.showPrices || section.showStock) {
      return hasFederatedData(product);
    }
    return true;
  });

  const isCarousel = section.layout === 'CAROUSEL';
  const itemsPerView = section.itemsPerRow ?? 3;

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
    const cardWidth = container.scrollWidth / displayProducts.length;
    const scrollPosition = cardWidth * index;
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    setCurrentIndex(index);
  };

  // Navigation handlers
  const goToPrevious = () => {
    const newIndex = Math.max(0, currentIndex - itemsPerView);
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = Math.min(displayProducts.length - itemsPerView, currentIndex + itemsPerView);
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
  }, [isCarousel, currentIndex, displayProducts.length]);

  // Update scroll buttons on scroll
  useEffect(() => {
    if (!isCarousel || !carouselRef.current) return;

    const container = carouselRef.current;
    container.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();

    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, [isCarousel]);

  if (displayProducts.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No products available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Heading */}
        {section.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            {section.title}
          </h2>
        )}

        {/* Carousel wrapper with controls */}
        {isCarousel ? (
          <div className="relative">
            {/* Left gradient fade - subtle */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white/80 dark:from-gray-950/80 via-white/20 dark:via-gray-950/20 to-transparent z-10 pointer-events-none" />

            {/* Right gradient fade - subtle */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/80 dark:from-gray-950/80 via-white/20 dark:via-gray-950/20 to-transparent z-10 pointer-events-none" />

            {/* Previous button */}
            {canScrollLeft && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-gray-800 shadow-soft-lg hover:shadow-soft-xl hover:scale-110 transition-all-smooth text-gray-900 dark:text-white"
                aria-label="Previous products"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-gray-800 shadow-soft-lg hover:shadow-soft-xl hover:scale-110 transition-all-smooth text-gray-900 dark:text-white"
                aria-label="Next products"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Carousel container */}
            <div
              ref={carouselRef}
              className={`${displayClasses} scroll-smooth`}
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {displayProducts.map((product) => {
                const federatedData = hasFederatedData(product) ? product.externalProduct.data : null;
                const price = federatedData?.calculated_price;
                const inStock = federatedData ? federatedData.inventory_level > 0 : true;

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-soft-md dark:shadow-none dark:ring-1 dark:ring-white/10 overflow-hidden hover:shadow-soft-xl dark:hover:ring-white/20 hover:-translate-y-2 transition-all-smooth flex-shrink-0"
                    style={{
                      scrollSnapAlign: 'start',
                      width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                      {/* Stock badge for in-stock items */}
                      {inStock && section.showStock && (
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-soft px-3 py-1.5 rounded-full">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">In Stock</span>
                          </div>
                        </div>
                      )}
                      {!inStock && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-brand transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-end justify-between">
                        <div>
                          {section.showPrices && price && (
                            <p className="text-3xl font-bold text-brand mb-1">
                              ${price.toLocaleString()}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {federatedData?.sku || product.baseProductId}
                          </p>
                          {section.showStock && federatedData && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className={`h-2 w-2 rounded-full ${federatedData.inventory_level > 10 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {federatedData.inventory_level} available
                              </p>
                            </div>
                          )}
                        </div>

                        {inStock && (
                          <Link
                            href={`/${locale}/product/${product.id}`}
                            className="px-5 py-2.5 bg-brand text-white rounded-lg hover:bg-brand-hover hover:scale-105 shadow-soft hover:shadow-soft-md transition-all-smooth text-sm font-semibold"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress dots */}
            {displayProducts.length > itemsPerView && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(displayProducts.length / itemsPerView) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index * itemsPerView)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / itemsPerView) === index
                        ? 'w-8 bg-brand shadow-glow'
                        : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grid/List layout */
          <div className={displayClasses}>
            {displayProducts.map((product, index) => {
              const federatedData = hasFederatedData(product) ? product.externalProduct.data : null;
              const price = federatedData?.calculated_price;
              const inStock = federatedData ? federatedData.inventory_level > 0 : true;

              // eslint-disable-next-line react-hooks/rules-of-hooks
              const { ref, isVisible } = useStaggerAnimation(index, { threshold: 0.1 });

              return (
                <div
                  key={product.id}
                  ref={ref}
                  className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-soft-md dark:shadow-none dark:ring-1 dark:ring-white/10 overflow-hidden hover:shadow-soft-xl dark:hover:ring-white/20 hover:-translate-y-2 transition-all-smooth ${
                    isVisible ? 'animate-scale-in-subtle' : 'opacity-0'
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    {inStock && section.showStock && (
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-soft px-3 py-1.5 rounded-full">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">In Stock</span>
                        </div>
                      </div>
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-brand transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-end justify-between">
                      <div>
                        {section.showPrices && price && (
                          <p className="text-3xl font-bold text-brand mb-1">
                            ${price.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {federatedData?.sku || product.baseProductId}
                        </p>
                        {section.showStock && federatedData && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className={`h-2 w-2 rounded-full ${federatedData.inventory_level > 10 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {federatedData.inventory_level} available
                            </p>
                          </div>
                        )}
                      </div>

                      {inStock && (
                        <Link
                          href={`/${locale}/product/${product.id}`}
                          className="px-5 py-2.5 bg-brand text-white rounded-lg hover:bg-brand-hover hover:scale-105 shadow-soft hover:shadow-soft-md transition-all-smooth text-sm font-semibold"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Content Federation Attribution */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Live product data via Content Federation (BigCommerce)
            {section.filterByAudience && ` • Filtered by audience`}
          </p>
        </div>
      </div>
    </section>
  );
}
