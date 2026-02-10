/**
 * Bike Detail Page
 * Displays full bike information including specs and live BigCommerce data
 */

import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { hygraphRequest } from '@/lib/hygraph/client';
import {
  GetBikeDocument,
  type GetBikeQuery,
  type GetBikeQueryVariables,
} from '@/types/hygraph-generated';
import { type Locale } from '@/lib/utils/locale';

interface BikePageProps {
  params: Promise<{
    locale: string;
    bikeId: string;
  }>;
}

export async function generateMetadata({ params }: BikePageProps): Promise<Metadata> {
  const { locale, bikeId } = await params;

  try {
    const data = await hygraphRequest<GetBikeQuery>(GetBikeDocument, {
      id: bikeId,
      locale,
    } as GetBikeQueryVariables);

    if (!data.bike) {
      return {
        title: 'Bike Not Found',
      };
    }

    return {
      title: `${data.bike.name} | HyBike`,
      description: data.bike.description?.text.substring(0, 160) ?? undefined,
      openGraph: data.bike.images[0]
        ? {
            images: [
              {
                url: data.bike.images[0].url,
                width: data.bike.images[0].width ?? undefined,
                height: data.bike.images[0].height ?? undefined,
                alt: data.bike.name,
              },
            ],
          }
        : undefined,
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: 'Bike',
    };
  }
}

export default async function BikePage({ params }: BikePageProps) {
  const { locale, bikeId } = await params;

  let data: GetBikeQuery | null = null;
  try {
    data = await hygraphRequest<GetBikeQuery>(GetBikeDocument, {
      id: bikeId,
      locale,
    } as GetBikeQueryVariables);
  } catch (error) {
    console.error('Failed to fetch bike:', error);
    notFound();
  }

  const bike = data?.bike;
  if (!bike) {
    notFound();
  }

  // Get BigCommerce data
  const federatedData = bike.externalProduct?.data;
  const price = federatedData?.calculated_price;
  const inStock = federatedData ? federatedData.inventory_level > 0 : true;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-600">
            <a href={`/${locale}`} className="hover:text-brand">Home</a>
            <span className="mx-2">/</span>
            <a href={`/${locale}/products`} className="hover:text-brand">Products</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{bike.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {bike.images[0] && (
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={bike.images[0].url}
                  alt={bike.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {!inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-2xl font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Gallery */}
            {bike.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {bike.images.slice(1, 5).map((image) => (
                  <div key={image.id} className="relative aspect-square bg-white rounded-lg overflow-hidden shadow cursor-pointer hover:shadow-lg transition-shadow">
                    <Image
                      src={image.url}
                      alt={bike.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {bike.name}
              </h1>
              {bike.category && (
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  {bike.category.value}
                </p>
              )}
            </div>

            {/* Price */}
            {price && (
              <div className="text-4xl font-bold text-brand">
                ${price.toLocaleString()}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-4">
              {federatedData && (
                <>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {inStock ? `${federatedData.inventory_level} in stock` : 'Out of Stock'}
                  </div>
                  <p className="text-sm text-gray-600">SKU: {federatedData.sku}</p>
                </>
              )}
            </div>

            {/* Description */}
            {bike.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {bike.description.text}
                </p>
              </div>
            )}

            {/* Action Button */}
            {inStock && (
              <button className="w-full bg-brand text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-hover transition-colors">
                Add to Cart
              </button>
            )}

            {/* Live Data Badge */}
            {federatedData && (
              <p className="text-xs text-gray-500 text-center">
                Live pricing and inventory from BigCommerce
              </p>
            )}
          </div>
        </div>

        {/* Specifications */}
        {bike.specifications && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Technical Specifications</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries({
                  'Weight': bike.specifications.weight,
                  'Motor': bike.specifications.motor,
                  'Battery': bike.specifications.battery,
                  'Range': bike.specifications.range,
                  'Frame': bike.specifications.frame,
                  'Brakes': bike.specifications.brakes,
                  'Gears': bike.specifications.gears,
                  'Suspension': bike.specifications.suspension,
                  'Wheel Size': bike.specifications.wheelSize,
                }).filter(([_, value]) => value).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-4">
                    <dt className="text-sm font-medium text-gray-600 mb-1">{key}</dt>
                    <dd className="text-base text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Variants (if available) */}
        {federatedData?.variants && federatedData.variants.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {federatedData.variants.map((variant) => (
                <div key={variant.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {variant.option_values.map((option) => (
                        <p key={option.label} className="text-sm text-gray-600">
                          <span className="font-medium">{option.option_display_name}:</span> {option.label}
                        </p>
                      ))}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      variant.inventory_level > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {variant.inventory_level > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-brand">
                      ${variant.calculated_price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {variant.inventory_level > 0 ? `${variant.inventory_level} available` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const revalidate = 300; // Revalidate every 5 minutes
