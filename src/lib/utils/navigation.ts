import type { GetNavigationQuery, GetSiteSettingsQuery } from "@/types/hygraph-generated";
import type { Locale } from "@/lib/utils/locale";

type SiteSettingsNavItem = NonNullable<
  GetSiteSettingsQuery["allSiteSettings"][0]["footerNavigation"]
>["items"][0];

export type NavItem =
  | GetNavigationQuery["navigations"][0]["items"][0]
  | SiteSettingsNavItem;

export function buildHref(item: NavItem, locale: Locale): string {
  if (item.linkType === "EXTERNAL" && item.externalUrl) {
    if (
      item.externalUrl.startsWith("http://") ||
      item.externalUrl.startsWith("https://")
    ) {
      return item.externalUrl;
    }

    return `/${locale}/${item.externalUrl}`;
  }

  if (item.linkType === "PAGE" && item.pageLink) {
    return `/${locale}/${item.pageLink.slug}`;
  }

  return "#";
}
