/**
 * useScrollAnimation Hook
 *
 * Triggers animations when elements enter the viewport using Intersection Observer.
 * Provides smooth scroll-triggered animations for enhanced UX.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number; // 0-1, how much of element must be visible
  triggerOnce?: boolean; // Animate only once or every time it enters viewport
  delay?: number; // Delay in ms before animation starts
  rootMargin?: string; // Margin around viewport for early triggering
}

/**
 * Hook to detect when element is in viewport and trigger animations
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    rootMargin = '0px 0px -100px 0px', // Start animation slightly before element is fully visible
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if already animated and triggerOnce is true
    if (hasAnimated && triggerOnce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Delay the animation if specified
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true);
                setHasAnimated(true);
              }, delay);
            } else {
              setIsVisible(true);
              setHasAnimated(true);
            }
          } else if (!triggerOnce) {
            // Reset visibility if triggerOnce is false
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce, delay, rootMargin, hasAnimated]);

  return { ref, isVisible };
}

/**
 * Hook for staggered animations (useful for lists/grids)
 */
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  index: number,
  options: UseScrollAnimationOptions = {}
) {
  const staggerDelay = (options.delay || 0) + index * 100; // 100ms stagger per item
  return useScrollAnimation<T>({ ...options, delay: staggerDelay });
}
