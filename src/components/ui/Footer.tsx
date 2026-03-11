import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/utils/locale";
import { buildHref } from "@/lib/utils/navigation";
import { formatCategoryValue } from "@/types/hybike";
import type { GetSiteSettingsQuery } from "@/types/hygraph-generated";
import {
  createPreviewAttributes,
  createComponentChainLink,
} from "@hygraph/preview-sdk/core";

interface FooterProps {
  locale: Locale;
  siteSettings: GetSiteSettingsQuery["allSiteSettings"][0] | null;
  bikeCategories: string[];
}

export default function Footer({
  locale,
  siteSettings,
  bikeCategories,
}: FooterProps) {
  const footerNavItems = siteSettings?.footerNavigation?.items ?? [];
  const footerNavId = siteSettings?.footerNavigation?.id;
  const socialLinks = siteSettings?.socialLinks ?? [];
  const settingsId = siteSettings?.id;
  return (
    <footer className="border-t border-secondary/20 bg-primary text-secondary">
      {/* Newsletter + Links */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-secondary/20">
        <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-secondary/20">
          <h3
            {...(settingsId ? createPreviewAttributes({ entryId: settingsId, fieldApiId: "footerSubscribeTitle" }) : {})}
            className="text-secondary mb-4"
          >
            {siteSettings?.footerSubscribeTitle}
          </h3>
          <p
            {...(settingsId ? createPreviewAttributes({ entryId: settingsId, fieldApiId: "footerSubscribeSubtitle" }) : {})}
            className="text-secondary/60 mb-6"
            style={{ lineHeight: 1.6 }}
          >
            {siteSettings?.footerSubscribeSubtitle}
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-secondary/30 px-4 py-3 text-secondary placeholder-secondary/30 focus:outline-hidden focus:border-accent"
            />
            <button
              className="bg-accent text-white px-6 py-3 uppercase tracking-[0.1em] hover:bg-accent/90 transition-colors"
              style={{ fontSize: "0.75rem", fontWeight: 700 }}
            >
              Subscribe
            </button>
          </div>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3">
          {/* Shop */}
          <div className="p-8 border-b sm:border-b-0 border-r border-secondary/20">
            <p
              className="uppercase tracking-[0.15em] text-secondary/40 mb-6"
              style={{ fontSize: "0.65rem", fontWeight: 700 }}
            >
              Shop
            </p>
            <div className="space-y-3">
              {bikeCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/collection?category=${cat}`}
                  className="block text-secondary/70 hover:text-accent transition-colors"
                  style={{ fontSize: "0.8rem" }}
                >
                  {formatCategoryValue(cat)}
                </Link>
              ))}
            </div>
          </div>

          {/* CMS nav links */}
          <div className="p-8 border-b sm:border-b-0 sm:border-r border-secondary/20">
            <p
              className="uppercase tracking-[0.15em] text-secondary/40 mb-6"
              style={{ fontSize: "0.65rem", fontWeight: 700 }}
            >
              Company
            </p>
            <div className="space-y-3">
              {footerNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={buildHref(item, locale)}
                  className="block text-secondary/70 hover:text-accent transition-colors"
                  style={{ fontSize: "0.8rem" }}
                >
                  <span
                    {...(footerNavId ? createPreviewAttributes({
                      entryId: footerNavId,
                      fieldApiId: "label",
                      componentChain: [createComponentChainLink("items", item.id)],
                    }) : {})}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="p-8 col-span-2 sm:col-span-1">
            <p
              className="tracking-[0.15em] text-secondary/40 mb-6"
              style={{ fontSize: "0.65rem", fontWeight: 700 }}
            >
              Social
            </p>
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-secondary/70 hover:text-accent transition-colors"
                  style={{ fontSize: "0.8rem" }}
                >
                  <span
                    {...(settingsId ? createPreviewAttributes({
                      entryId: settingsId,
                      fieldApiId: "platform",
                      componentChain: [createComponentChainLink("socialLinks", link.id)],
                    }) : {})}
                    className="lowercase [&::first-letter]:uppercase"
                  >
                    {link.platform}
                  </span>
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom watermark */}
      <div className="flex flex-col items-center justify-between px-8 md:px-12 py-6 gap-4">
        <span
          {...(settingsId ? createPreviewAttributes({ entryId: settingsId, fieldApiId: "siteName" }) : {})}
          className="tracking-[-0.05em] uppercase opacity-20 leading-[0.9]"
          style={{ fontWeight: 900, fontSize: "clamp(3rem, 20vw, 16rem)" }}
        >
          {siteSettings?.siteName}
          <span className="text-accent">.</span>
        </span>
        <p
          {...(settingsId ? createPreviewAttributes({ entryId: settingsId, fieldApiId: "footerText" }) : {})}
          className="text-secondary/40"
          style={{ fontSize: "0.8rem" }}
        >
          {siteSettings?.footerText?.text}
        </p>
        <a
          href="https://github.com/hygraph/hybike-starter"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-secondary/40 hover:text-accent transition-colors mt-4"
          style={{ fontSize: "0.8rem" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>View on GitHub</span>
        </a>
      </div>
    </footer>
  );
}
