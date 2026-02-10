/**
 * Testimonial Carousel Component - Customer reviews carousel
 * Auto-rotating carousel with customer testimonials
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { GetPageQuery } from '@/types/hygraph-generated';

type TestimonialCarouselType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'TestimonialCarousel' }>;

interface TestimonialCarouselProps {
  section: TestimonialCarouselType;
}

/**
 * Star rating display
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCarousel({ section }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = section.testimonials;
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  // Auto-rotate carousel
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Heading */}
        {section.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            {section.title}
          </h2>
        )}

        {/* Testimonial Card */}
        <div
          className={`max-w-4xl mx-auto ${
            isVisible ? 'animate-scale-in-subtle' : 'opacity-0'
          }`}
        >
          {/* Gradient border wrapper */}
          <div className="p-[2px] bg-gradient-to-br from-brand-light via-brand to-brand-dark rounded-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-xl dark:shadow-none p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                {/* Decorative quote mark */}
                <div className="mb-6 text-brand-light">
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Avatar with glow effect */}
                {currentTestimonial.avatar && (
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-brand rounded-full blur-md opacity-30" />
                    <Image
                      src={currentTestimonial.avatar.url}
                      alt={currentTestimonial.author}
                      width={96}
                      height={96}
                      className="relative rounded-full h-24 w-24 object-cover border-4 border-white dark:border-gray-700 shadow-soft-lg"
                    />
                  </div>
                )}

                {/* Quote */}
                <blockquote className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8 font-light italic leading-relaxed">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Rating */}
                {currentTestimonial.rating && (
                  <div className="mb-4">
                    <StarRating rating={currentTestimonial.rating} />
                  </div>
                )}

                {/* Author Info */}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">{currentTestimonial.author}</p>
                  {currentTestimonial.role && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {currentTestimonial.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-6 mt-8">
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-soft hover:bg-brand hover:text-white hover:scale-110 transition-all-smooth"
                aria-label="Previous testimonial"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-12 bg-brand shadow-glow' : 'w-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-soft hover:bg-brand hover:text-white hover:scale-110 transition-all-smooth"
                aria-label="Next testimonial"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
