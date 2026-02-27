/**
 * Hero Section Component - Split layout (text left, image right)
 * hybikes design: big uppercase typography, orange accent, local image panel
 */

import Link from "next/link";
import type { GetPageQuery } from "@/types/hygraph-generated";
import type { Locale } from "@/lib/utils/locale";

type HeroSectionType = Extract<
  GetPageQuery["pages"][0]["sections"][0],
  { __typename?: "HeroSection" }
>;

interface HeroSectionProps {
  section: HeroSectionType;
  locale: Locale;
}

export default function HeroSection({ section, locale }: HeroSectionProps) {
  const mediaUrl = section.backgroundMedia?.url ?? null;

  if (mediaUrl) {
    return (
      <section className="border-b border-[#121212]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Typography */}
          <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col border-b lg:border-b-0 lg:border-r border-[#121212]">
            <div>
              <p
                className="uppercase tracking-[0.2em] text-[#6B6B6B] mb-8"
                style={{ fontSize: "0.65rem", fontWeight: 700 }}
              >
                Premium Cycling &mdash; Since 2019
              </p>
              <h1 className="relative z-10">
                {section.headline.replace(/\.$/, "")}
                <span className="text-[#FF4F00]">.</span>
              </h1>
            </div>
            <div className="mt-12">
              {section.subheadline && (
                <p
                  className="text-[#6B6B6B] max-w-[320px] mb-8"
                  style={{ lineHeight: 1.6 }}
                >
                  {section.subheadline}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {section.primaryCTA && (
                  <Link
                    href={section.primaryCTA.href}
                    className="inline-flex items-center gap-3 bg-[#121212] text-[#F9F9F7] px-8 py-4 uppercase tracking-[0.1em] hover:bg-[#FF4F00] transition-colors"
                    style={{ fontSize: "0.75rem", fontWeight: 700 }}
                  >
                    {section.primaryCTA.label}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                {section.secondaryCTA && (
                  <Link
                    href={section.secondaryCTA.href}
                    className="inline-flex items-center gap-3 border border-[#121212] px-8 py-4 uppercase tracking-[0.1em] hover:bg-[#121212] hover:text-[#F9F9F7] transition-colors"
                    style={{ fontSize: "0.75rem", fontWeight: 700 }}
                  >
                    {section.secondaryCTA.label}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="lg:col-span-5 relative w-full h-full lg:max-h-[calc(100vh-120px)]">
            <img
              src={mediaUrl}
              alt={section.headline}
              className="object-cover w-full h-full"
            />
            {section.mediaText && (
              <div className="absolute bottom-0 left-0 bg-[#FF4F00] text-white px-6 py-3">
                <p
                  className="uppercase tracking-[0.15em]"
                  style={{ fontSize: "0.65rem", fontWeight: 700 }}
                >
                  {section.mediaText}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // No image: full-width dark hero
  return (
    <section className="border-b border-[#121212] bg-[#121212] min-h-[60vh] flex items-center">
      <div className="p-8 md:p-16 lg:p-24 w-full">
        <p
          className="uppercase tracking-[0.2em] text-[#F9F9F7]/50 mb-6"
          style={{ fontSize: "0.65rem", fontWeight: 700 }}
        >
          Premium Cycling &mdash; Since 2019
        </p>
        <h1 className="text-[#F9F9F7] mb-8 max-w-3xl">
          {section.headline.replace(/\.$/, "")}
          <span className="text-[#FF4F00]">.</span>
        </h1>
        {section.subheadline && (
          <p
            className="text-[#F9F9F7]/70 max-w-lg mb-10"
            style={{ lineHeight: 1.6 }}
          >
            {section.subheadline}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {section.primaryCTA && (
            <Link
              href={section.primaryCTA.href}
              className="inline-flex items-center gap-3 bg-[#FF4F00] text-white px-8 py-4 uppercase tracking-[0.1em] hover:bg-[#FF4F00]/90 transition-colors"
              style={{ fontSize: "0.75rem", fontWeight: 700 }}
            >
              {section.primaryCTA.label}
            </Link>
          )}
          {section.secondaryCTA && (
            <Link
              href={section.secondaryCTA.href}
              className="inline-flex items-center gap-3 border border-[#F9F9F7]/40 text-[#F9F9F7] px-8 py-4 uppercase tracking-[0.1em] hover:border-[#F9F9F7] transition-colors"
              style={{ fontSize: "0.75rem", fontWeight: 700 }}
            >
              {section.secondaryCTA.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
