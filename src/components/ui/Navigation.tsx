/**
 * Navigation Component - Site header with main navigation
 * Fetches navigation data from Hygraph
 */

import { hygraphRequest } from '@/lib/hygraph/client';
import {
  GetNavigationDocument,
  GetSiteSettingsDocument,
  type GetNavigationQuery,
  type GetNavigationQueryVariables,
  type GetSiteSettingsQuery,
  type GetSiteSettingsQueryVariables,
} from '@/types/hygraph-generated';
import LocaleSwitcher from './LocaleSwitcher';
import NavigationItems from './NavigationItems';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import type { Locale } from '@/lib/utils/locale';

interface NavigationProps {
  locale: Locale;
}

export default async function Navigation({ locale }: NavigationProps) {
  // Fetch navigation and site settings
  let navData: GetNavigationQuery | null = null;
  let siteSettings: GetSiteSettingsQuery['allSiteSettings'][0] | null = null;

  try {
    const [nav, settings] = await Promise.all([
      hygraphRequest<GetNavigationQuery>(GetNavigationDocument, {
        identifier: 'main-nav',
        locale,
      } as GetNavigationQueryVariables),
      hygraphRequest<GetSiteSettingsQuery>(GetSiteSettingsDocument, {
        locale,
      } as GetSiteSettingsQueryVariables),
    ]);

    navData = nav;
    siteSettings = (settings.allSiteSettings && settings.allSiteSettings.length > 0)
      ? settings.allSiteSettings[0]
      : null;
  } catch (error) {
    console.error('Failed to fetch navigation:', error);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-soft dark:shadow-none">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Logo locale={locale} siteName={siteSettings?.siteName || 'HyBike'} />

        {/* Navigation Items */}
        <div className="hidden items-center gap-1 md:flex">
          <NavigationItems
            items={navData?.navigations?.[0]?.items || []}
            locale={locale}
          />
        </div>

        {/* Right side: Dark Mode Toggle + Locale Switcher */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}
