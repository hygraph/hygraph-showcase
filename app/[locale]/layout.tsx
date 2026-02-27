/**
 * Locale-specific Layout
 * Wraps pages with Navigation and Footer
 * Validates locale parameter
 */

import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/lib/utils/locale';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { AudienceProvider } from '@/lib/context/AudienceContext';
import AudienceSwitcher from '@/components/ui/AudienceSwitcher';
import { hygraphRequest } from '@/lib/hygraph/client';
import {
  GetNavigationDocument,
  type GetNavigationQuery,
  type GetNavigationQueryVariables,
} from '@/types/hygraph-generated';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  let navItems: GetNavigationQuery['navigations'][0]['items'] = [];
  try {
    const navData = await hygraphRequest<GetNavigationQuery>(
      GetNavigationDocument,
      { identifier: 'main-nav', locale } as GetNavigationQueryVariables
    );
    navItems = navData.navigations?.[0]?.items ?? [];
  } catch {
    // Fall back to empty — Navigation renders nothing if items is empty
  }

  return (
    <AudienceProvider>
      <div className="flex min-h-screen flex-col">
        <Navigation locale={locale as Locale} navItems={navItems} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} />
        <AudienceSwitcher />
      </div>
    </AudienceProvider>
  );
}

/**
 * Generate static params for all supported locales
 * Enables ISR for each locale
 */
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'de' },
    { locale: 'fr' },
    { locale: 'es' },
  ];
}
