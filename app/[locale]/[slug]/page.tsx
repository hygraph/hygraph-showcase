/**
 * Dynamic Page - Renders any Page by slug
 * Dynamically renders sections based on __typename
 */

import { cookies } from 'next/headers';
import { hygraphRequest } from '@/lib/hygraph/client';
import {
  GetPageDocument,
  GetProductsDocument,
  type GetPageQuery,
  type GetPageQueryVariables,
  type GetProductsQuery,
  type GetProductsQueryVariables,
} from '@/types/hygraph-generated';
import { type Locale } from '@/lib/utils/locale';
import HeroSection from '@/components/sections/HeroSection';
import FeatureGrid from '@/components/sections/FeatureGrid';
import TestimonialCarousel from '@/components/sections/TestimonialCarousel';
import CTABlock from '@/components/sections/CTABlock';
import ProductShowcase from '@/components/sections/ProductShowcase';
import StatsBar from '@/components/sections/StatsBar';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Type guards for section types
type PageSection = GetPageQuery['pages'][0]['sections'][0];

function isHeroSection(section: PageSection): section is Extract<PageSection, { __typename?: 'HeroSection' }> {
  return section.__typename === 'HeroSection';
}

function isFeatureGrid(section: PageSection): section is Extract<PageSection, { __typename?: 'FeatureGrid' }> {
  return section.__typename === 'FeatureGrid';
}

function isTestimonialCarousel(section: PageSection): section is Extract<PageSection, { __typename?: 'TestimonialCarousel' }> {
  return section.__typename === 'TestimonialCarousel';
}

function isCTABlock(section: PageSection): section is Extract<PageSection, { __typename?: 'CTABlock' }> {
  return section.__typename === 'CTABlock';
}

function isProductShowcase(section: PageSection): section is Extract<PageSection, { __typename?: 'ProductShowcase' }> {
  return section.__typename === 'ProductShowcase';
}

function isStatsBar(section: PageSection): section is Extract<PageSection, { __typename?: 'StatsBar' }> {
  return section.__typename === 'StatsBar';
}

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const data = await hygraphRequest<GetPageQuery>(GetPageDocument, {
      slug,
      locale,
      segmentName: undefined,
    } as GetPageQueryVariables);

    const page = data.pages?.[0];
    if (!page) {
      return {
        title: 'Page Not Found',
      };
    }

    return {
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription ?? undefined,
      openGraph: page.seo?.ogImage
        ? {
            images: [
              {
                url: page.seo.ogImage.url,
                width: page.seo.ogImage.width ?? undefined,
                height: page.seo.ogImage.height ?? undefined,
                alt: page.title,
              },
            ],
          }
        : undefined,
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: 'Page',
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  // Read audience from cookie for variant selection
  const cookieStore = await cookies();
  const audienceCookie = cookieStore.get('hybike-audience')?.value;
  const segmentName = audienceCookie && ['COMMUTERS', 'SPORTS_ENTHUSIASTS'].includes(audienceCookie)
    ? audienceCookie === 'COMMUTERS' ? 'Commuters' : 'Sports Enthusiasts'
    : undefined;

  // Fetch page content and products in parallel
  let data: GetPageQuery | null = null;
  let productsData: GetProductsQuery | null = null;
  try {
    [data, productsData] = await Promise.all([
      hygraphRequest<GetPageQuery>(GetPageDocument, {
        slug,
        locale,
        segmentName,
      } as GetPageQueryVariables),
      hygraphRequest<GetProductsQuery>(GetProductsDocument, {
        locale,
      } as GetProductsQueryVariables),
    ]);
  } catch (error) {
    console.error('Failed to fetch page:', error);
    notFound();
  }

  const page = data?.pages?.[0];
  const products = productsData?.products || [];

  if (!page) {
    notFound();
  }

  // Use variant sections if available, otherwise use base sections
  const variant = page.variants && page.variants.length > 0 ? page.variants[0] : null;
  const displaySections = variant?.sections || page.sections;

  return (
    <div>
      {displaySections.map((section) => {
        // Render section based on __typename using type guards
        // Note: Using 'as any' to handle GraphQL null vs TypeScript undefined mismatch
        if (isHeroSection(section)) {
          return <HeroSection key={section.id} section={section as any} locale={locale as Locale} />;
        }
        if (isFeatureGrid(section)) {
          return <FeatureGrid key={section.id} section={section as any} />;
        }
        if (isTestimonialCarousel(section)) {
          return <TestimonialCarousel key={section.id} section={section as any} />;
        }
        if (isCTABlock(section)) {
          return <CTABlock key={section.id} section={section as any} locale={locale as Locale} />;
        }
        if (isProductShowcase(section)) {
          return <ProductShowcase key={section.id} section={section as any} locale={locale as Locale} products={products as any} />;
        }
        if (isStatsBar(section)) {
          return <StatsBar key={section.id} section={section as any} locale={locale as Locale} />;
        }

        // Unknown section type
        console.warn(`Unknown section type: ${(section as { __typename: string }).__typename}`);
        return null;
      })}
    </div>
  );
}

export const revalidate = 300; // Revalidate every 5 minutes
