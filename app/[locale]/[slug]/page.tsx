/**
 * Dynamic Page - Renders any Page by slug via Hygraph Page model.
 * Listing slugs (blog, careers, collection) also fetch their respective content.
 */

import { cookies } from "next/headers";
import { hygraphRequest } from "@/lib/hygraph/client";
import {
  GetPageDocument,
  GetFeaturedProductsDocument,
  GetProductsDocument,
  GetBlogPostsDocument,
  GetJobsDocument,
  type GetPageQuery,
  type GetPageQueryVariables,
  type GetFeaturedProductsQuery,
  type GetFeaturedProductsQueryVariables,
  type GetProductsQuery,
  type GetProductsQueryVariables,
  type GetBlogPostsQuery,
  type GetJobsQuery,
} from "@/types/hygraph-generated";
import { type Locale } from "@/lib/utils/locale";
import HeroSection from "@/components/sections/HeroSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import EditorialSection from "@/components/sections/EditorialSection";
import CTABlock from "@/components/sections/CTABlock";
import ProductShowcase from "@/components/sections/ProductShowcase";
import StatsBar from "@/components/sections/StatsBar";
import BlogView from "@/components/pages/BlogView";
import CareersView from "@/components/pages/CareersView";
import CollectionView from "@/components/pages/CollectionView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Post, Job, Bike } from "@/types/hybike";

// Type guards for section types
type PageSection = GetPageQuery["pages"][0]["sections"][0];

function isHeroSection(
  section: PageSection
): section is Extract<PageSection, { __typename?: "HeroSection" }> {
  return section.__typename === "HeroSection";
}

function isFeatureGrid(
  section: PageSection
): section is Extract<PageSection, { __typename?: "FeatureGrid" }> {
  return section.__typename === "FeatureGrid";
}

function isEditorialSection(
  section: PageSection
): section is Extract<PageSection, { __typename?: "EditorialSection" }> {
  return section.__typename === "EditorialSection";
}

function isCTABlock(
  section: PageSection
): section is Extract<PageSection, { __typename?: "CTABlock" }> {
  return section.__typename === "CTABlock";
}

function isProductShowcase(
  section: PageSection
): section is Extract<PageSection, { __typename?: "ProductShowcase" }> {
  return section.__typename === "ProductShowcase";
}

function isStatsBar(
  section: PageSection
): section is Extract<PageSection, { __typename?: "StatsBar" }> {
  return section.__typename === "StatsBar";
}

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const data = await hygraphRequest<GetPageQuery>(GetPageDocument, {
      slug,
      locale,
      segmentName: undefined,
    } as GetPageQueryVariables);

    const page = data.pages?.[0];
    if (!page) {
      return { title: "Page Not Found" };
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
    console.error("Failed to generate metadata:", error);
    return { title: "Page" };
  }
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  // Read segment from cookie for variant selection
  const cookieStore = await cookies();
  const audienceCookie = cookieStore.get("hybike-audience")?.value;
  const segmentName =
    audienceCookie && audienceCookie !== "Default" ? audienceCookie : undefined;

  // Fetch page + additional listing data in parallel based on slug
  let data: GetPageQuery | null = null;
  let featuredProducts: GetFeaturedProductsQuery | null = null;
  let allProducts: GetProductsQuery | null = null;
  let blogPosts: GetBlogPostsQuery | null = null;
  let jobs: GetJobsQuery | null = null;

  try {
    [data, featuredProducts, allProducts, blogPosts, jobs] = await Promise.all([
      hygraphRequest<GetPageQuery>(GetPageDocument, {
        slug,
        locale,
        segmentName,
      } as GetPageQueryVariables),
      slug !== "collection"
        ? hygraphRequest<GetFeaturedProductsQuery>(
            GetFeaturedProductsDocument,
            { locale } as GetFeaturedProductsQueryVariables
          )
        : Promise.resolve(null),
      slug === "collection"
        ? hygraphRequest<GetProductsQuery>(GetProductsDocument, {
            locale,
          } as GetProductsQueryVariables)
        : Promise.resolve(null),
      slug === "blog"
        ? hygraphRequest<GetBlogPostsQuery>(GetBlogPostsDocument, {})
        : Promise.resolve(null),
      slug === "careers"
        ? hygraphRequest<GetJobsQuery>(GetJobsDocument, {})
        : Promise.resolve(null),
    ]);
  } catch (error) {
    console.error("Failed to fetch page:", error);
    notFound();
  }

  const page = data?.pages?.[0];

  if (!page) {
    notFound();
  }

  // Use variant sections if available, otherwise use base sections
  const variant =
    page.variants && page.variants.length > 0 ? page.variants[0] : null;
  const displaySections = variant?.sections || page.sections;

  const products = featuredProducts?.products || [];

  function renderSections() {
    return displaySections.map((section) => {
      if (isHeroSection(section)) {
        return (
          <HeroSection
            key={section.id}
            section={section as any}
            locale={locale as Locale}
          />
        );
      }
      if (isFeatureGrid(section)) {
        return <FeatureGrid key={section.id} section={section as any} />;
      }
      if (isEditorialSection(section)) {
        return <EditorialSection key={section.id} section={section as any} />;
      }
      if (isCTABlock(section)) {
        return (
          <CTABlock
            key={section.id}
            section={section as any}
            locale={locale as Locale}
          />
        );
      }
      if (isProductShowcase(section)) {
        return (
          <ProductShowcase
            key={section.id}
            section={section as any}
            locale={locale as Locale}
            products={products as any}
          />
        );
      }
      if (isStatsBar(section)) {
        return (
          <StatsBar
            key={section.id}
            section={section as any}
            locale={locale as Locale}
          />
        );
      }

      console.warn(
        `Unknown section type: ${
          (section as { __typename: string }).__typename
        }`
      );
      return null;
    });
  }

  if (slug === "blog") {
    const posts = (blogPosts?.blogPosts ?? []) as unknown as Post[];
    return (
      <div>
        {renderSections()}
        <BlogView posts={posts} />
      </div>
    );
  }

  if (slug === "careers") {
    const jobList = (jobs?.jobs ?? []) as unknown as Job[];
    return (
      <div>
        {renderSections()}
        <CareersView jobs={jobList} />
      </div>
    );
  }

  if (slug === "collection") {
    const bikes = (allProducts?.products ?? []) as unknown as Bike[];
    return (
      <div>
        {renderSections()}
        <CollectionView bikes={bikes} />
      </div>
    );
  }

  return <div>{renderSections()}</div>;
}

export const revalidate = 300;
