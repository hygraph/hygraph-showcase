'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import BikeCard from '@/components/BikeCard';
import type { Bike } from '@/types/hybike';
import { formatBikeCategory } from '@/types/hybike';

const CATEGORIES = ['All', 'Road', 'Urban', 'Electric', 'Gravel'];

interface CollectionViewProps {
  bikes: Bike[];
}

export default function CollectionView({ bikes }: CollectionViewProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? bikes
      : bikes.filter((b) => formatBikeCategory(b.bikeCategory) === activeCategory);

  return (
    <div>
      {/* Header */}
      <section className="border-b border-[#121212]">
        <div className="p-8 md:p-12 lg:px-16 lg:py-20">
          <p className="uppercase tracking-[0.2em] text-[#6B6B6B] mb-4" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
            Shop
          </p>
          <h1>
            Collection<span className="text-[#FF4F00]">.</span>
          </h1>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-b border-[#121212]">
        <div className="flex items-stretch overflow-x-auto">
          {CATEGORIES.map((cat, i) => {
            const count =
              cat === 'All'
                ? bikes.length
                : bikes.filter((b) => formatBikeCategory(b.bikeCategory) === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-4 uppercase tracking-[0.1em] transition-colors whitespace-nowrap ${
                  i < CATEGORIES.length - 1 ? 'border-r border-[#121212]' : ''
                } ${
                  activeCategory === cat
                    ? 'bg-[#121212] text-[#F9F9F7]'
                    : 'hover:bg-[#121212] hover:text-[#F9F9F7]'
                }`}
                style={{ fontSize: '0.75rem', fontWeight: 700 }}
              >
                {cat}
                <span
                  className={`ml-2 ${activeCategory === cat ? 'text-[#FF4F00]' : 'text-[#6B6B6B]'}`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {filtered.map((bike) => (
            <div key={bike.id} className="border-b border-[#121212]">
              <BikeCard bike={bike} locale={locale} />
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="p-16 text-center">
            <p className="text-[#6B6B6B]">No bikes found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
