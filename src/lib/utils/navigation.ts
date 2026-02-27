import type { GetNavigationQuery } from "@/types/hygraph-generated";
import type { Locale } from "@/lib/utils/locale";

export type NavItem = GetNavigationQuery["navigations"][0]["items"][0];

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
