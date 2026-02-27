/**
 * Editorial Section Component - hybikes design
 * Handles two layouts:
 *   imageRight=false → 7-col image LEFT + 5-col text RIGHT ("Built by hand")
 *   imageRight=true  → 5-col text LEFT + 7-col image RIGHT ("Carbon fiber" with optional spec grid)
 */

import Link from 'next/link';
import { ArrowRight, ArrowDownRight } from 'lucide-react';
import type { GetPageQuery } from '@/types/hygraph-generated';

type EditorialSectionType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'EditorialSection' }>;

interface EditorialSectionProps {
  section: EditorialSectionType;
}

interface SpecItem {
  label: string;
  value: string;
}

export default function EditorialSection({ section }: EditorialSectionProps) {
  const imageUrl = section.imageUrl || '';
  const headline = section.editorialHeadline || '';
  const specItems = section.specItemsJson as SpecItem[] | null;
  const hasSpecs = specItems && specItems.length > 0;

  if (section.imageRight) {
    // Materials layout: text LEFT (5 cols), image RIGHT (7 cols)
    return (
      <section className="border-b border-[#121212]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Text left */}
          <div className="lg:col-span-5 p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#121212]">
            {section.eyebrow && (
              <p
                className="uppercase tracking-[0.2em] text-[#6B6B6B] mb-4"
                style={{ fontSize: '0.65rem', fontWeight: 700 }}
              >
                {section.eyebrow}
              </p>
            )}
            <h2 className="mb-6">
              {headline.replace(/\.$/, '')}<span className="text-[#FF4F00]">.</span>
            </h2>
            {section.bodyText && (
              <p className="text-[#6B6B6B] mb-6" style={{ lineHeight: 1.7 }}>
                {section.bodyText}
              </p>
            )}
            {hasSpecs && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {(specItems as SpecItem[]).map((item) => (
                  <div key={item.label} className="border border-[#121212] p-4">
                    <p
                      className="uppercase tracking-[0.15em] text-[#6B6B6B] mb-1"
                      style={{ fontSize: '0.6rem', fontWeight: 700 }}
                    >
                      {item.label}
                    </p>
                    <p style={{ fontWeight: 700 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image right */}
          <div className="lg:col-span-7">
            <img
              src={imageUrl}
              alt={headline}
              className="w-full h-full object-cover min-h-[400px]"
            />
          </div>
        </div>
      </section>
    );
  }

  // Craftsmanship layout: image LEFT (7 cols), text RIGHT (5 cols)
  return (
    <section className="border-b border-[#121212]">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Image left */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#121212]">
          <img
            src={imageUrl}
            alt={headline}
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>

        {/* Text right */}
        <div className="lg:col-span-5 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <ArrowDownRight size={32} className="text-[#FF4F00] mb-6" />
          {section.eyebrow && (
            <p
              className="uppercase tracking-[0.2em] text-[#6B6B6B] mb-4"
              style={{ fontSize: '0.65rem', fontWeight: 700 }}
            >
              {section.eyebrow}
            </p>
          )}
          <h2 className="mb-6">
            {headline.replace(/\.$/, '')}<span className="text-[#FF4F00]">.</span>
          </h2>
          {section.bodyText && (
            <p className="text-[#6B6B6B] mb-8" style={{ lineHeight: 1.7 }}>
              {section.bodyText}
            </p>
          )}
          {section.ctaLabel && section.ctaHref && (
            <Link
              href={section.ctaHref}
              className="inline-flex items-center gap-3 text-[#FF4F00] uppercase tracking-[0.1em] hover:gap-4 transition-all self-start"
              style={{ fontSize: '0.75rem', fontWeight: 700 }}
            >
              {section.ctaLabel}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
