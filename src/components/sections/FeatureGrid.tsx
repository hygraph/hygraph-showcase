/**
 * Feature Grid Component - hybikes design
 * Clean bordered cards, uppercase labels, minimal aesthetic
 */

import type { GetPageQuery } from '@/types/hygraph-generated';

type FeatureGridType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'FeatureGrid' }>;

interface FeatureGridProps {
  section: FeatureGridType;
}

export default function FeatureGrid({ section }: FeatureGridProps) {
  const features = section.features;

  return (
    <section className="border-b border-[#121212]">
      {/* Section header */}
      <div className="p-8 md:p-12 lg:px-16 border-b border-[#121212]">
        {section.title && (
          <div>
            <p
              className="uppercase tracking-[0.2em] text-[#6B6B6B] mb-3"
              style={{ fontSize: '0.65rem', fontWeight: 700 }}
            >
              Our Approach
            </p>
            <h2>
              {section.title.replace(/\.$/, '')}
              <span className="text-[#FF4F00]">.</span>
            </h2>
          </div>
        )}
      </div>

      {/* Feature grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${features.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {features.map((feature, i) => (
          <div
            key={feature.id}
            className={[
              'p-8 md:p-10',
              i < features.length - 1 ? 'border-b md:border-b-0 md:border-r border-[#121212]' : '',
              i === 1 && features.length === 4 ? 'md:border-b lg:border-b-0' : '',
            ].join(' ')}
          >
            <p
              className="text-[#FF4F00] mb-4 uppercase tracking-[0.2em]"
              style={{ fontSize: '0.65rem', fontWeight: 700 }}
            >
              0{i + 1}
            </p>
            <h3 className="mb-4">{feature.title}</h3>
            <p className="text-[#6B6B6B]" style={{ lineHeight: 1.7 }}>
              {feature.description.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
