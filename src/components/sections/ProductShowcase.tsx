/**
 * Product Showcase Component - hybikes design
 * Uses BikeCard for consistent product display
 */

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import type { GetPageQuery } from '@/types/hygraph-generated';
import type { GetProductsQuery } from '@/types/hygraph-generated';
import type { Locale } from '@/lib/utils/locale';
import type { Bike } from '@/types/hybike';

type ProductShowcaseType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'ProductShowcase' }>;
type Product = GetProductsQuery['products'][0];

interface ProductShowcaseProps {
  section: ProductShowcaseType;
  locale: Locale;
  products: Product[];
}

export default function ProductShowcase({ section, locale, products }: ProductShowcaseProps) {
  if (products.length === 0) {
    return null;
  }

  const cols = section.itemsPerRow === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="border-b border-[#121212]">
      {/* Header */}
      <div className="flex items-end justify-between p-8 md:p-12 lg:px-16 border-b border-[#121212]">
        <div>
          <p
            className="uppercase tracking-[0.2em] text-[#6B6B6B] mb-3"
            style={{ fontSize: '0.65rem', fontWeight: 700 }}
          >
            Featured
          </p>
          {section.title && (
            <h2>
              {section.title.replace(/\.$/, '')}
              <span className="text-[#FF4F00]">.</span>
            </h2>
          )}
        </div>
        <Link
          href={`/${locale}/collection`}
          className="hidden sm:inline-flex items-center gap-2 text-[#FF4F00] uppercase tracking-[0.1em] hover:gap-3 transition-all"
          style={{ fontSize: '0.75rem', fontWeight: 700 }}
        >
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Products grid */}
      <div className={`grid ${cols}`}>
        {products.map((product) => (
          <div key={product.id}>
            <BikeCard bike={product as unknown as Bike} locale={locale} />
          </div>
        ))}
      </div>
    </section>
  );
}
