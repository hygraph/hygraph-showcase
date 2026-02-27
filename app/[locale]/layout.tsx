/**
 * Locale-specific Layout
 * Wraps pages with Navigation and Footer
 * Validates locale parameter
 */

import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/utils/locale";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import { AudienceProvider } from "@/lib/context/AudienceContext";
import SegmentSwitcher from "@/components/ui/SegmentSwitcher";
import { hygraphRequest } from "@/lib/hygraph/client";
import {
  GetNavigationDocument,
  GetSegmentsDocument,
  type GetNavigationQuery,
  type GetNavigationQueryVariables,
  type GetSegmentsQuery,
} from "@/types/hygraph-generated";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  let navItems: GetNavigationQuery["navigations"][0]["items"] = [];
  let footerItems: GetNavigationQuery["navigations"][0]["items"] = [];
  let segments: GetSegmentsQuery["segments"] = [];

  try {
    const [mainNavData, footerNavData, segmentsData] = await Promise.all([
      hygraphRequest<GetNavigationQuery>(GetNavigationDocument, {
        identifier: "main-nav",
        locale,
      } as GetNavigationQueryVariables),
      hygraphRequest<GetNavigationQuery>(GetNavigationDocument, {
        identifier: "footer-nav",
        locale,
      } as GetNavigationQueryVariables),
      hygraphRequest<GetSegmentsQuery>(GetSegmentsDocument, {}),
    ]);
    navItems = mainNavData.navigations?.[0]?.items ?? [];
    footerItems = footerNavData.navigations?.[0]?.items ?? [];
    segments = segmentsData.segments ?? [];
  } catch {
    // Fall back to empty
  }

  return (
    <AudienceProvider>
      <div className="flex min-h-screen flex-col">
        <Navigation locale={locale as Locale} navItems={navItems} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} navItems={footerItems} />
        <SegmentSwitcher segments={segments} />
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
    { locale: "en" },
    { locale: "de" },
    { locale: "fr" },
    { locale: "es" },
  ];
}
