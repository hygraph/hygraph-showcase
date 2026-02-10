/**
 * Navigation Items Component - Interactive navigation with dropdowns
 * Client Component for dropdown interactivity
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { GetNavigationQuery } from '@/types/hygraph-generated';

type NavigationItem = GetNavigationQuery['navigations'][0]['items'][0];
import type { Locale } from '@/lib/utils/locale';

interface NavigationItemsProps {
  items: NavigationItem[];
  locale: Locale;
}

/**
 * Single navigation item with optional dropdown
 */
function NavItem({ item, locale }: { item: NavigationItem; locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  // Determine href based on linkType
  let href = '#';
  if (item.linkType === 'EXTERNAL' && item.externalUrl) {
    href = item.externalUrl;
  } else if (item.linkType === 'PAGE' && item.pageLink) {
    href = `/${locale}/${item.pageLink.slug}`;
  } else if (item.linkType === 'PRODUCT_LINE' && item.productLineLink) {
    href = `/${locale}/products/${item.productLineLink.slug}`;
  }

  if (hasChildren) {
    return (
      <div
        className="relative pt-2"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand rounded-lg transition-colors -mt-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {item.label}
          <svg
            className={`h-4 w-4 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute left-0 z-50 w-48 rounded-xl bg-white dark:bg-gray-800 py-2 shadow-soft-lg dark:ring-1 dark:ring-white/10 animate-slide-down">
            {item.children!.map((child) => {
              let childHref = '#';
              if (child.linkType === 'EXTERNAL' && child.externalUrl) {
                childHref = child.externalUrl;
              } else if (child.linkType === 'PAGE' && child.pageLink) {
                childHref = `/${locale}/${child.pageLink.slug}`;
              } else if (child.linkType === 'PRODUCT_LINE' && child.productLineLink) {
                childHref = `/${locale}/products/${child.productLineLink.slug}`;
              }

              return (
                <Link
                  key={child.id}
                  href={childHref}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-light dark:hover:bg-brand/20 hover:text-brand rounded-lg mx-2 transition-colors"
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isExternal = item.linkType === 'EXTERNAL';

  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {item.label}
    </Link>
  );
}

export default function NavigationItems({ items, locale }: NavigationItemsProps) {
  return (
    <>
      {items.map((item) => (
        <NavItem key={item.id} item={item} locale={locale} />
      ))}
    </>
  );
}
