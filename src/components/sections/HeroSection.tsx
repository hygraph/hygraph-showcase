/**
 * Hero Section Component - Full-width banner with image/video
 * Supports text alignment, background images, and CTA buttons
 */

import Image from 'next/image';
import Button from '@/components/ui/Button';
import type { GetPageQuery } from '@/types/hygraph-generated';
import type { Locale } from '@/lib/utils/locale';

type HeroSectionType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'HeroSection' }>;

interface HeroSectionProps {
  section: HeroSectionType;
  locale: Locale;
}

function getAlignmentClasses(alignment: string): string {
  switch (alignment) {
    case 'LEFT':
      return 'text-left items-start';
    case 'CENTER':
      return 'text-center items-center';
    case 'RIGHT':
      return 'text-right items-end';
    default:
      return 'text-center items-center';
  }
}

export default function HeroSection({ section, locale }: HeroSectionProps) {
  const alignmentClasses = getAlignmentClasses(section.textAlignment);

  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      {section.backgroundMedia && (
        <div className="absolute inset-0 z-0">
          <Image
            src={section.backgroundMedia.url}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 md:py-40">
        <div className={`flex flex-col gap-6 max-w-3xl ${alignmentClasses} animate-fade-in`}>
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-display-md font-display text-white drop-shadow-lg">
            {section.headline}
          </h1>

          {/* Subheadline */}
          {section.subheadline && (
            <p className="text-xl md:text-2xl text-white/90 font-light drop-shadow-md">
              {section.subheadline}
            </p>
          )}

          {/* CTA Buttons */}
          {(section.primaryCTA || section.secondaryCTA) && (
            <div className="flex flex-wrap gap-4 mt-6">
              {section.primaryCTA && <Button key={section.primaryCTA.id} cta={section.primaryCTA} />}
              {section.secondaryCTA && <Button key={section.secondaryCTA.id} cta={section.secondaryCTA} />}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
