/**
 * Product Line Landing Page
 * Displays product line details, features, testimonials, and linked products
 */

import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { hygraphRequest } from '@/lib/hygraph/client';
import {
  GetProductLineDocument,
  type GetProductLineQuery,
  type GetProductLineQueryVariables,
} from '@/types/hygraph-generated';
import {
  GetProductsByCategoryDocument,
  type GetProductsByCategoryQuery,
  type GetProductsByCategoryQueryVariables,
} from '@/types/hygraph-generated';
import { type Locale } from '@/lib/utils/locale';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * Type guard for products with federated data
 */
type ProductWithFederation = GetProductsByCategoryQuery['products'][0] & {
  externalProduct: NonNullable<GetProductsByCategoryQuery['products'][0]['externalProduct']>;
};

function hasFederatedData(product: GetProductsByCategoryQuery['products'][0]): product is ProductWithFederation {
  return product.externalProduct !== undefined && product.externalProduct !== null;
}

interface ProductLinePageProps {
  params: Promise<{
    locale: string;
    productLineSlug: string;
  }>;
}

export async function generateMetadata({ params }: ProductLinePageProps): Promise<Metadata> {
  const { locale, productLineSlug } = await params;

  // Read audience from cookie for variant selection
  const cookieStore = await cookies();
  const audienceCookie = cookieStore.get('hybike-audience')?.value;
  const segmentName = audienceCookie && ['COMMUTERS', 'SPORTS_ENTHUSIASTS'].includes(audienceCookie)
    ? audienceCookie === 'COMMUTERS' ? 'Commuters' : 'Sports Enthusiasts'
    : undefined;

  try {
    const data = await hygraphRequest<GetProductLineQuery>(GetProductLineDocument, {
      slug: productLineSlug,
      locale,
      segmentName,
    } as GetProductLineQueryVariables);

    if (!data.productLine) {
      return {
        title: 'Product Line Not Found',
      };
    }

    // Use variant tagline if available for metadata
    const variant = data.productLine.variants && data.productLine.variants.length > 0 ? data.productLine.variants[0] : null;
    const metaTagline = variant?.tagline || data.productLine.tagline;

    return {
      title: data.productLine.seo?.metaTitle || data.productLine.name,
      description: (data.productLine.seo?.metaDescription || metaTagline) ?? undefined,
      openGraph: data.productLine.seo?.ogImage
        ? {
            images: [
              {
                url: data.productLine.seo.ogImage.url,
                width: data.productLine.seo.ogImage.width ?? undefined,
                height: data.productLine.seo.ogImage.height ?? undefined,
                alt: data.productLine.name,
              },
            ],
          }
        : undefined,
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: 'Product Line',
    };
  }
}

export default async function ProductLinePage({ params }: ProductLinePageProps) {
  const { locale, productLineSlug } = await params;

  // Read audience from cookie for variant selection
  const cookieStore = await cookies();
  const audienceCookie = cookieStore.get('hybike-audience')?.value;
  const segmentName = audienceCookie && ['COMMUTERS', 'SPORTS_ENTHUSIASTS'].includes(audienceCookie)
    ? audienceCookie === 'COMMUTERS' ? 'Commuters' : 'Sports Enthusiasts'
    : undefined;

  // Fetch product line content with variant
  let data: GetProductLineQuery | null = null;
  try {
    data = await hygraphRequest<GetProductLineQuery>(GetProductLineDocument, {
      slug: productLineSlug,
      locale,
      segmentName,
    } as GetProductLineQueryVariables);
  } catch (error) {
    console.error('Failed to fetch product line:', error);
    notFound();
  }

  if (!data?.productLine) {
    notFound();
  }

  const productLine = data.productLine;

  // Use variant values if available, otherwise use base values
  const variant = productLine.variants && productLine.variants.length > 0 ? productLine.variants[0] : null;
  const displayTagline = variant?.tagline || productLine.tagline;
  const displayDescription = variant?.description || productLine.description;
  const displayHeroImage = variant?.heroImage || productLine.heroImage;

  // Map ProductLine slug to category taxonomy value
  // Note: ProductCategory taxonomy has: MountainEbikes, UrbanEbikes, RoadBikes, GravelBikes
  const categoryMap: Record<string, string> = {
    'electric-trailblazer-series': 'MountainEbikes',
    'urban-commuter-series': 'UrbanEbikes',
    'comfort-series': 'UrbanEbikes', // Comfort products also use UrbanEbikes taxonomy
  };

  const categoryValue = categoryMap[productLineSlug];

  // Fetch products filtered by category
  let productsData: GetProductsByCategoryQuery | null = null;
  try {
    if (categoryValue) {
      productsData = await hygraphRequest<GetProductsByCategoryQuery>(
        GetProductsByCategoryDocument,
        {
          locale,
          categoryValue,
        } as GetProductsByCategoryQueryVariables
      );
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  const products = productsData?.products || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        {displayHeroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={displayHeroImage.url}
              alt={productLine.name}
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {productLine.name}
            </h1>
            {displayTagline && (
              <p className="text-xl md:text-2xl mb-6 text-white/90">
                {displayTagline}
              </p>
            )}
            {displayDescription && (
              <p className="text-lg text-white/80">
                {displayDescription.text}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      {productLine.keyFeatures.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Key Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productLine.keyFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
                >
                  {feature.icon && (
                    <div className="mb-4 text-brand">
                      <Image
                        src={feature.icon.url}
                        alt={feature.title}
                        width={64}
                        height={64}
                        className="h-16 w-16"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section (Federated from PIM) */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Available Models
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const federatedData = hasFederatedData(product) ? product.externalProduct.data : null;
                const price = federatedData?.calculated_price;
                const inStock = federatedData ? federatedData.inventory_level > 0 : true;

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      {!inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div>
                          {price && (
                            <p className="text-2xl font-bold text-brand">
                              ${price.toLocaleString()}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {federatedData?.sku || product.baseProductId}
                          </p>
                          {federatedData && (
                            <p className="text-xs text-gray-600 mt-1">
                              {federatedData.inventory_level} in stock
                            </p>
                          )}
                        </div>

                        {inStock && (
                          <Link
                            href={`/${locale}/product/${product.id}`}
                            className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-hover transition-colors text-sm font-medium"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-700">
                No products available for this product line at the moment.
              </p>
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Live product data via Content Federation (BigCommerce)</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      {productLine.testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              What Customers Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productLine.testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-50 rounded-lg p-6 shadow-sm"
                >
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-5 w-5 ${
                            star <= testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}

                  <blockquote className="text-gray-700 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <Image
                        src={testimonial.avatar.url}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="rounded-full h-12 w-12 object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      {testimonial.role && (
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export const revalidate = 300; // Revalidate every 5 minutes
